import { useOptimistic, startTransition } from 'react';
import { useFetcher } from 'react-router';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  workshopId: string;
  isSaved: boolean;
  className?: string;
}

export default function WishlistButton({
  workshopId,
  isSaved,
  className,
}: WishlistButtonProps) {
  const fetcher = useFetcher();
  const [optimisticSaved, setOptimisticSaved] = useOptimistic(isSaved);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const intent = optimisticSaved ? 'remove' : 'save';
    startTransition(() => {
      setOptimisticSaved(!optimisticSaved);
      fetcher.submit(
        { intent },
        { method: 'post', action: `/api/wishlist/${workshopId}` },
      );
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'rounded-full p-1.5 transition-colors',
        optimisticSaved
          ? 'text-red-500 hover:text-red-600'
          : 'text-white/70 hover:text-white',
        className,
      )}
      aria-label={optimisticSaved ? 'Remove from saved' : 'Save workshop'}
    >
      <Heart className={cn('size-5', optimisticSaved && 'fill-current')} />
    </button>
  );
}
