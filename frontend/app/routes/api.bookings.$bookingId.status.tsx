import { redirect } from 'react-router';
import type { Route } from './+types/api.bookings.$bookingId.status';
import { serverGet } from '@/lib/api-client.server';
import { sessionContext } from '@/app/context';
import type { Booking } from '@skillity/shared';

export async function loader({ params, context }: Route.LoaderArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login');

  const booking = await serverGet<Booking>(`/bookings/${params.bookingId}`, session.cookie);
  return { status: booking.status };
}
