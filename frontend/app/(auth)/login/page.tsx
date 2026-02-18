import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect as redirectTo } from 'next/navigation';
import { getSession } from '@/data/auth';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Log In',
};

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession();
  if (session?.user) redirectTo('/');

  const { redirect } = await searchParams;

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
          <LoginForm redirectTo={redirect} />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href={redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : '/register'}
            className="text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
