import type { HostProfile } from '@skillity/shared';
import { serverGet } from '@/lib/api-client.server';

export async function getHostProfile(
  request: Request,
  id: string,
): Promise<HostProfile> {
  return serverGet<HostProfile>(`/users/${id}/profile`, request);
}
