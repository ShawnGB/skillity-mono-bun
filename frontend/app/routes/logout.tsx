import { redirect } from 'react-router';
import type { Route } from './+types/logout';
import { API_URL } from '@/lib/api-client.server';

export async function action({ request }: Route.ActionArgs) {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { Cookie: request.headers.get('cookie') ?? '' },
    });
  } catch (err) {
    // Backend unreachable — cookies are still cleared below
    console.error('Backend logout failed:', err);
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
