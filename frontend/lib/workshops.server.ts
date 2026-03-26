import type { Workshop, Review } from "@skillity/shared";
import { serverGet } from "@/lib/api-client.server";

export async function getWorkshops(
  request: Request,
  category?: string,
  level?: string,
  search?: string,
): Promise<Workshop[]> {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (level) params.set("level", level);
  if (search) params.set("search", search);
  const qs = params.toString();
  return serverGet<Workshop[]>(qs ? `/workshops?${qs}` : "/workshops", request);
}

export async function getWorkshop(request: Request, id: string): Promise<Workshop> {
  return serverGet<Workshop>(`/workshops/${id}`, request);
}

export async function getMyWorkshops(request: Request): Promise<Workshop[]> {
  return serverGet<Workshop[]>("/workshops/mine", request);
}

export async function getWorkshopReviews(request: Request, workshopId: string): Promise<Review[]> {
  return serverGet<Review[]>(`/workshops/${workshopId}/reviews`, request);
}

export async function getHostWorkshops(request: Request, hostId: string): Promise<Workshop[]> {
  return serverGet<Workshop[]>(`/workshops?hostId=${hostId}`, request);
}

export async function getSeriesWorkshops(request: Request, seriesId: string): Promise<Workshop[]> {
  return serverGet<Workshop[]>(`/workshops/series/${seriesId}`, request);
}

export async function getSeriesReviews(request: Request, seriesId: string): Promise<Review[]> {
  return serverGet<Review[]>(`/workshops/series/${seriesId}/reviews`, request);
}

export async function getMyReviews(request: Request): Promise<Review[]> {
  return serverGet<Review[]>("/workshops/reviews/mine", request);
}
