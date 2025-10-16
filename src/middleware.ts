import { NextResponse, NextRequest } from 'next/server';
import { auth } from './auth';

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  // // Protect /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!session?.user) {
      const redirectUrl = new URL('/auth/verify', request.url);
      redirectUrl.searchParams.set('phone', '');
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Otherwise, continue
  return NextResponse.next();
}
