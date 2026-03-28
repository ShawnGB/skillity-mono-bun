import { Link } from 'react-router';
import { Search, Ticket, Sparkles, Monitor, GraduationCap, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WorkshopsListing from '@/components/workshops/WorkshopsListing';
import type { Route } from './+types/home';
import { sessionContext } from '@/app/context';
import { getWorkshops } from '@/lib/workshops.server';
import { getWishlistCheck } from '@/lib/wishlist.server';

export async function loader({ request, context }: Route.LoaderArgs) {
  const session = context.get(sessionContext);
  const workshops = await getWorkshops(request);

  const isAuthenticated = !!session;
  let wishlistMap: Record<string, boolean> = {};
  if (session && workshops.length > 0) {
    try {
      wishlistMap = await getWishlistCheck(
        session.cookie,
        workshops.map((w) => w.id),
      );
    } catch {
      wishlistMap = {};
    }
  }

  return { workshops, wishlistMap, isAuthenticated };
}

export function meta() {
  return [
    { title: 'Hands-On Workshops in Berlin | Skillity' },
    {
      name: 'description',
      content:
        'Workshops led by passionate people. Learn pottery, cooking, music, languages and more. Book your spot on u/skillity.',
    },
    { property: 'og:type', content: 'website' },
  ];
}

const steps = [
  {
    icon: Search,
    title: 'Browse',
    description: 'Find a workshop that catches your eye.',
  },
  {
    icon: Ticket,
    title: 'Join',
    description: 'Book your spot and show up. That\u2019s all it takes.',
  },
  {
    icon: Sparkles,
    title: 'Learn',
    description:
      'Pick up something new from someone who genuinely cares about it.',
  },
];

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const { workshops, wishlistMap, isAuthenticated } = loaderData;

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
            Share What You Know.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Work is getting automated. Scrolling is getting easier. The things
            that make you feel like yourself are still here — they just need
            you to show up.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/workshops">Explore All Workshops</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl mb-8">Featured Workshops</h2>
        <WorkshopsListing
          workshops={workshops}
          wishlistMap={wishlistMap}
          isAuthenticated={isAuthenticated}
        />
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

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl mb-6">Not Content. An Experience.</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Most of what passes for learning today is passive — you watch,
                you skim, you scroll. Skillity is different. You show up, you
                make something, you talk to people who chose to be in the same
                room. The kind of afternoon you still think about the next day.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Not a certification track. Not a recorded lecture. A real
                person teaching something they genuinely love.
              </p>
            </div>
            <div className="space-y-5">
              {[
                {
                  icon: GraduationCap,
                  title: 'Taught by obsession, not credentials',
                  description:
                    'The people who lead these workshops aren\'t doing a job — they can\'t stop thinking about what they teach. That makes all the difference.',
                },
                {
                  icon: Star,
                  title: 'Reviews from people who actually showed up',
                  description:
                    'Only verified attendees can leave a review. No inflated ratings — just honest feedback from people who were in the room.',
                },
                {
                  icon: MapPin,
                  title: 'Your city, not the internet',
                  description:
                    'Berlin-rooted and expanding. The best learning happens near you, with the people around you.',
                },
                {
                  icon: Monitor,
                  title: 'Some things don\'t work through a screen',
                  description:
                    'The smell of clay. The weight of a chisel. The moment a chord finally sounds right. Skillity is for those things.',
                },
              ].map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4">
                  <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium mb-0.5">{title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <blockquote className="text-3xl md:text-5xl font-serif font-bold leading-tight">
            &ldquo;Humanity is not losing its abilities. It&rsquo;s losing the
            enthusiasm to live them.&rdquo;
          </blockquote>
          <p className="mt-8 text-lg text-muted-foreground max-w-xl mx-auto">
            As more of daily life gets automated, the things that give us
            meaning matter more. Learning from someone passionate is one of
            those things.
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
            you&rsquo;re passionate about and a willingness to share it.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <Link to="/teach">Become a Guide</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
