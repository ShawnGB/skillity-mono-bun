import { useFetcher } from 'react-router';
import { Button } from '@/components/ui/button';

export default function LogoutButton() {
  const fetcher = useFetcher();
  const isPending = fetcher.state !== 'idle';

  return (
    <fetcher.Form method="post" action="/logout">
      <Button variant="ghost" size="sm" type="submit" disabled={isPending}>
        {isPending ? 'Logging out...' : 'Log out'}
      </Button>
    </fetcher.Form>
  );
}
