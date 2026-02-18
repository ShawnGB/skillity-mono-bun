import type { Workshop } from './workshop';

export interface WishlistItem {
  id: string;
  workshopId: string;
  workshop: Workshop;
  createdAt: string;
}

export interface WishlistToggleResult {
  saved: boolean;
}
