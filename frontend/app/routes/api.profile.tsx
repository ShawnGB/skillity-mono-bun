import { redirect } from "react-router";
import type { Route } from "./+types/api.profile";
import { serverPatch } from "@/lib/api-client.server";
import { getCurrentUser } from "@/lib/session.server";

export async function action({ request }: Route.ActionArgs) {
  const user = await getCurrentUser(request);
  if (!user) return redirect("/login");

  const formData = await request.formData();
  const payload = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => v !== ""),
  );

  try {
    await serverPatch("/users/me", payload, request);
    return { ok: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to update profile" };
  }
}
