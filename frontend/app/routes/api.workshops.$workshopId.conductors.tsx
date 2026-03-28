import { redirect } from 'react-router';
import type { Route } from './+types/api.workshops.$workshopId.conductors';
import { serverPost, serverDelete } from '@/lib/api-client.server';
import { sessionContext } from '@/app/context';

export async function action({ request, params, context }: Route.ActionArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login');

  const { workshopId } = params;
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  try {
    if (intent === 'remove') {
      const userId = formData.get('userId') as string;
      await serverDelete(
        `/workshops/${workshopId}/conductors/${userId}`,
        session.cookie,
      );
      return { ok: true };
    }

    const userId = formData.get('userId') as string;
    const payoutShare = Number(formData.get('payoutShare')) / 100;
    await serverPost(
      `/workshops/${workshopId}/conductors`,
      { userId, payoutShare },
      session.cookie,
    );
    return { ok: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to update conductors',
    };
  }
}
