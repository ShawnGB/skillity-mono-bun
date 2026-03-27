import type { MiddlewareFunction } from 'react-router';
import type { AuthUser } from '@skillity/shared';
import { API_URL } from '@/lib/api-client.server';
import { sessionContext } from '@/app/context';

function getCookieValue(cookieHeader: string, name: string): string | null {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? match[1] : null;
}

async function fetchMe(cookie: string): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { user?: AuthUser };
    return json.user ?? null;
  } catch {
    return null;
  }
}

export const authMiddleware: MiddlewareFunction<Response> = async (
  { request, context },
  next,
) => {
  const originalCookie = request.headers.get('cookie') ?? '';
  const hasTokens =
    originalCookie.includes('access_token=') ||
    originalCookie.includes('refresh_token=');

  if (!hasTokens) {
    context.set(sessionContext, null);
    return next();
  }

  let effectiveCookie = originalCookie;
  let newSetCookies: string[] = [];
  let user = await fetchMe(originalCookie);

  if (!user) {
    const refreshToken = getCookieValue(originalCookie, 'refresh_token');
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: `refresh_token=${refreshToken}`,
          },
        });

        if (refreshRes.ok) {
          newSetCookies = refreshRes.headers.getSetCookie();
          effectiveCookie = newSetCookies
            .map((c) => c.split(';')[0])
            .join('; ');
          user = await fetchMe(effectiveCookie);
        }
      } catch {
        // refresh failed, user stays null
      }
    }
  }

  context.set(
    sessionContext,
    user ? { user, cookie: effectiveCookie } : null,
  );

  const response = await next();

  if (newSetCookies.length > 0) {
    for (const cookie of newSetCookies) {
      response.headers.append('Set-Cookie', cookie);
    }
  }

  return response;
};
