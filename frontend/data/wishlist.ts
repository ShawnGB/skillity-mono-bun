import 'server-only';
import { cache } from 'react';
import type { WishlistItem } from '@skillity/shared';
import { serverGet } from './server-client';

export const getMyWishlist = cache(async (): Promise<WishlistItem[]> => {
  return serverGet<WishlistItem[]>('/wishlist');
});

export const getWishlistCheck = cache(async (ids: string[]): Promise<Record<string, boolean>> => {
  if (ids.length === 0) return {};
  return serverGet<Record<string, boolean>>(`/wishlist/check?ids=${ids.join(',')}`);
});
