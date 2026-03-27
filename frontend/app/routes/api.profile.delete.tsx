import { redirect } from 'react-router';
import type { Route } from './+types/api.profile.delete';
import { serverDelete } from '@/lib/api-client.server';
import { sessionContext } from '@/app/context';

export async function action({ context }: Route.ActionArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login');

  try {
    await serverDelete('/users/me', session.cookie);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to delete account',
    };
  }

  const headers = new Headers();
  headers.append(
    'Set-Cookie',
    'access_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax',
  );
  headers.append(
    'Set-Cookie',
    'refresh_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax',
  );

  return redirect('/', { headers });
}
