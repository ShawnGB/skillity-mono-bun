import { redirect } from 'react-router';
import type { Route } from './+types/api.bookings.$bookingId.cancel';
import { serverPost } from '@/lib/api-client.server';
import { getCurrentUser } from '@/lib/session.server';

export async function action({ request, params }: Route.ActionArgs) {
  const user = await getCurrentUser(request);
  if (!user) return redirect('/login');

  const { bookingId } = params;

  try {
    await serverPost(`/bookings/${bookingId}/cancel`, {}, request);
    return { ok: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to cancel booking',
    };
  }
}
