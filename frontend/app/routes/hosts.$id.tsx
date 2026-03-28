import { data, Link, isRouteErrorResponse, useRouteError } from 'react-router';
import { format } from 'date-fns';
import { MapPin } from 'lucide-react';
import type { Route } from './+types/hosts.$id';
import { getHostProfile } from '@/lib/hosts.server';
import { getHostWorkshops } from '@/lib/workshops.server';
import { WorkshopStatus, CATEGORY_LABELS } from '@skillity/shared';
import StarRating from '@/components/ui/star-rating';
import { getAvatarUrl } from '@/lib/avatar';

export async function loader({ request, params }: Route.LoaderArgs) {
  const { id } = params;

  let host;
  try {
    host = await getHostProfile(request, id);
  } catch {
    throw data(null, { status: 404 });
  }

  const allWorkshops = await getHostWorkshops(request, id);
  const workshops = allWorkshops.filter(
    (w) =>
      w.status === WorkshopStatus.PUBLISHED ||
      w.status === WorkshopStatus.COMPLETED,
  );

  return { host, workshops };
}

export function meta({ data: loaderData }: Route.MetaArgs) {
  if (!loaderData?.host) return [{ title: 'Host | Skillity' }];
  const { host } = loaderData;
  const name = [host.firstName, host.lastName].filter(Boolean).join(' ');
  const description =
    host.tagline || host.bio?.slice(0, 160) || `${name} on u/skillity`;
  return [
    { title: `${name} | Host | Skillity` },
    { name: 'description', content: description },
    { property: 'og:title', content: `${name} | Host` },
    { property: 'og:type', content: 'profile' },
    {
      tagName: 'link',
      rel: 'canonical',
      href: `https://skillity.de/hosts/${host.id}`,
    },
  ];
}

export default function HostProfilePage({ loaderData }: Route.ComponentProps) {
  const { host, workshops } = loaderData;
  const displayName =
    host.conductorType === 'company' && host.companyName
      ? host.companyName
      : [host.firstName, host.lastName].filter(Boolean).join(' ');
  const name = [host.firstName, host.lastName].filter(Boolean).join(' ');

  const personJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    description: host.bio || undefined,
    ...(host.averageRating !== null && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: host.averageRating,
        reviewCount: host.reviewCount,
      },
    }),
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Link
        to="/workshops"
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
                alt={name}
                className="size-28 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-semibold">{displayName}</h1>
                {host.conductorType === 'company' && host.companyName && (
                  <p className="mt-0.5 text-sm text-muted-foreground">{name}</p>
                )}
                {host.profession && (
                  <p className="mt-0.5 text-sm font-medium text-foreground/80">
                    {host.profession}
                  </p>
                )}
                {host.tagline && (
                  <p className="mt-1 text-muted-foreground">{host.tagline}</p>
                )}
              </div>

              {host.averageRating !== null && (
                <div className="flex items-center gap-2">
                  <StarRating rating={host.averageRating} size="md" />
                  <span className="text-sm text-muted-foreground">
                    {host.averageRating.toFixed(1)} ({host.reviewCount}{' '}
                    {host.reviewCount === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                {host.city && (
                  <div className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    <span>{host.city}</span>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">
                    {host.workshopCount}
                  </p>
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
                  to={`/workshops/${workshop.id}`}
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

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl">Host not found</h1>
          <p className="text-muted-foreground">
            This profile may have been removed or the link is incorrect.
          </p>
        </div>
      </main>
    );
  }
  throw error;
}
