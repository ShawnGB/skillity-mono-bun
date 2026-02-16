import Link from 'next/link';
import Image from 'next/image';
import LogoutButton from '@/components/layout/LogoutButton';
import AuthButtons from '@/components/layout/AuthButtons';
import { getSession } from '@/data/auth';

export default async function Header() {
  const session = await getSession();
  const user = session?.user;
  const isAuthenticated = !!user;

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="uSkillity"
              width={108}
              height={30}
              className="brightness-0 invert"
            />
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/workshops"
              className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              Browse
            </Link>
            <Link
              href="/workshops"
              className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              Teach
            </Link>
            <Link
              href="/workshops"
              className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              Community
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-primary-foreground/80">
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
