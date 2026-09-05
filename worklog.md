---
Task ID: 1-9
Agent: Main Agent
Task: Implement all 5 remaining improvements (Structured Data, Categorization already done, Homepage already done, Analytics, Deploy)

Work Log:
- Explored full project state — discovered 3 of 5 tasks were already implemented (sitemap, categorization, homepage)
- Added WebSite + Organization JSON-LD to (app)/layout.tsx for site-wide structured data
- Added BreadcrumbList JSON-LD to all 30 tool pages (Home > Category > Tool)
- Fixed FAQPage structured data answers — previously identical to questions, now expanded with meaningful content via expandHowItWorks()
- Created centralized analytics module at src/lib/analytics.ts with typed AnalyticsEvent union and track() utility
- Added 18 custom PostHog events across 7 files: tool_generated, tool_copied, tool_regenerated, tool_tone_changed, tool_page_viewed, rate_limit_hit, rate_limit_upgrade_click, sidebar_tool_click, sidebar_home_click, command_palette_opened, command_palette_used, homepage_tool_click, homepage_cta_click, pricing_page_viewed, upgrade_clicked, checkout_started, pro_activated, theme_toggled, sidebar_collapsed, mobile_menu_opened
- Updated Caddyfile with production HTTPS config (toolbox.ai + www redirect), kept dev fallback as comments
- Created systemd service file (toolbox.service) for process management
- Created .env.example with all 13 required env vars documented
- Added collapsible sidebar categories using @radix-ui/react-collapsible with auto-open on active category
- Build verification: all 42 routes compile successfully

Stage Summary:
- All 9 sub-tasks completed and verified
- 18 analytics events now tracked across the full user journey
- 3 JSON-LD schemas per tool page (WebApplication + BreadcrumbList + FAQPage) + 2 site-level (WebSite + Organization)
- Production-ready deploy config (Caddy HTTPS + systemd + .env.example)
- Build passes clean: 42 routes (30 tools + pricing + sitemap + not-found + homepage + 5 API routes)
