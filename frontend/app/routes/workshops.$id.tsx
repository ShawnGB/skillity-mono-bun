import { data, Link, isRouteErrorResponse, useRouteError } from 'react-router';
import { use, Suspense } from 'react';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import type { Route } from './+types/workshops.$id';
import { sessionContext } from '@/app/context';
import {
  getWorkshop,
  getWorkshopReviews,
  getSeriesReviews,
  getSeriesWorkshops,
} from '@/lib/workshops.server';
import { getMyBookings } from '@/lib/bookings.server';
import { getWishlistCheck } from '@/lib/wishlist.server';
import {
  WorkshopStatus,
  WorkshopSource,
  BookingStatus,
  CATEGORY_LABELS,
} from '@skillity/shared';
import type { Review, Workshop } from '@skillity/shared';
import { Button } from '@/components/ui/button';
import RegisterButton from '@/components/workshops/RegisterButton';
import ReviewsList from '@/components/workshops/ReviewsList';
import ReviewButton from '@/components/workshops/ReviewButton';
import WishlistButton from '@/components/workshops/WishlistButton';
import { getAvatarUrl } from '@/lib/avatar';

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const { id } = params;

  let workshop;
  try {
    workshop = await getWorkshop(request, id);
  } catch {
    throw data(null, { status: 404 });
  }

  const session = context.get(sessionContext);
  const isAuthenticated = !!session;

  // Await only what's needed for booking state and the sidebar
  const [bookings, wishlistMap] = await Promise.all([
    session ? getMyBookings(session.cookie) : Promise.resolve([]),
    session
      ? getWishlistCheck(session.cookie, [id]).catch(() => ({}) as Record<string, boolean>)
      : Promise.resolve({} as Record<string, boolean>),
  ]);

  const hasConfirmedBooking = bookings.some(
    (b) => b.workshopId === id && b.status === BookingStatus.CONFIRMED,
  );
  const isSaved = wishlistMap[id] ?? false;
  const spotsLeft = workshop.maxParticipants - workshop.participantCount;

  // Deferred — not needed for above-the-fold content or SEO
  const reviewsPromise = workshop.seriesId
    ? getSeriesReviews(request, workshop.seriesId)
    : getWorkshopReviews(request, id);
  const siblingsPromise = workshop.seriesId
    ? getSeriesWorkshops(request, workshop.seriesId).then((ws) =>
        ws.filter((w) => w.id !== id),
      )
    : Promise.resolve<typeof workshop[]>([]);

  return {
    workshop,
    reviewsPromise,
    siblingsPromise,
    isSaved,
    isAuthenticated,
    hasConfirmedBooking,
    spotsLeft,
    userId: session?.user.id,
  };
}

export function meta({ data: loaderData }: Route.MetaArgs) {
  if (!loaderData?.workshop) return [{ title: 'Workshop | Skillity' }];
  const { workshop } = loaderData;
  const description = workshop.description.slice(0, 160);
  return [
    { title: `${workshop.title} | Skillity` },
    { name: 'description', content: description },
    { property: 'og:title', content: workshop.title },
    { property: 'og:description', content: description },
    {
      property: 'og:image',
      content: `https://picsum.photos/seed/${workshop.id}/1200/630`,
    },
  ];
}

function StatusBadge({ status }: { status: WorkshopStatus }) {
  const config = {
    [WorkshopStatus.DRAFT]: {
      label: 'Draft',
      className: 'bg-yellow-500/10 text-yellow-600',
    },
    [WorkshopStatus.PUBLISHED]: {
      label: 'Upcoming',
      className: 'bg-green-500/10 text-green-600',
    },
    [WorkshopStatus.CANCELLED]: {
      label: 'Cancelled',
      className: 'bg-destructive/10 text-destructive',
    },
    [WorkshopStatus.COMPLETED]: {
      label: 'Past',
      className: 'bg-muted text-muted-foreground',
    },
  };
  const { label, className } = config[status];
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

function WorkshopReviews({
  promise,
  userId,
  workshopStatus,
  hasConfirmedBooking,
  workshopId,
}: {
  promise: Promise<Review[]>;
  userId?: string;
  workshopStatus: WorkshopStatus;
  hasConfirmedBooking: boolean;
  workshopId: string;
}) {
  const reviews = use(promise);
  const alreadyReviewed = reviews.some((r) => r.userId === userId);
  const canReview =
    !!userId &&
    workshopStatus === WorkshopStatus.COMPLETED &&
    hasConfirmedBooking &&
    !alreadyReviewed;
  return (
    <>
      {canReview && <ReviewButton workshopId={workshopId} />}
      <ReviewsList reviews={reviews} />
    </>
  );
}

function SeriesSiblings({ promise }: { promise: Promise<Workshop[]> }) {
  const siblings = use(promise);
  if (!siblings.length) return null;
  return (
    <div>
      <h2 className="text-2xl mb-4">Other available dates</h2>
      <div className="space-y-2">
        {siblings.map((sibling) => (
          <Link
            key={sibling.id}
            to={`/workshops/${sibling.id}`}
            className="flex items-center justify-between rounded-xl border bg-card p-4 hover:bg-accent transition-colors"
          >
            <div>
              <p className="font-medium">
                {sibling.startsAt &&
                  format(new Date(sibling.startsAt), 'EEEE, MMMM d, yyyy')}
              </p>
              {sibling.startsAt && sibling.endsAt && (
                <p className="text-sm text-muted-foreground">
                  {format(new Date(sibling.startsAt), 'HH:mm')} -{' '}
                  {format(new Date(sibling.endsAt), 'HH:mm')}
                </p>
              )}
            </div>
            <ArrowRight className="size-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl">Workshop not found</h1>
          <p className="text-muted-foreground">
            This workshop may have been removed or the link is incorrect.
          </p>
        </div>
      </main>
    );
  }
  throw error;
}

export default function WorkshopDetailPage({
  loaderData,
}: Route.ComponentProps) {
  const {
    workshop,
    reviewsPromise,
    siblingsPromise,
    isSaved,
    isAuthenticated,
    hasConfirmedBooking,
    spotsLeft,
    userId,
  } = loaderData;

  const isCancelled = workshop.status === WorkshopStatus.CANCELLED;
  const isCompleted = workshop.status === WorkshopStatus.COMPLETED;
  const isInactive = isCancelled || isCompleted;
  const isExternal =
    workshop.source === WorkshopSource.EXTERNAL ||
    workshop.source === WorkshopSource.DISCOVERED;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: workshop.title,
    description: workshop.description,
    startDate: workshop.startsAt,
    endDate: workshop.endsAt,
    location: { '@type': 'Place', name: workshop.location },
    organizer: {
      '@type': 'Person',
      name: `${workshop.host.firstName} ${workshop.host.lastName}`,
    },
    offers: {
      '@type': 'Offer',
      price: workshop.ticketPrice,
      priceCurrency: 'EUR',
      availability:
        spotsLeft > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/SoldOut',
    },
    eventStatus: {
      [WorkshopStatus.PUBLISHED]: 'https://schema.org/EventScheduled',
      [WorkshopStatus.CANCELLED]: 'https://schema.org/EventCancelled',
      [WorkshopStatus.COMPLETED]: 'https://schema.org/EventMovedOnline',
      [WorkshopStatus.DRAFT]: 'https://schema.org/EventScheduled',
    }[workshop.status],
    image: `https://picsum.photos/seed/${workshop.id}/1200/630`,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {isCancelled && (
        <div className="bg-destructive/10 text-destructive text-center py-3 text-sm font-medium">
          This workshop has been cancelled
        </div>
      )}
      {isCompleted && (
        <div className="bg-muted text-muted-foreground text-center py-3 text-sm font-medium">
          This workshop has ended
        </div>
      )}

      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={`https://picsum.photos/seed/${workshop.id}/1200/600`}
          alt={workshop.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container mx-auto px-4 pb-12">
            <h1 className="text-5xl md:text-7xl lg:text-8xl uppercase text-white">
              {workshop.title}
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                {CATEGORY_LABELS[workshop.category]}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-lg text-white/70">
              <span>{workshop.location}</span>
              {workshop.startsAt && (
                <>
                  <span className="text-white/40">|</span>
                  <span>
                    {format(new Date(workshop.startsAt), 'EEEE, MMMM d, yyyy')}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Link
          to="/workshops"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to workshops
        </Link>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl mb-4">About this workshop</h2>
              <p className="text-muted-foreground leading-relaxed">
                {workshop.description}
              </p>
            </div>

            <div>
              <h2 className="text-2xl mb-4">
                {workshop.conductors && workshop.conductors.length > 1
                  ? 'Conductors'
                  : 'Host'}
              </h2>
              <div className="space-y-2">
                {workshop.conductors && workshop.conductors.length > 0 ? (
                  workshop.conductors.map((conductor) => (
                    <Link
                      key={conductor.userId}
                      to={`/hosts/${conductor.userId}`}
                      className="flex items-center gap-3 rounded-xl border bg-card p-4 hover:bg-accent transition-colors"
                    >
                      <img
                        src={getAvatarUrl(conductor.firstName, conductor.lastName)}
                        alt={`${conductor.firstName} ${conductor.lastName}`}
                        className="size-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">
                          {conductor.firstName} {conductor.lastName}
                          {!conductor.isPrimary && (
                            <span className="ml-2 text-xs text-muted-foreground font-normal">
                              Co-conductor
                            </span>
                          )}
                        </p>
                        {conductor.tagline && (
                          <p className="text-xs text-muted-foreground truncate">
                            {conductor.tagline}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                    </Link>
                  ))
                ) : (
                  <Link
                    to={`/hosts/${workshop.hostId}`}
                    className="flex items-center gap-3 rounded-xl border bg-card p-4 hover:bg-accent transition-colors"
                  >
                    <img
                      src={getAvatarUrl(
                        workshop.host.firstName,
                        workshop.host.lastName,
                      )}
                      alt={`${workshop.host.firstName} ${workshop.host.lastName}`}
                      className="size-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">
                        {workshop.host.firstName} {workshop.host.lastName}
                      </p>
                      {workshop.host.tagline && (
                        <p className="text-xs text-muted-foreground truncate">
                          {workshop.host.tagline}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                  </Link>
                )}
              </div>
            </div>

            <Suspense>
              <SeriesSiblings promise={siblingsPromise} />
            </Suspense>

            <div>
              <h2 className="text-2xl mb-4">Reviews</h2>
              <Suspense fallback={<p className="text-muted-foreground text-sm">Loading reviews…</p>}>
                <WorkshopReviews
                  promise={reviewsPromise}
                  userId={userId}
                  workshopStatus={workshop.status}
                  hasConfirmedBooking={hasConfirmedBooking}
                  workshopId={workshop.id}
                />
              </Suspense>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-xl border bg-card p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-serif font-bold">
                    {workshop.ticketPrice > 0
                      ? `${workshop.ticketPrice} ${workshop.currency}`
                      : 'Free'}
                  </span>
                  {workshop.ticketPrice > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      inkl. MwSt.
                    </p>
                  )}
                </div>
                <StatusBadge status={workshop.status} />
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                {workshop.startsAt && (
                  <div className="flex justify-between">
                    <span>Date</span>
                    <span className="font-medium text-foreground">
                      {format(new Date(workshop.startsAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
                {workshop.startsAt && workshop.endsAt && (
                  <div className="flex justify-between">
                    <span>Time</span>
                    <span className="font-medium text-foreground">
                      {format(new Date(workshop.startsAt), 'HH:mm')} -{' '}
                      {format(new Date(workshop.endsAt), 'HH:mm')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Spots left</span>
                  <span className="font-medium text-foreground">
                    {spotsLeft} / {workshop.maxParticipants}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Location</span>
                  <span className="font-medium text-foreground">
                    {workshop.location}
                  </span>
                </div>
              </div>

              {isAuthenticated && (
                <div className="flex items-center gap-2 text-sm">
                  <WishlistButton
                    workshopId={workshop.id}
                    isSaved={isSaved}
                    className="text-muted-foreground hover:text-red-500"
                  />
                  <span className="text-muted-foreground">
                    {isSaved ? 'Saved' : 'Save'}
                  </span>
                </div>
              )}

              {isInactive ? (
                <Button disabled className="w-full" variant="outline">
                  {isCancelled ? 'Workshop Cancelled' : 'Workshop Ended'}
                </Button>
              ) : isExternal && workshop.externalUrl ? (
                <>
                  <Button asChild size="lg" className="w-full">
                    <a
                      href={workshop.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Tickets &rarr;
                    </a>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Tickets sold externally. Sign up on Skillity to get reviews,
                    saved audiences, and zero manual ticketing.
                  </p>
                </>
              ) : (
                <RegisterButton
                  isAuthenticated={isAuthenticated}
                  workshopId={workshop.id}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
