import type { Metadata } from 'next';
import './globals.css';
import ArchClip from '@/components/site/ArchClip';
import HashRedirect from '@/components/site/HashRedirect';
import JsonLd from '@/components/seo/JsonLd';
import AnalyticsScripts from '@/components/seo/AnalyticsScripts';
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/jsonLd';
import { getSiteIntegrationSettings } from '@/lib/siteSettings';

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
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const integrations = await getSiteIntegrationSettings();

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
        {integrations.gscVerification && (
          <meta name="google-site-verification" content={integrations.gscVerification} />
        )}
        <JsonLd data={[getOrganizationSchema(), getWebSiteSchema()]} />
      </head>
      <body>
        <ArchClip />
        <HashRedirect />
        <AnalyticsScripts
          gaId={integrations.ga4Id}
          gtmId={integrations.gtmId}
          metaPixelId={integrations.metaPixelId}
          clarityId={integrations.clarityId}
        />
        {children}
      </body>
    </html>
  );
}
