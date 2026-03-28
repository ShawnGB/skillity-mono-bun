import { redirect, Link } from 'react-router';
import type { Route } from './+types/register';
import { registerUser } from '@/lib/auth.server';
import { sessionContext } from '@/app/context';
import RegisterForm from '@/components/auth/RegisterForm';

export async function loader({ request, context }: Route.LoaderArgs) {
  if (context.get(sessionContext)) return redirect('/');
  const url = new URL(request.url);
  return { redirectTo: url.searchParams.get('redirect') ?? undefined };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const firstName = formData.get('firstName') as string || undefined;
  const lastName = formData.get('lastName') as string || undefined;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = (formData.get('redirectTo') as string) || '/';

  const result = await registerUser(email, password, firstName, lastName);
  if (!result.ok) return { error: result.error };

  const headers = new Headers();
  for (const cookie of result.setCookies) {
    headers.append('Set-Cookie', cookie);
  }
  return redirect(redirectTo, { headers });
}

export function meta() {
  return [{ title: 'Sign Up | Skillity' }];
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
          Already have an account?{' '}
          <Link
            to={
              redirectTo
                ? `/login?redirect=${encodeURIComponent(redirectTo)}`
                : '/login'
            }
            className="text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
