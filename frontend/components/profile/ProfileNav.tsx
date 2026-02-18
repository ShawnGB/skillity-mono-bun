'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { UserRole } from '@skillity/shared';

interface ProfileNavProps {
  role: UserRole;
}

const allTabs = [
  { href: '/profile', label: 'Profile', roles: null },
  { href: '/profile/bookings', label: 'My Bookings', roles: null },
  { href: '/profile/saved', label: 'Saved', roles: null },
  { href: '/profile/workshops', label: 'My Workshops', roles: ['host', 'admin'] as UserRole[] },
  { href: '/profile/settings', label: 'Settings', roles: null },
];

export default function ProfileNav({ role }: ProfileNavProps) {
  const pathname = usePathname();

  const tabs = allTabs.filter(
    (tab) => tab.roles === null || tab.roles.includes(role),
  );

  return (
    <nav className="flex gap-6 border-b mb-8">
      {tabs.map((tab) => {
        const isActive =
          tab.href === '/profile'
            ? pathname === '/profile'
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'pb-3 text-sm font-medium transition-colors border-b-2 -mb-px',
              isActive
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
