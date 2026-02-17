import type { AuthUser } from '@skillity/shared';
import { getProfileCompleteness } from '@/lib/profile-completeness';

interface ProfileCompletenessProps {
  user: AuthUser;
}

export default function ProfileCompleteness({ user }: ProfileCompletenessProps) {
  const { percentage, missingFields } = getProfileCompleteness(user);

  if (percentage === 100) return null;

  return (
    <div className="rounded-xl border bg-card p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Profile Completeness</h3>
        <span className="text-sm font-semibold">{percentage}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {missingFields.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Add your {missingFields.join(', ').replace(/, ([^,]*)$/, ' and $1')} to complete your profile.
        </p>
      )}
    </div>
  );
}
