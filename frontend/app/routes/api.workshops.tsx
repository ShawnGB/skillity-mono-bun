import { redirect } from 'react-router';
import type { Route } from './+types/api.workshops';
import { serverPost } from '@/lib/api-client.server';
import { getCurrentUser } from '@/lib/session.server';
import type { Workshop } from '@skillity/shared';

export async function action({ request }: Route.ActionArgs) {
  const user = await getCurrentUser(request);
  if (!user) return redirect('/login');

  const formData = await request.formData();
  const raw = Object.fromEntries(formData.entries());
  const payload = {
    ...raw,
    maxParticipants: Number(raw.maxParticipants),
    ticketPrice: Number(raw.ticketPrice),
    duration: Number(raw.duration),
  };

  try {
    const workshop = await serverPost<Workshop>('/workshops', payload, request);
    return redirect(`/workshops/${workshop.id}`);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to create workshop',
    };
  }
}
