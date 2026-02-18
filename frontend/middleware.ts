import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/profile', '/onboarding'];
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
    return NextResponse.next();
  }

  if (refreshToken) {
    const setCookieHeaders = await refreshTokens(refreshToken);

    if (setCookieHeaders?.length) {
      const response = NextResponse.next();

      for (const cookie of setCookieHeaders) {
        response.headers.append('Set-Cookie', cookie);
      }

      return response;
    }

    const response = NextResponse.next();
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
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
