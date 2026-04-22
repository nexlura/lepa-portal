import { NextResponse, NextRequest } from 'next/server';
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

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSessionCookie =
    req.cookies.has('authjs.session-token') ||
    req.cookies.has('__Secure-authjs.session-token') ||
    req.cookies.has('next-auth.session-token') ||
    req.cookies.has('__Secure-next-auth.session-token');
  // Skip middleware for /auth routes
  if (pathname.startsWith('/auth')) {
    if (hasSessionCookie) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // Redirect root based on presence of auth session cookie.
  if (pathname === '/') {
    if (hasSessionCookie) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
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

  // Call your redirect helper *inside* middleware
  const redirectResponse = handlePathRedirect(req);

  if (redirectResponse) {
    return redirectResponse;
  }

  return NextResponse.next();
}
