import type { Route } from './+types/workshops';
import { sessionContext } from '@/app/context';
import { getWorkshops } from '@/lib/workshops.server';
import { getWishlistCheck } from '@/lib/wishlist.server';
import WorkshopsHeader from '@/components/workshops/WorkshopsHeader';
import WorkshopsListing from '@/components/workshops/WorkshopsListing';

export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category') ?? undefined;
  const level = url.searchParams.get('level') ?? undefined;
  const search = url.searchParams.get('search') ?? undefined;

  const session = context.get(sessionContext);
  const workshops = await getWorkshops(request, category, level, search);

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

  return {
    workshops,
    wishlistMap,
    isAuthenticated,
    user: session?.user ?? null,
    category,
    level,
    search,
  };
}

export function meta() {
  return [
    { title: 'Workshops | Skillity' },
    { name: 'description', content: 'Browse and book workshops near you.' },
    { tagName: 'link', rel: 'canonical', href: 'https://skillity.de/workshops' },
  ];
}

export default function WorkshopsPage({ loaderData }: Route.ComponentProps) {
  const {
    workshops,
    wishlistMap,
    isAuthenticated,
    user,
    category,
    level,
    search,
  } = loaderData;

  return (
    <div className="container mx-auto px-4 py-8">
      <WorkshopsHeader
        isAuthenticated={isAuthenticated}
        role={user?.role}
        search={search}
      />
      <WorkshopsListing
        workshops={workshops}
        wishlistMap={wishlistMap}
        isAuthenticated={isAuthenticated}
        category={category}
        level={level}
        search={search}
      />
    </div>
  );
}
