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
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}

