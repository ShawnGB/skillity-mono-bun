'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ActionResult<T> = { data: T; error?: never } | { data?: never; error: string };

interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export async function updateProfile(
  input: UpdateProfileInput,
): Promise<ActionResult<{ message: string }>> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_URL}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify(input),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { error: error.message || 'Failed to update profile' };
    }

    revalidatePath('/', 'layout');
    return { data: { message: 'Profile updated successfully' } };
  } catch (err) {
    return { error: (err as Error).message || 'Failed to update profile' };
  }
}
