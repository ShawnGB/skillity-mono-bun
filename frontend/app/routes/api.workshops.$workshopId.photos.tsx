import { redirect } from 'react-router';
import type { Route } from './+types/api.workshops.$workshopId.photos';
import { serverUpload } from '@/lib/api-client.server';
import { sessionContext } from '@/app/context';

export async function action({ request, params, context }: Route.ActionArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login');

  const formData = await request.formData();

  try {
    return await serverUpload(`/workshops/${params.workshopId}/photos`, formData, session.cookie);
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Upload failed' };
  }
}
