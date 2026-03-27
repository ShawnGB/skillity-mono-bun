import { useFetcher } from 'react-router';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/confirm-dialog';

export default function DeleteAccountSection() {
  const fetcher = useFetcher<{ error?: string }>();

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Delete Account</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Permanently delete your account and anonymize all personal data. Your
        booking history will be retained for accounting purposes. This action
        cannot be undone.
      </p>
      {fetcher.data?.error && (
        <p className="text-sm text-destructive mb-4">{fetcher.data.error}</p>
      )}
      <ConfirmDialog
        trigger={<Button variant="destructive">Delete Account</Button>}
        title="Are you sure?"
        description="This will permanently anonymize your personal data, cancel all pending bookings, and log you out. This action cannot be undone."
        confirmLabel="Delete My Account"
        onConfirm={() => {
          fetcher.submit(null, {
            method: 'post',
            action: '/api/profile/delete',
          });
        }}
      />
    </div>
  );
}
