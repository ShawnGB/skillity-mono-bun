import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import type { AuthUser } from '@skillity/shared';
import { serverGet } from './server-client';

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
    return null;
  }
});

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const session = await getSession();
  return session?.user ?? null;
});
