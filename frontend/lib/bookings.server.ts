import type { Booking, WorkshopBooking } from '@skillity/shared';
import { serverGet } from '@/lib/api-client.server';

export async function getMyBookings(request: Request): Promise<Booking[]> {
  return serverGet<Booking[]>('/bookings/mine', request);
}

export async function getBooking(
  request: Request,
  id: string,
): Promise<Booking> {
  return serverGet<Booking>(`/bookings/${id}`, request);
}

export async function getWorkshopBookings(
  request: Request,
  workshopId: string,
): Promise<WorkshopBooking[]> {
  return serverGet<WorkshopBooking[]>(
    `/workshops/${workshopId}/bookings`,
    request,
  );
}
