import { data, redirect, isRouteErrorResponse, useRouteError } from 'react-router';
import { format } from 'date-fns';
import type { Route } from './+types/checkout.$bookingId';
import { sessionContext } from '@/app/context';
import { getBooking } from '@/lib/bookings.server';
import { BookingStatus } from '@skillity/shared';
import CheckoutForm from '@/components/checkout/CheckoutForm';

export async function loader({ params, context }: Route.LoaderArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login?redirect=/workshops');

  const { bookingId } = params;

  let booking;
  try {
    booking = await getBooking(session.cookie, bookingId);
  } catch {
    throw data(null, { status: 404 });
  }

  if (booking.status !== BookingStatus.PENDING) {
    return redirect('/profile/bookings');
  }

  return { booking, isFree: Number(booking.amount) === 0 };
}

export function meta() {
  return [{ title: 'Checkout | Skillity' }, { name: 'robots', content: 'noindex' }];
}

export default function CheckoutPage({ loaderData }: Route.ComponentProps) {
  const { booking, isFree } = loaderData;
  const workshop = booking.workshop;

  return (
    <main className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl mb-8">Checkout</h1>

      <div className="rounded-xl border bg-card p-6 space-y-6 mb-8">
        <h2 className="text-xl font-medium">{workshop.title}</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          {workshop.startsAt && (
            <div className="flex justify-between">
              <span>Date</span>
              <span className="font-medium text-foreground">
                {format(new Date(workshop.startsAt), 'EEEE, MMMM d, yyyy')}
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
            <span>Location</span>
            <span className="font-medium text-foreground">
              {workshop.location}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Host</span>
            <span className="font-medium text-foreground">
              {workshop.host.firstName} {workshop.host.lastName}
            </span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between text-base">
            <span className="font-medium text-foreground">Total</span>
            <div className="text-right">
              <span className="font-bold text-foreground">
                {isFree ? 'Free' : `${booking.amount} ${booking.currency}`}
              </span>
              {!isFree && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  inkl. MwSt.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <CheckoutForm bookingId={booking.id} isFree={isFree} />
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl">Booking not found</h1>
          <p className="text-muted-foreground">
            This booking may have expired or the link is incorrect.
          </p>
        </div>
      </main>
    );
  }
  throw error;
}
