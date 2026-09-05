import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PostHogProviderWrapper } from "@/components/posthog-provider";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "K-ToolBox — Free AI Writing Tools",
  description:
    "30 free AI writing tools: generate LinkedIn headlines, cover letters, resume summaries, blog titles, business names, slogans, Instagram bios, email subject lines, cold emails, dating bios, and more. No sign-up, no paywall.",
  keywords: [
    "AI writing tools",
    "free writing tools",
    "linkedin headline generator",
    "cover letter generator",
    "resume summary generator",
    "blog title generator",
    "business name generator",
    "slogan generator",
    "instagram bio generator",
    "email subject line generator",
    "youtube description generator",
    "meta description generator",
    "google ads headline generator",
    "twitter bio generator",
    "product description generator",
    "faq generator",
    "text rewriter",
    "cold email generator",
    "linkedin post generator",
    "job description generator",
    "performance review generator",
    "thank you note generator",
    "apology email generator",
    "resignation letter generator",
    "dating bio generator",
    "youtube title generator",
    "newsletter welcome email generator",
    "press release generator",
    "review response generator",
    "landing page headline generator",
    "paragraph expander",
  ],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧰</text></svg>",
  },
  openGraph: {
    title: "K-ToolBox — Free AI Writing Tools",
    description:
      "30 free AI writing tools: cover letters, resumes, blog titles, headlines, bios, descriptions & more. No sign-up.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-background text-foreground`}
      >
        <PostHogProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </PostHogProviderWrapper>
      </body>
    </html>
  );
}
