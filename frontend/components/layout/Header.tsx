'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import FormModal from '@/components/modals/FormModal';
import RegisterForm from '@/components/users/RegisterForm';
import CreateWorkshopForm from '@/components/workshops/CreateWorkshopForm';

export default function Header() {
  const router = useRouter();

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-xl font-bold">Skillity</h1>

        <div className="flex items-center gap-2">
          <FormModal
            trigger={<Button variant="outline">Add Workshop</Button>}
            title="Create a workshop"
            description="Enter the workshop details below."
            onSuccess={() => router.refresh()}
          >
            {({ onSuccess }) => <CreateWorkshopForm onSuccess={onSuccess} />}
          </FormModal>

          <FormModal
            trigger={<Button>Register</Button>}
            title="Create an account"
            description="Enter your details below to create your account."
            onSuccess={() => router.refresh()}
          >
            {({ onSuccess }) => <RegisterForm onSuccess={onSuccess} />}
          </FormModal>
        </div>
      </div>
    </header>
  );
}
