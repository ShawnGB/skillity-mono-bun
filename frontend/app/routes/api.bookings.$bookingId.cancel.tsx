import { redirect } from 'react-router';
import type { Route } from './+types/api.bookings.$bookingId.cancel';
import { serverPost } from '@/lib/api-client.server';
import { sessionContext } from '@/app/context';

export async function action({ params, context }: Route.ActionArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login');

  const { bookingId } = params;

  try {
    await serverPost(`/bookings/${bookingId}/cancel`, {}, session.cookie);
    return { ok: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to cancel booking',
    };
  }
}
