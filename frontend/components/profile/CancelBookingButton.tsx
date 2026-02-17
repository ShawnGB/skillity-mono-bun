'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { cancelBooking } from '@/actions/bookings';

interface CancelBookingButtonProps {
  bookingId: string;
}

export default function CancelBookingButton({ bookingId }: CancelBookingButtonProps) {
  const router = useRouter();

  return (
    <ConfirmDialog
      trigger={<Button variant="outline" size="sm">Cancel</Button>}
      title="Cancel booking?"
      description="This will cancel your booking for this workshop."
      confirmLabel="Yes, cancel booking"
      onConfirm={async () => {
        const result = await cancelBooking(bookingId);
        if (result.error) return;
        router.refresh();
      }}
    />
  );
}
