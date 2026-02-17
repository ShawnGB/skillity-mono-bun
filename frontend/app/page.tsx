import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, Ticket, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WorkshopsListing from '@/components/workshops/WorkshopsListing';

export const metadata: Metadata = {
  title: 'Hands-On Creative Workshops in Berlin',
  description:
    'Discover workshops led by passionate creators. Learn pottery, cooking, music, art and more. Book your spot on uSkillity.',
  openGraph: {
    type: 'website',
  },
};

const steps = [
  {
    icon: Search,
    title: 'Browse',
    description: 'Find a creative experience that speaks to you.',
  },
  {
    icon: Ticket,
    title: 'Join',
    description: 'Book your spot and show up — that\u2019s all it takes.',
  },
  {
    icon: Sparkles,
    title: 'Create',
    description: 'Walk away inspired, with something you made.',
  },
];

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <img
            src="/logo.svg"
            alt=""
            className="w-[140%] max-w-none opacity-[0.06]"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl uppercase">
            Find Your Spark.
            <br />
            Share Your Craft.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover workshops led by passionate creators. Learn new skills,
            connect with your community, and unleash your creativity.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/workshops">Explore All Workshops</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl mb-8">Featured Workshops</h2>
        <WorkshopsListing />
      </section>

      <section className="border-t bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
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

      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <blockquote className="text-3xl md:text-5xl font-serif font-bold leading-tight">
            &ldquo;Humanity is not losing its abilities — it&rsquo;s losing the
            enthusiasm to live them.&rdquo;
          </blockquote>
          <p className="mt-8 text-lg text-muted-foreground max-w-xl mx-auto">
            In a world where AI handles the routine, what remains uniquely ours
            is imagination. uSkillity exists to help people rediscover their
            creativity — and through it, themselves.
          </p>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-4xl md:text-5xl text-primary-foreground">
            Share What Moves You
          </h2>
          <p className="mt-6 text-lg text-primary-foreground/80">
            You don&rsquo;t need to be an expert. You just need something
            you&rsquo;re passionate about and a willingness to share it. Host a
            creative circle and inspire others.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <Link href="/teach">Become a Guide</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
