'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import type {
  Workshop,
  CreateWorkshopInput,
  UpdateWorkshopInput,
} from '@skillity/shared';
import { getSession } from '@/data/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ActionResult<T> =
  | { data: T; error?: never }
  | { data?: never; error: string };

export async function createWorkshop(
  input: CreateWorkshopInput,
): Promise<ActionResult<Workshop>> {
  const session = await getSession();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_URL}/workshops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { error: error.message || 'Failed to create workshop' };
    }

    const data: Workshop = await response.json();
    revalidatePath('/workshops');
    return { data };
  } catch (err) {
    return { error: (err as Error).message || 'Failed to create workshop' };
  }
}

export async function updateWorkshop(
  id: string,
  input: UpdateWorkshopInput,
): Promise<ActionResult<Workshop>> {
  const session = await getSession();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_URL}/workshops/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { error: error.message || 'Failed to update workshop' };
    }

    const data: Workshop = await response.json();
    revalidatePath('/workshops');
    revalidatePath(`/workshops/${id}`);
    return { data };
  } catch (err) {
    return { error: (err as Error).message || 'Failed to update workshop' };
  }
}
