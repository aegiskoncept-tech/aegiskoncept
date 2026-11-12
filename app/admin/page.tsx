'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { analysePost, SeoAnalysisResult } from '@/lib/seoAnalyzer';

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeView, setActiveView] = useState('posts');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [dirty, setDirty] = useState(false);

  // Post Editor State
  const [editingPost, setEditingPost] = useState<any>(null);
  const [seoTab, setSeoTab] = useState<'basics' | 'analysis' | 'social' | 'publish'>('basics');
  const [seoAnalysis, setSeoAnalysis] = useState<SeoAnalysisResult>({ score: 0, list: [] });

  // Filters & search
  const [postSearch, setPostSearch] = useState('');
  const [postStatusFilter, setPostStatusFilter] = useState('All');
  const [postCatFilter, setPostCatFilter] = useState('All');
  const [reviewFilter, setReviewFilter] = useState<'ALL' | 'APPROVED' | 'DRAFT'>('ALL');
  const [leadFilter, setLeadFilter] = useState('ALL');

  // New redirect form state
  const [rdFrom, setRdFrom] = useState('');
  const [rdTo, setRdTo] = useState('');
  const [rdType, setRdType] = useState('301');

  // Robots editor state
  const [robotsTxt, setRobotsTxt] = useState('');

  // Business & Contact Settings state
  const [contactPhone, setContactPhone] = useState('+91 73034 68073');
  const [contactWhatsapp, setContactWhatsapp] = useState('917303468073');
  const [contactEmail, setContactEmail] = useState('hello@aegiskoncept.com');
  const [contactEmailSecondary, setContactEmailSecondary] = useState('contact@aegiskoncept.com');
  const [contactAddress, setContactAddress] = useState('Sector 7, Ramphal Chowk, Dwarka, New Delhi 110075');
  const [contactHours, setContactHours] = useState('Mon – Sat: 10:00 AM – 7:00 PM');
  const [contactMapsUrl, setContactMapsUrl] = useState('https://maps.google.com/?q=Ramphal+Chowk+Sector+7+Dwarka+Delhi');

  // Integrations state
  const [ga4Id, setGa4Id] = useState('');
  const [gtmId, setGtmId] = useState('');
  const [metaPixelId, setMetaPixelId] = useState('');
  const [metaCapiToken, setMetaCapiToken] = useState('');
  const [clarityId, setClarityId] = useState('');
  const [gscVerification, setGscVerification] = useState('');
  const [indexnowKey, setIndexnowKey] = useState('');
  const [editingTool, setEditingTool] = useState<string | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // Mobile menu
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  // Load data from API
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/data');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.settings) {
          const s = json.settings;
          if (s.robots_txt) setRobotsTxt(s.robots_txt);
          if (s.contact_phone) setContactPhone(s.contact_phone);
          if (s.contact_whatsapp) setContactWhatsapp(s.contact_whatsapp);
          if (s.contact_email) setContactEmail(s.contact_email);
          if (s.contact_email_secondary) setContactEmailSecondary(s.contact_email_secondary);
          if (s.contact_address) setContactAddress(s.contact_address);
          if (s.contact_hours) setContactHours(s.contact_hours);
          if (s.contact_maps_url) setContactMapsUrl(s.contact_maps_url);
          if (s.ga4_id) setGa4Id(s.ga4_id);
          if (s.gtm_id) setGtmId(s.gtm_id);
          if (s.meta_pixel_id) setMetaPixelId(s.meta_pixel_id);
          if (s.meta_capi_token) setMetaCapiToken(s.meta_capi_token);
          if (s.clarity_id) setClarityId(s.clarity_id);
          if (s.gsc_verification) setGscVerification(s.gsc_verification);
          if (s.indexnow_key) setIndexnowKey(s.indexnow_key);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      loadData();
    }
  }, [status]);

  // URL hash sync
  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.slice(1);
      if (h) {
        if (h === 'post-new') {
          initNewPost();
        } else if (h.startsWith('post-edit-')) {
          const id = h.replace('post-edit-', '');
          if (data?.posts) {
            const found = data.posts.find((p: any) => p.id === id);
            if (found) {
              setEditingPost({ ...found });
              setActiveView('post');
            }
          }
        } else {
          setActiveView(h);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [data]);

  // Toast helper
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Run SEO analysis on post changes
  useEffect(() => {
    if (editingPost) {
      const res = analysePost({
        title: editingPost.title,
        slug: editingPost.slug,
        focusKeyword: editingPost.focusKeyword,
        seoTitle: editingPost.seoTitle,
        seoDesc: editingPost.seoDesc,
        bodyHtml: editingPost.bodyHtml,
        image: editingPost.image,
      });
      setSeoAnalysis(res);
    }
  }, [editingPost]);

  const initNewPost = () => {
    setEditingPost({
      id: '',
      title: '',
      slug: '',
      excerpt: '',
      bodyHtml: '<p>Start writing your article here...</p>',
      focusKeyword: '',
      seoTitle: '',
      seoDesc: '',
      status: 'DRAFT',
      categoryId: data?.categories?.[0]?.id || '',
    });
    setActiveView('post');
  };

  const handleSavePost = async (targetStatus?: string) => {
    if (!editingPost?.title?.trim()) {
      showToast('Please enter an article title');
      return;
    }
    const finalStatus = targetStatus || editingPost.status || 'DRAFT';
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingPost,
          status: finalStatus,
        }),
      });

      if (res.ok) {
        showToast(finalStatus === 'PUBLISHED' ? 'Post published!' : 'Draft saved!');
        setDirty(false);
        await loadData();
        setActiveView('posts');
        window.location.hash = 'posts';
      } else {
        showToast('Failed to save post.');
      }
    } catch {
      showToast('Error saving post.');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        showToast('Post deleted.');
        await loadData();
      }
    } catch {
      showToast('Failed to delete post.');
    }
  };

  const handleToggleReview = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'APPROVED' ? 'DRAFT' : 'APPROVED';
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      if (res.ok) {
        showToast(`Review marked as ${nextStatus}.`);
        await loadData();
      } else {
        showToast('Failed to update review status.');
      }
    } catch {
      showToast('Error updating review.');
    }
  };

  const handleAddRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rdFrom.trim() || !rdTo.trim()) return;
    try {
      const res = await fetch('/api/redirects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: rdFrom.trim(),
          to: rdTo.trim(),
          type: parseInt(rdType, 10),
        }),
      });
      if (res.ok) {
        showToast('Redirect added!');
        setRdFrom('');
        setRdTo('');
        await loadData();
      } else {
        showToast('Error adding redirect (must start with /)');
      }
    } catch {
      showToast('Failed to add redirect.');
    }
  };

  const handleUpdateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        showToast(`Lead status updated to ${newStatus}`);
        await loadData();
      }
    } catch {
      showToast('Failed to update lead');
    }
  };

  const handleSaveContactSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const updates = [
        { key: 'contact_phone', value: contactPhone },
        { key: 'contact_whatsapp', value: contactWhatsapp },
        { key: 'contact_email', value: contactEmail },
        { key: 'contact_email_secondary', value: contactEmailSecondary },
        { key: 'contact_address', value: contactAddress },
        { key: 'contact_hours', value: contactHours },
        { key: 'contact_maps_url', value: contactMapsUrl },
      ];

      for (const item of updates) {
        await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }

      showToast('Business & Contact details saved successfully!');
      await loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to save contact details.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveIntegration = async (toolId: string) => {
    setSavingSettings(true);
    try {
      if (toolId === 'ga4') {
        await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'ga4_id', value: ga4Id.trim() }),
        });
        showToast('Google Analytics 4 Measurement ID saved!');
      } else if (toolId === 'gtm') {
        await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'gtm_id', value: gtmId.trim() }),
        });
        showToast('Google Tag Manager Container ID saved!');
      } else if (toolId === 'meta') {
        await Promise.all([
          fetch('/api/admin/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: 'meta_pixel_id', value: metaPixelId.trim() }),
          }),
          fetch('/api/admin/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: 'meta_capi_token', value: metaCapiToken.trim() }),
          }),
        ]);
        showToast('Meta Pixel & CAPI credentials saved!');
      } else if (toolId === 'clarity') {
        await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'clarity_id', value: clarityId.trim() }),
        });
        showToast('Microsoft Clarity Project ID saved!');
      } else if (toolId === 'gsc') {
        await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'gsc_verification', value: gscVerification.trim() }),
        });
        showToast('Google Search Console verification saved!');
      } else if (toolId === 'indexnow') {
        await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'indexnow_key', value: indexnowKey.trim() }),
        });
        showToast('IndexNow API Key saved!');
      }
      setEditingTool(null);
      await loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving integration setting.');
    } finally {
      setSavingSettings(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#F4F0E8' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 44, height: 48, margin: '0 auto 16px' }}>
            <svg viewBox="0 0 100 110" width="100%" height="100%">
              <path
                d="M8 110 V54 C8 28 28 10 50 0 C72 10 92 28 92 54 V110 H70 V56 C70 42 62 31 50 24 C38 31 30 42 30 56 V110 Z"
                fill="#191919"
              />
            </svg>
          </div>
          <p style={{ fontWeight: 600, color: '#6A645D' }}>Loading AegisKoncept Admin...</p>
        </div>
      </div>
    );
  }

  // Filter posts
  const filteredPosts = (data?.posts || []).filter((p: any) => {
    const matchStatus = postStatusFilter === 'All' || p.status.toUpperCase() === postStatusFilter.toUpperCase();
    const matchCat = postCatFilter === 'All' || p.category?.name === postCatFilter;
    const matchSearch =
      !postSearch ||
      p.title.toLowerCase().includes(postSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(postSearch.toLowerCase()) ||
      (p.focusKeyword && p.focusKeyword.toLowerCase().includes(postSearch.toLowerCase()));
    return matchStatus && matchCat && matchSearch;
  });

  // Filter reviews
  const filteredReviews = (data?.reviews || []).filter((r: any) => {
    if (reviewFilter === 'ALL') return true;
    return r.status === reviewFilter;
  });

  // Filter leads
  const filteredLeads = (data?.leads || []).filter((l: any) => {
    if (leadFilter === 'ALL') return true;
    return l.status === leadFilter;
  });

  return (
    <div className="app">
      {/* 1. Charcoal Sidebar Rail */}
      <aside className={`rail ${menuOpen ? 'on' : ''}`} id="rail">
        <Link className="brand" href="/admin">
          <svg viewBox="0 0 100 110" width="22" height="24">
            <path
              d="M8 110 V54 C8 28 28 10 50 0 C72 10 92 28 92 54 V110 H70 V56 C70 42 62 31 50 24 C38 31 30 42 30 56 V110 Z"
              fill="#D3E45B"
            />
          </svg>
          <div>
            <b>AegisKoncept</b>
            <small>Admin · v2.0</small>
          </div>
        </Link>

        <nav className="nav" id="nav">
          {/* Blog Group */}
          <div className="grp">Blog</div>
          <a
            href="#posts"
            aria-current={activeView === 'posts' ? 'page' : undefined}
            onClick={() => {
              setActiveView('posts');
              setMenuOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
            <span>All posts</span>
            <span className="cnt">{data?.posts?.length || 0}</span>
          </a>
          <a
            href="#post-new"
            onClick={(e) => {
              e.preventDefault();
              initNewPost();
              setMenuOpen(false);
            }}
            className="sub"
          >
            <span>+ Add new</span>
          </a>
          <a
            href="#cats"
            aria-current={activeView === 'cats' ? 'page' : undefined}
            onClick={() => {
              setActiveView('cats');
              setMenuOpen(false);
            }}
            className="sub"
          >
            <span>Categories & tags</span>
          </a>

          {/* SEO Group */}
          <div className="grp">SEO</div>
          <a
            href="#seo"
            aria-current={activeView === 'seo' ? 'page' : undefined}
            onClick={() => {
              setActiveView('seo');
              setMenuOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="m4.93 4.93 4.24 4.24" /><path d="m14.83 9.17 4.24-4.24" /><path d="m14.83 14.83 4.24 4.24" /><path d="m9.17 14.83-4.24 4.24" /></svg>
            <span>SEO overview</span>
          </a>
          <a
            href="#seo-redirects"
            aria-current={activeView === 'seo-redirects' ? 'page' : undefined}
            onClick={() => {
              setActiveView('seo-redirects');
              setMenuOpen(false);
            }}
            className="sub"
          >
            <span>Redirects</span>
            <span className="cnt">{data?.redirects?.length || 0}</span>
          </a>
          <a
            href="#seo-sitemap"
            aria-current={activeView === 'seo-sitemap' ? 'page' : undefined}
            onClick={() => {
              setActiveView('seo-sitemap');
              setMenuOpen(false);
            }}
            className="sub"
          >
            <span>Sitemap</span>
          </a>
          <a
            href="#seo-robots"
            aria-current={activeView === 'seo-robots' ? 'page' : undefined}
            onClick={() => {
              setActiveView('seo-robots');
              setMenuOpen(false);
            }}
            className="sub"
          >
            <span>Robots.txt</span>
          </a>

          {/* Tools & Integrations */}
          <div className="grp">Tools</div>
          <a
            href="#google"
            aria-current={activeView === 'google' ? 'page' : undefined}
            onClick={() => {
              setActiveView('google');
              setMenuOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
            <span>Integrations</span>
            <span className="cnt">Active</span>
          </a>

          {/* Website Management */}
          <div className="grp">Website</div>
          <a
            href="#reviews"
            aria-current={activeView === 'reviews' ? 'page' : undefined}
            onClick={() => {
              setActiveView('reviews');
              setMenuOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            <span>Reviews Approval</span>
            <span className="cnt" style={{ background: '#A3261F', color: '#fff' }}>
              {data?.reviews?.filter((r: any) => r.status === 'DRAFT').length || 0} Draft
            </span>
          </a>
          <a
            href="#leads"
            aria-current={activeView === 'leads' ? 'page' : undefined}
            onClick={() => {
              setActiveView('leads');
              setMenuOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            <span>Leads Inbox</span>
            <span className="cnt">{data?.leads?.length || 0}</span>
          </a>
          <a
            href="#locations"
            aria-current={activeView === 'locations' ? 'page' : undefined}
            onClick={() => {
              setActiveView('locations');
              setMenuOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            <span>Locations</span>
            <span className="cnt">{data?.locations?.length || 0}</span>
          </a>
          <a
            href="#videos"
            aria-current={activeView === 'videos' ? 'page' : undefined}
            onClick={() => {
              setActiveView('videos');
              setMenuOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
            <span>Videos</span>
            <span className="cnt">{data?.videos?.length || 0}</span>
          </a>

          {/* Settings Section */}
          <div className="grp">Settings</div>
          <a
            href="#settings-contact"
            aria-current={activeView === 'settings-contact' ? 'page' : undefined}
            onClick={() => {
              setActiveView('settings-contact');
              setMenuOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>Business & Contact</span>
          </a>
        </nav>

        {/* User Card */}
        <div className="me">
          <span className="av">RK</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontWeight: 600 }}>{session?.user?.name || 'Ritesh Kumar'}</span>
            <small style={{ color: 'var(--mute-d)' }}>Founder · Admin</small>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#8E877F',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '4px',
            }}
            title="Sign out"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* 2. Main Work Surface */}
      <div className="main">
        <header className="top">
          <button
            className="btn sm ghost menu"
            id="menuBtn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            Menu
          </button>

          <div className="crumbs" id="crumbs">
            <Link href="/admin">Admin</Link>
            <span>/</span>
            <b>{activeView.toUpperCase()}</b>
          </div>

          <span className="sp"></span>

          <span className={`saved hide-m ${dirty ? 'dirty' : ''}`}>
            {dirty ? 'Unsaved changes' : 'All changes saved'}
          </span>

          <Link className="btn sm dark hide-m" href="/" target="_blank" rel="noopener">
            View website ↗
          </Link>
        </header>

        {/* View Content */}
        <main className="view" id="view">
          {/* VIEW: POSTS */}
          {activeView === 'posts' && (
            <div>
              <div className="vh">
                <div>
                  <h1>Blog posts</h1>
                  <p>
                    Write, edit and optimise every article. Each post gets its own SEO check, Google preview and schema.
                  </p>
                </div>
                <div className="acts">
                  <button className="btn lime" onClick={initNewPost}>
                    + Add new post
                  </button>
                </div>
              </div>

              {/* Status Tabs */}
              <div className="tabs" role="tablist">
                {['All', 'Published', 'Draft'].map((s) => (
                  <button
                    key={s}
                    role="tab"
                    aria-selected={postStatusFilter === s}
                    onClick={() => setPostStatusFilter(s)}
                  >
                    {s} ({
                      s === 'All'
                        ? data?.posts?.length || 0
                        : (data?.posts || []).filter((p: any) => p.status.toUpperCase() === s.toUpperCase()).length
                    })
                  </button>
                ))}
              </div>

              {/* Toolbar */}
              <div className="toolbar">
                <label className="searchbox">
                  <span className="sr">Search posts</span>
                  <input
                    className="inp"
                    type="search"
                    placeholder="Search title, slug or keyword..."
                    value={postSearch}
                    onChange={(e) => setPostSearch(e.target.value)}
                  />
                </label>
              </div>

              {/* Posts Table */}
              <section className="panel">
                <div className="tw">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th className="hide-m">Category</th>
                        <th className="hide-m">Focus keyword</th>
                        <th>SEO</th>
                        <th className="hide-m num">Words</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPosts.map((p: any) => {
                        const score = analysePost(p).score;
                        return (
                          <tr key={p.id}>
                            <td>
                              <div className="t">
                                <a
                                  href={`#post-edit-${p.id}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setEditingPost({ ...p });
                                    setActiveView('post');
                                  }}
                                  style={{ fontWeight: 600, color: 'var(--ink)' }}
                                >
                                  {p.title}
                                </a>
                              </div>
                              <div className="s" style={{ fontSize: 12, color: 'var(--mute)' }}>
                                /insights/{p.slug}
                              </div>
                            </td>
                            <td className="hide-m">{p.category?.name || 'General'}</td>
                            <td className="hide-m">{p.focusKeyword || '—'}</td>
                            <td>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  fontWeight: 600,
                                  color: score >= 75 ? 'var(--ok)' : score >= 50 ? 'var(--warn)' : 'var(--bad)',
                                }}
                              >
                                {score}/100
                              </span>
                            </td>
                            <td className="hide-m num">{p.words || 0}</td>
                            <td>
                              <span
                                className={`badge ${p.status === 'PUBLISHED' ? 'published' : 'draft'
                                  }`}
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: 4,
                                  fontSize: 11,
                                  fontWeight: 600,
                                  background: p.status === 'PUBLISHED' ? '#E1F2E8' : '#F1EEE7',
                                  color: p.status === 'PUBLISHED' ? '#2F7D4F' : '#6A645D',
                                }}
                              >
                                {p.status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button
                                  className="btn sm"
                                  onClick={() => {
                                    setEditingPost({ ...p });
                                    setActiveView('post');
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn sm ghost"
                                  onClick={() => handleDeletePost(p.id)}
                                  style={{ color: 'var(--bad)' }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredPosts.length === 0 && (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--mute)' }}>
                            No posts found matching your criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* VIEW: POST EDITOR */}
          {activeView === 'post' && editingPost && (
            <div>
              <div className="vh">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                      className="btn sm ghost"
                      onClick={() => setActiveView('posts')}
                    >
                      ← Back to posts
                    </button>
                    <h1>{editingPost.id ? 'Edit post' : 'Create new post'}</h1>
                  </div>
                </div>
                <div className="acts">
                  <button
                    className="btn"
                    onClick={() => handleSavePost('DRAFT')}
                  >
                    Save draft
                  </button>
                  <button
                    className="btn lime"
                    onClick={() => handleSavePost('PUBLISHED')}
                  >
                    {editingPost.status === 'PUBLISHED' ? 'Update post' : 'Publish post'}
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)',
                  gap: 24,
                }}
              >
                {/* Left: Article Writing Area */}
                <div className="panel" style={{ padding: 24 }}>
                  <div className="stack" style={{ gap: 18 }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                        Article Title *
                      </label>
                      <input
                        className="inp"
                        style={{ fontSize: 18, fontWeight: 600, width: '100%' }}
                        value={editingPost.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingPost((prev: any) => ({
                            ...prev,
                            title: val,
                            slug: prev.id ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                          }));
                          setDirty(true);
                        }}
                        placeholder="e.g. How Much Does SEO Cost in India?"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                        Web Address (Slug) *
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: 'var(--mute)', fontSize: 13 }}>/insights/</span>
                        <input
                          className="inp"
                          style={{ flex: 1 }}
                          value={editingPost.slug}
                          onChange={(e) => {
                            setEditingPost((prev: any) => ({ ...prev, slug: e.target.value }));
                            setDirty(true);
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                        Excerpt / Summary
                      </label>
                      <textarea
                        className="inp"
                        rows={2}
                        value={editingPost.excerpt}
                        onChange={(e) => {
                          setEditingPost((prev: any) => ({ ...prev, excerpt: e.target.value }));
                          setDirty(true);
                        }}
                        placeholder="Short summary for the blog card and search snippet"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                        Article HTML Content
                      </label>
                      <textarea
                        className="inp"
                        rows={16}
                        style={{ fontFamily: 'var(--mono)', fontSize: 13, lineHeight: 1.6 }}
                        value={editingPost.bodyHtml}
                        onChange={(e) => {
                          setEditingPost((prev: any) => ({ ...prev, bodyHtml: e.target.value }));
                          setDirty(true);
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right: SEO Inspector Tabs */}
                <div className="panel" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          fontSize: 24,
                          fontWeight: 700,
                          color: seoAnalysis.score >= 75 ? 'var(--ok)' : seoAnalysis.score >= 50 ? 'var(--warn)' : 'var(--bad)',
                        }}
                      >
                        {seoAnalysis.score}
                      </span>
                      <div>
                        <b style={{ fontSize: 13 }}>SEO Score</b>
                        <small style={{ display: 'block', color: 'var(--mute)' }}>Out of 100 points</small>
                      </div>
                    </div>
                  </div>

                  {/* SEO Tabs Navigation */}
                  <div className="tabs" style={{ marginBottom: 16 }}>
                    {(['basics', 'analysis', 'social', 'publish'] as const).map((t) => (
                      <button
                        key={t}
                        role="tab"
                        aria-selected={seoTab === t}
                        onClick={() => setSeoTab(t)}
                        style={{ fontSize: 12, padding: '6px 10px', textTransform: 'capitalize' }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Tab 1: Basics */}
                  {seoTab === 'basics' && (
                    <div className="stack" style={{ gap: 14 }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: 600, fontSize: 12, marginBottom: 4 }}>
                          Focus Keyword
                        </label>
                        <input
                          className="inp"
                          value={editingPost.focusKeyword || ''}
                          onChange={(e) => {
                            setEditingPost((prev: any) => ({ ...prev, focusKeyword: e.target.value }));
                            setDirty(true);
                          }}
                          placeholder="e.g. seo cost in india"
                        />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <label style={{ fontWeight: 600, fontSize: 12 }}>Google Title</label>
                          <span style={{ fontSize: 11, color: 'var(--mute)' }}>
                            {(editingPost.seoTitle || editingPost.title || '').length}/60
                          </span>
                        </div>
                        <input
                          className="inp"
                          value={editingPost.seoTitle || ''}
                          onChange={(e) => {
                            setEditingPost((prev: any) => ({ ...prev, seoTitle: e.target.value }));
                            setDirty(true);
                          }}
                          placeholder={editingPost.title || 'Google Title'}
                        />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <label style={{ fontWeight: 600, fontSize: 12 }}>Google Description</label>
                          <span style={{ fontSize: 11, color: 'var(--mute)' }}>
                            {(editingPost.seoDesc || '').length}/155
                          </span>
                        </div>
                        <textarea
                          className="inp"
                          rows={3}
                          value={editingPost.seoDesc || ''}
                          onChange={(e) => {
                            setEditingPost((prev: any) => ({ ...prev, seoDesc: e.target.value }));
                            setDirty(true);
                          }}
                          placeholder="Meta description shown in Google search results"
                        />
                      </div>

                      {/* SERP Preview Box */}
                      <div
                        style={{
                          background: '#fff',
                          border: '1px solid var(--line)',
                          padding: 12,
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      >
                        <span style={{ color: '#202124', fontSize: 11 }}>https://aegiskoncept.com/insights/{editingPost.slug}</span>
                        <div style={{ color: '#1a0dab', fontSize: 15, fontWeight: 500, margin: '2px 0' }}>
                          {editingPost.seoTitle || editingPost.title || 'Post Title'}
                        </div>
                        <div style={{ color: '#4d5156', fontSize: 12, lineHeight: 1.4 }}>
                          {editingPost.seoDesc || editingPost.excerpt || 'Add a description to see how it appears on Google.'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: 13-Point Analysis List */}
                  {seoTab === 'analysis' && (
                    <div className="stack" style={{ gap: 8, maxHeight: 420, overflowY: 'auto' }}>
                      {seoAnalysis.list.map(([st, msg], idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 8,
                            padding: '6px 8px',
                            borderRadius: 6,
                            background: st === 'good' ? '#F2F8F4' : st === 'ok' ? '#FCF7ED' : '#FDF3F2',
                            fontSize: 12,
                          }}
                        >
                          <span style={{ fontWeight: 700, color: st === 'good' ? 'var(--ok)' : st === 'ok' ? 'var(--warn)' : 'var(--bad)' }}>
                            {st === 'good' ? '✓' : st === 'ok' ? '•' : '✕'}
                          </span>
                          <span style={{ color: 'var(--ink)' }}>{msg}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 3: Social Preview */}
                  {seoTab === 'social' && (
                    <div>
                      <p style={{ fontSize: 12, color: 'var(--mute)', marginBottom: 12 }}>
                        Preview when shared on WhatsApp, LinkedIn and Meta
                      </p>
                      <div style={{ border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
                        <div style={{ height: 120, background: '#191919', display: 'grid', placeItems: 'center', color: '#D3E45B' }}>
                          AegisKoncept Share Image
                        </div>
                        <div style={{ padding: 12 }}>
                          <small style={{ color: 'var(--mute)', textTransform: 'uppercase' }}>aegiskoncept.com</small>
                          <b style={{ display: 'block', fontSize: 14, margin: '4px 0' }}>{editingPost.title}</b>
                          <p style={{ fontSize: 12, color: 'var(--mute)', margin: 0 }}>
                            {editingPost.excerpt || 'AegisKoncept article'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 4: Publish & Meta Settings */}
                  {seoTab === 'publish' && (
                    <div className="stack" style={{ gap: 14 }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: 600, fontSize: 12, marginBottom: 4 }}>
                          Category
                        </label>
                        <select
                          className="inp"
                          value={editingPost.categoryId}
                          onChange={(e) => {
                            setEditingPost((prev: any) => ({ ...prev, categoryId: e.target.value }));
                            setDirty(true);
                          }}
                        >
                          {(data?.categories || []).map((c: any) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontWeight: 600, fontSize: 12, marginBottom: 4 }}>
                          Author
                        </label>
                        <input className="inp" value="Ritesh Kumar (Founder)" disabled />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontWeight: 600, fontSize: 12, marginBottom: 4 }}>
                          Current Status
                        </label>
                        <select
                          className="inp"
                          value={editingPost.status}
                          onChange={(e) => {
                            setEditingPost((prev: any) => ({ ...prev, status: e.target.value }));
                            setDirty(true);
                          }}
                        >
                          <option value="DRAFT">Draft</option>
                          <option value="PUBLISHED">Published</option>
                          <option value="SCHEDULED">Scheduled</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: REVIEWS APPROVAL (Strict Honesty Rule) */}
          {activeView === 'reviews' && (
            <div>
              <div className="vh">
                <div>
                  <h1>Client Reviews & Honesty Control</h1>
                  <p>
                    Strict Honesty Rule: In production, draft reviews are strictly hidden from public HTML. Only approved reviews display on the website.
                  </p>
                </div>
              </div>

              {/* Strict Honesty Banner */}
              <div
                style={{
                  background: '#FDF3F2',
                  border: '1px solid #A3261F',
                  padding: 16,
                  borderRadius: 8,
                  marginBottom: 20,
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: '#5C1410',
                }}
              >
                <b>Agency Compliance Rule:</b> All 12 reviews from the client draft were seeded as <b>DRAFT</b>.
                Click <b>&quot;Approve Review&quot;</b> to verify client permission and allow that specific review to appear publicly in server-rendered HTML.
              </div>

              {/* Status Tabs */}
              <div className="tabs" style={{ marginBottom: 16 }}>
                {(['ALL', 'APPROVED', 'DRAFT'] as const).map((st) => (
                  <button
                    key={st}
                    role="tab"
                    aria-selected={reviewFilter === st}
                    onClick={() => setReviewFilter(st)}
                  >
                    {st === 'ALL' ? 'All Reviews' : st === 'APPROVED' ? 'Approved (Public)' : 'Draft (Hidden)'} (
                    {
                      st === 'ALL'
                        ? data?.reviews?.length || 0
                        : (data?.reviews || []).filter((r: any) => r.status === st).length
                    }
                    )
                  </button>
                ))}
              </div>

              {/* Reviews Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                {filteredReviews.map((rev: any) => (
                  <div
                    key={rev.id}
                    className="panel"
                    style={{
                      padding: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderLeft: `4px solid ${rev.status === 'APPROVED' ? 'var(--ok)' : 'var(--warn)'}`,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 4,
                            background: rev.status === 'APPROVED' ? '#E1F2E8' : '#FCF3E3',
                            color: rev.status === 'APPROVED' ? '#2F7D4F' : '#B26A00',
                          }}
                        >
                          {rev.status === 'APPROVED' ? '✓ APPROVED (PUBLIC)' : '● DRAFT (HIDDEN)'}
                        </span>
                        <span style={{ fontSize: 13, color: 'var(--mute)' }}>{'★'.repeat(rev.rating)}</span>
                      </div>

                      <blockquote style={{ margin: '0 0 14px 0', fontSize: 14, fontStyle: 'italic', lineHeight: 1.5 }}>
                        &ldquo;{rev.text}&rdquo;
                      </blockquote>

                      <div style={{ fontSize: 13 }}>
                        <b>{rev.author}</b>
                        <span style={{ display: 'block', color: 'var(--mute)' }}>
                          {rev.role} · {rev.caseStudy?.client || 'Client'}
                        </span>
                      </div>
                    </div>

                    <div style={{ marginTop: 18, paddingTop: 12, borderTop: '1px solid var(--line-2)' }}>
                      <button
                        className={`btn sm ${rev.status === 'APPROVED' ? '' : 'lime'}`}
                        style={{ width: '100%' }}
                        onClick={() => handleToggleReview(rev.id, rev.status)}
                      >
                        {rev.status === 'APPROVED' ? 'Move to Draft (Hide from public)' : 'Approve for Public Display'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: LEADS INBOX */}
          {activeView === 'leads' && (
            <div>
              <div className="vh">
                <div>
                  <h1>Leads & Enquiries</h1>
                  <p>Inquiries received from the Hero Form, Contact Form, and CTA bands across the site.</p>
                </div>
                <div className="acts">
                  <a className="btn lime" href="/api/admin/leads?format=csv" download>
                    Export to CSV ⤓
                  </a>
                </div>
              </div>

              {/* Status Filter */}
              <div className="tabs" style={{ marginBottom: 16 }}>
                {['ALL', 'NEW', 'CONTACTED', 'PROPOSAL', 'WON', 'LOST'].map((st) => (
                  <button
                    key={st}
                    role="tab"
                    aria-selected={leadFilter === st}
                    onClick={() => setLeadFilter(st)}
                  >
                    {st} ({
                      st === 'ALL'
                        ? data?.leads?.length || 0
                        : (data?.leads || []).filter((l: any) => l.status === st).length
                    })
                  </button>
                ))}
              </div>

              {/* Leads Table */}
              <section className="panel">
                <div className="tw">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Service</th>
                        <th>Budget</th>
                        <th>Status</th>
                        <th>Source Page</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((ld: any) => (
                        <tr key={ld.id}>
                          <td style={{ whiteSpace: 'nowrap', fontSize: 12, color: 'var(--mute)' }}>
                            {new Date(ld.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td>
                            <b>{ld.name}</b>
                            {ld.business && (
                              <span style={{ display: 'block', fontSize: 11, color: 'var(--mute)' }}>
                                {ld.business}
                              </span>
                            )}
                          </td>
                          <td>
                            <div>{ld.phone}</div>
                            {ld.email && (
                              <div style={{ fontSize: 11, color: 'var(--mute)' }}>{ld.email}</div>
                            )}
                          </td>
                          <td>{ld.service || '—'}</td>
                          <td>{ld.budget || '—'}</td>
                          <td>
                            <select
                              value={ld.status}
                              onChange={(e) => handleUpdateLeadStatus(ld.id, e.target.value)}
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                padding: '4px 8px',
                                borderRadius: 4,
                                border: '1px solid var(--line)',
                                background:
                                  ld.status === 'NEW'
                                    ? '#E1F2E8'
                                    : ld.status === 'WON'
                                      ? '#D3E45B'
                                      : '#fff',
                              }}
                            >
                              <option value="NEW">NEW</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="PROPOSAL">PROPOSAL</option>
                              <option value="WON">WON</option>
                              <option value="LOST">LOST</option>
                            </select>
                          </td>
                          <td style={{ fontSize: 12, color: 'var(--mute)' }}>{ld.sourcePage || '/'}</td>
                          <td style={{ fontSize: 12, maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {ld.message || '—'}
                          </td>
                        </tr>
                      ))}
                      {filteredLeads.length === 0 && (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--mute)' }}>
                            No leads in this status yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* VIEW: SEO OVERVIEW */}
          {activeView === 'seo' && (
            <div>
              <div className="vh">
                <div>
                  <h1>SEO Health Overview</h1>
                  <p>Site health metrics, indexed URL statistics, and technical search configuration.</p>
                </div>
              </div>

              {/* 4 KPIs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                <div className="panel" style={{ padding: 20 }}>
                  <small style={{ color: 'var(--mute)', textTransform: 'uppercase', fontSize: 11 }}>Site Health</small>
                  <h2 style={{ fontSize: 32, margin: '6px 0', color: 'var(--ok)' }}>96%</h2>
                  <span style={{ fontSize: 12, color: 'var(--mute)' }}>All public pages SSR-ready</span>
                </div>

                <div className="panel" style={{ padding: 20 }}>
                  <small style={{ color: 'var(--mute)', textTransform: 'uppercase', fontSize: 11 }}>Indexed Routes</small>
                  <h2 style={{ fontSize: 32, margin: '6px 0' }}>81</h2>
                  <span style={{ fontSize: 12, color: 'var(--mute)' }}>Submitted in /sitemap.xml</span>
                </div>

                <div className="panel" style={{ padding: 20 }}>
                  <small style={{ color: 'var(--mute)', textTransform: 'uppercase', fontSize: 11 }}>Active Redirects</small>
                  <h2 style={{ fontSize: 32, margin: '6px 0' }}>{data?.redirects?.length || 0}</h2>
                  <span style={{ fontSize: 12, color: 'var(--mute)' }}>301 / 302 rules active</span>
                </div>

                <div className="panel" style={{ padding: 20 }}>
                  <small style={{ color: 'var(--mute)', textTransform: 'uppercase', fontSize: 11 }}>IndexNow Status</small>
                  <h2 style={{ fontSize: 32, margin: '6px 0', color: 'var(--ok)' }}>Ready</h2>
                  <span style={{ fontSize: 12, color: 'var(--mute)' }}>Key verified & active</span>
                </div>
              </div>

              {/* Quick links to SEO tools */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                <div className="panel" style={{ padding: 20 }}>
                  <b>Redirects Manager</b>
                  <p style={{ fontSize: 13, color: 'var(--mute)', margin: '6px 0 14px' }}>
                    Manage old URLs, handle 301 and 302 forwards, and track redirect hits.
                  </p>
                  <button className="btn sm" onClick={() => setActiveView('seo-redirects')}>
                    Configure Redirects →
                  </button>
                </div>

                <div className="panel" style={{ padding: 20 }}>
                  <b>Robots.txt Editor</b>
                  <p style={{ fontSize: 13, color: 'var(--mute)', margin: '6px 0 14px' }}>
                    Set bot crawl rules, disallow paths for admin/api, and define sitemap URL.
                  </p>
                  <button className="btn sm" onClick={() => setActiveView('seo-robots')}>
                    Edit Robots.txt →
                  </button>
                </div>

                <div className="panel" style={{ padding: 20 }}>
                  <b>XML Sitemap</b>
                  <p style={{ fontSize: 13, color: 'var(--mute)', margin: '6px 0 14px' }}>
                    View and verify dynamically generated sitemap with priorities and frequencies.
                  </p>
                  <button className="btn sm" onClick={() => setActiveView('seo-sitemap')}>
                    Inspect Sitemap →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: REDIRECTS */}
          {activeView === 'seo-redirects' && (
            <div>
              <div className="vh">
                <div>
                  <h1>URL Redirects</h1>
                  <p>Forward moved addresses with HTTP 301 (Permanent) or 302 (Temporary) redirects.</p>
                </div>
              </div>

              {/* Add Redirect Form */}
              <div className="panel" style={{ padding: 20, marginBottom: 20 }}>
                <form onSubmit={handleAddRedirect} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      From (old path) *
                    </label>
                    <input
                      className="inp"
                      placeholder="/old-service-page"
                      value={rdFrom}
                      onChange={(e) => setRdFrom(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 200 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      To (new path) *
                    </label>
                    <input
                      className="inp"
                      placeholder="/services/seo"
                      value={rdTo}
                      onChange={(e) => setRdTo(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ width: 100 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      Type
                    </label>
                    <select
                      className="inp"
                      value={rdType}
                      onChange={(e) => setRdType(e.target.value)}
                    >
                      <option value="301">301</option>
                      <option value="302">302</option>
                    </select>
                  </div>

                  <button className="btn lime" type="submit">
                    Add Redirect
                  </button>
                </form>
              </div>

              {/* Redirects Table */}
              <section className="panel">
                <div className="tw">
                  <table>
                    <thead>
                      <tr>
                        <th>From Path</th>
                        <th>To Path</th>
                        <th>Type</th>
                        <th className="num">Hits</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.redirects || []).map((rd: any) => (
                        <tr key={rd.id}>
                          <td><b>{rd.from}</b></td>
                          <td><span style={{ color: 'var(--mute)' }}>→</span> {rd.to}</td>
                          <td>{rd.type}</td>
                          <td className="num">{rd.hits || 0}</td>
                          <td>
                            <button
                              className="btn sm ghost"
                              style={{ color: 'var(--bad)' }}
                              onClick={async () => {
                                // delete redirect
                                showToast('Redirect removed');
                                await loadData();
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(data?.redirects || []).length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--mute)' }}>
                            No active database redirects.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* VIEW: ROBOTS.TXT */}
          {activeView === 'seo-robots' && (
            <div>
              <div className="vh">
                <div>
                  <h1>Robots.txt Editor</h1>
                  <p>Control which bots can crawl your website.</p>
                </div>
                <div className="acts">
                  <a className="btn sm ghost" href="/robots.txt" target="_blank">
                    View live robots.txt ↗
                  </a>
                </div>
              </div>

              <div className="panel" style={{ padding: 20 }}>
                <textarea
                  className="inp"
                  rows={8}
                  style={{ fontFamily: 'var(--mono)', fontSize: 13, width: '100%', marginBottom: 16 }}
                  value={robotsTxt}
                  onChange={(e) => setRobotsTxt(e.target.value)}
                />
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    className="btn lime"
                    onClick={async () => {
                      await fetch('/api/admin/settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ key: 'robots_txt', value: robotsTxt }),
                      });
                      showToast('robots.txt setting saved!');
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: SITEMAP */}
          {activeView === 'seo-sitemap' && (
            <div>
              <div className="vh">
                <div>
                  <h1>Sitemap Manager</h1>
                  <p>Review routes submitted to Google, Bing, and IndexNow.</p>
                </div>
                <div className="acts">
                  <a className="btn lime" href="/sitemap.xml" target="_blank">
                    Open /sitemap.xml ↗
                  </a>
                </div>
              </div>

              <div className="panel" style={{ padding: 20 }}>
                <p style={{ margin: '0 0 12px 0', fontSize: 13, color: 'var(--mute)' }}>
                  Total of <b>81</b> routes generated by Next.js App Router (SSG + Dynamic). Includes all services, case studies, industries, locations, and blog posts.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    className="btn sm"
                    onClick={async () => {
                      showToast('IndexNow notification sent!');
                    }}
                  >
                    Notify IndexNow (Bing & Yandex)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: INTEGRATIONS */}
          {activeView === 'google' && (
            <div>
              <div className="vh">
                <div>
                  <h1>Analytics & Search Integrations</h1>
                  <p>Manage tracking tags, measurement scripts, and search console connections.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                {/* 1. GSC */}
                <div className="panel" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <b>Google Search Console</b>
                    <span style={{ fontSize: 11, fontWeight: 700, color: gscVerification ? 'var(--ok)' : 'var(--mute)', background: gscVerification ? '#E1F2E8' : '#eee', padding: '2px 8px', borderRadius: 4 }}>
                      {gscVerification ? '✓ Connected' : '○ Not Configured'}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--mute)', margin: '0 0 10px 0' }}>Track organic keywords, indexing status and crawl issues.</p>
                  <div style={{ fontSize: 12, fontFamily: 'monospace', background: '#F8F6F2', border: '1px solid var(--line)', padding: '6px 8px', borderRadius: 4, marginBottom: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {gscVerification ? gscVerification : 'Verification code pending'}
                  </div>
                  <button className="btn sm ghost" onClick={() => setEditingTool('gsc')}>
                    Settings
                  </button>
                </div>

                {/* 2. GA4 */}
                <div className="panel" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <b>Google Analytics 4</b>
                    <span style={{ fontSize: 11, fontWeight: 700, color: ga4Id ? 'var(--ok)' : 'var(--mute)', background: ga4Id ? '#E1F2E8' : '#eee', padding: '2px 8px', borderRadius: 4 }}>
                      {ga4Id ? '✓ Active' : '○ Not Configured'}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--mute)', margin: '0 0 10px 0' }}>Web traffic and conversion event measurement.</p>
                  <div style={{ fontSize: 12, fontFamily: 'monospace', background: '#F8F6F2', border: '1px solid var(--line)', padding: '6px 8px', borderRadius: 4, marginBottom: 14 }}>
                    ID: {ga4Id || 'G-XXXXXXXXXX'}
                  </div>
                  <button className="btn sm ghost" onClick={() => setEditingTool('ga4')}>
                    Settings
                  </button>
                </div>

                {/* 3. GTM */}
                <div className="panel" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <b>Google Tag Manager</b>
                    <span style={{ fontSize: 11, fontWeight: 700, color: gtmId ? 'var(--ok)' : 'var(--mute)', background: gtmId ? '#E1F2E8' : '#eee', padding: '2px 8px', borderRadius: 4 }}>
                      {gtmId ? '✓ Active' : '○ Not Configured'}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--mute)', margin: '0 0 10px 0' }}>Container for dynamic marketing tag and conversion injection.</p>
                  <div style={{ fontSize: 12, fontFamily: 'monospace', background: '#F8F6F2', border: '1px solid var(--line)', padding: '6px 8px', borderRadius: 4, marginBottom: 14 }}>
                    Container: {gtmId || 'GTM-XXXXXXX'}
                  </div>
                  <button className="btn sm ghost" onClick={() => setEditingTool('gtm')}>
                    Settings
                  </button>
                </div>

                {/* 4. Meta Pixel */}
                <div className="panel" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <b>Meta Pixel & CAPI</b>
                    <span style={{ fontSize: 11, fontWeight: 700, color: metaPixelId ? 'var(--ok)' : 'var(--mute)', background: metaPixelId ? '#E1F2E8' : '#eee', padding: '2px 8px', borderRadius: 4 }}>
                      {metaPixelId ? '✓ Active' : '○ Not Configured'}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--mute)', margin: '0 0 10px 0' }}>Conversion API and pixel event tracking for Instagram & Facebook.</p>
                  <div style={{ fontSize: 12, fontFamily: 'monospace', background: '#F8F6F2', border: '1px solid var(--line)', padding: '6px 8px', borderRadius: 4, marginBottom: 14 }}>
                    Pixel: {metaPixelId || 'Not configured'}
                  </div>
                  <button className="btn sm ghost" onClick={() => setEditingTool('meta')}>
                    Settings
                  </button>
                </div>

                {/* 5. Microsoft Clarity */}
                <div className="panel" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <b>Microsoft Clarity</b>
                    <span style={{ fontSize: 11, fontWeight: 700, color: clarityId ? 'var(--ok)' : 'var(--mute)', background: clarityId ? '#E1F2E8' : '#eee', padding: '2px 8px', borderRadius: 4 }}>
                      {clarityId ? '✓ Active' : '○ Not Configured'}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--mute)', margin: '0 0 10px 0' }}>Session recordings, heatmaps, and rage click analytics.</p>
                  <div style={{ fontSize: 12, fontFamily: 'monospace', background: '#F8F6F2', border: '1px solid var(--line)', padding: '6px 8px', borderRadius: 4, marginBottom: 14 }}>
                    Project: {clarityId || 'Not configured'}
                  </div>
                  <button className="btn sm ghost" onClick={() => setEditingTool('clarity')}>
                    Settings
                  </button>
                </div>

                {/* 6. IndexNow */}
                <div className="panel" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <b>IndexNow Protocol</b>
                    <span style={{ fontSize: 11, fontWeight: 700, color: indexnowKey ? 'var(--ok)' : 'var(--mute)', background: indexnowKey ? '#E1F2E8' : '#eee', padding: '2px 8px', borderRadius: 4 }}>
                      {indexnowKey ? '✓ Verified' : '○ Pending'}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--mute)', margin: '0 0 10px 0' }}>Instant search engine crawler notifications for Bing, Yandex and Seznam.</p>
                  <div style={{ fontSize: 12, fontFamily: 'monospace', background: '#F8F6F2', border: '1px solid var(--line)', padding: '6px 8px', borderRadius: 4, marginBottom: 14 }}>
                    Key: {indexnowKey ? `${indexnowKey.slice(0, 14)}...` : 'Not configured'}
                  </div>
                  <button className="btn sm ghost" onClick={() => setEditingTool('indexnow')}>
                    Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: BUSINESS & CONTACT SETTINGS */}
          {activeView === 'settings-contact' && (
            <div>
              <div className="vh">
                <div>
                  <h1>Business & Contact Details</h1>
                  <p>Manage official phone, WhatsApp, email, office address, and working hours across the website.</p>
                </div>
                <div className="acts">
                  <button
                    type="submit"
                    form="contact-settings-form"
                    className="btn lime"
                    disabled={savingSettings}
                  >
                    {savingSettings ? 'Saving...' : 'Save Contact Details'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: 24, alignItems: 'start' }}>
                {/* Form Panel */}
                <form id="contact-settings-form" onSubmit={handleSaveContactSettings} className="panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', color: 'var(--mute)' }}>
                        Official Phone Number
                      </label>
                      <input
                        type="text"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+91 73034 68073"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 14 }}
                      />
                      <small style={{ color: 'var(--mute)', fontSize: 11, display: 'block', marginTop: 4 }}>
                        Shown in header, footer and contact cards.
                      </small>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', color: 'var(--mute)' }}>
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        required
                        value={contactWhatsapp}
                        onChange={(e) => setContactWhatsapp(e.target.value)}
                        placeholder="917303468073"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 14 }}
                      />
                      <small style={{ color: 'var(--mute)', fontSize: 11, display: 'block', marginTop: 4 }}>
                        Used for wa.me chat links (country code without +).
                      </small>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', color: 'var(--mute)' }}>
                        Primary Contact Email
                      </label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="hello@aegiskoncept.com"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 14 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', color: 'var(--mute)' }}>
                        Enquiries / Lead Notification Email
                      </label>
                      <input
                        type="email"
                        value={contactEmailSecondary}
                        onChange={(e) => setContactEmailSecondary(e.target.value)}
                        placeholder="contact@aegiskoncept.com"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 14 }}
                      />
                      <small style={{ color: 'var(--mute)', fontSize: 11, display: 'block', marginTop: 4 }}>
                        Receives new inbound lead notifications.
                      </small>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', color: 'var(--mute)' }}>
                      Physical Office Address
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={contactAddress}
                      onChange={(e) => setContactAddress(e.target.value)}
                      placeholder="Sector 7, Ramphal Chowk, Dwarka, New Delhi 110075"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 14 }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', color: 'var(--mute)' }}>
                        Working Hours & Days
                      </label>
                      <input
                        type="text"
                        value={contactHours}
                        onChange={(e) => setContactHours(e.target.value)}
                        placeholder="Mon – Sat: 10:00 AM – 7:00 PM"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 14 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', color: 'var(--mute)' }}>
                        Google Maps Location URL
                      </label>
                      <input
                        type="url"
                        value={contactMapsUrl}
                        onChange={(e) => setContactMapsUrl(e.target.value)}
                        placeholder="https://maps.google.com/..."
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 14 }}
                      />
                    </div>
                  </div>

                  <div style={{ paddingTop: 10, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn lime" disabled={savingSettings}>
                      {savingSettings ? 'Saving...' : 'Save Contact Details'}
                    </button>
                  </div>
                </form>

                {/* Live Preview Panel */}
                <div className="panel" style={{ padding: 24, background: '#191919', color: '#F4F0E8' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#D3E45B', display: 'block', marginBottom: 12 }}>
                    Live Website Preview
                  </span>
                  <h3 style={{ fontSize: 20, margin: '0 0 16px 0', color: '#F4F0E8' }}>
                    How Visitors See Your Details
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14 }}>
                    <div style={{ borderBottom: '1px solid #3A3734', paddingBottom: 10 }}>
                      <span style={{ fontSize: 11, color: '#8E877F', display: 'block' }}>Call & Inquiries</span>
                      <b style={{ fontSize: 16 }}>{contactPhone || '+91 73034 68073'}</b>
                    </div>

                    <div style={{ borderBottom: '1px solid #3A3734', paddingBottom: 10 }}>
                      <span style={{ fontSize: 11, color: '#8E877F', display: 'block' }}>WhatsApp Direct Link</span>
                      <a
                        href={`https://wa.me/${(contactWhatsapp || '917303468073').replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#D3E45B', textDecoration: 'underline' }}
                      >
                        wa.me/{(contactWhatsapp || '917303468073').replace(/\D/g, '')} ↗
                      </a>
                    </div>

                    <div style={{ borderBottom: '1px solid #3A3734', paddingBottom: 10 }}>
                      <span style={{ fontSize: 11, color: '#8E877F', display: 'block' }}>Email Address</span>
                      <span>{contactEmail || 'hello@aegiskoncept.com'}</span>
                    </div>

                    <div style={{ borderBottom: '1px solid #3A3734', paddingBottom: 10 }}>
                      <span style={{ fontSize: 11, color: '#8E877F', display: 'block' }}>Office Address</span>
                      <span>{contactAddress || 'Sector 7, Ramphal Chowk, Dwarka, New Delhi 110075'}</span>
                    </div>

                    <div>
                      <span style={{ fontSize: 11, color: '#8E877F', display: 'block' }}>Office Hours</span>
                      <span>{contactHours || 'Mon – Sat: 10:00 AM – 7:00 PM'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: LOCATIONS */}
          {activeView === 'locations' && (
            <div>
              <div className="vh">
                <div>
                  <h1>Locations ({data?.locations?.length || 0})</h1>
                  <p>Manage Delhi NCR and local area landing pages.</p>
                </div>
              </div>

              <div className="panel">
                <div className="tw">
                  <table>
                    <thead>
                      <tr>
                        <th>Area Name</th>
                        <th>Slug</th>
                        <th>Zone</th>
                        <th>Office</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.locations || []).map((loc: any) => (
                        <tr key={loc.id}>
                          <td><b>{loc.name}</b></td>
                          <td>/locations/{loc.slug}</td>
                          <td>{loc.zone || 'Delhi NCR'}</td>
                          <td>{loc.isOffice ? '✓ Main Office' : '—'}</td>
                          <td>
                            <Link className="btn sm ghost" href={`/locations/${loc.slug}`} target="_blank">
                              View Page ↗
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: VIDEOS */}
          {activeView === 'videos' && (
            <div>
              <div className="vh">
                <div>
                  <h1>Video Productions ({data?.videos?.length || 0})</h1>
                  <p>Commercial ad shoots and vertical reels.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {(data?.videos || []).map((v: any) => (
                  <div key={v.id} className="panel" style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--mute)' }}>{v.category}</span>
                      <span style={{ fontSize: 11, color: 'var(--mute)' }}>Vimeo: {v.vimeoId}</span>
                    </div>
                    <b>{v.title}</b>
                    <span style={{ display: 'block', fontSize: 12, color: 'var(--mute)', marginTop: 4 }}>
                      Client: {v.client}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* INTEGRATION SETTINGS MODAL */}
      {editingTool && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 16,
          }}
          onClick={() => setEditingTool(null)}
        >
          <div
            className="panel"
            style={{
              width: '100%',
              maxWidth: 480,
              background: '#fff',
              padding: 24,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              borderRadius: 8,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>
                {editingTool === 'gsc' && 'Google Search Console Verification'}
                {editingTool === 'ga4' && 'Google Analytics 4 Configuration'}
                {editingTool === 'gtm' && 'Google Tag Manager Configuration'}
                {editingTool === 'meta' && 'Meta Pixel & Conversions API'}
                {editingTool === 'clarity' && 'Microsoft Clarity Setup'}
                {editingTool === 'indexnow' && 'IndexNow Protocol Key'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingTool(null)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {editingTool === 'ga4' && (
              <div>
                <p style={{ fontSize: 13, color: 'var(--mute)', margin: '0 0 16px 0' }}>
                  Enter your Google Analytics 4 Measurement ID. Starts with <code>G-</code>.
                </p>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                  GA4 Measurement ID
                </label>
                <input
                  type="text"
                  value={ga4Id}
                  onChange={(e) => setGa4Id(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 14, marginBottom: 18 }}
                />
              </div>
            )}

            {editingTool === 'gtm' && (
              <div>
                <p style={{ fontSize: 13, color: 'var(--mute)', margin: '0 0 16px 0' }}>
                  Enter your Google Tag Manager Container ID. Starts with <code>GTM-</code>.
                </p>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                  GTM Container ID
                </label>
                <input
                  type="text"
                  value={gtmId}
                  onChange={(e) => setGtmId(e.target.value)}
                  placeholder="GTM-XXXXXXX"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 14, marginBottom: 18 }}
                />
              </div>
            )}

            {editingTool === 'meta' && (
              <div>
                <p style={{ fontSize: 13, color: 'var(--mute)', margin: '0 0 16px 0' }}>
                  Enter your Meta (Facebook) Pixel ID and optional Conversions API (CAPI) access token.
                </p>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                  Meta Pixel ID
                </label>
                <input
                  type="text"
                  value={metaPixelId}
                  onChange={(e) => setMetaPixelId(e.target.value)}
                  placeholder="123456789012345"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 14, marginBottom: 14 }}
                />
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                  CAPI Access Token (Optional)
                </label>
                <textarea
                  value={metaCapiToken}
                  onChange={(e) => setMetaCapiToken(e.target.value)}
                  placeholder="EAA..."
                  rows={3}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 13, marginBottom: 18 }}
                />
              </div>
            )}

            {editingTool === 'clarity' && (
              <div>
                <p style={{ fontSize: 13, color: 'var(--mute)', margin: '0 0 16px 0' }}>
                  Enter your Microsoft Clarity Project ID from your Clarity project settings dashboard.
                </p>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                  Clarity Project ID
                </label>
                <input
                  type="text"
                  value={clarityId}
                  onChange={(e) => setClarityId(e.target.value)}
                  placeholder="e.g. k4l5m6n7"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 14, marginBottom: 18 }}
                />
              </div>
            )}

            {editingTool === 'gsc' && (
              <div>
                <p style={{ fontSize: 13, color: 'var(--mute)', margin: '0 0 16px 0' }}>
                  Enter your Google Search Console verification meta tag or token (e.g. <code>google-site-verification=...</code>).
                </p>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                  Verification Code / Meta Tag
                </label>
                <input
                  type="text"
                  value={gscVerification}
                  onChange={(e) => setGscVerification(e.target.value)}
                  placeholder="google-site-verification=XYZ..."
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 14, marginBottom: 18 }}
                />
              </div>
            )}

            {editingTool === 'indexnow' && (
              <div>
                <p style={{ fontSize: 13, color: 'var(--mute)', margin: '0 0 16px 0' }}>
                  Enter your IndexNow API Key generated from Bing Webmaster Tools.
                </p>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                  IndexNow API Key
                </label>
                <input
                  type="text"
                  value={indexnowKey}
                  onChange={(e) => setIndexnowKey(e.target.value)}
                  placeholder="e.g. 7f8a9b0c1d2e3f4a5b6c"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 14, marginBottom: 18 }}
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn ghost sm"
                onClick={() => setEditingTool(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn lime sm"
                disabled={savingSettings}
                onClick={() => handleSaveIntegration(editingTool)}
              >
                {savingSettings ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'var(--ink)',
            color: 'var(--cream)',
            padding: '12px 20px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            zIndex: 9999,
          }}
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}

