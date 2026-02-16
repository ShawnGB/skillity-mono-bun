'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import FormModal from '@/components/modals/FormModal';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/users/RegisterForm';

interface RegisterButtonProps {
  isAuthenticated: boolean;
}

export default function RegisterButton({
  isAuthenticated,
}: RegisterButtonProps) {
  const router = useRouter();

  if (isAuthenticated) {
    return (
      <Button size="lg" className="w-full">
        Register for Workshop
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <FormModal
        trigger={
          <Button size="lg" className="w-full">
            Register for Workshop
          </Button>
        }
        title="Welcome back"
        description="Sign in to register for this workshop."
        onSuccess={() => router.refresh()}
      >
        {({ onSuccess }) => <LoginForm onSuccess={onSuccess} />}
      </FormModal>
      <FormModal
        trigger={
          <Button variant="outline" size="lg" className="w-full">
            Create an Account
          </Button>
        }
        title="Create an account"
        description="Get started with Skillity today."
        onSuccess={() => router.refresh()}
      >
        {({ onSuccess }) => <RegisterForm onSuccess={onSuccess} />}
      </FormModal>
    </div>
  );
}
