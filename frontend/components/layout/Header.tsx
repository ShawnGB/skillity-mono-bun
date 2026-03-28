import { Link } from 'react-router';
import type { AuthUser } from '@skillity/shared';
import LogoutButton from '@/components/layout/LogoutButton';
import AuthButtons from '@/components/layout/AuthButtons';

interface HeaderProps {
  user: AuthUser | null;
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="u/skillity" width={108} height={30} />
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/workshops"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Browse Workshops
            </Link>
            <Link
              to="/teach"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Become a Guide
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/profile"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {user.firstName} {user.lastName}
              </Link>
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
