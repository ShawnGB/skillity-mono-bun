import Link from 'next/link';
import { Button } from '@/components/ui/button';
import WorkshopsListing from '@/components/workshops/WorkshopsListing';

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
    </main>
  );
}
