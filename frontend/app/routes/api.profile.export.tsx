import { redirect } from 'react-router';
import type { Route } from './+types/api.profile.export';
import { serverGet } from '@/lib/api-client.server';
import { sessionContext } from '@/app/context';

export async function loader({ context }: Route.LoaderArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login');

  const data = await serverGet<Record<string, unknown>>(
    '/users/me/export',
    session.cookie,
  );

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="uskillity-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
