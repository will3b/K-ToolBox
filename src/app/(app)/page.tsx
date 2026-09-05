'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePostHog } from 'posthog-js/react';
import { track } from '@/lib/analytics';
import { tools, categoryLabels, categoryOrder } from '@/lib/tools';
import {
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Linkedin,
  Briefcase,
  Megaphone,
  Instagram,
  Mail,
  FileText,
  User,
  Play,
  BookOpen,
  Search,
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
  Sparkles,
  Crown,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
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

// Top 6 most popular / high-value tools to feature
const featuredToolIds = [
  'cover-letter',
  'linkedin-headline',
  'cold-email',
  'text-rewriter',
  'resume-summary',
  'blog-title',
];

export default function HomePage() {
  const posthog = usePostHog();
  const featuredTools = featuredToolIds
    .map((id) => tools.find((t) => t.id === id))
    .filter(Boolean) as typeof tools;

  const toolsByCategory = categoryOrder.map((cat) => ({
    category: cat,
    label: categoryLabels[cat],
    items: tools.filter((t) => t.category === cat),
  }));

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* ── Hero ── */}
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-border bg-muted/50 mb-4">
            <Sparkles className="w-3 h-3 text-foreground/60" />
            <span className="text-[11px] font-medium text-muted-foreground">30 free AI writing tools</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground leading-tight mb-3">
            Write better, faster.
            <br />
            <span className="text-muted-foreground">No sign-up required.</span>
          </h1>

          <p className="text-[14px] text-muted-foreground leading-relaxed max-w-lg mb-5">
            AI-powered generators for cover letters, LinkedIn posts, cold emails, blog titles, and 25 more everyday writing tasks. Pick a tool, describe what you need, get results in seconds.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="#tools"
              onClick={() => track(posthog, 'homepage_cta_click', { cta: 'browse_tools' })}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-foreground text-primary-foreground text-[13px] font-medium hover:bg-foreground/90 transition-colors"
            >
              Browse all tools
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="/pricing"
              onClick={() => track(posthog, 'homepage_cta_click', { cta: 'get_unlimited' })}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md border border-border text-[13px] font-medium text-foreground hover:bg-accent transition-colors"
            >
              <Crown className="w-3.5 h-3.5" />
              Get unlimited access
            </a>
          </div>
        </motion.div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-muted-foreground"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span><strong className="text-foreground font-medium">30</strong> tools</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span><strong className="text-foreground font-medium">6</strong> tone options each</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span><strong className="text-foreground font-medium">180+</strong> results per run</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Zero sign-up</span>
          </div>
        </motion.div>
      </div>

      {/* ── Featured Tools ── */}
      <div className="mb-12" id="tools">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          <h2 className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-4">
            Most popular
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {featuredTools.map((tool, idx) => {
              const Icon = iconMap[tool.id] || Zap;
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.04, duration: 0.2 }}
                >
                  <Link
                    href={`/${tool.slug}`}
                    onClick={() => track(posthog, 'homepage_tool_click', { tool: tool.slug, source: 'featured' })}
                    className="group flex flex-col rounded-lg border border-border p-4 hover:border-foreground/15 hover:bg-muted/30 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:ring-offset-1"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                        <Icon className="w-4 h-4 text-foreground/70" strokeWidth={1.5} />
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <h3 className="text-[13px] font-medium text-foreground mb-1">
                      {tool.shortName}
                    </h3>
                    <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ── All Tools by Category ── */}
      <div className="mb-12">
        <h2 className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-4">
          All tools
        </h2>
        <div className="space-y-8">
          {toolsByCategory.map((group) => (
            <div key={group.category}>
              <h3 className="text-[13px] font-medium text-foreground mb-3">
                {group.label}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {group.items.map((tool) => {
                  const Icon = iconMap[tool.id] || Zap;
                  return (
                    <Link
                      key={tool.id}
                      href={`/${tool.slug}`}
                      onClick={() => track(posthog, 'homepage_tool_click', { tool: tool.slug, source: 'category_grid' })}
                      className="group flex items-center gap-3 rounded-md border border-border px-3.5 py-2.5 hover:border-foreground/15 hover:bg-muted/30 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:ring-offset-1"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground/70 shrink-0 transition-colors" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <span className="text-[13px] font-medium text-foreground group-hover:text-foreground/80 transition-colors">
                          {tool.shortName}
                        </span>
                        <p className="text-[11px] text-muted-foreground/50 truncate mt-0.5">
                          {tool.resultCount} results
                        </p>
                      </div>
                      <ArrowRight className="w-3 h-3 text-muted-foreground/20 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="mb-12">
        <h2 className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-4">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Zap,
              title: 'Describe your need',
              desc: 'Enter a brief description — a role, a business idea, a brand. The more context you give, the better the output.',
            },
            {
              icon: Shield,
              title: 'Pick a style',
              desc: 'Each tool offers 6 tone options. Professional, creative, casual, bold — choose the one that matches your audience.',
            },
            {
              icon: Clock,
              title: 'Copy and use',
              desc: 'Get multiple results instantly. Copy your favorite directly. No formatting hassle, no sign-up wall.',
            },
          ].map((step, i) => (
            <div key={i} className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center">
                  <step.icon className="w-3.5 h-3.5 text-foreground/60" strokeWidth={1.5} />
                </div>
                <h3 className="text-[13px] font-medium text-foreground">{step.title}</h3>
              </div>
              <p className="text-[12px] text-muted-foreground leading-relaxed pl-[34px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SEO content ── */}
      <div className="border-t border-border pt-8">
        <h2 className="text-sm font-medium text-foreground mb-3">
          Free AI writing tools that don&apos;t suck
        </h2>
        <div className="max-w-2xl space-y-3 text-[12px] text-muted-foreground leading-[1.75]">
          <p>
            There are a thousand &ldquo;AI-powered&rdquo; generators online. Most give you the same five results regardless of what you type, bury the copy button behind a signup wall, and look like they were designed by someone who has never used them.
          </p>
          <p>
            These 30 tools cover the writing tasks people actually search for: cover letters that get read, cold emails that get replies, LinkedIn posts that get engagement, dating bios that get matches. Each tool was built around a specific friction point — the thing that makes you stare at a blank screen and wonder why writing is so hard.
          </p>
          <p>
            Every tool gives you multiple style options because the right tone depends on context. A LinkedIn headline for a VC reads differently than one for a freelance illustrator. The generator should know that. That&apos;s the whole point.
          </p>
        </div>
      </div>
    </div>
  );
}
