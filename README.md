# The Faith Wound

**Religious Trauma Recovery & Faith Deconstruction Resource Hub**

Live at [religiontrauma.com](https://religiontrauma.com) — a full-stack SSR React + Express site covering religious trauma, faith deconstruction, purity culture recovery, and post-faith identity. Built to rank, monetize via Amazon Associates (`spankyspinola-20`), and grow autonomously through AI-powered content generation.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started (Local)](#getting-started-local)
5. [Environment Variables](#environment-variables)
6. [DigitalOcean Deployment](#digitalocean-deployment)
7. [Cron Jobs & Automation](#cron-jobs--automation)
8. [Content Architecture](#content-architecture)
9. [Assessments](#assessments)
10. [SEO & AEO Stack](#seo--aeo-stack)
11. [Amazon Affiliate System](#amazon-affiliate-system)
12. [Design System](#design-system)

---

## Architecture

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
      JSON Files  Vite/React
  (src/data/articles/)  (react-router-dom v6)
              │
         Bunny CDN
   (religion-trauma.b-cdn.net)
```

**No external database.** Articles are stored as JSON files in `src/data/articles/`. The server reads them directly at runtime. This means zero database setup, zero migrations, and instant deploys.

**Images are hardcoded to Bunny CDN** (`https://religion-trauma.b-cdn.net`). No image env vars needed.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, TypeScript |
| SSR | Vite SSR + `renderToString` + `react-helmet-async` |
| Backend | Express 4, Node.js 20+ |
| Data Store | JSON files (`src/data/articles/*.json`) |
| Styling | Pure CSS with design tokens (no Tailwind) |
| AI Writing | OpenAI API (`gpt-4.1-mini`) |
| CDN | Bunny CDN — `religion-trauma.b-cdn.net` (hardcoded) |
| Hosting | DigitalOcean App Platform |
| Cron | `node-cron` (runs in same process) |
| Affiliate | Amazon Associates — `tag=spankyspinola-20` (hardcoded) |

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
│   └── favicon.svg
├── scripts/
│   ├── build-server.mjs          # esbuild server compiler
│   ├── seed.mjs                  # Article validator / seed helper
│   └── start-with-cron.mjs       # Production entry point
├── server/
│   ├── index.ts                  # Express app + SSR setup
│   └── routes/
│       ├── articles.ts           # GET /api/articles, GET /api/articles/:slug
│       ├── assessments.ts        # GET/POST /api/assessments
│       ├── health.ts             # GET /health
│       ├── llms.ts               # GET /llms.txt, /llms-full.txt, /ai.txt
│       ├── robots.ts             # GET /robots.txt
│       └── sitemap.ts            # GET /sitemap.xml (with image tags)
├── src/
│   ├── client/
│   │   ├── components/           # Shared UI components
│   │   ├── pages/                # Route-level page components
│   │   │   └── assessments/      # 9 interactive assessments
│   │   ├── styles/               # CSS design tokens + assessment styles
│   │   ├── App.tsx               # Router setup
│   │   ├── entry-client.tsx      # Client hydration entry
│   │   └── entry-server.tsx      # SSR render entry
│   ├── cron/
│   │   ├── generate-article.mjs  # Daily article generation (5/day → 1/weekday)
│   │   ├── product-spotlight.mjs # Weekly product spotlight
│   │   ├── refresh-monthly.mjs   # Monthly content refresh
│   │   ├── refresh-quarterly.mjs # Quarterly deep refresh
│   │   └── asin-health-check.mjs # Weekly ASIN validation
│   ├── data/
│   │   ├── articles/             # 500 pre-generated JSON articles
│   │   ├── seed-articles.ts      # Seed article TypeScript definitions
│   │   ├── product-catalog.ts    # Amazon ASIN catalog
│   │   └── verified-asins.json   # Verified ASIN pool
│   └── lib/
│       ├── aeo.mjs               # SEO/AEO helpers, llms.txt, ai.txt
│       ├── amazon-verify.mjs     # ASIN verification
│       ├── article-quality-gate.mjs # Content quality checks
│       ├── bunny.mjs             # Bunny CDN upload + image mapping
│       ├── db.mjs                # JSON file DB layer
│       ├── deepseek-generate.mjs # OpenAI writing engine
│       └── match-products.mjs    # Category → ASIN matching
├── index.html                    # Vite HTML template
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Getting Started (Local)

```bash
git clone https://github.com/peacefulgeek/religion-trauma.git
cd religion-trauma
pnpm install
cp .env.example .env
# Edit .env — add your OPENAI_API_KEY
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Only **two variables** are required. Everything else is hardcoded in the source.

```env
# Required
OPENAI_API_KEY=sk-...          # For daily article generation cron
AUTO_GEN_ENABLED=true          # Set to true to enable cron

# Optional (defaults work fine)
NODE_ENV=production
PORT=3000
SITE_URL=https://religiontrauma.com
```

**What is hardcoded (no env vars needed):**
- Bunny CDN: `https://religion-trauma.b-cdn.net` — in `src/lib/bunny.mjs`
- Amazon tag: `spankyspinola-20` — in `src/data/product-catalog.ts`
- OpenAI base URL: `https://api.openai.com/v1` — in `src/lib/deepseek-generate.mjs`
- OpenAI model: `gpt-4.1-mini` — in `src/lib/deepseek-generate.mjs`

---

## DigitalOcean Deployment

The `.do/app.yaml` is pre-configured. To deploy:

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click **Create App** → **GitHub** → select `peacefulgeek/religion-trauma`
3. Branch: `main` — auto-deploy on push: enabled
4. Set the one required secret: `OPENAI_API_KEY`
5. Set `AUTO_GEN_ENABLED=true`
6. Click **Deploy**

The app will:
- Run `pnpm install && pnpm build` on each deploy
- Start with `node scripts/start-with-cron.mjs`
- Serve on port 3000
- Auto-redirect `www.religiontrauma.com` → `religiontrauma.com`

**No database to provision.** Articles are served from the 500 JSON files included in the repo.

---

## Cron Jobs & Automation

All crons run in-process via `node-cron`:

| Job | Schedule | Description |
|---|---|---|
| Article generation | Phase 1: 5/day (40 days) → Phase 2: 1/weekday | Generates new articles via OpenAI |
| Product spotlight | Weekly (Monday 9am) | Highlights a featured product |
| Monthly refresh | 1st of month | Refreshes top 10 articles |
| Quarterly refresh | Every 3 months | Deep refresh of all articles |
| ASIN health check | Weekly (Sunday midnight) | Validates Amazon affiliate links |

The cron automatically detects which phase it's in based on the number of published articles:
- **< 200 articles published:** runs 5 times per day
- **≥ 200 articles published:** runs once per weekday

---

## Content Architecture

**500 pre-generated articles** covering:
- Religious Trauma Syndrome (RTS)
- Faith deconstruction stages
- Purity culture recovery
- Leaving high-control groups
- Body healing & somatic work
- Scrupulosity / religious OCD
- LGBTQ+ and religious trauma
- Secular community building
- Post-faith identity
- Grief, anger, and relationships

**Date-gating:**
- Articles 1–200: publish May 8 → June 16, 2026 (5/day)
- Articles 201–500: publish June 17, 2026 → August 10, 2027 (1/weekday)

**Voice:** The Oracle Lover — warm, wise, fiercely compassionate. Direct, validating, intellectually rigorous.

---

## Assessments

9 interactive assessments at `/assessments`:

1. Religious Trauma Assessment (20 questions, 5 severity levels)
2. Deconstruction Stage Finder (15 questions, 6 stages)
3. Post-Faith Identity Quiz (12 questions, 5 profiles)
4. Spiritual Abuse Indicator (15 questions)
5. Purity Culture Impact Scale (18 questions)
6. Faith Grief Inventory (12 questions)
7. Secular Readiness Assessment (10 questions)
8. Body-Faith Connection Quiz (14 questions)
9. Community Needs Assessment (10 questions)

---

## SEO & AEO Stack

- **SSR** via Vite + `react-helmet-async` — full HTML for every page
- **JSON-LD** on every article: `Article`, `FAQPage`, `BreadcrumbList`, `WebSite`
- **Sitemap** at `/sitemap.xml` with `<image:image>` tags
- **TLDR blocks** targeting Google AI Overview snippets
- **FAQ sections** on every article (JSON-LD `FAQPage` schema)
- **`/robots.txt`** — all AI crawlers explicitly allowed
- **`/llms.txt`** — LLM-readable site summary
- **`/llms-full.txt`** — full article index for LLM training
- **`/ai.txt`** — AI permissions file
- **Breadcrumbs** on all article pages
- **Twitter Cards** and Open Graph on all pages
- **Canonical URLs** on all pages

---

## Amazon Affiliate System

Tag: `spankyspinola-20` (hardcoded in `src/data/product-catalog.ts`)

Products are auto-matched to articles by category. The `AutoAffiliates` component renders 2–3 relevant product cards on each article page.

**Supplements page** at `/supplements` lists 200+ herbs, TCM remedies, and supplements with verified ASINs — all linked with the affiliate tag.

---

## Design System

Dashboard Archetype E — warm editorial design:

| Token | Value |
|---|---|
| Primary | `#7A6040` (amber-brown) |
| Background | `#FDFAF6` (warm cream) |
| Text | `#1A1208` (near-black) |
| Accent | `#C4973A` (gold) |
| Heading font | Playfair Display |
| Body font | Inter |

Layout: fixed sidebar (280px) + main content column. Fully responsive with mobile hamburger menu and reading progress bar.
