import 'server-only';
import { cache } from 'react';
import type { HostProfile } from '@skillity/shared';
import { serverGet } from './server-client';

export const getHostProfile = cache(async (id: string): Promise<HostProfile> => {
  return serverGet<HostProfile>(`/users/${id}/profile`);
});
