'use server';

import { revalidatePath } from 'next/cache';
import type { WishlistToggleResult } from '@skillity/shared';
import { serverPost } from '@/data/server-client';

type ActionResult<T> =
  | { data: T; error?: never }
  | { data?: never; error: string };

export async function toggleWishlist(
  workshopId: string,
): Promise<ActionResult<WishlistToggleResult>> {
  try {
    const data = await serverPost<WishlistToggleResult>(`/wishlist/${workshopId}`);
    revalidatePath('/profile/saved');
    return { data };
  } catch (err) {
    return { error: (err as Error).message || 'Failed to update wishlist' };
  }
}
