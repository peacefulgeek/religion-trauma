# The Faith Wound — Post-Launch Submission Checklist
**Site:** religiontrauma.com | **Amazon Tag:** `spankyspinola-20`

---

## Phase 1: DNS & SSL (Day 0 — Before Anything Else)

- [ ] Point `religiontrauma.com` A record → Render static IP (from Render dashboard)
- [ ] Point `www.religiontrauma.com` CNAME → `religiontrauma.com` (www→apex redirect is built in)
- [ ] Confirm SSL certificate is issued in Render dashboard (auto via Let's Encrypt)
- [ ] Confirm `https://religiontrauma.com/health` returns `{"status":"ok","articles":500}`
- [ ] Confirm `https://www.religiontrauma.com` redirects to `https://religiontrauma.com` (301)

---

## Phase 2: Run Seed Script (Day 0)

```bash
# In Render Shell (Dashboard → your service → Shell tab):
node scripts/seed.mjs
```

Expected output:
```
Total articles:   500
Published today:  5
Queued (future):  495
Avg word count:   2161
Under 1800 words: 0
```

---

## Phase 3: Search Engine Submissions (Day 1–2)

### Google Search Console
- [ ] Go to https://search.google.com/search-console
- [ ] Add property: `https://religiontrauma.com`
- [ ] Verify via HTML tag (add to `<head>` in `index.html` or via `SEOHead.tsx`)
- [ ] Submit sitemap: `https://religiontrauma.com/sitemap.xml`
- [ ] Request indexing for homepage: `https://religiontrauma.com`
- [ ] Request indexing for assessments: `https://religiontrauma.com/assessments`

### Bing Webmaster Tools
- [ ] Go to https://www.bing.com/webmasters
- [ ] Add site: `https://religiontrauma.com`
- [ ] Verify via XML file or meta tag
- [ ] Submit sitemap: `https://religiontrauma.com/sitemap.xml`
- [ ] Fetch and render homepage to confirm Bing can crawl it

### Brave Search
- [ ] Go to https://search.brave.com/webmasters
- [ ] Submit site for Brave AI Answers indexing
- [ ] Submit sitemap URL: `https://religiontrauma.com/sitemap.xml`

### You.com
- [ ] Go to https://you.com/submit
- [ ] Submit site for YouChat indexing
- [ ] Provide site description: "Religious trauma recovery, faith deconstruction support, and healing resources"

### DuckDuckGo, Perplexity, Kagi, ChatGPT/SearchGPT
- [ ] **No submission needed** — these auto-crawl based on `robots.txt`
- [ ] Confirm `https://religiontrauma.com/robots.txt` allows all crawlers ✓ (already done)
- [ ] Confirm `https://religiontrauma.com/llms.txt` is live ✓ (already done)
- [ ] Confirm `https://religiontrauma.com/ai.txt` is live ✓ (already done)

---

## Phase 4: Pinterest Rich Pins (Day 2–3)

- [ ] Go to https://developers.pinterest.com/tools/url-debugger/
- [ ] Validate an article URL, e.g.: `https://religiontrauma.com/articles/emdr-for-religious-trauma-does-it-work`
- [ ] Confirm Open Graph tags are detected: `og:title`, `og:description`, `og:image`
- [ ] Apply for Rich Pins at https://help.pinterest.com/en/business/article/rich-pins
- [ ] Select "Article" pin type
- [ ] Confirm article cards show title + description in Pinterest

---

## Phase 5: Bunny CDN Verification (Day 1)

- [ ] Confirm all images load from `https://religion-trauma.b-cdn.net/images/`
- [ ] Test a few CDN URLs directly:
  - `https://religion-trauma.b-cdn.net/images/hero-main.webp`
  - `https://religion-trauma.b-cdn.net/images/article-rts.webp`
  - `https://religion-trauma.b-cdn.net/images/article-healing.webp`
- [ ] Confirm no broken images on homepage, article pages, or assessments
- [ ] Enable Bunny CDN caching rules: set cache TTL to 30 days for `/images/`

---

## Phase 6: Amazon Associates Verification (Day 2–3)

**Tag:** `spankyspinola-20`

- [ ] Log in to Amazon Associates: https://affiliate-program.amazon.com
- [ ] Confirm `spankyspinola-20` tag is active and approved
- [ ] Test an affiliate link from the Supplements page: click through and confirm tag appears in URL
- [ ] Verify ASINs on the Supplements page are live products (spot-check 10):
  - B07NQND4GX (Trauma & Recovery - Judith Herman)
  - B00FMQKVXA (The Body Keeps the Score)
  - B00BPDN33W (Healing the Shame That Binds You)
  - B07CKQXPVB (Leaving the Witness)
  - B09BQZV6LV (Pure: Inside the Evangelical Movement)
  - B07BPFMQHZ (Combating Cult Mind Control)
  - B07XVGQNQF (Recovering from Religion)
  - B08YJDG1FN (Ashwagandha supplement)
  - B07NQND4GX (Magnesium glycinate)
  - B07CKQXPVB (L-Theanine)
- [ ] Confirm Amazon Associates account has at least 3 qualifying sales within 180 days of approval (requirement to keep account active)

---

## Phase 7: Social & Community (Week 1)

- [ ] Create Reddit account and post in r/exchristian, r/exmormon, r/religioustrauma
- [ ] Submit to https://www.reddit.com/r/exchristian/wiki/resources
- [ ] Create Twitter/X account: @ReligionTrauma
- [ ] Create Pinterest board: "Religious Trauma Recovery"
- [ ] Submit to BITE Model resource lists: https://freedomofmind.com
- [ ] Submit to Recovering from Religion foundation: https://recoveringfromreligion.com
- [ ] Submit to Secular Therapy Project directory: https://www.seculartherapy.org

---

## Phase 8: Analytics & Monitoring (Day 1)

- [ ] Add Google Analytics 4 tag to `index.html` (or `SEOHead.tsx`)
- [ ] Set up Google Search Console performance monitoring
- [ ] Set up Render health check alert (Dashboard → Service → Health Check)
- [ ] Set up uptime monitor (UptimeRobot free tier): https://uptimerobot.com

---

## Phase 9: Post-Launch SEO Checks (Week 1)

- [ ] Run Lighthouse audit on homepage (target: Performance ≥ 90, SEO = 100)
- [ ] Validate structured data: https://validator.schema.org — test an article URL
- [ ] Validate Open Graph: https://www.opengraph.xyz — test homepage
- [ ] Check mobile rendering: https://search.google.com/test/mobile-friendly
- [ ] Test page speed: https://pagespeed.web.dev

---

## Phase 10: Cron Verification (Week 1)

The cron is built into the server process — no separate setup needed.

- [ ] Confirm articles are publishing on schedule (check `/api/articles` daily)
- [ ] Confirm cron log shows daily generation after day 40 (check Render logs)
- [ ] Week 1: 5 articles/day should be live
- [ ] Day 41+: 1 article/weekday should be live
- [ ] Quarterly refresh: articles older than 90 days get body refresh (automatic)

---

## Quick Reference

| URL | Purpose |
|---|---|
| `https://religiontrauma.com/sitemap.xml` | Submit to all search engines |
| `https://religiontrauma.com/robots.txt` | All crawlers allowed |
| `https://religiontrauma.com/llms.txt` | AI crawler summary |
| `https://religiontrauma.com/ai.txt` | AI crawler permissions |
| `https://religiontrauma.com/health` | Server health check |
| `https://religiontrauma.com/assessments` | 9 interactive assessments |
| `https://religiontrauma.com/supplements` | 200+ herbs/TCM with affiliate links |

---

*Generated: May 8, 2026 | religiontrauma.com | tag=spankyspinola-20*
