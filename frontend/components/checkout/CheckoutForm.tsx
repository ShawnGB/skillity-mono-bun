import { useState } from 'react';
import { useFetcher, Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PAYMENT_METHODS = [
  { id: 'ideal', label: 'iDEAL' },
  { id: 'card', label: 'Credit Card' },
  { id: 'bancontact', label: 'Bancontact' },
];

interface CheckoutFormProps {
  bookingId: string;
  isFree: boolean;
}

export default function CheckoutForm({ bookingId, isFree }: CheckoutFormProps) {
  const fetcher = useFetcher<{ error?: string }>();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(
    isFree ? 'free' : null,
  );
  const [accepted, setAccepted] = useState(false);

  const isPending = fetcher.state !== 'idle';
  const canSubmit = accepted && (isFree || !!selectedMethod) && !isPending;

  return (
    <div className="space-y-6">
      {!isFree && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Payment method</h3>
          <div className="grid grid-cols-3 gap-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method.id)}
                className={cn(
                  'rounded-lg border-2 p-4 text-sm font-medium transition-colors text-center',
                  selectedMethod === method.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50',
                )}
              >
                {method.label}
              </button>
            ))}
          </div>
        </div>
      )}

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
          and acknowledge the{' '}
          <Link
            to="/widerruf"
            target="_blank"
            className="underline text-foreground hover:text-primary"
          >
            Cancellation Policy
          </Link>
        </span>
      </label>

      {fetcher.data?.error && (
        <p className="text-sm text-destructive">{fetcher.data.error}</p>
      )}

      <fetcher.Form method="post" action={`/api/bookings/${bookingId}/confirm`}>
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
