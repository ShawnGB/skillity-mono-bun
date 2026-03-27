import type { HostProfile } from '@skillity/shared';
import { serverGet } from '@/lib/api-client.server';

type RequestSource = Request | string;

export async function getHostProfile(
  source: RequestSource,
  id: string,
): Promise<HostProfile> {
  return serverGet<HostProfile>(`/users/${id}/profile`, source);
}
