import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED = /^\/(ar|en)\/(account|orders|wishlist|checkout)(\/.*)?$/;
const ACCESS_COOKIE = 'bartal_access';
const REFRESH_COOKIE = 'bartal_refresh';
const USER_COOKIE = 'bartal_user';
const ACCESS_MAX_AGE = 15 * 60;
const REFRESH_MAX_AGE = 30 * 24 * 60 * 60;

function apiBase(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api';
}

function loginRedirect(req: NextRequest, locale: string): NextResponse {
  const target = req.nextUrl.clone();
  target.pathname = `/${locale}/login`;
  target.search = `?next=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}`;
  const res = NextResponse.redirect(target);
  res.cookies.set(ACCESS_COOKIE, '', { maxAge: 0, path: '/' });
  res.cookies.set(REFRESH_COOKIE, '', { maxAge: 0, path: '/' });
  res.cookies.set(USER_COOKIE, '', { maxAge: 0, path: '/' });
  return res;
}

async function tryRefresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);
    const res = await fetch(`${apiBase()}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const json = (await res.json()) as { success?: boolean; data?: { accessToken: string; refreshToken: string } };
    if (!json.success || !json.data) return null;
    return json.data;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const headers = new Headers(req.headers);
  headers.set('x-bartal-pathname', req.nextUrl.pathname);
  const passthrough = NextResponse.next({ request: { headers } });

  const path = req.nextUrl.pathname;
  if (!PROTECTED.test(path)) return passthrough;

  const locale = path.split('/')[1] ?? 'ar';
  const access = req.cookies.get(ACCESS_COOKIE)?.value;
  if (access) return passthrough;

  const refresh = req.cookies.get(REFRESH_COOKIE)?.value;
  if (!refresh) return loginRedirect(req, locale);

  const tokens = await tryRefresh(refresh);
  if (!tokens) return loginRedirect(req, locale);

  const next = NextResponse.next({ request: { headers } });
  // Secure cookies in production, unless explicitly opted out (e.g. plain-HTTP test deploys
  // where the browser would otherwise discard `secure` cookies). Default behavior unchanged.
  const cookieSecure =
    process.env.COOKIE_SECURE !== 'false' && process.env.NODE_ENV === 'production';
  next.cookies.set(ACCESS_COOKIE, tokens.accessToken, {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: ACCESS_MAX_AGE,
  });
  next.cookies.set(REFRESH_COOKIE, tokens.refreshToken, {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: REFRESH_MAX_AGE,
  });
  return next;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|opengraph-image|api/).*)'],
};
