import content from '@/design-reference/content.json';

export const FALLBACK_INDUSTRIES = content.INDS.map((i: any) => i.id);

export const FALLBACK_SERVICES = [
  'website-development-design',
  'seo',
  'performance-marketing',
  'social-media-marketing-management',
  'video-production',
];

export const FALLBACK_LOCATIONS = content.LOCS.map((l: any) => l.id);

export const FALLBACK_CASES = content.CASES.map((c: any) => c.id);

export const FALLBACK_INSIGHTS = content.ARTS.map((a: any) => a[0]);

export function getFallbackIndustry(slug: string) {
  const item = content.INDS.find((i: any) => i.id === slug);
  if (!item) return null;
  return {
    id: item.id,
    slug: item.id,
    name: item.name,
    short: item.short || item.name,
    h1: item.h1,
    sub: item.sub,
    visualKind: (item.vis || 'site') as string,
    issues: JSON.stringify(item.issues || []),
    startTitle: 'Where We Would Start',
    startDesc: `A structured plan to capture demand in the ${item.name} sector.`,
    startSteps: JSON.stringify([
      ['Fix the foundation', 'Speed, mobile responsiveness and clear conversion pathways.'],
      ['Search demand capture', 'Target high-intent keywords and local search terms.'],
      ['Paid amplification', 'Run hyper-targeted campaigns with verified creative assets.'],
    ]),
    plan90: JSON.stringify([
      ['Days 1–30', 'Complete audit, technical fixes and tracking setup.'],
      ['Days 31–60', 'Launch SEO optimizations and active campaigns.'],
      ['Days 61–90', 'Scale winning channels and optimize conversion rates.'],
    ]),
    faqs: JSON.stringify(item.faqs || []),
  };
}

export function getFallbackService(slug: string) {
  const item = content.SVC.find((s: any) => s.id === slug);
  if (!item) return null;
  const s = item as any;
  return {
    id: s.id,
    slug: s.id,
    name: s.name,
    nav: s.nav || s.name,
    short: s.short || s.name,
    line: s.line,
    h1: Array.isArray(s.h1) ? s.h1.join(' ') : String(s.h1 || s.name),
    sub: s.sub,
    positioning: s.pos || s.sub,
    problems: JSON.stringify(s.probs || []),
    fixes: JSON.stringify(s.fixes || []),
    subServices: JSON.stringify(s.subs || []),
    included: JSON.stringify(s.inc || []),
    signature: JSON.stringify({ title: s.sig_t || '', items: s.sig || [] }),
    who: JSON.stringify(s.who || []),
    process: JSON.stringify(s.proc || []),
    deliverables: JSON.stringify(s.deliv || []),
    tools: JSON.stringify(s.tools || []),
    proof: JSON.stringify(s.proof || s.pf || s.stats || []),
    faqs: JSON.stringify(s.faqs || []),
    visualKind: s.vis || 'site',
  };
}

export function getFallbackLocation(slug: string) {
  const item = content.LOCS.find((l: any) => l.id === slug);
  if (!item) return null;
  return {
    id: item.id,
    slug: item.id,
    name: item.name,
    zone: item.zone || 'Delhi NCR',
    h1: item.h1,
    sub: item.sub,
    description: item.land || item.sub,
    businessTypes: JSON.stringify(item.biz || []),
    challenges: JSON.stringify(item.chal || []),
    searchTerms: JSON.stringify(item.searches || []),
    isOffice: Boolean(item.office),
    nearby: JSON.stringify(item.near || []),
    nearbyIds: JSON.stringify(item.near || []),
    featuredCaseId: item.case || null,
  };
}

export function getFallbackCase(slug: string) {
  const item = content.CASES.find((c: any) => c.id === slug);
  if (!item) return null;
  const c = item as any;
  const ownerInfo = (content as any).OWNERS && (content as any).OWNERS[c.id] ? (content as any).OWNERS[c.id] : (c.owner || [null, null]);
  return {
    id: c.id,
    slug: c.id,
    client: c.client,
    industryId: c.ind || null,
    location: c.loc || null,
    services: JSON.stringify(c.svcs || []),
    oneLine: c.one || '',
    challenge: c.ch || '',
    approach: c.ap || '',
    did: JSON.stringify(c.did || []),
    liveUrl: c.url || null,
    ownerName: ownerInfo[0] || null,
    ownerRole: ownerInfo[1] || null,
    results: JSON.stringify(c.res || []),
    coverMediaId: c.cover || null,
    logoMediaId: c.logo || null,
    shots: JSON.stringify(c.shots || []),
    reviews: [],
  };
}

export function getFallbackPost(slug: string) {
  const art = content.ARTS.find((a: any) => a[0] === slug);
  if (!art) {
    return {
      id: slug,
      slug,
      title: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      excerpt: 'Practical guide to digital marketing, SEO, and business growth.',
      bodyHtml: '<p>A comprehensive walkthrough explaining step-by-step methodologies, cost factors, and execution strategies.</p>',
      readMinutes: 5,
      publishAt: new Date(),
      updatedAt: new Date(),
      category: { name: 'Digital Marketing' },
      authorName: 'Ritesh Kumar',
      authorRole: 'Founder & Head of Strategy',
      focusKeyword: slug.replace(/-/g, ' '),
      faqs: '[]',
      headings: '[]',
    };
  }
  return {
    id: art[0],
    slug: art[0],
    title: art[1],
    excerpt: `A practical, in-depth guide on ${art[1]} for Indian business owners and marketing leaders.`,
    bodyHtml: `<p>A comprehensive walkthrough of ${art[1]}, explaining step-by-step methodologies, cost factors, and execution strategies.</p><p>We break down everything you need to know to make confident decisions for your business.</p>`,
    readMinutes: parseInt(art[3]) || 7,
    publishAt: new Date(),
    updatedAt: new Date(),
    category: { name: art[2] || 'Digital Marketing' },
    authorName: 'Ritesh Kumar',
    authorRole: 'Founder & Head of Strategy',
    focusKeyword: art[5] || art[1],
    faqs: JSON.stringify([
      { q: `What is the key takeaway regarding ${art[1]}?`, a: `Having a clear strategy, measurable goals, and transparent execution yields the highest ROI.` }
    ]),
    headings: JSON.stringify([
      { id: 'overview', text: 'Overview', level: 2 },
      { id: 'strategy', text: 'Strategy and Execution', level: 2 },
    ]),
  };
}


