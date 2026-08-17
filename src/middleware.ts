import { NextRequest, NextResponse } from "next/server";

// Paths that require authentication
const protectedPaths = ["/admin"];

// List of known search engine bots
const botUserAgents = [
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'sogou',
  'exabot',
  'facebot',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

  // Check if the request is from a known bot
  const isBot = botUserAgents.some(bot => userAgent.includes(bot));

  // Allow bots to access public pages without authentication
  if (isBot && !pathname.startsWith('/admin')) {
    const response = NextResponse.next();
    response.headers.set('X-Bot-Access', 'allowed');
    return response;
  }

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Allow access to admin login page without authentication
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  if (isProtectedPath) {
    // Check for auth token in cookies
    const authToken = request.cookies.get("authToken")?.value;

    if (!authToken) {
      // Redirect to login if no token
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token validity (basic check)
    // In a real app, you'd verify the token with Firebase
    try {
      // Token exists, proceed
      return NextResponse.next();
    } catch (error) {
      // Invalid token, redirect to login
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
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
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
