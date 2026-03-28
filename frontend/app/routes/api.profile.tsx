import { redirect } from 'react-router';
import type { Route } from './+types/api.profile';
import { serverPatch } from '@/lib/api-client.server';
import { sessionContext } from '@/app/context';

export async function action({ request, context }: Route.ActionArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login');

  const formData = await request.formData();
  const payload = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => v !== ''),
  );

  try {
    await serverPatch('/users/me', payload, session.cookie);
    return { ok: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to update profile',
    };
  }
}
