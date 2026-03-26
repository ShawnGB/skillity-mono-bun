import { redirect } from "react-router";
import type { Route } from "./+types/api.bookings.$bookingId.confirm";
import { serverPost } from "@/lib/api-client.server";
import { getCurrentUser } from "@/lib/session.server";

export async function action({ request, params }: Route.ActionArgs) {
  const user = await getCurrentUser(request);
  if (!user) return redirect("/login");

  const { bookingId } = params;

  try {
    await serverPost(`/bookings/${bookingId}/confirm`, {}, request);
    return redirect("/profile/bookings?confirmed=true");
  } catch (err) {
    return { error: (err as Error).message || "Failed to confirm booking" };
  }
}
