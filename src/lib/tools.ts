import {
  Linkedin,
  Lightbulb,
  Instagram,
  Mail,
  Briefcase,
  Sparkles,
  Megaphone,
  PenTool,
  Type,
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
  AtSign,
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
  type LucideIcon,
} from "lucide-react";

export interface ToneOption {
  label: string;
  value: string;
  emoji: string;
}

export interface ToolConfig {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  metaDescription: string;
  icon: LucideIcon;
  gradient: string;
  placeholder: string;
  inputLabel: string;
  inputHint: string;
  tones: ToneOption[];
  defaultTone: string;
  systemPrompt: string;
  userPromptTemplate: string;
  resultCount: number;
  seoKeywords: string[];
  howItWorks: string[];
  tips: string[];
  category: ToolCategory;
  /** If true, the AI returns a single string (not a JSON array) */
  plainTextResult?: boolean;
}

export type ToolCategory =
  | 'career'
  | 'marketing'
  | 'social'
  | 'business'
  | 'personal';

export const categoryLabels: Record<ToolCategory, string> = {
  career: 'Career & Job',
  marketing: 'Marketing & SEO',
  social: 'Social Media',
  business: 'Business',
  personal: 'Personal',
};

export const categoryOrder: ToolCategory[] = [
  'career',
  'marketing',
  'social',
  'business',
  'personal',
];

export const tools: ToolConfig[] = [
  {
    id: "linkedin-headline",
    slug: "linkedin-headline-generator",
    name: "LinkedIn Headline Generator",
    shortName: "LinkedIn Headline",
    description:
      "Create a standout LinkedIn headline that gets you noticed by recruiters, clients, and peers. Powered by AI with multiple tone options.",
    metaDescription:
      "Free AI LinkedIn headline generator. Create professional, creative, or catchy LinkedIn headlines in seconds. 6 tone options. No sign-up required.",
    icon: Linkedin,
    gradient: "from-emerald-500 to-teal-600",
    placeholder: "e.g. Senior Product Manager at Google, ex-Startup Founder",
    inputLabel: "Your role / background",
    inputHint:
      "Describe your current role, industry, or key achievements to get the best headlines.",
    tones: [
      { label: "Professional", value: "professional", emoji: "\uD83D\uDCBC" },
      { label: "Creative", value: "creative", emoji: "\uD83C\uDFA8" },
      { label: "Achievement", value: "achievement", emoji: "\uD83C\uDFC6" },
      { label: "Casual", value: "casual", emoji: "\u270C\uFE0F" },
      { label: "Bold", value: "bold", emoji: "\uD83D\uDD25" },
      { label: "Minimal", value: "minimal", emoji: "\u2728" },
    ],
    defaultTone: "professional",
    systemPrompt:
      "You are an expert personal branding consultant who specializes in crafting compelling LinkedIn headlines. Generate exactly 6 unique LinkedIn headlines based on the user's input and chosen tone. Each headline should be under 220 characters. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Generate 6 {tone} LinkedIn headlines for someone with this background: {input}",
    resultCount: 6,
    category: "social",
    seoKeywords: [
      "linkedin headline generator",
      "linkedin headline examples",
      "best linkedin headline",
      "professional linkedin headline",
      "creative linkedin headline",
      "linkedin headline for job seekers",
    ],
    howItWorks: [
      "Enter your current role, industry, or a brief description of what you do",
      "Choose a tone that matches your personal brand",
      "Click generate and get 6 unique, tailored LinkedIn headlines",
      "Copy your favorite one directly to your LinkedIn profile",
    ],
    tips: [
      "Include specific keywords from your industry for better search visibility",
      "Mention measurable achievements when possible (e.g. 'Grew revenue 300%')",
      "Avoid clich\u00e9s like 'Passionate about' or 'Results-driven'",
      "Test different headlines and track your profile views over time",
    ],
  },
  {
    id: "business-name",
    slug: "business-name-generator",
    name: "Business Name Generator",
    shortName: "Business Name",
    description:
      "Find the perfect name for your startup or business. AI generates creative, memorable, and available-sounding names based on your idea.",
    metaDescription:
      "Free AI business name generator. Get creative, catchy startup and company name ideas in seconds. Multiple styles. No sign-up required.",
    icon: Briefcase,
    gradient: "from-amber-500 to-orange-600",
    placeholder: "e.g. A meal delivery service for busy parents, AI-powered flashcard app for students",
    inputLabel: "Describe your business idea",
    inputHint:
      "Describe what your business does, your target audience, or the vibe you want.",
    tones: [
      { label: "Modern", value: "modern", emoji: "\uD83D\uDE80" },
      { label: "Playful", value: "playful", emoji: "\uD83C\uDFB2" },
      { label: "Premium", value: "premium", emoji: "\uD83D\uDC51" },
      { label: "Tech", value: "tech", emoji: "\uD83D\uDCBB" },
      { label: "One Word", value: "one-word", emoji: "\uD83D\uDD00" },
      { label: "Descriptive", value: "descriptive", emoji: "\uD83D\uDCDD" },
    ],
    defaultTone: "modern",
    systemPrompt:
      'You are a creative branding expert and naming consultant. Generate exactly 8 unique business name ideas based on the user\'s description and chosen style. Mix different approaches: portmanteaus, metaphors, descriptive names, abstract names. Return ONLY a JSON array of strings, no other text.',
    userPromptTemplate:
      "Generate 8 {tone} business names for: {input}",
    resultCount: 8,
    category: "business",
    seoKeywords: [
      "business name generator",
      "startup name ideas",
      "company name generator",
      "business name ideas",
      "creative business names",
      "brand name generator",
    ],
    howItWorks: [
      "Describe your business idea, industry, or target audience",
      "Pick a naming style that fits your brand vision",
      "Get 8 unique, creative business name suggestions",
      "Mix and match words from different results for more ideas",
    ],
    tips: [
      "Say it out loud \u2014 the best names are easy to pronounce",
      "Check domain availability before committing to a name",
      "Avoid names that are too similar to existing brands",
      "Consider how the name looks in a logo and on social media",
    ],
  },
  {
    id: "slogan",
    slug: "slogan-generator",
    name: "Slogan Generator",
    shortName: "Slogan",
    description:
      "Craft a memorable slogan or tagline for your brand in seconds. AI-powered with styles from professional to witty.",
    metaDescription:
      "Free AI slogan and tagline generator. Create catchy brand slogans, marketing taglines, and campaign phrases instantly. No sign-up.",
    icon: Megaphone,
    gradient: "from-rose-500 to-pink-600",
    placeholder: "e.g. Organic skincare brand for millennials, Project management tool for remote teams",
    inputLabel: "Describe your brand or product",
    inputHint:
      "What does your brand do? Who is it for? What feeling should it evoke?",
    tones: [
      { label: "Professional", value: "professional", emoji: "\uD83D\uDCBC" },
      { label: "Catchy", value: "catchy", emoji: "\uD83C\uDFB5" },
      { label: "Funny", value: "funny", emoji: "\uD83D\uDE02" },
      { label: "Inspirational", value: "inspirational", emoji: "\u2728" },
      { label: "Short", value: "short", emoji: "\u26A1" },
      { label: "Bold", value: "bold", emoji: "\uD83D\uDD25" },
    ],
    defaultTone: "catchy",
    systemPrompt:
      "You are a world-class copywriter and brand strategist. Generate exactly 8 unique slogan/tagline ideas based on the user's brand description and chosen style. Each slogan should be concise (3-10 words) and memorable. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Generate 8 {tone} slogans for: {input}",
    resultCount: 8,
    category: "business",
    seoKeywords: [
      "slogan generator",
      "tagline generator",
      "business slogan ideas",
      "catchy slogans",
      "brand slogan generator",
      "marketing tagline generator",
    ],
    howItWorks: [
      "Describe your brand, product, or campaign",
      "Select a style that matches your brand personality",
      "Receive 8 unique, memorable slogan suggestions",
      "Pick your favorite or combine elements from multiple options",
    ],
    tips: [
      "Great slogans are short, memorable, and communicate a benefit",
      "Test your slogan with real customers before finalizing",
      "Make sure it works across all marketing channels",
      "Aim for something that could become part of everyday language",
    ],
  },
  {
    id: "instagram-bio",
    slug: "instagram-bio-generator",
    name: "Instagram Bio Generator",
    shortName: "Instagram Bio",
    description:
      "Create an Instagram bio that captures your personality and grows your following. Multiple styles from aesthetic to entrepreneurial.",
    metaDescription:
      "Free AI Instagram bio generator. Create aesthetic, professional, or funny Instagram bios instantly. Multiple styles. No sign-up required.",
    icon: Instagram,
    gradient: "from-violet-500 to-purple-600",
    placeholder: "e.g. Travel photographer, Freelance graphic designer, Fitness coach for women",
    inputLabel: "Describe yourself or your brand",
    inputHint:
      "What do you do? What's your vibe? Any achievements or interests to include?",
    tones: [
      { label: "Aesthetic", value: "aesthetic", emoji: "\uD83C\uDF3F" },
      { label: "Professional", value: "professional", emoji: "\uD83D\uDCBC" },
      { label: "Funny", value: "funny", emoji: "\uD83D\uDE02" },
      { label: "Minimal", value: "minimal", emoji: "\u2728" },
      { label: "Creator", value: "creator", emoji: "\uD83C\uDFA8" },
      { label: "Business", value: "business", emoji: "\uD83D\uDED2" },
    ],
    defaultTone: "aesthetic",
    systemPrompt:
      'You are a social media branding expert. Generate exactly 6 unique Instagram bios based on the user\'s description and chosen style. Each bio should be under 150 characters, include line breaks where appropriate (use \\n), and may include relevant emojis. Return ONLY a JSON array of strings, no other text.',
    userPromptTemplate:
      "Generate 6 {tone} Instagram bios for: {input}",
    resultCount: 6,
    category: "social",
    seoKeywords: [
      "instagram bio generator",
      "instagram bio ideas",
      "aesthetic instagram bio",
      "professional instagram bio",
      "instagram bio for business",
      "best instagram bio",
    ],
    howItWorks: [
      "Describe yourself, your brand, or what you're about",
      "Choose a vibe that matches your Instagram aesthetic",
      "Get 6 tailored Instagram bios with emojis and line breaks",
      "Copy and paste directly into your Instagram profile",
    ],
    tips: [
      "Include a clear value proposition \u2014 tell people what you offer",
      "Use line breaks to make your bio scannable and easy to read",
      "Add a call-to-action like 'DM for collabs' or 'Link below \u2B07\uFE0F'",
      "Update your bio regularly to keep it fresh and relevant",
    ],
  },
  {
    id: "email-subject",
    slug: "email-subject-line-generator",
    name: "Email Subject Line Generator",
    shortName: "Email Subject",
    description:
      "Boost your email open rates with AI-crafted subject lines. From cold outreach to newsletters, get subject lines that get clicks.",
    metaDescription:
      "Free AI email subject line generator. Create high-open-rate email subject lines for cold outreach, newsletters, and marketing. No sign-up.",
    icon: Mail,
    gradient: "from-sky-500 to-cyan-600",
    placeholder: "e.g. New SaaS feature launch, Follow-up after meeting at conference, Weekly newsletter about AI tools",
    inputLabel: "Describe your email's purpose",
    inputHint:
      "What's the email about? Who is it to? What action do you want them to take?",
    tones: [
      { label: "Professional", value: "professional", emoji: "\uD83D\uDCBC" },
      { label: "Catchy", value: "catchy", emoji: "\uD83C\uDFB5" },
      { label: "Urgent", value: "urgent", emoji: "\u26A1" },
      { label: "Curiosity", value: "curiosity", emoji: "\uD83D\uDD0D" },
      { label: "Friendly", value: "friendly", emoji: "\uD83D\uDE0A" },
      { label: "Personal", value: "personal", emoji: "\uD83E\uDDD1" },
    ],
    defaultTone: "catchy",
    systemPrompt:
      "You are an email marketing expert who specializes in writing high-performing subject lines. Generate exactly 8 unique email subject lines based on the user's description and chosen style. Keep each under 60 characters. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Generate 8 {tone} email subject lines for: {input}",
    resultCount: 8,
    category: "marketing",
    seoKeywords: [
      "email subject line generator",
      "email subject line ideas",
      "cold email subject lines",
      "marketing email subject lines",
      "newsletter subject lines",
      "high open rate subject lines",
    ],
    howItWorks: [
      "Describe the purpose and context of your email",
      "Select a style that fits your email's goal and audience",
      "Get 8 subject lines designed to maximize open rates",
      "A/B test your top 2-3 picks with your email list",
    ],
    tips: [
      "Keep it under 50 characters for optimal mobile display",
      "Use personalization like the recipient's name or company",
      "Create urgency or curiosity without being clickbait",
      "A/B test subject lines \u2014 small changes can boost opens by 30%+",
    ],
  },
  {
    id: "cover-letter",
    slug: "cover-letter-generator",
    name: "Free AI Cover Letter Generator",
    shortName: "Cover Letter",
    description:
      "Generate a professional, tailored cover letter in seconds. AI crafts a compelling 3-4 paragraph cover letter based on your job application details and chosen tone.",
    metaDescription:
      "Free AI cover letter generator. Create a tailored, professional cover letter in seconds. Multiple tones available. No sign-up required.",
    icon: FileText,
    gradient: "from-blue-600 to-indigo-600",
    placeholder:
      "e.g. Senior UX Designer role at Spotify, 5 years experience in fintech, applying for a remote position",
    inputLabel: "Job & your background",
    inputHint:
      "Include the target job title, company name, and a brief overview of your relevant experience and skills.",
    tones: [
      { label: "Professional", value: "professional", emoji: "💼" },
      { label: "Enthusiastic", value: "enthusiastic", emoji: "🎓" },
      { label: "Confident", value: "confident", emoji: "🔥" },
      { label: "Creative", value: "creative", emoji: "🎨" },
      { label: "Formal", value: "formal", emoji: "📝" },
      { label: "Bold", value: "bold", emoji: "🚀" },
    ],
    defaultTone: "professional",
    systemPrompt:
      "You are an expert career coach and professional writer. Write a complete cover letter (3-4 paragraphs) based on the user's job application details and chosen tone. The letter should include: an engaging opening paragraph that states the role being applied for, 1-2 body paragraphs highlighting relevant skills, achievements, and experience, and a strong closing paragraph with a call to action. Use specific language tailored to the role and industry. Return ONLY the cover letter text as a plain string, no JSON wrapping, no markdown formatting, no other text.",
    userPromptTemplate:
      "Write a {tone} cover letter for this application: {input}",
    resultCount: 1,
    category: "career",
    plainTextResult: true,
    seoKeywords: [
      "AI cover letter",
      "free cover letter generator",
      "professional cover letter",
      "cover letter writer",
      "job application cover letter",
    ],
    howItWorks: [
      "Enter the job title, company, and your relevant experience",
      "Choose a tone that matches the company culture and role",
      "Get a complete 3-4 paragraph cover letter tailored to the position",
      "Copy, paste into your application, and personalize any final details",
    ],
    tips: [
      "Always customize the company name and hiring manager when possible",
      "Include specific metrics or achievements from your past experience",
      "Match your tone to the company culture \u2014 startups prefer casual, law firms prefer formal",
      "Keep the cover letter to one page and focus on your most relevant qualifications",
    ],
  },
  {
    id: "resume-summary",
    slug: "resume-summary-generator",
    name: "Free AI Resume Summary Generator",
    shortName: "Resume Summary",
    description:
      "Craft a powerful resume summary that captures recruiters' attention in seconds. AI generates tailored professional summaries based on your experience and career goals.",
    metaDescription:
      "Free AI resume summary generator. Create a powerful, tailored resume summary in seconds. Multiple tones. No sign-up required.",
    icon: User,
    gradient: "from-teal-500 to-emerald-600",
    placeholder:
      "e.g. Senior Software Engineer with 8 years in backend development, looking to transition to engineering management",
    inputLabel: "Your experience & goals",
    inputHint:
      "Describe your current role, years of experience, key skills, and career objective or target role.",
    tones: [
      { label: "Professional", value: "professional", emoji: "💼" },
      { label: "Achiever", value: "achiever", emoji: "🏆" },
      { label: "Focused", value: "focused", emoji: "🎯" },
      { label: "Inspirational", value: "inspirational", emoji: "🌟" },
      { label: "Innovative", value: "innovative", emoji: "💡" },
      { label: "Entry-Level", value: "entry-level", emoji: "🎓" },
    ],
    defaultTone: "professional",
    systemPrompt:
      "You are an expert resume writer and career strategist. Generate exactly 6 unique resume summary statements based on the user's experience and chosen tone. Each summary should be 2-3 sentences, highlight key strengths and career trajectory, and be optimized for applicant tracking systems. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Generate 6 {tone} resume summaries for this background: {input}",
    resultCount: 6,
    category: "career",
    seoKeywords: [
      "resume summary generator",
      "AI resume summary",
      "professional resume summary",
      "resume profile generator",
      "free resume summary",
      "resume summary examples",
    ],
    howItWorks: [
      "Describe your experience, skills, and career goals",
      "Select a tone that fits your industry and seniority level",
      "Receive 6 unique resume summary options tailored to your background",
      "Pick the best one or combine elements from multiple summaries",
    ],
    tips: [
      "Include your years of experience and a key achievement or skill",
      "Tailor the summary to match the job description of your target role",
      "Avoid first-person pronouns \u2014 keep it direct and punchy",
      "Use industry-specific keywords to pass applicant tracking systems",
    ],
  },
  {
    id: "youtube-description",
    slug: "youtube-description-generator",
    name: "Free AI YouTube Description Generator",
    shortName: "YouTube Desc",
    description:
      "Write SEO-optimized YouTube descriptions that boost your video's discoverability and engagement. AI generates compelling descriptions with keywords and CTAs.",
    metaDescription:
      "Free AI YouTube description generator. Create SEO-optimized YouTube video descriptions in seconds. No sign-up required.",
    icon: Play,
    gradient: "from-red-500 to-rose-600",
    placeholder:
      "e.g. A 15-minute tutorial on building a React dashboard from scratch with Tailwind CSS",
    inputLabel: "Describe your video",
    inputHint:
      "What is your video about? Include the topic, format, and any key points or timestamps you want mentioned.",
    tones: [
      { label: "Engaging", value: "engaging", emoji: "🔥" },
      { label: "Creative", value: "creative", emoji: "✨" },
      { label: "Informative", value: "informative", emoji: "📝" },
      { label: "Entertaining", value: "entertaining", emoji: "🎤" },
      { label: "SEO-Optimized", value: "seo-optimized", emoji: "🎯" },
      { label: "Inspirational", value: "inspirational", emoji: "🌟" },
    ],
    defaultTone: "engaging",
    systemPrompt:
      "You are a YouTube growth expert and SEO copywriter. Generate exactly 6 unique YouTube video descriptions based on the user's video details and chosen tone. Each description should include an engaging hook, relevant keywords for YouTube SEO, a brief overview of the video content, and a call to action (subscribe, like, comment). Use line breaks (\n) for readability. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Generate 6 {tone} YouTube descriptions for this video: {input}",
    resultCount: 6,
    category: "social",
    seoKeywords: [
      "youtube description generator",
      "youtube video description",
      "youtube SEO description",
      "AI youtube description",
      "free youtube description",
      "youtube description template",
    ],
    howItWorks: [
      "Describe your video topic, format, and key content points",
      "Choose a tone that matches your channel's style and audience",
      "Get 6 SEO-optimized YouTube descriptions with hooks and CTAs",
      "Copy your favorite and add timestamps or links before publishing",
    ],
    tips: [
      "Include your target keywords in the first 2 lines for better SEO",
      "Add timestamps for longer videos to improve viewer experience",
      "Always include a call-to-action like 'Subscribe' or 'Check the link below'",
      "Use relevant hashtags at the bottom of your description",
    ],
  },
  {
    id: "blog-title",
    slug: "blog-title-generator",
    name: "Free AI Blog Title Generator",
    shortName: "Blog Title",
    description:
      "Generate click-worthy blog post titles that drive traffic and engagement. AI creates SEO-friendly, compelling headlines for any topic or niche.",
    metaDescription:
      "Free AI blog title generator. Create catchy, SEO-friendly blog post headlines in seconds. Multiple styles. No sign-up required.",
    icon: BookOpen,
    gradient: "from-orange-500 to-amber-600",
    placeholder:
      "e.g. How to improve your productivity while working from home, tips for better sleep habits",
    inputLabel: "Describe your blog topic",
    inputHint:
      "What is your blog post about? Include the main topic, angle, or key takeaway you want to convey.",
    tones: [
      { label: "Catchy", value: "catchy", emoji: "🔥" },
      { label: "Clever", value: "clever", emoji: "💡" },
      { label: "SEO-Focused", value: "seo-focused", emoji: "🎯" },
      { label: "Creative", value: "creative", emoji: "✨" },
      { label: "How-To", value: "how-to", emoji: "🎓" },
      { label: "Listicle", value: "listicle", emoji: "🌟" },
    ],
    defaultTone: "catchy",
    systemPrompt:
      "You are a content strategist and SEO expert who specializes in high-performing blog headlines. Generate exactly 8 unique blog post titles based on the user's topic and chosen style. Each title should be compelling, clear, and optimized for search engines. Vary the approach: use numbers, questions, how-tos, power words, and curiosity gaps. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Generate 8 {tone} blog titles for this topic: {input}",
    resultCount: 8,
    category: "marketing",
    seoKeywords: [
      "blog title generator",
      "blog post title ideas",
      "AI blog title",
      "catchy blog titles",
      "SEO blog headlines",
      "free blog title generator",
    ],
    howItWorks: [
      "Describe your blog post topic, angle, or key message",
      "Select a style that matches your content format and audience",
      "Receive 8 unique, SEO-friendly blog title suggestions",
      "Pick the strongest title or use them as A/B test variants",
    ],
    tips: [
      "Use numbers in titles (e.g. '7 Ways to...') \u2014 they consistently boost click-through rates",
      "Include your primary keyword near the beginning of the title",
      "Keep titles under 60 characters for full display in search results",
      "Create a sense of urgency or curiosity to drive more clicks",
    ],
  },
  {
    id: "meta-description",
    slug: "meta-description-generator",
    name: "Free AI Meta Description Generator",
    shortName: "Meta Desc",
    description:
      "Write compelling meta descriptions that improve your search engine click-through rates. AI generates SEO-optimized descriptions under 160 characters.",
    metaDescription:
      "Free AI meta description generator. Create SEO-optimized meta descriptions under 160 characters. No sign-up required. Try it free.",
    icon: Search,
    gradient: "from-cyan-500 to-teal-600",
    placeholder:
      "e.g. A guide on how to start a freelance web design business, including pricing tips and finding clients",
    inputLabel: "Describe your page",
    inputHint:
      "Describe the page content, product, or article that needs a meta description.",
    tones: [
      { label: "SEO-Optimized", value: "seo-optimized", emoji: "🎯" },
      { label: "Professional", value: "professional", emoji: "💼" },
      { label: "Click-Worthy", value: "click-worthy", emoji: "🔥" },
      { label: "Engaging", value: "engaging", emoji: "✨" },
      { label: "Clear", value: "clear", emoji: "💡" },
      { label: "Action-Driven", value: "action-driven", emoji: "🚀" },
    ],
    defaultTone: "seo-optimized",
    systemPrompt:
      "You are an SEO expert and copywriter. Generate exactly 6 unique meta descriptions based on the user's page content and chosen tone. Each meta description MUST be under 160 characters, include the primary keyword naturally, and end with an implicit or explicit call to action. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Generate 6 {tone} meta descriptions for this page: {input}",
    resultCount: 6,
    category: "marketing",
    seoKeywords: [
      "meta description generator",
      "SEO meta description",
      "meta description writer",
      "free meta description generator",
      "AI meta description",
      "meta description examples",
    ],
    howItWorks: [
      "Describe the page, article, or product that needs a meta description",
      "Select a tone that matches your brand voice and page intent",
      "Get 6 meta descriptions, each under 160 characters for full SERP display",
      "Paste the best one into your page's <meta name=\"description\"> tag",
    ],
    tips: [
      "Keep every description under 160 characters to avoid truncation in search results",
      "Include your primary keyword naturally — don't stuff it",
      "Add a subtle call-to-action to improve click-through rates",
      "Make each description unique across your site to avoid duplicate content issues",
    ],
  },
  {
    id: "google-ads-headline",
    slug: "google-ads-headline-generator",
    name: "Free AI Google Ads Headline Generator",
    shortName: "Ads Headline",
    description:
      "Create high-converting Google Ads headlines that maximize your ad performance. AI generates attention-grabbing headlines under 30 characters.",
    metaDescription:
      "Free AI Google Ads headline generator. Create high-converting ad headlines under 30 chars instantly. No sign-up required. Try it now.",
    icon: Target,
    gradient: "from-blue-500 to-sky-600",
    placeholder:
      "e.g. 50% off premium coffee beans, free shipping on all orders this weekend",
    inputLabel: "Describe your ad offer",
    inputHint:
      "What product or service are you advertising? Include key benefits, offers, or unique selling points.",
    tones: [
      { label: "Conversion-Focused", value: "conversion-focused", emoji: "🎯" },
      { label: "Urgent", value: "urgent", emoji: "⚡" },
      { label: "Professional", value: "professional", emoji: "💼" },
      { label: "Attention-Grabbing", value: "attention-grabbing", emoji: "🔥" },
      { label: "Benefit-Driven", value: "benefit-driven", emoji: "✨" },
      { label: "Action-Oriented", value: "action-oriented", emoji: "🚀" },
    ],
    defaultTone: "conversion-focused",
    systemPrompt:
      "You are a Google Ads expert and PPC copywriter. Generate exactly 8 unique Google Ads headlines based on the user's offer and chosen style. Each headline MUST be under 30 characters to meet Google's character limit. Focus on benefits, urgency, and clear value propositions. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Generate 8 {tone} Google Ads headlines for: {input}",
    resultCount: 8,
    category: "marketing",
    seoKeywords: [
      "google ads headline generator",
      "google ads headlines",
      "PPC headline generator",
      "google ads copy",
      "free google ads generator",
      "ad headline ideas",
    ],
    howItWorks: [
      "Describe your product, service, or offer including key benefits",
      "Choose a style that aligns with your campaign goal and audience",
      "Get 8 headlines, each under 30 characters for Google Ads compliance",
      "Test your top picks in a Google Ads campaign and optimize based on CTR",
    ],
    tips: [
      "Every character counts — keep headlines under 30 chars to avoid truncation",
      "Include numbers or percentages when possible for higher click-through rates",
      "Include a clear benefit or unique selling proposition in each headline",
      "A/B test multiple headlines and let Google's algorithm find the winner",
    ],
  },
  {
    id: "twitter-bio",
    slug: "twitter-bio-generator",
    name: "Free AI Twitter Bio Generator",
    shortName: "Twitter Bio",
    description:
      "Create a standout Twitter/X bio that defines your personal or brand identity in seconds. AI generates witty, professional, or creative bios.",
    metaDescription:
      "Free AI Twitter bio generator. Create catchy, creative Twitter/X bios in seconds. Multiple styles available. No sign-up required.",
    icon: MessageCircle,
    gradient: "from-slate-500 to-zinc-600",
    placeholder:
      "e.g. Startup founder building AI tools for designers, dog lover and coffee addict",
    inputLabel: "Describe yourself",
    inputHint:
      "What do you do? What are your interests or accomplishments? What vibe do you want your bio to have?",
    tones: [
      { label: "Casual", value: "casual", emoji: "😎" },
      { label: "Professional", value: "professional", emoji: "💼" },
      { label: "Creative", value: "creative", emoji: "🎨" },
      { label: "Bold", value: "bold", emoji: "🔥" },
      { label: "Witty", value: "witty", emoji: "✨" },
      { label: "Inspirational", value: "inspirational", emoji: "🌟" },
    ],
    defaultTone: "casual",
    systemPrompt:
      "You are a social media branding expert specializing in Twitter/X profiles. Generate exactly 6 unique Twitter/X bios based on the user's description and chosen style. Each bio MUST be under 160 characters. Bios should be concise, memorable, and may include relevant emojis. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Generate 6 {tone} Twitter/X bios for: {input}",
    resultCount: 6,
    category: "social",
    seoKeywords: [
      "twitter bio generator",
      "twitter bio ideas",
      "X bio generator",
      "AI twitter bio",
      "free twitter bio generator",
      "best twitter bios",
    ],
    howItWorks: [
      "Describe who you are, what you do, and your personality or brand vibe",
      "Select a style that matches how you want to be perceived on Twitter/X",
      "Get 6 unique bios, each under 160 characters",
      "Copy your favorite directly into your Twitter/X profile",
    ],
    tips: [
      "Include your role or what you do — people scan bios quickly",
      "Add a touch of personality or humor to stand out from the crowd",
      "Use line breaks to separate ideas and make your bio scannable",
      "Include a link or call-to-action if you have space",
    ],
  },
  {
    id: "product-description",
    slug: "product-description-generator",
    name: "Free AI Product Description Generator",
    shortName: "Product Desc",
    description:
      "Write persuasive product descriptions that convert browsers into buyers. AI generates compelling, benefit-focused descriptions for any product.",
    metaDescription:
      "Free AI product description generator. Create persuasive, SEO-friendly product descriptions instantly. Multiple tones. No sign-up required.",
    icon: Package,
    gradient: "from-violet-500 to-purple-600",
    placeholder:
      "e.g. Wireless noise-canceling headphones, 40-hour battery life, premium leather ear cushions, priced at $299",
    inputLabel: "Describe your product",
    inputHint:
      "List key features, materials, benefits, price point, and target audience for your product.",
    tones: [
      { label: "Professional", value: "professional", emoji: "💼" },
      { label: "Persuasive", value: "persuasive", emoji: "🔥" },
      { label: "Luxury", value: "luxury", emoji: "💎" },
      { label: "Benefit-Focused", value: "benefit-focused", emoji: "🎯" },
      { label: "Informative", value: "informative", emoji: "💡" },
      { label: "Enthusiastic", value: "enthusiastic", emoji: "🚀" },
    ],
    defaultTone: "persuasive",
    systemPrompt:
      "You are an ecommerce copywriter and product marketing expert. Generate exactly 3 unique product descriptions based on the user's product details and chosen tone. Each description should be a well-crafted paragraph (50-100 words) that highlights key features, benefits, and speaks directly to the target customer. Use sensory language and compelling adjectives. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Generate 3 {tone} product descriptions for: {input}",
    resultCount: 3,
    category: "business",
    seoKeywords: [
      "product description generator",
      "AI product description",
      "free product description",
      "ecommerce product description",
      "product description writer",
      "Amazon product description",
    ],
    howItWorks: [
      "Describe your product's key features, materials, and benefits",
      "Choose a tone that matches your brand and target customer",
      "Get 3 compelling product descriptions optimized for conversions",
      "Select the best one and customize it for your product page",
    ],
    tips: [
      "Focus on benefits, not just features — tell customers how the product improves their life",
      "Use sensory words that help customers imagine using the product",
      "Include social proof elements like 'best-seller' or 'customer favorite' when relevant",
      "Optimize for search engines by naturally including product-related keywords",
    ],
  },
  {
    id: "mission-statement",
    slug: "mission-statement-generator",
    name: "Free AI Mission Statement Generator",
    shortName: "Mission Statement",
    description:
      "Articulate your company's purpose with a powerful mission statement. AI generates inspiring, clear, and impactful mission statements for any organization.",
    metaDescription:
      "Free AI mission statement generator. Create inspiring company mission statements in seconds. Multiple tones. No sign-up required.",
    icon: Compass,
    gradient: "from-emerald-500 to-green-600",
    placeholder:
      "e.g. A sustainable fashion brand that turns recycled ocean plastic into affordable streetwear",
    inputLabel: "Describe your organization",
    inputHint:
      "What does your organization do? Who do you serve? What problem do you solve or change do you want to make?",
    tones: [
      { label: "Inspirational", value: "inspirational", emoji: "🌟" },
      { label: "Professional", value: "professional", emoji: "💼" },
      { label: "Bold", value: "bold", emoji: "🔥" },
      { label: "Visionary", value: "visionary", emoji: "💡" },
      { label: "Concise", value: "concise", emoji: "🎯" },
      { label: "Aspirational", value: "aspirational", emoji: "✨" },
    ],
    defaultTone: "inspirational",
    systemPrompt:
      "You are a brand strategist and communications expert who helps organizations articulate their purpose. Generate exactly 6 unique mission statements based on the user's organization description and chosen tone. Each mission statement should be 1-2 sentences, clearly state what the organization does, who it serves, and why it matters. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Generate 6 {tone} mission statements for this organization: {input}",
    resultCount: 6,
    category: "business",
    seoKeywords: [
      "mission statement generator",
      "company mission statement",
      "AI mission statement",
      "free mission statement generator",
      "business mission statement",
      "nonprofit mission statement",
    ],
    howItWorks: [
      "Describe what your organization does and who it serves",
      "Choose a tone that reflects your organization's personality and values",
      "Receive 6 unique mission statements that communicate your purpose",
      "Select the one that resonates most and refine it with your team",
    ],
    tips: [
      "A great mission statement answers: what we do, for whom, and why it matters",
      "Keep it short enough that your team can memorize and repeat it",
      "Avoid jargon — use plain, powerful language anyone can understand",
      "Your mission should inspire action, not just describe what you sell",
    ],
  },
  {
    id: "faq",
    slug: "faq-generator",
    name: "Free AI FAQ Generator",
    shortName: "FAQ",
    description:
      "Generate a complete FAQ section for your website or product in seconds. AI creates relevant questions and clear, helpful answers based on your topic.",
    metaDescription:
      "Free AI FAQ generator. Create relevant FAQs with clear Q&A pairs for any topic or product instantly. No sign-up required.",
    icon: HelpCircle,
    gradient: "from-amber-500 to-yellow-600",
    placeholder:
      "e.g. A SaaS project management tool for remote teams, pricing starts at $9/month",
    inputLabel: "Describe your product or topic",
    inputHint:
      "What product, service, or topic do you need FAQs for? Include key details your audience would ask about.",
    tones: [
      { label: "Professional", value: "professional", emoji: "📝" },
      { label: "Business", value: "business", emoji: "💼" },
      { label: "Clear", value: "clear", emoji: "🎯" },
      { label: "Helpful", value: "helpful", emoji: "💡" },
      { label: "Friendly", value: "friendly", emoji: "✨" },
      { label: "Comprehensive", value: "comprehensive", emoji: "🔥" },
    ],
    defaultTone: "helpful",
    systemPrompt:
      "You are a customer experience expert and technical writer. Generate exactly 6 FAQ question-and-answer pairs based on the user's topic and chosen tone. Each pair should be formatted as a single string: 'Q: [question]\nA: [answer]'. Questions should anticipate what real users would ask. Answers should be clear, concise (2-3 sentences), and genuinely helpful. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Generate 6 {tone} FAQ Q&A pairs for: {input}",
    resultCount: 6,
    category: "business",
    seoKeywords: [
      "FAQ generator",
      "AI FAQ generator",
      "free FAQ generator",
      "FAQ question generator",
      "product FAQ generator",
      "website FAQ generator",
    ],
    howItWorks: [
      "Describe your product, service, or the topic you need FAQs for",
      "Choose a tone that matches your brand voice and audience expectations",
      "Get 6 relevant Q&A pairs covering common customer questions",
      "Add them to your website's FAQ page or help center",
    ],
    tips: [
      "Group FAQs by topic to make them easier for users to navigate",
      "Include both simple and detailed answers to satisfy different reader needs",
      "Update your FAQs regularly based on actual customer support tickets",
      "Use FAQs to address objections and reduce purchase hesitation",
    ],
  },
  // ── Batch 2: High-friction tools from Reddit demand research ──
  {
    id: "text-rewriter",
    slug: "text-rewriter",
    name: "Free AI Text Rewriter",
    shortName: "Text Rewriter",
    description:
      "Rewrite any text to sound different while keeping the original meaning. Perfect for paraphrasing, avoiding repetition, or making your writing sound more natural.",
    metaDescription:
      "Free AI text rewriter and paraphraser. Rewrite sentences, paragraphs, or full texts in seconds. Multiple tones. No sign-up required.",
    icon: RefreshCw,
    gradient: "from-violet-500 to-purple-600",
    placeholder: "Paste the text you want to rewrite...",
    inputLabel: "Your text",
    inputHint:
      "Paste any text you want rephrased — a sentence, paragraph, or full passage.",
    tones: [
      { label: "Professional", value: "professional", emoji: "\uD83D\uDCBC" },
      { label: "Casual", value: "casual", emoji: "\u270C\uFE0F" },
      { label: "Academic", value: "academic", emoji: "\uD83D\uDCDA" },
      { label: "Concise", value: "concise", emoji: "\u2702\uFE0F" },
      { label: "Persuasive", value: "persuasive", emoji: "\uD83D\uDCA1" },
      { label: "Creative", value: "creative", emoji: "\u2728" },
    ],
    defaultTone: "professional",
    systemPrompt:
      "You are an expert editor and paraphraser. Rewrite the user's text in a {tone} tone while preserving the original meaning and key information. Do NOT add new information or change the intent. Return exactly 6 rewritten versions as a JSON array of strings. Each version should be a complete rewrite, not just word swapping. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Rewrite the following text in a {tone} tone. Provide 6 different versions:\n\n{input}",
    resultCount: 6,
    category: "personal",
    seoKeywords: [
      "text rewriter",
      "paraphrase tool",
      "rewrite text",
      "sentence rewriter",
      "paragraph rewriter",
      "free paraphraser",
      "AI text rewriter",
    ],
    howItWorks: [
      "Paste any text you want to rewrite",
      "Choose the tone you want the rewrite to have",
      "Get 6 unique rewritten versions",
      "Pick the one that best fits your needs and context",
    ],
    tips: [
      "Longer input text gives the AI more context for better rewrites",
      "Try the 'Concise' tone to shorten wordy text",
      "The 'Academic' tone works well for essays and research papers",
      "Compare multiple versions — the best parts often come from different rewrites",
    ],
  },
  {
    id: "cold-email",
    slug: "cold-email-generator",
    name: "Free AI Cold Email Generator",
    shortName: "Cold Email",
    description:
      "Write cold emails that people actually read and reply to. Generates personalized outreach emails based on your prospect and offer.",
    metaDescription:
      "Free AI cold email generator. Write personalized cold outreach emails that get replies. Multiple tones. No sign-up required.",
    icon: Send,
    gradient: "from-sky-500 to-blue-600",
    placeholder: "e.g. I sell a payroll tool for small businesses, prospecting a 50-person agency",
    inputLabel: "Your offer + prospect context",
    inputHint:
      "Describe what you sell and who you're emailing. Include any details about the prospect if you have them.",
    tones: [
      { label: "Professional", value: "professional", emoji: "\uD83D\uDCBC" },
      { label: "Friendly", value: "friendly", emoji: "\uD83D\uDC4B" },
      { label: "Direct", value: "direct", emoji: "\uD83D\uDCA1" },
      { label: "Casual", value: "casual", emoji: "\u270C\uFE0F" },
      { label: "Curiosity", value: "curiosity", emoji: "\uD83D\uDD0D" },
      { label: "Consultative", value: "consultative", emoji: "\uD83D\uDC68\u200D\uD83D\uDCBB" },
    ],
    defaultTone: "professional",
    systemPrompt:
      "You are a cold outreach expert who has sent millions of cold emails and studied what gets replies. Generate 6 cold email variations in a {tone} tone based on the user's input. Each email should be 3-5 sentences max, open with something personalized (not \"I hope this finds you well\"), clearly state the value proposition, and end with a soft call to action. No robotic templates. Each email should feel like a human wrote it. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Write 6 {tone} cold emails for this outreach: {input}",
    resultCount: 6,
    category: "business",
    seoKeywords: [
      "cold email generator",
      "cold email templates",
      "AI cold email",
      "free cold email generator",
      "cold outreach email",
      "how to write cold emails",
    ],
    howItWorks: [
      "Describe your product/service and who you're reaching out to",
      "Choose a tone that fits your brand and the prospect",
      "Get 6 cold email variations you can personalize and send",
      "Add a specific detail about the prospect before hitting send",
    ],
    tips: [
      "The first line should never be about you — lead with something about them",
      "Keep cold emails under 100 words. If they can't scan it in 10 seconds, they won't read it",
      "End with a question, not a request — 'Are you open to a quick chat?' beats 'Let me know if you're interested'",
      "Always customize at least one line per email. Even AI-generated emails need a personal touch",
    ],
  },
  {
    id: "linkedin-post",
    slug: "linkedin-post-generator",
    name: "Free AI LinkedIn Post Generator",
    shortName: "LinkedIn Post",
    description:
      "Create LinkedIn posts that get engagement and grow your audience. Generates posts in different formats and tones based on your topic.",
    metaDescription:
      "Free AI LinkedIn post generator. Write engaging LinkedIn posts that get likes and comments. Multiple formats and tones. No sign-up required.",
    icon: Linkedin,
    gradient: "from-blue-500 to-indigo-600",
    placeholder: "e.g. Lessons from building my first SaaS product to $10K MRR",
    inputLabel: "Your topic or story",
    inputHint:
      "Describe what you want to post about — a lesson learned, an opinion, a milestone, or a story.",
    tones: [
      { label: "Professional", value: "professional", emoji: "\uD83D\uDCBC" },
      { label: "Storytelling", value: "storytelling", emoji: "\uD83D\uDCDC" },
      { label: "Thought Leadership", value: "thought-leadership", emoji: "\uD83D\uDE80" },
      { label: "Conversational", value: "conversational", emoji: "\uD83E\uDD1D" },
      { label: "Provocative", value: "provocative", emoji: "\uD83D\uDD25" },
      { label: "Inspirational", value: "inspirational", emoji: "\u2B50" },
    ],
    defaultTone: "storytelling",
    systemPrompt:
      "You are a LinkedIn content strategist who understands what gets engagement on the platform. Generate 6 LinkedIn posts in a {tone} tone based on the user's topic. Each post should have: a strong hook in the first 1-2 lines, short paragraphs (1-2 sentences each), line breaks between paragraphs, and a clear takeaway or call to action. Avoid corporate jargon. Sound like a real person sharing real insights. Each post should be 100-200 words. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Write 6 {tone} LinkedIn posts about: {input}",
    resultCount: 6,
    category: "social",
    seoKeywords: [
      "linkedin post generator",
      "AI linkedin post",
      "linkedin content generator",
      "free linkedin post generator",
      "linkedin post ideas",
      "how to write linkedin posts",
    ],
    howItWorks: [
      "Describe the topic, story, or lesson you want to share",
      "Choose a format that fits your personal brand",
      "Get 6 LinkedIn posts with hooks, body, and CTAs",
      "Customize and post — add your own voice before publishing",
    ],
    tips: [
      "Start with 'I' or 'My' — first-person posts get 20% more engagement",
      "The first two lines are everything. That's all people see before '...see more'",
      "End with a question to drive comments. Comments = reach",
      "Share real failures and lessons, not just successes. Vulnerability gets engagement",
    ],
  },
  {
    id: "job-description",
    slug: "job-description-generator",
    name: "Free AI Job Description Generator",
    shortName: "Job Description",
    description:
      "Write clear, inclusive job descriptions that attract the right candidates. Generates JDs with responsibilities, requirements, and benefits.",
    metaDescription:
      "Free AI job description generator. Write clear, inclusive job postings that attract quality candidates. No sign-up required.",
    icon: ClipboardList,
    gradient: "from-amber-500 to-orange-600",
    placeholder: "e.g. Senior Frontend Developer for a B2B SaaS startup, remote, $120-150K",
    inputLabel: "Role details",
    inputHint:
      "Include the job title, company type, key responsibilities, and any must-have requirements.",
    tones: [
      { label: "Professional", value: "professional", emoji: "\uD83D\uDCBC" },
      { label: "Casual", value: "casual", emoji: "\uD83D\uDE0E" },
      { label: "Startup", value: "startup", emoji: "\uD83D\uDE80" },
      { label: "Corporate", value: "corporate", emoji: "\uD83C\uDFE2" },
      { label: "Creative", value: "creative", emoji: "\u2728" },
      { label: "Concise", value: "concise", emoji: "\u2702\uFE0F" },
    ],
    defaultTone: "professional",
    systemPrompt:
      "You are an expert HR writer who specializes in writing job descriptions that attract diverse, qualified candidates. Generate 6 job description variations in a {tone} tone based on the user's input. Each JD should include: a compelling opening paragraph, 4-6 key responsibilities, 3-5 requirements, and a brief benefits/perks section. Avoid gendered language, jargon, and unnecessary requirements. Keep each JD under 300 words. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Write 6 {tone} job descriptions for: {input}",
    resultCount: 6,
    category: "career",
    seoKeywords: [
      "job description generator",
      "AI job description",
      "free job description generator",
      "job posting generator",
      "how to write a job description",
      "job description template",
    ],
    howItWorks: [
      "Enter the role title, company context, and key details",
      "Choose a tone that matches your company culture",
      "Get 6 complete job descriptions with responsibilities and requirements",
      "Customize with your specific benefits, salary range, and application process",
    ],
    tips: [
      "Avoid 'required 10 years of experience' for roles that don't need it — it drives away diverse candidates",
      "Lead with what the candidate will do and learn, not just what they already need to know",
      "Include salary range — it filters out people who wouldn't accept the offer anyway",
      "Keep requirements to true must-haves. Nice-to-haves scare off qualified candidates who don't check every box",
    ],
  },
  {
    id: "performance-review",
    slug: "performance-review-generator",
    name: "Free AI Performance Review Generator",
    shortName: "Performance Review",
    description:
      "Write performance reviews and self-evaluations that are specific, constructive, and professional. No more staring at a blank page.",
    metaDescription:
      "Free AI performance review generator. Write self-evaluations and team reviews that are specific and professional. No sign-up required.",
    icon: Award,
    gradient: "from-yellow-500 to-amber-600",
    placeholder: "e.g. Senior Designer, led redesign of onboarding flow, mentored 2 junior designers",
    inputLabel: "Role and achievements",
    inputHint:
      "Describe the role, key accomplishments, challenges overcome, and areas for growth.",
    tones: [
      { label: "Professional", value: "professional", emoji: "\uD83D\uDCBC" },
      { label: "Achievement-focused", value: "achievement", emoji: "\uD83C\uDFC6" },
      { label: "Balanced", value: "balanced", emoji: "\u2696\uFE0F" },
      { label: "Leadership", value: "leadership", emoji: "\uD83D\uDC68\u200D\uD83D\uDCBC" },
      { label: "Growth-oriented", value: "growth", emoji: "\uD83C\uDF31" },
      { label: "Concise", value: "concise", emoji: "\u2702\uFE0F" },
    ],
    defaultTone: "balanced",
    systemPrompt:
      "You are an expert at writing performance reviews that are specific, evidence-based, and constructive. Generate 6 performance review or self-evaluation versions in a {tone} tone based on the user's input. Each should cover: key accomplishments with measurable impact, strengths demonstrated, challenges navigated, and areas for development. Use specific language — avoid vague phrases like 'hard worker' or 'team player'. Keep each review under 250 words. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Write 6 {tone} performance reviews for: {input}",
    resultCount: 6,
    category: "career",
    seoKeywords: [
      "performance review generator",
      "AI performance review",
      "self evaluation generator",
      "free performance review writer",
      "how to write a performance review",
      "performance review examples",
    ],
    howItWorks: [
      "Describe the role and key accomplishments from the review period",
      "Choose a tone that fits your company's review culture",
      "Get 6 review variations with specific, measurable language",
      "Edit to add personal details and specific metrics",
    ],
    tips: [
      "Use numbers wherever possible — 'reduced load time by 40%' beats 'improved performance'",
      "Mention specific projects by name, not vague descriptions of your work",
      "Include one honest area for growth — it shows self-awareness, not weakness",
      "Write reviews throughout the quarter, not just at review time. Keep a running document",
    ],
  },
  {
    id: "thank-you-note",
    slug: "thank-you-note-generator",
    name: "Free AI Thank You Note Generator",
    shortName: "Thank You Note",
    description:
      "Write the perfect thank you note after a job interview, meeting, or event. Generates personalized notes that sound genuine, not generic.",
    metaDescription:
      "Free AI thank you note generator for interviews, meetings, and events. Personalized, genuine, and professional. No sign-up required.",
    icon: Heart,
    gradient: "from-pink-500 to-rose-600",
    placeholder: "e.g. Post-interview thank you for a Product Manager role at Stripe, discussed growth strategy",
    inputLabel: "Context",
    inputHint:
      "Describe the situation — who you're thanking, what for, and any specific details from the interaction.",
    tones: [
      { label: "Professional", value: "professional", emoji: "\uD83D\uDCBC" },
      { label: "Warm", value: "warm", emoji: "\uD83E\uDD17" },
      { label: "Enthusiastic", value: "enthusiastic", emoji: "\uD83D\uDE4C" },
      { label: "Brief", value: "brief", emoji: "\u26A1" },
      { label: "Formal", value: "formal", emoji: "\uD83D\uDCDD" },
      { label: "Casual", value: "casual", emoji: "\u270C\uFE0F" },
    ],
    defaultTone: "warm",
    systemPrompt:
      "You are an expert at writing thank you notes that sound genuine and personal. Generate 6 thank you note variations in a {tone} tone based on the user's input. Each note should reference a specific detail from the interaction (the user will fill this in, but leave natural placeholders or prompts), express genuine gratitude, and reinforce interest or connection. Avoid generic phrases like 'thank you for your time.' Keep each note under 150 words. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Write 6 {tone} thank you notes for this situation: {input}",
    resultCount: 6,
    category: "career",
    seoKeywords: [
      "thank you note generator",
      "interview thank you email",
      "AI thank you note",
      "free thank you note generator",
      "post interview thank you",
      "thank you note after interview",
    ],
    howItWorks: [
      "Describe who you're thanking and the context (interview, meeting, gift, etc.)",
      "Choose a tone that matches the relationship and situation",
      "Get 6 personalized thank you notes",
      "Add one specific detail from your interaction before sending",
    ],
    tips: [
      "Always reference something specific from the conversation — it proves you were paying attention",
      "Send within 24 hours. Even a perfect note loses impact if it arrives on Tuesday for a Friday interview",
      "Keep it short. 3-5 sentences max. Hiring managers read these quickly",
      "Don't just thank them — reiterate your interest and add one more reason you're a fit",
    ],
  },
  {
    id: "apology-email",
    slug: "apology-email-generator",
    name: "Free AI Apology Email Generator",
    shortName: "Apology Email",
    description:
      "Write professional apology emails that acknowledge mistakes, take responsibility, and rebuild trust. For workplace and client situations.",
    metaDescription:
      "Free AI apology email generator. Write professional apologies that acknowledge mistakes and rebuild trust. No sign-up required.",
    icon: HeartHandshake,
    gradient: "from-red-500 to-rose-600",
    placeholder: "e.g. Missed a project deadline by 2 days, client is a long-term enterprise account",
    inputLabel: "Situation details",
    inputHint:
      "Describe what happened, who was affected, and the context. Be honest — the more detail, the better the apology.",
    tones: [
      { label: "Professional", value: "professional", emoji: "\uD83D\uDCBC" },
      { label: "Sincere", value: "sincere", emoji: "\uD83E\uDD17" },
      { label: "Formal", value: "formal", emoji: "\uD83D\uDCDD" },
      { label: "Direct", value: "direct", emoji: "\uD83D\uDCA1" },
      { label: "Empathetic", value: "empathetic", emoji: "\u2764\uFE0F" },
      { label: "Solution-focused", value: "solution", emoji: "\uD83D\uDD27" },
    ],
    defaultTone: "sincere",
    systemPrompt:
      "You are an expert in professional communication and conflict resolution. Generate 6 apology email variations in a {tone} tone based on the user's situation. Each apology must: acknowledge the specific mistake without excuses, take clear responsibility, express genuine understanding of the impact, and offer a concrete solution or next step. Never use defensive language or blame others. Keep each email under 200 words. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Write 6 {tone} apology emails for this situation: {input}",
    resultCount: 6,
    category: "personal",
    seoKeywords: [
      "apology email generator",
      "professional apology email",
      "AI apology writer",
      "free apology email generator",
      "how to write an apology email",
      "apology email template",
    ],
    howItWorks: [
      "Describe the situation honestly — what went wrong and who was impacted",
      "Choose a tone based on the severity and your relationship with the recipient",
      "Get 6 apology emails that acknowledge, take responsibility, and offer solutions",
      "Personalize with specific details before sending",
    ],
    tips: [
      "The best apologies don't include the word 'but.' Own it fully",
      "Always include what you're doing to prevent it from happening again",
      "Match the tone to the severity — a missed meeting and a major client error need different approaches",
      "Send it sooner rather than later. Delaying an apology makes it worse",
    ],
  },
  {
    id: "resignation-letter",
    slug: "resignation-letter-generator",
    name: "Free AI Resignation Letter Generator",
    shortName: "Resignation Letter",
    description:
      "Write a professional resignation letter that maintains relationships and leaves on good terms. Multiple tones for different situations.",
    metaDescription:
      "Free AI resignation letter generator. Write professional, graceful resignation letters for any situation. No sign-up required.",
    icon: LogOut,
    gradient: "from-slate-500 to-gray-600",
    placeholder: "e.g. Software Engineer leaving after 3 years, giving 2 weeks notice, moving to a new opportunity",
    inputLabel: "Your situation",
    inputHint:
      "Include your role, tenure, notice period, and reason for leaving (optional).",
    tones: [
      { label: "Professional", value: "professional", emoji: "\uD83D\uDCBC" },
      { label: "Warm", value: "warm", emoji: "\uD83E\uDD17" },
      { label: "Formal", value: "formal", emoji: "\uD83D\uDCDD" },
      { label: "Brief", value: "brief", emoji: "\u26A1" },
      { label: "Grateful", value: "grateful", emoji: "\uD83C\uDF1F" },
      { label: "Neutral", value: "neutral", emoji: "\uD83D\uDD10" },
    ],
    defaultTone: "professional",
    systemPrompt:
      "You are an expert in professional transitions. Generate 6 resignation letter variations in a {tone} tone based on the user's situation. Each letter should: clearly state the resignation, include the last working day, express appreciation (even if brief), and offer to help with the transition. Do NOT include where you're going unless the user mentioned it. Keep it professional — no negativity, no burning bridges. Each letter should be 100-200 words. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Write 6 {tone} resignation letters for: {input}",
    resultCount: 6,
    category: "career",
    seoKeywords: [
      "resignation letter generator",
      "AI resignation letter",
      "free resignation letter",
      "how to write a resignation letter",
      "resignation letter template",
      "two weeks notice letter",
    ],
    howItWorks: [
      "Describe your role, tenure, and notice period",
      "Choose a tone based on your relationship with the company",
      "Get 6 resignation letter variations",
      "Customize and deliver — ideally in person, with the letter as a follow-up",
    ],
    tips: [
      "Keep it short. A resignation letter isn't the place to explain your life story",
      "Don't say where you're going unless you want to. It's not required",
      "Always offer to help with the transition — it's professional and leaves a good impression",
      "Even if you're leaving a toxic job, keep the letter neutral. Save the honesty for Glassdoor",
    ],
  },
  {
    id: "dating-bio",
    slug: "dating-app-bio-generator",
    name: "Free AI Dating App Bio Generator",
    shortName: "Dating Bio",
    description:
      "Create a dating app bio that actually gets matches. Generates bios for Tinder, Bumble, and Hinge that show personality and start conversations.",
    metaDescription:
      "Free AI dating app bio generator. Create bios for Tinder, Bumble, and Hinge that get more matches. No sign-up required.",
    icon: Heart,
    gradient: "from-pink-500 to-fuchsia-600",
    placeholder: "e.g. 28M, software developer, love hiking and cooking, looking for something serious",
    inputLabel: "About you",
    inputHint:
      "Include your vibe, hobbies, what you're looking for, and anything that makes you unique.",
    tones: [
      { label: "Witty", value: "witty", emoji: "\uD83E\uDD2F" },
      { label: "Genuine", value: "genuine", emoji: "\uD83E\uDD17" },
      { label: "Bold", value: "bold", emoji: "\uD83D\uDD25" },
      { label: "Funny", value: "funny", emoji: "\uD83D\uDE02" },
      { label: "Subtle", value: "subtle", emoji: "\u2728" },
      { label: "Conversation-starting", value: "conversational", emoji: "\uD83D\uDCAC" },
    ],
    defaultTone: "witty",
    systemPrompt:
      "You are a dating profile expert who understands what makes people swipe right. Generate 6 dating app bios in a {tone} tone based on the user's description. Each bio should be 2-4 sentences, show personality (not just list hobbies), be specific and authentic (no generic cliches like 'I love to travel' or 'fluent in sarcasm'), and ideally include something that makes it easy for someone to start a conversation. Tailor for apps like Tinder, Bumble, or Hinge. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Write 6 {tone} dating app bios for: {input}",
    resultCount: 6,
    category: "social",
    seoKeywords: [
      "dating app bio generator",
      "tinder bio generator",
      "bumble bio generator",
      "hinge prompt generator",
      "AI dating bio",
      "free dating bio generator",
      "dating profile bio",
    ],
    howItWorks: [
      "Describe yourself — personality, hobbies, what makes you unique",
      "Choose a vibe that matches how you actually talk",
      "Get 6 dating bios that show personality and invite conversation",
      "Pick your favorite and tweak it to feel 100% you",
    ],
    tips: [
      "Avoid generic lines like 'I love to travel' — everyone says that. Say WHERE and WHY",
      "Include a detail that's specific to you — it gives matches an easy opening line",
      "Don't try to appeal to everyone. The right person will like the real you",
      "For Hinge: these bios work great as prompts. For Tinder: keep it punchy",
    ],
  },
  {
    id: "youtube-title",
    slug: "youtube-title-generator",
    name: "Free AI YouTube Title Generator",
    shortName: "YouTube Title",
    description:
      "Generate YouTube titles that boost click-through rate and search rankings. Creates titles people actually want to click.",
    metaDescription:
      "Free AI YouTube title generator. Create click-worthy YouTube video titles that boost CTR and rankings. No sign-up required.",
    icon: Play,
    gradient: "from-red-500 to-rose-600",
    placeholder: "e.g. A 10-minute tutorial on building a REST API with Node.js",
    inputLabel: "Video topic",
    inputHint:
      "Describe what your video is about, who it's for, and the main value or takeaway.",
    tones: [
      { label: "Click-worthy", value: "clickworthy", emoji: "\uD83D\uDD25" },
      { label: "SEO-optimized", value: "seo", emoji: "\uD83D\uDD0D" },
      { label: "How-to", value: "howto", emoji: "\uD83D\uDCDD" },
      { label: "Listicle", value: "listicle", emoji: "\uD83D\uDCCB" },
      { label: "Curiosity", value: "curiosity", emoji: "\uD83D\uDD0E" },
      { label: "Direct", value: "direct", emoji: "\uD83D\uDCA1" },
    ],
    defaultTone: "clickworthy",
    systemPrompt:
      "You are a YouTube growth expert who understands what makes people click. Generate 8 YouTube title variations in a {tone} style based on the user's video topic. Each title should be under 70 characters, create curiosity or clearly promise value, include relevant keywords for search, and feel natural (not clickbait). Vary the approach: some should be question-based, some number-based, some how-to, some provocative. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Generate 8 {tone} YouTube titles for a video about: {input}",
    resultCount: 8,
    category: "social",
    seoKeywords: [
      "youtube title generator",
      "AI youtube title",
      "free youtube title generator",
      "youtube video title ideas",
      "youtube title ideas",
      "how to name youtube videos",
    ],
    howItWorks: [
      "Describe your video content and target audience",
      "Choose a title style that fits your video format",
      "Get 8 YouTube titles optimized for clicks and search",
      "A/B test your top 2-3 picks using YouTube's title tester or thumbnails",
    ],
    tips: [
      "Keep titles under 60 characters — longer titles get truncated on mobile",
      "Put the most important words first. 'How to Build a REST API' beats 'Building a REST API: A Complete Guide'",
      "Numbers in titles increase CTR: '7 mistakes', 'in 10 minutes', '3 tools'",
      "Your title and thumbnail should work together. Don't repeat the same text in both",
    ],
  },
  {
    id: "newsletter-welcome",
    slug: "newsletter-welcome-email-generator",
    name: "Free AI Newsletter Welcome Email Generator",
    shortName: "Welcome Email",
    description:
      "Write a welcome email for your newsletter that sets expectations, builds excitement, and reduces unsubscribes.",
    metaDescription:
      "Free AI newsletter welcome email generator. Write onboarding emails that engage subscribers and reduce churn. No sign-up required.",
    icon: MailCheck,
    gradient: "from-teal-500 to-cyan-600",
    placeholder: "e.g. Weekly newsletter about productivity for remote workers, sends every Tuesday",
    inputLabel: "Newsletter details",
    inputHint:
      "Describe your newsletter topic, frequency, audience, and what subscribers can expect.",
    tones: [
      { label: "Professional", value: "professional", emoji: "\uD83D\uDCBC" },
      { label: "Friendly", value: "friendly", emoji: "\uD83D\uDC4B" },
      { label: "Enthusiastic", value: "enthusiastic", emoji: "\uD83C\uDF89" },
      { label: "Casual", value: "casual", emoji: "\u270C\uFE0F" },
      { label: "Personal", value: "personal", emoji: "\u2764\uFE0F" },
      { label: "Brief", value: "brief", emoji: "\u26A1" },
    ],
    defaultTone: "friendly",
    systemPrompt:
      "You are an email marketing expert who specializes in newsletter onboarding. Generate 6 newsletter welcome email variations in a {tone} tone based on the user's newsletter details. Each email should: welcome the subscriber, set clear expectations about what they'll receive and how often, deliver immediate value (a tip, insight, or resource), and include a soft call to action. Keep each email under 200 words. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Write 6 {tone} newsletter welcome emails for: {input}",
    resultCount: 6,
    category: "marketing",
    seoKeywords: [
      "newsletter welcome email",
      "welcome email generator",
      "AI welcome email",
      "free welcome email generator",
      "newsletter onboarding email",
      "how to write a welcome email",
    ],
    howItWorks: [
      "Describe your newsletter — topic, frequency, and target audience",
      "Choose a tone that matches your newsletter's personality",
      "Get 6 welcome emails that set expectations and deliver immediate value",
      "Customize with your specific links, resources, and personal touches",
    ],
    tips: [
      "Deliver something valuable in the very first email — don't just say 'thanks for subscribing'",
      "Set clear expectations: how often will you email, and what will they learn?",
      "The welcome email has the highest open rate of any email you'll send. Make it count",
      "Include a reply prompt — 'Hit reply and tell me what you're working on' boosts engagement",
    ],
  },
  {
    id: "press-release",
    slug: "press-release-generator",
    name: "Free AI Press Release Generator",
    shortName: "Press Release",
    description:
      "Write professional press releases that get media coverage. Generates announcements with the right structure, quotes, and boilerplate.",
    metaDescription:
      "Free AI press release generator. Write professional press releases with quotes and proper structure. No sign-up required.",
    icon: Newspaper,
    gradient: "from-indigo-500 to-violet-600",
    placeholder: "e.g. Startup raising $5M Series A, AI-powered project management tool, based in San Francisco",
    inputLabel: "Announcement details",
    inputHint:
      "Include what you're announcing, key facts, quotes you want included, and company background.",
    tones: [
      { label: "Professional", value: "professional", emoji: "\uD83D\uDCBC" },
      { label: "Exciting", value: "exciting", emoji: "\uD83C\uDF89" },
      { label: "Formal", value: "formal", emoji: "\uD83D\uDCDD" },
      { label: "Startup", value: "startup", emoji: "\uD83D\uDE80" },
      { label: "Concise", value: "concise", emoji: "\u2702\uFE0F" },
      { label: "Story-driven", value: "story", emoji: "\uD83D\uDCDC" },
    ],
    defaultTone: "professional",
    systemPrompt:
      "You are a PR expert who has written press releases that got covered by major publications. Generate 6 press release variations in a {tone} tone based on the user's announcement. Each press release should follow standard PR format: a compelling headline, dateline, opening paragraph with the key news, supporting details, a quote from a key person, and a brief boilerplate about the company. Keep each release under 400 words. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Write 6 {tone} press releases for this announcement: {input}",
    resultCount: 6,
    category: "marketing",
    seoKeywords: [
      "press release generator",
      "AI press release",
      "free press release generator",
      "how to write a press release",
      "press release template",
      "press release writer",
    ],
    howItWorks: [
      "Describe your announcement — what's new, key facts, and why it matters",
      "Choose a tone that matches your brand and the news",
      "Get 6 press releases with proper PR format, quotes, and structure",
      "Add real quotes from your team and specific metrics before distributing",
    ],
    tips: [
      "The headline should contain the news, not just the company name. 'Acme raises $5M' beats 'Acme Announces Funding'",
      "Include real numbers and specifics — journalists need facts, not fluff",
      "The quote should add perspective, not repeat the news. What does this mean for the industry/customers?",
      "Keep the boilerplate short — 2-3 sentences about what the company does",
    ],
  },
  {
    id: "review-response",
    slug: "review-response-generator",
    name: "Free AI Review Response Generator",
    shortName: "Review Response",
    description:
      "Write professional responses to customer reviews — positive, negative, and neutral. Shows you care and builds trust with future customers.",
    metaDescription:
      "Free AI review response generator. Write professional replies to customer reviews on Google, Yelp, and more. No sign-up required.",
    icon: MessageSquareHeart,
    gradient: "from-emerald-500 to-green-600",
    placeholder: "e.g. 3-star Google review: 'Food was great but service was slow, waited 30 minutes for our order'",
    inputLabel: "The review",
    inputHint:
      "Paste the review you're responding to, including the star rating and platform if relevant.",
    tones: [
      { label: "Professional", value: "professional", emoji: "\uD83D\uDCBC" },
      { label: "Empathetic", value: "empathetic", emoji: "\u2764\uFE0F" },
      { label: "Gracious", value: "gracious", emoji: "\uD83C\uDF1F" },
      { label: "Direct", value: "direct", emoji: "\uD83D\uDCA1" },
      { label: "Friendly", value: "friendly", emoji: "\uD83D\uDC4B" },
      { label: "Solution-focused", value: "solution", emoji: "\uD83D\uDD27" },
    ],
    defaultTone: "professional",
    systemPrompt:
      "You are a customer experience expert who specializes in online reputation management. Generate 6 review responses in a {tone} tone based on the user's review. Each response should: thank the reviewer, address their specific points (not generic responses), and show that a real person read their review. For negative reviews: acknowledge the issue, apologize sincerely, and offer a resolution. For positive reviews: express genuine gratitude and reinforce what they liked. Keep each response under 100 words. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Write 6 {tone} responses to this customer review: {input}",
    resultCount: 6,
    category: "business",
    seoKeywords: [
      "review response generator",
      "google review response",
      "AI review response",
      "free review response generator",
      "how to respond to reviews",
      "review reply generator",
    ],
    howItWorks: [
      "Paste the review you need to respond to, including the star rating",
      "Choose a tone that matches the situation and your brand",
      "Get 6 professional review responses",
      "Personalize and post — future customers read these responses",
    ],
    tips: [
      "Always address the specific points in the review, not just say 'thanks for your feedback'",
      "Respond to negative reviews within 24 hours — it shows you're attentive and can turn critics into fans",
      "Future customers read your negative review responses more than your positive ones",
      "Never get defensive. Even unfair reviews are an opportunity to show your character",
    ],
  },
  {
    id: "landing-page-headline",
    slug: "landing-page-headline-generator",
    name: "Free AI Landing Page Headline Generator",
    shortName: "Landing Page Headline",
    description:
      "Write landing page headlines that convert visitors into customers. Generates headlines with subheadings and value propositions.",
    metaDescription:
      "Free AI landing page headline generator. Create high-converting headlines and subheadings for your landing pages. No sign-up required.",
    icon: Layout,
    gradient: "from-orange-500 to-red-600",
    placeholder: "e.g. Project management tool for remote teams, replaces Asana/Notion, saves 5 hours/week",
    inputLabel: "Product/service details",
    inputHint:
      "Describe what you offer, who it's for, and the main benefit or transformation.",
    tones: [
      { label: "Benefit-driven", value: "benefit", emoji: "\uD83C\uDFC6" },
      { label: "Direct", value: "direct", emoji: "\uD83D\uDCA1" },
      { label: "Curiosity", value: "curiosity", emoji: "\uD83D\uDD0D" },
      { label: "Bold", value: "bold", emoji: "\uD83D\uDD25" },
      { label: "Problem-solution", value: "problem-solution", emoji: "\uD83D\uDD27" },
      { label: "Minimal", value: "minimal", emoji: "\u2728" },
    ],
    defaultTone: "benefit",
    systemPrompt:
      "You are a conversion rate optimization expert who has written landing page headlines for companies that generate millions in revenue. Generate 8 landing page headline + subheading pairs in a {tone} style based on the user's product or service. Each result should be formatted as 'HEADLINE | Subheading'. The headline should be under 12 words, the subheading under 20 words. Focus on the outcome or transformation, not the features. Each pair should take a different angle. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Generate 8 {tone} landing page headline + subheading pairs for: {input}",
    resultCount: 8,
    category: "marketing",
    seoKeywords: [
      "landing page headline generator",
      "AI headline generator",
      "free landing page headline",
      "website headline generator",
      "hero headline generator",
      "conversion headline generator",
    ],
    howItWorks: [
      "Describe your product, service, or offer and who it's for",
      "Choose a style that fits your landing page's approach",
      "Get 8 headline + subheading pairs optimized for conversion",
      "A/B test your top picks — even small changes can double conversion rates",
    ],
    tips: [
      "Focus on the outcome, not the tool. 'Get more done' beats 'Project management software'",
      "The headline + subheading should work together: headline hooks, subheading explains",
      "Specificity converts. 'Save 5 hours a week' beats 'Save time'",
      "Your headline should be instantly understandable. If someone can't grasp it in 3 seconds, rewrite it",
    ],
  },
  {
    id: "paragraph-expander",
    slug: "paragraph-expander",
    name: "Free AI Paragraph Expander",
    shortName: "Paragraph Expander",
    description:
      "Expand short sentences or bullet points into full, well-developed paragraphs. Perfect for essays, reports, and content that needs more depth.",
    metaDescription:
      "Free AI paragraph expander. Turn short notes into full, well-developed paragraphs. Multiple tones. No sign-up required.",
    icon: Maximize2,
    gradient: "from-cyan-500 to-blue-600",
    placeholder: "e.g. Social media has changed how businesses communicate with customers",
    inputLabel: "Your short text or notes",
    inputHint:
      "Paste a sentence, bullet point, or short outline that you want expanded into a full paragraph.",
    tones: [
      { label: "Academic", value: "academic", emoji: "\uD83D\uDCDA" },
      { label: "Professional", value: "professional", emoji: "\uD83D\uDCBC" },
      { label: "Conversational", value: "conversational", emoji: "\uD83D\uDCAC" },
      { label: "Persuasive", value: "persuasive", emoji: "\uD83D\uDCA1" },
      { label: "Descriptive", value: "descriptive", emoji: "\uD83D\uDD0D" },
      { label: "Storytelling", value: "storytelling", emoji: "\uD83D\uDCDC" },
    ],
    defaultTone: "academic",
    systemPrompt:
      "You are an expert writer who specializes in developing ideas into full, well-structured paragraphs. Expand the user's short text into a {tone} paragraph. Each variation should be 4-6 sentences, develop the idea with supporting details, examples, or reasoning, maintain the original meaning and intent, and flow naturally. Do NOT add unrelated information — stay focused on the original idea. Return exactly 6 expanded paragraph variations as a JSON array of strings. Return ONLY a JSON array of strings, no other text.",
    userPromptTemplate:
      "Expand this into a full {tone} paragraph (4-6 sentences): {input}",
    resultCount: 6,
    category: "personal",
    seoKeywords: [
      "paragraph expander",
      "AI paragraph expander",
      "expand text",
      "make paragraph longer",
      "sentence expander",
      "free paragraph expander",
      "text expander AI",
    ],
    howItWorks: [
      "Paste a short sentence, bullet point, or incomplete thought",
      "Choose a tone that matches your writing context",
      "Get 6 expanded paragraphs that develop your idea fully",
      "Pick the best one and adjust any details to match your voice",
    ],
    tips: [
      "The more specific your input, the better the expansion. 'AI is changing marketing' is too vague — 'AI is changing how small businesses target ads on social media' is much better",
      "Try the 'Academic' tone for essays and the 'Professional' tone for business writing",
      "Don't just accept the first result — compare all 6 and mix the best parts",
      "Use this to overcome writer's block, then edit to make it truly yours",
    ],
  },
];

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return tools.find((t) => t.slug === slug);
}
