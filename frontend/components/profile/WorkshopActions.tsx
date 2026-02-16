'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { WorkshopStatus } from '@skillity/shared';
import type { Workshop } from '@skillity/shared';
import { Button } from '@/components/ui/button';
import { updateWorkshopStatus } from '@/actions/workshops';
import FormModal from '@/components/modals/FormModal';
import EditWorkshopForm from '@/components/workshops/EditWorkshopForm';
import CreateWorkshopForm from '@/components/workshops/CreateWorkshopForm';

interface WorkshopActionsProps {
  workshop: Workshop;
}

export default function WorkshopActions({ workshop }: WorkshopActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: WorkshopStatus) => {
    startTransition(async () => {
      const result = await updateWorkshopStatus(workshop.id, newStatus);
      if (!result.error) {
        router.refresh();
      }
    });
  };

  const isPast =
    workshop.status === WorkshopStatus.COMPLETED ||
    workshop.status === WorkshopStatus.CANCELLED;

  if (isPast) {
    return (
      <div className="flex items-center gap-2 shrink-0">
        <FormModal
          trigger={<Button size="sm" variant="outline">Recreate</Button>}
          title="Recreate workshop"
          description="Create a new workshop based on this one. Pick a new date."
          onSuccess={() => router.refresh()}
        >
          {({ onSuccess }) => (
            <CreateWorkshopForm
              onSuccess={onSuccess}
              defaultValues={{
                title: workshop.title,
                description: workshop.description,
                maxParticipants: workshop.maxParticipants,
                ticketPrice: workshop.ticketPrice,
                location: workshop.location,
              }}
            />
          )}
        </FormModal>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <FormModal
        trigger={<Button size="sm" variant="outline">Edit</Button>}
        title="Edit workshop"
        description="Update your workshop details."
        onSuccess={() => router.refresh()}
      >
        {({ onSuccess }) => (
          <EditWorkshopForm workshop={workshop} onSuccess={onSuccess} />
        )}
      </FormModal>
      {workshop.status === WorkshopStatus.DRAFT && (
        <Button
          size="sm"
          onClick={() => handleStatusChange(WorkshopStatus.PUBLISHED)}
          disabled={isPending}
        >
          {isPending ? 'Publishing...' : 'Publish'}
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleStatusChange(WorkshopStatus.CANCELLED)}
        disabled={isPending}
      >
        Cancel
      </Button>
    </div>
  );
}
