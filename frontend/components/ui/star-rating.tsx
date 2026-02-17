import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md';
}

export default function StarRating({ rating, size = 'sm' }: StarRatingProps) {
  const px = size === 'sm' ? 14 : 18;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={px}
          className={
            i < Math.round(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-muted-foreground/30'
          }
        />
      ))}
    </div>
  );
}
