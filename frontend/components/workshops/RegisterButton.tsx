'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import FormModal from '@/components/modals/FormModal';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/users/RegisterForm';
import { bookWorkshop } from '@/actions/bookings';

interface RegisterButtonProps {
  isAuthenticated: boolean;
  workshopId: string;
}

export default function RegisterButton({
  isAuthenticated,
  workshopId,
}: RegisterButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBook() {
    setLoading(true);
    setError(null);
    const result = await bookWorkshop(workshopId);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push(`/checkout/${result.data.id}`);
  }

  if (isAuthenticated) {
    return (
      <div className="space-y-2">
        <Button size="lg" className="w-full" onClick={handleBook} disabled={loading}>
          {loading ? 'Booking...' : 'Register for Workshop'}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
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
