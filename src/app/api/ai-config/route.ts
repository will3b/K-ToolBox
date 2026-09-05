import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

const SETTINGS_PASSWORD = process.env.SETTINGS_PASSWORD || 'admin';

/** Verify the admin password from Authorization header using constant-time comparison */
function isAuthenticated(request: NextRequest): boolean {
  const auth = request.headers.get('authorization');
  if (!auth) return false;
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
  
  if (!token || !SETTINGS_PASSWORD) return false;
  
  const tokenBuf = Buffer.from(token);
  const passBuf = Buffer.from(SETTINGS_PASSWORD);

  if (tokenBuf.length !== passBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(tokenBuf, passBuf);
}

/** GET /api/ai-config — return active config (apiKey masked) */
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const config = await db.aiConfig.findFirst({ where: { isActive: true } });
    if (!config) {
      return NextResponse.json({ configured: false });
    }

    // Mask the API key for security — only show last 4 chars
    const maskedKey = config.apiKey.length > 8
      ? '*'.repeat(config.apiKey.length - 4) + config.apiKey.slice(-4)
      : '****';

    return NextResponse.json({
      configured: true,
      provider: config.provider,
      baseUrl: config.baseUrl,
      apiKey: maskedKey,
      model: config.model,
    });
  } catch (error) {
    console.error('AI config read error:', error);
    return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
  }
}

/** PUT /api/ai-config — save or update AI provider config in a transaction */
export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { provider, baseUrl, apiKey, model } = body;

    if (!provider || typeof provider !== 'string' || !baseUrl || typeof baseUrl !== 'string' || !apiKey || typeof apiKey !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid required fields: provider, baseUrl, apiKey' },
        { status: 400 },
      );
    }

    // Atomically deactivate existing configs and create the new active config
    const config = await db.$transaction(async (tx) => {
      await tx.aiConfig.updateMany({ where: { isActive: true }, data: { isActive: false } });
      return tx.aiConfig.create({
        data: {
          provider: provider.trim(),
          baseUrl: baseUrl.trim(),
          apiKey: apiKey.trim(),
          model: model ? String(model).trim() : null,
          isActive: true,
        },
      });
    });

    return NextResponse.json({
      success: true,
      provider: config.provider,
      baseUrl: config.baseUrl,
      model: config.model,
    });
  } catch (error) {
    console.error('AI config save error:', error);
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
  }
}

/** POST /api/ai-config/test — test the AI connection */
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { provider, baseUrl, apiKey, model } = body;

    if (!baseUrl || !apiKey) {
      return NextResponse.json({ error: 'Missing baseUrl or apiKey' }, { status: 400 });
    }

    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    const isAnthropic = provider === 'anthropic' || cleanBaseUrl.includes('anthropic.com');
    const startTime = Date.now();

    let response: Response;

    if (isAnthropic) {
      response = await fetch(`${cleanBaseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: model || 'claude-3-5-haiku-20241022',
          messages: [{ role: 'user', content: 'Say "OK" and nothing else.' }],
          max_tokens: 10,
        }),
        signal: AbortSignal.timeout(15000),
      });
    } else {
      response = await fetch(`${cleanBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model || 'gpt-4o-mini',
          messages: [
            { role: 'user', content: 'Say "OK" and nothing else.' },
          ],
          max_tokens: 5,
        }),
        signal: AbortSignal.timeout(15000),
      });
    }

    const latency = Date.now() - startTime;
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: data.error?.message || (typeof data.error === 'string' ? data.error : `HTTP ${response.status}`),
        latency,
      });
    }

    let reply = '';
    if (isAnthropic) {
      reply = data.content?.[0]?.text || '';
    } else {
      reply = data.choices?.[0]?.message?.content || '';
    }

    const usedModel = data.model || model || 'unknown';

    return NextResponse.json({
      success: true,
      reply: reply.slice(0, 50),
      model: usedModel,
      latency,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Connection failed';
    return NextResponse.json({ success: false, error: msg }, { status: 200 });
  }
}

