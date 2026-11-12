import React from 'react';
import type { Metadata } from 'next';
import './admin.css';
import AdminAuthProvider from '@/components/admin/AdminAuthProvider';

export const metadata: Metadata = {
  title: 'AegisKoncept Admin',
  description: 'Manage website content, SEO, reviews, and leads.',
  robots: {
    index: false,
    follow: false,
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}

