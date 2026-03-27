export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  userId: string;
  workshopId: string;
  seriesId: string | null;
  reviewerName: string;
  workshopDate: string | null;
  createdAt: string;
}

export interface CreateReviewInput {
  rating: number;
  comment?: string;
}
