import type { Metadata } from 'next';
import './globals.css';
import ArchClip from '@/components/site/ArchClip';
import HashRedirect from '@/components/site/HashRedirect';
import JsonLd from '@/components/seo/JsonLd';
import AnalyticsScripts from '@/components/seo/AnalyticsScripts';
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/jsonLd';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://aegiskoncept.com'),
  title: {
    default: 'AegisKoncept | Websites, SEO, Ads & Social Media in Delhi',
    template: '%s | AegisKoncept',
  },
  description:
    'AegisKoncept: websites, SEO, ads and social media for growing Indian businesses. Based in Dwarka, New Delhi.',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://aegiskoncept.com',
    siteName: 'AegisKoncept',
    title: 'AegisKoncept | Websites, SEO, Ads & Social Media in Delhi',
    description:
      'Websites, SEO, ads and social media for growing Indian businesses. Based in Dwarka, New Delhi.',
    images: [
      {
        url: '/assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AegisKoncept Digital Marketing Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AegisKoncept | Websites, SEO, Ads & Social Media in Delhi',
    description:
      'Websites, SEO, ads and social media for growing Indian businesses. Based in Dwarka, New Delhi.',
    images: ['/assets/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://aegiskoncept.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600;700&display=swap"
        />
        <JsonLd data={[getOrganizationSchema(), getWebSiteSchema()]} />
      </head>
      <body>
        <ArchClip />
        <HashRedirect />
        <AnalyticsScripts />
        {children}
      </body>
    </html>
  );
}
