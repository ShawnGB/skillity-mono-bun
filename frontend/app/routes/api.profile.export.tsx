import { redirect } from 'react-router';
import type { Route } from './+types/api.profile.export';
import { serverGet } from '@/lib/api-client.server';
import { getCurrentUser } from '@/lib/session.server';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getCurrentUser(request);
  if (!user) return redirect('/login');

  const data = await serverGet<Record<string, unknown>>(
    '/users/me/export',
    request,
  );

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="uskillity-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
