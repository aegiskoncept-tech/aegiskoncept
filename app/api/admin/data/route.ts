import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [
      posts,
      categories,
      tags,
      redirects,
      sitemapEntries,
      settings,
      integrations,
      pages,
      locations,
      videos,
      media,
      reviews,
      caseStudies,
      leads,
    ] = await Promise.all([
      db.post.findMany({
        orderBy: { updatedAt: 'desc' },
        include: { category: true },
      }),
      db.category.findMany({ orderBy: { name: 'asc' } }),
      db.tag.findMany({ orderBy: { name: 'asc' } }),
      db.redirect.findMany({ orderBy: { hits: 'desc' } }),
      db.sitemapEntry.findMany({ orderBy: { path: 'asc' } }),
      db.setting.findMany(),
      db.integration.findMany(),
      db.page.findMany({ orderBy: { path: 'asc' } }),
      db.location.findMany({ orderBy: { name: 'asc' } }),
      db.video.findMany({ orderBy: { order: 'asc' } }),
      db.media.findMany({ orderBy: { createdAt: 'desc' } }),
      db.review.findMany({
        orderBy: { createdAt: 'desc' },
        include: { caseStudy: { select: { client: true, slug: true } } },
      }),
      db.caseStudy.findMany({ orderBy: { order: 'asc' } }),
      db.lead.findMany({ orderBy: { createdAt: 'desc' } }),
    ]);

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

