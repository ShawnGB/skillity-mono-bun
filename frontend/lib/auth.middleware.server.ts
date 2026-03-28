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

interface RefreshResult {
  user: AuthUser | null;
  newSetCookies: string[];
  effectiveCookie: string;
}

// Deduplicates concurrent refresh calls for the same token.
// Without rotation, concurrent refreshes are idempotent (same token stays
// valid), but deduplication avoids redundant round-trips.
const refreshInFlight = new Map<string, Promise<RefreshResult>>();

async function doRefresh(
  refreshToken: string,
  originalCookie: string,
): Promise<RefreshResult> {
  try {
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refresh_token=${refreshToken}`,
      },
    });

    if (!refreshRes.ok) {
      return { user: null, newSetCookies: [], effectiveCookie: originalCookie };
    }

    const newSetCookies = refreshRes.headers.getSetCookie();
    // Only access_token is refreshed; refresh_token cookie stays unchanged.
    const newAccessToken = newSetCookies.find((c) =>
      c.startsWith('access_token='),
    );
    const effectiveCookie = newAccessToken
      ? `${newAccessToken.split(';')[0]}; ${originalCookie.replace(/access_token=[^;]*(;\s*)?/, '').trim().replace(/^;/, '').trim()}`
      : originalCookie;

    const json = (await refreshRes.json()) as { user?: AuthUser };
    return { user: json.user ?? null, newSetCookies, effectiveCookie };
  } catch {
    return { user: null, newSetCookies: [], effectiveCookie: originalCookie };
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
      let pending = refreshInFlight.get(refreshToken);
      if (!pending) {
        pending = doRefresh(refreshToken, originalCookie).finally(() => {
          refreshInFlight.delete(refreshToken);
        });
        refreshInFlight.set(refreshToken, pending);
      }

      const result = await pending;
      user = result.user;
      newSetCookies = result.newSetCookies;
      effectiveCookie = result.effectiveCookie;
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
