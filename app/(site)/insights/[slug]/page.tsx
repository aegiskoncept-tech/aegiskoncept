import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/site/Breadcrumb';
import ArtRows, { ArtRowItem } from '@/components/site/ArtRows';
import CtaBand from '@/components/site/CtaBand';
import JsonLd from '@/components/seo/JsonLd';
import { getArticleSchema, getBreadcrumbSchema } from '@/lib/jsonLd';
import { db } from '@/lib/db';
import { FALLBACK_INSIGHTS, getFallbackPost } from '@/lib/staticFallbacks';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  try {
    const posts = await db.post.findMany({ select: { slug: true } });
    if (posts.length > 0) {
      return posts.map((p) => ({ slug: p.slug }));
    }
  } catch (err) {
    console.warn('generateStaticParams [insights] query failed, using static fallback:', err);
  }
  return FALLBACK_INSIGHTS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  let post = null;
  try {
    post = await db.post.findUnique({
      where: { slug: params.slug },
      include: { category: true },
    });
  } catch {}
  if (!post) post = getFallbackPost(params.slug);
  if (!post) return { title: 'Insights | AegisKoncept' };

  return {
    title: `${post.title} | AegisKoncept`,
    description: post.excerpt,
    alternates: {
      canonical: `/insights/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  let post = null;
  try {
    post = await db.post.findUnique({
      where: { slug: params.slug },
      include: { category: true },
    });
  } catch {}

  if (!post) {
    post = getFallbackPost(params.slug);
  }

  if (!post) notFound();

  // Related articles
  let otherPosts: any[] = [];
  try {
    otherPosts = await db.post.findMany({
      where: { id: { not: post.id } },
      take: 3,
      orderBy: { publishAt: 'desc' },
      include: { category: true },
    });
  } catch {}

  if (!otherPosts || otherPosts.length === 0) {
    otherPosts = FALLBACK_INSIGHTS.filter((s) => s !== post?.slug)
      .slice(0, 3)
      .map(getFallbackPost)
      .filter(Boolean);
  }

  const formattedOthers: ArtRowItem[] = otherPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category ? p.category.name : 'Digital Marketing',
    readMinutes: `${p.readMinutes} min`,
    date: p.publishAt ? new Date(p.publishAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '2026',
    short: p.focusKeyword || p.title,
    kind: '',
  }));

  const publishDateStr = post.publishAt
    ? new Date(post.publishAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '10 Nov 2026';

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/insights' },
    { name: post.title, url: `/insights/${post.slug}` },
  ]);
  const articleSchema = getArticleSchema({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    publishedAt: post.publishAt ? new Date(post.publishAt).toISOString() : undefined,
    updatedAt: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
  });

  return (
    <>
      <JsonLd data={[breadcrumbSchema, articleSchema]} />
      <article className="cr">
        <div className="in sec" style={{ paddingBottom: '48px' }}>
          <div
            className="stack"
            style={{ gap: '22px', maxWidth: '860px', margin: '0 auto' }}
          >
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blog', href: '/insights' },
                {
                  label: post.category ? post.category.name : 'SEO',
                  href: '/insights',
                },
                { label: post.title },
              ]}
            />

            <span className="lbl">{post.category ? post.category.name : 'SEO'}</span>
            <h1 className="sf h1">{post.title}</h1>
            <p className="ld">{post.excerpt}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                className="mono"
                style={{
                  width: '52px',
                  height: '52px',
                  fontSize: '20px',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                RK
              </div>
              <span className="sm">
                <Link href="/insights/author/ritesh-kumar">
                  <b>Ritesh Kumar</b>
                </Link>{' '}
                · Founder
                <br />
                <span className="mu">
                  {publishDateStr} · {post.readMinutes} min read
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="in sec" style={{ paddingTop: '0' }}>
          <div
            className="prose"
            style={{ maxWidth: '860px', margin: '0 auto' }}
            dangerouslySetInnerHTML={{ __html: (post as any).bodyHtml || '' }}
          />

          {/* Author Box */}
          <div
            className="rv"
            style={{
              maxWidth: '860px',
              margin: '64px auto 0',
              padding: '32px',
              background: 'var(--white)',
              borderTop: '2px solid var(--ink)',
              display: 'flex',
              gap: '24px',
              alignItems: 'center',
            }}
          >
            <div
              className="mono"
              style={{
                width: '64px',
                height: '64px',
                fontSize: '24px',
                borderRadius: '50%',
                flex: 'none',
              }}
            >
              RK
            </div>
            <div className="stack" style={{ gap: '6px' }}>
              <span className="xs mu">Written by</span>
              <b className="sf h3" style={{ fontSize: '24px' }}>
                <Link href="/insights/author/ritesh-kumar" style={{ textDecoration: 'none' }}>
                  Ritesh Kumar
                </Link>
              </b>
              <p className="mu sm">
                Founder of AegisKoncept. Ritesh leads technical search and strategy for Indian businesses.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {formattedOthers.length > 0 && (
        <section className="wh">
          <div className="in sec-s">
            <h2 className="sf h3" style={{ marginBottom: '20px' }}>
              Read Next
            </h2>
            <ArtRows items={formattedOthers} />
          </div>
        </section>
      )}

      {/* CTA Band */}
      <CtaBand
        title="Want Help With Your Digital Strategy?"
        sub="Talk to Ritesh and Yogeesh. We'll send a clear roadmap and quotation."
      />
    </>
  );
}

