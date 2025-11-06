import { NextResponse, NextRequest } from 'next/server';
import { auth } from './auth';

export const config = {
  // Apply middleware to all routes except static files and Next.js internals
  matcher: ['/((?!_next|static|favicon.ico).*)'],
};

export async function middleware(request: NextRequest) {
  console.log('log middleware');

  const { pathname } = request.nextUrl;

  // Skip middleware for /auth routes
  if (pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // Check session using your auth() function
  const session = await auth();

  // Handle home route "/"
  if (pathname === '/') {
    if (session?.user) {
      // ✅ Authenticated → redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // ❌ Unauthenticated → redirect to login/verify
    const redirectUrl = new URL('/auth/verify', request.url);
    redirectUrl.searchParams.set('phone', '');
    return NextResponse.redirect(redirectUrl);
  }

  // Protect all routes except /auth
  if (!session?.user) {
    const redirectUrl = new URL('/auth/verify', request.url);
    redirectUrl.searchParams.set('phone', '');
    return NextResponse.redirect(redirectUrl);
  }

  // Otherwise, continue
  return NextResponse.next();
}
