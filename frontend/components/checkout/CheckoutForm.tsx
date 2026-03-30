import { useState } from 'react';
import { useFetcher, Link } from 'react-router';
import { Button } from '@/components/ui/button';

interface CheckoutFormProps {
  bookingId: string;
  isFree: boolean;
}

export default function CheckoutForm({ bookingId, isFree }: CheckoutFormProps) {
  const fetcher = useFetcher<{ checkoutUrl?: string; error?: string }>();
  const [accepted, setAccepted] = useState(false);

  const isPending = fetcher.state !== 'idle';
  const canSubmit = accepted && !isPending;

  if (fetcher.data?.checkoutUrl) {
    window.location.href = fetcher.data.checkoutUrl;
  }

  const action = isFree
    ? `/api/bookings/${bookingId}/confirm`
    : `/api/bookings/${bookingId}/pay`;

  return (
    <div className="space-y-6">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-border accent-primary"
        />
        <span className="text-sm text-muted-foreground">
          I accept the{' '}
          <Link
            to="/agb"
            target="_blank"
            className="underline text-foreground hover:text-primary"
          >
            AGB
          </Link>{' '}
          and Cancellation Policy. I expressly agree to the immediate commencement
          of the service and acknowledge that I lose my right of withdrawal once
          the workshop has been fully completed (§ 356 Abs. 4 BGB).
        </span>
      </label>

      {fetcher.data?.error && (
        <p className="text-sm text-destructive">{fetcher.data.error}</p>
      )}

      <fetcher.Form method="post" action={action}>
        <Button
          size="lg"
          className="w-full"
          type="submit"
          disabled={!canSubmit}
        >
          {isPending
            ? 'Processing...'
            : isFree
              ? 'Confirm Registration'
              : 'Pay'}
        </Button>
      </fetcher.Form>
    </div>
  );
}
