import { NextResponse, NextRequest } from 'next/server';
import { auth } from './auth';

export const config = {
  matcher: [
    // Apply middleware to everything except:
    // - static files (_next, favicon, etc.)
    // - NextAuth routes (/api/auth)
    // - public files (optional)
    '/((?!api/auth|_next/static|_next/image|favicon.ico|auth).*)',
  ],
};

export async function middleware(request: NextRequest) {
  console.log('log middleware');

  const { pathname } = request.nextUrl;

  // Skip middleware for /auth routes
  if (pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  const session = await auth();

  if (pathname === '/') {
    if (session?.user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    const redirectUrl = new URL('/auth/verify', request.url);
    redirectUrl.searchParams.set('phone', '');
    return NextResponse.redirect(redirectUrl);
  }

  if (!session?.user) {
    const redirectUrl = new URL('/auth/verify', request.url);
    redirectUrl.searchParams.set('phone', '');
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}
