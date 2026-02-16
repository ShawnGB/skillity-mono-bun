'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/profile', label: 'Profile' },
  { href: '/profile/workshops', label: 'My Workshops' },
  { href: '/profile/settings', label: 'Settings' },
];

export default function ProfileNav() {
  const pathname = usePathname();

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
