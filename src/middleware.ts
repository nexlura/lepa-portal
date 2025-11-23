import { NextResponse, NextRequest } from 'next/server';

import { auth } from './auth';
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

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for /auth routes
  if (pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  const session = await auth();

  // redirect to dashboard or login page if user try to access the "/" route
  if (pathname === '/') {
    if (session?.user) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    const redirectUrl = new URL('/auth/verify', req.url);
    redirectUrl.searchParams.set('phone', '');
    return NextResponse.redirect(redirectUrl);
  }

  // redirect unauthenticated users to login page
  if (!session?.user) {
    const redirectUrl = new URL('/auth/verify', req.url);
    redirectUrl.searchParams.set('phone', '');
    return NextResponse.redirect(redirectUrl);
  }

  // Call your redirect helper *inside* middleware
  const redirectResponse = handlePathRedirect(req, ['/classes', '/teachers']);

  if (redirectResponse) {
    return redirectResponse;
  }

  return NextResponse.next();
}
