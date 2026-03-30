import { redirect, data } from 'react-router';
import type { Route } from './+types/api.profile';
import { serverPatch } from '@/lib/api-client.server';
import { refreshSession } from '@/lib/auth.server';
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
    const newCookies = await refreshSession(session.cookie);
    const headers = new Headers();
    for (const c of newCookies) headers.append('Set-Cookie', c);
    return data({ ok: true }, { headers });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to update profile',
    };
  }
}
