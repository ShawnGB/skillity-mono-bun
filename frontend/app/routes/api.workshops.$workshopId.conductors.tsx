import { redirect } from 'react-router';
import type { Route } from './+types/api.workshops.$workshopId.conductors';
import { serverPatch, serverDelete } from '@/lib/api-client.server';
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

    if (intent === 'split') {
      const splitsRaw = formData.get('splits') as string;
      const splits = JSON.parse(splitsRaw) as {
        userId: string;
        payoutShare: number;
      }[];
      await serverPatch(
        `/workshops/${workshopId}/conductors/split`,
        { splits },
        session.cookie,
      );
      return { ok: true };
    }

    return { error: 'Unknown intent' };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to update conductors',
    };
  }
}
