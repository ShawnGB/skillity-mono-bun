'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { submitReview } from '@/actions/reviews';

interface ReviewFormProps {
  workshopId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ workshopId, onSuccess }: ReviewFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const displayRating = hoveredRating || rating;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setError(null);
    startTransition(async () => {
      const result = await submitReview(workshopId, {
        rating,
        ...(comment.trim() ? { comment: comment.trim() } : {}),
      });
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
        onSuccess();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Rating</label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHoveredRating(i + 1)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(i + 1)}
              className="p-0.5"
            >
              <Star
                size={24}
                className={
                  i < displayRating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground/30'
                }
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Comment (optional)</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          maxLength={2000}
          rows={4}
        />
      </div>

      <Button type="submit" disabled={isPending || rating === 0}>
        {isPending ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
