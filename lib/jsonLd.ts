export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aegiskoncept.com';

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['MarketingAgency', 'LocalBusiness', 'Organization'],
    '@id': `${SITE_URL}/#organization`,
    name: 'AegisKoncept',
    legalName: 'AegisKoncept Digital Marketing LLP',
    url: SITE_URL,
    logo: `${SITE_URL}/assets/client-logos/logo-aegiskoncept.png`,
    image: `${SITE_URL}/assets/og-image.jpg`,
    description:
      'AegisKoncept: websites, SEO, ads, social media, and video production for growing Indian businesses. Based in Dwarka, New Delhi.',
    telephone: '+91 73034 68073',
    email: 'hello@aegiskoncept.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Sector 7, Ramphal Chowk, Dwarka',
      addressLocality: 'New Delhi',
      addressRegion: 'Delhi',
      postalCode: '110075',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '28.5823',
      longitude: '77.0700',
    },
    founders: [
      {
        '@type': 'Person',
        name: 'Ritesh Kumar',
        jobTitle: 'Founder',
      },
      {
        '@type': 'Person',
        name: 'Yogeesh Gahlot',
        jobTitle: 'Founder',
      },
    ],
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Delhi NCR' },
      { '@type': 'City', name: 'New Delhi' },
      { '@type': 'City', name: 'Dwarka' },
      { '@type': 'City', name: 'Gurugram' },
      { '@type': 'City', name: 'Noida' },
      { '@type': 'Country', name: 'India' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:30',
        closes: '19:00',
      },
    ],
    sameAs: [
      'https://www.linkedin.com/company/aegiskoncept',
      'https://www.instagram.com/aegiskoncept',
    ],
    priceRange: '₹₹',
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'AegisKoncept',
    description: 'Websites, SEO, Ads & Social Media in Delhi NCR',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: 'en-IN',
  };
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function getServiceSchema({
  name,
  description,
  slug,
}: {
  name: string;
  description: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/services/${slug}#service`,
    name,
    serviceType: name,
    description,
    provider: {
      '@id': `${SITE_URL}/#organization`,
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
  };
}

export function getFaqSchema(faqs: FaqItem[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

export function getArticleSchema({
  title,
  description,
  slug,
  publishedAt,
  updatedAt,
  authorName = 'Ritesh Kumar',
  authorSlug = 'ritesh-kumar',
  image = `${SITE_URL}/assets/og-image.jpg`,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt?: string;
  updatedAt?: string;
  authorName?: string;
  authorSlug?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${SITE_URL}/insights/${slug}#article`,
    headline: title,
    description,
    url: `${SITE_URL}/insights/${slug}`,
    image,
    datePublished: publishedAt || '2026-11-10T00:00:00+05:30',
    dateModified: updatedAt || '2026-11-10T00:00:00+05:30',
    author: {
      '@type': 'Person',
      name: authorName,
      url: `${SITE_URL}/insights/author/${authorSlug}`,
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/insights/${slug}`,
    },
  };
}

export function getLocalBusinessSchema({
  name,
  slug,
  sub,
  zone,
}: {
  name: string;
  slug: string;
  sub: string;
  zone?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': `${SITE_URL}/locations/${slug}#localbusiness`,
    name: `AegisKoncept - Digital Marketing Agency ${name}`,
    description: sub,
    url: `${SITE_URL}/locations/${slug}`,
    telephone: '+91 73034 68073',
    parentOrganization: {
      '@id': `${SITE_URL}/#organization`,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: `${name}, ${zone || 'Delhi NCR'}`,
    },
  };
}

export function getCreativeWorkSchema({
  client,
  slug,
  oneLine,
  industry,
}: {
  client: string;
  slug: string;
  oneLine: string;
  industry?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${SITE_URL}/our-work/${slug}#casestudy`,
    name: `${client} Case Study - AegisKoncept`,
    headline: `${client} - ${oneLine}`,
    description: oneLine,
    creator: {
      '@id': `${SITE_URL}/#organization`,
    },
    genre: industry || 'Digital Marketing',
    url: `${SITE_URL}/our-work/${slug}`,
  };
}

export function getVideoObjectSchema({
  title,
  description,
  thumbnailUrl,
  uploadDate,
  embedUrl,
}: {
  title: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  embedUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: title,
    description,
    thumbnailUrl,
    uploadDate,
    embedUrl,
  };
}

