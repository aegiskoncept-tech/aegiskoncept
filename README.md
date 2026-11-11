# AegisKoncept - Production Website & Content Admin

Official production website and comprehensive content administration portal for **AegisKoncept**, a premier digital marketing agency in Dwarka, New Delhi (Founders: Ritesh Kumar and Yogeesh Gahlot).

Built with **Next.js 14 (App Router)**, **React 18**, **TypeScript**, **Prisma ORM**, and **SQLite**.

---

## 🌟 Key Capabilities & Features

### 1. Public Website
- **Architecture:** SSR & SSG across all 81 pages for maximum SEO performance.
- **Brand Aesthetic:** Custom luxury arch aesthetic (`#191919`, `#F4F0E8`, `#D3E45B`), Instrument Serif & Inter Tight typography.
- **Hero Canvas:** 16 dynamic cubic-eased arches growing from bottom center with mouse parallax, scroll speedup, and lime burst transitions.
- **Hero Slider:** 4 slides with numbered tabs 01–04, letter-by-letter reveal (`.ch` with `--i`), 7s autoplay, and pause/play controls.
- **Hero Form:** Conic-gradient lime border (`@property --ha`), 3D perspective mouse tilt, and direct lead submission to SQLite.
- **Interactive Components:**
  - Services Mega Menu with live hover mockups.
  - Client Logos marquee with scroll velocity skewing.
  - Scroll-lit manifesto scrub effect (`.sw.lit`).
  - Desktop pinned horizontal work showcase track with live progress bar (`.pin-bar`).
  - Video Hub with 9:16 vertical poster cards and accessible Vimeo iframe lightbox modal.
  - Dynamic Service Hub & 5 detail pages, Our Work & 14 case studies, 13 Sector pages, 16 Delhi NCR location hubs, Blog & Author pages.

### 2. Strict Honesty Rule
- All 12 client reviews in `content.json` were seeded as `DRAFT` in SQLite `dev.db`.
- **Under no circumstances does unapproved review text appear in public server-rendered HTML.**
- When a review is in `DRAFT`, the public pages automatically fall back to owner cards with initials, verified metrics, and company proofs.
- Reviews can be approved via the Admin panel (`/admin#reviews`) which immediately triggers Next.js on-demand cache revalidation.

### 3. SEO & Indexing Layer
- **`app/sitemap.ts`**: Generates `/sitemap.xml` with priorities, update frequencies, and exclusion of noindex routes.
- **`app/robots.ts`**: Generates `/robots.txt` disallowing `/admin` and `/api/` while pointing to the sitemap.
- **Structured Data (JSON-LD)**: Complete schemas for `MarketingAgency`, `WebSite`, `BreadcrumbList`, `Service`, `BlogPosting`, `LocalBusiness`, `FAQPage`, `VideoObject`, and `CreativeWork`.
- **`middleware.ts`**: Trailing slash normalization, old hash URL rewriting (`/#services-seo` -> `/services/seo`), and cached 301/302 redirects from `Redirect` database table with hit counters.
- **IndexNow Integration**: Verified key file `public/aegiskoncept8f9c1b2e3d4a5b6c7d8e9f0a.txt` and automatic push to search engines upon post publication.

### 4. Admin Portal (`/admin`)
- **Authentication:** NextAuth.js credentials provider with bcrypt password hashing and HTTP-only session cookies.
- **Blog Manager:** Full post editor featuring a live **13-point SEO scoring engine** (calculating focus keyword placement, density, title/meta lengths, word counts, readability, and internal links).
- **SEO Module:** Overall site health overview ring, redirects manager, robots.txt editor, and sitemap inspector.
- **Reviews Honesty Manager:** Toggle review approval state (`APPROVED` vs `DRAFT`) with live cache revalidation.
- **Leads Inbox:** Track all form submissions with status pipeline (`NEW`, `CONTACTED`, `PROPOSAL`, `WON`, `LOST`) and one-click CSV export.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node.js 24)
- npm or pnpm

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup & Seeding
```bash
npx prisma db push
npm run prisma:seed
```

### 4. Create or Reset the Admin User
```bash
npm run create-admin
```
Default credentials:
- **Email:** `admin@aegiskoncept.com`
- **Password:** `AegisAdmin2026!`

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the website.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to view the content admin.

### 6. Build for Production
```bash
npm run build
npm start
```

---

## 🧪 Verification & QA

- **SSR & HTML Integrity:** Run `node scripts/test-ssr.js`, `node scripts/test-services-ssr.js`, or `node scripts/test-work-ssr.js` to verify server-rendered HTML and ensure zero draft review text leaks into public markup.
- **Admin Verification:** Access `/admin/login`, authenticate with `admin@aegiskoncept.com` / `AegisAdmin2026!`, and test toggling reviews, editing posts with live SEO score updates, and exporting leads to CSV.

