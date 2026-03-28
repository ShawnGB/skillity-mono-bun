import { redirect } from 'react-router';
import type { Route } from './+types/api.become-host';
import { serverPatch } from '@/lib/api-client.server';
import { sessionContext } from '@/app/context';

export async function action({ context }: Route.ActionArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login');

  try {
    await serverPatch('/users/become-host', {}, session.cookie);
    return { ok: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to upgrade to host',
    };
  }
}
