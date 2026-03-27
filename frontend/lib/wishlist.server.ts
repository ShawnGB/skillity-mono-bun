import type { WishlistItem } from '@skillity/shared';
import { serverGet } from '@/lib/api-client.server';

export async function getMyWishlist(request: Request): Promise<WishlistItem[]> {
  return serverGet<WishlistItem[]>('/wishlist', request);
}

export async function getWishlistCheck(
  request: Request,
  ids: string[],
): Promise<Record<string, boolean>> {
  if (ids.length === 0) return {};
  return serverGet<Record<string, boolean>>(
    `/wishlist/check?ids=${ids.join(',')}`,
    request,
  );
}
