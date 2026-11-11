import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const STATIC_REDIRECTS: Record<string, string> = {
  '/services-site': '/services/website-development-design',
  '/services-seo': '/services/seo',
  '/services-ads': '/services/performance-marketing',
  '/services-social': '/services/social-media-marketing-management',
  '/services-video': '/services/video-production',
  '/insights-seo-cost-india': '/insights/seo-cost-india',
  '/insights-author-ritesh-kumar': '/insights/author/ritesh-kumar',
};

const cache = new Map<string, { to: string; type: number; time: number }>();
const CACHE_TTL_MS = 60 * 1000;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore static assets, next internal files, and api routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Admin authentication check
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || 'aegis-koncept-super-secret-development-key-change-in-production',
    });

    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
  }

  // Trailing slash normalization (e.g. /services/ -> /services)
  if (pathname !== '/' && pathname.endsWith('/')) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 301);
  }

  // 1. Check hardcoded static redirects
  if (STATIC_REDIRECTS[pathname]) {
    const url = req.nextUrl.clone();
    url.pathname = STATIC_REDIRECTS[pathname];
    return NextResponse.redirect(url, 301);
  }

  // 2. Pattern-based legacy flat paths
  if (pathname.startsWith('/services-')) {
    const url = req.nextUrl.clone();
    url.pathname = `/services/${pathname.replace('/services-', '')}`;
    return NextResponse.redirect(url, 301);
  }
  if (pathname.startsWith('/our-work-')) {
    const url = req.nextUrl.clone();
    url.pathname = `/our-work/${pathname.replace('/our-work-', '')}`;
    return NextResponse.redirect(url, 301);
  }
  if (pathname.startsWith('/industries-')) {
    const url = req.nextUrl.clone();
    url.pathname = `/industries/${pathname.replace('/industries-', '')}`;
    return NextResponse.redirect(url, 301);
  }
  if (pathname.startsWith('/locations-')) {
    const url = req.nextUrl.clone();
    url.pathname = `/locations/${pathname.replace('/locations-', '')}`;
    return NextResponse.redirect(url, 301);
  }

  // 3. Dynamic DB redirects via cached lookup
  const now = Date.now();
  const cached = cache.get(pathname);
  if (cached && now - cached.time < CACHE_TTL_MS) {
    if (cached.to) {
      const url = req.nextUrl.clone();
      url.pathname = cached.to;
      return NextResponse.redirect(url, cached.type === 302 ? 302 : 301);
    }
  } else {
    try {
      const lookupUrl = new URL(
        `/api/redirects?from=${encodeURIComponent(pathname)}`,
        req.url
      );
      const res = await fetch(lookupUrl.toString());
      if (res.ok) {
        const data = await res.json();
        if (data && data.to) {
          cache.set(pathname, { to: data.to, type: data.type || 301, time: now });
          // Fire-and-forget hit increment
          fetch(new URL('/api/redirects/hit', req.url).toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: pathname }),
          }).catch(() => {});

          const url = req.nextUrl.clone();
          url.pathname = data.to;
          return NextResponse.redirect(url, data.type === 302 ? 302 : 301);
        } else {
          cache.set(pathname, { to: '', type: 0, time: now });
        }
      }
    } catch {
      // Fail silently to next()
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
