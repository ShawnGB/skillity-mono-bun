import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile', '/workshops/create'];
const authRoutes = ['/login', '/register'];
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function refreshTokens(
  refreshToken: string,
): Promise<string[] | null> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refresh_token=${refreshToken}`,
      },
    });

    if (!response.ok) return null;

    return response.headers.getSetCookie();
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (accessToken) {
    if (authRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (refreshToken) {
    const setCookieHeaders = await refreshTokens(refreshToken);

    if (setCookieHeaders?.length) {
      const isAuthRoute = authRoutes.some((route) =>
        pathname.startsWith(route),
      );
      const response = isAuthRoute
        ? NextResponse.redirect(new URL('/', request.url))
        : NextResponse.next();

      for (const cookie of setCookieHeaders) {
        response.headers.append('Set-Cookie', cookie);
      }

      return response;
    }
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
