import Link from 'next/link';
import { format } from 'date-fns';
import { getMyBookings } from '@/data/bookings';
import { getMyReviews } from '@/data/workshops';
import { BookingStatus, WorkshopStatus } from '@skillity/shared';
import type { Booking } from '@skillity/shared';
import { cn } from '@/lib/utils';
import CancelBookingButton from '@/components/profile/CancelBookingButton';
import ReviewButton from '@/components/workshops/ReviewButton';

interface MyBookingsPageProps {
  searchParams: Promise<{ confirmed?: string }>;
}

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const config = {
    [BookingStatus.PENDING]: { label: 'Pending', className: 'bg-yellow-500/10 text-yellow-600' },
    [BookingStatus.CONFIRMED]: { label: 'Confirmed', className: 'bg-green-500/10 text-green-600' },
    [BookingStatus.CANCELLED]: { label: 'Cancelled', className: 'bg-destructive/10 text-destructive' },
    [BookingStatus.REFUNDED]: { label: 'Refunded', className: 'bg-muted text-muted-foreground' },
  };

  const { label, className } = config[status];

  return (
    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', className)}>
      {label}
    </span>
  );
}

function BookingRow({ booking, dimmed, canReview }: { booking: Booking; dimmed?: boolean; canReview?: boolean }) {
  const workshop = booking.workshop;
  const isActive =
    booking.status === BookingStatus.CONFIRMED ||
    booking.status === BookingStatus.PENDING;
  const hoursUntilStart = workshop.startsAt
    ? (new Date(workshop.startsAt).getTime() - Date.now()) / (1000 * 60 * 60)
    : Infinity;
  const canCancel = isActive && hoursUntilStart >= 72;

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
          <BookingStatusBadge status={booking.status} />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {workshop.startsAt && (
            <span>{format(new Date(workshop.startsAt), 'MMM d, yyyy')}</span>
          )}
          <span>
            {Number(booking.amount) > 0
              ? `${booking.amount} ${booking.currency}`
              : 'Free'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {canReview && <ReviewButton workshopId={workshop.id} />}
        {canCancel && <CancelBookingButton bookingId={booking.id} />}
        {isActive && !canCancel && (
          <span className="text-xs text-muted-foreground">Non-cancellable</span>
        )}
      </div>
    </div>
  );
}

export default async function MyBookingsPage({ searchParams }: MyBookingsPageProps) {
  const { confirmed } = await searchParams;

  let bookings: Booking[];
  let reviewedWorkshopIds: Set<string>;
  try {
    const [fetchedBookings, myReviews] = await Promise.all([
      getMyBookings(),
      getMyReviews(),
    ]);
    bookings = fetchedBookings;
    reviewedWorkshopIds = new Set(myReviews.map((r) => r.workshopId));
  } catch {
    bookings = [];
    reviewedWorkshopIds = new Set();
  }

  const active = bookings.filter(
    (b) =>
      b.status === BookingStatus.PENDING ||
      b.status === BookingStatus.CONFIRMED,
  );

  const past = bookings.filter(
    (b) =>
      b.status === BookingStatus.CANCELLED ||
      b.status === BookingStatus.REFUNDED,
  );

  const confirmedBookings = bookings.filter(
    (b) => b.status === BookingStatus.CONFIRMED,
  );
  const attendedCount = confirmedBookings.filter(
    (b) => b.workshop.status === WorkshopStatus.COMPLETED,
  ).length;
  const totalSpent = confirmedBookings.reduce(
    (sum, b) => sum + Number(b.amount),
    0,
  );
  const categoriesExplored = new Set(
    confirmedBookings.map((b) => b.workshop.category),
  ).size;

  const hasStats = bookings.length > 0;

  return (
    <div className="space-y-6">
      {confirmed === 'true' && (
        <div className="rounded-lg bg-green-500/10 text-green-600 p-4 text-sm font-medium">
          Booking confirmed! You're all set.
        </div>
      )}

      <h2 className="text-2xl">My Bookings</h2>

      {hasStats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-semibold">{attendedCount}</p>
            <p className="text-xs text-muted-foreground">Workshops attended</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-semibold">
              {totalSpent > 0 ? `${totalSpent.toFixed(2)} EUR` : 'Free'}
            </p>
            <p className="text-xs text-muted-foreground">Total spent</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-semibold">{categoriesExplored}</p>
            <p className="text-xs text-muted-foreground">Categories explored</p>
          </div>
        </div>
      )}

      {active.length === 0 && past.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            No bookings yet.{' '}
            <Link href="/workshops" className="underline hover:text-foreground">
              Browse workshops
            </Link>
          </p>
        </div>
      )}

      {active.length > 0 && (
        <div className="space-y-4">
          {active.map((booking) => {
            const isCompleted = booking.workshop.status === WorkshopStatus.COMPLETED;
            const canReview =
              isCompleted &&
              booking.status === BookingStatus.CONFIRMED &&
              !reviewedWorkshopIds.has(booking.workshop.id);
            return (
              <BookingRow key={booking.id} booking={booking} canReview={canReview} />
            );
          })}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Past bookings</h3>
          {past.map((booking) => (
            <BookingRow key={booking.id} booking={booking} dimmed />
          ))}
        </div>
      )}
    </div>
  );
}
