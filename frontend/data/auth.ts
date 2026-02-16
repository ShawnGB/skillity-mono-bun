import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import type { AuthUser } from '@skillity/shared';
import { serverGet } from './server-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function tryRefreshAndGetMe(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): Promise<{ user: AuthUser } | null> {
  const refreshToken = cookieStore.get('refresh_token')?.value;
  if (!refreshToken) return null;

  try {
    const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refresh_token=${refreshToken}`,
      },
    });

    if (!refreshResponse.ok) return null;

    const newCookies = refreshResponse.headers.getSetCookie();
    const cookieHeader = newCookies
      .map((c) => c.split(';')[0])
      .join('; ');

    const meResponse = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      cache: 'no-store',
    });

    if (!meResponse.ok) return null;

    return meResponse.json();
  } catch {
    return null;
  }
}

export const getSession = cache(async (): Promise<{ user: AuthUser } | null> => {
  const cookieStore = await cookies();
  const hasAuth =
    cookieStore.has('access_token') || cookieStore.has('refresh_token');

  if (!hasAuth) {
    return null;
  }

  try {
    const response = await serverGet<{ user: AuthUser }>('/auth/me');
    return response;
  } catch {
    return tryRefreshAndGetMe(cookieStore);
  }
});

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const session = await getSession();
  return session?.user ?? null;
});
