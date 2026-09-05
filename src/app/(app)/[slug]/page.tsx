import { notFound } from 'next/navigation';
import { tools, getToolBySlug, categoryLabels } from '@/lib/tools';
import type { Metadata } from 'next';
import { ToolPageClient } from './tool-page-client';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolbox.ai';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: 'Tool Not Found' };

  return {
    title: `${tool.name} — Free AI-Powered | K-ToolBox`,
    description: tool.metaDescription,
    keywords: tool.seoKeywords,
    openGraph: {
      title: `Free ${tool.name} — K-ToolBox`,
      description: tool.metaDescription,
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

/* Expanded answers derived from each howItWorks step */
function expandHowItWorks(item: string, toolName: string): string {
  const lower = item.toLowerCase();
  if (lower.includes('paste') || lower.includes('enter') || lower.includes('type') || lower.includes('describe') || lower.includes('provide') || lower.includes('select') || lower.includes('choose') || lower.includes('pick') || lower.includes('input') || lower.includes('write')) {
    return `Start by entering your details into the ${toolName}. The tool accepts any level of detail — even a few words can produce great results. The more context you provide about your role, brand, or situation, the more tailored and relevant the generated output will be. There's no sign-up required, so you can start immediately.`;
  }
  if (lower.includes('tone') || lower.includes('style') || lower.includes('choose a tone') || lower.includes('pick a style')) {
    return `The ${toolName} offers multiple tone options including Professional, Creative, Casual, Bold, Formal, and Friendly. Each tone adjusts the vocabulary, sentence structure, and overall feel of the output. Choose the one that best matches your audience and context — a creative tone for startups, a formal tone for corporate communications, and so on.`;
  }
  if (lower.includes('get ') || lower.includes('receive') || lower.includes('generate') || lower.includes('results') || lower.includes('output') || lower.includes('instant')) {
    return `Once you click Generate, the AI processes your input and produces multiple unique variations. The ${toolName} returns several results at once so you can compare options and pick the best fit. Each result is independent and crafted from scratch — you won't get duplicate or slight variations of the same text.`;
  }
  if (lower.includes('copy') || lower.includes('use') || lower.includes('adjust') || lower.includes('edit') || lower.includes('pick the best') || lower.includes('select')) {
    return `After reviewing the generated options, simply click the copy button next to your preferred result to add it to your clipboard. You can then paste it directly into LinkedIn, your email client, your resume, or wherever you need it. Feel free to edit and personalize the copied text to perfectly match your voice and situation.`;
  }
  return `The ${toolName} uses advanced AI to understand your input and generate high-quality, context-aware results. Each output is crafted to be unique, relevant, and ready to use. The entire process takes just a few seconds from input to final result.`;
}

function ToolJsonLd({ tool }: { tool: typeof tools[0] }) {
  const webAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.metaDescription,
    url: `${BASE_URL}/${tool.slug}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'K-ToolBox',
      url: BASE_URL,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryLabels[tool.category],
        item: `${BASE_URL}/#${tool.category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.shortName,
        item: `${BASE_URL}/${tool.slug}`,
      },
    ],
  };

  const faqJsonLd = tool.id === 'faq'
    ? null
    : {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: tool.howItWorks.map((item) => ({
          '@type': 'Question',
          name: item,
          acceptedAnswer: {
            '@type': 'Answer',
            text: expandHowItWorks(item, tool.name),
          },
        })),
      };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </>
  );
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  // Strip non-serializable fields before passing to client
  const { icon: _icon, gradient: _gradient, ...clientTool } = tool;

  return (
    <>
      <ToolJsonLd tool={tool} />
      <ToolPageClient tool={clientTool} />
    </>
  );
}
