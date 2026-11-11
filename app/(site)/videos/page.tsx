import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/site/Breadcrumb';
import VideoGridWithLightbox from '@/components/site/VideoGridWithLightbox';
import CtaBand from '@/components/site/CtaBand';
import JsonLd from '@/components/seo/JsonLd';
import { getVideoObjectSchema, getBreadcrumbSchema } from '@/lib/jsonLd';
import { db } from '@/lib/db';
import content from '@/design-reference/content.json';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Commercial Reels & Video Shoots | AegisKoncept',
  description:
    'Brand films, fitness reels and commercial ad shoots in 4K, filmed by our in-house production crew in Delhi NCR. No outsourced teams.',
};

const VIDEO_STATS = [
  { n: '7', l: 'commercial reels' },
  { n: '4K', l: 'Sony FX3 cinema production' },
  { n: '14+', l: 'shoots delivered' },
  { n: '0', l: 'outsourced crew' },
];

const WHAT_WE_SHOOT = [
  {
    title: 'Short-Form Reels',
    desc: 'High-energy vertical reels designed specifically for Instagram and Meta ads that hook viewers in the first 2 seconds.',
  },
  {
    title: 'Brand Stories & Films',
    desc: 'Cinematic brand films that communicate your craftsmanship, ethos, and credibility with studio lighting and audio.',
  },
  {
    title: 'Product & Drop Commercials',
    desc: 'Sharp macro and motion product videos for e-commerce, D2C brands, and seasonal releases.',
  },
  {
    title: 'Founder & Team Spotlights',
    desc: 'Natural, articulate interview-style videos that humanize your brand and build trust.',
  },
  {
    title: 'On-Location Facility Tours',
    desc: 'Polished architectural, gym, studio, and clinic walkthroughs captured in 4K with gimbal stabilization.',
  },
];

export default async function VideosPage() {
  let allVideos: any[] = [];
  try {
    allVideos = await db.video.findMany({
      orderBy: { order: 'asc' },
    });
  } catch (err) {
    console.warn('VideosPage database query failed, using static fallbacks:', err);
    allVideos = content.VIDEOS.map((v: any, idx: number) => ({
      id: v[0],
      vimeoId: v[0],
      title: v[1],
      label: v[2],
      client: v[3],
      category: v[4],
      posterMediaId: v[5],
      order: idx,
    }));
  }

  const categories = [
    'All',
    ...Array.from(new Set(allVideos.map((v) => v.category).filter(Boolean))),
  ] as string[];

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Videos', url: '/videos' },
  ]);

  const videoSchemas = allVideos.map((v) =>
    getVideoObjectSchema({
      title: v.title,
      description: `Commercial video shoot for ${v.client} by AegisKoncept`,
      thumbnailUrl: `https://vumbnail.com/${v.vimeoId}.jpg`,
      uploadDate: '2026-01-01T00:00:00+05:30',
      embedUrl: `https://player.vimeo.com/video/${v.vimeoId}`,
    })
  );

  return (
    <>
      <JsonLd data={[breadcrumbSchema, ...videoSchemas]} />
      {/* 1. Hero */}
      <section className="dk">
        <div className="in sec">
          <div className="stack" style={{ gap: '28px' }}>
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Videos' },
              ]}
            />
            <div className="split" style={{ alignItems: 'end' }}>
              <h1 className="sf d1">Videos We&apos;ve Shot.</h1>
              <p className="ld">
                Brand films, gym reels and ad creatives, planned, shot and edited by our own
                crew on cinema cameras.
              </p>
            </div>

            <div className="stats">
              {VIDEO_STATS.map((s, idx) => (
                <div key={idx} className="st">
                  <span className="sf stn">{s.n}</span>
                  <span className="mu sm">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Filter & Video Grid with Lightbox */}
      <VideoGridWithLightbox
        videos={allVideos.map((v) => ({
          id: v.id,
          vimeoId: v.vimeoId,
          title: v.title,
          label: v.label,
          client: v.client,
          category: v.category,
        }))}
        categories={categories}
      />

      {/* 3. What We Shoot */}
      <section className="cr">
        <div className="in sec">
          <div className="stack" style={{ gap: '40px' }}>
            <h2 className="sf h2 rv">What We Shoot.</h2>
            <div className="subs">
              {WHAT_WE_SHOOT.map((item, idx) => (
                <div key={idx} className="sub rv">
                  <span className="n tab">0{idx + 1}</span>
                  <b className="sf h3">{item.title}</b>
                  <span className="mu">{item.desc}</span>
                </div>
              ))}
            </div>
            <Link
              className="btn b-d"
              href="/services/video-production"
              style={{ width: 'fit-content' }}
            >
              About our shoots
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CTA Band (No phone number in video CTA per brand rule) */}
      <CtaBand
        title="Want a Shoot Like This?"
        sub="Tell us about your brand. We'll send ideas, a shot list and a price."
        service="Video / Shoots"
      />
    </>
  );
}

