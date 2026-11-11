const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Seed ---');

  const contentRaw = fs.readFileSync(path.join(__dirname, '../design-reference/content.json'), 'utf8');
  const content = JSON.parse(contentRaw);

  // 1. Clear existing records to ensure clean state
  await prisma.review.deleteMany();
  await prisma.caseStudy.deleteMany();
  await prisma.service.deleteMany();
  await prisma.industry.deleteMany();
  await prisma.location.deleteMany();
  await prisma.video.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.page.deleteMany();
  await prisma.media.deleteMany();
  await prisma.redirect.deleteMany();
  await prisma.sitemapEntry.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.integration.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing tables.');

  // 2. Admin User
  const passwordHash = await bcrypt.hash('AegisAdmin2026!', 10);
  await prisma.user.create({
    data: {
      name: 'Ritesh Kumar',
      email: 'admin@aegiskoncept.com',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log('Created Admin user: admin@aegiskoncept.com');

  // 3. Media Items (Client Logos & SEO Screenshots)
  const logoDir = path.join(__dirname, '../public/assets/client-logos');
  if (fs.existsSync(logoDir)) {
    const logoFiles = fs.readdirSync(logoDir);
    for (const file of logoFiles) {
      const id = path.basename(file, path.extname(file));
      const clientName = content.LOGOS && content.LOGOS[id] ? content.LOGOS[id] : id;
      await prisma.media.create({
        data: {
          file: `/assets/client-logos/${file}`,
          name: clientName,
          alt: `${clientName} logo`,
          folder: 'Client logos',
          mime: 'image/png',
        },
      });
    }
  }

  const shotDir = path.join(__dirname, '../public/assets/seo-screenshots');
  if (fs.existsSync(shotDir)) {
    const shotFiles = fs.readdirSync(shotDir);
    for (const file of shotFiles) {
      const shotId = path.basename(file, path.extname(file));
      await prisma.media.create({
        data: {
          file: `/assets/seo-screenshots/${file}`,
          name: `SEO Proof ${shotId}`,
          alt: `Google Search ranking proof ${shotId}`,
          folder: 'Screenshots',
          mime: 'image/jpeg',
        },
      });
    }
  }
  console.log('Seeded Media files.');

  // 4. Services
  for (let i = 0; i < content.SVC.length; i++) {
    const s = content.SVC[i];
    await prisma.service.create({
      data: {
        slug: s.id,
        name: s.name,
        nav: s.nav || s.name,
        short: s.short || s.name,
        line: s.line,
        h1: s.h1,
        sub: s.sub,
        positioning: s.pos,
        problems: JSON.stringify(s.probs || []),
        fixes: JSON.stringify(s.fixes || []),
        subServices: JSON.stringify(s.subs || []),
        included: JSON.stringify(s.inc || []),
        signature: JSON.stringify({ title: s.sig_t || '', items: s.sig || [] }),
        who: JSON.stringify(s.who || []),
        process: JSON.stringify(s.proc || []),
        deliverables: JSON.stringify(s.deliv || []),
        tools: JSON.stringify(s.tools || []),
        proof: JSON.stringify(s.proof || s.pf || []),
        faqs: JSON.stringify(s.faqs || []),
        visualKind: s.vis || null,
        order: i,
        seoTitle: `${s.name} in Delhi NCR | AegisKoncept`,
        seoDesc: s.sub,
      },
    });
  }
  console.log(`Seeded ${content.SVC.length} Services.`);

  // 5. Case Studies
  const caseMap = {};
  for (let i = 0; i < content.CASES.length; i++) {
    const c = content.CASES[i];
    const ownerInfo = content.OWNERS && content.OWNERS[c.id] ? content.OWNERS[c.id] : (c.owner || [null, null]);
    const createdCase = await prisma.caseStudy.create({
      data: {
        slug: c.id,
        client: c.client,
        industryId: c.ind || null,
        location: c.loc || null,
        services: JSON.stringify(c.svcs || []),
        oneLine: c.one,
        challenge: c.ch,
        approach: c.ap,
        did: JSON.stringify(c.did || []),
        extra: c.extra || null,
        liveUrl: c.url || null,
        logoMediaId: c.logo || null,
        coverMediaId: c.cover || null,
        shots: JSON.stringify(c.shots || []),
        visualKind: c.cover || null,
        ownerName: ownerInfo[0],
        ownerRole: ownerInfo[1],
        results: JSON.stringify(c.res || []),
        order: i,
        published: true,
        seoTitle: `${c.client} Case Study | AegisKoncept`,
        seoDesc: c.one,
      },
    });
    caseMap[c.id] = createdCase.id;
  }
  console.log(`Seeded ${content.CASES.length} Case Studies.`);

  // 6. Reviews (STRICT HONESTY RULE: ALL DRAFT)
  let reviewCount = 0;
  if (content.REVIEWS) {
    for (const [caseSlug, reviewText] of Object.entries(content.REVIEWS)) {
      const ownerInfo = content.OWNERS && content.OWNERS[caseSlug] ? content.OWNERS[caseSlug] : ['Client Owner', 'Owner'];
      await prisma.review.create({
        data: {
          caseId: caseMap[caseSlug] || null,
          authorName: ownerInfo[0],
          authorRole: ownerInfo[1],
          text: reviewText,
          status: 'DRAFT', // STRICT HONESTY RULE: ALL 12 DRAFT
          sourceNote: 'Drafted by agency, pending client approval',
        },
      });
      reviewCount++;
    }
  }
  console.log(`Seeded ${reviewCount} Reviews (all in DRAFT status).`);

  // 7. Industries
  for (let i = 0; i < content.INDS.length; i++) {
    const ind = content.INDS[i];
    await prisma.industry.create({
      data: {
        slug: ind.id,
        name: ind.name,
        short: ind.short || ind.name,
        h1: ind.h1,
        sub: ind.sub,
        issues: JSON.stringify(ind.issues || []),
        faqs: JSON.stringify(ind.faqs || []),
        visualKind: ind.vis || null,
        order: i,
        seoTitle: `Digital Marketing for ${ind.name} | AegisKoncept`,
        seoDesc: ind.sub,
      },
    });
  }
  console.log(`Seeded ${content.INDS.length} Industries.`);

  // 8. Locations
  for (let i = 0; i < content.LOCS.length; i++) {
    const loc = content.LOCS[i];
    const parentSlug = Array.isArray(loc.parent) ? loc.parent[1] : (loc.parent || null);
    await prisma.location.create({
      data: {
        slug: loc.id,
        name: loc.name,
        zone: loc.zone || null,
        parentId: parentSlug,
        isOffice: !!loc.office,
        h1: loc.h1,
        sub: loc.sub,
        land: loc.land || null,
        businesses: JSON.stringify(loc.biz || []),
        challenges: JSON.stringify(loc.chal || []),
        searches: JSON.stringify(loc.searches || []),
        nearbyIds: JSON.stringify(loc.near || []),
        featuredCaseId: loc.case || null,
        inFooter: true,
        status: 'PUBLISHED',
        order: i,
        seoTitle: `Digital Marketing Agency in ${loc.name} | AegisKoncept`,
        seoDesc: loc.sub,
      },
    });
  }
  console.log(`Seeded ${content.LOCS.length} Locations.`);

  // 9. Videos
  for (let i = 0; i < content.VIDEOS.length; i++) {
    const v = content.VIDEOS[i];
    await prisma.video.create({
      data: {
        vimeoId: v[0],
        title: v[1],
        label: v[2] || null,
        client: v[3] || null,
        category: v[4] || null,
        posterMediaId: v[5] || null,
        showOnHome: i < 3,
        showOnVideos: true,
        order: i,
      },
    });
  }
  console.log(`Seeded ${content.VIDEOS.length} Videos.`);

  // 10. Categories & Blog Posts
  const catNames = [...new Set(content.ARTS.map((a) => a[2]))];
  const catMap = {};
  for (const name of catNames) {
    const catSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const cat = await prisma.category.create({
      data: {
        name,
        slug: catSlug,
      },
    });
    catMap[name] = cat.id;
  }

  let articleHtml = '';
  const articleHtmlPath = path.join(__dirname, '../scripts/article-seo-cost-india.html');
  if (fs.existsSync(articleHtmlPath)) {
    articleHtml = fs.readFileSync(articleHtmlPath, 'utf8');
  }

  for (let i = 0; i < content.ARTS.length; i++) {
    const a = content.ARTS[i];
    const isSeoCost = a[0] === 'seo-cost-india';
    await prisma.post.create({
      data: {
        slug: a[0],
        title: a[1],
        categoryId: catMap[a[2]] || null,
        readMinutes: parseInt(a[3]) || 5,
        publishAt: new Date(a[4] || '2026-11-10'),
        excerpt: a[5] || a[1],
        bodyHtml: isSeoCost ? articleHtml : `<p>${a[1]} - Full article coming soon.</p>`,
        status: isSeoCost ? 'PUBLISHED' : 'DRAFT',
        focusKeyword: a[5] || a[1],
        seoTitle: `${a[1]} | AegisKoncept Insights`,
        seoDescription: a[5] || a[1],
        schemaType: 'BlogPosting',
      },
    });
  }
  console.log(`Seeded ${content.ARTS.length} Blog Posts.`);

  // 11. Core Pages
  const corePages = [
    { path: '/', title: 'Home', type: 'Core', inMenu: true, inFooter: false },
    { path: '/about', title: 'About Us', type: 'Core', inMenu: true, inFooter: true },
    { path: '/services', title: 'Services', type: 'Service', inMenu: true, inFooter: true },
    { path: '/our-work', title: 'Our Work', type: 'Case study', inMenu: true, inFooter: true },
    { path: '/videos', title: 'Videos', type: 'Core', inMenu: true, inFooter: true },
    { path: '/industries', title: 'Industries', type: 'Industry', inMenu: true, inFooter: true },
    { path: '/locations', title: 'Locations', type: 'Location', inMenu: false, inFooter: true },
    { path: '/insights', title: 'Blog', type: 'Blog', inMenu: true, inFooter: true },
    { path: '/contact', title: 'Contact', type: 'Core', inMenu: true, inFooter: true },
    { path: '/thank-you', title: 'Thank You', type: 'Utility', inMenu: false, inFooter: false, robots: 'noindex,nofollow' },
    { path: '/privacy-policy', title: 'Privacy Policy', type: 'Utility', inMenu: false, inFooter: true },
    { path: '/terms-and-conditions', title: 'Terms & Conditions', type: 'Utility', inMenu: false, inFooter: true },
    { path: '/cookie-policy', title: 'Cookie Policy', type: 'Utility', inMenu: false, inFooter: true },
    { path: '/all-pages', title: 'All Pages', type: 'Utility', inMenu: false, inFooter: true },
  ];

  for (const page of corePages) {
    await prisma.page.create({
      data: {
        path: page.path,
        title: page.title,
        type: page.type,
        inMenu: page.inMenu,
        inFooter: page.inFooter,
        robots: page.robots || 'index,follow',
        status: 'PUBLISHED',
      },
    });
  }
  console.log(`Seeded ${corePages.length} Core Pages.`);

  // 12. Settings
  const defaultSettings = [
    { key: 'title_template', value: JSON.stringify('%title% | AegisKoncept') },
    { key: 'home_title', value: JSON.stringify('AegisKoncept | Websites, SEO, Ads & Social Media in Delhi') },
    { key: 'default_description', value: JSON.stringify('AegisKoncept: websites, SEO, ads and social media for growing Indian businesses. Based in Dwarka, New Delhi.') },
    { key: 'default_og_image', value: JSON.stringify('/assets/og-image.jpg') },
    {
      key: 'business_schema',
      value: JSON.stringify({
        type: 'MarketingAgency',
        name: 'AegisKoncept',
        phone: '+91 73034 68073',
        email: 'hello@aegiskoncept.com',
        address: {
          street: 'Sector 7, Ramphal Chowk, Dwarka',
          city: 'New Delhi',
          region: 'Delhi',
          postalCode: '110075',
          country: 'IN',
        },
        founders: [
          { name: 'Ritesh Kumar', jobTitle: 'Founder' },
          { name: 'Yogeesh Gahlot', jobTitle: 'Founder' },
        ],
        areaServed: ['Delhi NCR', 'Gurugram', 'Noida', 'Dwarka', 'Janakpuri'],
        sameAs: [
          'https://www.linkedin.com/company/aegiskoncept',
          'https://www.instagram.com/aegiskoncept',
        ],
      }),
    },
    {
      key: 'verification_codes',
      value: JSON.stringify({
        google: '',
        bing: '',
        meta: '',
      }),
    },
    {
      key: 'robots_txt',
      value: JSON.stringify('User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: https://aegiskoncept.com/sitemap.xml'),
    },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.create({
      data: {
        key: setting.key,
        value: setting.value,
      },
    });
  }
  console.log('Seeded Default Settings.');

  // 13. Integrations (12 tools)
  const defaultIntegrations = [
    'gsc', 'ga4', 'gtm', 'ads', 'gbp', 'recaptcha',
    'looker', 'pixel', 'bing', 'clarity', 'indexnow', 'whatsapp'
  ];

  for (const key of defaultIntegrations) {
    await prisma.integration.create({
      data: {
        key,
        connected: key === 'whatsapp', // WhatsApp enabled by default
        config: JSON.stringify(key === 'whatsapp' ? { phone: '917303468073', message: 'Hi AegisKoncept, I would like to enquire about your services.' } : {}),
      },
    });
  }
  console.log('Seeded 12 Integrations.');

  console.log('--- Seed Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
