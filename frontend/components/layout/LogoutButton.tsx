import { useTransition } from 'react';
import { useNavigate, useFetcher } from 'react-router';
import { Button } from '@/components/ui/button';

export default function LogoutButton() {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await fetcher.submit(null, { method: 'post', action: '/logout' });
      navigate('/');
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending ? 'Logging out...' : 'Log out'}
    </Button>
  );
}
