import { NextResponse } from 'next/server';
import { auth } from './auth';

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    const redirectUrl = new URL('/auth/verify', request.url);
    redirectUrl.searchParams.set('email', '');
    return NextResponse.redirect(redirectUrl);
  }

  // Call the auth middleware for protected routes
  return auth(request);
}
