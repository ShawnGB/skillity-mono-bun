import Link from 'next/link';
import { getSession } from '@/data/auth';
import { getAvatarUrl } from '@/lib/avatar';
import { Button } from '@/components/ui/button';
import ProfileForm from '@/components/profile/ProfileForm';
import ProfileCompleteness from '@/components/profile/ProfileCompleteness';
import HostProfileSection from '@/components/profile/HostProfileSection';

export default async function ProfilePage() {
  const session = await getSession();
  const user = session!.user;
  const isHost = user.role === 'host' || user.role === 'admin';

  return (
    <div className="max-w-2xl space-y-8">
      <ProfileCompleteness user={user} />

      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-xl font-sans font-semibold mb-6">
          Personal Information
        </h2>
        <ProfileForm user={user} />
      </section>

      {isHost && (
        <section className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-sans font-semibold mb-6">
            Host Profile
          </h2>
          <HostProfileSection user={user} />
        </section>
      )}

      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-xl font-sans font-semibold mb-4">Account Type</h2>
        {isHost ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Host
              </span>
              <p className="text-sm text-muted-foreground">
                You can create and manage workshops.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/hosts/${user.id}`}>View Public Profile</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                Guest
              </span>
              <p className="text-sm text-muted-foreground">
                Upgrade to Host to create workshops.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <img
                src={getAvatarUrl(user.firstName, user.lastName)}
                alt={`${user.firstName} ${user.lastName}`}
                className="size-10 rounded-full"
              />
              <div>
                <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-muted-foreground">How you appear on reviews</p>
              </div>
            </div>
            <Button asChild>
              <Link href="/onboarding">Become a Host</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
