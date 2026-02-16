'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormModal from '@/components/modals/FormModal';
import CreateWorkshopForm from '@/components/workshops/CreateWorkshopForm';

export default function MyWorkshopsHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">My Workshops</h2>
      <FormModal
        trigger={
          <Button size="sm">
            <Plus className="mr-2 size-4" />
            Create Workshop
          </Button>
        }
        title="Create a workshop"
        description="Fill in the details for your new workshop."
        onSuccess={() => router.refresh()}
      >
        {({ onSuccess }) => <CreateWorkshopForm onSuccess={onSuccess} />}
      </FormModal>
    </div>
  );
}
