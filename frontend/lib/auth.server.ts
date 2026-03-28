import { API_URL } from './api-client.server';

type AuthResult =
  | { ok: true; setCookies: string[] }
  | { ok: false; error: string };

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResult> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const err = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    return { ok: false, error: err?.message ?? 'Invalid email or password' };
  }
  return { ok: true, setCookies: response.headers.getSetCookie() };
}

export async function registerUser(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
): Promise<AuthResult> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, firstName, lastName }),
  });
  if (!response.ok) {
    const err = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    return { ok: false, error: err?.message ?? 'Registration failed' };
  }
  return { ok: true, setCookies: response.headers.getSetCookie() };
}

export async function logoutUser(request: Request): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: { Cookie: request.headers.get('cookie') ?? '' },
  }).catch(() => {
    // Backend unreachable — cookies are still cleared by the caller
  });
}
