import { useFetcher, Link } from 'react-router';
import { WorkshopStatus } from '@skillity/shared';
import type { Workshop } from '@skillity/shared';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import FormModal from '@/components/modals/FormModal';
import EditWorkshopForm, {
  ConductorsSection,
} from '@/components/workshops/EditWorkshopForm';

interface WorkshopActionsProps {
  workshop: Workshop;
}

export default function WorkshopActions({ workshop }: WorkshopActionsProps) {
  const fetcher = useFetcher();
  const isPending = fetcher.state !== 'idle';

  const isPast =
    workshop.status === WorkshopStatus.COMPLETED ||
    workshop.status === WorkshopStatus.CANCELLED;

  const newWorkshopParams = new URLSearchParams({
    title: workshop.title,
    category: workshop.category,
    description: workshop.description,
    maxParticipants: String(workshop.maxParticipants),
    ticketPrice: String(workshop.ticketPrice),
    location: workshop.location,
    ...(workshop.seriesId ? { seriesId: workshop.seriesId } : {}),
  });

  if (isPast) {
    return (
      <div className="flex items-center gap-2 shrink-0">
        <Button size="sm" variant="outline" asChild>
          <Link to={`/workshops/new?${newWorkshopParams}`}>Recreate</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <FormModal
        trigger={
          <Button size="sm" variant="outline">
            Edit
          </Button>
        }
        title="Edit workshop"
        description="Update your workshop details."
      >
        {({ onSuccess }) => (
          <div className="space-y-6">
            <EditWorkshopForm workshop={workshop} onSuccess={onSuccess} />
            {workshop.conductors && (
              <ConductorsSection
                workshopId={workshop.id}
                conductors={workshop.conductors}
                ticketPrice={workshop.ticketPrice}
                maxParticipants={workshop.maxParticipants}
              />
            )}
          </div>
        )}
      </FormModal>
      <Button size="sm" variant="outline" asChild>
        <Link to={`/workshops/new?${newWorkshopParams}`}>Add Date</Link>
      </Button>
      {workshop.status === WorkshopStatus.DRAFT && (
        <fetcher.Form
          method="post"
          action={`/api/workshops/${workshop.id}/status`}
        >
          <input type="hidden" name="status" value={WorkshopStatus.PUBLISHED} />
          <Button size="sm" type="submit" disabled={isPending}>
            {isPending ? 'Publishing...' : 'Publish'}
          </Button>
        </fetcher.Form>
      )}
      <ConfirmDialog
        trigger={
          <Button size="sm" variant="outline" disabled={isPending}>
            Cancel
          </Button>
        }
        title="Cancel workshop?"
        description="This will cancel your workshop and notify any booked participants. This action cannot be undone."
        confirmLabel="Yes, cancel workshop"
        onConfirm={() => {
          fetcher.submit(
            { status: WorkshopStatus.CANCELLED },
            { method: 'post', action: `/api/workshops/${workshop.id}/status` },
          );
        }}
      />
    </div>
  );
}
