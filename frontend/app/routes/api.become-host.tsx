import { redirect } from 'react-router';
import type { Route } from './+types/api.become-host';
import { serverPatch } from '@/lib/api-client.server';
import { getCurrentUser } from '@/lib/session.server';

export async function action({ request }: Route.ActionArgs) {
  const user = await getCurrentUser(request);
  if (!user) return redirect('/login');

  try {
    await serverPatch('/users/become-host', {}, request);
    return { ok: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to upgrade to host',
    };
  }
}
