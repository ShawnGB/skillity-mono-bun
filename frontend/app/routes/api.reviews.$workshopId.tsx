import { redirect } from 'react-router';
import type { Route } from './+types/api.reviews.$workshopId';
import { serverPost } from '@/lib/api-client.server';
import { getCurrentUser } from '@/lib/session.server';

export async function action({ request, params }: Route.ActionArgs) {
  const user = await getCurrentUser(request);
  if (!user) return redirect('/login');

  const { workshopId } = params;
  const formData = await request.formData();
  const rating = Number(formData.get('rating'));
  const comment = formData.get('comment') as string | null;

  if (!rating || rating < 1 || rating > 5) {
    return { error: 'A rating between 1 and 5 is required' };
  }

  try {
    await serverPost(
      `/workshops/${workshopId}/reviews`,
      { rating, ...(comment?.trim() ? { comment: comment.trim() } : {}) },
      request,
    );
    return { ok: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to submit review',
    };
  }
}
