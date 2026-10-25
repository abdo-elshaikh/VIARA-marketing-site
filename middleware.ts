import { NextResponse, type NextRequest } from 'next/server';

const LOCALE_COOKIE = 'viara_locale';

function isEnPath(pathname: string): boolean {
  return pathname === '/en' || pathname.startsWith('/en/');
}

/** Picks the best-matching locale from Accept-Language, defaulting to Arabic. */
function prefersEnglish(header: string | null): boolean {
  if (!header) return false;
  const entries = header
    .split(',')
    .map(part => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.find(p => p.trim().startsWith('q='));
      return { tag: tag.trim().toLowerCase(), q: q ? Number.parseFloat(q.split('=')[1]) || 0 : 1 };
    })
    .filter(entry => entry.tag);
  const en = entries.find(entry => entry.tag === 'en' || entry.tag.startsWith('en-'));
  const ar = entries.find(entry => entry.tag === 'ar' || entry.tag.startsWith('ar-'));
  const enQ = en?.q ?? 0;
  const arQ = ar?.q ?? 0;
  return enQ > 0 && enQ > arQ;
}

function securityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'"
    ].join('; ')
  };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const headers = new Headers(request.headers);
  headers.set('x-viara-locale', isEnPath(pathname) ? 'en' : 'ar');

  // Aliases for core system integration and trial banner CTAs
  const aliasMap: Record<string, string> = {
    '/upgrade': '/planning',
    '/pricing': '/planning',
    '/plans': '/planning',
    '/contact': '/#contact',
    '/en/upgrade': '/en/planning',
    '/en/pricing': '/en/planning',
    '/en/plans': '/en/planning',
    '/en/contact': '/en#contact',
  };
  if (aliasMap[pathname]) {
    const url = request.nextUrl.clone();
    const target = aliasMap[pathname];
    if (target.includes('#')) {
      const [p, hash] = target.split('#');
      url.pathname = p || '/';
      url.hash = hash;
    } else {
      url.pathname = target;
    }
    return NextResponse.redirect(url, 301);
  }

  let response: NextResponse;

  const localeCookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const isHtmlRequest = !pathname.startsWith('/api') && !pathname.startsWith('/admin');
  if (
    isHtmlRequest &&
    !localeCookie &&
    pathname === '/' &&
    prefersEnglish(request.headers.get('accept-language'))
  ) {
    // First visit from an English-preferring browser: offer the English home once.
    const url = request.nextUrl.clone();
    url.pathname = '/en';
    response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, 'en', { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
  } else {
    response = NextResponse.next({ request: { headers } });
    if (isHtmlRequest) {
      const detected = isEnPath(pathname) ? 'en' : 'ar';
      if (localeCookie !== detected) {
        response.cookies.set(LOCALE_COOKIE, detected, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
      }
    }
  }

  for (const [key, value] of Object.entries(securityHeaders())) {
    response.headers.set(key, value);
  }
  // Personal and administrative pages must never be cached by intermediaries.
  if (pathname.startsWith('/requests') || pathname.startsWith('/en/requests') || pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'private, no-store');
  }
  const isSecure = request.nextUrl.protocol === 'https:' || request.headers.get('x-forwarded-proto') === 'https';
  if (isSecure) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  return response;
}

export const config = { matcher: ['/((?!_next|assets|fonts|favicon).*)'] };
