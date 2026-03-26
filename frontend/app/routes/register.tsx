import { redirect, Link } from "react-router";
import type { Route } from "./+types/register";
import { getSession } from "@/lib/session.server";
import RegisterForm from "@/components/users/RegisterForm";

const API_URL = process.env.API_URL ?? "http://localhost:3000";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  if (session?.user) return redirect("/");
  const url = new URL(request.url);
  return { redirectTo: url.searchParams.get("redirect") ?? undefined };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/";

  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return { error: err.message || "Registration failed" };
  }

  const headers = new Headers();
  for (const cookie of response.headers.getSetCookie()) {
    headers.append("Set-Cookie", cookie);
  }

  return redirect(redirectTo, { headers });
}

export function meta() {
  return [{ title: "Sign Up | Skillity" }];
}

export default function RegisterPage({ loaderData }: Route.ComponentProps) {
  const { redirectTo } = loaderData;

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl">Create an account</h1>
          <p className="text-muted-foreground">Get started with uSkillity.</p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <RegisterForm redirectTo={redirectTo} />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to={redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login"}
            className="text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
