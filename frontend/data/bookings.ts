import 'server-only';
import { cache } from 'react';
import type { Booking, WorkshopBooking } from '@skillity/shared';
import { serverGet } from './server-client';

export const getMyBookings = cache(async (): Promise<Booking[]> => {
  return serverGet<Booking[]>('/bookings/mine');
});

export const getBooking = cache(async (id: string): Promise<Booking> => {
  return serverGet<Booking>(`/bookings/${id}`);
});

export const getWorkshopBookings = cache(async (workshopId: string): Promise<WorkshopBooking[]> => {
  return serverGet<WorkshopBooking[]>(`/workshops/${workshopId}/bookings`);
});
