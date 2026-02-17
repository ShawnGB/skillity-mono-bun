import type { AuthUser } from '@skillity/shared';

const FIELDS = ['firstName', 'lastName', 'bio', 'tagline'] as const;

const FIELD_LABELS: Record<(typeof FIELDS)[number], string> = {
  firstName: 'First name',
  lastName: 'Last name',
  bio: 'Bio',
  tagline: 'Tagline',
};

export function getProfileCompleteness(user: AuthUser) {
  const missingFields: string[] = [];

  for (const field of FIELDS) {
    const value = user[field];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      missingFields.push(FIELD_LABELS[field]);
    }
  }

  const filled = FIELDS.length - missingFields.length;
  const percentage = Math.round((filled / FIELDS.length) * 100);

  return { percentage, missingFields };
}
