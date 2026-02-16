import Link from 'next/link';
import { format } from 'date-fns';
import { getMyWorkshops } from '@/data/workshops';
import { WorkshopStatus } from '@skillity/shared';
import { cn } from '@/lib/utils';
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

export default async function MyWorkshopsPage() {
  let workshops;
  try {
    workshops = await getMyWorkshops();
  } catch {
    workshops = [];
  }

  if (!workshops || workshops.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">You haven't created any workshops yet.</p>
        <Link
          href="/workshops"
          className="text-sm text-primary hover:underline"
        >
          Go to workshops to create one
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workshops.map((workshop) => {
        const isPast =
          workshop.status === WorkshopStatus.COMPLETED ||
          workshop.status === WorkshopStatus.CANCELLED;

        return (
          <div
            key={workshop.id}
            className={cn(
              'flex items-center justify-between gap-4 rounded-xl border bg-card p-5',
              isPast && 'opacity-60',
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
                  {workshop.participants.length} / {workshop.maxParticipants} participants
                </span>
              </div>
            </div>
            <WorkshopActions workshopId={workshop.id} status={workshop.status} />
          </div>
        );
      })}
    </div>
  );
}
