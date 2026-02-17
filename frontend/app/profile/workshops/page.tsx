import Link from 'next/link';
import { format } from 'date-fns';
import { getMyWorkshops } from '@/data/workshops';
import { WorkshopStatus } from '@skillity/shared';
import type { Workshop } from '@skillity/shared';
import { cn } from '@/lib/utils';
import MyWorkshopsHeader from '@/components/profile/MyWorkshopsHeader';
import WorkshopActions from '@/components/profile/WorkshopActions';

function StatusBadge({ status }: { status: WorkshopStatus }) {
  const config = {
    [WorkshopStatus.DRAFT]: { label: 'Draft', className: 'bg-yellow-500/10 text-yellow-600' },
    [WorkshopStatus.PUBLISHED]: { label: 'Published', className: 'bg-green-500/10 text-green-600' },
    [WorkshopStatus.CANCELLED]: { label: 'Cancelled', className: 'bg-destructive/10 text-destructive' },
    [WorkshopStatus.COMPLETED]: { label: 'Completed', className: 'bg-muted text-muted-foreground' },
  };

  const { label, className } = config[status];

  return (
    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', className)}>
      {label}
    </span>
  );
}

function WorkshopRow({ workshop, dimmed }: { workshop: Workshop; dimmed?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 rounded-xl border bg-card p-5',
        dimmed && 'opacity-60',
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 mb-1">
          <Link
            href={`/workshops/${workshop.id}`}
            className="font-medium truncate hover:underline"
          >
            {workshop.title}
          </Link>
          <StatusBadge status={workshop.status} />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {workshop.startsAt && (
            <span>{format(new Date(workshop.startsAt), 'MMM d, yyyy')}</span>
          )}
          {workshop.startsAt && workshop.endsAt && (
            <span>
              {format(new Date(workshop.startsAt), 'HH:mm')} - {format(new Date(workshop.endsAt), 'HH:mm')}
            </span>
          )}
          <span>
            {workshop.participantCount} / {workshop.maxParticipants} participants
          </span>
        </div>
      </div>
      <WorkshopActions workshop={workshop} />
    </div>
  );
}

export default async function MyWorkshopsPage() {
  let workshops;
  try {
    workshops = await getMyWorkshops();
  } catch {
    workshops = [];
  }

  const upcoming = (workshops ?? []).filter(
    (w) =>
      w.status === WorkshopStatus.DRAFT ||
      w.status === WorkshopStatus.PUBLISHED,
  );

  const past = (workshops ?? []).filter(
    (w) =>
      w.status === WorkshopStatus.COMPLETED ||
      w.status === WorkshopStatus.CANCELLED,
  );

  return (
    <div className="space-y-6">
      <MyWorkshopsHeader />

      {upcoming.length === 0 && past.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No workshops yet. Create your first one above.</p>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="space-y-4">
          {upcoming.map((workshop) => (
            <WorkshopRow key={workshop.id} workshop={workshop} />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Past workshops</h3>
          {past.map((workshop) => (
            <WorkshopRow key={workshop.id} workshop={workshop} dimmed />
          ))}
        </div>
      )}
    </div>
  );
}
