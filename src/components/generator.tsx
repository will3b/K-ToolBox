'use client';

import { useState, useCallback, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Copy, Check, RefreshCw, Sparkles, Zap, Crown } from 'lucide-react';
import type { ToolConfig } from '@/lib/tools';

/* Accept either full ToolConfig or client-serialized version (without icon/gradient) */
type GeneratorTool = Omit<ToolConfig, 'icon' | 'gradient'>;
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useProStatus } from '@/hooks/use-pro-status';
import { usePostHog } from 'posthog-js/react';
import { track } from '@/lib/analytics';

interface GeneratorProps {
  tool: GeneratorTool;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  autoFocus?: boolean;
}

export interface GeneratorHandle {
  focusInput: () => void;
}

function ResultList({ results, copiedIdx, onCopy }: {
  results: string[];
  copiedIdx: number | null;
  onCopy: (text: string, idx: number) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
        {results.length} results
      </p>
      <div className="border border-border rounded-md overflow-hidden">
        {results.map((result, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.03, duration: 0.15 }}
            className={cn(
              'group flex items-start gap-3 px-4 py-3',
              'hover:bg-muted/50 transition-colors duration-100',
              idx < results.length - 1 && 'border-b border-border',
            )}
          >
            <span className="text-[11px] text-muted-foreground/40 font-mono mt-px shrink-0 w-4 text-right select-none">
              {idx + 1}
            </span>
            <p className="flex-1 min-w-0 text-[13px] leading-relaxed text-foreground whitespace-pre-line">
              {result}
            </p>
            <button
              onClick={() => onCopy(result, idx)}
              className={cn(
                'shrink-0 mt-px w-7 h-7 inline-flex items-center justify-center rounded-md',
                'transition-all duration-100 cursor-pointer',
                copiedIdx === idx
                  ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10'
                  : 'text-muted-foreground/40 hover:text-foreground hover:bg-accent opacity-0 group-hover:opacity-100',
              )}
              aria-label="Copy result"
            >
              {copiedIdx === idx ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-16 flex flex-col items-center text-center">
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
        <Sparkles className="w-5 h-5 text-muted-foreground/40" />
      </div>
      <p className="text-[13px] font-medium text-foreground mb-1">
        Ready to generate
      </p>
      <p className="text-[12px] text-muted-foreground max-w-xs">
        Describe what you need above, pick a style, and click Generate.
        Results will appear here.
      </p>
    </div>
  );
}

export const Generator = forwardRef<GeneratorHandle, GeneratorProps>(
  function Generator({ tool, inputRef: externalRef, autoFocus }, ref) {
    const [input, setInput] = useState('');
    const [tone, setTone] = useState(tool.defaultTone);
    const [results, setResults] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
    const [remaining, setRemaining] = useState<number | null>(null);
    const [hasGenerated, setHasGenerated] = useState(false);
    const { isPro } = useProStatus();
    const posthog = usePostHog();
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = externalRef || internalRef;

    useImperativeHandle(ref, () => ({
      focusInput: () => textareaRef.current?.focus(),
    }));

    useEffect(() => {
      if (autoFocus) {
        const timer = setTimeout(() => textareaRef.current?.focus(), 100);
        return () => clearTimeout(timer);
      }
    }, [autoFocus, textareaRef]);

    const handleGenerate = useCallback(async () => {
      if (!input.trim()) {
        setError('Describe what you need \u2014 even a few words works.');
        return;
      }

      setLoading(true);
      setError('');
      setResults([]);
      const isRegen = hasGenerated;

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolSlug: tool.slug, input: input.trim(), tone }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Something went wrong. Try again.');
          if (res.status === 429) {
            setRemaining(0);
            track(posthog, 'rate_limit_hit', { tool: tool.slug });
          }
          return;
        }

        setResults(data.results || []);
        if (data.remaining !== undefined) {
          setRemaining(data.isPro ? null : data.remaining);
        }
        setHasGenerated(true);
        track(posthog, isRegen ? 'tool_regenerated' : 'tool_generated', {
          tool: tool.slug,
          tone,
          isPro: !!data.isPro,
          resultCount: (data.results || []).length,
        });
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    }, [input, tone, tool.slug, hasGenerated, posthog]);

    const handleCopy = useCallback(async (text: string, idx: number) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        toast({ title: 'Copied to clipboard' });
        setTimeout(() => setCopiedIdx(null), 1500);
        track(posthog, 'tool_copied', {
          tool: tool.slug,
          resultIndex: idx,
          tone,
          isPro: !!isPro,
        });
      } catch {
        toast({
          title: 'Copy failed',
          description: 'Select the text manually.',
          variant: 'destructive',
        });
      }
    }, [tool.slug, tone, isPro, posthog]);

    const showResults = results.length > 0;
    const showEmpty = !loading && !hasGenerated && !showResults;
    const showNoResults = !loading && hasGenerated && !showResults;

    return (
      <div className="space-y-6">
        {/* Rate limit banner */}
        {remaining === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between rounded-md border border-amber-500/20 bg-amber-500/5 px-4 py-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Zap className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <p className="text-[13px] font-medium text-foreground">Daily limit reached</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  You&apos;ve used all 5 free generations for this tool today.
                  Come back tomorrow or upgrade to Pro for unlimited access.
                </p>
              </div>
            </div>
            <a
              href="/pricing"
              onClick={() => track(posthog, 'rate_limit_upgrade_click', { tool: tool.slug })}
              className="shrink-0 ml-4 h-7 px-3 rounded-md bg-foreground text-primary-foreground text-[12px] font-medium hover:bg-foreground/90 transition-colors inline-flex items-center"
            >
              Upgrade
            </a>
          </motion.div>
        )}

        {/* Input section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="gen-input"
              className="block text-[13px] font-medium text-foreground"
            >
              {tool.inputLabel}
            </label>
            <textarea
              ref={textareaRef}
              id="gen-input"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError('');
              }}
              placeholder={tool.placeholder}
              className={cn(
                'w-full min-h-[88px] resize-none rounded-md border border-input bg-background px-3 py-2.5',
                'text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground/50',
                'transition-colors duration-150',
                'focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
              maxLength={500}
              disabled={loading || remaining === 0}
            />
            <p className="text-[12px] text-muted-foreground/60">
              {tool.inputHint}
            </p>
          </div>

          {/* Tone selector */}
          <div className="space-y-2">
            <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
              Style
            </p>
            <div className="flex flex-wrap gap-1">
              {tool.tones.map((t) => {
                const isActive = tone === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => {
                      setTone(t.value);
                      track(posthog, 'tool_tone_changed', { tool: tool.slug, tone: t.value, previousTone: tone });
                    }}
                    disabled={loading || remaining === 0}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium',
                      'transition-colors duration-100 cursor-pointer border',
                      'disabled:opacity-50 disabled:pointer-events-none',
                      isActive
                        ? 'bg-foreground text-primary-foreground border-foreground'
                        : 'bg-background text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground',
                    )}
                  >
                    <span className="text-[11px]">{t.emoji}</span>
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions row */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim() || remaining === 0}
              className={cn(
                'inline-flex items-center gap-2 h-8 px-4 rounded-md text-[13px] font-medium',
                'transition-all duration-150 cursor-pointer',
                'bg-foreground text-primary-foreground',
                'hover:bg-foreground/90',
                'disabled:opacity-40 disabled:cursor-not-allowed',
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </button>

            {hasGenerated && (
              <button
                onClick={handleGenerate}
                disabled={loading || remaining === 0}
                className={cn(
                  'inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[12px]',
                  'text-muted-foreground hover:text-foreground hover:bg-accent',
                  'transition-colors duration-100 cursor-pointer',
                  'disabled:opacity-40 disabled:pointer-events-none',
                )}
              >
                <RefreshCw className={cn('w-3 h-3', loading && 'animate-spin')} />
                Regenerate
              </button>
            )}

            {isPro && (
              <span className="ml-auto inline-flex items-center gap-1 text-[12px] text-emerald-600">
                <Crown className="w-3 h-3" />
                Pro
              </span>
            )}
            {!isPro && remaining !== null && remaining > 0 && (
              <span className="ml-auto text-[12px] text-muted-foreground/50 tabular-nums">
                {remaining}/{5} remaining today
              </span>
            )}
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="text-[13px] text-destructive bg-destructive/5 border border-destructive/10 rounded-md px-3 py-2">
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results area */}
        <div>
          <AnimatePresence mode="wait">
            {showResults && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ResultList results={results} copiedIdx={copiedIdx} onCopy={handleCopy} />
              </motion.div>
            )}
          </AnimatePresence>

          {showEmpty && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.2 }}
            >
              <EmptyState />
            </motion.div>
          )}

          {showNoResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <p className="text-[13px] text-muted-foreground">
                No results generated yet. Try adjusting your input or style.
              </p>
            </motion.div>
          )}
        </div>

        {/* Tips */}
        {!hasGenerated && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3 pt-2"
          >
            <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
              Tips
            </p>
            <div className="border border-border rounded-md divide-y divide-border">
              {tool.tips.map((tip, i) => (
                <div key={i} className="flex gap-3 px-4 py-2.5">
                  <span className="text-[11px] text-muted-foreground/30 font-mono mt-px shrink-0 w-4 text-right select-none">
                    {i + 1}
                  </span>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  }
);
