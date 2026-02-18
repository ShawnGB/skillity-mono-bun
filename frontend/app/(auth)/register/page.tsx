import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect as redirectTo } from 'next/navigation';
import { getSession } from '@/data/auth';
import RegisterForm from '@/components/users/RegisterForm';

export const metadata: Metadata = {
  title: 'Sign Up',
};

interface RegisterPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const session = await getSession();
  if (session?.user) redirectTo('/');

  const { redirect } = await searchParams;

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl">Create an account</h1>
          <p className="text-muted-foreground">
            Get started with uSkillity.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <RegisterForm redirectTo={redirect} />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'}
            className="text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
