import { useEffect, useState } from 'react';
import { useFetcher } from 'react-router';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ReviewFormProps {
  workshopId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ workshopId, onSuccess }: ReviewFormProps) {
  const fetcher = useFetcher<{ error?: string }>();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const isPending = fetcher.state !== 'idle';
  const displayRating = hoveredRating || rating;

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data && !fetcher.data.error) {
      onSuccess();
    }
  }, [fetcher.state, fetcher.data, onSuccess]);

  return (
    <fetcher.Form
      method="post"
      action={`/api/reviews/${workshopId}`}
      className="space-y-4"
    >
      {fetcher.data?.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {fetcher.data.error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Rating</label>
        <input type="hidden" name="rating" value={rating} />
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
          name="comment"
          placeholder="Share your experience..."
          maxLength={2000}
          rows={4}
        />
      </div>

      <Button type="submit" disabled={isPending || rating === 0}>
        {isPending ? 'Submitting...' : 'Submit Review'}
      </Button>
    </fetcher.Form>
  );
}
