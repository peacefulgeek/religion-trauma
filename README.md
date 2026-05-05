# The Faith Wound — Site 108

**Religious Trauma Recovery & Faith Deconstruction Resource Hub**

A full-stack, SSR-capable React + Express site built for the "The Faith Wound" niche — religious trauma, faith deconstruction, purity culture recovery, and post-faith identity. Designed to rank, monetize via Amazon Associates, and grow autonomously through AI-powered content generation.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started (Local)](#getting-started-local)
5. [Environment Variables](#environment-variables)
6. [Database Setup (PostgreSQL)](#database-setup-postgresql)
7. [Seeding Articles](#seeding-articles)
8. [DigitalOcean Deployment](#digitalocean-deployment)
9. [Bunny CDN Setup](#bunny-cdn-setup)
10. [Pushing to GitHub](#pushing-to-github)
11. [Cron Jobs & Automation](#cron-jobs--automation)
12. [Content Architecture](#content-architecture)
13. [Assessments](#assessments)
14. [SEO & AEO Stack](#seo--aeo-stack)
15. [Amazon Affiliate System](#amazon-affiliate-system)
16. [Design System](#design-system)
17. [Adding Articles Manually](#adding-articles-manually)
18. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
Browser ──► DigitalOcean App Platform
              │
              ▼
         Express Server (Node.js)
              │
         ┌────┴────┐
         │         │
      API Routes  SSR Renderer
         │         │
         ▼         ▼
      PostgreSQL  Vite/React
      (DO Managed)  (react-router-dom v6)
              │
         Bunny CDN
         (images/assets)
```

The server handles both the REST API (`/api/*`) and SSR rendering for all page routes. In production, Vite builds the client bundle and the SSR entry, which Express uses to render full HTML with injected head tags (via `react-helmet-async`) for SEO.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, TypeScript |
| SSR | Vite SSR + `renderToString` + `react-helmet-async` |
| Backend | Express 4, Node.js 20+ |
| Database | PostgreSQL 15 (DigitalOcean Managed) |
| Styling | Pure CSS with design tokens (no Tailwind) |
| AI Writing | OpenAI-compatible API (gpt-4.1-mini / DeepSeek) |
| CDN | Bunny CDN (images, assets) |
| Hosting | DigitalOcean App Platform |
| Cron | `node-cron` (runs in same process) |
| Affiliate | Amazon Associates (auto-matched by category) |

---

## Project Structure

```
the-faith-wound/
├── .do/
│   └── app.yaml                  # DigitalOcean App Platform config
├── dist/                         # Built output (git-ignored)
│   ├── client/                   # Vite client bundle
│   └── index.js                  # Compiled Express server
├── public/
│   ├── images/                   # Static images (hero, articles, author)
│   └── favicon.svg
├── scripts/
│   ├── build-server.mjs          # esbuild server compiler
│   ├── seed.mjs                  # Database seed script
│   └── start-with-cron.mjs       # Production entry point
├── server/
│   ├── index.ts                  # Express app + SSR setup
│   └── routes/
│       ├── articles.ts           # GET /api/articles, GET /api/articles/:slug
│       ├── assessments.ts        # GET/POST /api/assessments
│       ├── health.ts             # GET /health
│       ├── llms.ts               # GET /llms.txt, /llms-full.txt
│       ├── robots.ts             # GET /robots.txt
│       └── sitemap.ts            # GET /sitemap.xml
├── src/
│   ├── client/
│   │   ├── components/           # Shared UI components
│   │   │   ├── ArticleCard.tsx
│   │   │   ├── AuthorByline.tsx
│   │   │   ├── AutoAffiliates.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileHeader.tsx
│   │   │   ├── ReadingProgress.tsx
│   │   │   ├── SEOHead.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TLDR.tsx
│   │   ├── pages/
│   │   │   ├── assessments/      # 3 interactive assessments
│   │   │   ├── AboutPage.tsx
│   │   │   ├── ArticlePage.tsx
│   │   │   ├── ArticlesPage.tsx
│   │   │   ├── AssessmentPage.tsx
│   │   │   ├── AssessmentsPage.tsx
│   │   │   ├── CategoryPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── NotFoundPage.tsx
│   │   │   ├── PrivacyPage.tsx
│   │   │   └── ToolsPage.tsx
│   │   ├── styles/
│   │   │   ├── tokens.css        # Design tokens + global styles
│   │   │   └── assessments.css   # Assessment-specific styles
│   │   ├── App.tsx               # Router config
│   │   ├── entry-client.tsx      # Client hydration entry
│   │   └── entry-server.tsx      # SSR render entry
│   ├── cron/
│   │   ├── asin-health-check.mjs
│   │   ├── generate-article.mjs
│   │   ├── product-spotlight.mjs
│   │   ├── refresh-monthly.mjs
│   │   └── refresh-quarterly.mjs
│   ├── data/
│   │   ├── asin-pool.json        # Amazon ASIN pool by category
│   │   ├── product-catalog.ts    # Curated book/resource catalog
│   │   ├── seed-articles.ts      # Articles 1–10
│   │   ├── seed-articles-2.ts    # Articles 11–20
│   │   └── seed-articles-3.ts    # Articles 21–30
│   ├── lib/
│   │   ├── aeo.mjs               # AEO helpers, robots.txt, llms.txt
│   │   ├── amazon-verify.mjs     # ASIN verification
│   │   ├── article-quality-gate.mjs  # Quality scoring
│   │   ├── articleJsonLd.mjs     # JSON-LD schema builders
│   │   ├── bunny.mjs             # Bunny CDN upload helper
│   │   ├── db.mjs                # PostgreSQL pool + query helpers
│   │   ├── deepseek-generate.mjs # AI article writing engine
│   │   └── match-products.mjs    # Affiliate product matching
│   └── types/
│       └── mjs.d.ts              # TypeScript declarations for .mjs modules
├── .env.example                  # All required environment variables
├── .gitignore
├── index.html                    # Vite HTML template
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Getting Started (Local)

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- PostgreSQL 15 (local or remote)

### Installation

```bash
git clone <your-repo-url> the-faith-wound
cd the-faith-wound
pnpm install
cp .env.example .env
# Edit .env with your values
```

### Development

```bash
pnpm dev
```

This runs Vite (port 5173) and the Express server (port 3000) concurrently. The server proxies Vite in development mode.

### Production Build

```bash
pnpm build
pnpm start
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in all values:

```env
# Server
NODE_ENV=production
PORT=3000

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# AI Writing Engine
OPENAI_API_KEY=your_openai_or_deepseek_key
OPENAI_BASE_URL=https://api.openai.com/v1   # or DeepSeek endpoint
AI_MODEL=gpt-4.1-mini                        # or deepseek-chat

# Amazon Associates
AMAZON_ASSOCIATE_TAG=thefaithwound-20

# Bunny CDN (add when ready)
BUNNY_API_KEY=
BUNNY_STORAGE_ZONE=
BUNNY_CDN_URL=

# Site
SITE_URL=https://thefaithwound.com
```

---

## Database Setup (PostgreSQL)

The database schema is auto-created on first run if it doesn't exist. The `db.mjs` module runs `CREATE TABLE IF NOT EXISTS` on startup.

**Tables created automatically:**
- `articles` — all article content, metadata, SEO fields
- `assessments` — assessment definitions
- `assessment_responses` — anonymous quiz responses

**For DigitalOcean Managed PostgreSQL:**

1. Create a Managed PostgreSQL cluster in DigitalOcean
2. Copy the connection string from the dashboard
3. Set `DATABASE_URL` in your App Platform environment variables

---

## Seeding Articles

After the database is set up and `DATABASE_URL` is configured:

```bash
pnpm seed
```

This inserts all 30 seed articles from `src/data/seed-articles*.ts` into the database. The seed script is idempotent — it uses `ON CONFLICT (slug) DO NOTHING` so it is safe to run multiple times.

---

## DigitalOcean Deployment

The project includes a pre-configured `.do/app.yaml` for DigitalOcean App Platform.

### Steps

1. **Push to GitHub** (see [Pushing to GitHub](#pushing-to-github))

2. **Create App on DigitalOcean:**
   - Go to [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Connect your GitHub repo
   - DigitalOcean will detect the `.do/app.yaml` automatically

3. **Set Environment Variables** in the App Platform dashboard:
   - `DATABASE_URL` — your Managed PostgreSQL connection string
   - `OPENAI_API_KEY` — for the AI writing engine
   - `AMAZON_ASSOCIATE_TAG` — your Associates tag
   - `SITE_URL` — your domain (e.g., `https://thefaithwound.com`)

4. **Deploy** — DigitalOcean will run `pnpm build` and then `pnpm start`

5. **Run seed** — After first deploy, open the App Console and run:
   ```bash
   node scripts/seed.mjs
   ```

### Custom Domain

Add your domain in the App Platform "Domains" tab. DigitalOcean handles SSL automatically.

---

## Bunny CDN Setup

Bunny CDN integration is ready but requires configuration. Once you have your Bunny account:

1. Create a Storage Zone (e.g., `thefaithwound`)
2. Create a Pull Zone connected to the storage zone
3. Set environment variables:
   ```env
   BUNNY_API_KEY=your_bunny_api_key
   BUNNY_STORAGE_ZONE=thefaithwound
   BUNNY_CDN_URL=https://thefaithwound.b-cdn.net
   ```

The `src/lib/bunny.mjs` module handles uploads. When `BUNNY_CDN_URL` is set, the AI article generator will automatically upload hero images to Bunny and store the CDN URL in the `hero_url` column.

**Static images** in `public/images/` are served directly from the Node.js server until Bunny is configured. To migrate them to Bunny, upload the files and update the `BUNNY_CDN_URL` env var — the site will serve them from CDN automatically.

---

## Pushing to GitHub

When you're ready to push to your own GitHub repo:

```bash
cd the-faith-wound

# Add your remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/the-faith-wound.git

# Push
git push -u origin main
```

The project is already committed with a clean initial commit. Just add the remote and push.

---

## Cron Jobs & Automation

All cron jobs run inside the same Node.js process via `node-cron`. They are initialized in `scripts/start-with-cron.mjs`.

| Job | Schedule | Description |
|---|---|---|
| `generate-article` | Daily at 6 AM | Generates one new article using AI, runs quality gate, inserts to DB |
| `product-spotlight` | Weekly (Mon 9 AM) | Refreshes product spotlight widgets |
| `refresh-monthly` | 1st of month | Refreshes top 10 articles (adds new sections, updates stats) |
| `refresh-quarterly` | 1st of quarter | Deep refresh of all articles older than 90 days |
| `asin-health-check` | Weekly (Sun midnight) | Verifies affiliate ASINs are still valid |

**To disable a cron job**, comment out its import in `scripts/start-with-cron.mjs`.

**To trigger manually** (for testing):

```bash
node -e "import('./src/cron/generate-article.mjs').then(m => m.generateArticle())"
```

---

## Content Architecture

### Categories

| Slug | Label |
|---|---|
| `religious-trauma` | Religious Trauma |
| `deconstruction` | Deconstruction |
| `purity-culture` | Purity Culture |
| `leaving-church` | Leaving Church |
| `high-control-groups` | High-Control Groups |
| `relationships` | Relationships |
| `body-healing` | Body & Healing |
| `ocd-scrupulosity` | OCD & Scrupulosity |
| `trauma-healing` | Trauma Recovery |
| `therapy` | Finding Help |
| `grief` | Grief & Loss |
| `secular-community` | Secular Community |
| `secular-spirituality` | Secular Spirituality |
| `atheism-agnosticism` | Atheism & Agnosticism |
| `parenting` | Parenting After Faith |
| `anger` | Anger & Forgiveness |
| `identity` | Identity |
| `resources` | Resources |

### Article Schema (PostgreSQL)

```sql
articles (
  id              SERIAL PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  meta_description TEXT,
  og_title        TEXT,
  og_description  TEXT,
  category        TEXT NOT NULL,
  tags            TEXT[],
  hero_url        TEXT,
  image_alt       TEXT,
  reading_time    INTEGER,
  author          TEXT DEFAULT 'The Oracle Lover',
  body            TEXT NOT NULL,       -- Markdown
  tldr            TEXT,                -- 2-3 sentence summary
  faq             JSONB,               -- [{question, answer}]
  cta_primary     TEXT,
  affiliate_asins TEXT[],
  published_at    TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ,
  last_refreshed_at TIMESTAMPTZ,
  is_published    BOOLEAN DEFAULT true,
  quality_score   INTEGER
)
```

---

## Assessments

Three interactive assessments are built into the site:

### 1. Religious Trauma Assessment
- **20 questions**, Likert scale (0–4)
- Scoring: 5 levels (Minimal / Mild / Moderate / Significant / Severe)
- Based on frameworks from Dr. Marlene Winell and the Religious Trauma Institute
- Route: `/assessments/religious-trauma-assessment`

### 2. Deconstruction Stage Finder
- **15 questions**, multiple choice
- Maps to 6 deconstruction stages (Questioning → Integration)
- Route: `/assessments/deconstruction-stage-finder`

### 3. Post-Faith Identity Quiz
- **12 questions**, multiple choice
- Maps to 5 identity profiles (Secular Humanist, Spiritual-Not-Religious, Agnostic Explorer, etc.)
- Route: `/assessments/post-faith-identity-quiz`

All assessments are **client-side only** (no data stored unless user submits via the API). Results include recommended articles, next steps, and resource links.

---

## SEO & AEO Stack

### Per-Page Meta (react-helmet-async)
Every page injects via `<SEOHead>`:
- `<title>` with site suffix
- `<meta name="description">`
- `<meta property="og:*">` (Open Graph)
- `<meta name="twitter:*">` (Twitter Cards)
- `<link rel="canonical">`
- `<script type="application/ld+json">` (JSON-LD)

### JSON-LD Schemas
- `Article` — on every article page
- `FAQPage` — on articles with FAQ sections
- `BreadcrumbList` — on article and category pages
- `WebSite` — on homepage
- `Organization` — sitewide

### Crawler Files
| URL | Purpose |
|---|---|
| `/sitemap.xml` | All published articles + static pages |
| `/robots.txt` | Allows major AI crawlers, blocks `/api/` |
| `/llms.txt` | AI-readable article index (Markdown) |
| `/llms-full.txt` | Full article text for AI indexing |

### AEO (Answer Engine Optimization)
- TLDR blocks (AI Overview targets)
- FAQ sections with `FAQPage` schema
- `speakable` CSS selectors in JSON-LD
- Structured headers (H1 → H2 → H3 hierarchy)

---

## Amazon Affiliate System

### ASIN Pool
`src/data/asin-pool.json` contains curated ASINs organized by category. The AI writing engine automatically selects relevant ASINs when generating articles.

### Associate Tag
Set `AMAZON_ASSOCIATE_TAG` in your environment. All affiliate links are built as:
```
https://www.amazon.com/dp/{ASIN}?tag={AMAZON_ASSOCIATE_TAG}
```

### Auto-Matching
`src/lib/match-products.mjs` matches articles to relevant products based on:
- Article category
- Article tags
- Keyword matching in title/body

### ASIN Health Check
The weekly cron job verifies ASINs are still valid by checking Amazon product pages. Invalid ASINs are flagged in the database.

---

## Design System

The site uses a custom CSS design token system (no Tailwind, no CSS-in-JS framework).

### Color Palette (Warm Earth Tones)

```css
--color-accent:     #7A6040  /* Warm brown — primary */
--color-accent-light: #C4956A
--color-heading:    #1A1208
--color-text:       #2C2010
--color-muted:      #6B5A45
--color-bg:         #FDFAF6  /* Warm off-white */
--color-card:       #FFFFFF
--color-sidebar:    #F5F0E8
--color-border:     #E8DDD0
```

### Typography

- **Headings:** Playfair Display (serif) — loaded from Google Fonts
- **Body:** Inter (sans-serif) — loaded from Google Fonts
- **Scale:** 12px → 14px → 16px → 18px → 20px → 24px → 30px → 36px → 48px

### Layout

- **Dashboard Archetype E:** Sidebar (280px) + Main content
- **Sidebar:** Author bio, navigation, popular articles, recent articles, assessment CTA
- **Content max-width:** 720px
- **Full layout max-width:** 1200px

---

## Adding Articles Manually

To add an article directly to the database:

```sql
INSERT INTO articles (
  slug, title, meta_description, category, tags,
  hero_url, image_alt, reading_time, body, tldr, faq,
  published_at, is_published
) VALUES (
  'your-article-slug',
  'Your Article Title',
  'A 150-character meta description.',
  'religious-trauma',
  ARRAY['tag1', 'tag2'],
  '/images/article-hero.jpg',
  'Alt text for the hero image',
  8,
  '## Introduction\n\nYour article body in Markdown...',
  'A 2-3 sentence summary of the article.',
  '[{"question": "Q1?", "answer": "A1."}, {"question": "Q2?", "answer": "A2."}]',
  NOW(),
  true
);
```

Or add to `src/data/seed-articles.ts` and re-run `pnpm seed`.

---

## Troubleshooting

### Build fails with TypeScript errors
Run `npx tsc --noEmit` to see all errors. The most common issues are:
- Missing `React` import in `.tsx` files (add `import React from 'react'`)
- Type mismatches in `.mjs` imports (these are declared in `src/types/mjs.d.ts`)

### Database connection fails
- Verify `DATABASE_URL` is set correctly
- Check that the PostgreSQL instance allows connections from your IP/app
- For DigitalOcean Managed PostgreSQL, ensure the app is in the same region or has a trusted source added

### Articles not showing on homepage
- Run `pnpm seed` to insert the seed articles
- Check that `is_published = true` in the database
- Verify the `/api/articles` endpoint returns data: `curl http://localhost:3000/api/articles`

### Images not loading
- Static images are served from `public/images/`
- In production, ensure the `public/` directory is included in the build output
- If using Bunny CDN, verify `BUNNY_CDN_URL` is set and the files are uploaded

### Cron jobs not running
- Cron jobs only run in production (`NODE_ENV=production`)
- Check the server logs for cron initialization messages
- Verify `OPENAI_API_KEY` is set for the article generation cron

---

## License

Proprietary. All rights reserved. Not for redistribution.

---

*Built with care for everyone navigating the hardest kind of loss.*
