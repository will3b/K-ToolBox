import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PricingClient } from './pricing-client';

export const metadata: Metadata = {
  title: 'Pricing — K-ToolBox Pro',
  description:
    'Upgrade to K-ToolBox Pro for unlimited AI writing generations. No daily limits, no paywall.',
  openGraph: {
    title: 'K-ToolBox Pro Pricing',
    description: 'Unlimited AI writing tools. No daily limits.',
    type: 'website',
  },
};

export default function PricingPage() {
  return (
    <Suspense>
      <PricingClient />
    </Suspense>
  );
}
