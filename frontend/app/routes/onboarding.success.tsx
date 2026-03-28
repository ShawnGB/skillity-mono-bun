import { redirect, Link } from 'react-router';
import type { Route } from './+types/onboarding.success';
import { sessionContext } from '@/app/context';
import { CheckCircle, Star, Users, BadgeEuro, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export async function loader({ context }: Route.LoaderArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login');
  if (session.user.role !== 'host' && session.user.role !== 'admin') {
    return redirect('/onboarding');
  }
  return null;
}

export function meta() {
  return [{ title: "You're a Conductor | Skillity" }, { name: 'robots', content: 'noindex' }];
}

const BENEFITS = [
  {
    icon: BadgeEuro,
    title: 'Set your own price',
    body: 'You decide what your time and knowledge is worth.',
  },
  {
    icon: Users,
    title: 'Build your audience',
    body: 'Participants can save your workshops and follow your sessions.',
  },
  {
    icon: Star,
    title: 'Collect reviews',
    body: 'After each session attendees can leave a public review.',
  },
  {
    icon: BarChart3,
    title: 'Track your revenue',
    body: 'See bookings, participants, and estimated earnings at a glance.',
  },
];

export default function OnboardingSuccessPage() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-lg">
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl">You&rsquo;re a Host Now!</h1>
          <p className="text-muted-foreground">
            Welcome to the guide side of Skillity. Here&rsquo;s what you can do
            from here.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border bg-card p-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-primary shrink-0" />
                <p className="text-sm font-medium">{title}</p>
              </div>
              <p className="text-xs text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Already running workshops listed elsewhere?{' '}
          <a
            href="mailto:hello@skillity.de?subject=Connect my workshops"
            className="underline hover:text-foreground transition-colors"
          >
            Contact us
          </a>{' '}
          and we&rsquo;ll help connect them to your new host profile.
        </div>

        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full" asChild>
            <Link to="/workshops/new">Create Your First Workshop</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/profile">Complete your profile</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
