import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getCategoryStyle } from '@/lib/category-fallback';
import type { WorkshopCategory } from '@skillity/shared';

interface WorkshopCoverImageProps {
  coverImageUrl?: string | null;
  coverImageAttribution?: string | null;
  category?: WorkshopCategory;
  className?: string;
  imageClassName?: string;
}

export function WorkshopCoverImage({
  coverImageUrl,
  coverImageAttribution,
  category,
  className,
  imageClassName,
}: WorkshopCoverImageProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br',
          getCategoryStyle(category as WorkshopCategory).gradient,
        )}
      />
      {coverImageUrl && !imgError && (
        <img
          src={coverImageUrl}
          alt=""
          onError={() => setImgError(true)}
          className={cn('absolute inset-0 w-full h-full object-cover', imageClassName)}
        />
      )}
      {coverImageUrl && !imgError && coverImageAttribution && (
        <p className="absolute bottom-1 right-2 text-[10px] text-white/60">
          {coverImageAttribution}
        </p>
      )}
    </div>
  );
}
