import { Link } from 'react-router';
import {
  Heart,
  Users,
  Star,
  RefreshCw,
  ExternalLink,
  BadgeEuro,
  ListChecks,
  Handshake,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function meta() {
  return [
    { title: 'Become a Conductor | Skillity' },
    {
      name: 'description',
      content:
        'Share your passion and earn on your terms. Host workshops on Skillity — no teaching degree required.',
    },
  ];
}

const benefits = [
  {
    icon: BadgeEuro,
    title: 'You Keep 95%',
    description:
      'Set your price. Whatever people pay, 95% comes to you. No subscription, no hidden commission — just a straightforward 5% that keeps the lights on here.',
  },
  {
    icon: Users,
    title: "You Don't Have to Do It Alone",
    description:
      'Invite a co-conductor, set the revenue split with a slider, and both of you get paid. Some things are more fun — and better — when you teach them together.',
  },
  {
    icon: RefreshCw,
    title: 'Every Session Builds on the Last',
    description:
      'Run it once, learn from it, run it again. Reviews from each session carry forward. Your reputation compounds over time — you\'re building something, not just doing something once.',
  },
  {
    icon: Star,
    title: 'Reviews That Mean Something',
    description:
      'Only people who actually attended can review you. Not five-star inflation — real feedback from real learners that builds real credibility.',
  },
  {
    icon: Heart,
    title: 'No Credentials Required',
    description:
      'You don\'t need a teaching degree. You need something you care deeply about and a willingness to share it. Genuine enthusiasm is rarer and more valuable than a certificate.',
  },
  {
    icon: ExternalLink,
    title: 'Already Selling Elsewhere?',
    description:
      'If you sell tickets on another platform or your own site, you can still list here. Your audience on Skillity grows and collects reviews — even if the booking happens somewhere else.',
  },
];

const howItWorks = [
  {
    icon: ListChecks,
    title: 'Describe What You Do',
    description:
      'Tell people what they\'ll make, learn, or experience. Set your price, your capacity, and when it happens.',
  },
  {
    icon: Handshake,
    title: 'Learners Show Up',
    description:
      'Bookings, payments, and confirmations are handled. You focus on what you actually want to do.',
  },
  {
    icon: BadgeEuro,
    title: 'You Get Paid',
    description:
      '95% of ticket revenue goes directly to you via Mollie. Simple, fast, transparent.',
  },
];

export default function TeachPage() {
  return (
    <main>
      <section className="py-24 md:py-32 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-4">
            Become a Conductor
          </p>
          <h1 className="text-5xl md:text-7xl uppercase">
            Share What Moves You
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            You don&rsquo;t need to be an expert. You just need something
            you&rsquo;re passionate about and a willingness to share it with
            others.
          </p>
        </div>
      </section>

      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center mb-16">Why Skillity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border bg-card p-8"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-serif font-bold mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {howItWorks.map((step, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {i + 1}
                </div>
                <h3 className="text-xl font-serif font-bold mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl text-center mb-12">
            How Skillity Compares
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 pr-6 font-medium text-muted-foreground">
                    &nbsp;
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">
                    Skillity
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                    Eventbrite
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                    VHS
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                    DIY
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  ['Your cut', '95%', '~92–94%', '~40–60%', '100%'],
                  ['Anyone can teach', '✓', '✓', '✗', '✓'],
                  ['Reviews', '✓', '✗', '✗', '✗'],
                  ['Co-conductor split', '✓', '✗', '✗', '✗'],
                  ['Workshop series', '✓', 'Manual', '✗', 'Manual'],
                  ['Audience building', '✓', 'Partial', '✗', '✗'],
                  ['Payments handled', '✓', '✓', '✓', '✗'],
                ].map(([label, ...cols]) => (
                  <tr key={label}>
                    <td className="py-3 pr-6 text-muted-foreground">{label}</td>
                    {cols.map((val, i) => (
                      <td
                        key={i}
                        className={`py-3 px-4 text-center ${
                          i === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            DIY = managing your own bookings, payments, and promotion directly.
          </p>
        </div>
      </section>

      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl mb-4">Ready to Start?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Create your first workshop. Share something you love with people
            who are genuinely curious about it.
          </p>
          <Button asChild size="lg">
            <Link to="/onboarding">Get Started</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
