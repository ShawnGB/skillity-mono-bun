import type { Workshop, Review } from '@skillity/shared';
import { serverGet } from '@/lib/api-client.server';

type RequestSource = Request | string;

export async function getWorkshops(
  source: RequestSource,
  category?: string,
  level?: string,
  search?: string,
): Promise<Workshop[]> {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (level) params.set('level', level);
  if (search) params.set('search', search);
  const qs = params.toString();
  return serverGet<Workshop[]>(qs ? `/workshops?${qs}` : '/workshops', source);
}

export async function getWorkshop(
  source: RequestSource,
  id: string,
): Promise<Workshop> {
  return serverGet<Workshop>(`/workshops/${id}`, source);
}

export async function getMyWorkshops(
  source: RequestSource,
): Promise<Workshop[]> {
  return serverGet<Workshop[]>('/workshops/mine', source);
}

export async function getWorkshopReviews(
  source: RequestSource,
  workshopId: string,
): Promise<Review[]> {
  return serverGet<Review[]>(`/workshops/${workshopId}/reviews`, source);
}

export async function getHostWorkshops(
  source: RequestSource,
  hostId: string,
): Promise<Workshop[]> {
  return serverGet<Workshop[]>(`/workshops?hostId=${hostId}`, source);
}

export async function getSeriesWorkshops(
  source: RequestSource,
  seriesId: string,
): Promise<Workshop[]> {
  return serverGet<Workshop[]>(`/workshops/series/${seriesId}`, source);
}

export async function getSeriesReviews(
  source: RequestSource,
  seriesId: string,
): Promise<Review[]> {
  return serverGet<Review[]>(`/workshops/series/${seriesId}/reviews`, source);
}

export async function getMyReviews(source: RequestSource): Promise<Review[]> {
  return serverGet<Review[]>('/workshops/reviews/mine', source);
}
