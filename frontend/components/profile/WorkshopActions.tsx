'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { WorkshopStatus } from '@skillity/shared';
import { Button } from '@/components/ui/button';
import { updateWorkshopStatus } from '@/actions/workshops';

interface WorkshopActionsProps {
  workshopId: string;
  status: WorkshopStatus;
}

export default function WorkshopActions({ workshopId, status }: WorkshopActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: WorkshopStatus) => {
    startTransition(async () => {
      const result = await updateWorkshopStatus(workshopId, newStatus);
      if (!result.error) {
        router.refresh();
      }
    });
  };

  if (status === WorkshopStatus.COMPLETED || status === WorkshopStatus.CANCELLED) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      {status === WorkshopStatus.DRAFT && (
        <Button
          size="sm"
          onClick={() => handleStatusChange(WorkshopStatus.PUBLISHED)}
          disabled={isPending}
        >
          {isPending ? 'Publishing...' : 'Publish'}
        </Button>
      )}
      {(status === WorkshopStatus.DRAFT || status === WorkshopStatus.PUBLISHED) && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleStatusChange(WorkshopStatus.CANCELLED)}
          disabled={isPending}
        >
          Cancel
        </Button>
      )}
    </div>
  );
}
