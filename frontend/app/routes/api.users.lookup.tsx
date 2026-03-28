import type { Route } from './+types/api.users.lookup';
import { serverGet } from '@/lib/api-client.server';
import { sessionContext } from '@/app/context';

export async function loader({ request, context }: Route.LoaderArgs) {
  const session = context.get(sessionContext);
  if (!session) return { user: null };

  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  if (!email) return { user: null };

  try {
    const user = await serverGet<{
      id: string;
      firstName: string | null;
      lastName: string | null;
    } | null>(`/users/lookup?email=${encodeURIComponent(email)}`, session.cookie);
    return { user };
  } catch {
    return { user: null };
  }
}
