import Link from 'next/link';
import LogoutButton from '@/components/layout/LogoutButton';
import AuthButtons from '@/components/layout/AuthButtons';
import { getSession } from '@/data/auth';

export default async function Header() {
  const session = await getSession();
  const user = session?.user;
  const isAuthenticated = !!user;

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            Skillity
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/workshops"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Workshops
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm">
                {user?.firstName} {user?.lastName}
              </span>
              <LogoutButton />
            </>
          ) : (
            <AuthButtons />
          )}
        </div>
      </div>
    </header>
  );
}
