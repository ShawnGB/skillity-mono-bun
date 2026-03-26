import { useFetcher, Link } from "react-router";
import { WorkshopStatus } from "@skillity/shared";
import type { Workshop } from "@skillity/shared";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";

interface WorkshopActionsProps {
  workshop: Workshop;
}

export default function WorkshopActions({ workshop }: WorkshopActionsProps) {
  const fetcher = useFetcher();
  const isPending = fetcher.state !== "idle";

  const isPast =
    workshop.status === WorkshopStatus.COMPLETED ||
    workshop.status === WorkshopStatus.CANCELLED;

  if (isPast) {
    return (
      <div className="flex items-center gap-2 shrink-0">
        <Button asChild size="sm" variant="outline">
          <Link to={`/workshops/new?seriesId=${workshop.seriesId ?? ""}&from=${workshop.id}`}>
            Recreate
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Button asChild size="sm" variant="outline">
        <Link to={`/workshops/${workshop.id}/edit`}>Edit</Link>
      </Button>
      <Button asChild size="sm" variant="outline">
        <Link to={`/workshops/new?seriesId=${workshop.seriesId ?? ""}&from=${workshop.id}`}>
          Add Date
        </Link>
      </Button>
      {workshop.status === WorkshopStatus.DRAFT && (
        <fetcher.Form method="post" action={`/api/workshops/${workshop.id}/status`}>
          <input type="hidden" name="status" value={WorkshopStatus.PUBLISHED} />
          <Button size="sm" type="submit" disabled={isPending}>
            {isPending ? "Publishing..." : "Publish"}
          </Button>
        </fetcher.Form>
      )}
      <ConfirmDialog
        trigger={<Button size="sm" variant="outline" disabled={isPending}>Cancel</Button>}
        title="Cancel workshop?"
        description="This will cancel your workshop and notify any booked participants. This action cannot be undone."
        confirmLabel="Yes, cancel workshop"
        onConfirm={() => {
          fetcher.submit(
            { status: WorkshopStatus.CANCELLED },
            { method: "post", action: `/api/workshops/${workshop.id}/status` },
          );
        }}
      />
    </div>
  );
}
