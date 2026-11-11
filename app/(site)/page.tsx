import React from 'react';
import Link from 'next/link';
import HeroSection from '@/components/site/HeroSection';
import LogoMarquee from '@/components/site/LogoMarquee';
import ManifestoScrub from '@/components/site/ManifestoScrub';
import PinnedWork from '@/components/site/PinnedWork';
import ReviewsSpotlight, { ReviewOwnerItem } from '@/components/site/ReviewsSpotlight';
import CtaBand from '@/components/site/CtaBand';
import { Vis, Cover } from '@/components/site/Mockups';
import { ARCH_PATH } from '@/components/site/Icons';
import { db } from '@/lib/db';
import { FALLBACK_CASES, getFallbackCase } from '@/lib/staticFallbacks';

export const dynamic = 'force-dynamic';

const SERVICES = [
  {
    id: 'website-development-design',
    name: 'Website Design & Development',
    line: 'Good-looking websites that bring you enquiries.',
    vis: 'site',
  },
  {
    id: 'seo',
    name: 'SEO',
    line: 'Show up on Google when people search for you.',
    vis: 'seo',
  },
  {
    id: 'performance-marketing',
    name: 'Google & Meta Ads',
    line: 'Ads on Google, Instagram and Facebook that bring real leads.',
    vis: 'ads',
  },
  {
    id: 'social-media-marketing-management',
    name: 'Social Media Management',
    line: 'We post, we reply to your DMs, and we grow your page.',
    vis: 'dm',
    tag: 'We reply to your DMs too',
  },
  {
    id: 'video-production',
    name: 'Shoots & Video Production',
    line: 'Reels, ad films and product shoots, made by our own crew.',
    vis: 'vid',
  },
];

const PROCESS_STEPS = [
  {
    title: 'We listen',
    desc: 'We learn about your business, your customers and your goals.',
  },
  {
    title: 'We plan',
    desc: 'We make a clear plan that fits your goals and budget.',
  },
  {
    title: 'We create',
    desc: 'Websites, posts, videos and ads, made by our own team.',
  },
  {
    title: 'We launch',
    desc: 'We put everything live and manage it every week.',
  },
  {
    title: 'We improve',
    desc: 'Every month we check what worked and make it better.',
  },
];

const MONTHLY_CALENDAR = [
  { week: 'Week 1', desc: 'We plan the month and share the calendar.' },
  { week: 'Week 2', desc: 'We make the posts. You approve them.' },
  { week: 'Weeks 2–4', desc: 'We post, and reply to DMs and comments.' },
  { week: 'Week 4', desc: 'You get a report and next month’s plan.' },
];

const ALL_SECTORS: Array<[string, string]> = [
  ['ecommerce-d2c', 'Online Brands (D2C)'],
  ['healthcare-wellness', 'Health & Fitness'],
  ['interiors-design', 'Interiors & Design'],
  ['startups', 'Startups'],
  ['tech-saas', 'Tech & SaaS'],
  ['education', 'Education & Coaching'],
  ['real-estate', 'Real Estate & B2B Spaces'],
  ['hotels-travel', 'Hotels & Travel'],
  ['fashion-lifestyle', 'Fashion & Lifestyle'],
  ['beauty-salons', 'Beauty & Salons'],
  ['food-drinks', 'Food & Drinks'],
  ['professional-services', 'Professional Services'],
  ['automotive', 'Automotive'],
];

const WHY_US_TICKS = [
  { title: 'We plan before we post', desc: 'Every month starts with a clear plan.' },
  { title: 'Ideas that stand out', desc: "Your brand won't look like everyone else's." },
  { title: 'We care about sales', desc: 'We track enquiries and sales, not just likes.' },
  { title: 'You can always reach us', desc: 'One person who knows your account.' },
  { title: 'Monthly reports', desc: "You'll always know what's next and why." },
  { title: 'We stick around', desc: 'We grow with you, from launch to scale.' },
  { title: 'Always improving', desc: 'We test, learn and get better every month.' },
];

export default async function HomePage() {
  // Query case studies with owner info for Reviews Spotlight
  let caseStudies: any[] = [];
  let approvedReviews: any[] = [];

  try {
    [caseStudies, approvedReviews] = await Promise.all([
      db.caseStudy.findMany({ orderBy: { order: 'asc' } }),
      db.review.findMany({ where: { status: 'APPROVED' } }),
    ]);
  } catch (err) {
    console.warn('HomePage database query failed, using static fallbacks:', err);
    caseStudies = FALLBACK_CASES.map((slug) => getFallbackCase(slug)).filter(Boolean);
  }

  const approvedMap = new Map<string, string>();
  for (const r of approvedReviews) {
    if (r.caseId) approvedMap.set(r.caseId, r.text);
  }

  // Format owner items for spotlight
  const reviewItems: ReviewOwnerItem[] = caseStudies
    .filter((c) => c.ownerName && c.ownerRole)
    .map((c) => {
      let resultsArr: Array<[string, string]> = [];
      try {
        const parsed = JSON.parse(c.results);
        if (Array.isArray(parsed)) {
          resultsArr = parsed.map((item: any) =>
            Array.isArray(item)
              ? [String(item[0] || ''), String(item[1] || '')]
              : [String(item.num || ''), String(item.lbl || '')]
          );
        }
      } catch {}

      let svcsArr: string[] = [];
      try {
        svcsArr = JSON.parse(c.services);
      } catch {}

      return {
        id: c.slug,
        owner: [c.ownerName!, c.ownerRole!],
        client: c.client,
        loc: c.location || 'India',
        one: c.oneLine,
        svcs: svcsArr,
        res: resultsArr,
        approvedQuote: approvedMap.get(c.id),
      };
    });

  return (
    <>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Logo Strip */}
      <LogoMarquee />

      {/* 3. Scroll-Lit Manifesto */}
      <ManifestoScrub />

      {/* 4. We Don't Just Do Marketing */}
      <section className="dk">
        <div className="in sec">
          <div className="split" style={{ alignItems: 'end' }}>
            <div className="stack rv" style={{ gap: '22px' }}>
              <h2 className="sf h2">
                We Don&apos;t Just Do Marketing. We Help You{' '}
                <span className="hl">Grow</span>.
              </h2>
              <p className="ld mu">
                We start by understanding your business. Then we make things that look
                great and work hard. And we keep improving them, month after month.
              </p>
              <Link className="tl arr" href="/about">
                How we work
              </Link>
            </div>
            <div className="stack" style={{ gap: '4px' }}>
              {[
                {
                  w: 'Create',
                  d: 'We make your brand look good',
                  href: '/services/website-development-design',
                  lime: false,
                },
                {
                  w: 'Plan',
                  d: 'Every step has a reason',
                  href: '/services/seo',
                  lime: false,
                },
                {
                  w: 'Grow',
                  d: 'More enquiries, more sales',
                  href: '/services/performance-marketing',
                  lime: true,
                },
              ].map((item) => (
                <Link
                  key={item.w}
                  href={item.href}
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: '20px',
                    borderTop: '1px solid var(--line-d)',
                    paddingTop: '10px',
                  }}
                >
                  <span className={`pill-word${item.lime ? ' lime' : ''}`}>
                    {item.w}
                  </span>
                  <span className="sm mu hide-m">{item.d} →</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Services Rows */}
      <section className="wh">
        <div className="in sec">
          <div className="stack" style={{ gap: '48px' }}>
            <div className="split rv" style={{ alignItems: 'end' }}>
              <h2 className="sf h2">Everything You Need to Grow Online.</h2>
              <p className="ld mu">
                Five services from one team. Start with one. Add more when you&apos;re ready.
              </p>
            </div>
            <div>
              {SERVICES.map((s) => (
                <Link
                  key={s.id}
                  className="svc-row"
                  href={`/services/${s.id}`}
                >
                  <span className="stack" style={{ gap: '10px' }}>
                    <span
                      className="sf h2"
                      style={{ fontSize: 'clamp(32px,3.4vw,52px)' }}
                    >
                      {s.name}
                    </span>
                    {s.tag && <span className="tag">{s.tag}</span>}
                  </span>
                  <span className="desc mu ld">{s.line}</span>
                  <span className="thumb">
                    <Vis kind={s.vis} cls="r11" />
                  </span>
                  <span className="go" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pinned Horizontal Work Section */}
      <PinnedWork />

      {/* 7. Simple Process. Clear Results. */}
      <section className="cr">
        <div className="in sec">
          <div className="split">
            <div
              className="stack"
              style={{ gap: '28px', position: 'sticky', top: '120px' }}
            >
              <h2 className="sf h2">Simple Process. Clear Results.</h2>
              <p className="ld mu">
                No confusing jargon. You&apos;ll always know what we&apos;re doing and why.
              </p>
              <svg
                className="arch-draw"
                viewBox="0 0 100 110"
                width="180"
                height="198"
                aria-hidden="true"
              >
                <path
                  d={ARCH_PATH}
                  fill="none"
                  stroke="#191919"
                  strokeWidth="1.6"
                />
              </svg>
            </div>
            <div>
              {PROCESS_STEPS.map((step, idx) => (
                <div key={idx} className="step rv">
                  <span className="n tab">{idx + 1}</span>
                  <div className="stack" style={{ gap: '6px' }}>
                    <span className="sf h3">{step.title}</span>
                    <span className="mu">{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Every Month, Like Clockwork */}
      <section className="dk">
        <div className="in sec">
          <div className="split-r">
            <div className="stack rv" style={{ gap: '24px' }}>
              <h2 className="sf h2">Every Month, Like Clockwork.</h2>
              <p className="ld mu">
                Here&apos;s what a normal month of social media looks like with us.
              </p>
              <div className="cols c2">
                {MONTHLY_CALENDAR.map((cal, idx) => (
                  <div
                    key={idx}
                    className="stack"
                    style={{
                      gap: '6px',
                      borderTop: '1px solid var(--line-d)',
                      paddingTop: '14px',
                    }}
                  >
                    <b>{cal.week}</b>
                    <span className="mu sm">{cal.desc}</span>
                  </div>
                ))}
              </div>
              <p className="note">Other services follow their own monthly cycle.</p>
            </div>
            <div className="rv">
              <Vis kind="cal" cls="r11" />
            </div>
          </div>
        </div>
      </section>

      {/* 9. Every Industry Is Different */}
      <section className="dk">
        <div className="in sec" style={{ paddingTop: 0 }}>
          <div className="stack" style={{ gap: '40px' }}>
            <div className="split rv" style={{ alignItems: 'end' }}>
              <h2 className="sf h2">Every Industry Is Different.</h2>
              <p className="ld mu">
                Pick your industry to see the usual problems, how we fix them, and
                which service does it.
              </p>
            </div>
            <div className="ind-list rv">
              {ALL_SECTORS.map(([id, name]) => (
                <Link key={id} href={`/industries/${id}`}>
                  {name}
                  <span>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. Why People Work With Us */}
      <section className="cr">
        <div className="in sec">
          <div className="split">
            <div className="stack rv" style={{ gap: '24px' }}>
              <h2 className="sf h2">Why People Work With Us.</h2>
              <figure className="stack" style={{ gap: '18px', marginTop: '8px' }}>
                <div className="cols c2" style={{ maxWidth: '420px', gap: '12px' }}>
                  <div className="mono">RK</div>
                  <div className="mono" style={{ background: 'var(--ink)' }}>
                    YG
                  </div>
                </div>
                <blockquote
                  className="big-quote"
                  style={{ fontSize: 'clamp(26px,2.4vw,34px)' }}
                >
                  &ldquo;We started AegisKoncept to be the team we wished small
                  businesses had. One that thinks, creates, and sticks around.&rdquo;
                </blockquote>
                <figcaption className="sm mu">
                  Ritesh Kumar &amp; Yogeesh Gahlot, Founders
                </figcaption>
              </figure>
            </div>
            <div className="stack">
              {WHY_US_TICKS.map((t, idx) => (
                <div key={idx} className="tick rv">
                  <span />
                  <div className="stack" style={{ gap: '4px' }}>
                    <b style={{ fontSize: '19px' }}>{t.title}</b>
                    <span className="mu">{t.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 11. Reviews Spotlight */}
      <ReviewsSpotlight items={reviewItems} />

      {/* 12. Blog / Tips to Grow Your Business */}
      <section className="cr">
        <div className="in sec">
          <div className="stack" style={{ gap: '40px' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'end',
                gap: '24px',
              }}
              className="rv"
            >
              <h2 className="sf h2" style={{ maxWidth: '12em' }}>
                Tips to Grow Your Business.
              </h2>
              <Link className="tl arr" href="/insights">
                Read the blog
              </Link>
            </div>
            <div className="split-r" style={{ alignItems: 'start' }}>
              <Link className="case rv" href="/insights/seo-cost-india">
                <Cover word="SEO cost" cls="r169" />
                <span className="xs mu">SEO · 9 min read</span>
                <span className="sf h2">How Much Does SEO Cost in India?</span>
                <span className="mu">
                  What you pay for, what you should get, and what to avoid.
                </span>
              </Link>
              <div className="stack">
                {[
                  {
                    cat: 'Digital Marketing',
                    min: '8 min',
                    title: 'How to Choose the Right Digital Marketing Agency in India',
                    href: '/insights',
                  },
                  {
                    cat: 'Ads',
                    min: '7 min',
                    title: 'Google Ads vs Meta Ads for Indian Businesses',
                    href: '/insights',
                  },
                  {
                    cat: 'Websites',
                    min: '6 min',
                    title: 'Common Website Mistakes That Cost You Leads',
                    href: '/insights',
                  },
                ].map((a, idx) => (
                  <Link
                    key={idx}
                    className="case rv"
                    href={a.href}
                    style={{
                      padding: '22px 0',
                      borderTop: '1px solid var(--line-l)',
                    }}
                  >
                    <span className="xs mu">
                      {a.cat} · {a.min} read
                    </span>
                    <span className="sf h3">{a.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. CTA Band */}
      <CtaBand
        title="Got a Goal? Let's Make a Plan."
        sub="Tell us where your business is today and where you want it to be. We'll reply within 1 working day."
      />
    </>
  );
}
