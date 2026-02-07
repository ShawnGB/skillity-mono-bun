'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import FormModal from '@/components/modals/FormModal';
import CreateWorkshopForm from '@/components/workshops/CreateWorkshopForm';

interface WorkshopsHeaderProps {
  isAuthenticated: boolean;
}

export default function WorkshopsHeader({
  isAuthenticated,
}: WorkshopsHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">Workshops</h1>
      {isAuthenticated && (
        <FormModal
          trigger={<Button>Create Workshop</Button>}
          title="Create a workshop"
          description="Fill in the details for your new workshop."
          onSuccess={() => router.refresh()}
        >
          {({ onSuccess }) => <CreateWorkshopForm onSuccess={onSuccess} />}
        </FormModal>
      )}
    </div>
  );
}
