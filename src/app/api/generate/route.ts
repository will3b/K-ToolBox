import { NextRequest, NextResponse } from 'next/server';
import { getToolBySlug } from '@/lib/tools';
import { PRO_COOKIE_NAME, verifyProToken } from '@/lib/pro-check';
import { db } from '@/lib/db';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const FREE_DAILY_LIMIT = 5;
const WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_RATE_LIMIT_ENTRIES = 10000;

// Periodic cleanup of expired rate limit entries to prevent memory leaks
let lastCleanup = Date.now();
function cleanupRateLimits() {
  const now = Date.now();
  if (now - lastCleanup < 60 * 1000) return; // run at most once per minute
  lastCleanup = now;

  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }

  // If map still exceeds safety cap, trim oldest entries
  if (rateLimitMap.size > MAX_RATE_LIMIT_ENTRIES) {
    const keys = Array.from(rateLimitMap.keys()).slice(0, 1000);
    for (const key of keys) {
      rateLimitMap.delete(key);
    }
  }
}

// In-memory cache for active AI config (30 seconds TTL)
let cachedAiConfig: {
  provider: string;
  baseUrl: string;
  apiKey: string;
  model: string | null;
  cachedAt: number;
} | null = null;

async function getCachedAiConfig() {
  const now = Date.now();
  if (cachedAiConfig && now - cachedAiConfig.cachedAt < 30 * 1000) {
    return cachedAiConfig;
  }

  const config = await db.aiConfig.findFirst({ where: { isActive: true } });
  if (!config) return null;

  cachedAiConfig = {
    provider: config.provider,
    baseUrl: config.baseUrl,
    apiKey: config.apiKey,
    model: config.model,
    cachedAt: now,
  };
  return cachedAiConfig;
}

async function isProRequest(request: NextRequest): Promise<boolean> {
  try {
    const token = request.cookies.get(PRO_COOKIE_NAME)?.value;
    const email = verifyProToken(token);
    if (!email) return false;

    const proUser = await db.proUser.findUnique({ where: { email } });
    return proUser?.isActive === true;
  } catch {
    return false;
  }
}

function checkRateLimit(toolSlug: string, ip: string): { allowed: boolean; remaining: number } {
  cleanupRateLimits();

  const key = `${ip}:${toolSlug}`;
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: FREE_DAILY_LIMIT - 1 };
  }

  if (entry.count >= FREE_DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: FREE_DAILY_LIMIT - entry.count };
}

async function callAi(
  systemPrompt: string,
  userPrompt: string,
  config: { provider: string; baseUrl: string; apiKey: string; model?: string | null }
): Promise<string> {
  const cleanBaseUrl = config.baseUrl.replace(/\/+$/, '');
  const isAnthropic = config.provider === 'anthropic' || cleanBaseUrl.includes('anthropic.com');

  if (isAnthropic) {
    const response = await fetch(`${cleanBaseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.model || 'claude-3-5-haiku-20241022',
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        max_tokens: 1024,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`AI service responded with error status ${response.status}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || '';
  }

  const response = await fetch(`${cleanBaseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(`AI service responded with error status ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolSlug, input, tone } = body;

    if (!toolSlug || typeof toolSlug !== 'string' || !input || typeof input !== 'string' || !tone || typeof tone !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid required fields: toolSlug, input, tone' },
        { status: 400 },
      );
    }

    if (input.trim().length > 500) {
      return NextResponse.json(
        { error: 'Input too long. Please keep it under 500 characters.' },
        { status: 400 },
      );
    }

    const tool = getToolBySlug(toolSlug);
    if (!tool) {
      return NextResponse.json(
        { error: 'Unknown tool' },
        { status: 404 },
      );
    }

    // Load AI config from cache/database
    const aiConfig = await getCachedAiConfig();
    if (!aiConfig) {
      return NextResponse.json(
        { error: 'AI is not configured. Ask the admin to set up an AI provider in Settings.' },
        { status: 503 },
      );
    }

    const isPro = await isProRequest(request);
    let remaining = -1;

    if (!isPro) {
      // Extract IP (handling HAProxy / Reverse Proxy X-Forwarded-For)
      const forwarded = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
      const ip = forwarded.split(',')[0].trim();
      const result = checkRateLimit(toolSlug, ip);

      if (!result.allowed) {
        return NextResponse.json(
          { error: 'Daily limit reached. Come back tomorrow or upgrade to Pro for unlimited access.', remaining: 0 },
          { status: 429 },
        );
      }

      remaining = result.remaining;
    }

    const userPrompt = tool.userPromptTemplate
      .replace('{tone}', tone)
      .replace('{input}', input.trim());

    const raw = await callAi(tool.systemPrompt, userPrompt, {
      provider: aiConfig.provider,
      baseUrl: aiConfig.baseUrl,
      apiKey: aiConfig.apiKey,
      model: aiConfig.model,
    });

    const cleanRaw = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let results: string[];

    if (tool.plainTextResult) {
      results = [cleanRaw];
    } else {
      try {
        results = JSON.parse(cleanRaw);
        if (!Array.isArray(results)) throw new Error('Not an array');
      } catch {
        results = raw
          .split('\n')
          .map((line: string) => line.replace(/^\d+\.\s*/, '').replace(/^["']|["']$/g, '').trim())
          .filter((line: string) => line.length > 0);
      }
    }

    results = results.slice(0, tool.resultCount).map((r: string) => r.trim()).filter(Boolean);

    if (results.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate results. Please try again with more details.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ results, remaining, isPro });
  } catch (error) {
    console.error('Generation error:', error);
    const message = error instanceof Error && error.name === 'TimeoutError'
      ? 'AI generation timed out. Please try again.'
      : 'Something went wrong while generating. Please try again.';
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}

