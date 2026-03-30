import { redirect, Link, useFetcher } from 'react-router';
import { useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';
import type { Route } from './+types/profile._index';
import { sessionContext } from '@/app/context';
import { getAvatarUrl } from '@/lib/avatar';
import { Button } from '@/components/ui/button';
import ProfileForm from '@/components/profile/ProfileForm';
import ProfileCompleteness from '@/components/profile/ProfileCompleteness';
import HostProfileSection from '@/components/profile/HostProfileSection';

export async function loader({ context }: Route.LoaderArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login?redirect=/profile');
  return { user: session.user };
}

export function meta() {
  return [{ title: 'Profile | Skillity' }];
}

export default function ProfilePage({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const isHost = user.role === 'host' || user.role === 'admin';

  const uploadFetcher = useFetcher<{ url?: string; key?: string; error?: string }>();
  const profileFetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUploading = uploadFetcher.state !== 'idle';

  useEffect(() => {
    if (uploadFetcher.state === 'idle' && uploadFetcher.data?.url) {
      profileFetcher.submit(
        { avatarUrl: uploadFetcher.data.url, avatarKey: uploadFetcher.data.key ?? '' },
        { method: 'post', action: '/api/profile' },
      );
    }
  }, [uploadFetcher.state, uploadFetcher.data]);

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    uploadFetcher.submit(fd, { method: 'post', action: '/api/uploads', encType: 'multipart/form-data' });
  };

  const currentAvatarUrl = uploadFetcher.data?.url ?? user.avatarUrl ?? null;

  return (
    <div className="max-w-2xl space-y-8">
      <ProfileCompleteness user={user} />

      <section className="rounded-xl border bg-card p-6 space-y-6">
        <h2 className="text-xl font-sans font-semibold">
          Personal Information
        </h2>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={getAvatarUrl(user.firstName, user.lastName, currentAvatarUrl ?? undefined)}
              alt={`${user.firstName} ${user.lastName}`}
              className="size-16 rounded-full object-cover"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            >
              <Upload className="size-5 text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              {isUploading ? 'Uploading…' : 'Change photo'}
            </button>
            {(uploadFetcher.data?.error || profileFetcher.data?.error) && (
              <p className="text-xs text-destructive mt-0.5">
                {uploadFetcher.data?.error ?? profileFetcher.data?.error}
              </p>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarSelect}
          />
        </div>

        <ProfileForm user={user} />
      </section>

      {isHost && (
        <section className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-sans font-semibold mb-6">Host Profile</h2>
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
              <Link to={`/hosts/${user.id}`}>View Public Profile</Link>
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
                src={getAvatarUrl(user.firstName, user.lastName, currentAvatarUrl ?? undefined)}
                alt={`${user.firstName} ${user.lastName}`}
                className="size-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  How you appear on reviews
                </p>
              </div>
            </div>
            <Button asChild>
              <Link to="/onboarding">Become a Host</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
