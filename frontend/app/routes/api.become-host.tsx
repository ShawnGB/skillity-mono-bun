import { redirect } from 'react-router';
import type { Route } from './+types/api.become-host';
import { sessionContext } from '@/app/context';
import { API_URL } from '@/lib/api-client.server';

export async function action({ context }: Route.ActionArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login');

  return redirect(`${API_URL}/auth/mollie/connect`);
}
