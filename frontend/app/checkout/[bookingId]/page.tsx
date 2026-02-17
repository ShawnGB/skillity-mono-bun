import { redirect, notFound } from 'next/navigation';
import { format } from 'date-fns';
import { getBooking } from '@/data/bookings';
import { getSession } from '@/data/auth';
import { BookingStatus } from '@skillity/shared';
import CheckoutForm from '@/components/checkout/CheckoutForm';

interface CheckoutPageProps {
  params: Promise<{ bookingId: string }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const session = await getSession();
  if (!session?.user) redirect('/workshops');

  const { bookingId } = await params;

  let booking;
  try {
    booking = await getBooking(bookingId);
  } catch {
    notFound();
  }

  if (!booking) notFound();
  if (booking.status !== BookingStatus.PENDING) {
    redirect('/profile/bookings');
  }

  const workshop = booking.workshop;
  const isFree = Number(booking.amount) === 0;

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
                {format(new Date(workshop.startsAt), 'HH:mm')} - {format(new Date(workshop.endsAt), 'HH:mm')}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Location</span>
            <span className="font-medium text-foreground">{workshop.location}</span>
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
                <p className="text-xs text-muted-foreground mt-0.5">inkl. MwSt.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <CheckoutForm bookingId={booking.id} isFree={isFree} />
    </main>
  );
}
