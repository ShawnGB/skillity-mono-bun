import { redirect } from "react-router";
import type { Route } from "./+types/logout";

const API_URL = process.env.API_URL ?? "http://localhost:3000";

export async function action({ request }: Route.ActionArgs) {
  // Best-effort backend logout
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { Cookie: request.headers.get("cookie") ?? "" },
    });
  } catch {}

  // Clear cookies regardless of backend response
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    "access_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax",
  );
  headers.append(
    "Set-Cookie",
    "refresh_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax",
  );

  return redirect("/", { headers });
}
