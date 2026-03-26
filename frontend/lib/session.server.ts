import type { AuthUser } from "@skillity/shared";
import { serverGet } from "@/lib/api-client.server";

const API_URL = process.env.API_URL ?? "http://localhost:3000";

function getCookieValue(cookieHeader: string, name: string): string | null {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? match[1] : null;
}

async function tryRefreshAndGetMe(cookieHeader: string): Promise<{ user: AuthUser } | null> {
  const refreshToken = getCookieValue(cookieHeader, "refresh_token");
  if (!refreshToken) return null;

  try {
    const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_token=${refreshToken}`,
      },
    });

    if (!refreshResponse.ok) return null;

    const newCookies = refreshResponse.headers.getSetCookie();
    const forwardCookie = newCookies.map((c) => c.split(";")[0]).join("; ");

    const meResponse = await fetch(`${API_URL}/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: forwardCookie,
      },
    });

    if (!meResponse.ok) return null;
    return meResponse.json();
  } catch {
    return null;
  }
}

export async function getSession(request: Request): Promise<{ user: AuthUser } | null> {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const hasAuth =
    cookieHeader.includes("access_token=") || cookieHeader.includes("refresh_token=");

  if (!hasAuth) return null;

  try {
    return await serverGet<{ user: AuthUser }>("/auth/me", request);
  } catch {
    return tryRefreshAndGetMe(cookieHeader);
  }
}

export async function getCurrentUser(request: Request): Promise<AuthUser | null> {
  const session = await getSession(request);
  return session?.user ?? null;
}
