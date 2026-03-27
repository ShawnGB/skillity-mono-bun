import { redirect, Link } from 'react-router';
import { ApiError } from '@/lib/api-client.server';
import { format } from 'date-fns';
import type { Route } from './+types/profile.saved';
import { getSession } from '@/lib/session.server';
import { getMyWishlist } from '@/lib/wishlist.server';
import { WorkshopStatus, CATEGORY_LABELS } from '@skillity/shared';
import type { WishlistItem } from '@skillity/shared';
import { cn } from '@/lib/utils';
import WishlistButton from '@/components/workshops/WishlistButton';

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  if (!session?.user) return redirect('/login?redirect=/profile/saved');

  try {
    const items = await getMyWishlist(request);
    return { items };
  } catch (err) {
    if (err instanceof ApiError && err.status === 401)
      return redirect('/login?redirect=/profile/saved');
    throw err;
  }
}

export function meta() {
  return [{ title: 'Saved Workshops | Skillity' }];
}

function SavedWorkshopRow({ item }: { item: WishlistItem }) {
  const workshop = item.workshop;
  const isPast =
    workshop.status === WorkshopStatus.COMPLETED ||
    workshop.status === WorkshopStatus.CANCELLED;

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 rounded-xl border bg-card p-5',
        isPast && 'opacity-60',
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 mb-1">
          <Link
            to={`/workshops/${workshop.id}`}
            className="font-medium truncate hover:underline"
          >
            {workshop.title}
          </Link>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {CATEGORY_LABELS[workshop.category]}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {workshop.startsAt && (
            <span>{format(new Date(workshop.startsAt), 'MMM d, yyyy')}</span>
          )}
          <span>{workshop.location}</span>
          <span>
            {Number(workshop.ticketPrice) > 0
              ? `${workshop.ticketPrice} EUR`
              : 'Free'}
          </span>
        </div>
      </div>
      <WishlistButton
        workshopId={workshop.id}
        isSaved={true}
        className="text-red-500 hover:text-red-600"
      />
    </div>
  );
}

export default function SavedWorkshopsPage({
  loaderData,
}: Route.ComponentProps) {
  const { items } = loaderData;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl">Saved Workshops</h2>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            No saved workshops yet.{' '}
            <Link to="/workshops" className="underline hover:text-foreground">
              Browse workshops
            </Link>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <SavedWorkshopRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
