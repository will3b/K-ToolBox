import { AppShell } from '@/components/app-shell';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolbox.ai';

function SiteJsonLd() {
  const webSiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'K-ToolBox',
    url: BASE_URL,
    description:
      '30 free AI writing tools for cover letters, LinkedIn headlines, resume summaries, blog titles, and more. No sign-up required.',
  };

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'K-ToolBox',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    sameAs: [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
    </>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteJsonLd />
      <AppShell>{children}</AppShell>
    </>
  );
}
