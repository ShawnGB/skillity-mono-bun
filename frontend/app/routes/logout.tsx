import { redirect } from 'react-router';
import type { Route } from './+types/logout';
import { logoutUser } from '@/lib/auth.server';

export async function action({ request }: Route.ActionArgs) {
  await logoutUser(request);

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
