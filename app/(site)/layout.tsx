import React from 'react';
import SiteLayout from '@/components/site/SiteLayout';

export default function PublicSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteLayout>{children}</SiteLayout>;
}

