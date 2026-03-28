import { cn } from '@/lib/utils';

interface BrandNameProps {
  className?: string;
}

export function BrandName({ className }: BrandNameProps) {
  return (
    <span className={cn('font-sans tracking-tight', className)}>
      <span className="font-serif">u</span>
      <span className="text-muted-foreground">/</span>
      skillity
    </span>
  );
}
