'use server';

import { revalidatePath } from 'next/cache';
import type { UpdateProfileInput } from '@skillity/shared';
import { serverPatch } from '@/data/server-client';

type ActionResult<T> = { data: T; error?: never } | { data?: never; error: string };

export async function updateProfile(
  input: UpdateProfileInput,
): Promise<ActionResult<{ message: string }>> {
  try {
    await serverPatch('/users/me', input);
    revalidatePath('/', 'layout');
    return { data: { message: 'Profile updated successfully' } };
  } catch (err) {
    return { error: (err as Error).message || 'Failed to update profile' };
  }
}
