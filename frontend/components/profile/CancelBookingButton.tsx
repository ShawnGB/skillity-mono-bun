import { useFetcher } from 'react-router';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/confirm-dialog';

interface CancelBookingButtonProps {
  bookingId: string;
}

export default function CancelBookingButton({
  bookingId,
}: CancelBookingButtonProps) {
  const fetcher = useFetcher();

  return (
    <ConfirmDialog
      trigger={
        <Button variant="outline" size="sm">
          Cancel
        </Button>
      }
      title="Cancel booking?"
      description="This will cancel your booking for this workshop."
      confirmLabel="Yes, cancel booking"
      onConfirm={(): Promise<void> => {
        fetcher.submit(
          {},
          {
            method: 'post',
            action: `/api/bookings/${bookingId}/cancel`,
          },
        );
      }}
    />
  );
}
