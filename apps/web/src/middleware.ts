import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Inject the pathname into a header so server-side layouts can read it
  // (next/headers cannot read the request URL directly in App Router).
  const headers = new Headers(req.headers);
  headers.set('x-bartal-pathname', req.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
