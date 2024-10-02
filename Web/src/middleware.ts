// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import Cookies from 'js-cookie';

export function middleware(request: NextRequest) {
  // Get the access key from cookies
  const accessKey = request.cookies.get('accessKey')?.value;

  // Define the paths that require authentication
  const protectedRoutes = ['/profile', '/favorites', '/history', '/myticket', '/settings'];

  // Check if the current route is protected and the accessKey is missing
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route)) && !accessKey) {
    // Redirect to the login page if not authenticated
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Continue to the requested page if authenticated or if route does not require authentication
  return NextResponse.next();
}

// Specify which routes should trigger this middleware
export const config = {
  matcher: ['/profile/:path*', '/favorites/:path*', '/history/:path*', '/myticket/:path*', '/settings/:path*'],
};
