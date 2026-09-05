'use client';

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePostHog } from 'posthog-js/react';
import { track } from '@/lib/analytics';
import { ArrowRight, Zap, Linkedin, Briefcase, Megaphone, Instagram, Mail, FileText, User, Play, BookOpen, Search, Target, MessageCircle, Package, Compass, HelpCircle, RefreshCw, Send, ClipboardList, Award, Heart, LogOut, HeartHandshake, MailCheck, Newspaper, MessageSquareHeart, Layout, Maximize2, type LucideIcon } from 'lucide-react';
import { tools, type ToolConfig } from '@/lib/tools';
import { Generator } from '@/components/generator';

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

/* Omit non-serializable fields that are stripped server-side */
type ClientToolConfig = Omit<ToolConfig, 'icon' | 'gradient'>;

/* ── Copy helpers ──────────────────────────────── */

function toolSeoHeadline(id: string): string {
  switch (id) {
    case 'linkedin-headline':
      return 'Why most LinkedIn headlines are boring (and how to fix yours)';
    case 'business-name':
      return 'How to name a business without losing your mind';
    case 'slogan':
      return 'The anatomy of a slogan people actually remember';
    case 'instagram-bio':
      return 'Writing an Instagram bio that converts followers';
    case 'email-subject':
      return 'Email subject lines that don\'t get ignored';
    case 'cover-letter':
      return 'Why your cover letter is getting ignored (and how to fix it)';
    case 'resume-summary':
      return 'The 3-second test: why your resume summary matters more than you think';
    case 'youtube-description':
      return 'YouTube descriptions that boost your search rankings';
    case 'blog-title':
      return 'Blog titles people actually click (instead of scrolling past)';
    case 'meta-description':
      return 'How to write meta descriptions that improve your click-through rate';
    case 'google-ads-headline':
      return 'Writing Google Ads headlines that get clicks without burning budget';
    case 'twitter-bio':
      return 'Twitter bios that make people follow you in under 2 seconds';
    case 'product-description':
      return 'Product descriptions that sell (without sounding like a sales pitch)';
    case 'mission-statement':
      return 'Why your mission statement doesn\'t need to change the world';
    case 'faq':
      return 'FAQs that reduce support tickets and build trust';
    case 'text-rewriter':
      return 'Why rewriting your own text is harder than writing it from scratch';
    case 'cold-email':
      return 'Cold emails that don\'t suck: the difference between deleted and replied';
    case 'linkedin-post':
      return 'The LinkedIn algorithm doesn\'t care about your post. Here\'s what it actually rewards';
    case 'job-description':
      return 'Your job description is scaring away the people you want to hire';
    case 'performance-review':
      return 'Performance reviews don\'t have to be painful (for either side)';
    case 'thank-you-note':
      return 'The post-interview thank you note that actually moves the needle';
    case 'apology-email':
      return 'How to apologize professionally without making it worse';
    case 'resignation-letter':
      return 'How to quit a job without burning the bridge';
    case 'dating-bio':
      return 'Your dating app bio is the shortest thing you\'ll ever write with the highest stakes';
    case 'youtube-title':
      return 'YouTube titles that get clicked (without being clickbait)';
    case 'newsletter-welcome':
      return 'The welcome email is your highest-open-rate email. Stop wasting it.';
    case 'press-release':
      return 'Most press releases get deleted in 5 seconds. Here\'s how to change that.';
    case 'review-response':
      return 'Your review responses are a marketing channel, not a chore';
    case 'landing-page-headline':
      return 'Your landing page headline is doing 80% of the conversion work';
    case 'paragraph-expander':
      return 'Turn one sentence into a paragraph without sounding like you\'re padding it';
    default:
      return '';
  }
}

function toolSeoContent(id: string): React.ReactNode[] {
  switch (id) {
    case 'linkedin-headline':
      return [
        <p key="1">Go look at 10 random LinkedIn profiles. Chances are, at least 7 of them say something like &ldquo;Passionate [Role] at [Company]&rdquo; or &ldquo;Results-driven professional with X years of experience.&rdquo; These aren&rsquo;t headlines. They&rsquo;re descriptions that got formatted like headlines.</p>,
        <p key="2">The people who get the most inbound messages on LinkedIn treat their headline like ad copy, not a resume line. They lead with what they do for other people, not what their job title is. &ldquo;I help SaaS founders reduce churn by 30%&rdquo; is infinitely better than &ldquo;Senior Customer Success Manager at Acme Corp.&rdquo;</p>,
        <p key="3">This generator works because it doesn&rsquo;t just plug your job title into a template. You describe what you actually do and the tone you want, and it writes headlines that sound specific to you. Professional, creative, achievement-focused, casual, bold, or minimal — pick the one that matches how you actually talk.</p>,
      ];
    case 'business-name':
      return [
        <p key="1">Naming a business is a bizarrely emotional process. You start with a list of 50 ideas, realize 48 of them are taken as .com domains, and end up stress-eating while refreshing Namecheap at 2am. I&rsquo;ve been there more times than I&rsquo;d like to admit.</p>,
        <p key="2">The best business names do one of three things: they describe what the business does (Stripe, Mailchimp), they evoke a feeling (Slack, Notion), or they&rsquo;re short enough to become a verb (Google, Zoom). This generator tries to give you options in all three categories.</p>,
        <p key="3">One thing I&rsquo;d recommend: don&rsquo;t overthink it. Pick something you don&rsquo;t hate, check that the social handles are available, and move on. The name matters less than you think — nobody remembers that Nike was originally called Blue Ribbon Sports.</p>,
      ];
    case 'slogan':
      return [
        <p key="1">A slogan is not a mission statement. It&rsquo;s not a description of your product. It&rsquo;s the thing someone repeats to their friend when they&rsquo;re trying to explain what you do. &ldquo;Oh, it&rsquo;s like Uber but for dogs&rdquo; is a positioning statement. &ldquo;Because your dog deserves a ride too&rdquo; could be a slogan.</p>,
        <p key="2">The best slogans are specific enough to mean something but vague enough to apply broadly. &ldquo;Just Do It&rdquo; works for sneakers, gym memberships, and starting a business. &ldquo;Quality You Can Trust&rdquo; could apply to literally anything and therefore means nothing.</p>,
        <p key="3">This generator gives you 8 options per run in different styles. I&rsquo;d suggest generating a few rounds, then picking pieces from different results. The best slogan is often a mashup of two decent ones.</p>,
      ];
    case 'instagram-bio':
      return [
        <p key="1">Your Instagram bio has a 150-character limit. That&rsquo;s roughly two sentences. In those two sentences, you need to communicate who you are, what you do, why someone should care, and ideally include a call to action. It&rsquo;s the hardest short-form writing you&rsquo;ll ever do.</p>,
        <p key="2">The bios that actually convert followers share a few things in common: they&rsquo;re specific (not &ldquo;creator&rdquo; but &ldquo;motion designer for tech startups&rdquo;), they use line breaks to separate ideas, and they include some form of social proof or direction.</p>,
        <p key="3">This generator handles the formatting for you — line breaks, emojis, the right character count. You just describe who you are and pick a vibe, and it writes bios that don&rsquo;t look like every other template out there.</p>,
      ];
    case 'email-subject':
      return [
        <p key="1">The average person receives 121 emails per day. I probably delete 118 of them. The ones I open have subject lines that create a tiny information gap — just enough curiosity that I can&rsquo;t not click. &ldquo;Quick question about Q3&rdquo; is devastatingly effective.</p>,
        <p key="2">The worst subject lines try to say everything: &ldquo;Monthly Newsletter: Updates on Our New Feature Launch, Customer Success Stories, and Upcoming Webinar.&rdquo; That&rsquo;s not a subject line. That&rsquo;s a table of contents.</p>,
        <p key="3">This generator gives you 8 options per run in styles ranging from professional to curiosity-driven. My advice: pick your top 3, send test emails to a small segment of your list, and see which one actually wins.</p>,
      ];
    case 'cover-letter':
      return [
        <p key="1">Most cover letters are dead on arrival because they start with &ldquo;I am writing to express my interest in...&rdquo; Hiring managers read that exact sentence hundreds of times per posting. By the second paragraph, they&rsquo;ve already decided.</p>,
        <p key="2">A good cover letter does one thing: it makes the reader want to look at your resume. It doesn&rsquo;t restate your resume — it adds context, personality, and a narrative that a bullet-point list can&rsquo;t. Think of it as the movie trailer, not the plot summary.</p>,
        <p key="3">This generator writes a complete 3-4 paragraph letter tailored to the role and company you mention. The more specific you are about the position and your background, the better the output will be. Don&rsquo;t skip the details.</p>,
      ];
    case 'resume-summary':
      return [
        <p key="1">Recruiters spend an average of 7.4 seconds on a resume before deciding to keep reading or toss it. Your summary is the first thing they see. If it doesn&rsquo;t hook them in those 7 seconds, nothing else matters.</p>,
        <p key="2">The difference between a good and bad resume summary is specificity. &ldquo;Experienced marketing professional&rdquo; says nothing. &ldquo;B2B SaaS marketer who grew organic traffic from 10K to 200K monthly visitors&rdquo; says everything.</p>,
        <p key="3">This generator creates summaries based on your actual experience and goals. Include your years of experience, key skills, and what kind of role you&rsquo;re targeting. The more context you give, the less generic the output.</p>,
      ];
    case 'youtube-description':
      return [
        <p key="1">YouTube descriptions serve two purposes: they help the algorithm understand your video (which affects search rankings and suggested video placement), and they give viewers a reason to watch. Most creators treat them as an afterthought.</p>,
        <p key="2">The first 100-150 characters of your description are what shows up in search results and on the video page before the &ldquo;Show more&rdquo; button. That&rsquo;s your hook. The rest should include timestamps, relevant links, and keyword-rich context.</p>,
        <p key="3">This generator creates descriptions optimized for both the algorithm and human readers. Describe your video&rsquo;s content and target audience, and it handles the structure, keywords, and formatting.</p>,
      ];
    case 'blog-title':
      return [
        <p key="1">On average, 8 out of 10 people will read a blog post&rsquo;s headline, but only 2 out of 10 will click through. That means your title is doing 80% of the work. Get it wrong, and the best content in the world goes unread.</p>,
        <p key="2">The highest-performing blog titles create what psychologists call an &ldquo;information gap&rdquo; — they promise to teach you something specific, but hold back just enough detail that you need to click to find out. Listicles, how-tos, and contrarian statements all use this technique.</p>,
        <p key="3">This generator creates titles across different styles — some are straightforward, some are provocative, some are list-based. Try generating a few rounds and testing which style gets the most clicks for your audience.</p>,
      ];
    case 'meta-description':
      return [
        <p key="1">Meta descriptions don&rsquo;t directly affect Google rankings, but they directly affect whether people click on your result. A well-written meta description can increase click-through rate by 20-30%. That&rsquo;s free traffic you&rsquo;re leaving on the table if you ignore them.</p>,
        <p key="2">The ideal meta description is 150-160 characters, includes your target keyword, and ends with a call to action. It should accurately describe the page content — misleading descriptions actually hurt your rankings over time because people bounce back.</p>,
        <p key="3">This generator creates SEO-friendly meta descriptions based on your page topic and target keyword. It keeps them within the optimal character range and includes natural-sounding calls to action.</p>,
      ];
    case 'google-ads-headline':
      return [
        <p key="1">Google Ads headlines have a 30-character limit. That&rsquo;s not a suggestion — it&rsquo;s a hard cutoff. If your headline is 31 characters, Google will truncate it, often in a way that loses the key word. Every character counts.</p>,
        <p key="2">The best Google Ads headlines are specific, benefit-driven, and include the keyword the user searched for. &ldquo;Buy Running Shoes&rdquo; is generic. &ldquo;Trail Running Shoes - 40% Off&rdquo; is specific, benefit-driven, and includes the keyword.</p>,
        <p key="3">Responsive Search Ads let you upload up to 15 headlines and Google tests combinations automatically. This generator gives you strong options to fill those slots with variations that cover different angles and keyword matches.</p>,
      ];
    case 'twitter-bio':
      return [
        <p key="1">Your Twitter bio is 160 characters of personal branding real estate. It shows up in search results, on your profile, and next to every tweet you post. It&rsquo;s the most-read piece of writing you&rsquo;ll ever publish — and most people spend less than a minute on it.</p>,
        <p key="2">The best Twitter bios do one of three things: state what you do clearly, make people laugh, or provoke curiosity. The worst ones try to do all three and end up doing none. Pick one angle and commit to it.</p>,
        <p key="3">This generator creates bios in different styles depending on whether you&rsquo;re a professional, creator, or just want something memorable. Include what you do and any achievements or details that make you stand out.</p>,
      ];
    case 'product-description':
      return [
        <p key="1">E-commerce studies consistently show that detailed, well-written product descriptions can increase sales by 20-30%. The description is where you overcome objections, paint a picture of the product in use, and give the customer permission to buy.</p>,
        <p key="2">Product descriptions aren&rsquo;t about features — they&rsquo;re about the gap between the customer&rsquo;s current life and their life after using your product. &ldquo;Waterproof jacket, 500D nylon&rdquo; is a feature. &ldquo;Stay dry during unexpected downpours without the bulk&rdquo; is a benefit.</p>,
        <p key="3">This generator writes descriptions that balance features with benefits, include sensory language, and match your chosen tone. Describe what the product is, who it&rsquo;s for, and what makes it different from alternatives.</p>,
      ];
    case 'mission-statement':
      return [
        <p key="1">Most mission statements fail because they try to impress rather than clarify. &ldquo;To be the premier global provider of synergistic solutions&rdquo; sounds impressive but means absolutely nothing. Your team can&rsquo;t rally behind words they don&rsquo;t understand.</p>,
        <p key="2">A good mission statement answers three questions in one sentence: what do we do, who do we do it for, and why does it matter? Google&rsquo;s original mission was &ldquo;to organize the world&rsquo;s information and make it universally accessible and useful.&rdquo; Simple, specific, ambitious.</p>,
        <p key="3">This generator creates mission statements in different tones — from professional to inspirational. Include what your organization does and who it serves. The more specific you are, the less generic the output will be.</p>,
      ];
    case 'faq':
      return [
        <p key="1">A well-written FAQ page serves two audiences: potential customers who have questions before buying, and search engines that index your Q&A pairs as rich results. A single FAQ page can generate dozens of long-tail search impressions.</p>,
        <p key="2">The best FAQs are based on real questions, not what you wish people would ask. Check your customer support tickets, sales calls, and social media DMs — those are your FAQ goldmine. The questions people actually ask are the ones that should be on the page.</p>,
        <p key="3">This generator creates relevant Q&A pairs based on your product or topic description. The answers are concise but substantive — long enough to be helpful, short enough to scan. Include details about your pricing, features, or common objections.</p>,
      ];
    case 'text-rewriter':
      return [
        <p key="1">Rewriting your own text is weirdly difficult. You know what you want to say, but every alternative sounds either identical to the original or completely different in meaning. It&apos;s like trying to tickle yourself — your brain already knows the punchline.</p>,
        <p key="2">The use cases are endless: students paraphrasing for clarity, professionals making casual language more formal, content creators repurposing the same idea across platforms without getting penalized for duplicate content. The key is changing the structure and word choice while keeping the meaning intact.</p>,
        <p key="3">This rewriter gives you 6 variations per run in different tones. The &ldquo;Concise&rdquo; mode is especially useful for cutting fluff from wordy text. Compare a few versions and mix the best parts — the result will sound more natural than any single rewrite.</p>,
      ];
    case 'cold-email':
      return [
        <p key="1">The average professional receives 120+ emails per day. Your cold email is competing with their boss, their biggest client, and that newsletter they actually meant to unsubscribe from. &ldquo;I hope this finds you well&rdquo; is not going to win that fight.</p>,
        <p key="2">The cold emails that get replies share a few traits: they&apos;re short (under 100 words), they lead with something about the prospect (not the sender), and they end with a question instead of a request. The best ones feel like they took 10 minutes to write, even if they took 10 seconds.</p>,
        <p key="3">This generator creates cold emails that actually sound human. Describe your offer and who you&apos;re targeting, and it&apos;ll write variations you can customize with one or two personal details before sending.</p>,
      ];
    case 'linkedin-post':
      return [
        <p key="1">LinkedIn&apos;s algorithm doesn&apos;t care how insightful your post is. It cares about dwell time (how long people spend reading it), comments (especially in the first hour), and shares. A technically brilliant post with no hook will get buried. A mediocre post with a killer first line can go viral.</p>,
        <p key="2">The posts that perform best on LinkedIn are personal, specific, and structured for scanning. Short paragraphs. Line breaks. A hook that creates an information gap. Most people write LinkedIn posts like they&apos;re writing a memo — dense blocks of corporate speak that nobody wants to read on their phone.</p>,
        <p key="3">This generator creates posts with the right structure: strong hooks, scannable formatting, and natural CTAs. Describe your topic, pick a format, and customize before posting. Always add your own voice — the AI gives you the skeleton, you add the personality.</p>,
      ];
    case 'job-description':
      return [
        <p key="1">Most job descriptions are written by HR people who don&apos;t fully understand the role, approved by legal teams who add disclaimers, and posted on sites where they look identical to every other listing. Is it any wonder that the best candidates often don&apos;t apply?</p>,
        <p key="2">Research from Harvard Business School found that gendered language in job descriptions reduces the applicant pool significantly. Words like &ldquo;competitive&rdquo; and &ldquo;dominant&rdquo; deter female applicants, while &ldquo;collaborative&rdquo; and &ldquo;supportive&rdquo; deter male applicants. Most JDs are full of these words without anyone noticing.</p>,
        <p key="3">This generator writes inclusive, clear job descriptions that attract the right candidates. Include the role details, choose a tone that matches your culture, and customize with your specific requirements and benefits.</p>,
      ];
    case 'performance-review':
      return [
        <p key="1">Performance reviews are one of the most universally dreaded tasks in the corporate world. Managers stare at blank pages trying to remember what their reports did all year. Employees struggle to self-promote without sounding arrogant. The result is often vague praise that helps nobody.</p>,
        <p key="2">The best performance reviews are specific and evidence-based. &ldquo;Hard worker&rdquo; means nothing. &ldquo;Reduced API response time by 40%, resulting in a 15% improvement in user retention&rdquo; means everything. The difference is numbers, specificity, and impact.</p>,
        <p key="3">This generator creates reviews with measurable language based on the accomplishments you provide. Describe your role and key wins, and it&apos;ll write variations you can edit with specific metrics and project names.</p>,
      ];
    case 'thank-you-note':
      return [
        <p key="1">Hiring managers consistently say that post-interview thank you notes rarely affect their decision. But here&apos;s the thing: they notice when you don&apos;t send one. It&apos;s not that the note swings the hire — it&apos;s that skipping it signals a lack of follow-through.</p>,
        <p key="2">The worst thank you notes are generic. &ldquo;Thank you for your time, I enjoyed learning about the role&rdquo; is a template, not a note. The best ones reference a specific moment from the conversation — something that shows you were actually listening and thinking.</p>,
        <p key="3">This generator creates personalized thank you notes based on the interview context you provide. Describe the role, the conversation, and any specific topics discussed, and it&apos;ll write variations that sound genuine and specific.</p>,
      ];
    case 'apology-email':
      return [
        <p key="1">A bad apology is worse than no apology. &ldquo;I&apos;m sorry you feel that way&rdquo; is not an apology — it&apos;s a subtle way of blaming the other person. &ldquo;Mistakes were made&rdquo; is passive voice designed to avoid responsibility. People see through both instantly.</p>,
        <p key="2">The structure of a genuine professional apology is simple but counterintuitive: acknowledge the specific mistake, take full responsibility, show you understand the impact, and offer a concrete fix. No explanations. No &ldquo;but.&rdquo; No defensive language. Most people skip step 2 and jump straight to explaining why it wasn&apos;t their fault.</p>,
        <p key="3">This generator writes apology emails that actually take responsibility. Describe what happened honestly — the more context you give, the more specific and genuine the apology will sound.</p>,
      ];
    case 'resignation-letter':
      return [
        <p key="1">A resignation letter is one of the few professional documents where the goal is to be as unremarkable as possible. It shouldn&apos;t be inspiring, funny, or memorable. It should be clear, professional, and polite. The drama happens in person — the letter is just the paperwork.</p>,
        <p key="2">The biggest mistake people make is over-explaining or including negative feedback about the company. Even if your experience was terrible, the resignation letter is not the place for it. Save that for Glassdoor, preferably after your last paycheck clears.</p>,
        <p key="3">This generator creates clean, professional resignation letters in different tones. Whether you want warm and grateful or brief and neutral, it handles the format so you can focus on the conversation.</p>,
      ];
    case 'dating-bio':
      return [
        <p key="1">Dating app bios are the shortest high-stakes writing you&apos;ll ever do. You have roughly 300 characters to convince someone you&apos;re interesting enough to swipe right on. And yet most bios are either empty, a list of adjectives, or a joke that sounded better in your head.</p>,
        <p key="2">The bios that get matches have one thing in common: specificity. &ldquo;I love travel&rdquo; is on 90% of dating profiles. &ldquo;Just got back from 3 weeks in Japan and I&apos;m already planning my return trip for the cherry blossoms&rdquo; is on almost none — and it&apos;s infinitely more interesting.</p>,
        <p key="3">This generator creates dating bios that show personality instead of listing traits. Describe yourself honestly — your sense of humor, your hobbies, what you&apos;re looking for — and it&apos;ll write bios that sound like you, just better.</p>,
      ];
    case 'youtube-title':
      return [
        <p key="1">YouTube titles serve two masters: the algorithm and the viewer. The algorithm needs keywords to understand what your video is about. The viewer needs a reason to click. Most titles optimize for one and ignore the other. The best ones do both without feeling forced.</p>,
        <p key="2">Titles under 60 characters perform significantly better on mobile, where most YouTube browsing happens. Put the most important words first because they get truncated. And never promise something the video doesn&apos;t deliver — that&apos;s how you get low audience retention, which kills your rankings.</p>,
        <p key="3">This generator creates titles in different styles — click-worthy, SEO-optimized, how-to, listicle, and more. Describe your video and target audience, and it&apos;ll write titles designed to both rank and get clicked.</p>,
      ];
    case 'newsletter-welcome':
      return [
        <p key="1">The welcome email has the highest open rate of any email you&apos;ll ever send — often 50-80%. Your regular newsletter gets 20-30% on a good day. And yet most welcome emails say something like &ldquo;Thanks for subscribing! Here&apos;s what to expect.&rdquo; and call it a day. That&apos;s like getting a first date and talking about the weather.</p>,
        <p key="2">A great welcome email does three things: it delivers immediate value (not just a promise of future value), it sets clear expectations about what&apos;s coming and when, and it starts building a relationship. The subscriber just gave you their email address — their most guarded digital real estate. Don&apos;t waste it.</p>,
        <p key="3">This generator creates welcome emails that actually engage new subscribers from the start. Describe your newsletter and audience, and it&apos;ll write variations that deliver value immediately and set the right expectations.</p>,
      ];
    case 'press-release':
      return [
        <p key="1">Journalists receive hundreds of press releases per day. Most get deleted based on the subject line alone. The ones that survive have a clear, newsworthy headline, a strong opening paragraph that answers who/what/when/where/why, and actual facts instead of marketing fluff.</p>,
        <p key="2">The biggest mistake in press releases is burying the news. If you&apos;re announcing a $5M fundraise, that should be in the headline and the first sentence. Not paragraph three. Journalists don&apos;t have time to decode your story — they need to know what&apos;s newsworthy in under 5 seconds.</p>,
        <p key="3">This generator creates press releases in standard PR format with headlines, datelines, quotes, and boilerplates. Describe your announcement and key facts, and it&apos;ll write releases ready for distribution (after you add real quotes).</p>,
      ];
    case 'review-response':
      return [
        <p key="1">Here&apos;s something most business owners don&apos;t realize: your review responses aren&apos;t for the person who left the review. They&apos;re for the thousands of people who will read that review before deciding whether to visit your business. Your response to a 1-star review is often more influential than the review itself.</p>,
        <p key="2">The best review responses share a few traits: they address the specific complaint (not a generic &ldquo;thanks for your feedback&rdquo;), they take ownership without being defensive, and they offer a real resolution. Even if the reviewer is unreasonable, your response shows future customers how you handle difficult situations.</p>,
        <p key="3">This generator creates professional review responses tailored to the specific review you received. Paste the review, choose a tone, and get variations that show you actually read and care about customer feedback.</p>,
      ];
    case 'landing-page-headline':
      return [
        <p key="1">Your landing page headline does 80% of the conversion work. Most visitors decide whether to stay or leave within 3-5 seconds of arriving. If your headline doesn&apos;t immediately communicate what you offer and why they should care, they&apos;re gone. The rest of your page never gets a chance.</p>,
        <p key="2">The highest-converting headlines focus on the outcome, not the tool. &ldquo;Ship features 3x faster&rdquo; converts better than &ldquo;Project management software for engineering teams.&rdquo; People don&apos;t buy tools — they buy better versions of their current situation.</p>,
        <p key="3">This generator creates headline + subheading pairs optimized for conversion. Describe your product and value proposition, and it&apos;ll write variations that focus on outcomes, use specificity, and pass the 3-second test.</p>,
      ];
    case 'paragraph-expander':
      return [
        <p key="1">Sometimes you have a complete thought but it&apos;s just... too short. A bullet point. A single sentence. An idea that needs to become a paragraph for an essay, report, or article. Expanding it without adding fluff is harder than it sounds — most people just end up repeating the same idea with different words.</p>,
        <p key="2">Good paragraph expansion adds supporting details, examples, or reasoning that develop the original idea. Bad expansion just pads with filler phrases like &ldquo;in today&apos;s world&rdquo; and &ldquo;it is important to note that.&rdquo; The difference is substance vs. volume.</p>,
        <p key="3">This generator expands short text into full paragraphs by adding relevant supporting details. It stays focused on your original idea without going off-topic. The more specific your input, the better and more relevant the expansion will be.</p>,
      ];
    default:
      return [];
  }
}

/* ── Component ─────────────────────────────────── */

export function ToolPageClient({ tool }: { tool: ClientToolConfig }) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const Icon = iconMap[tool.id] || Zap;
  const posthog = usePostHog();

  useEffect(() => {
    track(posthog, 'tool_page_viewed', { tool: tool.slug, category: tool.category });
  }, [posthog, tool.slug, tool.category]);

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-foreground/70" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground leading-tight">
                {tool.shortName}
              </h1>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                {tool.resultCount} results per generation
              </p>
            </div>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            {toolPageDescription(tool.id)}
          </p>
        </div>

        <div className="border-t border-border mb-8" />

        {/* Generator with auto-focus (#4) */}
        <Generator tool={tool} inputRef={inputRef} autoFocus />

        {/* Related tools */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-3">
            Related tools
          </p>
          <div className="border border-border rounded-md divide-y divide-border overflow-hidden">
            {tools
              .filter((t) => t.id !== tool.id)
              .slice(0, 3)
              .map((rt) => {
                const RIcon = iconMap[rt.id] || Zap;
                return (
                  <Link
                    key={rt.id}
                    href={`/${rt.slug}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors duration-100 group"
                  >
                    <RIcon className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground/70 transition-colors shrink-0" strokeWidth={1.5} />
                    <div className="flex-1 min-w-0">
                      <span className="text-[13px] font-medium text-foreground group-hover:text-foreground/80 transition-colors">
                        {rt.shortName}
                      </span>
                      <p className="text-[11px] text-muted-foreground/50 truncate mt-0.5">
                        {rt.description}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/20 group-hover:text-muted-foreground/60 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                );
              })}
          </div>
        </div>

        {/* SEO content */}
        <div className="mt-12 pt-8 border-t border-border space-y-4">
          <h2 className="text-sm font-medium text-foreground">
            {toolSeoHeadline(tool.id)}
          </h2>
          <div className="space-y-3 text-[12px] text-muted-foreground leading-[1.75]">
            {toolSeoContent(tool.id)}
          </div>
        </div>
      </div>
    </div>
  );
}

function toolPageDescription(id: string): string {
  switch (id) {
    case 'linkedin-headline':
      return 'Most people treat their LinkedIn headline like a job title. That\'s a waste. Your headline is 220 characters of prime real estate — the first thing recruiters, clients, and random connections see. This generator gives you options that actually sound like you wrote them, not like a LinkedIn template from 2019.';
    case 'business-name':
      return 'I\'ve spent more time naming side projects than actually building them. The problem isn\'t a lack of ideas — it\'s that most names either sound terrible, are already taken, or both. This tool generates names that are actually worth saying out loud. Some of them are even available as domains.';
    case 'slogan':
      return 'The difference between a forgettable brand and one that sticks in your head often comes down to six words. Nike has &ldquo;Just Do It.&rdquo; Apple has &ldquo;Think Different.&rdquo; You probably don\'t need something that legendary — but you do need something better than &ldquo;Quality You Can Trust.&rdquo;';
    case 'instagram-bio':
      return 'An Instagram bio is the shortest thing you\'ll ever write that still has to do the most work. It needs to say who you are, what you do, why someone should follow you, and look good doing it — all in 150 characters. This generator handles the hard part so you can focus on the aesthetic.';
    case 'email-subject':
      return 'I\'ve deleted emails with subject lines like &ldquo;Monthly Update #47&rdquo; and opened ones that said &ldquo;Quick question.&rdquo; The difference between a 12% open rate and a 40% open rate often comes down to a few words. This tool writes subject lines that people actually want to click.';
    case 'cover-letter':
      return 'Nobody likes writing cover letters, and hiring managers don\'t enjoy reading generic ones either. This generator creates a tailored cover letter based on the specific role and company you\'re applying to. The more context you provide about the position and your background, the more personalized and effective the result will be.';
    case 'resume-summary':
      return 'Your resume summary is the first thing recruiters read and the last thing most people spend time on. This tool generates a concise, impactful summary based on your actual experience and career goals. It\'s designed to pass the 7-second test.';
    case 'youtube-description':
      return 'A good YouTube description helps the algorithm understand your video and gives viewers a reason to watch. This generator creates descriptions with the right keywords, structure, and hooks to improve your video\'s search visibility and click-through rate.';
    case 'blog-title':
      return '80% of people read a blog title but only 20% click through. The title is doing most of the work. This generator creates headlines across different styles — listicles, how-tos, contrarian takes, and straightforward titles — so you can test what resonates with your audience.';
    case 'meta-description':
      return 'Meta descriptions don\'t directly affect rankings, but they can increase click-through rate by 20-30%. This generator creates SEO-friendly, 150-160 character descriptions that include your target keyword and end with a natural call to action.';
    case 'google-ads-headline':
      return 'Google Ads headlines have a hard 30-character limit. Every character counts. This generator creates concise, benefit-driven headlines that include your target keywords and are designed to maximize click-through rate within Google\'s constraints.';
    case 'twitter-bio':
      return 'Your Twitter bio shows up in search results, on your profile, and next to every tweet. It\'s 160 characters of personal branding. This generator creates bios that are specific, memorable, and match the vibe you want — professional, witty, or somewhere in between.';
    case 'product-description':
      return 'Well-written product descriptions can increase sales by 20-30%. This generator creates descriptions that balance features with benefits, use sensory language, and are tailored to your target customer. Describe your product and let the AI handle the persuasion.';
    case 'mission-statement':
      return 'Most mission statements are either so vague they mean nothing or so long nobody reads them. This generator creates concise, meaningful statements that answer three questions: what do you do, who do you do it for, and why does it matter?';
    case 'faq':
      return 'A well-written FAQ page reduces support tickets, builds trust, and generates long-tail search traffic. This generator creates relevant Q&A pairs based on your product or topic, with clear questions and concise, helpful answers.';
    case 'text-rewriter':
      return 'Paste any text and get 6 rewritten versions in the tone you choose. Whether you need to sound more professional, more concise, or just different, this rewriter gives you options that preserve your original meaning.';
    case 'cold-email':
      return 'Cold email is a numbers game, but the numbers only work if your emails don\'t sound like every other cold email. This generator writes outreach emails that lead with the prospect\'s perspective and end with a soft ask.';
    case 'linkedin-post':
      return 'Most LinkedIn posts get buried because they read like memos. This generator creates posts with the structure the algorithm rewards: strong hooks, short paragraphs, and CTAs that drive engagement.';
    case 'job-description':
      return 'Writing job descriptions that attract diverse, qualified candidates is harder than it looks. This generator creates inclusive JDs with clear responsibilities, realistic requirements, and a tone that matches your culture.';
    case 'performance-review':
      return 'Writer\'s block hits hardest when you\'re staring at a blank performance review form. This generator creates specific, evidence-based reviews that sound professional without being vague.';
    case 'thank-you-note':
      return 'A good post-interview thank you note references something specific from the conversation and reinforces your fit for the role. This generator creates genuine, personalized notes based on the context you provide.';
    case 'apology-email':
      return 'The hardest part of a professional apology is getting the tone right — sincere without being dramatic, responsible without being defensive. This generator helps you find that balance.';
    case 'resignation-letter':
      return 'A resignation letter should be short, professional, and bridge-preserving. This generator creates graceful letters in different tones, from warm and grateful to brief and neutral.';
    case 'dating-bio':
      return 'Your dating bio needs to show personality in under 300 characters. This generator creates bios for Tinder, Bumble, and Hinge that are specific, authentic, and designed to start conversations.';
    case 'youtube-title':
      return 'Your YouTube title needs to satisfy both the search algorithm and a human thumb hovering over a screen. This generator creates titles optimized for CTR and discoverability in different styles.';
    case 'newsletter-welcome':
      return 'Your welcome email has the highest open rate you\'ll ever get. This generator creates onboarding emails that deliver immediate value, set expectations, and start building a real relationship with new subscribers.';
    case 'press-release':
      return 'Most press releases get deleted in 5 seconds. This generator creates newsworthy press releases with proper PR format — headlines, datelines, quotes, and boilerplates — ready for distribution.';
    case 'review-response':
      return 'Your review responses are read by future customers, not just the reviewer. This generator creates professional, specific responses that show you care and can turn negative reviews into trust-building moments.';
    case 'landing-page-headline':
      return 'Your landing page headline has 3 seconds to convince visitors to stay. This generator creates headline + subheading pairs focused on outcomes and specificity, optimized for conversion.';
    case 'paragraph-expander':
      return 'Turn a single sentence or bullet point into a fully developed paragraph. This generator adds supporting details, examples, and reasoning while staying focused on your original idea.';
    default:
      return '';
  }
}
