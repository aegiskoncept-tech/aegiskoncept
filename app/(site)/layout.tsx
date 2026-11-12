import React from 'react';
import SiteLayout from '@/components/site/SiteLayout';
import { getSiteContactSettings } from '@/lib/siteSettings';

export const dynamic = 'force-dynamic';

export default async function PublicSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contact = await getSiteContactSettings();
  return <SiteLayout contact={contact}>{children}</SiteLayout>;
}

