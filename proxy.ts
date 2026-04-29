import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/browse',
    '/vehicle',
    '/auctions',
    '/calculator',
    '/dealers',
    '/auth/login',
    '/auth/register',
    '/api/auth',
    '/api/vehicles',
    '/api/auctions'
  ];

  // Protected routes that require authentication
  const protectedRoutes = [
    '/sell',
    '/profile',
    '/favorites',
    '/messages',
    '/bids',
    '/purchases',
    '/admin',
    '/dealer'
  ];

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Get token from cookies or headers
  const token = request.cookies.get('auth-token')?.value || 
               request.headers.get('authorization')?.replace('Bearer ', '');

  // If trying to access protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access auth routes while logged in, redirect to browse
  if ((pathname === '/auth/login' || pathname === '/auth/register') && token) {
    return NextResponse.redirect(new URL('/browse', request.url));
  }

  // Admin routes require admin role - simple check for demo
  if (pathname.startsWith('/admin') && token) {
    // For demo purposes, check if token contains admin
    if (!token.includes('admin')) {
      return NextResponse.redirect(new URL('/browse', request.url));
    }
  }

  // Dealer routes require dealer role - simple check for demo
  if (pathname.startsWith('/dealer') && token) {
    // For demo purposes, check if token contains dealer
    if (!token.includes('dealer') && !token.includes('admin')) {
      return NextResponse.redirect(new URL('/browse', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
