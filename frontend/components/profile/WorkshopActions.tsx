import { useFetcher, Link } from 'react-router';
import { useState } from 'react';
import { WorkshopStatus } from '@skillity/shared';
import type { Workshop } from '@skillity/shared';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import FormModal from '@/components/modals/FormModal';
import EditWorkshopForm, {
  ConductorsSection,
} from '@/components/workshops/EditWorkshopForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

interface WorkshopActionsProps {
  workshop: Workshop;
}

function readinessItems(workshop: Workshop) {
  return [
    { label: 'Title', ok: !!workshop.title },
    { label: 'Description', ok: !!workshop.description },
    { label: 'Date & time', ok: !!workshop.startsAt },
    { label: 'Location', ok: !!workshop.location },
    { label: 'Pricing set', ok: workshop.ticketPrice !== undefined && workshop.ticketPrice !== null },
    { label: 'Cover photo', ok: !!workshop.coverImageUrl },
  ];
}

function PublishGate({ workshop }: { workshop: Workshop }) {
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);
  const isPending = fetcher.state !== 'idle';
  const items = readinessItems(workshop);
  const allReady = items.every((i) => i.ok);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Publish</Button>
      </DialogTrigger>
      <DialogContent>
          <DialogHeader>
            <DialogTitle>Ready to publish?</DialogTitle>
            <DialogDescription>
              Check that your workshop has everything attendees need before it goes live.
            </DialogDescription>
          </DialogHeader>

          <ul className="space-y-2 py-2">
            {items.map(({ label, ok }) => (
              <li key={label} className="flex items-center gap-3 text-sm">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    ok ? 'bg-green-500/15 text-green-600' : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {ok ? <Check className="size-3" /> : <X className="size-3" />}
                </span>
                <span className={ok ? '' : 'text-destructive font-medium'}>{label}</span>
                {!ok && label === 'Cover photo' && (
                  <span className="text-xs text-muted-foreground ml-auto">
                    Use Edit to add one
                  </span>
                )}
              </li>
            ))}
          </ul>

          {!allReady && (
            <p className="text-xs text-muted-foreground rounded-lg bg-muted px-3 py-2">
              Fix the items above before publishing so attendees have all the information they need.
            </p>
          )}

          <fetcher.Form
            method="post"
            action={`/api/workshops/${workshop.id}/status`}
            onSubmit={() => setOpen(false)}
          >
            <input type="hidden" name="status" value={WorkshopStatus.PUBLISHED} />
            <Button type="submit" className="w-full" disabled={!allReady || isPending}>
              {isPending ? 'Publishing…' : 'Publish workshop'}
            </Button>
          </fetcher.Form>
        </DialogContent>
    </Dialog>
  );
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
        <PublishGate workshop={workshop} />
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
