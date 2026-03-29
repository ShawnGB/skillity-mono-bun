import { redirect } from 'react-router';
import type { Route } from './+types/api.uploads';
import { serverUpload } from '@/lib/api-client.server';
import { sessionContext } from '@/app/context';

export async function action({ request, context }: Route.ActionArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login');

  const formData = await request.formData();

  try {
    return await serverUpload<{ url: string; key: string }>('/uploads', formData, session.cookie);
  } catch {
    return { error: 'Upload failed' };
  }
}
