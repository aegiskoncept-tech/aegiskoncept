import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/site/Breadcrumb';
import ArtRows, { ArtRowItem } from '@/components/site/ArtRows';
import CtaBand from '@/components/site/CtaBand';
import { db } from '@/lib/db';
import { FALLBACK_INSIGHTS, getFallbackPost } from '@/lib/staticFallbacks';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return [{ slug: 'ritesh-kumar' }];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  if (params.slug !== 'ritesh-kumar') return { title: 'Author Not Found | AegisKoncept' };

  return {
    title: 'Ritesh Kumar | Founder & Growth Strategist at AegisKoncept',
    description:
      'Ritesh Kumar is the founder of AegisKoncept. He writes practical guides on SEO, search rankings, website development and digital marketing for Indian businesses.',
    alternates: {
      canonical: `/insights/author/${params.slug}`,
    },
  };
}

export default async function AuthorProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  if (params.slug !== 'ritesh-kumar') notFound();

  let posts: any[] = [];
  try {
    posts = await db.post.findMany({
      orderBy: { publishAt: 'desc' },
      include: { category: true },
    });
  } catch {}

  if (!posts || posts.length === 0) {
    posts = FALLBACK_INSIGHTS.map((slug) => getFallbackPost(slug)).filter(Boolean);
  }

  const formattedArticles: ArtRowItem[] = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category ? p.category.name : 'Digital Marketing',
    readMinutes: `${p.readMinutes} min`,
    date: p.publishAt
      ? new Date(p.publishAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '2026',
    short: p.focusKeyword || p.title,
    kind: '',
  }));

  return (
    <>
      <section className="cr">
        <div className="in sec">
          <div className="stack" style={{ gap: '28px' }}>
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blog', href: '/insights' },
                { label: 'Ritesh Kumar' },
              ]}
            />

            <div className="split" style={{ alignItems: 'center' }}>
              <div
                className="mono"
                style={{
                  width: '120px',
                  height: '120px',
                  fontSize: '44px',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                RK
              </div>
              <div className="stack" style={{ gap: '18px' }}>
                <span className="lbl">Writer &amp; Founder</span>
                <h1 className="sf h1" style={{ margin: 0 }}>
                  Ritesh Kumar
                </h1>
                <p className="ld">
                  Founder of AegisKoncept. Ritesh started with SEO in December 2021 and
                  then moved into websites, social media and ads. He writes simple,
                  practical guides for Indian businesses.
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <a
                    className="tl"
                    href="https://www.linkedin.com/in/ritesh-kumar"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn Profile ↗
                  </a>
                  <a className="tl" href="mailto:ritesh@aegiskoncept.com">
                    ritesh@aegiskoncept.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles by Ritesh */}
      <section className="wh">
        <div className="in sec">
          <div className="stack" style={{ gap: '32px' }}>
            <h2 className="sf h2">Articles by Ritesh Kumar</h2>
            <div id="art-list">
              <ArtRows items={formattedArticles} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <CtaBand
        title="Want Ritesh to Review Your Business Strategy?"
        sub="Book an initial consultation to talk through your website and Google rankings."
      />
    </>
  );
}

