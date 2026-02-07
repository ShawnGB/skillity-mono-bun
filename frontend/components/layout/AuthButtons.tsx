'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import FormModal from '@/components/modals/FormModal';
import RegisterForm from '@/components/users/RegisterForm';
import LoginForm from '@/components/auth/LoginForm';

export default function AuthButtons() {
  const router = useRouter();

  return (
    <>
      <FormModal
        trigger={
          <Button variant="ghost" size="sm">
            Log in
          </Button>
        }
        title="Welcome back"
        description="Sign in to your account to continue."
        onSuccess={() => router.refresh()}
      >
        {({ onSuccess }) => <LoginForm onSuccess={onSuccess} />}
      </FormModal>

      <FormModal
        trigger={<Button size="sm">Sign up</Button>}
        title="Create an account"
        description="Get started with Skillity today."
        onSuccess={() => router.refresh()}
      >
        {({ onSuccess }) => <RegisterForm onSuccess={onSuccess} />}
      </FormModal>
    </>
  );
}
