import { redirect, Link } from 'react-router';
import type { Route } from './+types/login';
import { loginUser } from '@/lib/auth.server';
import { sessionContext } from '@/app/context';
import LoginForm from '@/components/auth/LoginForm';

export async function loader({ request, context }: Route.LoaderArgs) {
  if (context.get(sessionContext)) return redirect('/');
  const url = new URL(request.url);
  return { redirectTo: url.searchParams.get('redirect') ?? undefined };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = (formData.get('redirectTo') as string) || '/';

  const result = await loginUser(email, password);
  if (!result.ok) return { error: result.error };

  const headers = new Headers();
  for (const cookie of result.setCookies) {
    headers.append('Set-Cookie', cookie);
  }
  return redirect(redirectTo, { headers });
}

export function meta() {
  return [{ title: 'Log In | Skillity' }, { name: 'robots', content: 'noindex' }];
}

export default function LoginPage({ loaderData }: Route.ComponentProps) {
  const { redirectTo } = loaderData;

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <LoginForm redirectTo={redirectTo} />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            to={
              redirectTo
                ? `/register?redirect=${encodeURIComponent(redirectTo)}`
                : '/register'
            }
            className="text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
