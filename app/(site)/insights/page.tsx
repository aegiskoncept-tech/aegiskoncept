import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/site/Breadcrumb';
import ArtRows, { ArtRowItem } from '@/components/site/ArtRows';
import { Cover } from '@/components/site/Mockups';
import { db } from '@/lib/db';
import { FALLBACK_INSIGHTS, getFallbackPost } from '@/lib/staticFallbacks';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog & Practical Growth Guides | AegisKoncept',
  description:
    'Simple, actionable guides on SEO costs, Google ads, website design, and digital marketing strategies for Indian business owners.',
};

export default async function InsightsListingPage() {
  let posts: any[] = [];
  try {
    posts = await db.post.findMany({
      orderBy: { publishAt: 'desc' },
      include: { category: true },
    });
  } catch (err) {
    console.warn('[InsightsListing] DB unavailable, using fallback posts:', err);
  }

  if (!posts || posts.length === 0) {
    posts = FALLBACK_INSIGHTS.map((slug) => getFallbackPost(slug)).filter(Boolean);
  }

  const featured = posts.find((p) => p.slug === 'seo-cost-india') || posts[0];
  const listPosts = posts.filter((p) => p.slug !== featured?.slug);

  const formattedArticles: ArtRowItem[] = listPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category ? p.category.name : 'Digital Marketing',
    readMinutes: `${p.readMinutes} min`,
    date: p.publishAt ? new Date(p.publishAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '2026',
    short: p.focusKeyword || p.title,
    kind: '',
  }));

  return (
    <>
      {/* 1. Hero */}
      <section className="dk">
        <div className="in sec">
          <div className="stack" style={{ gap: '28px' }}>
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blog' },
              ]}
            />
            <div className="split" style={{ alignItems: 'end' }}>
              <h1 className="sf d1">Blog &amp; Growth Guides.</h1>
              <p className="ld">
                Plain-English advice on SEO, websites, ads and content marketing for
                Indian business owners. No marketing jargon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Article */}
      {featured && (
        <section className="cr">
          <div className="in sec" style={{ paddingBottom: '32px' }}>
            <Link
              className="case rv"
              href={`/insights/${featured.slug}`}
              style={{
                textDecoration: 'none',
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
                gap: '40px',
                alignItems: 'center',
              }}
            >
              <Cover word="SEO cost" cls="r169" />
              <div className="stack" style={{ gap: '16px' }}>
                <span className="xs mu">SEO · Most read</span>
                <span className="sf h1" style={{ fontSize: 'clamp(32px, 3.4vw, 48px)' }}>
                  {featured.title}
                </span>
                <span className="ld mu">{featured.excerpt}</span>
                <span className="sm">Ritesh Kumar · {featured.readMinutes} min read</span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* 3. Articles List */}
      <section className="cr">
        <div className="in sec" style={{ paddingTop: '16px' }}>
          <div className="stack" style={{ gap: '24px' }}>
            <h2 className="sf h2">Latest Articles</h2>
            <div id="art-list">
              <ArtRows items={formattedArticles} />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Question CTA Band */}
      <section className="dk">
        <div className="in sec-s">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '24px',
            }}
          >
            <h2 className="sf h2" style={{ margin: 0 }}>
              Got a Question? Ask Us.
            </h2>
            <Link className="btn b-l" href="/contact">
              Ask a Question
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

