import { redirect } from 'react-router';
import type { Route } from './+types/api.workshops.$workshopId.conductors';
import { serverPost, serverDelete } from '@/lib/api-client.server';
import { getCurrentUser } from '@/lib/session.server';

export async function action({ request, params }: Route.ActionArgs) {
  const user = await getCurrentUser(request);
  if (!user) return redirect('/login');

  const { workshopId } = params;
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  try {
    if (intent === 'remove') {
      const userId = formData.get('userId') as string;
      await serverDelete(
        `/workshops/${workshopId}/conductors/${userId}`,
        request,
      );
      return { ok: true };
    }

    const userId = formData.get('userId') as string;
    const payoutShare = Number(formData.get('payoutShare'));
    await serverPost(
      `/workshops/${workshopId}/conductors`,
      { userId, payoutShare },
      request,
    );
    return { ok: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to update conductors',
    };
  }
}
