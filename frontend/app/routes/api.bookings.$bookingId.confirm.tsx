import { redirect } from 'react-router';
import type { Route } from './+types/api.bookings.$bookingId.confirm';
import { serverPost } from '@/lib/api-client.server';
import { sessionContext } from '@/app/context';

export async function action({ params, context }: Route.ActionArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login');

  const { bookingId } = params;

  try {
    await serverPost(`/bookings/${bookingId}/confirm`, {}, session.cookie);
    return redirect('/profile/bookings?confirmed=true');
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to confirm booking',
    };
  }
}
