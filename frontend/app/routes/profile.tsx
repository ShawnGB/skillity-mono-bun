import { redirect, Outlet } from "react-router";
import type { Route } from "./+types/profile";
import { getSession } from "@/lib/session.server";
import ProfileNav from "@/components/profile/ProfileNav";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  if (!session?.user) return redirect(`/login?redirect=/profile`);
  return { user: session.user };
}

export default function ProfileLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl mb-6">Dashboard</h1>
      <ProfileNav role={user.role} />
      <Outlet />
    </main>
  );
}
