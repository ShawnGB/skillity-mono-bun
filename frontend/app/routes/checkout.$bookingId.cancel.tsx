import { Link } from 'react-router';
import type { Route } from './+types/checkout.$bookingId.cancel';

export function meta() {
  return [{ title: 'Payment Cancelled | Skillity' }, { name: 'robots', content: 'noindex' }];
}

export default function CheckoutCancelPage({ params }: Route.ComponentProps) {
  return (
    <main className="container mx-auto px-4 py-12 max-w-2xl text-center space-y-6">
      <h1 className="text-3xl">Payment cancelled</h1>
      <p className="text-muted-foreground">
        Your booking is still reserved — you can try to pay again.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to={`/checkout/${params.bookingId}`}
          className="rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-colors"
        >
          Return to checkout
        </Link>
        <Link
          to="/profile/bookings"
          className="rounded-lg border px-6 py-3 font-medium hover:bg-accent transition-colors"
        >
          Go to my bookings
        </Link>
      </div>
    </main>
  );
}
