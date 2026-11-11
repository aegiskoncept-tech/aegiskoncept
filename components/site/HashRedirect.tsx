'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HashRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash ? window.location.hash.slice(1) : '';
    if (!hash) return;

    const directMap: Record<string, string> = {
      'services-site': '/services/website-development-design',
      'services-seo': '/services/seo',
      'services-ads': '/services/performance-marketing',
      'services-social': '/services/social-media-marketing-management',
      'services-video': '/services/video-production',
      services: '/services',
      'our-work': '/our-work',
      videos: '/videos',
      industries: '/industries',
      locations: '/locations',
      about: '/about',
      contact: '/contact',
      insights: '/insights',
      'insights-seo-cost-india': '/insights/seo-cost-india',
      'insights-author-ritesh-kumar': '/insights/author/ritesh-kumar',
      'privacy-policy': '/privacy-policy',
      'terms-and-conditions': '/terms-and-conditions',
      'cookie-policy': '/cookie-policy',
      'thank-you': '/thank-you',
      'all-pages': '/all-pages',
    };

    if (directMap[hash]) {
      router.replace(directMap[hash]);
      return;
    }

    if (hash.startsWith('services-')) {
      router.replace(`/services/${hash.replace('services-', '')}`);
    } else if (hash.startsWith('our-work-')) {
      router.replace(`/our-work/${hash.replace('our-work-', '')}`);
    } else if (hash.startsWith('industries-')) {
      router.replace(`/industries/${hash.replace('industries-', '')}`);
    } else if (hash.startsWith('locations-')) {
      router.replace(`/locations/${hash.replace('locations-', '')}`);
    }
  }, [router]);

  return null;
}

