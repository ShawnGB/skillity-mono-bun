'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { deleteAccount } from '@/actions/profile';

export default function DeleteAccountSection() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Delete Account</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Permanently delete your account and anonymize all personal data. Your booking history will
        be retained for accounting purposes. This action cannot be undone.
      </p>
      {error && <p className="text-sm text-destructive mb-4">{error}</p>}
      <ConfirmDialog
        trigger={<Button variant="destructive">Delete Account</Button>}
        title="Are you sure?"
        description="This will permanently anonymize your personal data, cancel all pending bookings, and log you out. This action cannot be undone."
        confirmLabel="Delete My Account"
        onConfirm={async () => {
          setError(null);
          const result = await deleteAccount();
          if (result.error) {
            setError(result.error);
            throw new Error(result.error);
          }
          router.push('/');
          router.refresh();
        }}
      />
    </div>
  );
}
