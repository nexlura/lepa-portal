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

  // Fetch session with error handling
  let session = null;
  try {
    session = await auth();
  } catch (error) {
    // Log error but don't crash - treat as no session
    console.warn('Error fetching session in middleware:', error);
    // Continue with session = null, which will redirect to login
  }

  // redirect to dashboard or login page if user try to access the "/" route
  if (pathname === '/') {
    if (session?.user) {
      // Redirect based on user role
      const userRole = session.user.role?.toLowerCase() || '';
      const isSystemAdmin = userRole === 'system_admin' || userRole === 'system admin' || userRole.includes('system');
      const isAgency = userRole === 'agency' || userRole.includes('agency');
      
      if (isSystemAdmin) {
        return NextResponse.redirect(new URL('/system-admin/dashboard', req.url));
      } else if (isAgency) {
        return NextResponse.redirect(new URL('/agency/dashboard', req.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
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

  // Role-based route protection
  const userRole = session.user.role?.toLowerCase() || '';
  const isSystemAdmin = userRole === 'system_admin' || userRole === 'system admin' || userRole.includes('system');
  const isAgency = userRole === 'agency' || userRole.includes('agency');

  // Protect system-admin routes - only system admins can access
  if (pathname.startsWith('/system-admin')) {
    if (!isSystemAdmin) {
      // Redirect non-system admins to their appropriate dashboard
      if (isAgency) {
        return NextResponse.redirect(new URL('/agency/dashboard', req.url));
      }
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
  
  // Protect agency routes - only agency users can access
  if (pathname.startsWith('/agency')) {
    if (!isAgency) {
      // Redirect non-agency users to their appropriate dashboard
      if (isSystemAdmin) {
        return NextResponse.redirect(new URL('/system-admin/dashboard', req.url));
      }
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
  
  // Redirect system admins away from tenant/agency dashboards to their dashboard
  if (isSystemAdmin && (pathname === '/dashboard' || pathname.startsWith('/agency'))) {
    return NextResponse.redirect(new URL('/system-admin/dashboard', req.url));
  }
  
  // Redirect agency users away from tenant/system-admin dashboards to their dashboard
  if (isAgency && (pathname === '/dashboard' || pathname.startsWith('/system-admin'))) {
    return NextResponse.redirect(new URL('/agency/dashboard', req.url));
  }

  // Call your redirect helper *inside* middleware
  const redirectResponse = handlePathRedirect(req);

  if (redirectResponse) {
    return redirectResponse;
  }

  return NextResponse.next();
}
