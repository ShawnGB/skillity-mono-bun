import 'server-only';
import { cache } from 'react';
import type { Booking } from '@skillity/shared';
import { serverGet } from './server-client';

export const getMyBookings = cache(async (): Promise<Booking[]> => {
  return serverGet<Booking[]>('/bookings/mine');
});

export const getBooking = cache(async (id: string): Promise<Booking> => {
  return serverGet<Booking>(`/bookings/${id}`);
});
