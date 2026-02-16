'use server';

import { revalidatePath } from 'next/cache';
import type {
  Workshop,
  CreateWorkshopInput,
  UpdateWorkshopInput,
} from '@skillity/shared';
import { WorkshopStatus } from '@skillity/shared';
import { getSession } from '@/data/auth';
import { serverPost, serverPatch } from '@/data/server-client';

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
    const data = await serverPost<Workshop>('/workshops', input);
    revalidatePath('/workshops');
    revalidatePath('/profile/workshops');
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
    const data = await serverPatch<Workshop>(`/workshops/${id}`, input);
    revalidatePath('/workshops');
    revalidatePath(`/workshops/${id}`);
    revalidatePath('/profile/workshops');
    return { data };
  } catch (err) {
    return { error: (err as Error).message || 'Failed to update workshop' };
  }
}

export async function updateWorkshopStatus(
  id: string,
  status: WorkshopStatus,
): Promise<ActionResult<Workshop>> {
  return updateWorkshop(id, { status });
}
