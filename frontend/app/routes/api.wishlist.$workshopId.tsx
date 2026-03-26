import { redirect } from "react-router";
import type { Route } from "./+types/api.wishlist.$workshopId";
import { serverPost, serverDelete } from "@/lib/api-client.server";
import { getCurrentUser } from "@/lib/session.server";

export async function action({ request, params }: Route.ActionArgs) {
  const user = await getCurrentUser(request);
  if (!user) return redirect("/login");

  const { workshopId } = params;
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "save") {
    await serverPost(`/wishlist/${workshopId}`, {}, request);
  } else {
    await serverDelete(`/wishlist/${workshopId}`, request);
  }

  return { ok: true };
}
