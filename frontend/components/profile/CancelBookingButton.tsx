'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cancelBooking } from '@/actions/bookings';

interface CancelBookingButtonProps {
  bookingId: string;
}

export default function CancelBookingButton({ bookingId }: CancelBookingButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    setLoading(true);
    const result = await cancelBooking(bookingId);
    if (result.error) {
      setLoading(false);
      return;
    }
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCancel}
      disabled={loading}
    >
      {loading ? 'Cancelling...' : 'Cancel'}
    </Button>
  );
}
