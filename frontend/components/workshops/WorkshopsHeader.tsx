'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import FormModal from '@/components/modals/FormModal';
import CreateWorkshopForm from '@/components/workshops/CreateWorkshopForm';
import type { UserRole } from '@skillity/shared';

interface WorkshopsHeaderProps {
  isAuthenticated: boolean;
  role?: UserRole;
}

export default function WorkshopsHeader({
  isAuthenticated,
  role,
}: WorkshopsHeaderProps) {
  const router = useRouter();
  const isHost = role === 'host' || role === 'admin';

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">Workshops</h1>
      {isAuthenticated && isHost && (
        <FormModal
          trigger={<Button>Create Workshop</Button>}
          title="Create a workshop"
          description="Fill in the details for your new workshop."
          onSuccess={() => router.refresh()}
        >
          {({ onSuccess }) => <CreateWorkshopForm onSuccess={onSuccess} />}
        </FormModal>
      )}
      {isAuthenticated && !isHost && (
        <Button asChild variant="outline">
          <Link href="/onboarding">Become a Host to Create</Link>
        </Button>
      )}
    </div>
  );
}
