import { redirect } from 'react-router';
import type { Route } from './+types/api.workshops';
import { serverPost } from '@/lib/api-client.server';
import { sessionContext } from '@/app/context';
import type { Workshop } from '@skillity/shared';

export async function action({ request, context }: Route.ActionArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login');

  const formData = await request.formData();
  const raw = Object.fromEntries(formData.entries());
  const payload = {
    ...raw,
    maxParticipants: Number(raw.maxParticipants),
    ticketPrice: Number(raw.ticketPrice),
    duration: Number(raw.duration),
  };

  try {
    const workshop = await serverPost<Workshop>('/workshops', payload, session.cookie);
    return redirect(`/workshops/${workshop.id}/edit?created=1`);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to create workshop',
    };
  }
}
