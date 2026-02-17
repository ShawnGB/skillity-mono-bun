'use server';

import { revalidatePath } from 'next/cache';
import type { Booking } from '@skillity/shared';
import { getSession } from '@/data/auth';
import { serverPost } from '@/data/server-client';

type ActionResult<T> =
  | { data: T; error?: never }
  | { data?: never; error: string };

export async function bookWorkshop(
  workshopId: string,
): Promise<ActionResult<Booking>> {
  const session = await getSession();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  try {
    const data = await serverPost<Booking>(`/workshops/${workshopId}/book`);
    revalidatePath(`/workshops/${workshopId}`);
    revalidatePath('/profile/bookings');
    return { data };
  } catch (err) {
    return { error: (err as Error).message || 'Failed to book workshop' };
  }
}

export async function confirmBooking(
  bookingId: string,
): Promise<ActionResult<Booking>> {
  const session = await getSession();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  try {
    const data = await serverPost<Booking>(`/bookings/${bookingId}/confirm`);
    revalidatePath('/profile/bookings');
    return { data };
  } catch (err) {
    return { error: (err as Error).message || 'Failed to confirm booking' };
  }
}

export async function cancelBooking(
  bookingId: string,
): Promise<ActionResult<Booking>> {
  const session = await getSession();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  try {
    const data = await serverPost<Booking>(`/bookings/${bookingId}/cancel`);
    revalidatePath('/profile/bookings');
    return { data };
  } catch (err) {
    return { error: (err as Error).message || 'Failed to cancel booking' };
  }
}
