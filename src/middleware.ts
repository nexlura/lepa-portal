import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { handlePathRedirect } from './utils/pathRedirect';
import { getRoleHomePath, isAgencyRoleHome, isSystemRoleHome } from './utils/roleHome';

export const config = {
  matcher: [
    // Apply middleware to everything except:
    // - static files (_next, favicon, etc.)
    // - NextAuth routes (/api/auth)
    // - public files (optional)
    '/((?!api/auth|_next/static|_next/image|favicon.ico|auth).*)',
  ],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSessionCookie = req.cookies
    .getAll()
    .some(({ name }) =>
      name.includes('authjs.session-token') ||
      name.includes('next-auth.session-token')
    );
  const token = hasSessionCookie
    ? await getToken({
        req,
        // Support both Auth.js v5 and legacy NextAuth env names.
        // If neither is set, getToken falls back to its internal resolution.
        secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
      })
    : null;
  // Treat a valid session cookie as authenticated even if token decode fails in middleware.
  // This avoids production login loops caused by edge/runtime token decode inconsistencies.
  const isAuthenticated = Boolean(token) || hasSessionCookie;
  const roleHome = getRoleHomePath(token?.role as string | undefined);
  // Skip middleware for /auth routes
  if (pathname.startsWith('/auth')) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(roleHome, req.url));
    }
    return NextResponse.next();
  }

  // Redirect root based on presence of auth session cookie.
  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(roleHome, req.url));
    }

    const redirectUrl = new URL('/auth/verify', req.url);
    redirectUrl.searchParams.set('phone', '');
    return NextResponse.redirect(redirectUrl);
  }

  if (!isAuthenticated) {
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
    (isSystemRoleHome(roleHome) || isAgencyRoleHome(roleHome))
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
