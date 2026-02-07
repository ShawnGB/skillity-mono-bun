import 'server-only';
import { cache } from 'react';
import type { Workshop } from '@skillity/shared';
import { serverGet } from './server-client';

export const getWorkshops = cache(async (): Promise<Workshop[]> => {
  return serverGet<Workshop[]>('/workshops');
});

export const getWorkshop = cache(async (id: string): Promise<Workshop> => {
  return serverGet<Workshop>(`/workshops/${id}`);
});
