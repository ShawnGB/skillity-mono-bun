import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Users, Flame, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About uSkillity',
  description:
    'Born in Berlin in 2016, uSkillity connects passionate people with curious learners through hands-on workshops.',
};

const values = [
  {
    icon: Heart,
    title: 'Share',
    description:
      'Everyone carries something worth passing on. We make it easy to offer what you know to people who want to learn.',
  },
  {
    icon: Users,
    title: 'Connect',
    description:
      'Small groups, real rooms, face to face. The best learning happens between people, not through screens.',
  },
  {
    icon: Flame,
    title: 'Purpose',
    description:
      'In a world that automates more every year, choosing to learn and teach is an act of meaning. That matters.',
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="py-24 md:py-32 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-5xl md:text-7xl uppercase">
            Rediscover What Makes You Feel Alive
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            uSkillity is a place where people who care deeply about something
            share it with people who want to learn. Small workshops, real
            connection, in person.
          </p>
        </div>
      </section>

      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl mb-8">The Story</h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              I started uSkillity in 2016 in Berlin. The idea was simple:
              everyone has something worth teaching. Learning had become too
              institutional, too transactional. But people have always learned
              best from other people. Someone who cares about what they know,
              sharing it with someone who wants to learn. That felt like
              something worth building for.
            </p>
            <p>
              Remember when someone you loved showed you something they cared
              about? Your grandmother&rsquo;s cake recipe. Your father fixing a
              flat tire. A neighbor who let you help in their garden. Nobody
              called it teaching. There was no curriculum. But you remember it
              better than most things you learned in a classroom. That kind of
              learning is real, and it matters.
            </p>
            <p>
              The first time around, it didn&rsquo;t work out. The timing
              wasn&rsquo;t right, or the execution, or both. The company closed.
              But the idea never fully went away. It stayed with me for years,
              quietly.
            </p>
            <p>
              Then AI changed everything. Work gets automated, people feel
              replaceable, meaning erodes. And suddenly the idea of passionate
              people sharing what they know with small groups of learners feels
              more relevant than ever. Not as a career tool. As something that
              gives life texture. We rebuilt uSkillity because the world needs
              more of this now, not less.
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
          <h2 className="text-3xl mb-6">Local Roots</h2>
          <p className="text-muted-foreground leading-relaxed">
            Berlin has always been a city of makers, dreamers, and misfits.
            uSkillity was born here, and our community still starts here. We
            believe the best learning happens in person, in your neighborhood,
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
