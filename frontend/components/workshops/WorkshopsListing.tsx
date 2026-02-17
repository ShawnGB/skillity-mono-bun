import Link from 'next/link';
import { format } from 'date-fns';
import { getWorkshops } from '@/data/workshops';
import { WorkshopStatus, WorkshopCategory, CATEGORY_LABELS } from '@skillity/shared';
import { cn } from '@/lib/utils';

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

interface WorkshopsListingProps {
  category?: string;
}

export default async function WorkshopsListing({ category }: WorkshopsListingProps) {
  const workshops = await getWorkshops(category);

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

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/workshops"
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
            href={`/workshops?category=${cat}`}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <StatusBadge status={workshop.status} />
                <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                  {workshop.startsAt && (
                    <p className="text-xs text-white/70 font-medium uppercase tracking-wider mb-1">
                      {format(new Date(workshop.startsAt), 'MMM d, yyyy')}
                    </p>
                  )}
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
