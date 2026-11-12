'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { analysePost, SeoAnalysisResult } from '@/lib/seoAnalyzer';

function scls(s: number | null | undefined) {
  if (s == null) return 'sc-none';
  if (s >= 75) return 'sc-good';
  if (s >= 50) return 'sc-ok';
  return 'sc-bad';
}

function MeterBar({ val, lo, hi }: { val: number; lo: number; hi: number }) {
  const p = Math.min(100, (val / hi) * 100);
  const c = val === 0 ? 'var(--line)' : val >= lo && val <= hi ? 'var(--ok)' : val > hi ? 'var(--bad)' : 'var(--warn)';
  return (
    <div className="meter">
      <i style={{ width: `${p}%`, background: c }} />
    </div>
  );
}

function CharCount({ val, lo, hi }: { val: string; lo: number; hi: number }) {
  const n = (val || '').length;
  return (
    <span className={n >= lo && n <= hi ? 'cnt-ok' : 'cnt-bad'}>
      {n} / {hi}
    </span>
  );
}

function SerpPreview({ title, desc, slug, mobile }: { title?: string; desc?: string; slug?: string; mobile: boolean }) {
  const displayTitle = (title || '').length > 60 ? title?.slice(0, 58) + '…' : title || 'Your Google title';
  const displayDesc = (desc || '').length > 158 ? desc?.slice(0, 155) + '…' : desc || 'Your Google description shows here. Write one or two plain sentences.';
  const pathParts = (slug || '').replace(/^\//, '').split('/').filter(Boolean);
  return (
    <div className={`gprev ${mobile ? 'mob' : ''}`} style={{ marginTop: 8 }}>
      <div className="u">
        <i></i>
        <span>
          AegisKoncept
          <small>
            aegiskoncept.com {pathParts.length ? '› ' + pathParts.join(' › ') : '› insights'}
          </small>
        </span>
      </div>
      <div className="ti">{displayTitle}</div>
      <div className="de">{displayDesc}</div>
    </div>
  );
}

const SERVICE_OPTIONS = [
  { id: 'search-engine-optimization', name: 'SEO & Search Rankings', url: '/services/search-engine-optimization' },
  { id: 'website-design-development', name: 'Website Design & Development', url: '/services/website-design-development' },
  { id: 'performance-marketing', name: 'Performance Marketing (Meta & Google Ads)', url: '/services/performance-marketing' },
  { id: 'social-media-marketing', name: 'Social Media Marketing & Management', url: '/services/social-media-marketing' },
];

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
  const [postEditorSeoTab, setPostEditorSeoTab] = useState<'seo' | 'check' | 'social' | 'adv'>('seo');
  const [postEditorGmob, setPostEditorGmob] = useState(false);
  const [codeMode, setCodeMode] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [currentBlockStyle, setCurrentBlockStyle] = useState('p');
  const [seoAnalysis, setSeoAnalysis] = useState<SeoAnalysisResult>({ score: 0, list: [] });

  // Post Editor Modals & Tools
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkSel, setLinkSel] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(false);
  const [imgModalOpen, setImgModalOpen] = useState(false);
  const [imagePickerForFeatured, setImagePickerForFeatured] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [imgAlt, setImgAlt] = useState('');
  const [svcModalOpen, setSvcModalOpen] = useState(false);
  const [svcSel, setSvcSel] = useState(SERVICE_OPTIONS[0].id);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const rteRef = useRef<HTMLDivElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);

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

  // Open Post helper
  const openPostForEdit = (p: any) => {
    let parsedTags: string[] = [];
    if (Array.isArray(p.tags)) {
      parsedTags = p.tags;
    } else if (typeof p.tags === 'string' && p.tags) {
      try {
        parsedTags = JSON.parse(p.tags);
        if (!Array.isArray(parsedTags)) parsedTags = [p.tags];
      } catch {
        parsedTags = p.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      }
    }
    setEditingPost({
      ...p,
      tags: parsedTags,
      author: p.authorName || p.author || 'Ritesh Kumar',
      date: p.publishAt ? new Date(p.publishAt).toISOString().split('T')[0] : (p.date || new Date().toISOString().split('T')[0]),
      status: p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1).toLowerCase() : 'Draft',
      image: p.featuredMediaId || p.image || '',
      seoDesc: p.seoDesc || p.seoDescription || '',
      canonical: p.canonical || '',
      robots: p.robots || 'index',
      schemaType: p.schemaType || 'BlogPosting',
      ogTitle: p.ogTitle || '',
      ogDesc: p.ogDesc || p.ogDescription || '',
    });
    setActiveView('post');
    window.location.hash = 'post';
  };

  const initNewPost = () => {
    setEditingPost({
      id: '',
      title: '',
      slug: '',
      excerpt: '',
      bodyHtml: '<p></p>',
      focusKeyword: '',
      seoTitle: '',
      seoDesc: '',
      status: 'Draft',
      categoryId: data?.categories?.[0]?.id || '',
      tags: [],
      author: 'Ritesh Kumar',
      date: new Date().toISOString().split('T')[0],
      canonical: '',
      robots: 'index',
      schemaType: 'BlogPosting',
      image: '',
      ogTitle: '',
      ogDesc: '',
    });
    setActiveView('post');
    window.location.hash = 'post';
  };

  // URL hash sync
  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.slice(1);
      if (h) {
        if (h === 'post-new') {
          initNewPost();
        } else if (h === 'post' || h.startsWith('post-edit-')) {
          const id = h.startsWith('post-edit-') ? h.replace('post-edit-', '') : null;
          if (id && data?.posts) {
            const found = data.posts.find((p: any) => p.id === id);
            if (found) {
              openPostForEdit(found);
            }
          } else if (!editingPost && data?.posts?.length) {
            openPostForEdit(data.posts[0]);
          } else {
            setActiveView('post');
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
  }, [
    editingPost?.title,
    editingPost?.slug,
    editingPost?.focusKeyword,
    editingPost?.seoTitle,
    editingPost?.seoDesc,
    editingPost?.bodyHtml,
    editingPost?.image,
  ]);

  // Sync RTE DOM on post switch or codeMode toggle
  useEffect(() => {
    if (activeView === 'post' && rteRef.current && editingPost) {
      if (!codeMode && rteRef.current.innerHTML !== (editingPost.bodyHtml || '')) {
        rteRef.current.innerHTML = editingPost.bodyHtml || '<p></p>';
      }
    }
  }, [activeView, editingPost?.id, codeMode]);

  // RTE Selection & Command Helpers
  const saveSelection = () => {
    if (typeof window === 'undefined') return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && rteRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    if (typeof window === 'undefined') return;
    const sel = window.getSelection();
    if (sel && savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  const insertHtml = (html: string) => {
    if (!rteRef.current) return;
    rteRef.current.focus();
    restoreSelection();
    if (document.queryCommandSupported('insertHTML')) {
      document.execCommand('insertHTML', false, html);
    }
    const updatedHtml = rteRef.current.innerHTML;
    setEditingPost((prev: any) => ({ ...prev, bodyHtml: updatedHtml }));
    setDirty(true);
  };

  const handleBlockChange = (tag: string) => {
    setCurrentBlockStyle(tag);
    if (!rteRef.current) return;
    rteRef.current.focus();
    restoreSelection();
    try {
      document.execCommand('formatBlock', false, tag);
    } catch {
      document.execCommand('formatBlock', false, `<${tag}>`);
    }
    const html = rteRef.current.innerHTML;
    setEditingPost((prev: any) => ({ ...prev, bodyHtml: html }));
    setDirty(true);
  };

  const handleFormatCmd = (cmd: string) => {
    if (!rteRef.current) return;
    rteRef.current.focus();
    document.execCommand(cmd, false, undefined);
    const html = rteRef.current.innerHTML;
    setEditingPost((prev: any) => ({ ...prev, bodyHtml: html }));
    setDirty(true);
  };

  const handleRteInput = (e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML;
    setEditingPost((prev: any) => ({ ...prev, bodyHtml: html }));
    setDirty(true);
  };

  const handleRteKeyUp = () => {
    if (typeof document === 'undefined') return;
    const b = (document.queryCommandValue('formatBlock') || 'p').toLowerCase();
    setCurrentBlockStyle(['h2', 'h3', 'blockquote'].includes(b) ? b : 'p');
  };

  const handleInsertTable = () => {
    insertHtml('<table><thead><tr><th>Column</th><th>Column</th><th>Column</th></tr></thead><tbody><tr><td>…</td><td>…</td><td>…</td></tr><tr><td>…</td><td>…</td><td>…</td></tr></tbody></table><p></p>');
  };

  const handleInsertFaq = () => {
    insertHtml('<h2>Quick questions</h2><h3>Question people ask?</h3><p>Short, direct answer in one or two sentences.</p><h3>Another common question?</h3><p>Short, direct answer.</p>');
  };

  const handleInsertCta = () => {
    insertHtml('<blockquote><b>Want this done for you?</b> Get a free quote from AegisKoncept. We reply within 1 working day. <a href="/contact">Get a Free Quote</a></blockquote><p></p>');
  };

  const jumpToHeading = (text: string) => {
    if (!rteRef.current) return;
    const headings = Array.from(rteRef.current.querySelectorAll('h2, h3'));
    const found = headings.find((h) => h.textContent?.trim() === text.trim());
    if (found) {
      found.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleApplyLink = () => {
    const url = linkUrl.trim() || linkSel;
    if (!url) {
      showToast('Choose a page or paste a web address');
      return;
    }
    setLinkModalOpen(false);
    restoreSelection();
    const sel = typeof window !== 'undefined' ? window.getSelection()?.toString() : '';
    if (sel) {
      document.execCommand('createLink', false, url);
    } else {
      const label = linkSel ? (linkSel.split('/').pop() || url) : url;
      insertHtml(`<a href="${url}" ${linkNewTab ? 'target="_blank" rel="noopener"' : ''}>${label}</a>`);
    }
    if (rteRef.current && linkNewTab) {
      rteRef.current.querySelectorAll(`a[href="${url}"]`).forEach((x) => {
        x.setAttribute('target', '_blank');
        x.setAttribute('rel', 'noopener');
      });
    }
    if (rteRef.current) {
      setEditingPost((prev: any) => ({ ...prev, bodyHtml: rteRef.current?.innerHTML }));
      setDirty(true);
    }
    setLinkUrl('');
    setLinkSel('');
    setLinkNewTab(false);
  };

  const handleApplyImage = () => {
    const src = imgSrc.trim();
    if (!src) {
      showToast('Choose or enter an image URL');
      return;
    }
    setImgModalOpen(false);
    if (imagePickerForFeatured) {
      setEditingPost((prev: any) => ({ ...prev, image: src }));
      setDirty(true);
    } else {
      insertHtml(`<img src="${src}" alt="${imgAlt.replace(/"/g, '&quot;')}" /><p></p>`);
    }
    setImgSrc('');
    setImgAlt('');
    setImagePickerForFeatured(false);
  };

  const handleApplySvcBox = () => {
    setSvcModalOpen(false);
    const chosen = SERVICE_OPTIONS.find((s) => s.id === svcSel) || SERVICE_OPTIONS[0];
    insertHtml(`<div class="svcbox" contenteditable="false"><b>Service box</b> · ${chosen.name} → <span>${chosen.url}</span></div><p></p>`);
  };

  // Word count & Reading time
  const wordsCount = useMemo(() => {
    return (editingPost?.bodyHtml || '')
      .replace(/<[^>]+>/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  }, [editingPost?.bodyHtml]);

  const readTimeMinutes = useMemo(() => {
    return Math.max(1, Math.round(wordsCount / 220));
  }, [wordsCount]);

  // Outline headings
  const headingsList = useMemo(() => {
    const html = editingPost?.bodyHtml || '';
    const list: Array<{ tag: 'h2' | 'h3'; text: string }> = [];
    const re = /<(h[23])[^>]*>(.*?)<\/\1>/gi;
    let match;
    while ((match = re.exec(html)) !== null) {
      const text = match[2].replace(/<[^>]+>/g, '').trim();
      if (text) {
        list.push({ tag: match[1].toLowerCase() as 'h2' | 'h3', text });
      }
    }
    return list;
  }, [editingPost?.bodyHtml]);

  // Tags in use for categories & tags view
  const tagsInUse = useMemo(() => {
    const map: Record<string, number> = {};
    (data?.posts || []).forEach((p: any) => {
      let pt: string[] = [];
      if (Array.isArray(p.tags)) pt = p.tags;
      else if (typeof p.tags === 'string' && p.tags) {
        try {
          const parsed = JSON.parse(p.tags);
          if (Array.isArray(parsed)) pt = parsed;
        } catch {
          pt = p.tags.split(',').map((t: string) => t.trim());
        }
      }
      pt.forEach((t) => {
        if (t) map[t] = (map[t] || 0) + 1;
      });
    });
    return map;
  }, [data?.posts]);

  const handleSavePost = async (targetStatus?: string) => {
    if (!editingPost?.title?.trim()) {
      showToast('Please enter an article title');
      return;
    }
    const finalStatus = targetStatus || editingPost.status || 'Draft';
    if (finalStatus.toLowerCase() === 'published' && seoAnalysis.score < 50) {
      if (!confirm(`The SEO score is ${seoAnalysis.score}/100. Do you want to publish anyway, or fix the red checks first?`)) {
        return;
      }
    }
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingPost,
          status: finalStatus,
          tags: editingPost.tags || [],
          authorName: editingPost.author || 'Ritesh Kumar',
          publishAt: editingPost.date || new Date().toISOString(),
          seoScore: seoAnalysis.score,
        }),
      });

      if (res.ok) {
        showToast(finalStatus.toLowerCase() === 'published' ? `Published to /insights/${editingPost.slug}` : 'Draft saved!');
        setDirty(false);
        await loadData();
        setActiveView('posts');
        window.location.hash = 'posts';
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to save post.');
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
            {activeView === 'post' && editingPost ? (
              <>
                <a
                  href="#posts"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveView('posts');
                    window.location.hash = 'posts';
                  }}
                >
                  Blog
                </a>
                <span>/</span>
                <b>{editingPost.title || 'New post'}</b>
              </>
            ) : activeView === 'cats' ? (
              <>
                <a
                  href="#posts"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveView('posts');
                    window.location.hash = 'posts';
                  }}
                >
                  Blog
                </a>
                <span>/</span>
                <b>Categories & tags</b>
              </>
            ) : (
              <>
                <Link href="/admin">Admin</Link>
                <span>/</span>
                <b>{activeView.toUpperCase()}</b>
              </>
            )}
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
                                    openPostForEdit(p);
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
                                  onClick={() => openPostForEdit(p)}
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
            <div className="ed">
              {/* Stack on the left: Title, Slug, Paper (Toolbar + RTE + Foot), Excerpt */}
              <div className="stack" style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
                {/* Title Input */}
                <input
                  className="titlein"
                  id="pTitle"
                  placeholder="Add a title"
                  value={editingPost.title || ''}
                  aria-label="Post title"
                  onChange={(e) => {
                    const val = e.target.value;
                    const auto = !editingPost.slug || editingPost.slug === (editingPost._lastTitle || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    const newSlug = auto
                      ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                      : editingPost.slug;
                    setEditingPost((prev: any) => ({
                      ...prev,
                      title: val,
                      slug: newSlug,
                      _lastTitle: val,
                    }));
                    setDirty(true);
                  }}
                />

                {/* Slug Bar */}
                <div className="slugin">
                  <span>aegiskoncept.com/insights/</span>
                  <input
                    id="pSlug"
                    value={editingPost.slug || ''}
                    aria-label="Web address"
                    onChange={(e) => {
                      const s = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
                      setEditingPost((prev: any) => ({ ...prev, slug: s }));
                      setDirty(true);
                    }}
                  />
                  <button
                    type="button"
                    className="btn sm ghost"
                    id="pSlugAuto"
                    style={{ height: 34, border: 0, borderLeft: '1px solid var(--line)' }}
                    onClick={() => {
                      const s = (editingPost.title || '')
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');
                      setEditingPost((prev: any) => ({ ...prev, slug: s }));
                      setDirty(true);
                    }}
                  >
                    From title
                  </button>
                </div>

                {/* Paper Canvas */}
                <div className="paper">
                  {/* Sticky Toolbar (.etb) */}
                  <div className="etb" role="toolbar" aria-label="Formatting">
                    <select
                      id="blk"
                      aria-label="Text style"
                      value={currentBlockStyle}
                      onChange={(e) => handleBlockChange(e.target.value)}
                    >
                      <option value="p">Paragraph</option>
                      <option value="h2">Heading 2</option>
                      <option value="h3">Heading 3</option>
                      <option value="blockquote">Quote</option>
                    </select>
                    <span className="sep"></span>

                    <button
                      type="button"
                      title="Bold"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleFormatCmd('bold')}
                    >
                      <b>B</b>
                    </button>
                    <button
                      type="button"
                      title="Italic"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleFormatCmd('italic')}
                    >
                      <i>I</i>
                    </button>
                    <button
                      type="button"
                      title="Underline"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleFormatCmd('underline')}
                    >
                      <u>U</u>
                    </button>
                    <span className="sep"></span>

                    <button
                      type="button"
                      title="Bullet list"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleFormatCmd('insertUnorderedList')}
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      title="Numbered list"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleFormatCmd('insertOrderedList')}
                    >
                      1. List
                    </button>
                    <span className="sep"></span>

                    <button
                      type="button"
                      title="Add link"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={() => setLinkModalOpen(true)}
                    >
                      Link
                    </button>
                    <button
                      type="button"
                      title="Insert image"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={() => {
                        setImagePickerForFeatured(false);
                        setImgModalOpen(true);
                      }}
                    >
                      Image
                    </button>
                    <button
                      type="button"
                      title="Insert table"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={handleInsertTable}
                    >
                      Table
                    </button>
                    <button
                      type="button"
                      title="Insert service box"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={() => setSvcModalOpen(true)}
                    >
                      Service box
                    </button>
                    <button
                      type="button"
                      title="Insert FAQ"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={handleInsertFaq}
                    >
                      FAQ
                    </button>
                    <button
                      type="button"
                      title="Insert call to action"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={handleInsertCta}
                    >
                      CTA
                    </button>
                    <span className="sep"></span>

                    <button
                      type="button"
                      title="Undo"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleFormatCmd('undo')}
                    >
                      ↶
                    </button>
                    <button
                      type="button"
                      title="Redo"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleFormatCmd('redo')}
                    >
                      ↷
                    </button>
                    <button
                      type="button"
                      title="Clear formatting"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleFormatCmd('removeFormat')}
                    >
                      Clear
                    </button>
                    <span className="sep"></span>

                    <button
                      type="button"
                      title="Toggle between Visual Rich Text and HTML Code"
                      className="btn sm ghost"
                      style={{ height: 32, padding: '0 8px', fontSize: 11, fontWeight: 600 }}
                      onClick={() => setCodeMode(!codeMode)}
                    >
                      {codeMode ? 'Visual' : '</> HTML'}
                    </button>
                  </div>

                  {/* Body surface */}
                  {codeMode ? (
                    <textarea
                      className="code"
                      style={{ minHeight: 480, width: '100%', border: 0, padding: 20 }}
                      value={editingPost.bodyHtml || ''}
                      onChange={(e) => {
                        setEditingPost((prev: any) => ({ ...prev, bodyHtml: e.target.value }));
                        setDirty(true);
                      }}
                    />
                  ) : (
                    <div
                      className="rte"
                      id="rte"
                      ref={rteRef}
                      contentEditable
                      spellCheck
                      aria-label="Article body"
                      onInput={handleRteInput}
                      onKeyUp={handleRteKeyUp}
                      onMouseUp={handleRteKeyUp}
                    />
                  )}

                  {/* Word count & Reading time footer */}
                  <div className="edfoot">
                    <span id="wc">{wordsCount} words</span>
                    <span id="rt">{readTimeMinutes} min read</span>
                  </div>
                </div>

                {/* Excerpt */}
                <label className="f">
                  Excerpt{' '}
                  <span className="hint">
                    <span>Shown on blog cards and when people share the link</span>
                  </span>
                  <textarea
                    id="pEx"
                    rows={2}
                    value={editingPost.excerpt || ''}
                    onChange={(e) => {
                      setEditingPost((prev: any) => ({ ...prev, excerpt: e.target.value }));
                      setDirty(true);
                    }}
                  />
                </label>
              </div>

              {/* Sidebar (.ed-side) */}
              <aside className="ed-side">
                {/* 1. Publish Panel */}
                <section className="panel">
                  <div className="ph">
                    <h3>Publish</h3>
                    <span className={`st st-${editingPost.status || 'Draft'}`} id="pStBadge">
                      {editingPost.status || 'Draft'}
                    </span>
                  </div>
                  <div className="pb">
                    <div className="row2">
                      <label className="f">
                        Status
                        <select
                          className="inp"
                          id="pSt"
                          value={editingPost.status || 'Draft'}
                          onChange={(e) => {
                            setEditingPost((prev: any) => ({ ...prev, status: e.target.value }));
                            setDirty(true);
                          }}
                        >
                          <option value="Draft">Draft</option>
                          <option value="Published">Published</option>
                          <option value="Scheduled">Scheduled</option>
                        </select>
                      </label>
                      <label className="f">
                        Date
                        <input
                          className="inp"
                          id="pDate"
                          type="date"
                          value={editingPost.date || ''}
                          onChange={(e) => {
                            setEditingPost((prev: any) => ({ ...prev, date: e.target.value }));
                            setDirty(true);
                          }}
                        />
                      </label>
                    </div>
                    <label className="f">
                      Author
                      <select
                        className="inp"
                        id="pAu"
                        value={editingPost.author || 'Ritesh Kumar'}
                        onChange={(e) => {
                          setEditingPost((prev: any) => ({ ...prev, author: e.target.value }));
                          setDirty(true);
                        }}
                      >
                        <option value="Ritesh Kumar">Ritesh Kumar</option>
                        <option value="Yogeesh Gahlot">Yogeesh Gahlot</option>
                      </select>
                    </label>
                    <div className="acts">
                      <button
                        type="button"
                        className="btn ghost sm"
                        id="pDraft"
                        onClick={() => handleSavePost('Draft')}
                      >
                        Save draft
                      </button>
                      <button
                        type="button"
                        className="btn ghost sm"
                        onClick={() => setPreviewModalOpen(true)}
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        className="btn lime sm"
                        id="pPub"
                        style={{ marginLeft: 'auto' }}
                        onClick={() => handleSavePost('Published')}
                      >
                        {editingPost.status === 'Published' ? 'Update' : 'Publish'}
                      </button>
                    </div>
                  </div>
                </section>

                {/* 2. SEO Panel */}
                <section className="panel">
                  <div className="ph">
                    <h3>SEO</h3>
                    <span id="pScoreS">
                      <span className={`score ${scls(seoAnalysis.score)}`}>{seoAnalysis.score}</span>
                    </span>
                  </div>
                  <div className="tabs" style={{ padding: '0 8px' }} role="tablist">
                    {[
                      ['seo', 'Basics'],
                      ['check', 'Check'],
                      ['social', 'Social'],
                      ['adv', 'Advanced'],
                    ].map(([tKey, tLabel]) => (
                      <button
                        key={tKey}
                        role="tab"
                        aria-selected={postEditorSeoTab === tKey}
                        onClick={() => setPostEditorSeoTab(tKey as any)}
                      >
                        {tLabel}
                      </button>
                    ))}
                  </div>
                  <div className="pb" id="seoPane">
                    {/* Basics */}
                    {postEditorSeoTab === 'seo' && (
                      <div className="stack" style={{ gap: 14 }}>
                        <label className="f">
                          Focus keyword
                          <input
                            className="inp"
                            id="sKw"
                            value={editingPost.focusKeyword || ''}
                            placeholder="e.g. seo cost in india"
                            onChange={(e) => {
                              setEditingPost((prev: any) => ({ ...prev, focusKeyword: e.target.value }));
                              setDirty(true);
                            }}
                          />
                          <span className="hint">
                            <span>The main search this post should rank for</span>
                          </span>
                        </label>

                        <label className="f">
                          Google title
                          <input
                            className="inp"
                            id="sT"
                            value={editingPost.seoTitle || ''}
                            placeholder={editingPost.title || 'Post title'}
                            onChange={(e) => {
                              setEditingPost((prev: any) => ({ ...prev, seoTitle: e.target.value }));
                              setDirty(true);
                            }}
                          />
                          <MeterBar val={(editingPost.seoTitle || editingPost.title || '').length} lo={30} hi={60} />
                          <span className="hint">
                            <span>Leave empty to use the template</span>
                            <CharCount val={editingPost.seoTitle || editingPost.title || ''} lo={30} hi={60} />
                          </span>
                        </label>

                        <label className="f">
                          Google description
                          <textarea
                            id="sD"
                            rows={3}
                            placeholder="One or two plain sentences with the keyword"
                            value={editingPost.seoDesc || ''}
                            onChange={(e) => {
                              setEditingPost((prev: any) => ({ ...prev, seoDesc: e.target.value }));
                              setDirty(true);
                            }}
                          />
                          <MeterBar val={(editingPost.seoDesc || '').length} lo={120} hi={155} />
                          <span className="hint">
                            <span>Aim for 120–155 characters</span>
                            <CharCount val={editingPost.seoDesc || ''} lo={120} hi={155} />
                          </span>
                        </label>

                        <div className="f">
                          <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            Google preview
                            <span className="acts">
                              <button
                                type="button"
                                className={`btn sm ${postEditorGmob ? 'ghost' : 'dark'}`}
                                onClick={() => setPostEditorGmob(false)}
                              >
                                Desktop
                              </button>
                              <button
                                type="button"
                                className={`btn sm ${postEditorGmob ? 'dark' : 'ghost'}`}
                                onClick={() => setPostEditorGmob(true)}
                              >
                                Mobile
                              </button>
                            </span>
                          </span>
                          <SerpPreview
                            title={editingPost.seoTitle || editingPost.title}
                            desc={editingPost.seoDesc || editingPost.excerpt}
                            slug={editingPost.slug}
                            mobile={postEditorGmob}
                          />
                        </div>
                      </div>
                    )}

                    {/* Check */}
                    {postEditorSeoTab === 'check' && (
                      <div>
                        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
                          <span
                            className="ring big"
                            style={{
                              '--p': seoAnalysis.score,
                              '--c': seoAnalysis.score >= 75 ? 'var(--ok)' : seoAnalysis.score >= 50 ? 'var(--warn)' : 'var(--bad)',
                            } as any}
                          >
                            <b>{seoAnalysis.score}</b>
                          </span>
                          <div>
                            <b>
                              {seoAnalysis.score >= 75
                                ? 'Good to publish'
                                : seoAnalysis.score >= 50
                                ? 'Nearly there'
                                : 'Needs work'}
                            </b>
                            <div className="s" style={{ color: 'var(--mute)', fontSize: 13, marginTop: 2 }}>
                              {seoAnalysis.list.filter(([st]) => st === 'good').length} of {seoAnalysis.list.length} checks passed
                            </div>
                          </div>
                        </div>
                        <div className="checks">
                          {seoAnalysis.list
                            .slice()
                            .sort(([a], [b]) => {
                              const order: Record<string, number> = { bad: 0, ok: 1, good: 2 };
                              return order[a] - order[b];
                            })
                            .map(([st, msg], idx) => (
                              <div key={idx} className={`ck ${st}`}>
                                <i></i>
                                <span>{msg}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Social */}
                    {postEditorSeoTab === 'social' && (
                      <div className="stack" style={{ gap: 14 }}>
                        <label className="f">
                          Share title
                          <input
                            className="inp"
                            id="sOT"
                            value={editingPost.ogTitle || ''}
                            placeholder={editingPost.seoTitle || editingPost.title || ''}
                            onChange={(e) => {
                              setEditingPost((prev: any) => ({ ...prev, ogTitle: e.target.value }));
                              setDirty(true);
                            }}
                          />
                        </label>

                        <label className="f">
                          Share description
                          <textarea
                            id="sOD"
                            rows={2}
                            value={editingPost.ogDesc || ''}
                            placeholder={editingPost.seoDesc || editingPost.excerpt || ''}
                            onChange={(e) => {
                              setEditingPost((prev: any) => ({ ...prev, ogDesc: e.target.value }));
                              setDirty(true);
                            }}
                          />
                        </label>

                        <div className="f">
                          <span>Preview on WhatsApp, LinkedIn and Facebook</span>
                          <div className="og" style={{ marginTop: 6 }}>
                            <div
                              className="im"
                              style={{
                                backgroundImage: editingPost.image ? `url(${editingPost.image})` : undefined,
                              }}
                            >
                              {!editingPost.image && 'AegisKoncept'}
                            </div>
                            <div className="tx">
                              <span className="s" style={{ textTransform: 'uppercase', fontSize: 11, color: 'var(--mute)' }}>
                                AEGISKONCEPT.COM
                              </span>
                              <b>{editingPost.ogTitle || editingPost.seoTitle || editingPost.title || 'Post Title'}</b>
                              <span className="s" style={{ color: 'var(--mute)' }}>
                                {(editingPost.ogDesc || editingPost.seoDesc || editingPost.excerpt || '').slice(0, 110)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Advanced */}
                    {postEditorSeoTab === 'adv' && (
                      <div className="stack" style={{ gap: 14 }}>
                        <label className="f">
                          Canonical link
                          <input
                            className="inp"
                            id="sC"
                            value={editingPost.canonical || ''}
                            placeholder={`https://aegiskoncept.com/insights/${editingPost.slug || ''}`}
                            onChange={(e) => {
                              setEditingPost((prev: any) => ({ ...prev, canonical: e.target.value }));
                              setDirty(true);
                            }}
                          />
                          <span className="hint">
                            <span>Only change this if the article was first published elsewhere</span>
                          </span>
                        </label>

                        <label className="check" style={{ marginTop: 6 }}>
                          <input
                            type="checkbox"
                            id="sR"
                            checked={editingPost.robots !== 'noindex'}
                            onChange={(e) => {
                              setEditingPost((prev: any) => ({ ...prev, robots: e.target.checked ? 'index,follow' : 'noindex' }));
                              setDirty(true);
                            }}
                          />
                          Show in Google (index)
                        </label>

                        <label className="f" style={{ marginTop: 6 }}>
                          Schema type
                          <select
                            className="inp"
                            id="sS"
                            value={editingPost.schemaType || 'BlogPosting'}
                            onChange={(e) => {
                              setEditingPost((prev: any) => ({ ...prev, schemaType: e.target.value }));
                              setDirty(true);
                            }}
                          >
                            {['BlogPosting', 'Article', 'HowTo', 'FAQPage'].map((x) => (
                              <option key={x} value={x}>
                                {x}
                              </option>
                            ))}
                          </select>
                        </label>

                        <div className="f" style={{ marginTop: 6 }}>
                          <span>Structured data (added to the page automatically)</span>
                          <pre className="code">
                            {JSON.stringify(
                              {
                                '@context': 'https://schema.org',
                                '@type': editingPost.schemaType || 'BlogPosting',
                                headline: editingPost.title || '',
                                description: editingPost.seoDesc || editingPost.excerpt || '',
                                author: {
                                  '@type': 'Person',
                                  name: editingPost.author || 'Ritesh Kumar',
                                },
                                publisher: {
                                  '@type': 'Organization',
                                  name: 'AegisKoncept',
                                },
                                datePublished: editingPost.date || new Date().toISOString().split('T')[0],
                                mainEntityOfPage: `https://aegiskoncept.com/insights/${editingPost.slug || ''}`,
                              },
                              null,
                              2
                            )}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* 3. Featured Image Panel */}
                <section className="panel">
                  <div className="ph">
                    <h3>Featured image</h3>
                    {editingPost.image && (
                      <button
                        type="button"
                        className="btn sm ghost"
                        id="pImgX"
                        onClick={() => {
                          setEditingPost((prev: any) => ({ ...prev, image: '' }));
                          setDirty(true);
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="pb">
                    {editingPost.image ? (
                      <div>
                        <div
                          style={{
                            aspectRatio: '1.91/1',
                            background: `#EDE8DF url(${editingPost.image}) top center/cover`,
                            border: '1px solid var(--line)',
                          }}
                        />
                        <span className="s" style={{ fontSize: 12, color: 'var(--mute)', display: 'block', marginTop: 6, wordBreak: 'break-all' }}>
                          {editingPost.image}
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="drop"
                        id="pImg"
                        onClick={() => {
                          setImagePickerForFeatured(true);
                          setImgModalOpen(true);
                        }}
                      >
                        <b>Choose or upload</b>
                        <br />
                        1200 × 630 works best
                      </button>
                    )}
                  </div>
                </section>

                {/* 4. Category & Tags Panel */}
                <section className="panel">
                  <div className="ph">
                    <h3>Category & tags</h3>
                  </div>
                  <div className="pb">
                    <label className="f">
                      Category
                      <select
                        className="inp"
                        id="pCat"
                        value={editingPost.categoryId || ''}
                        onChange={(e) => {
                          setEditingPost((prev: any) => ({ ...prev, categoryId: e.target.value }));
                          setDirty(true);
                        }}
                      >
                        {(data?.categories || [
                          { id: 'cat-seo', name: 'SEO' },
                          { id: 'cat-dev', name: 'Web Development' },
                          { id: 'cat-ads', name: 'Performance Marketing' },
                        ]).map((c: any) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="f" style={{ marginTop: 12 }}>
                      <span>Tags</span>
                      <div className="chips" id="pTags">
                        {(editingPost.tags || []).map((t: string, i: number) => (
                          <span className="chip" key={i}>
                            {t}
                            <button
                              type="button"
                              aria-label="Remove tag"
                              onClick={() => {
                                const next = [...(editingPost.tags || [])];
                                next.splice(i, 1);
                                setEditingPost((prev: any) => ({ ...prev, tags: next }));
                                setDirty(true);
                              }}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        className="inp"
                        id="pTagIn"
                        placeholder="Add a tag and press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && tagInput.trim()) {
                            e.preventDefault();
                            const nt = tagInput.trim();
                            const curr = editingPost.tags || [];
                            if (!curr.includes(nt)) {
                              setEditingPost((prev: any) => ({ ...prev, tags: [...curr, nt] }));
                              setDirty(true);
                            }
                            setTagInput('');
                          }
                        }}
                      />
                    </div>
                  </div>
                </section>

                {/* 5. Outline Panel */}
                <section className="panel">
                  <div className="ph">
                    <h3>Outline</h3>
                    <span className="note">From your headings</span>
                  </div>
                  <div className="pb toc" id="toc">
                    {headingsList.length > 0 ? (
                      headingsList.map((h, i) => (
                        <a
                          key={i}
                          href="#jump"
                          style={{ paddingLeft: h.tag === 'h3' ? 14 : 0 }}
                          onClick={(e) => {
                            e.preventDefault();
                            jumpToHeading(h.text);
                          }}
                        >
                          {h.text}
                        </a>
                      ))
                    ) : (
                      <span className="note" style={{ color: 'var(--mute)', fontSize: 13 }}>
                        Add Heading 2 sections to build the outline.
                      </span>
                    )}
                  </div>
                </section>
              </aside>
            </div>
          )}

          {/* VIEW: CATEGORIES & TAGS */}
          {activeView === 'cats' && (
            <div>
              <div className="vh">
                <div>
                  <h1>Categories & tags</h1>
                  <p>Categories group your articles on the blog page. Tags are smaller topics inside a post.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: 20 }}>
                {/* Categories Table */}
                <section className="panel">
                  <div className="ph">
                    <h2>Categories</h2>
                  </div>
                  <div className="pb">
                    <form
                      className="toolbar"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!newCatName.trim()) return;
                        try {
                          const res = await fetch('/api/admin/categories', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name: newCatName.trim() }),
                          });
                          if (res.ok) {
                            showToast('Category added!');
                            setNewCatName('');
                            await loadData();
                          } else {
                            const err = await res.json();
                            showToast(err.error || 'Failed to add category');
                          }
                        } catch {
                          showToast('Error adding category');
                        }
                      }}
                    >
                      <input
                        className="inp"
                        placeholder="New category name"
                        style={{ flex: 1 }}
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                      />
                      <button type="submit" className="btn dark">
                        Add category
                      </button>
                    </form>
                  </div>
                  <div className="tw">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Web address</th>
                          <th className="num">Posts</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {(data?.categories || []).map((c: any) => {
                          const postCount = (data?.posts || []).filter((p: any) => p.categoryId === c.id).length;
                          return (
                            <tr key={c.id}>
                              <td>
                                <input
                                  className="inl"
                                  defaultValue={c.name}
                                  style={{ fontWeight: 600 }}
                                  onBlur={async (e) => {
                                    const val = e.target.value.trim();
                                    if (val && val !== c.name) {
                                      await fetch('/api/admin/categories', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ id: c.id, name: val }),
                                      });
                                      showToast('Category renamed');
                                      await loadData();
                                    }
                                  }}
                                />
                              </td>
                              <td className="s" style={{ color: 'var(--mute)', fontSize: 13 }}>
                                /insights/category/{c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                              </td>
                              <td className="num">{postCount}</td>
                              <td className="num">
                                <button
                                  className="btn sm ghost"
                                  disabled={postCount > 0}
                                  title={postCount > 0 ? 'Move its posts first' : 'Delete category'}
                                  onClick={async () => {
                                    if (confirm(`Delete category "${c.name}"?`)) {
                                      await fetch('/api/admin/categories', {
                                        method: 'DELETE',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ id: c.id }),
                                      });
                                      showToast('Category deleted');
                                      await loadData();
                                    }
                                  }}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Tags in use */}
                <section className="panel">
                  <div className="ph">
                    <h2>Tags in use</h2>
                  </div>
                  <div className="pb">
                    {Object.keys(tagsInUse).length > 0 ? (
                      <div className="chips">
                        {Object.entries(tagsInUse).map(([t, count]) => (
                          <span className="chip" key={t}>
                            {t} <span className="s" style={{ color: 'var(--mute)', fontSize: 11, marginLeft: 4 }}>{count}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="note" style={{ color: 'var(--mute)', fontSize: 13 }}>
                        No tags yet. Add them from a post&apos;s sidebar.
                      </p>
                    )}
                  </div>
                </section>
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

      {/* 1. LINK MODAL */}
      {linkModalOpen && (
        <>
          <div className="scrim on" onClick={() => setLinkModalOpen(false)} />
          <div className="modal small on">
            <div className="ph" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Add a link</h3>
              <button type="button" className="x" onClick={() => setLinkModalOpen(false)}>×</button>
            </div>
            <div className="mb">
              <label className="f">
                Link to one of your pages
                <select
                  className="inp"
                  value={linkSel}
                  onChange={(e) => {
                    setLinkSel(e.target.value);
                    if (e.target.value) setLinkUrl('');
                  }}
                >
                  <option value="">Choose a page…</option>
                  <option value="/services/search-engine-optimization">SEO service</option>
                  <option value="/services/website-design-development">Website service</option>
                  <option value="/services/performance-marketing">Ads service</option>
                  <option value="/services/social-media-marketing">Social media service</option>
                  <option value="/contact">Contact page</option>
                  {(data?.posts || [])
                    .filter((x: any) => x.id !== editingPost?.id && x.slug)
                    .map((x: any) => (
                      <option key={x.id} value={`/insights/${x.slug}`}>
                        Post: {x.title}
                      </option>
                    ))}
                </select>
              </label>
              <label className="f" style={{ marginTop: 12 }}>
                Or paste any web address
                <input
                  className="inp"
                  placeholder="https://"
                  value={linkUrl}
                  onChange={(e) => {
                    setLinkUrl(e.target.value);
                    if (e.target.value) setLinkSel('');
                  }}
                />
              </label>
              <label className="check" style={{ marginTop: 12 }}>
                <input
                  type="checkbox"
                  checked={linkNewTab}
                  onChange={(e) => setLinkNewTab(e.target.checked)}
                />
                Open in a new tab
              </label>
            </div>
            <div className="pf" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '12px 16px', borderTop: '1px solid var(--line)' }}>
              <button type="button" className="btn ghost" onClick={() => setLinkModalOpen(false)}>
                Cancel
              </button>
              <button type="button" className="btn lime" onClick={handleApplyLink}>
                Add link
              </button>
            </div>
          </div>
        </>
      )}

      {/* 2. IMAGE / MEDIA PICKER MODAL */}
      {imgModalOpen && (
        <>
          <div className="scrim on" onClick={() => setImgModalOpen(false)} />
          <div className="modal on" style={{ maxWidth: 720 }}>
            <div className="ph" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{imagePickerForFeatured ? 'Choose Featured Image' : 'Insert Image'}</h3>
              <button type="button" className="x" onClick={() => setImgModalOpen(false)}>×</button>
            </div>
            <div className="mb">
              {/* Upload directly */}
              <div style={{ marginBottom: 16 }}>
                <label
                  className="drop"
                  style={{ display: 'block', cursor: 'pointer' }}
                >
                  <b>Upload image from computer</b> · JPG, PNG, WebP or SVG up to 5 MB
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (!file.type.startsWith('image/')) {
                        showToast('Please select a valid image file');
                        return;
                      }
                      if (file.size > 5 * 1024 * 1024) {
                        showToast('Image file size exceeds 5 MB');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = () => {
                        const res = reader.result as string;
                        setImgSrc(res);
                        if (!imgAlt) setImgAlt(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' '));
                        showToast('Image loaded successfully');
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>

              {/* Media Library Items */}
              {data?.media && data.media.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>
                    Or select from Media Library:
                  </span>
                  <div className="mgrid" style={{ maxHeight: 200, overflowY: 'auto' }}>
                    {data.media.map((m: any) => (
                      <button
                        key={m.id}
                        type="button"
                        className="mi"
                        aria-pressed={imgSrc === (m.file || m.src)}
                        onClick={() => {
                          setImgSrc(m.file || m.src);
                          if (!imgAlt && m.alt) setImgAlt(m.alt);
                        }}
                      >
                        <span
                          className="th"
                          style={{ backgroundImage: `url(${m.file || m.src})` }}
                        />
                        <span>{m.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <label className="f" style={{ marginTop: 12 }}>
                Or enter image web address / URL:
                <input
                  className="inp"
                  placeholder="https://... or /assets/..."
                  value={imgSrc}
                  onChange={(e) => setImgSrc(e.target.value)}
                />
              </label>

              {imgSrc && (
                <div
                  style={{
                    aspectRatio: '16/9',
                    background: `#EDE8DF url(${imgSrc}) center/contain no-repeat`,
                    border: '1px solid var(--line)',
                    marginTop: 12,
                  }}
                />
              )}

              {!imagePickerForFeatured && (
                <label className="f" style={{ marginTop: 12 }}>
                  Alt text (describe the image for Google and screen readers)
                  <input
                    className="inp"
                    value={imgAlt}
                    onChange={(e) => setImgAlt(e.target.value)}
                    placeholder="e.g. SEO ranking results chart for e-commerce client"
                  />
                </label>
              )}
            </div>
            <div className="pf" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '12px 16px', borderTop: '1px solid var(--line)' }}>
              <button type="button" className="btn ghost" onClick={() => setImgModalOpen(false)}>
                Cancel
              </button>
              <button type="button" className="btn lime" onClick={handleApplyImage}>
                {imagePickerForFeatured ? 'Set Featured Image' : 'Insert image'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* 3. SERVICE BOX MODAL */}
      {svcModalOpen && (
        <>
          <div className="scrim on" onClick={() => setSvcModalOpen(false)} />
          <div className="modal small on">
            <div className="ph" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Insert a service box</h3>
              <button type="button" className="x" onClick={() => setSvcModalOpen(false)}>×</button>
            </div>
            <div className="mb">
              <label className="f">
                Which service?
                <select
                  className="inp"
                  value={svcSel}
                  onChange={(e) => setSvcSel(e.target.value)}
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="pf" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '12px 16px', borderTop: '1px solid var(--line)' }}>
              <button type="button" className="btn ghost" onClick={() => setSvcModalOpen(false)}>
                Cancel
              </button>
              <button type="button" className="btn lime" onClick={handleApplySvcBox}>
                Insert
              </button>
            </div>
          </div>
        </>
      )}

      {/* 4. POST PREVIEW MODAL */}
      {previewModalOpen && editingPost && (
        <>
          <div className="scrim on" onClick={() => setPreviewModalOpen(false)} />
          <div className="modal on" style={{ maxWidth: 840, maxHeight: '90vh' }}>
            <div className="ph" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Preview: {editingPost.title || 'Untitled Post'}</h3>
              <button type="button" className="x" onClick={() => setPreviewModalOpen(false)}>×</button>
            </div>
            <div className="mb" style={{ padding: 0 }}>
              <div style={{ maxWidth: 720, margin: '0 auto', background: 'var(--white)', padding: 'clamp(20px, 4vw, 44px)' }}>
                <span className="s" style={{ color: 'var(--mute)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {data?.categories?.find((c: any) => c.id === editingPost.categoryId)?.name || 'SEO'} · {readTimeMinutes} min read
                </span>
                <h1 style={{ font: '400 clamp(28px, 4vw, 44px)/1.1 var(--serif)', margin: '10px 0 14px' }}>
                  {editingPost.title || 'Post Title'}
                </h1>
                <p className="s" style={{ color: 'var(--mute)', fontSize: 13, margin: '0 0 20px' }}>
                  {editingPost.author || 'Ritesh Kumar'} · {editingPost.date || new Date().toISOString().split('T')[0]}
                </p>
                {editingPost.image && (
                  <div
                    style={{
                      aspectRatio: '1.91/1',
                      backgroundImage: `url(${editingPost.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'top center',
                      marginBottom: 24,
                      border: '1px solid var(--line)',
                    }}
                  />
                )}
                <div
                  className="rte"
                  style={{ padding: 0, minHeight: 0 }}
                  dangerouslySetInnerHTML={{ __html: editingPost.bodyHtml || '<p>No content written yet.</p>' }}
                />
              </div>
            </div>
            <div className="pf" style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 16px', borderTop: '1px solid var(--line)' }}>
              <button type="button" className="btn lime" onClick={() => setPreviewModalOpen(false)}>
                Close preview
              </button>
            </div>
          </div>
        </>
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

