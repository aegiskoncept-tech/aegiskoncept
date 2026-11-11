import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let posts: any[] = [];
  let categories: any[] = [];
  let tags: any[] = [];
  let redirects: any[] = [];
  let sitemapEntries: any[] = [];
  let settings: any[] = [];
  let integrations: any[] = [];
  let pages: any[] = [];
  let locations: any[] = [];
  let videos: any[] = [];
  let media: any[] = [];
  let reviews: any[] = [];
  let caseStudies: any[] = [];
  let leads: any[] = [];

  try {
    posts = await db.post.findMany({ orderBy: { updatedAt: 'desc' }, include: { category: true } }).catch(() => []);
    categories = await db.category.findMany({ orderBy: { name: 'asc' } }).catch(() => []);
    tags = await db.tag.findMany({ orderBy: { name: 'asc' } }).catch(() => []);
    redirects = await db.redirect.findMany({ orderBy: { hits: 'desc' } }).catch(() => []);
    sitemapEntries = await db.sitemapEntry.findMany({ orderBy: { path: 'asc' } }).catch(() => []);
    settings = await db.setting.findMany().catch(() => []);
    integrations = await db.integration.findMany().catch(() => []);
    pages = await db.page.findMany({ orderBy: { path: 'asc' } }).catch(() => []);
    locations = await db.location.findMany({ orderBy: { name: 'asc' } }).catch(() => []);
    videos = await db.video.findMany({ orderBy: { order: 'asc' } }).catch(() => []);
    media = await db.media.findMany({ orderBy: { createdAt: 'desc' } }).catch(() => []);
    reviews = await db.review.findMany({ orderBy: { createdAt: 'desc' }, include: { caseStudy: { select: { client: true, slug: true } } } }).catch(() => []);
    caseStudies = await db.caseStudy.findMany({ orderBy: { order: 'asc' } }).catch(() => []);
    leads = await db.lead.findMany({ orderBy: { createdAt: 'desc' } }).catch(() => []);

    // Format settings into a key-value dictionary
    const settingsMap: Record<string, any> = {};
    settings.forEach((s) => {
      try {
        settingsMap[s.key] = JSON.parse(s.value);
      } catch {
        settingsMap[s.key] = s.value;
      }
    });

    return NextResponse.json({
      posts,
      categories,
      tags,
      redirects,
      sitemapEntries,
      settings: settingsMap,
      integrations,
      pages,
      locations,
      videos,
      media,
      reviews,
      caseStudies,
      leads,
    });
  } catch (err: any) {
    console.error('Error fetching admin data:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

