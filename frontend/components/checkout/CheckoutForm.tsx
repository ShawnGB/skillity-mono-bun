'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { confirmBooking } from '@/actions/bookings';

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
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(
    isFree ? 'free' : null,
  );
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    const result = await confirmBooking(bookingId);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push('/profile/bookings?confirmed=true');
  }

  const canSubmit = accepted && (isFree || !!selectedMethod) && !loading;

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
          <Link href="/agb" target="_blank" className="underline text-foreground hover:text-primary">
            AGB
          </Link>{' '}
          and acknowledge the{' '}
          <Link href="/widerruf" target="_blank" className="underline text-foreground hover:text-primary">
            Cancellation Policy
          </Link>
        </span>
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        size="lg"
        className="w-full"
        disabled={!canSubmit}
        onClick={handleConfirm}
      >
        {loading
          ? 'Processing...'
          : isFree
            ? 'Confirm Registration'
            : 'Pay'}
      </Button>
    </div>
  );
}
