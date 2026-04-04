import { useEffect, useState } from 'react';
import { redirect, Link } from 'react-router';
import { format } from 'date-fns';
import type { Route } from './+types/checkout.$bookingId.success';
import { sessionContext } from '@/app/context';
import { getBooking } from '@/lib/bookings.server';
import { BookingStatus } from '@skillity/shared';

export async function loader({ params, context }: Route.LoaderArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login');

  const booking = await getBooking(session.cookie, params.bookingId);

  if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.REFUNDED) {
    return redirect(`/checkout/${params.bookingId}/cancel`);
  }

  return { booking, polling: booking.status === BookingStatus.PENDING };
}

export function meta() {
  return [{ title: 'Payment Successful | Skillity' }, { name: 'robots', content: 'noindex' }];
}

export default function CheckoutSuccessPage({ loaderData }: Route.ComponentProps) {
  const { booking, polling } = loaderData;
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!polling) return;

    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/bookings/${booking.id}/status`);
        const data = await res.json();
        if (data.status === BookingStatus.CONFIRMED) {
          window.location.reload();
        }
      } catch {
        // poll failure — retry on next tick
      }
      if (attempts >= 10) {
        clearInterval(interval);
        setTimedOut(true);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [polling, booking.id]);

  if (polling) {
    return (
      <main className="container mx-auto px-4 py-12 max-w-2xl text-center space-y-6">
        <h1 className="text-3xl">Processing payment...</h1>
        {timedOut ? (
          <>
            <p className="text-muted-foreground">
              This is taking longer than expected. Check your bookings for the latest status.
            </p>
            <Link to="/profile/bookings" className="underline text-foreground hover:text-primary">
              Go to my bookings
            </Link>
          </>
        ) : (
          <p className="text-muted-foreground">
            Please wait while we confirm your payment.
          </p>
        )}
      </main>
    );
  }

  const workshop = booking.workshop;

  return (
    <main className="container mx-auto px-4 py-12 max-w-2xl space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl">Booking confirmed</h1>
        <p className="text-muted-foreground">
          You&apos;re all set. See you at the workshop!
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-4">
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
          {workshop.startsAt && (
            <div className="flex justify-between">
              <span>Time</span>
              <span className="font-medium text-foreground">
                {format(new Date(workshop.startsAt), 'HH:mm')}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Location</span>
            <span className="font-medium text-foreground">{workshop.location}</span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between text-base">
            <span className="font-medium text-foreground">Paid</span>
            <span className="font-bold text-foreground">
              {booking.amount} {booking.currency}
            </span>
          </div>
        </div>
      </div>

      <Link
        to="/profile/bookings"
        className="block w-full text-center rounded-lg bg-primary text-primary-foreground py-3 font-medium hover:bg-primary/90 transition-colors"
      >
        View my bookings
      </Link>
    </main>
  );
}
