import { redirect } from 'next/navigation';
import { getSession } from '@/data/auth';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

export default async function OnboardingPage() {
  const session = await getSession();

  if (!session?.user) redirect('/workshops');
  if (session.user.role === 'host' || session.user.role === 'admin') {
    redirect('/workshops');
  }

  return (
    <main className="container mx-auto px-4 py-16 max-w-lg">
      <OnboardingFlow />
    </main>
  );
}
