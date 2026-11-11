import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aegiskoncept.com';

  const [services, cases, industries, locations, posts, sitemapEntries] = await Promise.all([
    db.service.findMany({ select: { slug: true, updatedAt: true } }),
    db.caseStudy.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.industry.findMany({ select: { slug: true, updatedAt: true } }),
    db.location.findMany({ select: { slug: true, updatedAt: true } }),
    db.post.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    db.sitemapEntry.findMany(),
  ]);

  const excludedPaths = new Set(
    sitemapEntries.filter((e) => !e.include).map((e) => e.path)
  );

  const customConfig = new Map(
    sitemapEntries.map((e) => [
      e.path,
      { priority: e.priority, changeFrequency: e.changefreq as MetadataRoute.Sitemap[number]['changeFrequency'] },
    ])
  );

  const staticRoutes: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  }[] = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/our-work', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/videos', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/industries', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/locations', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/insights', priority: 0.8, changeFrequency: 'daily' },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms-and-conditions', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/cookie-policy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/all-pages', priority: 0.4, changeFrequency: 'monthly' },
  ];

  const now = new Date();
  const sitemapList: MetadataRoute.Sitemap = [];

  for (const route of staticRoutes) {
    if (excludedPaths.has(route.path)) continue;
    const cfg = customConfig.get(route.path);
    sitemapList.push({
      url: `${baseUrl}${route.path}`,
      lastModified: now,
      changeFrequency: cfg?.changeFrequency || route.changeFrequency,
      priority: cfg?.priority ?? route.priority,
    });
  }

  for (const s of services) {
    const path = `/services/${s.slug}`;
    if (excludedPaths.has(path)) continue;
    const cfg = customConfig.get(path);
    sitemapList.push({
      url: `${baseUrl}${path}`,
      lastModified: s.updatedAt || now,
      changeFrequency: cfg?.changeFrequency || 'weekly',
      priority: cfg?.priority ?? 0.9,
    });
  }

  for (const c of cases) {
    const path = `/our-work/${c.slug}`;
    if (excludedPaths.has(path)) continue;
    const cfg = customConfig.get(path);
    sitemapList.push({
      url: `${baseUrl}${path}`,
      lastModified: c.updatedAt || now,
      changeFrequency: cfg?.changeFrequency || 'monthly',
      priority: cfg?.priority ?? 0.8,
    });
  }

  for (const i of industries) {
    const path = `/industries/${i.slug}`;
    if (excludedPaths.has(path)) continue;
    const cfg = customConfig.get(path);
    sitemapList.push({
      url: `${baseUrl}${path}`,
      lastModified: i.updatedAt || now,
      changeFrequency: cfg?.changeFrequency || 'monthly',
      priority: cfg?.priority ?? 0.8,
    });
  }

  for (const l of locations) {
    const path = `/locations/${l.slug}`;
    if (excludedPaths.has(path)) continue;
    const cfg = customConfig.get(path);
    sitemapList.push({
      url: `${baseUrl}${path}`,
      lastModified: l.updatedAt || now,
      changeFrequency: cfg?.changeFrequency || 'monthly',
      priority: cfg?.priority ?? 0.8,
    });
  }

  for (const p of posts) {
    const path = `/insights/${p.slug}`;
    if (excludedPaths.has(path)) continue;
    const cfg = customConfig.get(path);
    sitemapList.push({
      url: `${baseUrl}${path}`,
      lastModified: p.updatedAt || now,
      changeFrequency: cfg?.changeFrequency || 'monthly',
      priority: cfg?.priority ?? 0.8,
    });
  }

  if (!excludedPaths.has('/insights/author/ritesh-kumar')) {
    sitemapList.push({
      url: `${baseUrl}/insights/author/ritesh-kumar`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  }

  return sitemapList;
}

