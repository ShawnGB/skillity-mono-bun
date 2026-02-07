import 'server-only';
import { cache } from 'react';
import type { User } from '@skillity/shared';
import { serverGet } from './server-client';
import { getSession } from './auth';

export const getUsers = cache(async (): Promise<User[]> => {
  const session = await getSession();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return serverGet<User[]>('/users');
});
