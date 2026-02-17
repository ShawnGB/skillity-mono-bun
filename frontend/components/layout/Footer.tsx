import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Github, Mail } from 'lucide-react';

const explore = [
  { label: 'Home', href: '/' },
  { label: 'Browse Workshops', href: '/workshops' },
  { label: 'About', href: '/about' },
];

const create = [
  { label: 'Become a Guide', href: '/teach' },
  { label: 'Create Workshop', href: '/workshops' },
];

const legal = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
  { label: 'AGB', href: '/agb' },
  { label: 'Widerruf', href: '/widerruf' },
];

const socials = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Mail, href: '#', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          <div>
            <Image
              src="/logo.svg"
              alt="uSkillity"
              width={108}
              height={30}
              className="mb-3"
            />
            <p className="text-sm text-muted-foreground">
              Share &middot; Connect &middot; Embrace
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 font-sans">Explore</h4>
            <ul className="space-y-2">
              {explore.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 font-sans">Create</h4>
            <ul className="space-y-2">
              {create.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 font-sans">Legal</h4>
            <ul className="space-y-2">
              {legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 font-sans">Connect</h4>
            <div className="flex gap-3 mb-4">
              {socials.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Made in Berlin</p>
          </div>
        </div>

        <div className="border-t pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} uSkillity. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
