'use client';

import { useState, useEffect, useCallback } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Linkedin,
  Briefcase,
  Megaphone,
  Instagram,
  Mail,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon,
  Search,
  Crown,
  FileText,
  User,
  Play,
  BookOpen,
  Target,
  MessageCircle,
  Package,
  Compass,
  HelpCircle,
  RefreshCw,
  Send,
  ClipboardList,
  Award,
  Heart,
  LogOut,
  HeartHandshake,
  MailCheck,
  Newspaper,
  MessageSquareHeart,
  Layout,
  Maximize2,
  Settings,
} from 'lucide-react';
import { tools, categoryLabels, categoryOrder, type ToolCategory } from '@/lib/tools';
import { cn } from '@/lib/utils';
import { CommandPalette } from '@/components/command-palette';
import { useProStatus } from '@/hooks/use-pro-status';
import { usePostHog } from 'posthog-js/react';
import { track } from '@/lib/analytics';

const iconMap: Record<string, React.ElementType> = {
  'linkedin-headline': Linkedin,
  'business-name': Briefcase,
  'slogan': Megaphone,
  'instagram-bio': Instagram,
  'email-subject': Mail,
  'cover-letter': FileText,
  'resume-summary': User,
  'youtube-description': Play,
  'blog-title': BookOpen,
  'meta-description': Search,
  'google-ads-headline': Target,
  'twitter-bio': MessageCircle,
  'product-description': Package,
  'mission-statement': Compass,
  'faq': HelpCircle,
  'text-rewriter': RefreshCw,
  'cold-email': Send,
  'linkedin-post': Linkedin,
  'job-description': ClipboardList,
  'performance-review': Award,
  'thank-you-note': Heart,
  'apology-email': HeartHandshake,
  'resignation-letter': LogOut,
  'dating-bio': Heart,
  'youtube-title': Play,
  'newsletter-welcome': MailCheck,
  'press-release': Newspaper,
  'review-response': MessageSquareHeart,
  'landing-page-headline': Layout,
  'paragraph-expander': Maximize2,
};

const SIDEBAR_EXPANDED = 260;
const SIDEBAR_COLLAPSED = 56;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isPro } = useProStatus();
  const posthog = usePostHog();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Cmd+K to open command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navigate = useCallback((slug: string | null) => {
    if (slug === null) {
      router.push('/');
    } else {
      router.push(`/${slug}`);
    }
  }, [router]);

  // Group tools by category
  const toolsByCategory = categoryOrder.map((cat) => ({
    category: cat,
    label: categoryLabels[cat],
    items: tools
      .filter((t) => t.category === cat)
      .map((t) => ({
        id: t.id,
        slug: t.slug,
        label: t.shortName,
        icon: iconMap[t.id] || LayoutGrid,
      })),
  }));

  const activeSlug = pathname === '/' ? null : pathname.slice(1);
  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col border-r border-border bg-sidebar shrink-0 transition-[width] duration-200 ease-out',
          'fixed md:relative z-50 h-full',
          mobileOpen && isMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
        style={{ width: isMobile ? SIDEBAR_EXPANDED : sidebarWidth }}
      >
        {/* Sidebar header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border shrink-0">
          <button
            onClick={() => { navigate(null); track(posthog, 'sidebar_home_click'); }}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center shrink-0">
              <LayoutGrid className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="text-sm font-semibold tracking-tight truncate">
                K-ToolBox
              </span>
            )}
          </button>

          <div className="flex items-center gap-1">
            {/* Search / Cmd+K button */}
            <button
              onClick={() => { setCmdOpen(true); track(posthog, 'command_palette_opened'); }}
              className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
              aria-label="Search tools (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => {
                  const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
                  setTheme(newTheme);
                  track(posthog, 'theme_toggled', { newTheme });
                }}
                className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5" />
                ) : (
                  <Moon className="w-3.5 h-3.5" />
                )}
              </button>
            )}

            {/* Collapse toggle (desktop only) */}
            {!isMobile && (
              <button
                onClick={() => { setCollapsed(!collapsed); track(posthog, 'sidebar_collapsed', { collapsed: !collapsed }); }}
                className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {collapsed ? (
                  <ChevronRight className="w-3.5 h-3.5" />
                ) : (
                  <ChevronLeft className="w-3.5 h-3.5" />
                )}
              </button>
            )}

            {/* Close (mobile only) */}
            {isMobile && (
              <button
                onClick={() => { setMobileOpen(false); }}
                className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation — grouped by category (collapsible) */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2" aria-label="Tools navigation">
          {toolsByCategory.map((group) => {
            const hasActive = group.items.some((item) => item.slug === activeSlug);
            const categoryKey = `cat-${group.category}`;

            if (collapsed) {
              return (
                <div key={categoryKey} className="mb-2 last:mb-0">
                  <div className="pb-1.5 pt-1" />
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = activeSlug === item.slug;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => { navigate(item.slug); track(posthog, 'sidebar_tool_click', { tool: item.slug, category: group.category }); }}
                          aria-current={isActive ? 'page' : undefined}
                          className={cn(
                            'w-full flex items-center gap-2.5 rounded-md text-left transition-colors duration-100 cursor-pointer',
                            'h-8 px-2 text-[13px] leading-none justify-center',
                            isActive
                              ? 'bg-accent text-foreground font-medium'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/60',
                          )}
                          title={item.label}
                        >
                          <Icon
                            className={cn(
                              'w-4 h-4 shrink-0',
                              isActive ? 'text-foreground' : 'text-muted-foreground/70',
                            )}
                            strokeWidth={isActive ? 2 : 1.5}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <Collapsible.Root
                key={categoryKey}
                defaultOpen={hasActive}
                className="mb-1 last:mb-0"
              >
                <Collapsible.Trigger className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 select-none hover:text-muted-foreground/80 transition-colors cursor-pointer group/cat">
                  <span>{group.label}</span>
                  <ChevronRight className="w-3 h-3 transition-transform duration-150 group-data-[state=open]/cat:rotate-90" />
                </Collapsible.Trigger>
                <Collapsible.Content>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = activeSlug === item.slug;
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.id}
                          onClick={() => { navigate(item.slug); track(posthog, 'sidebar_tool_click', { tool: item.slug, category: group.category }); }}
                          aria-current={isActive ? 'page' : undefined}
                          className={cn(
                            'w-full flex items-center gap-2.5 rounded-md text-left transition-colors duration-100 cursor-pointer',
                            'h-8 px-2 text-[13px] leading-none',
                            isActive
                              ? 'bg-accent text-foreground font-medium'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/60',
                          )}
                        >
                          <Icon
                            className={cn(
                              'w-4 h-4 shrink-0',
                              isActive ? 'text-foreground' : 'text-muted-foreground/70',
                            )}
                            strokeWidth={isActive ? 2 : 1.5}
                          />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </Collapsible.Content>
              </Collapsible.Root>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-border p-3 shrink-0 space-y-2">
          {!collapsed ? (
            <>
              <a
                href="/pricing"
                onClick={() => track(posthog, 'upgrade_clicked', { source: 'sidebar_footer' })}
                className={cn(
                  'flex items-center justify-between px-2 py-1.5 rounded-md transition-colors',
                  isPro
                    ? 'bg-emerald-500/5 text-emerald-600'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                )}
              >
                <div className="flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5" />
                  <span className="text-[12px] font-medium">
                    {isPro ? 'Pro' : 'Upgrade to Pro'}
                  </span>
                </div>
                {!isPro && (
                  <span className="text-[11px] text-muted-foreground/50">$49</span>
                )}
              </a>
              <a
                href="/settings"
                className="flex items-center justify-between px-2 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5" />
                  <span className="text-[12px] font-medium">Settings</span>
                </div>
              </a>
              <div className="px-2 py-0.5">
                <p className="text-[11px] text-muted-foreground/40 leading-relaxed">
                  {isPro ? 'Unlimited access active.' : '5 free uses per tool per day.'}
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <a
                href="/pricing"
                onClick={() => track(posthog, 'upgrade_clicked', { source: 'sidebar_footer_collapsed' })}
                className="w-7 h-7 flex items-center justify-center rounded-md transition-colors cursor-pointer"
                title={isPro ? 'Pro active' : 'Upgrade to Pro'}
              >
                <Crown className={cn(
                  'w-3.5 h-3.5',
                  isPro ? 'text-emerald-500' : 'text-muted-foreground',
                )} />
              </a>
              <div className="w-2 h-2 rounded-full bg-emerald-500/80" title="All systems operational" />
            </div>
          )}
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-border shrink-0 bg-background">
          <div className="flex items-center gap-3 min-w-0">
            {isMobile && (
              <button
                onClick={() => { setMobileOpen(true); track(posthog, 'mobile_menu_opened'); }}
                className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer -ml-1"
                aria-label="Open navigation"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}

            {activeSlug ? (
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => navigate(null)}
                  className="text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                >
                  Tools
                </button>
                <span className="text-muted-foreground/30 text-[13px]">/</span>
                <span className="text-[13px] text-foreground font-medium truncate">
                  {tools.find((t) => t.slug === activeSlug)?.shortName}
                </span>
              </div>
            ) : (
              <h1 className="text-[13px] font-medium text-foreground">Overview</h1>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Cmd+K shortcut hint (desktop) */}
            <button
              onClick={() => setCmdOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border text-[12px] text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors cursor-pointer"
            >
              <Search className="w-3 h-3" />
              <span>Search</span>
              <kbd className="ml-1 inline-flex h-4 items-center rounded border border-border/60 bg-muted px-1 text-[10px] font-mono text-muted-foreground/60">
                {typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent) ? '⌘' : 'Ctrl+'}K
              </kbd>
            </button>

            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>All systems up</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </div>
  );
}
