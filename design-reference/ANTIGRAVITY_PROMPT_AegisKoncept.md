# Build the AegisKoncept website + admin panel (React / Node.js)

You are a senior full-stack engineer and a pixel-perfect front-end developer. Build the production website and content admin for **AegisKoncept**, a digital marketing agency in Dwarka, New Delhi (founders: Ritesh Kumar and Yogeesh Gahlot, both "Founder").

The design is **already finished and approved**. Your job is to rebuild it **exactly** as a real, fast, SEO-ready React + Node.js application. Do not redesign, "improve" the look, change copy, swap fonts, or add sections. If something in this prompt and the reference files disagree, **the reference files win**.

---

## 0. The reference files (read these first, every one)

Everything is in `/design-reference/`:

| File | What it is | How to use it |
|---|---|---|
| `website-design.html` | The complete approved website. One file, 65 pages, hash-routed (`#services-seo` = one page). Open it in Chrome and click through everything. | **Source of truth** for layout, CSS, copy, animations and behaviour. Copy its CSS values and text verbatim. |
| `admin-design.html` | The complete approved admin panel (clickable). | Source of truth for the admin UI and features. |
| `admin-template.html` | Same admin, readable source (data placeholder `__DATA__`). | Read the JS to see exact behaviour (SEO checks, validation regexes, snippets). |
| `content.json` | **All website content** as structured data: services, case studies, industries, locations, videos, blog posts, stats, reviews, owners, logos, hero slides. | Seed the database from this. Never retype content by hand. |
| `generator-build.py` | The Python script that generated `website-design.html`. Contains every HTML template, the full CSS string, and all JavaScript (cursor, curtain, hero canvas, reviews spotlight…). | Read it to understand each page template and component. Port templates to React components 1:1. |
| `generator-extra.css` | Extra CSS appended by the generator (stats, video cards, reviews, hero v2, mobile polish…). | Part of the design system. Port it too. |
| `assets/client-logos/*.png` | 10 client logos (cream on transparent). File id → client name mapping is in `content.json → LOGOS`. | Use as real image files (not base64). |
| `assets/seo-screenshots/s00–s25.jpg` | 26 real SEO result screenshots used as proof. Captions in `content.json → CASES[].shots` and `MORE_SEO`. | Use as real image files, optimised with `next/image`. |
| `screenshots/*.jpg` | Full-page screenshots of key pages at 1440px and 390px. | Visual target for your pixel comparison tests. |

In the reference HTML, images are inlined as base64 because the preview environment blocked external files. In the real build, **move every base64 image to a real file** and serve it optimised.

---

## 1. Tech stack (use exactly this)

- **Framework:** Next.js 14+ (App Router) with **React 18** and **TypeScript**, running on **Node.js 20 LTS**. Next.js is required (not a client-only Vite SPA) because every page must be **server-rendered** for SEO: titles, descriptions, JSON-LD and content must be in the HTML Google receives.
- **Styling:** Port the reference CSS into **CSS Modules + one global stylesheet** (`app/globals.css`) holding the design tokens. Do **not** use Tailwind or a UI kit: they will drift from the design. Keep class names close to the reference (`.btn.b-l`, `.stage`, `.case`, `.fx-r`…) so styles port 1:1.
- **Database:** MySQL 8 (works on Hostinger) with **Prisma ORM**.
- **Auth (admin):** Auth.js (NextAuth) credentials provider, bcrypt password hashes, HTTP-only session cookies, roles `ADMIN` and `EDITOR`.
- **Rich text (blog):** TipTap editor in the admin; store **sanitised HTML** (sanitize-html) plus TipTap JSON.
- **Images:** `next/image`, uploads stored in `/public/uploads` (or S3-compatible storage if `STORAGE=s3`), auto-converted to WebP + resized (sharp).
- **Email:** Nodemailer (SMTP from env) for enquiry notifications.
- **Validation:** Zod on every API input.
- **Animation:** plain CSS + small vanilla/React hooks exactly as the reference does it. No GSAP/Framer unless needed to match a behaviour 1:1. The reference uses `IntersectionObserver`, `requestAnimationFrame`, a `<canvas>`, and CSS transitions; port those.
- **Testing:** Playwright (visual comparison + flows), Lighthouse CI.

---

## 2. Project structure

```
/app
  /(site)              → public website (server components by default)
    layout.tsx         → header, footer, cursor, curtain, grain, progress bar, WhatsApp bar
    page.tsx           → home
    about/ services/ services/[slug]/ our-work/ our-work/[slug]/ videos/
    industries/ industries/[slug]/ locations/ locations/[slug]/
    insights/ insights/[slug]/ insights/author/[slug]/ insights/category/[slug]/
    contact/ thank-you/ privacy-policy/ terms-and-conditions/ cookie-policy/ all-pages/
    not-found.tsx
  /admin               → admin panel (client components, protected by middleware)
  /api                 → route handlers (leads, admin CRUD, uploads, indexnow, revalidate)
  sitemap.ts  robots.ts
/components/site/...   → one component per reference block (Header, MegaMenu, MobileMenu, Hero, HeroCanvas, LogoStrip, Stage, Phone, Laptop, AdCard, Serp, Chat, CaseCard, FixRows, Stats, VideoCard, ReviewsSpotlight, CtaBand, Faq, Breadcrumb…)
/components/admin/...
/lib (db, seo, jsonld, integrations, analytics-events, slug, sanitize)
/prisma (schema.prisma, seed.ts ← reads design-reference/content.json)
/public (fonts fallback, uploads, client-logos, seo-screenshots, favicon from the arch mark)
middleware.ts          → admin auth + redirects table
```

---

## 3. Brand and design system (copy values exactly from the reference CSS)

- **Palette:** Charcoal `#191919`, Cream `#F4F0E8`, Acid Lime `#D3E45B`, Graphite `#77716A`, plus the panel, line and mute tokens defined at the top of the reference CSS (`:root` in `generator-build.py`). Port **every** token.
- **Fonts:** **Instrument Serif** (display, regular + italic) and **Inter Tight** (text). Load with `next/font/google`, `display: swap`, and the same fallback stacks as the reference.
- **Logo:** "The Arch": the pointed-arch SVG + "AegisKoncept" serif wordmark. Copy the exact SVG path from the reference header. The `#arch-clip` clipPath (objectBoundingBox arch shape) is reused for avatars, buttons, the cursor and bullets. Keep it.
- **Type scale, spacing, section padding (`.sec`, `.sec-s`), containers (`.in`), grid helpers (`.split`, `.split-r`, `.cols.c2/.c3/.c4`), buttons (`.btn.b-l`, `.b-o`, `.b-d`), chips, labels (`.lbl`, `.xs`), section themes (`.dk` dark, `.cr` cream, `.wh` white).** Port as-is.
- **Language:** very simple English a 19-year-old understands. Keep all copy word-for-word from the reference.
- **No phone number in any video or reel CTA** (brand rule). The phone may appear in contact details only.

---

## 4. Global layout and components (must behave exactly like the reference)

1. **Header**
   - The logo is centred. Left nav: About, Services (mega menu), Our Work, Videos. Right nav: Industries, Blog, Contact, then the lime **"Let's Talk"** button.
   - After 40px of scroll it becomes a **centred floating glass bar** (`.site-h.scrolled`: blur, translucent charcoal, border) on desktop and mobile.
   - Between 1101 and 1320px the nav uses tighter gaps (see the reference media query).
   - It does **not** hide on scroll.
2. **Services mega menu.** It is a solid `#191919` panel.
   - Left: a list of 5 services. Each row has an arch icon, a name, a short line and an arrow.
   - Right: a live preview mockup that switches on hover or focus, plus a CTA.
   - It is keyboard accessible: it opens on focus and closes on Escape.
3. **Mobile menu.** A full-screen clip-path reveal with rows that stagger in (`--d` delays) and a Services accordion.
   - The footer has two buttons: "Get a Free Quote" and "WhatsApp Us". Arch line decoration.
   - It locks body scroll and marks the current page with `aria-current`.
   - Under 440px, the "Close" text is visually hidden but stays readable for screen readers.
4. **Page transition: the arch curtain.** On every internal navigation:
   - An arch-dome curtain rises and shows the new page title (`.ctitle`) with the mark.
   - The route swaps at about 560ms, then the curtain lifts.
   - Build it with the App Router (`usePathname` + a transition wrapper) so it runs on client navigation and **never blocks SSR content**. It is skipped for `prefers-reduced-motion`.
5. **Custom cursor.** Only on `(pointer:fine)` without reduced motion.
   - It is an arch-shaped ring plus a dot. It grows over links.
   - It shows a lime **"View"** bubble over `.case`, `.art-row`, `.vcard`, `.ihc`, `.ar` and `.site-row`.
   - It hides over form fields. It uses `mix-blend-mode` exactly as in the reference.
6. **Overlays:** the top scroll-progress bar (`.sprog`), the film grain (`.grain`), and the page-load bar (`.pbar`).
7. **Mobile bottom bar:** WhatsApp + "Let's Talk", fixed. The footer has padding so the bar never covers it.
8. **Footer**
   - Brand block, Services, Industries (first 7 + "All industries →"), Company (About, Our Work, Videos, Blog, Contact), Say hello.
   - A full-width **Locations** row: "Digital Marketing in Delhi" + all 13 Delhi areas + Gurugram + Noida + "All locations →".
   - The base row has legal links.
   - On mobile it is a 2-column grid, as in the reference.
9. **Reusable blocks:**
   - `CtaBand` (with the service preselected in the form), `Faq` (accordion), `Breadcrumb`, `CaseCard`.
   - `Stage` mockups (`phone`, `laptop`, `adcard`, `serp`, `chat`, `calendar`, `map`, `vframe`), each with `stg-logo` client-logo badges.
   - `FixRows` (problem → how we fix it → service tag), `Stats`, `VideoCard`, `ShotFigure` (screenshot + caption), `PeopleSpotlight`.

---

## 5. Motion and "wow" effects: port every one, same timings

Read the JS at the end of `generator-build.py` and match it. The full list:

- **Hero**
  - Big text-only slider: 4 slides with numbered tabs, play/pause, next arrow and autoplay. The service dropdown in the hero form follows the active slide until the user changes it themselves.
  - Headlines reveal **letter by letter**: each `.ch` rises from 112% with a 9° tilt and a 6px blur. The delay is `--i × 24ms`. The outgoing slide blurs up and out.
  - The **last line is lime italic**.
  - The first slide animates in on load.
- **Hero arch-portal `<canvas>`:**
  - 16 arch outlines grow from the bottom centre (56% x on desktop, 50% on mobile). They ease with a cubic curve, and every 5th one is lime.
  - The canvas leans with the mouse (parallax) and speeds up as you scroll.
  - A **lime arch burst** fires on every slide change and once on load.
  - It pauses when off-screen (IntersectionObserver) and draws one static frame for reduced motion. It resizes with a ResizeObserver.
- **Hero quote form:** a rotating lime conic-gradient border (`@property --ha`, 6s) and a subtle 3D tilt toward the mouse (±4°).
- **Hero results ticker:** a marquee of `HERO_TICK` that pauses on hover. As you scroll, the hero text moves down up to 90px and fades out (`--hsc`).
- **Headings:** H1/H2 rise word by word (`.wm/.wi`) via IntersectionObserver.
- **Other scroll effects:**
  - The scroll-lit manifesto (`.scrub`): words light up as you scroll.
  - The pinned horizontal work section (`.hpin`): vertical scroll moves a horizontal track of case cards, with a progress bar.
  - Parallax on mockups, a clip-path reveal on stages (`.cl-pre`), and fade-up reveals (`.rv`).
  - The client logo marquee (`.marq.lg`) skews with scroll velocity. Keep `overflow:hidden` on `.logos` (it caused 13px of horizontal overflow before).
- **Pointer effects:** magnetic buttons, and 3D tilt on project cards.
- **Reviews spotlight (home):**
  - A list of owners on the left. The big card on the right auto-advances every 6.5s with a lime progress bar and a clip-path reveal of the quote. It pauses on hover.
  - On mobile, the list becomes swipeable tabs.
  - Sticky on desktop.
- **Reduced motion:** every effect must respect `prefers-reduced-motion: reduce` exactly as the reference does.

---

## 6. Pages and URLs (hash ids → clean URLs)

Convert every `#id` to a real URL. Internal links in the content must use these URLs.

| Reference id | URL | Template |
|---|---|---|
| `home` | `/` | Sections in order: hero, logo strip "Brands that trust us", manifesto, "We Don't Just Do Marketing", services rows, pinned work (first 6 cases + end card), process, monthly calendar, industries list, why us, **People Who Trust Us** (reviews spotlight), blog, CTA band |
| `about` | `/about` | About + team (Ritesh Kumar, Founder; Yogeesh Gahlot, Founder; Yashi Kaushik; Nisha Khanna) |
| `services` | `/services` | Services hub (5 services, "Five services, one team") |
| `services-<id>` | `/services/<id>` | Service detail (section 7) |
| `our-work` | `/our-work` | Work hub (section 8) |
| `our-work-<id>` | `/our-work/<id>` | Case study |
| `videos` | `/videos` | Videos page |
| `industries` | `/industries` | Industries hub (13 cards) |
| `industries-<id>` | `/industries/<id>` | Industry detail |
| `locations` | `/locations` | Locations hub |
| `locations-<id>` | `/locations/<id>` | Location page (Delhi hub + 13 areas + Gurugram + Noida) |
| `insights` | `/insights` | Blog listing |
| `insights-seo-cost-india` | `/insights/seo-cost-india` | Article template (TOC, author box, FAQ, service box) |
| `insights-author-ritesh-kumar` | `/insights/author/ritesh-kumar` | Author page |
| `contact`, `thank-you`, `privacy-policy`, `terms-and-conditions`, `cookie-policy`, `all-pages`, `not-found` | same slug | As designed. `thank-you` is `noindex`. |

Generate slugs and pages from the database, not hard-coded routes. `generateStaticParams` + ISR (`revalidate` on admin save via `/api/revalidate`).

---

## 7. Page templates (match the reference section by section)

**Service detail (`/services/[slug]`):**
1. Hero: breadcrumb, label, H1, intro, two buttons, arch mockup.
2. A row of **proof stats** linked to case studies.
3. The positioning statement.
4. "Sound Familiar? Here's the Fix." as **FixRows** (problem → fix).
5. "What We Do Inside X": 5 numbered sub-services.
6. "What You Get": 4 columns.
7. Signature list with a sticky mockup. The social media service adds the "Most agencies / We also" comparison.
8. On the SEO service: the "Real Results. Real Screenshots." gallery. On the video service: "Watch Our Shoots".
9. Who it's for, plus industry chips.
10. How it works (steps) + the tools chips.
11. What's included (table).
12. Related work, FAQ, read more, other services, CTA band.

All data is in `content.json → SVC[]` (`probs`, `fixes`, `subs`, `tools`, `proof`, `inc`, `sig`, `who`, `proc`, `deliv`, `faqs`).

**Work hub (`/our-work`):**
1. H1 "Our Work." + 4 headline stats (`WORK_STATS`).
2. The featured 10Q Challenge story with real result numbers.
3. A **sticky filter bar**: All / Websites / SEO / Ads / Social media / Video + "Watch videos ↗".
4. The case grid.
5. "Websites We've Built. Live Now.": a list of live client sites linking out.
6. "More SEO Results." screenshot gallery (`MORE_SEO`).
7. "We Shoot Too." with 3 video cards.
8. CTA.

**Case study (`/our-work/[slug]`):**
1. Hero: industry · location label, client name, one-line result, "what we did" list, **"Visit the live site ↗"** (when `url` exists), and a big mockup or **real screenshot cover** with the client logo badge.
2. The Problem / What We Did, with service chips.
3. The Result: stats + extra line.
4. **The Proof**: the screenshot gallery with captions (when `shots` exist).
5. Videos we shot for this client (when any).
6. **Owner card + review** (see section 10).
7. More work, CTA.

**Videos (`/videos`):**
- Stats, a sticky category filter, a 9:16 poster-card grid, "What We Shoot", CTA.
- In production, **clicking a card opens an accessible lightbox with the Vimeo player** (`https://player.vimeo.com/video/<id>`, lazy-loaded, focus-trapped, closes on Esc). The reference could only link out because the preview blocked iframes. Keep the card design identical.

**Industry detail:** hero, "The Problems. And How We Fix Them." (FixRows with service tags), "Where We'd Start" (service order), our work in this industry (or the "Be our first … story" state), your first 90 days, FAQ, other industries, CTA. Industry cases are **derived** from `case.ind`.

**Location page:**
- Hero with a local SERP mockup, or the map for the Dwarka office.
- "Doing Business in X" + business chips.
- Local problems FixRows.
- For Delhi: the areas grid.
- "What People Search in X", how we help (5 services), a featured case, FAQ (office vs area answers), nearby chips, CTA.
- Each location page must have **unique** copy from `LOCS[]` (never template-duplicate text).

**Blog listing and article:** as in the reference (featured article, category filter, search, article rows; the article has a sticky TOC, author box, quick tip, service box, table, blockquote and FAQ). The listing and articles come from the `Post` table.

---

## 8. Data model (Prisma)

Create these models (fields based on `content.json`):

- `Service`: slug, name, nav, short, line, h1, sub, positioning, problems[], fixes[], subServices (json), included (json), signature (json), who (json), process[], deliverables (json), tools[], proof (json), faqs (json), visualKind, order, SEO fields.
- `CaseStudy`:
  - Text fields: slug, client, industryId, location, services[] (`Website | SEO | Ads | Social Media | Video`), oneLine, challenge, approach, did[], extra, liveUrl.
  - Media fields: logoMediaId, coverMediaId, shots (MediaRef + caption)[], visualKind.
  - Owner fields: ownerName, ownerRole.
  - Other: order, published, SEO fields.
  - It has **results (number + label)[]**.
- `Review`: caseId, authorName, authorRole, text, **status `DRAFT | APPROVED | REJECTED`**, approvedAt, approvedBy, source note.
- `Industry`: slug, name, short, h1, sub, issues (problem, detail, fix, serviceSlug)[], faqs, visualKind, SEO.
- `Location`: slug, name, zone, parentId, isOffice, h1, sub, land, businesses[], challenges[], searches[], nearbyIds[], featuredCaseId, inFooter, status, SEO.
- `Video`: vimeoId, title, label, client/caseId, category, posterMediaId, showOnHome, showOnVideos, order.
- `Post`: title, slug, excerpt, bodyHtml, bodyJson, categoryId, tags[], authorId, status (`DRAFT | PUBLISHED | SCHEDULED`), publishAt, focusKeyword, seoTitle, seoDescription, canonical, robots, schemaType, featuredMediaId, ogTitle, ogDescription, readMinutes, seoScore. Plus `Category` and `Tag`.
- `Page`: path, title, type (`Core | Service | Industry | Location | Case study | Blog | Utility`), h1, intro, sections (name, order, visible)[], seoTitle, seoDescription, canonical, robots, ogMediaId, inMenu, inFooter, status.
- `Media`: file, name, alt, caption, folder (`Client logos | Screenshots | Uploads`), width, height, sizeKb, mime, usages.
- `Redirect`: from, to, type (301/302), hits.
- `SitemapEntry`: path, include, priority, changefreq.
- `Setting`: key/value JSON for: title template, home title, default description, default OG image, robots.txt text, business schema (type, name, phone, email, address, hours, founders, areas, sameAs), verification codes.
- `Integration`: key (`gsc | ga4 | gtm | ads | gbp | recaptcha | looker | pixel | bing | clarity | indexnow | whatsapp`), connected, config JSON, connectedAt. Secrets are encrypted at rest (AES-256-GCM, key from env).
- `Lead`: name, phone, email, business, service, budget, message, sourcePage, utm fields, status (`NEW | CONTACTED | PROPOSAL | WON | LOST`), notes.
- `User`: name, email, passwordHash, role.

**Seed:** `prisma/seed.ts` reads `design-reference/content.json` and fills every table, uploads the logos and screenshots into `Media`, creates the blog posts (the SEO-cost article is Published, the others are Drafts), creates all `Page` rows with their titles/descriptions, and creates **all 12 reviews as `DRAFT`**.

---

## 9. Lead forms

- Forms: the hero "Get a Free Quote" (name, phone, service, business), the CTA band forms, and the contact page.
- `POST /api/leads`:
  - Validate with Zod, check reCAPTCHA v3 when connected (score ≥ 0.5), and rate-limit by IP.
  - Store the lead with its source page and UTM fields.
  - Email the team, then redirect to `/thank-you`.
- Fire analytics events: `generate_lead`, Meta `Lead`, and the Google Ads conversion (see section 12).
- WhatsApp links use the number and pre-filled message from the WhatsApp integration (default `917303468073`).

---

## 10. Reviews: strict honesty rule

- The 12 owner reviews in `content.json → REVIEWS` were **drafted by the agency and are not yet approved** by the clients.
- **On the live site, show only reviews with status `APPROVED`.** Draft reviews must never appear publicly.
  - Where a case has no approved review, the case page shows the **owner card only** (name, role, business).
  - On the home spotlight, that owner's card shows the case's one-line result instead of a quote, exactly like the reference fallback.
- In the admin preview, draft reviews may show with the dashed "Draft review · waiting for [Name]'s approval" label from the reference.
- Admin **Reviews** screen:
  - Columns: list, edit text, status, "Approved by / date".
  - A "Copy WhatsApp request" button that builds this message: *"Hi [Name], it's been great working with you on [Business]. We're updating our website and would love a short review…"* + the draft.
- Add `Review` JSON-LD only for approved reviews.

---

## 11. SEO requirements (non-negotiable)

1. **SSR everything** public. Every page uses `generateMetadata()` from the DB: title (apply the title template `%title% | AegisKoncept`), description, canonical, robots, Open Graph and Twitter cards (default OG image from settings).
2. **JSON-LD:**
   - Every page: `MarketingAgency` (from business settings, founders Ritesh Kumar and Yogeesh Gahlot), `WebSite`, and `BreadcrumbList`.
   - Page-specific: `Service` on service pages, `BlogPosting` (+ `FAQPage` when an FAQ exists) on articles, `LocalBusiness` with `areaServed` on location pages, `FAQPage` on pages with FAQ blocks, `VideoObject` on the videos page, and `CreativeWork` on case studies.
3. **`/sitemap.xml`** is generated from `SitemapEntry` + published content. Noindex pages are excluded automatically. Split into sitemap index files if over 500 URLs.
4. **`/robots.txt`** comes from settings (the default is in the admin reference).
5. **Redirects** are handled in `middleware.ts` from the `Redirect` table (cached). Increment hits. Also map every old hash URL (`/#services-seo`) with a tiny client script that rewrites to the clean URL.
6. **IndexNow:**
   - Host `/<key>.txt`.
   - On publish or update of any post or page, POST to `https://api.indexnow.org/indexnow`.
   - Add the URL to the Search Console "to request" list.
7. **Performance:**
   - LCP < 2.0s on 4G mobile, CLS < 0.05, INP < 200ms, JS < 170KB gzip on the home page.
   - Lazy-load the hero canvas logic after first paint.
   - Fonts are preloaded with `next/font`.
   - Images are WebP/AVIF with width/height set.
8. **Headings:** exactly one H1 per page, logical H2/H3 order. All images need alt text (from `Media.alt`).
9. **Internal links:** locations ↔ nearby areas, industries ↔ services ↔ cases, all as in the reference.

---

## 12. Integrations (tracking code injected from the admin)

Inject scripts in `app/(site)/layout.tsx` based on `Integration` rows, **using the exact snippets the admin reference generates** (see `gSnippet()` in `admin-template.html`):

- Search Console `google-site-verification` meta, Bing `msvalidate.01` meta, and Meta `facebook-domain-verification` meta.
- GTM container (+ `<noscript>` iframe), or GA4 `gtag.js` (skip GA4 if "load through GTM" is on), plus Google Ads `config`, with enhanced conversions if enabled.
- Meta Pixel `PageView`. Send `Lead`, `Contact` and `ViewContent` per the toggles. If an access token is set, mirror Lead/Contact server-side via the **Conversions API** with an `event_id` for deduplication.
- Microsoft Clarity (mask inputs when the toggle is on), and reCAPTCHA v3 on forms.
- **Events:**
  - `generate_lead` fires on form success.
  - `whatsapp_click`, `phone_click`, `scroll` (90%), outbound `click` and `video_open` fire from the site.
  - Each event is gated by the GA4 event toggles. Key events are marked in config.
- **Consent Mode v2** defaults when the toggle is on, with a minimal cookie banner in the site style.
- Load scripts with `next/script` `strategy="afterInteractive"` (Clarity/Pixel `lazyOnload`) so they don't hurt performance.

---

## 13. Admin panel (`/admin`): match `admin-design.html` exactly

Same look: charcoal rail with groups, cream workspace, breadcrumbs, sticky top bar, "View website ↗". The groups are **Blog, SEO, Tools, Website**. Everything saves to the **database through the API**: no localStorage, autosave with the "Saving… / All changes saved" indicator. EDITOR users can write and save drafts; only ADMIN users can publish, delete, and change SEO settings and integrations.

**Blog**
- **All posts:**
  - Status tabs with counts, search, a category filter, and bulk publish/draft/delete.
  - Columns: SEO score dot, words, date.
  - Row actions: Edit, Duplicate, Preview, Delete. Deleting asks to confirm in a modal (no `window.confirm`).
- **Post editor:** a two-column layout.
  - Left: title, slug ("From title"), and the TipTap editor with this toolbar:
    - paragraph/H2/H3/quote, bold/italic/underline, bullet/numbered lists
    - link (picker of your own pages + external, new-tab option)
    - image from the media library with an alt-text step, table, service box, FAQ block, CTA block
    - undo/redo, clear formatting
  - Word count, read time, and the excerpt.
  - Right sidebar:
    - Publish (status, date and schedule, author, Save draft / Preview / Publish or Update, with a confirm when the SEO score is under 50).
    - **SEO panel**, 4 tabs: **Basics** (focus keyword, Google title and description with meters and counters, desktop/mobile Google preview), **Check** (the 13-point live analysis, port `analyse()` from the reference exactly), **Social** (OG title, description, preview), **Advanced** (canonical, index toggle, schema type, JSON-LD preview).
    - Featured image, category & tags, and an outline built from the headings.
  - Scheduled posts publish automatically (cron or on-request check).
- **Categories & tags:** add, rename (updates posts), delete (blocked while it has posts), tags in use.

**SEO**
- **Overview:** site health ring, KPIs (indexed URLs, hidden, redirects, drafts), the issues list with **Fix** buttons that open the right editor, and the Search Console status card.
- **Titles & descriptions:** inline-editable table of every page and post, with counters and an index toggle.
- **Sitemap:** include toggle, priority, changefreq, XML preview, copy.
- **Robots.txt:** editor, reset to default, and a URL tester.
- **Redirects:** add (validation: must start with `/`, no duplicates, not the same as the target), list, hits, delete.
- **Schema & settings:** title template, home title, default description, default share image, business details (local SEO) with a live JSON-LD preview, and verification codes.

**Tools & integrations:** the 12 tools grouped as Google / Meta / Microsoft / Website & SEO / Messaging, with the same cards, Connect modals, step lists, ID validation regexes, toggles and "Code added to every page" box as the reference. Each tool has a **Manage** page:
- Search Console: sitemaps (submit/resubmit), the "Ask Google to index pages" list (posts auto-added on publish), search performance.
- GA4: event toggles + key events, internal-traffic IP, data retention.
- Business Profile: review link + Share on WhatsApp.
- IndexNow: key file + notification log.
- WhatsApp: link + test.
- Looker Studio: open report.
- Every tool also gets connection details and shortcuts.

**Real data (this is new versus the design, so build it):** implement **Google OAuth 2.0** ("Sign in with Google" in the Search Console, GA4 and Business Profile modals, keeping the paste-ID option as a fallback). Store refresh tokens encrypted. Then fetch:
- Search Console API: clicks, impressions, CTR and position for the last 28 days, top queries and pages; submit sitemaps and URL inspection from the Manage page.
- GA4 Data API: users, sessions, key events, top pages.
- Business Profile API: reviews count and rating.

Cache the results for 6 hours. Show them where the reference shows "—" placeholders.

**Website**
- **Pages:** type tabs, search, and the page editor with three tabs: Content (H1, intro, sections reorder + show/hide), SEO (title, description, canonical, index, share image, previews), Settings (status, name, menu/footer).
- **Locations:** list + full editor with these parts:
  - area details, parent, featured case, office toggle, footer toggle
  - H1, intro and land paragraph with word count, business chips
  - challenges rows with a service select
  - searches, nearby areas
  - SEO with preview, the local SEO checklist, add/delete area
- **Videos:** grid in site order, category tabs, and an add/edit modal: Vimeo URL → ID extraction, title, label, client, category, poster, home/videos toggles, move earlier/later, delete.
- **Media library:** drag-and-drop upload (max 5MB, auto WebP + resize), folder tabs, search, "missing alt text" count, and a details panel (name, type, size with a "large" warning, dimensions, alt text, used on, copy, delete with a usage warning).
- **Our Work + Reviews + Leads:** add these screens (not in the design reference; use the same admin style):
  - Case study editor: all `CaseStudy` fields, results rows, screenshot picker, live URL, owner.
  - Reviews approval (section 10).
  - Leads inbox: status pipeline, notes, WhatsApp button, CSV export.

---

## 14. Responsive and accessibility

- Must match the reference at **1440, 1280, 1100, 900, 600, 440 and 390px**. **Zero horizontal scroll at any width** (the reference was tested to 0px overflow on all 65 pages).
- Visible keyboard focus, skip link, ARIA on the menus, slider, tabs, accordion and lightbox. Colour contrast AA (note the reference fix: "Watch on Vimeo" turns ink-coloured on cream sections).
- Tap targets of 40px or more on mobile (chips are already 40px in the reference).

---

## 15. Build order (finish and verify each step before the next)

1. Set up the repo, tokens, fonts, global CSS port, Prisma schema, seed from `content.json`, assets imported into `Media`.
2. Global layout: header (glass), mega menu, mobile menu, footer with locations, cursor, curtain, overlays, WhatsApp bar.
3. Home page with **all** effects (hero canvas, letter reveal, ticker, form border/tilt, manifesto scrub, pinned work, logo marquee, reviews spotlight).
4. Services hub + 5 service pages.
5. Our Work hub + 14 case studies (screens, proof galleries, live links).
6. Videos (with the lightbox), industries (13), locations (16), blog listing + article + author, contact, legal, 404, all-pages.
7. SEO layer: metadata, JSON-LD, sitemap, robots, redirects, IndexNow, lead API, emails, reCAPTCHA.
8. Admin: auth, blog manager + SEO panel, SEO module, pages, locations, videos, media, reviews, cases, leads.
9. Integrations: snippet injection + events + Conversions API, then Google OAuth + live data.
10. QA, performance, deployment.

---

## 16. Acceptance tests (must all pass)

- **Visual:** a Playwright script opens `/design-reference/website-design.html#<id>` and your `/<url>` at 1440×900 and 390×844 for **every** page (65) and compares full-page screenshots with reveal animations forced to their end state. The pixel difference must be ≤ 1.5% per page (allowing for font anti-aliasing). Store the diffs in `/qa/diffs`.
- **Overflow:** `document.documentElement.scrollWidth === innerWidth` on every page at both widths.
- **Console:** zero errors or warnings on every page.
- **SEO:** each page's HTML (curl, no JS) contains the title, meta description, canonical, one H1, and valid JSON-LD (validate with schema.org). The sitemap lists exactly the indexable published URLs.
- **Behaviour:** the hero slider autoplays and syncs the form; the curtain runs on navigation; the mega menu works by keyboard; the mobile menu locks scroll; filters work on the work and video pages; the video lightbox plays; forms create a lead, send email and land on `/thank-you`; GA4 `generate_lead` fires (check with GA DebugView).
- **Reviews:** with every review in DRAFT, no review text appears in the public HTML. After approving one in the admin, it appears on its case page and the home spotlight (after revalidation).
- **Lighthouse (mobile):** Performance ≥ 90, SEO 100, Accessibility ≥ 95, Best Practices ≥ 95 on home, a service, a case, a location and an article.

---

## 17. Deployment

- Target: **Hostinger** (Node.js web app or VPS) or any Node 20 host.
- Run `next build && next start` behind PM2/Nginx on a VPS.
- Provide `.env.example` with: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ENCRYPTION_KEY`, `SMTP_*`, `LEAD_NOTIFY_EMAIL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `META_CAPI_TOKEN` (optional), `STORAGE`, `S3_*` (optional), `SITE_URL=https://aegiskoncept.com`.
- Include a `README.md` covering: local setup, seeding, creating the first admin user (`npm run create-admin`), deploying, cron for scheduled posts, and how to approve reviews.

---

## 18. Do not

- Do not change any colour, font, spacing, copy or animation timing from the reference.
- Do not use Tailwind, Bootstrap, MUI, shadcn or any template look.
- Do not render public pages client-side only.
- Do not show draft reviews publicly or invent testimonials, numbers or clients. Use only `content.json`.
- Do not put a phone number in any video or reel CTA.
- Do not leave base64 images in the build.
- Do not skip `prefers-reduced-motion`.
- Do not ship with any page horizontally scrolling on mobile.

Start with step 1. After each step, show me screenshots of your build next to the reference at 1440 and 390px before moving on.
