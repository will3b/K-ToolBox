'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect, useState } from 'react';

export function PostHogProviderWrapper({ children }: { children: React.ReactNode }) {
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      capture_pageview: true,
      persistence: 'localStorage+cookie',
      cookie_expiration: 365,
      // Respect DNT
      respect_dnt: true,
      // Disable in development
      loaded: (ph) => {
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
          ph.opt_out_capturing();
        }
      },
    });

    setHasKey(true);
  }, []);

  if (hasKey) {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
  }

  return <>{children}</>;
}

