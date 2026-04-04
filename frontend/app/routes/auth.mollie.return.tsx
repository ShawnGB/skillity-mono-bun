import { redirect } from 'react-router';
import type { Route } from './+types/auth.mollie.return';
import { sessionContext } from '@/app/context';
import { refreshSession } from '@/lib/auth.server';

export async function loader({ request, context }: Route.LoaderArgs) {
  const session = context.get(sessionContext);
  const url = new URL(request.url);
  const error = url.searchParams.get('error');

  if (error) {
    return redirect('/onboarding?error=mollie_connect_failed');
  }

  if (!session) {
    return redirect('/login');
  }

  const newCookies = await refreshSession(session.cookie);
  const headers = new Headers();
  for (const c of newCookies) headers.append('Set-Cookie', c);

  return redirect('/onboarding/success', { headers });
}
