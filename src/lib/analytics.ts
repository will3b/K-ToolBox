import type { PostHog } from 'posthog-js';

/**
 * Centralized analytics utility.
 * All custom events should go through here so they're easy to find, audit, and modify.
 *
 * Usage in components:
 *   import { usePostHog } from 'posthog-js/react';
 *   import { track } from '@/lib/analytics';
 *   const posthog = usePostHog();
 *   track(posthog, 'event_name', { prop: 'value' });
 */

export function track(
  posthog: PostHog | null | undefined,
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>,
) {
  if (!posthog) return;
  try {
    posthog.capture(event, properties);
  } catch {
    // Silently fail — analytics should never break the app
  }
}

/**
 * All custom analytics events used in the app.
 * Keep this as a union type so TypeScript enforces correct event names.
 */
export type AnalyticsEvent =
  /* ── Tool usage ── */
  | 'tool_generated'           // User clicked Generate and got results
  | 'tool_copied'              // User copied a result
  | 'tool_regenerated'         // User clicked Regenerate
  | 'tool_tone_changed'        // User changed the tone selector
  | 'tool_page_viewed'         // User visited a tool page
  /* ── Rate limiting ── */
  | 'rate_limit_hit'           // Free user hit daily limit
  | 'rate_limit_upgrade_click' // Clicked Upgrade from rate limit banner
  /* ── Navigation ── */
  | 'sidebar_tool_click'       // Clicked a tool in sidebar
  | 'sidebar_home_click'       // Clicked home/logo in sidebar
  | 'command_palette_opened'   // Opened Cmd+K palette
  | 'command_palette_used'     // Selected a tool from Cmd+K
  | 'homepage_tool_click'      // Clicked a tool card on homepage
  | 'homepage_cta_click'       // Clicked a CTA button on homepage
  /* ── Monetization ── */
  | 'pricing_page_viewed'      // Visited /pricing
  | 'upgrade_clicked'          // Clicked Upgrade to Pro (sidebar/footer)
  | 'checkout_started'         // Initiated Stripe or LemonSqueezy checkout
  | 'pro_activated'            // Successfully activated Pro (email or payment)
  /* ── UI ── */
  | 'theme_toggled'            // Toggled light/dark theme
  | 'sidebar_collapsed'        // Collapsed/expanded sidebar
  | 'mobile_menu_opened'       // Opened mobile sidebar drawer
  ;
