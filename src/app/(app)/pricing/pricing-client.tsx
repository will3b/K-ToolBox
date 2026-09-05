'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Loader2,
  Sparkles,
  ArrowLeft,
  CreditCard,
  Zap,
  Infinity,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useProStatus } from '@/hooks/use-pro-status';
import { cn } from '@/lib/utils';
import { usePostHog } from 'posthog-js/react';
import { track } from '@/lib/analytics';

const PRICE_MONTHLY = 9;
const STRIPE_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_placeholder';
const LEMONSQUEEZY_VARIANT_ID = process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ID || '';

export function PricingClient() {
  const searchParams = useSearchParams();
  const successProvider = searchParams.get('success');
  const cancelled = searchParams.get('cancelled');
  const [provider, setProvider] = useState<'stripe' | 'lemonsqueezy'>('stripe');
  const [email, setEmail] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const { isPro, loading: proLoading, activate, email: proEmail } = useProStatus();
  const posthog = usePostHog();

  // Track pricing page view
  useEffect(() => { track(posthog, 'pricing_page_viewed'); }, [posthog]);
  const [activateEmail, setActivateEmail] = useState('');
  const [activateLoading, setActivateLoading] = useState(false);
  const [activateResult, setActivateResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleCheckout = async () => {
    if (!email.trim()) return;
    setCheckoutLoading(true);
    setCheckoutError('');

    try {
      const endpoint = provider === 'stripe'
        ? '/api/checkout/stripe'
        : '/api/checkout/lemonsqueezy';

      const body = provider === 'stripe'
        ? { email: email.trim(), priceId: STRIPE_PRICE_ID }
        : { email: email.trim(), variantId: LEMONSQUEEZY_VARIANT_ID };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setCheckoutError(data.error || 'Something went wrong.');
        return;
      }

      if (data.url) {
        track(posthog, 'checkout_started', { provider });
        window.location.href = data.url;
      }
    } catch {
      setCheckoutError('Network error. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!activateEmail.trim()) return;
    setActivateLoading(true);
    setActivateResult(null);

    try {
      const data = await activate(activateEmail.trim());
      setActivateResult({
        ok: data.isPro,
        message: data.isPro ? 'Pro activated! You now have unlimited access.' : data.message || 'No active Pro account found.',
      });
      if (data.isPro) {
        track(posthog, 'pro_activated', { method: 'email_activation' });
      }
    } catch {
      setActivateResult({ ok: false, message: 'Something went wrong. Try again.' });
    } finally {
      setActivateLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to tools
        </a>

        {/* Success banner */}
        {successProvider && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 mb-8"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-[13px] font-medium text-foreground">Payment successful!</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Your Pro account is active. Enter your email below to activate unlimited access.
              </p>
            </div>
          </motion.div>
        )}

        {/* Cancelled banner */}
        {cancelled && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-md border border-amber-500/20 bg-amber-500/5 px-4 py-3 mb-8"
          >
            <X className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-[13px] font-medium text-foreground">Payment cancelled</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                No worries. You can try again anytime.
              </p>
            </div>
          </motion.div>
        )}

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight text-foreground mb-1.5">
            Upgrade to Pro
          </h1>
          <p className="text-[13px] text-muted-foreground leading-relaxed max-w-lg">
            Remove daily limits and get unlimited access to all writing tools.
            One payment, no subscription.
          </p>
        </div>

        {/* Pro status check */}
        {isPro ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-foreground">You have Pro</p>
                <p className="text-[12px] text-muted-foreground">{proEmail}</p>
              </div>
            </div>
            <p className="text-[13px] text-muted-foreground">
              Unlimited generations are active. No limits on any tool.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Pricing card */}
            <div className="rounded-lg border border-border overflow-hidden mb-8">
              <div className="p-5 border-b border-border">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-[15px] font-semibold text-foreground">K-ToolBox Pro</h2>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold tracking-tight text-foreground">${PRICE_MONTHLY}</span>
                    <span className="text-[12px] text-muted-foreground">one-time</span>
                  </div>
                </div>
                <p className="text-[12px] text-muted-foreground">
                  No subscription. Pay once, use forever.
                </p>
              </div>

              <div className="p-5 space-y-3">
                {[
                  { icon: Infinity, label: 'Unlimited generations on all 30 tools' },
                  { icon: Zap, label: 'No daily limits, no waiting' },
                  { icon: CreditCard, label: 'One-time payment, no recurring charges' },
                  { icon: Check, label: 'Priority support' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <feature.icon className="w-4 h-4 text-foreground/60" strokeWidth={1.5} />
                    <span className="text-[13px] text-foreground">{feature.label}</span>
                  </div>
                ))}
              </div>

              {/* Provider toggle */}
              <div className="px-5 py-3 border-t border-border bg-muted/30">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-2.5">
                  Pay with
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setProvider('stripe'); setCheckoutError(''); }}
                    className={cn(
                      'flex-1 h-9 rounded-md text-[13px] font-medium border transition-colors cursor-pointer',
                      provider === 'stripe'
                        ? 'bg-foreground text-primary-foreground border-foreground'
                        : 'bg-background text-muted-foreground border-border hover:border-foreground/20',
                    )}
                  >
                    Stripe
                  </button>
                  <button
                    onClick={() => { setProvider('lemonsqueezy'); setCheckoutError(''); }}
                    className={cn(
                      'flex-1 h-9 rounded-md text-[13px] font-medium border transition-colors cursor-pointer',
                      provider === 'lemonsqueezy'
                        ? 'bg-foreground text-primary-foreground border-foreground'
                        : 'bg-background text-muted-foreground border-border hover:border-foreground/20',
                    )}
                  >
                    LemonSqueezy
                  </button>
                </div>
              </div>

              {/* Email + checkout */}
              <div className="p-5 pt-4 space-y-3">
                <div className="space-y-1.5">
                  <label htmlFor="checkout-email" className="block text-[12px] font-medium text-foreground">
                    Email address
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setCheckoutError(''); }}
                    placeholder="you@example.com"
                    disabled={checkoutLoading}
                    className={cn(
                      'w-full h-9 rounded-md border border-input bg-background px-3 text-[13px] text-foreground',
                      'placeholder:text-muted-foreground/50 transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring',
                      'disabled:opacity-50',
                    )}
                  />
                  <p className="text-[11px] text-muted-foreground/60">
                    Used to activate your Pro account after payment.
                  </p>
                </div>

                <AnimatePresence>
                  {checkoutError && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[12px] text-destructive"
                    >
                      {checkoutError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading || !email.trim()}
                  className={cn(
                    'w-full h-9 rounded-md text-[13px] font-medium transition-all cursor-pointer',
                    'bg-foreground text-primary-foreground hover:bg-foreground/90',
                    'disabled:opacity-40 disabled:cursor-not-allowed',
                  )}
                >
                  {checkoutLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Redirecting to {provider === 'stripe' ? 'Stripe' : 'LemonSqueezy'}...
                    </span>
                  ) : (
                    'Buy Pro - $' + PRICE_MONTHLY
                  )}
                </button>
              </div>
            </div>

            {/* Already purchased? Activate section */}
            <div className="border-t border-border pt-8">
              <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-3">
                Already purchased?
              </p>
              <div className="rounded-md border border-border p-4 space-y-3">
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  If you already bought Pro, enter the email you used during checkout
                  to activate unlimited access on this device.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={activateEmail}
                    onChange={(e) => { setActivateEmail(e.target.value); setActivateResult(null); }}
                    placeholder="your@email.com"
                    disabled={activateLoading}
                    className={cn(
                      'flex-1 h-8 rounded-md border border-input bg-background px-3 text-[13px] text-foreground',
                      'placeholder:text-muted-foreground/50 transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring',
                      'disabled:opacity-50',
                    )}
                    onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
                  />
                  <button
                    onClick={handleActivate}
                    disabled={activateLoading || !activateEmail.trim()}
                    className={cn(
                      'h-8 px-3 rounded-md text-[12px] font-medium border transition-colors cursor-pointer',
                      'bg-foreground text-primary-foreground border-foreground hover:bg-foreground/90',
                      'disabled:opacity-40 disabled:cursor-not-allowed',
                    )}
                  >
                    {activateLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      'Activate'
                    )}
                  </button>
                </div>
                <AnimatePresence>
                  {activateResult && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        'text-[12px]',
                        activateResult.ok ? 'text-emerald-600' : 'text-amber-600',
                      )}
                    >
                      {activateResult.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}

        {/* FAQ */}
        <div className="mt-12 pt-8 border-t border-border space-y-4">
          <h2 className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-3">
            FAQ
          </h2>
          <div className="space-y-4 text-[13px]">
            <div>
              <p className="font-medium text-foreground mb-1">Is this a subscription?</p>
              <p className="text-muted-foreground leading-relaxed">
                No. It is a one-time payment. You pay $9 once and get unlimited access forever.
                No recurring charges, no surprises.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">What happens after I pay?</p>
              <p className="text-muted-foreground leading-relaxed">
                After payment, you will be redirected back here. Enter the same email
                you used during checkout to activate Pro on this device. You can activate
                on multiple devices.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">What if I switch devices?</p>
              <p className="text-muted-foreground leading-relaxed">
                Go to the pricing page on any device, enter your email in the
                &ldquo;Already purchased?&rdquo; section, and click Activate. Your Pro status
                follows your email.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Can I get a refund?</p>
              <p className="text-muted-foreground leading-relaxed">
                Yes. If you are not satisfied, contact support within 14 days for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
