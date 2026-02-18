import type { AuthUser } from '@skillity/shared';

type ProfileField = keyof AuthUser;

const GUEST_FIELDS: ProfileField[] = ['firstName', 'lastName'];
const HOST_FIELDS: ProfileField[] = ['firstName', 'lastName', 'bio', 'tagline', 'profession', 'city'];

const FIELD_LABELS: Record<string, string> = {
  firstName: 'First name',
  lastName: 'Last name',
  bio: 'Bio',
  tagline: 'Tagline',
  profession: 'Profession',
  city: 'City',
};

export function getProfileCompleteness(user: AuthUser) {
  const fields = user.role === 'guest' ? GUEST_FIELDS : HOST_FIELDS;
  const missingFields: string[] = [];

  for (const field of fields) {
    const value = user[field];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      missingFields.push(FIELD_LABELS[field]);
    }
  }

  const filled = fields.length - missingFields.length;
  const percentage = Math.round((filled / fields.length) * 100);

  return { percentage, missingFields };
}
