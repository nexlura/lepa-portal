import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { handlePathRedirect } from './utils/pathRedirect';

export const config = {
  matcher: [
    // Apply middleware to everything except:
    // - static files (_next, favicon, etc.)
    // - NextAuth routes (/api/auth)
    // - public files (optional)
    '/((?!api/auth|_next/static|_next/image|favicon.ico|auth).*)',
  ],
};

const getRoleHome = (role?: string) => {
  const r = (role || '').toLowerCase();
  if (r.includes('system')) return '/system-admin/dashboard';
  if (r.includes('agency')) return '/agency/dashboard';
  return '/dashboard';
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSessionCookie =
    req.cookies.has('authjs.session-token') ||
    req.cookies.has('__Secure-authjs.session-token') ||
    req.cookies.has('next-auth.session-token') ||
    req.cookies.has('__Secure-next-auth.session-token');
  const token = hasSessionCookie
    ? await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    : null;
  const roleHome = getRoleHome(token?.role as string | undefined);
  // Skip middleware for /auth routes
  if (pathname.startsWith('/auth')) {
    if (hasSessionCookie) {
      return NextResponse.redirect(new URL(roleHome, req.url));
    }
    return NextResponse.next();
  }

  // Redirect root based on presence of auth session cookie.
  if (pathname === '/') {
    if (hasSessionCookie) {
      return NextResponse.redirect(new URL(roleHome, req.url));
    }

    const redirectUrl = new URL('/auth/verify', req.url);
    redirectUrl.searchParams.set('phone', '');
    return NextResponse.redirect(redirectUrl);
  }

  if (!hasSessionCookie) {
    const redirectUrl = new URL('/auth/verify', req.url);
    redirectUrl.searchParams.set('phone', '');
    return NextResponse.redirect(redirectUrl);
  }

  // Enforce role home boundaries.
  if (pathname.startsWith('/system-admin') && !roleHome.startsWith('/system-admin')) {
    return NextResponse.redirect(new URL(roleHome, req.url));
  }
  if (pathname.startsWith('/agency') && !roleHome.startsWith('/agency')) {
    return NextResponse.redirect(new URL(roleHome, req.url));
  }
  if (
    pathname === '/dashboard' &&
    (roleHome.startsWith('/system-admin') || roleHome.startsWith('/agency'))
  ) {
    return NextResponse.redirect(new URL(roleHome, req.url));
  }

  // Call your redirect helper *inside* middleware
  const redirectResponse = handlePathRedirect(req);

  if (redirectResponse) {
    return redirectResponse;
  }

  return NextResponse.next();
}
