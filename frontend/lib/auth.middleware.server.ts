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

// Two-level cache for refresh results:
//   refreshInFlight  — in-progress promises (deduplicates concurrent requests)
//   refreshDone      — recently-completed results kept for REFRESH_CACHE_TTL_MS
//
// The TTL covers the window between a refresh completing on the server and the
// browser actually storing the new cookies, so rapid-but-not-concurrent
// navigations (e.g. clicking 3 tabs in quick succession) don't each spin up
// a separate rotation with the same now-revoked token.
const REFRESH_CACHE_TTL_MS = 10_000;
const refreshInFlight = new Map<string, Promise<RefreshResult>>();
const refreshDone = new Map<string, { result: RefreshResult; until: number }>();

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
    const effectiveCookie = newSetCookies.map((c) => c.split(';')[0]).join('; ');
    const json = (await refreshRes.json()) as { user?: AuthUser };

    return { user: json.user ?? null, newSetCookies, effectiveCookie };
  } catch {
    return { user: null, newSetCookies: [], effectiveCookie: originalCookie };
  }
}

async function getRefreshResult(
  refreshToken: string,
  originalCookie: string,
): Promise<RefreshResult> {
  // 1. Use a recently-completed result if still within TTL.
  const cached = refreshDone.get(refreshToken);
  if (cached && cached.until > Date.now()) {
    return cached.result;
  }
  refreshDone.delete(refreshToken);

  // 2. Join an in-flight refresh if one is already running.
  const inflight = refreshInFlight.get(refreshToken);
  if (inflight) return inflight;

  // 3. Start a new refresh, cache the result, and clean up.
  const promise = doRefresh(refreshToken, originalCookie).then((result) => {
    refreshInFlight.delete(refreshToken);
    if (result.user) {
      refreshDone.set(refreshToken, { result, until: Date.now() + REFRESH_CACHE_TTL_MS });
    }
    return result;
  });

  refreshInFlight.set(refreshToken, promise);
  return promise;
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
      const result = await getRefreshResult(refreshToken, originalCookie);
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
