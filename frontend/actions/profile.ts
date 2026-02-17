'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import type { UpdateProfileInput } from '@skillity/shared';
import { serverPatch, serverDelete, serverGet } from '@/data/server-client';

type ActionResult<T> =
  | { data: T; error?: never }
  | { data?: never; error: string };

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

export async function deleteAccount(): Promise<ActionResult<{ message: string }>> {
  try {
    await serverDelete('/users/me');
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    return { data: { message: 'Account deleted' } };
  } catch (err) {
    return { error: (err as Error).message || 'Failed to delete account' };
  }
}

export async function exportMyData(): Promise<ActionResult<Record<string, unknown>>> {
  try {
    const data = await serverGet<Record<string, unknown>>('/users/me/export');
    return { data };
  } catch (err) {
    return { error: (err as Error).message || 'Failed to export data' };
  }
}
