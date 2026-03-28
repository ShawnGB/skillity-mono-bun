import type { Booking, WorkshopBooking } from '@skillity/shared';
import { serverGet } from '@/lib/api-client.server';

type RequestSource = Request | string;

export async function getMyBookings(
  source: RequestSource,
): Promise<Booking[]> {
  return serverGet<Booking[]>('/bookings/mine', source);
}

export async function getBooking(
  source: RequestSource,
  id: string,
): Promise<Booking> {
  return serverGet<Booking>(`/bookings/${id}`, source);
}

export async function getWorkshopBookings(
  source: RequestSource,
  workshopId: string,
): Promise<WorkshopBooking[]> {
  return serverGet<WorkshopBooking[]>(
    `/workshops/${workshopId}/bookings`,
    source,
  );
}
