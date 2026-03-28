import { redirect } from 'react-router';
import type { Route } from './+types/api.wishlist.$workshopId';
import { serverPost, serverDelete } from '@/lib/api-client.server';
import { sessionContext } from '@/app/context';

export async function action({ request, params, context }: Route.ActionArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login');

  const { workshopId } = params;
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'save') {
    await serverPost(`/wishlist/${workshopId}`, {}, session.cookie);
  } else {
    await serverDelete(`/wishlist/${workshopId}`, session.cookie);
  }

  return { ok: true };
}
