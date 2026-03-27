import { redirect, Link } from 'react-router';
import { ApiError } from '@/lib/api-client.server';
import { format } from 'date-fns';
import type { Route } from './+types/profile.workshops';
import { getSession } from '@/lib/session.server';
import { getMyWorkshops } from '@/lib/workshops.server';
import { getWorkshopBookings } from '@/lib/bookings.server';
import { WorkshopStatus, CATEGORY_LABELS } from '@skillity/shared';
import type { Workshop, WorkshopBooking } from '@skillity/shared';
import { cn } from '@/lib/utils';
import MyWorkshopsHeader from '@/components/profile/MyWorkshopsHeader';
import WorkshopActions from '@/components/profile/WorkshopActions';
import WorkshopParticipants from '@/components/profile/WorkshopParticipants';

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  if (!session?.user) return redirect('/login?redirect=/profile/workshops');
  if (session.user.role !== 'host' && session.user.role !== 'admin') {
    return redirect('/profile');
  }

  let workshops: Workshop[] = [];
  try {
    workshops = await getMyWorkshops(request);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401)
      return redirect('/login?redirect=/profile/workshops');
    throw err;
  }

  const upcoming = workshops.filter(
    (w) =>
      w.status === WorkshopStatus.DRAFT ||
      w.status === WorkshopStatus.PUBLISHED,
  );
  const past = workshops.filter(
    (w) =>
      w.status === WorkshopStatus.COMPLETED ||
      w.status === WorkshopStatus.CANCELLED,
  );

  const bookingsMap: Record<string, WorkshopBooking[]> = {};
  await Promise.all(
    upcoming
      .filter((w) => w.status === WorkshopStatus.PUBLISHED)
      .map(async (w) => {
        try {
          bookingsMap[w.id] = await getWorkshopBookings(request, w.id);
        } catch {
          bookingsMap[w.id] = [];
        }
      }),
  );

  const seriesCounts: Record<string, number> = {};
  for (const w of workshops) {
    if (w.seriesId) {
      seriesCounts[w.seriesId] = (seriesCounts[w.seriesId] ?? 0) + 1;
    }
  }

  return { upcoming, past, bookingsMap, seriesCounts };
}

export function meta() {
  return [{ title: 'My Workshops | Skillity' }];
}

function StatusBadge({ status }: { status: WorkshopStatus }) {
  const config = {
    [WorkshopStatus.DRAFT]: {
      label: 'Draft',
      className: 'bg-yellow-500/10 text-yellow-600',
    },
    [WorkshopStatus.PUBLISHED]: {
      label: 'Published',
      className: 'bg-green-500/10 text-green-600',
    },
    [WorkshopStatus.CANCELLED]: {
      label: 'Cancelled',
      className: 'bg-destructive/10 text-destructive',
    },
    [WorkshopStatus.COMPLETED]: {
      label: 'Completed',
      className: 'bg-muted text-muted-foreground',
    },
  };
  const { label, className } = config[status];
  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-0.5 text-xs font-medium',
        className,
      )}
    >
      {label}
    </span>
  );
}

function WorkshopRow({
  workshop,
  dimmed,
  dateCount,
  bookings,
}: {
  workshop: Workshop;
  dimmed?: boolean;
  dateCount?: number;
  bookings?: WorkshopBooking[];
}) {
  return (
    <div
      className={cn('rounded-xl border bg-card p-5', dimmed && 'opacity-60')}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-1">
            <Link
              to={`/workshops/${workshop.id}`}
              className="font-medium truncate hover:underline"
            >
              {workshop.title}
            </Link>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {CATEGORY_LABELS[workshop.category]}
            </span>
            <StatusBadge status={workshop.status} />
            {dateCount && dateCount > 1 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {dateCount} dates
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {workshop.startsAt && (
              <span>{format(new Date(workshop.startsAt), 'MMM d, yyyy')}</span>
            )}
            {workshop.startsAt && workshop.endsAt && (
              <span>
                {format(new Date(workshop.startsAt), 'HH:mm')} -{' '}
                {format(new Date(workshop.endsAt), 'HH:mm')}
              </span>
            )}
            <span>
              {workshop.participantCount} / {workshop.maxParticipants}{' '}
              participants
            </span>
          </div>
          {workshop.pendingCount !== undefined && (
            <div className="flex items-center gap-4 mt-2 text-xs">
              <span className="text-green-600">
                {workshop.participantCount} confirmed
              </span>
              {(workshop.pendingCount ?? 0) > 0 && (
                <span className="text-yellow-600">
                  {workshop.pendingCount} pending
                </span>
              )}
              <span className="text-muted-foreground">
                Est. revenue: {workshop.estimatedRevenue?.toFixed(2)} EUR
              </span>
            </div>
          )}
        </div>
        <WorkshopActions workshop={workshop} />
      </div>
      {bookings && bookings.length > 0 && (
        <div className="mt-3 border-t pt-3">
          <WorkshopParticipants bookings={bookings} />
        </div>
      )}
    </div>
  );
}

export default function MyWorkshopsPage({ loaderData }: Route.ComponentProps) {
  const { upcoming, past, bookingsMap, seriesCounts } = loaderData;

  return (
    <div className="space-y-6">
      <MyWorkshopsHeader />

      {upcoming.length === 0 && past.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            No workshops yet. Create your first one above.
          </p>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="space-y-4">
          {upcoming.map((workshop) => (
            <WorkshopRow
              key={workshop.id}
              workshop={workshop}
              dateCount={
                workshop.seriesId ? seriesCounts[workshop.seriesId] : undefined
              }
              bookings={bookingsMap[workshop.id]}
            />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Past workshops
          </h3>
          {past.map((workshop) => (
            <WorkshopRow
              key={workshop.id}
              workshop={workshop}
              dimmed
              dateCount={
                workshop.seriesId ? seriesCounts[workshop.seriesId] : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
