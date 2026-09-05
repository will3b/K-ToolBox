'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { tools } from '@/lib/tools';
import { LayoutGrid, Linkedin, Briefcase, Megaphone, Instagram, Mail, Crown, FileText, User, Play, BookOpen, Search, Target, MessageCircle, Package, Compass, HelpCircle, Settings } from 'lucide-react';
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
};

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const posthog = usePostHog();

  const handleSelect = useCallback((slug: string | null) => {
    onOpenChange(false);
    if (slug === null) {
      router.push('/');
      track(posthog, 'sidebar_home_click');
    } else {
      router.push(`/${slug}`);
      track(posthog, 'command_palette_used', { tool: slug });
    }
  }, [router, onOpenChange, posthog]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search tools..." />
      <CommandList>
        <CommandEmpty>No tools found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => handleSelect(null)}>
            <LayoutGrid className="mr-2.5 h-4 w-4" />
            <span>Overview</span>
          </CommandItem>
          <CommandItem onSelect={() => { onOpenChange(false); router.push('/pricing'); track(posthog, 'upgrade_clicked', { source: 'command_palette' }); }}>
            <Crown className="mr-2.5 h-4 w-4" />
            <div className="flex flex-col">
              <span className="text-[13px] leading-tight">Pricing</span>
              <span className="text-[11px] text-muted-foreground leading-tight mt-0.5">Upgrade to Pro</span>
            </div>
          </CommandItem>
          <CommandItem onSelect={() => { onOpenChange(false); router.push('/settings'); }}>
            <Settings className="mr-2.5 h-4 w-4" />
            <div className="flex flex-col">
              <span className="text-[13px] leading-tight">Settings</span>
              <span className="text-[11px] text-muted-foreground leading-tight mt-0.5">AI provider configuration</span>
            </div>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Tools">
          {tools.map((tool) => {
            const Icon = iconMap[tool.id] || LayoutGrid;
            return (
              <CommandItem
                key={tool.id}
                value={`${tool.shortName} ${tool.name} ${tool.description}`}
                onSelect={() => handleSelect(tool.slug)}
              >
                <Icon className="mr-2.5 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="text-[13px] leading-tight">{tool.shortName}</span>
                  <span className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                    {tool.description.length > 55
                      ? tool.description.slice(0, 55) + '...'
                      : tool.description}
                  </span>
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
