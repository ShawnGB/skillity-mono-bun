import type { WishlistItem } from '@skillity/shared';
import { serverGet } from '@/lib/api-client.server';

type RequestSource = Request | string;

export async function getMyWishlist(
  source: RequestSource,
): Promise<WishlistItem[]> {
  return serverGet<WishlistItem[]>('/wishlist', source);
}

export async function getWishlistCheck(
  source: RequestSource,
  ids: string[],
): Promise<Record<string, boolean>> {
  if (ids.length === 0) return {};
  return serverGet<Record<string, boolean>>(
    `/wishlist/check?ids=${ids.join(',')}`,
    source,
  );
}
