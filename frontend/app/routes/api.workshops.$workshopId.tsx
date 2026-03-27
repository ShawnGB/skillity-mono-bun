import { redirect } from 'react-router';
import type { Route } from './+types/api.workshops.$workshopId';
import { serverPatch } from '@/lib/api-client.server';
import { getCurrentUser } from '@/lib/session.server';
import type { Workshop } from '@skillity/shared';

export async function action({ request, params }: Route.ActionArgs) {
  const user = await getCurrentUser(request);
  if (!user) return redirect('/login');

  const { workshopId } = params;
  const formData = await request.formData();
  const raw = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => v !== ''),
  );
  const payload: Record<string, unknown> = { ...raw };
  if (raw.maxParticipants !== undefined)
    payload.maxParticipants = Number(raw.maxParticipants);
  if (raw.ticketPrice !== undefined)
    payload.ticketPrice = Number(raw.ticketPrice);
  if (raw.duration !== undefined) payload.duration = Number(raw.duration);

  try {
    await serverPatch<Workshop>(`/workshops/${workshopId}`, payload, request);
    return { ok: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to update workshop',
    };
  }
}
