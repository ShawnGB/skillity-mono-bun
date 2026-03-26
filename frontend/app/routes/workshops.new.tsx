import { redirect } from "react-router";
import type { Route } from "./+types/workshops.new";
import { getSession } from "@/lib/session.server";
import CreateWorkshopForm from "@/components/workshops/CreateWorkshopForm";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  if (!session?.user) return redirect("/login?redirect=/workshops/new");
  if (session.user.role !== "host" && session.user.role !== "admin") {
    return redirect("/onboarding");
  }
  const url = new URL(request.url);
  return {
    seriesId: url.searchParams.get("seriesId") ?? undefined,
  };
}

export function meta() {
  return [{ title: "Create Workshop | Skillity" }];
}

export default function NewWorkshopPage({ loaderData }: Route.ComponentProps) {
  const { seriesId } = loaderData;

  return (
    <main className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl mb-8">Create a Workshop</h1>
      <div className="rounded-xl border bg-card p-6">
        <CreateWorkshopForm defaultValues={seriesId ? { seriesId } : undefined} />
      </div>
    </main>
  );
}
