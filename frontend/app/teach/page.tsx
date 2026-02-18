import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Wallet, Users, ListChecks, Handshake, BadgeEuro } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Become a Guide',
  description:
    'Share your passion and earn on your terms. Host workshops on uSkillity. No teaching degree required.',
};

const benefits = [
  {
    icon: Heart,
    title: 'Share Your Passion',
    description:
      'Turn what you love into an experience others will remember. No teaching degree required, just enthusiasm.',
  },
  {
    icon: Wallet,
    title: 'Earn on Your Terms',
    description:
      'Set your own price, schedule, and group size. Your workshop, your rules.',
  },
  {
    icon: Users,
    title: 'Build Community',
    description:
      'Connect with like-minded people in your city. Every workshop creates bonds that last beyond the session.',
  },
];

const howItWorks = [
  {
    icon: ListChecks,
    title: 'Create a Listing',
    description:
      'Describe your workshop, set the price and capacity, and publish it in minutes.',
  },
  {
    icon: Handshake,
    title: 'Welcome Learners',
    description:
      'Learners book their spot and show up. You focus on what you do best.',
  },
  {
    icon: BadgeEuro,
    title: 'Get Paid',
    description:
      'Receive your earnings within 24 hours. Simple, transparent, fair.',
  },
];

export default function TeachPage() {
  return (
    <main>
      <section className="py-24 md:py-32 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-4">
            Become a Guide
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
          <h2 className="text-3xl text-center mb-16">Why Guide?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border bg-card p-8 text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-3">
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

      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-4xl md:text-5xl text-primary-foreground">
            You Keep Everything
          </h2>
          <p className="mt-6 text-lg text-primary-foreground/80">
            You set your price and you get 100% of it. We add a small 5%
            service fee for learners at checkout. No hidden fees, no
            subscriptions, no commission taken from you.
          </p>
        </div>
      </section>

      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl mb-4">Ready to Start?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Create your first workshop and share your passion with curious
            learners in your city.
          </p>
          <Button asChild size="lg">
            <Link href="/onboarding">Get Started</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
