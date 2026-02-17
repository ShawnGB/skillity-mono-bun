import 'server-only';
import { cache } from 'react';
import type { Workshop } from '@skillity/shared';
import { serverGet } from './server-client';

export const getWorkshops = cache(async (category?: string): Promise<Workshop[]> => {
  const url = category ? `/workshops?category=${category}` : '/workshops';
  return serverGet<Workshop[]>(url);
});

export const getWorkshop = cache(async (id: string): Promise<Workshop> => {
  return serverGet<Workshop>(`/workshops/${id}`);
});

export const getMyWorkshops = cache(async (): Promise<Workshop[]> => {
  return serverGet<Workshop[]>('/workshops/mine');
});
