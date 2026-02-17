import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { getHostProfile } from '@/data/hosts';
import { getHostWorkshops } from '@/data/workshops';
import { WorkshopStatus, CATEGORY_LABELS } from '@skillity/shared';
import StarRating from '@/components/ui/star-rating';
import { getAvatarUrl } from '@/lib/avatar';

interface HostProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: HostProfilePageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const host = await getHostProfile(id);
    const name = [host.firstName, host.lastName].filter(Boolean).join(' ');
    const description = host.tagline || host.bio?.slice(0, 160) || `${name} on uSkillity`;

    return {
      title: `${name} | Host`,
      description,
      openGraph: {
        title: `${name} | Host`,
        description,
        type: 'profile',
      },
    };
  } catch {
    return {};
  }
}

export default async function HostProfilePage({ params }: HostProfilePageProps) {
  const { id } = await params;

  let host;
  try {
    host = await getHostProfile(id);
  } catch {
    notFound();
  }

  if (!host) notFound();

  const allWorkshops = await getHostWorkshops(id);
  const workshops = allWorkshops.filter(
    (w) =>
      w.status === WorkshopStatus.PUBLISHED || w.status === WorkshopStatus.COMPLETED,
  );

  const name = [host.firstName, host.lastName].filter(Boolean).join(' ');

  const personJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    description: host.bio || undefined,
  };

  if (host.averageRating !== null) {
    personJsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: host.averageRating,
      reviewCount: host.reviewCount,
    };
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Link
        href="/workshops"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; Back to workshops
      </Link>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <img
                src={getAvatarUrl(host.firstName, host.lastName)}
                alt={`${host.firstName} ${host.lastName}`}
                className="size-28 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-semibold">
                  {host.firstName} {host.lastName}
                </h1>
                {host.tagline && (
                  <p className="mt-1 text-muted-foreground">{host.tagline}</p>
                )}
              </div>

              {host.averageRating !== null && (
                <div className="flex items-center gap-2">
                  <StarRating rating={host.averageRating} size="md" />
                  <span className="text-sm text-muted-foreground">
                    {host.averageRating.toFixed(1)} ({host.reviewCount} {host.reviewCount === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}

              <div className="flex gap-6 text-sm text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">{host.workshopCount}</p>
                  <p>{host.workshopCount === 1 ? 'Workshop' : 'Workshops'}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">
                    {format(new Date(host.memberSince), 'yyyy')}
                  </p>
                  <p>Member since</p>
                </div>
              </div>
            </div>

            {host.bio && (
              <div>
                <h2 className="text-lg font-semibold mb-2">About</h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {host.bio}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-2xl mb-6">Workshops</h2>
          {workshops.length === 0 ? (
            <p className="text-muted-foreground">No workshops yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {workshops.map((workshop) => (
                <Link
                  key={workshop.id}
                  href={`/workshops/${workshop.id}`}
                  className="group rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={`https://picsum.photos/seed/${workshop.id}/600/300`}
                      alt={workshop.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="rounded-full bg-black/50 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                        {CATEGORY_LABELS[workshop.category]}
                      </span>
                    </div>
                    {workshop.status === WorkshopStatus.COMPLETED && (
                      <div className="absolute top-2 right-2">
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          Past
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {workshop.title}
                    </h3>
                    {workshop.startsAt && (
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(workshop.startsAt), 'MMM d, yyyy')}
                      </p>
                    )}
                    <p className="text-sm font-medium">
                      {workshop.ticketPrice > 0
                        ? `${workshop.ticketPrice} ${workshop.currency}`
                        : 'Free'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
