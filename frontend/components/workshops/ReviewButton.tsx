'use client';

import { Button } from '@/components/ui/button';
import FormModal from '@/components/modals/FormModal';
import ReviewForm from './ReviewForm';

interface ReviewButtonProps {
  workshopId: string;
}

export default function ReviewButton({ workshopId }: ReviewButtonProps) {
  return (
    <FormModal
      trigger={<Button variant="outline" size="sm">Write a Review</Button>}
      title="Write a Review"
      description="Share your experience with this workshop."
    >
      {({ onSuccess }) => (
        <ReviewForm workshopId={workshopId} onSuccess={onSuccess} />
      )}
    </FormModal>
  );
}
