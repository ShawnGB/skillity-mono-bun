import { redirect } from 'react-router';
import type { Route } from './+types/api.workshops.$workshopId.status';
import { serverPatch } from '@/lib/api-client.server';
import { getCurrentUser } from '@/lib/session.server';

export async function action({ request, params }: Route.ActionArgs) {
  const user = await getCurrentUser(request);
  if (!user) return redirect('/login');

  const { workshopId } = params;
  const formData = await request.formData();
  const status = formData.get('status') as string;

  try {
    await serverPatch(`/workshops/${workshopId}`, { status }, request);
    return { ok: true };
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : 'Failed to update workshop status',
    };
  }
}
