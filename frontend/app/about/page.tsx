import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Users, Flame, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About uSkillity',
  description:
    'Born in Berlin in 2016, uSkillity helps people rediscover creativity through hands-on workshops and creative circles.',
};

const values = [
  {
    icon: Heart,
    title: 'Share',
    description:
      'Everyone carries something worth passing on. A skill, a story, a spark. We make it easy to offer what you know.',
  },
  {
    icon: Users,
    title: 'Connect',
    description:
      'Real people, real rooms, real conversations. In an age of screens, we create spaces for genuine human connection.',
  },
  {
    icon: Flame,
    title: 'Embrace',
    description:
      'Creativity isn\u2019t about perfection — it\u2019s about showing up. We celebrate the courage to try, to play, to begin again.',
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="py-24 md:py-32 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-4">
            Share &middot; Connect &middot; Embrace
          </p>
          <h1 className="text-5xl md:text-7xl uppercase">
            Rediscover What Makes You Feel Alive
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            uSkillity is a growing collection of creative micro-experiences,
            hosted by passionate people, for anyone ready to reconnect with their
            imagination.
          </p>
        </div>
      </section>

      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl mb-8">The Story</h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              uSkillity started in 2016 in Berlin with a simple idea: everyone
              has something worth teaching. We built a platform where anyone
              could host a workshop — pottery, coding, cooking, photography —
              and share their knowledge with curious learners nearby.
            </p>
            <p>
              Nearly a decade later, the world has changed. AI handles more of
              the routine. Work feels more automated. And somewhere along the
              way, many of us stopped making things with our hands, stopped
              playing, stopped creating just for the joy of it.
            </p>
            <p>
              So we evolved. uSkillity is no longer just a place to learn a
              skill — it&rsquo;s a place to rediscover your creativity. Our
              workshops are creative circles: intimate, hands-on
              micro-experiences designed not for productivity, but for aliveness.
            </p>
            <p className="text-foreground font-medium">
              Because learning isn&rsquo;t a path to a career. It&rsquo;s a
              path to yourself.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center mb-16">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border bg-card p-8 text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <value.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-widest">
              Born in Berlin
            </span>
          </div>
          <h2 className="text-3xl mb-6">Local Roots, Creative Spirit</h2>
          <p className="text-muted-foreground leading-relaxed">
            Berlin has always been a city of makers, dreamers, and misfits. Uskillity
            was born here — and our community still starts here. We believe the
            best creative experiences happen in person, in your neighborhood,
            with the people around you.
          </p>
        </div>
      </section>

      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl mb-4">Ready to Explore?</h2>
          <p className="text-muted-foreground mb-8">
            Browse workshops near you and find something that sparks your
            curiosity.
          </p>
          <Button asChild size="lg">
            <Link href="/workshops">Browse Workshops</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
