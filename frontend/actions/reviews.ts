'use server';

import { revalidatePath } from 'next/cache';
import type { CreateReviewInput } from '@skillity/shared';
import { serverPost } from '@/data/server-client';

type ActionResult<T> =
  | { data: T; error?: never }
  | { data?: never; error: string };

export async function submitReview(
  workshopId: string,
  input: CreateReviewInput,
): Promise<ActionResult<{ message: string }>> {
  try {
    await serverPost(`/workshops/${workshopId}/reviews`, input);
    revalidatePath(`/workshops/${workshopId}`);
    return { data: { message: 'Review submitted successfully' } };
  } catch (err) {
    return { error: (err as Error).message || 'Failed to submit review' };
  }
}
