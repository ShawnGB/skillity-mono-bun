import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/data/auth';
import { Button } from '@/components/ui/button';
import ProfileForm from '@/components/profile/ProfileForm';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user) redirect('/workshops');

  const { user } = session;
  const isHost = user.role === 'host' || user.role === 'admin';

  return (
    <main className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl mb-8">Profile</h1>

      <section className="rounded-xl border bg-card p-6 mb-8">
        <h2 className="text-xl font-sans font-semibold mb-6">
          Personal Information
        </h2>
        <ProfileForm user={user} />
      </section>

      <section className="rounded-xl border bg-card p-6 mb-8">
        <h2 className="text-xl font-sans font-semibold mb-4">Account Type</h2>
        {isHost ? (
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Host
            </span>
            <p className="text-sm text-muted-foreground">
              You can create and manage workshops.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                Guest
              </span>
              <p className="text-sm text-muted-foreground">
                Upgrade to Host to create workshops.
              </p>
            </div>
            <Button asChild>
              <Link href="/onboarding">Become a Host</Link>
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
