import 'server-only';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed: ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return {
    'Content-Type': 'application/json',
    ...(cookieHeader ? { Cookie: cookieHeader } : {}),
  };
}

export async function serverGet<T>(endpoint: string): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'GET',
    headers,
    cache: 'no-store',
  });
  return handleResponse<T>(response);
}

export async function serverPost<T>(
  endpoint: string,
  body?: unknown,
): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  return handleResponse<T>(response);
}

export async function serverPatch<T>(
  endpoint: string,
  body?: unknown,
): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'PATCH',
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  return handleResponse<T>(response);
}

export async function serverDelete<T>(endpoint: string): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'DELETE',
    headers,
    cache: 'no-store',
  });
  return handleResponse<T>(response);
}
