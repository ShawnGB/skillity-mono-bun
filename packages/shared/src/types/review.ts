export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  userId: string;
  workshopId: string;
  reviewerName: string;
  createdAt: string;
}

export interface CreateReviewInput {
  rating: number;
  comment?: string;
}
