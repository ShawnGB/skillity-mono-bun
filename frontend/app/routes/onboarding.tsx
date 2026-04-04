import { redirect } from 'react-router';
import type { Route } from './+types/onboarding';
import { sessionContext } from '@/app/context';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

export async function loader({ request, context }: Route.LoaderArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login?redirect=/onboarding');
  if (session.user.role === 'host' || session.user.role === 'admin') {
    return redirect('/profile/workshops');
  }
  const url = new URL(request.url);
  const error = url.searchParams.get('error');
  return { user: session.user, error };
}

export function meta() {
  return [{ title: 'Become a Conductor | Skillity' }, { name: 'robots', content: 'noindex' }];
}

export default function OnboardingPage({ loaderData }: Route.ComponentProps) {
  return (
    <main className="container mx-auto px-4 py-16 max-w-lg">
      <OnboardingFlow user={loaderData.user} error={loaderData.error} />
    </main>
  );
}
