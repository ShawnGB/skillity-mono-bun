import { useFetcher } from 'react-router';
import { WorkshopStatus } from '@skillity/shared';
import type { Workshop } from '@skillity/shared';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import FormModal from '@/components/modals/FormModal';
import EditWorkshopForm, {
  ConductorsSection,
} from '@/components/workshops/EditWorkshopForm';
import CreateWorkshopForm from '@/components/workshops/CreateWorkshopForm';

interface WorkshopActionsProps {
  workshop: Workshop;
}

export default function WorkshopActions({ workshop }: WorkshopActionsProps) {
  const fetcher = useFetcher();
  const isPending = fetcher.state !== 'idle';

  const isPast =
    workshop.status === WorkshopStatus.COMPLETED ||
    workshop.status === WorkshopStatus.CANCELLED;

  const seriesDefaults = {
    title: workshop.title,
    category: workshop.category,
    description: workshop.description,
    maxParticipants: workshop.maxParticipants,
    ticketPrice: workshop.ticketPrice,
    location: workshop.location,
    seriesId: workshop.seriesId ?? undefined,
  };

  if (isPast) {
    return (
      <div className="flex items-center gap-2 shrink-0">
        <FormModal
          trigger={
            <Button size="sm" variant="outline">
              Recreate
            </Button>
          }
          title="Recreate workshop"
          description="Create a new workshop based on this one. Pick a new date."
        >
          {({ onSuccess }) => (
            <CreateWorkshopForm
              onSuccess={onSuccess}
              defaultValues={seriesDefaults}
            />
          )}
        </FormModal>
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
      <FormModal
        trigger={
          <Button size="sm" variant="outline">
            Add Date
          </Button>
        }
        title="Add another date"
        description="Create a new session for this workshop on a different date."
      >
        {({ onSuccess }) => (
          <CreateWorkshopForm
            onSuccess={onSuccess}
            defaultValues={seriesDefaults}
          />
        )}
      </FormModal>
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
