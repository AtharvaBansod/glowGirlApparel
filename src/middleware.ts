import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const token = request.cookies.get('token')?.value || '';

    // Define paths that are considered public (accessible without a token)
    const isPublicPath = path === '/login' || path === '/signup' || path === '/verify-email';

    // Define paths that are for admins only
    const isAdminPath = path.startsWith('/admin');

    // If the user has a token and is trying to access a public path, redirect them
    if (isPublicPath && token) {
        try {
            await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
            // If token is valid, redirect logged-in user away from login/signup
            return NextResponse.redirect(new URL('/profile', request.url));
        } catch (error) {
            // If token is invalid, let them proceed to the public path
        }
    }

    // If the user is trying to access a protected path without a token, redirect to login
    if (!isPublicPath && !token) {
        // Append the original path as a redirect query for better UX after login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', path);
        return NextResponse.redirect(loginUrl);
    }
    
    // If the user is trying to access an admin path
    if (isAdminPath && token) {
        try {
            const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
            // If the token is valid but the user is not an admin, redirect them
            if (!payload.isAdmin) {
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch (error) {
             // If token is invalid, redirect to login
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
    
    // If none of the above conditions are met, allow the request to proceed
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * This prevents the middleware from running on unnecessary requests.
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};