import { redirect } from "react-router";
import type { Route } from "./+types/api.profile.delete";
import { serverDelete } from "@/lib/api-client.server";
import { getCurrentUser } from "@/lib/session.server";

export async function action({ request }: Route.ActionArgs) {
  const user = await getCurrentUser(request);
  if (!user) return redirect("/login");

  try {
    await serverDelete("/users/me", request);
  } catch (err) {
    return { error: (err as Error).message || "Failed to delete account" };
  }

  const headers = new Headers();
  headers.append("Set-Cookie", "access_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax");
  headers.append("Set-Cookie", "refresh_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax");

  return redirect("/", { headers });
}
