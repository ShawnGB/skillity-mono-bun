import { redirect } from 'react-router';
import type { Route } from './+types/api.bookings.$bookingId.pay';
import { serverPost } from '@/lib/api-client.server';
import { sessionContext } from '@/app/context';

export async function action({ params, context }: Route.ActionArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login');

  const { bookingId } = params;

  try {
    const result = await serverPost<{ checkoutUrl: string }>(
      `/bookings/${bookingId}/pay`,
      {},
      session.cookie,
    );
    return { checkoutUrl: result.checkoutUrl };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to initiate payment',
    };
  }
}
