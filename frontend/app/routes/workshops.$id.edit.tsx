import { data, redirect, Link, useFetcher } from 'react-router';
import { format } from 'date-fns';
import { CheckCircle2 } from 'lucide-react';
import type { Route } from './+types/workshops.$id.edit';
import { sessionContext } from '@/app/context';
import { getWorkshop } from '@/lib/workshops.server';
import EditWorkshopForm, {
  ConductorsSection,
} from '@/components/workshops/EditWorkshopForm';
import { WorkshopStatus, CATEGORY_LABELS } from '@skillity/shared';
import type { Workshop } from '@skillity/shared';
import { Button } from '@/components/ui/button';

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const session = context.get(sessionContext);
  if (!session)
    return redirect(`/login?redirect=/workshops/${params.id}/edit`);

  let workshop;
  try {
    workshop = await getWorkshop(request, params.id);
  } catch {
    throw data(null, { status: 404 });
  }

  if (workshop.hostId !== session.user.id && session.user.role !== 'admin') {
    return redirect('/profile/workshops');
  }

  const url = new URL(request.url);
  const justCreated = url.searchParams.get('created') === '1';

  return { workshop, justCreated };
}

export function meta({ data: loaderData }: Route.MetaArgs) {
  return [
    {
      title: loaderData?.workshop
        ? `Edit ${loaderData.workshop.title} | Skillity`
        : 'Edit Workshop | Skillity',
    },
  ];
}

function WorkshopCreatedView({ workshop }: { workshop: Workshop }) {
  const publishFetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const isPublishing = publishFetcher.state !== 'idle';
  const publishedNow = publishFetcher.state === 'idle' && publishFetcher.data?.ok;
  const isAlreadyPublished = workshop.status === WorkshopStatus.PUBLISHED;
  const showPublished = publishedNow || isAlreadyPublished;

  const addDateParams = new URLSearchParams({
    title: workshop.title,
    category: workshop.category,
    description: workshop.description,
    maxParticipants: String(workshop.maxParticipants),
    ticketPrice: String(workshop.ticketPrice),
    location: workshop.location,
    ...(workshop.seriesId ? { seriesId: workshop.seriesId } : {}),
  });

  return (
    <main className="container mx-auto px-4 py-12 max-w-2xl space-y-6">

      {/* 1. Confirmation header */}
      <div className="flex items-start gap-3">
        <CheckCircle2 className="size-8 text-green-500 shrink-0 mt-0.5" />
        <div>
          <h1 className="text-3xl leading-tight">{workshop.title}</h1>
          <p className="text-muted-foreground mt-1">Your workshop has been saved.</p>
        </div>
      </div>

      {/* 2. Primary action — publish or view */}
      {showPublished ? (
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-500/10 text-green-600">
              Published
            </span>
            <p className="text-sm text-muted-foreground">
              Your workshop is live and open for registrations.
            </p>
          </div>
          <Button size="lg" className="w-full" asChild>
            <Link to={`/workshops/${workshop.id}`}>View Workshop →</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold mb-0.5">Ready to go live?</p>
              <p className="text-sm text-muted-foreground">
                Right now your workshop is a draft — only you can see it.
                Publish when you're ready to open registrations. You can still
                edit details after publishing.
              </p>
            </div>
            <span className="shrink-0 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-500/10 text-yellow-600">
              Draft
            </span>
          </div>
          <publishFetcher.Form
            method="post"
            action={`/api/workshops/${workshop.id}/status`}
          >
            <input type="hidden" name="status" value={WorkshopStatus.PUBLISHED} />
            <Button type="submit" size="lg" disabled={isPublishing} className="w-full">
              {isPublishing ? 'Publishing…' : 'Publish Workshop'}
            </Button>
          </publishFetcher.Form>
          {publishFetcher.data?.error && (
            <p className="text-sm text-destructive">{publishFetcher.data.error}</p>
          )}
        </div>
      )}

      {/* 3. Details summary — verify what was saved */}
      <div className="rounded-xl border bg-card p-6 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Workshop summary</h2>
          <Link
            to={`/workshops/${workshop.id}/edit`}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Edit details
          </Link>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-muted-foreground">
          <span>Category</span>
          <span className="text-foreground font-medium">
            {CATEGORY_LABELS[workshop.category]}
          </span>
          {workshop.startsAt && (
            <>
              <span>Date</span>
              <span className="text-foreground font-medium">
                {format(new Date(workshop.startsAt), 'EEEE, MMMM d, yyyy')}
              </span>
              <span>Time</span>
              <span className="text-foreground font-medium">
                {format(new Date(workshop.startsAt), 'HH:mm')}
                {workshop.endsAt && ` – ${format(new Date(workshop.endsAt), 'HH:mm')}`}
              </span>
            </>
          )}
          <span>Location</span>
          <span className="text-foreground font-medium">{workshop.location}</span>
          <span>Capacity</span>
          <span className="text-foreground font-medium">{workshop.maxParticipants} spots</span>
          <span>Price</span>
          <span className="text-foreground font-medium">
            {workshop.ticketPrice > 0
              ? `€${Number(workshop.ticketPrice).toFixed(2)}`
              : 'Free'}
          </span>
        </div>
        {workshop.description && (
          <p className="text-muted-foreground text-xs leading-relaxed pt-2 border-t">
            {workshop.description}
          </p>
        )}
      </div>

      {/* 4. Co-conductors */}
      {workshop.conductors !== undefined && (
        <div className="rounded-xl border bg-card p-6">
          <ConductorsSection
            workshopId={workshop.id}
            conductors={workshop.conductors}
            ticketPrice={workshop.ticketPrice}
            maxParticipants={workshop.maxParticipants}
          />
        </div>
      )}

      {/* 5. Add another date — low priority */}
      <div className="rounded-xl border border-dashed p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Running this again?</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create another date with the same details pre-filled.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/workshops/new?${addDateParams}`}>Add another date</Link>
        </Button>
      </div>

    </main>
  );
}

export default function EditWorkshopPage({ loaderData }: Route.ComponentProps) {
  const { workshop, justCreated } = loaderData;

  if (justCreated) {
    return <WorkshopCreatedView workshop={workshop} />;
  }

  return (
    <main className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl mb-8">Edit Workshop</h1>
      <div className="space-y-6">
        <div className="rounded-xl border bg-card p-6">
          <EditWorkshopForm workshop={workshop} />
        </div>
        {workshop.conductors !== undefined && (
          <div className="rounded-xl border bg-card p-6">
            <ConductorsSection
              workshopId={workshop.id}
              conductors={workshop.conductors}
              ticketPrice={workshop.ticketPrice}
              maxParticipants={workshop.maxParticipants}
            />
          </div>
        )}
      </div>
    </main>
  );
}
