import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware for login page (now at /login, not /admin/login)
  if (pathname === '/login' || pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    // Check for auth session cookie (NextAuth v5 uses authjs.session-token)
    const sessionToken = request.cookies.get('authjs.session-token') || 
                         request.cookies.get('__Secure-authjs.session-token') ||
                         request.cookies.get('next-auth.session-token') ||
                         request.cookies.get('__Secure-next-auth.session-token');

    // Redirect to login if not authenticated
    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
