import { format } from 'date-fns';
import type { Review } from '@skillity/shared';
import StarRating from '@/components/ui/star-rating';

interface ReviewsListProps {
  reviews: Review[];
}

export default function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No reviews yet.</p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-lg border p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{review.reviewerName}</span>
              <StarRating rating={review.rating} size="sm" />
            </div>
            <span className="text-xs text-muted-foreground">
              {format(new Date(review.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
          {review.comment && (
            <p className="text-sm text-muted-foreground">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
