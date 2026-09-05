'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  Loader2,
  Settings,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  Save,
  TestTube,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── Provider presets ── */
interface ProviderPreset {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  defaultModel: string;
  docsUrl: string;
}

const PROVIDERS: ProviderPreset[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o, GPT-4o-mini, o1, o3-mini',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    docsUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude 4 Sonnet, Claude 4 Opus, Claude 3.5 Haiku',
    baseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-sonnet-4-20250514',
    docsUrl: 'https://console.anthropic.com/settings/keys',
  },
  {
    id: 'google',
    name: 'Google AI (Gemini)',
    description: 'Gemini 2.5 Pro, Gemini 2.5 Flash, Gemini 2.0 Flash',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    defaultModel: 'gemini-2.5-flash',
    docsUrl: 'https://aistudio.google.com/app/apikey',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Access 200+ models including Claude, GPT, Llama, Mistral',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'anthropic/claude-sonnet-4',
    docsUrl: 'https://openrouter.ai/settings/keys',
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Ultra-fast inference: Llama 3.3, Mixtral, Gemma 2',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
    docsUrl: 'https://console.groq.com/keys',
  },
  {
    id: 'together',
    name: 'Together AI',
    description: 'Open-source models: Llama, Qwen, DeepSeek, Flux',
    baseUrl: 'https://api.together.xyz/v1',
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    docsUrl: 'https://api.together.xyz/settings/api-keys',
  },
  {
    id: 'custom',
    name: 'Custom / Self-hosted',
    description: 'Any OpenAI-compatible API: Ollama, vLLM, LiteLLM, etc.',
    baseUrl: '',
    defaultModel: '',
    docsUrl: '',
  },
];

export function SettingsClient() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Config form state
  const [provider, setProvider] = useState('openai');
  const [baseUrl, setBaseUrl] = useState('https://api.openai.com/v1');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [showKey, setShowKey] = useState(false);

  // Existing config
  const [existingConfig, setExistingConfig] = useState<{
    provider: string;
    baseUrl: string;
    apiKey: string;
    model: string | null;
  } | null>(null);
  const [configured, setConfigured] = useState(false);

  // Test connection
  const [testResult, setTestResult] = useState<{
    success: boolean;
    reply?: string;
    model?: string;
    latency?: number;
    error?: string;
  } | null>(null);
  const [testing, setTesting] = useState(false);

  // Save
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const authHeaders = useCallback(() => ({
    Authorization: `Bearer ${password}`,
  }), [password]);

  // Load existing config
  const loadConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/ai-config', { headers: authHeaders() });
      if (res.status === 401) return;
      const data = await res.json();
      if (data.configured) {
        setExistingConfig(data);
        setConfigured(true);
        setProvider(data.provider);
        setBaseUrl(data.baseUrl);
        setModel(data.model || '');
      }
    } catch {
      // ignore
    }
  }, [authHeaders]);

  // Login
  const handleLogin = async () => {
    if (!password.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai-config', { headers: authHeaders() });
      if (res.status === 401) {
        setError('Wrong password');
        return;
      }
      setAuthenticated(true);
      await loadConfig();
    } catch {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  // Provider change
  const handleProviderChange = (id: string) => {
    const preset = PROVIDERS.find((p) => p.id === id);
    setProvider(id);
    if (preset) {
      setBaseUrl(preset.baseUrl);
      setModel(preset.defaultModel);
    }
    setTestResult(null);
    setSaved(false);
  };

  // Test connection
  const handleTest = async () => {
    if (!baseUrl || !apiKey) {
      setTestResult({ success: false, error: 'Base URL and API key are required.' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ baseUrl, apiKey, model: model || undefined }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch {
      setTestResult({ success: false, error: 'Network error' });
    } finally {
      setTesting(false);
    }
  };

  // Save config
  const handleSave = async () => {
    if (!baseUrl || !apiKey) {
      setError('Base URL and API key are required.');
      return;
    }
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/ai-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ provider, baseUrl, apiKey, model: model || null }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save');
        return;
      }
      setSaved(true);
      await loadConfig();
    } catch {
      setError('Failed to save config');
    } finally {
      setSaving(false);
    }
  };

  // ── Login screen ──
  if (!authenticated) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-sm mx-auto">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to tools
          </a>

          <div className="mb-6">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
              <Settings className="w-5 h-5 text-foreground/60" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground mb-1">
              Admin Settings
            </h1>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Enter the admin password to access AI provider configuration.
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label htmlFor="admin-pw" className="block text-[12px] font-medium text-foreground">
                Admin password
              </label>
              <input
                id="admin-pw"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter admin password"
                disabled={loading}
                className={cn(
                  'w-full h-9 rounded-md border border-input bg-background px-3 text-[13px] text-foreground',
                  'placeholder:text-muted-foreground/50 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring',
                  'disabled:opacity-50',
                )}
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[12px] text-destructive"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              onClick={handleLogin}
              disabled={loading || !password.trim()}
              className={cn(
                'w-full h-9 rounded-md text-[13px] font-medium transition-all cursor-pointer',
                'bg-foreground text-primary-foreground hover:bg-foreground/90',
                'disabled:opacity-40 disabled:cursor-not-allowed',
              )}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Unlock settings'}
            </button>

            <p className="text-[11px] text-muted-foreground/50 text-center pt-2">
              Default password: <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">admin</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Settings screen ──
  return (
    <div className="p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to tools
        </a>

        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight text-foreground mb-1.5">
            AI Provider Settings
          </h1>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Configure which AI model powers the writing tools. Supports OpenAI, Anthropic, Google,
            OpenRouter, Groq, Together AI, and any OpenAI-compatible endpoint.
          </p>
        </div>

        {/* Current status */}
        {configured && existingConfig && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 mb-8"
          >
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-foreground">
                Active: {PROVIDERS.find((p) => p.id === existingConfig.provider)?.name || existingConfig.provider}
              </p>
              <p className="text-[12px] text-muted-foreground mt-0.5 truncate">
                {existingConfig.baseUrl} &middot; Key: {existingConfig.apiKey}
                {existingConfig.model && ` \u00b7 Model: ${existingConfig.model}`}
              </p>
            </div>
          </motion.div>
        )}

        {/* Provider selection */}
        <div className="mb-6">
          <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-3">
            Provider
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleProviderChange(p.id)}
                className={cn(
                  'flex flex-col items-start rounded-md border p-3 text-left transition-all cursor-pointer',
                  provider === p.id
                    ? 'border-foreground bg-foreground/5'
                    : 'border-border hover:border-foreground/15 hover:bg-muted/30',
                )}
              >
                <span className="text-[13px] font-medium text-foreground">{p.name}</span>
                <span className="text-[11px] text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">
                  {p.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Config form */}
        <div className="rounded-lg border border-border overflow-hidden mb-6">
          <div className="p-5 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="base-url" className="block text-[12px] font-medium text-foreground">
                Base URL
              </label>
              <input
                id="base-url"
                type="url"
                value={baseUrl}
                onChange={(e) => { setBaseUrl(e.target.value); setSaved(false); setTestResult(null); }}
                placeholder="https://api.openai.com/v1"
                className={cn(
                  'w-full h-9 rounded-md border border-input bg-background px-3 text-[13px] text-foreground font-mono',
                  'placeholder:text-muted-foreground/40 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring',
                )}
              />
              <p className="text-[11px] text-muted-foreground/60">
                The OpenAI-compatible API endpoint. Must include /v1.
              </p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="api-key" className="block text-[12px] font-medium text-foreground">
                API Key
              </label>
              <div className="relative">
                <input
                  id="api-key"
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => { setApiKey(e.target.value); setSaved(false); setTestResult(null); }}
                  placeholder="sk-..."
                  className={cn(
                    'w-full h-9 rounded-md border border-input bg-background px-3 pr-9 text-[13px] text-foreground font-mono',
                    'placeholder:text-muted-foreground/40 transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring',
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {provider !== 'custom' && PROVIDERS.find((p) => p.id === provider)?.docsUrl && (
                <p className="text-[11px] text-muted-foreground/60">
                  Get your key at{' '}
                  <a
                    href={PROVIDERS.find((p) => p.id === provider)!.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground transition-colors"
                  >
                    {PROVIDERS.find((p) => p.id === provider)!.name} Console
                  </a>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="model" className="block text-[12px] font-medium text-foreground">
                Model <span className="text-muted-foreground/40 font-normal">(optional)</span>
              </label>
              <input
                id="model"
                type="text"
                value={model}
                onChange={(e) => { setModel(e.target.value); setSaved(false); setTestResult(null); }}
                placeholder={PROVIDERS.find((p) => p.id === provider)?.defaultModel || 'gpt-4o-mini'}
                className={cn(
                  'w-full h-9 rounded-md border border-input bg-background px-3 text-[13px] text-foreground font-mono',
                  'placeholder:text-muted-foreground/40 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring',
                )}
              />
              <p className="text-[11px] text-muted-foreground/60">
                Leave empty to use the provider&apos;s default model.
              </p>
            </div>
          </div>

          <div className="px-5 py-3 border-t border-border bg-muted/30 flex items-center gap-2">
            <button
              onClick={handleTest}
              disabled={testing || !baseUrl || !apiKey}
              className={cn(
                'inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[12px] font-medium border transition-colors cursor-pointer',
                'bg-background text-foreground border-border hover:border-foreground/20',
                'disabled:opacity-40 disabled:cursor-not-allowed',
              )}
            >
              {testing ? <Loader2 className="w-3 h-3 animate-spin" /> : <TestTube className="w-3 h-3" />}
              Test connection
            </button>

            <button
              onClick={handleSave}
              disabled={saving || !baseUrl || !apiKey}
              className={cn(
                'inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[12px] font-medium transition-all cursor-pointer',
                'bg-foreground text-primary-foreground hover:bg-foreground/90',
                'disabled:opacity-40 disabled:cursor-not-allowed',
              )}
            >
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              Save
            </button>

            {saved && (
              <span className="inline-flex items-center gap-1 text-[12px] text-emerald-600 ml-2">
                <Check className="w-3 h-3" />
                Saved
              </span>
            )}
          </div>
        </div>

        <AnimatePresence>
          {testResult && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={cn(
                'flex items-center gap-3 rounded-md border px-4 py-3',
                testResult.success
                  ? 'border-emerald-500/20 bg-emerald-500/5'
                  : 'border-destructive/20 bg-destructive/5',
              )}
            >
              {testResult.success ? (
                <>
                  <Zap className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-[13px] font-medium text-foreground">
                      Connection successful
                    </p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">
                      Model: {testResult.model}{testResult.latency ? ` \u00b7 ${testResult.latency}ms` : ''}
                      {testResult.reply ? ` \u00b7 Reply: "${testResult.reply}"` : ''}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                  <div>
                    <p className="text-[13px] font-medium text-foreground">Connection failed</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{testResult.error}</p>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-[12px] text-destructive mt-4"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mt-12 pt-8 border-t border-border space-y-4">
          <h2 className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-3">
            Which provider should I use?
          </h2>
          <div className="space-y-4 text-[13px] text-muted-foreground leading-relaxed">
            <div>
              <p className="font-medium text-foreground mb-1">OpenAI</p>
              <p>Best overall quality. GPT-4o-mini is cheap and fast for short-form content like headlines and bios. GPT-4o or o3-mini for longer content like cover letters.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Anthropic (Claude)</p>
              <p>Excellent for nuanced writing. Claude follows instructions well and produces natural-sounding text. Great for cover letters and professional content.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Google (Gemini)</p>
              <p>Generous free tier. Gemini 2.5 Flash is fast and cheap. Good if you want to minimize costs during early stages.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">OpenRouter</p>
              <p>One API key for 200+ models. Lets you switch between Claude, GPT, Llama, and others without changing providers. Pay-per-use.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Groq / Together AI</p>
              <p>Ultra-fast inference on open-source models. Groq is free for light use. Together has competitive pricing. Both are good for high-volume, lower-cost generation.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Custom</p>
              <p>Use any OpenAI-compatible endpoint: Ollama (local), vLLM, LiteLLM proxy, Azure OpenAI, or any other service that implements the /chat/completions endpoint.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
