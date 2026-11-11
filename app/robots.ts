import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aegiskoncept.com';

  try {
    const setting = await db.setting.findUnique({
      where: { key: 'robots_txt' },
    });

    if (setting?.value) {
      // If custom setting exists, parse or provide default standard
    }
  } catch (err) {
    // fallback gracefully
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api', '/api/*', '/thank-you'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

