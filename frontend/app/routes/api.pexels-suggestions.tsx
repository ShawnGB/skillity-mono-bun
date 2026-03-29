import { redirect } from 'react-router';
import type { Route } from './+types/api.pexels-suggestions';
import { serverGet } from '@/lib/api-client.server';
import { sessionContext } from '@/app/context';

export async function loader({ request, context }: Route.LoaderArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login');

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  if (!category) return [];

  try {
    return await serverGet<object[]>(
      `/workshops/pexels-suggestions?category=${category}`,
      session.cookie,
    );
  } catch {
    return [];
  }
}
