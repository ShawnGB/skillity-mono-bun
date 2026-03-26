import { redirect } from "react-router";
import type { Route } from "./+types/api.book.$workshopId";
import { serverPost } from "@/lib/api-client.server";
import { getCurrentUser } from "@/lib/session.server";
import type { Booking } from "@skillity/shared";

export async function action({ request, params }: Route.ActionArgs) {
  const user = await getCurrentUser(request);
  if (!user) return redirect("/login");

  const { workshopId } = params;

  try {
    const booking = await serverPost<Booking>(`/workshops/${workshopId}/book`, {}, request);
    return redirect(`/checkout/${booking.id}`);
  } catch (err) {
    return { error: (err as Error).message || "Failed to book workshop" };
  }
}
