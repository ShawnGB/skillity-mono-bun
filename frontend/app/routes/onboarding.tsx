import { redirect } from "react-router";
import type { Route } from "./+types/onboarding";
import { getSession } from "@/lib/session.server";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  if (!session?.user) return redirect("/login?redirect=/onboarding");
  if (session.user.role === "host" || session.user.role === "admin") {
    return redirect("/workshops");
  }
  return null;
}

export function meta() {
  return [{ title: "Become a Host | Skillity" }];
}

export default function OnboardingPage(_: Route.ComponentProps) {
  return (
    <main className="container mx-auto px-4 py-16 max-w-lg">
      <OnboardingFlow />
    </main>
  );
}
