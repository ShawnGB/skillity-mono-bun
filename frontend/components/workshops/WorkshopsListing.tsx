import Link from 'next/link';
import { format } from 'date-fns';
import { getWorkshops } from '@/data/workshops';
import { getSession } from '@/data/auth';
import { getWishlistCheck } from '@/data/wishlist';
import { WorkshopStatus, WorkshopCategory, WorkshopLevel, CATEGORY_LABELS, LEVEL_LABELS } from '@skillity/shared';
import { cn } from '@/lib/utils';
import WishlistButton from '@/components/workshops/WishlistButton';

function StatusBadge({ status }: { status: WorkshopStatus }) {
  if (status === WorkshopStatus.PUBLISHED) return null;

  const config = {
    [WorkshopStatus.COMPLETED]: { label: 'Past', className: 'bg-muted text-muted-foreground' },
    [WorkshopStatus.CANCELLED]: { label: 'Cancelled', className: 'bg-destructive/80 text-white' },
    [WorkshopStatus.DRAFT]: { label: 'Draft', className: 'bg-yellow-500/80 text-white' },
    [WorkshopStatus.PUBLISHED]: { label: '', className: '' },
  };

  const { label, className } = config[status];

  return (
    <span
      className={cn(
        'absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-xs font-medium',
        className,
      )}
    >
      {label}
    </span>
  );
}

function buildFilterUrl(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) qs.set(key, value);
  }
  const str = qs.toString();
  return str ? `/workshops?${str}` : '/workshops';
}

interface WorkshopsListingProps {
  category?: string;
  level?: string;
  search?: string;
}

export default async function WorkshopsListing({ category, level, search }: WorkshopsListingProps) {
  const workshops = await getWorkshops(category, level, search);

  const visible = (workshops ?? []).filter(
    (w) => w.status !== WorkshopStatus.DRAFT,
  );

  const upcoming = visible.filter(
    (w) => w.status === WorkshopStatus.PUBLISHED,
  );
  const past = visible.filter(
    (w) => w.status === WorkshopStatus.COMPLETED || w.status === WorkshopStatus.CANCELLED,
  );
  const sorted = [...upcoming, ...past];

  const session = await getSession();
  const isAuthenticated = !!session?.user;
  let wishlistMap: Record<string, boolean> = {};
  if (isAuthenticated && sorted.length > 0) {
    try {
      wishlistMap = await getWishlistCheck(sorted.map((w) => w.id));
    } catch {
      wishlistMap = {};
    }
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href={buildFilterUrl({ level, search })}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            !category
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80',
          )}
        >
          All
        </Link>
        {Object.values(WorkshopCategory).map((cat) => (
          <Link
            key={cat}
            href={buildFilterUrl({ category: cat, level, search })}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              category === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
            )}
          >
            {CATEGORY_LABELS[cat]}
          </Link>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href={buildFilterUrl({ category, search })}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium transition-colors',
            !level
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80',
          )}
        >
          All Levels
        </Link>
        {Object.values(WorkshopLevel).map((lvl) => (
          <Link
            key={lvl}
            href={buildFilterUrl({ category, level: lvl, search })}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              level === lvl
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
            )}
          >
            {LEVEL_LABELS[lvl]}
          </Link>
        ))}
      </div>

      {sorted.length === 0 ? (
        <p className="text-muted-foreground">No workshops available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((workshop) => {
            const isPast =
              workshop.status === WorkshopStatus.COMPLETED ||
              workshop.status === WorkshopStatus.CANCELLED;

            return (
              <Link
                key={workshop.id}
                href={`/workshops/${workshop.id}`}
                className={cn(
                  'group relative aspect-[3/2] overflow-hidden rounded-xl',
                  isPast && 'opacity-60',
                )}
              >
                <img
                  src={`https://picsum.photos/seed/${workshop.id}/400/300`}
                  alt={workshop.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                <StatusBadge status={workshop.status} />
                {isAuthenticated && (
                  <div className="absolute top-3 left-3 z-10">
                    <WishlistButton
                      workshopId={workshop.id}
                      isSaved={wishlistMap[workshop.id] ?? false}
                    />
                  </div>
                )}
                <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    {workshop.startsAt && (
                      <p className="text-xs text-white/70 font-medium uppercase tracking-wider">
                        {format(new Date(workshop.startsAt), 'MMM d, yyyy')}
                      </p>
                    )}
                    {workshop.level && (
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                        {LEVEL_LABELS[workshop.level]}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-4xl font-bold leading-[0.85] uppercase transition-transform duration-300 group-hover:-translate-y-12">
                    {workshop.title}
                  </h3>
                  <p className="text-sm text-white/80 line-clamp-2 mt-2 translate-y-8 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {workshop.description}
                  </p>
                  <span className="mt-2 text-sm text-white/70 translate-y-8 opacity-0 transition-all duration-300 delay-75 group-hover:translate-y-0 group-hover:opacity-100">
                    See more &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
