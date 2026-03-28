import { redirect } from 'react-router';
import type { Route } from './+types/api.book.$workshopId';
import { serverPost } from '@/lib/api-client.server';
import { sessionContext } from '@/app/context';
import type { Booking } from '@skillity/shared';

export async function action({ params, context }: Route.ActionArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login');

  const { workshopId } = params;

  try {
    const booking = await serverPost<Booking>(
      `/workshops/${workshopId}/book`,
      {},
      session.cookie,
    );
    return redirect(`/checkout/${booking.id}`);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to book workshop',
    };
  }
}
