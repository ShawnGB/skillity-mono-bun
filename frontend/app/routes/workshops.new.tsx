import { redirect } from 'react-router';
import type { Route } from './+types/workshops.new';
import { sessionContext } from '@/app/context';
import CreateWorkshopForm from '@/components/workshops/CreateWorkshopForm';

export async function loader({ request, context }: Route.LoaderArgs) {
  const session = context.get(sessionContext);
  if (!session) return redirect('/login?redirect=/workshops/new');
  if (session.user.role !== 'host' && session.user.role !== 'admin') {
    return redirect('/onboarding');
  }
  const url = new URL(request.url);
  const p = url.searchParams;
  return {
    defaultValues: {
      ...(p.get('seriesId') && { seriesId: p.get('seriesId')! }),
      ...(p.get('title') && { title: p.get('title')! }),
      ...(p.get('category') && { category: p.get('category') as any }),
      ...(p.get('description') && { description: p.get('description')! }),
      ...(p.get('location') && { location: p.get('location')! }),
      ...(p.get('maxParticipants') && {
        maxParticipants: Number(p.get('maxParticipants')),
      }),
      ...(p.get('ticketPrice') && {
        ticketPrice: Number(p.get('ticketPrice')),
      }),
    },
  };
}

export function meta() {
  return [{ title: 'Create Workshop | Skillity' }];
}

export default function NewWorkshopPage({ loaderData }: Route.ComponentProps) {
  const { defaultValues } = loaderData;
  const hasDefaults = Object.keys(defaultValues).length > 0;

  return (
    <main className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl mb-8">
        {hasDefaults ? 'Add Another Date' : 'Create a Workshop'}
      </h1>
      <div className="rounded-xl border bg-card p-6">
        <CreateWorkshopForm defaultValues={hasDefaults ? defaultValues : undefined} />
      </div>
    </main>
  );
}
