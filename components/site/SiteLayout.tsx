'use client';

import React, { useState } from 'react';
import Header from './Header';
import MobileMenu from './MobileMenu';
import Footer from './Footer';
import Cursor from './Cursor';
import Curtain from './Curtain';
import Overlays from './Overlays';
import WhatsAppBar from './WhatsAppBar';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
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
      />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppBar />
    </>
  );
}

