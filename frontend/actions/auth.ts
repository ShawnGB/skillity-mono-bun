'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import type { LoginInput, RegisterInput, AuthResponse } from '@skillity/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ActionResult<T> = { data: T; error?: never } | { data?: never; error: string };

export async function login(
  input: LoginInput,
): Promise<ActionResult<AuthResponse>> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { error: error.message || 'Login failed' };
    }

    const data: AuthResponse = await response.json();

    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      const cookieStore = await cookies();
      const cookieParts = setCookieHeader.split(',').map((c) => c.trim());
      for (const cookiePart of cookieParts) {
        const [nameValue] = cookiePart.split(';');
        const [name, value] = nameValue.split('=');
        if (name && value) {
          cookieStore.set(name.trim(), value.trim(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
          });
        }
      }
    }

    revalidatePath('/', 'layout');
    return { data };
  } catch (err) {
    return { error: (err as Error).message || 'Login failed' };
  }
}

export async function register(
  input: RegisterInput,
): Promise<ActionResult<AuthResponse>> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { error: error.message || 'Registration failed' };
    }

    const data: AuthResponse = await response.json();

    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      const cookieStore = await cookies();
      const cookieParts = setCookieHeader.split(',').map((c) => c.trim());
      for (const cookiePart of cookieParts) {
        const [nameValue] = cookiePart.split(';');
        const [name, value] = nameValue.split('=');
        if (name && value) {
          cookieStore.set(name.trim(), value.trim(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
          });
        }
      }
    }

    revalidatePath('/', 'layout');
    return { data };
  } catch (err) {
    return { error: (err as Error).message || 'Registration failed' };
  }
}

export async function becomeHost(): Promise<ActionResult<{ role: string }>> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_URL}/users/become-host`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { error: error.message || 'Failed to upgrade to host' };
    }

    const data = await response.json();
    revalidatePath('/', 'layout');
    return { data: { role: data.role } };
  } catch (err) {
    return { error: (err as Error).message || 'Failed to upgrade to host' };
  }
}

export async function logout(): Promise<ActionResult<{ message: string }>> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      credentials: 'include',
    });

    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    revalidatePath('/', 'layout');
    return { data: { message: 'Logged out successfully' } };
  } catch {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    revalidatePath('/', 'layout');
    return { data: { message: 'Logged out' } };
  }
}
