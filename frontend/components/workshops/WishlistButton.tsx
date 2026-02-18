'use client';

import { useOptimistic, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toggleWishlist } from '@/actions/wishlist';

interface WishlistButtonProps {
  workshopId: string;
  isSaved: boolean;
  className?: string;
}

export default function WishlistButton({ workshopId, isSaved, className }: WishlistButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticSaved, setOptimisticSaved] = useOptimistic(isSaved);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      setOptimisticSaved(!optimisticSaved);
      await toggleWishlist(workshopId);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        'rounded-full p-1.5 transition-colors',
        optimisticSaved
          ? 'text-red-500 hover:text-red-600'
          : 'text-white/70 hover:text-white',
        className,
      )}
      aria-label={optimisticSaved ? 'Remove from saved' : 'Save workshop'}
    >
      <Heart
        className={cn('size-5', optimisticSaved && 'fill-current')}
      />
    </button>
  );
}
