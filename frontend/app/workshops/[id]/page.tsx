import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getWorkshop } from '@/data/workshops';
import { getSession } from '@/data/auth';
import RegisterButton from '@/components/workshops/RegisterButton';

interface WorkshopDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkshopDetailPage({
  params,
}: WorkshopDetailPageProps) {
  const { id } = await params;

  let workshop;
  try {
    workshop = await getWorkshop(id);
  } catch {
    notFound();
  }

  if (!workshop) notFound();

  const session = await getSession();
  const isAuthenticated = !!session?.user;
  const spotsLeft = workshop.maxParticipants - workshop.participants.length;

  return (
    <main>
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={`https://picsum.photos/seed/${workshop.id}/1200/600`}
          alt={workshop.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container mx-auto px-4 pb-12">
            <h1 className="text-5xl md:text-7xl lg:text-8xl uppercase text-white">
              {workshop.title}
            </h1>
            <p className="mt-3 text-lg text-white/70">{workshop.location}</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Link
          href="/workshops"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to workshops
        </Link>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl mb-4">About this workshop</h2>
              <p className="text-muted-foreground leading-relaxed">
                {workshop.description}
              </p>
            </div>

            <div>
              <h2 className="text-2xl mb-4">Host</h2>
              <p className="text-muted-foreground">
                {workshop.host.firstName} {workshop.host.lastName}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-xl border bg-card p-6 space-y-6">
              <div>
                <span className="text-3xl font-serif font-bold">
                  {workshop.ticketPrice > 0
                    ? `${workshop.ticketPrice} ${workshop.currency}`
                    : 'Free'}
                </span>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Spots left</span>
                  <span className="font-medium text-foreground">
                    {spotsLeft} / {workshop.maxParticipants}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Registered</span>
                  <span className="font-medium text-foreground">
                    {workshop.participants.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Location</span>
                  <span className="font-medium text-foreground">
                    {workshop.location}
                  </span>
                </div>
              </div>

              <RegisterButton isAuthenticated={isAuthenticated} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
