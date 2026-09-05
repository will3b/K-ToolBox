# 🧰 K-ToolBox — Production-Grade AI Writing Suite

<p align="center">
  <strong>A high-performance, self-hostable suite of 30 specialized AI writing tools with multi-provider LLM support, built on Next.js 16 (App Router), Tailwind CSS v4, SQLite, Prisma ORM, and Docker.</strong>
</p>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Features](#-features)
- [Prerequisites Before Installing](#-prerequisites-before-installing)
- [Environment Variables Configuration](#-environment-variables-configuration)
- [Deployment Guide](#-deployment-guide)
  - [Method 1: Docker Compose (Recommended)](#method-1-docker-compose-recommended)
  - [Method 2: Standalone Node / Bun with Systemd](#method-2-standalone-node--bun-with-systemd)
- [Reverse Proxy Setup (HAProxy & Caddy)](#-reverse-proxy-setup-haproxy--caddy)
  - [HAProxy Configuration](#haproxy-configuration)
  - [Caddy Configuration](#caddy-configuration)
- [Post-Installation Configuration (AI Setup)](#-post-installation-configuration-ai-setup)
- [Monetization & Webhook Configuration](#-monetization--webhook-configuration)
- [Health Checks & Observability](#-health-checks--observability)
- [Database Maintenance & Backups](#-database-maintenance--backups)
- [Troubleshooting & FAQ](#-troubleshooting--faq)
- [License](#-license)

---

## 🌟 Overview

**K-ToolBox** provides 30 prompt-engineered, context-aware writing micro-tools designed for career advancement, digital marketing, social media engagement, and business communications.

It includes:
- **Free Tier with Daily Limits**: 5 daily generations per tool per IP address (managed via a leak-free, auto-pruning TTL cache).
- **Pro Tier ($9 One-Time)**: Cryptographically signed token sessions (HMAC-SHA256) granting permanent unlimited access.
- **Dynamic AI Switching**: Configure or switch LLM providers (OpenAI, Anthropic, Gemini, Groq, Together, or self-hosted vLLM/Ollama) at runtime via the protected `/settings` dashboard.
- **SEO & Structured Data**: Complete JSON-LD schemas (`WebApplication`, `BreadcrumbList`, `FAQPage`, `WebSite`, `Organization`) and dynamic sitemaps.

---

## 🏗 Architecture & Tech Stack

```
                     ┌───────────────────────────┐
                     │   Client (Web / Mobile)   │
                     └─────────────┬─────────────┘
                                   │ (HTTPS: 443)
                     ┌─────────────▼─────────────┐
                     │   HAProxy / Reverse Proxy │
                     └─────────────┬─────────────┘
                                   │ (HTTP: 3000)
                     ┌─────────────▼─────────────┐
                     │ K-ToolBox (Next.js 16/Bun)│
                     └──────┬──────┬──────┬──────┘
                            │      │      │
            ┌───────────────┘      │      └────────────────┐
            ▼                      ▼                       ▼
    ┌───────────────┐     ┌─────────────────┐     ┌──────────────────┐
    │ SQLite (Data) │     │ AI Providers    │     │ Payment Webhooks │
    │ (toolbox.db)  │     │ (OpenAI/Claude) │     │ (Stripe/Lemon)   │
    └───────────────┘     └─────────────────┘     └──────────────────┘
```

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Standalone Output)
- **UI & Styling**: React 19, [Tailwind CSS v4](https://tailwindcss.com/), Radix UI primitives, [Framer Motion](https://www.framer.com/motion/), Lucide Icons
- **Database & ORM**: SQLite with [Prisma ORM](https://www.prisma.io/)
- **Runtime**: [Bun](https://bun.sh/) / Node.js
- **Containerization**: Docker (Alpine multi-stage build)

---

## ✨ Features

- **30 Specialized Writing Tools**:
  - **Career**: Cover Letter, Resume Summary, LinkedIn Headline, Resignation Letter, Performance Review, Job Description, Thank You Note.
  - **Marketing & SEO**: Blog Titles, Meta Descriptions, Google Ads Headlines, Landing Page Headlines, Press Releases, Product Descriptions, FAQs.
  - **Social Media**: LinkedIn Posts, Instagram Bios, Twitter Bios, YouTube Descriptions, YouTube Titles.
  - **Business**: Business Names, Slogans, Mission Statements, Cold Emails, Newsletter Welcome Emails, Review Responses.
  - **Personal & General**: Dating Bios, Apology Emails, Text Rewriter, Paragraph Expander.
- **6 Tone Modifiers per Tool**: Professional, Casual, Creative, Bold, Formal, and Friendly.
- **Command Palette (Cmd+K / Ctrl+K)**: Instant keyboard navigation across all tools.
- **Dark Mode Support**: Seamless theme switching powered by `next-themes`.
- **Integrated Product Analytics**: Pre-configured PostHog event tracking across all conversion funnels.

---

## 📋 Prerequisites Before Installing

Before deploying K-ToolBox, ensure your host server has:

1. **Docker & Docker Compose**:
   ```bash
   docker --version
   docker compose version
   ```
2. **Domain Name & TLS Certificate**:
   - A registered domain (e.g., `toolbox.yourdomain.com`) pointing to your server's public IP.
   - An SSL certificate (provisioned via Let's Encrypt / Certbot or managed by your reverse proxy).
3. **An AI Provider API Key**:
   - OpenAI API key, Anthropic API key, Google Gemini API key, OpenRouter key, or a self-hosted OpenAI-compatible endpoint (Ollama / vLLM / LiteLLM).
4. **(Optional) Payment Gateway Credentials**:
   - **Stripe**: Secret Key, Publishable Key, Webhook Secret, Price ID.
   - **LemonSqueezy**: API Key, Store ID, Product/Variant ID, Webhook Secret.

---

## ⚙ Environment Variables Configuration

Copy the example environment file and configure your secrets:

```bash
cp .env.example .env
```

### Environment Reference

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | Public URL of your deployed application | `https://toolbox.yourdomain.com` |
| `DATABASE_URL` | **Yes** | Path to SQLite database file | `file:/app/data/toolbox.db` |
| `SETTINGS_PASSWORD` | **Yes** | Master password to unlock `/settings` | `StrongAdminPassword987!` |
| `PRO_COOKIE_SECRET` | **Yes** | 32+ character random string for signing Pro cookies | `openssl rand -hex 32` |
| `APP_PORT` | No | Host port mapped by Docker Compose (default: 3000) | `3000` |
| `NEXT_PUBLIC_POSTHOG_KEY` | No | PostHog API Key for product analytics | `phc_...` |
| `NEXT_PUBLIC_POSTHOG_HOST`| No | PostHog ingest host | `https://us.i.posthog.com` |
| `STRIPE_SECRET_KEY` | No | Stripe Secret Key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe Webhook signing secret | `whsec_...` |
| `STRIPE_PRICE_ID` | No | Stripe Price ID for $9 Pro one-time purchase | `price_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Stripe Publishable Key | `pk_live_...` |
| `LEMONSQUEEZY_API_KEY` | No | LemonSqueezy API Key | `eyJ...` |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | No | LemonSqueezy Webhook signing secret | `secret_...` |
| `LEMONSQUEEZY_STORE_ID` | No | LemonSqueezy Store ID | `12345` |
| `LEMONSQUEEZY_PRODUCT_ID` | No | LemonSqueezy Variant / Product ID | `67890` |

---

## 🚀 Deployment Guide

### Method 1: Docker Compose (Recommended)

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/will3b/K-ToolBox.git
   cd K-ToolBox
   ```

2. **Configure `.env`**:
   ```bash
   cp .env.example .env
   nano .env
   ```

3. **Build and Launch the Container**:
   ```bash
   docker compose up -d --build
   ```

4. **Verify Container Health**:
   ```bash
   docker compose ps
   # Check logs
   docker compose logs -f app
   ```

---

### Method 2: Standalone Node / Bun with Systemd

1. **Install Dependencies and Build**:
   ```bash
   bun install
   bunx prisma generate
   bun run build
   ```

2. **Copy Systemd Unit**:
   ```bash
   sudo cp toolbox.service /etc/systemd/system/k-toolbox.service
   sudo nano /etc/systemd/system/k-toolbox.service  # Adjust WorkingDirectory if needed
   ```

3. **Enable and Start Service**:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now k-toolbox
   sudo systemctl status k-toolbox
   ```

---

## 🌐 Reverse Proxy Setup (HAProxy & Caddy)

### HAProxy Configuration

If you run multiple Docker applications behind a central **HAProxy** instance, add the following to `/etc/haproxy/haproxy.cfg`:

```haproxy
frontend https-in
    bind *:443 ssl crt /etc/ssl/certs/yourdomain.pem
    mode http

    # ACL for K-ToolBox
    acl is_ktoolbox hdr(host) -i toolbox.yourdomain.com
    use_backend ktoolbox_backend if is_ktoolbox

backend ktoolbox_backend
    mode http
    balance roundrobin

    # Forward proxy headers
    http-request set-header X-Forwarded-Proto https if { ssl_fc }
    http-request set-header X-Forwarded-For %[src]
    http-request set-header Host %[req.hdr(host)]

    # Active container health checking via /api/health
    option httpchk GET /api/health
    http-check expect status 200

    server ktoolbox_container 127.0.0.1:3000 check inter 10s fall 3 rise 2
```

Reload HAProxy:
```bash
sudo systemctl reload haproxy
```

---

### Caddy Configuration

If using Caddy as your reverse proxy, use the included `Caddyfile`:

```caddy
toolbox.yourdomain.com {
    reverse_proxy localhost:3000 {
        header_up Host {host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
        header_up X-Real-IP {remote_host}
    }
}
```

---

## 🔑 Post-Installation Configuration (AI Setup)

Once the application is running:

1. Visit `https://toolbox.yourdomain.com/settings` in your browser.
2. Enter the `SETTINGS_PASSWORD` configured in your `.env`.
3. Select your AI provider:
   - **OpenAI**: Base URL `https://api.openai.com/v1`, Model `gpt-4o-mini`
   - **Anthropic**: Base URL `https://api.anthropic.com/v1`, Model `claude-3-5-haiku-20241022`
   - **Google Gemini**: Base URL `https://generativelanguage.googleapis.com/v1beta/openai`, Model `gemini-2.5-flash`
   - **OpenRouter**: Base URL `https://openrouter.ai/api/v1`, Model `anthropic/claude-3.5-sonnet`
   - **Groq**: Base URL `https://api.groq.com/openai/v1`, Model `llama-3.3-70b-versatile`
   - **Custom / Local**: Enter your Ollama/vLLM URL (e.g. `http://host.docker.internal:11434/v1`).
4. Click **Test connection** to verify connectivity.
5. Click **Save** to activate. The configuration takes effect immediately across all 30 tools without restarting the container.

---

## 💳 Monetization & Webhook Configuration

### Stripe Webhooks
1. In the Stripe Dashboard, navigate to **Developers > Webhooks > Add Endpoint**.
2. Endpoint URL: `https://toolbox.yourdomain.com/api/webhooks/stripe`
3. Event to listen for: `checkout.session.completed`.
4. Copy the Signing Secret and set it as `STRIPE_WEBHOOK_SECRET` in `.env`.

### LemonSqueezy Webhooks
1. In the LemonSqueezy Dashboard, navigate to **Settings > Webhooks > Add Webhook**.
2. Callback URL: `https://toolbox.yourdomain.com/api/webhooks/lemonsqueezy`
3. Event to listen for: `order_created`.
4. Copy the Webhook Secret and set it as `LEMONSQUEEZY_WEBHOOK_SECRET` in `.env`.

---

## 🩺 Health Checks & Observability

### Health Check Endpoint
- **URL**: `GET /api/health`
- **Response**:
  ```json
  {
    "status": "ok",
    "timestamp": "2026-09-05T15:00:00.000Z",
    "database": "connected",
    "responseTimeMs": 2
  }
  ```

### Docker Container Inspection
```bash
docker inspect --format='{{json .State.Health}}' k-toolbox | jq
```

---

## 💾 Database Maintenance & Backups

The SQLite database is stored in the Docker volume `toolbox_data` mounted at `/app/data/toolbox.db`.

### Creating a Backup
```bash
# Safely snapshot the SQLite database
docker exec -t k-toolbox sqlite3 /app/data/toolbox.db ".backup '/app/data/backup-$(date +%F).db'"

# Copy the backup to host
docker cp k-toolbox:/app/data/backup-$(date +%F).db ./backup.db
```

### Restoring from Backup
```bash
docker compose down
cp ./backup.db ./data/toolbox.db
docker compose up -d
```

---

## ❓ Troubleshooting & FAQ

#### Q: The `/settings` page gives "Unauthorized"?
Make sure the password you typed matches `SETTINGS_PASSWORD` in `.env`. If using Docker, ensure you restarted the container after modifying `.env` (`docker compose up -d --force-recreate`).

#### Q: Generations fail with "AI is not configured"?
Visit `/settings`, enter your AI API key, run "Test connection", and click "Save".

#### Q: AI generation times out?
K-ToolBox enforces a 30-second timeout on upstream AI calls. If using a local LLM (Ollama), ensure your model is loaded into GPU memory and responds within 30 seconds.

#### Q: User claims they paid for Pro but do not have unlimited access?
1. Check webhook logs (`docker compose logs app | grep Webhook`).
2. Have the user go to `/pricing`, enter their checkout email under "Already purchased?", and click **Activate**.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
