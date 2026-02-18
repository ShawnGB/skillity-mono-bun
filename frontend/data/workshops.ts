import 'server-only';
import { cache } from 'react';
import type { Workshop, Review } from '@skillity/shared';
import { serverGet } from './server-client';

export const getWorkshops = cache(async (
  category?: string,
  level?: string,
  search?: string,
): Promise<Workshop[]> => {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (level) params.set('level', level);
  if (search) params.set('search', search);
  const qs = params.toString();
  return serverGet<Workshop[]>(qs ? `/workshops?${qs}` : '/workshops');
});

export const getWorkshop = cache(async (id: string): Promise<Workshop> => {
  return serverGet<Workshop>(`/workshops/${id}`);
});

export const getMyWorkshops = cache(async (): Promise<Workshop[]> => {
  return serverGet<Workshop[]>('/workshops/mine');
});

export const getWorkshopReviews = cache(async (workshopId: string): Promise<Review[]> => {
  return serverGet<Review[]>(`/workshops/${workshopId}/reviews`);
});

export const getHostWorkshops = cache(async (hostId: string): Promise<Workshop[]> => {
  return serverGet<Workshop[]>(`/workshops?hostId=${hostId}`);
});

export const getSeriesWorkshops = cache(async (seriesId: string): Promise<Workshop[]> => {
  return serverGet<Workshop[]>(`/workshops/series/${seriesId}`);
});

export const getSeriesReviews = cache(async (seriesId: string): Promise<Review[]> => {
  return serverGet<Review[]>(`/workshops/series/${seriesId}/reviews`);
});

export const getMyReviews = cache(async (): Promise<Review[]> => {
  return serverGet<Review[]>('/workshops/reviews/mine');
});
