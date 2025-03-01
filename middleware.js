import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // API routes that require authentication
  const protectedApiRoutes = [
    '/api/generate-sound',
    '/api/user/profile',
    '/api/user/credits'
  ];
  
  // Check if the request is for a protected API route
  const isProtectedApiRoute = protectedApiRoutes.some(route => 
    path.startsWith(route)
  );
  
  if (isProtectedApiRoute) {
    // Check for session cookie
    const sessionCookie = request.cookies.get('next-auth.session-token') || 
                          request.cookies.get('__Secure-next-auth.session-token');
    
    // If the user is not authenticated and trying to access a protected API route
    if (!sessionCookie) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }
  
  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    '/api/generate-sound/:path*',
    '/api/user/:path*'
  ],
};
