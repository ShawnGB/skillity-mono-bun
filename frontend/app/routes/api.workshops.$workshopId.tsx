import { redirect } from "react-router";
import type { Route } from "./+types/api.workshops.$workshopId";
import { serverPatch } from "@/lib/api-client.server";
import { getCurrentUser } from "@/lib/session.server";
import type { Workshop } from "@skillity/shared";

export async function action({ request, params }: Route.ActionArgs) {
  const user = await getCurrentUser(request);
  if (!user) return redirect("/login");

  const { workshopId } = params;
  const formData = await request.formData();
  const payload = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => v !== ""),
  );

  try {
    await serverPatch<Workshop>(`/workshops/${workshopId}`, payload, request);
    return { ok: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to update workshop" };
  }
}
