export interface SeoAnalysisResult {
  score: number;
  list: Array<[status: 'good' | 'ok' | 'bad', message: string]>;
}

export function analysePost(post: {
  title?: string;
  slug?: string;
  focusKeyword?: string;
  seoTitle?: string;
  seoDesc?: string;
  bodyHtml?: string;
  image?: string;
}): SeoAnalysisResult {
  const kw = (post.focusKeyword || '').trim().toLowerCase();
  const out: Array<['good' | 'ok' | 'bad', string]> = [];
  const T = post.seoTitle || post.title || '';
  const D = post.seoDesc || '';
  const body = post.bodyHtml || '';
  const plain = body.replace(/<[^>]+>/g, ' ').toLowerCase();
  const wc = body.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;

  function add(st: 'good' | 'ok' | 'bad', msg: string) {
    out.push([st, msg]);
  }

  if (!kw) {
    add('bad', 'Set a focus keyword: the main search you want this post to rank for.');
  } else {
    add(
      T.toLowerCase().includes(kw) ? 'good' : 'bad',
      `Focus keyword ${T.toLowerCase().includes(kw) ? 'is' : 'is not'} in the Google title.`
    );
    add(
      D.toLowerCase().includes(kw) ? 'good' : 'bad',
      `Focus keyword ${D.toLowerCase().includes(kw) ? 'is' : 'is not'} in the Google description.`
    );

    const sk = kw.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = (post.slug || '').toLowerCase();
    const hasSlug =
      slug.includes(sk) ||
      sk
        .split('-')
        .filter((w) => w.length > 2 && slug.includes(w)).length >= 2;
    add(
      hasSlug ? 'good' : 'ok',
      `Web address (slug) ${hasSlug ? 'contains the keyword.' : 'should include the main words of the keyword.'}`
    );

    // First paragraph check
    const firstP = body.match(/<p[^>]*>(.*?)<\/p>/i);
    const fpText = firstP ? firstP[1].replace(/<[^>]+>/g, '').toLowerCase() : '';
    add(
      fpText.includes(kw) ? 'good' : 'ok',
      `Keyword ${fpText.includes(kw) ? 'appears' : 'should appear'} in the first paragraph.`
    );

    // Subheading check
    const headings = body.match(/<h[23][^>]*>(.*?)<\/h[23]>/gi) || [];
    const kwFirst = kw.split(' ')[0];
    const hasHead = headings.some((h) => h.toLowerCase().includes(kwFirst));
    add(
      hasHead ? 'good' : 'ok',
      'Use the keyword (or part of it) in at least one subheading.'
    );

    // Density
    const occ = plain.split(kw).length - 1;
    const den = wc ? (occ * kw.split(' ').length) / wc * 100 : 0;
    add(
      den >= 0.4 && den <= 2.5 ? 'good' : occ === 0 ? 'bad' : 'ok',
      `Keyword used ${occ} time${occ === 1 ? '' : 's'} (${den.toFixed(1)}% of words). Aim for 0.5–2.5%.`
    );
  }

  // Title length
  add(
    T.length >= 30 && T.length <= 60 ? 'good' : 'bad',
    `Google title is ${T.length} characters. Aim for 30–60.`
  );

  // Description length
  add(
    D.length >= 120 && D.length <= 155 ? 'good' : D.length ? 'ok' : 'bad',
    D.length
      ? `Google description is ${D.length} characters. Aim for 120–155.`
      : 'Add a Google description.'
  );

  // Word count
  add(
    wc >= 900 ? 'good' : wc >= 500 ? 'ok' : 'bad',
    `Article has ${wc} words. Aim for 900+ for a full guide.`
  );

  // Internal links
  const links = (body.match(/href=["'](#[^"']+|[^"']*aegiskoncept[^"']*)["']/gi) || []).length;
  add(
    links >= 2 ? 'good' : links ? 'ok' : 'bad',
    `${links} link${links === 1 ? '' : 's'} to your own pages. Add at least 2 (a service + another article).`
  );

  // Featured image
  add(
    post.image ? 'good' : 'bad',
    post.image
      ? 'Featured image is set.'
      : 'Add a featured image (also used when shared on WhatsApp and LinkedIn).'
  );

  // Headings count
  const h2Count = (body.match(/<h2[^>]*>/gi) || []).length;
  add(
    h2Count >= 3 ? 'good' : 'ok',
    `${h2Count} main subheadings (H2). Break long articles into 3+ sections.`
  );

  // Sentence length
  const sents = plain.split(/[.!?]+\s/).filter((x) => x.trim().length > 3);
  const avg = sents.length ? wc / sents.length : 0;
  add(
    avg && avg <= 20 ? 'good' : 'ok',
    `Average sentence is ${avg.toFixed(0)} words. Keep it under 20 so it's easy to read.`
  );

  const good = out.filter((x) => x[0] === 'good').length;
  const okc = out.filter((x) => x[0] === 'ok').length;
  const score = Math.round(((good + okc * 0.5) / out.length) * 100);

  return { list: out, score };
}

