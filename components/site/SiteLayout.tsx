'use client';

import React, { useState } from 'react';
import Header from './Header';
import MobileMenu from './MobileMenu';
import Footer from './Footer';
import Cursor from './Cursor';
import Curtain from './Curtain';
import Overlays from './Overlays';
import WhatsAppBar from './WhatsAppBar';
import { SiteContactSettings, DEFAULT_CONTACT } from '@/lib/siteConfig';

export default function SiteLayout({
  children,
  contact = DEFAULT_CONTACT,
}: {
  children: React.ReactNode;
  contact?: SiteContactSettings;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <Overlays />
      <Cursor />
      <Curtain />
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        contact={contact}
      />
      <main id="main">{children}</main>
      <Footer contact={contact} />
      <WhatsAppBar contact={contact} />
    </>
  );
}

