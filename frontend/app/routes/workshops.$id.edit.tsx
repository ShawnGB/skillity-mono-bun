import { data, redirect } from 'react-router';
import type { Route } from './+types/workshops.$id.edit';
import { sessionContext } from '@/app/context';
import { getWorkshop } from '@/lib/workshops.server';
import EditWorkshopForm, {
  ConductorsSection,
} from '@/components/workshops/EditWorkshopForm';
import { useNavigate } from 'react-router';

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const session = context.get(sessionContext);
  if (!session)
    return redirect(`/login?redirect=/workshops/${params.id}/edit`);

  let workshop;
  try {
    workshop = await getWorkshop(request, params.id);
  } catch {
    throw data(null, { status: 404 });
  }

  if (workshop.hostId !== session.user.id && session.user.role !== 'admin') {
    return redirect('/profile/workshops');
  }

  const url = new URL(request.url);
  const justCreated = url.searchParams.get('created') === '1';

  return { workshop, justCreated };
}

export function meta({ data: loaderData }: Route.MetaArgs) {
  return [
    {
      title: loaderData?.workshop
        ? `Edit ${loaderData.workshop.title} | Skillity`
        : 'Edit Workshop | Skillity',
    },
  ];
}

export default function EditWorkshopPage({ loaderData }: Route.ComponentProps) {
  const { workshop, justCreated } = loaderData;
  const navigate = useNavigate();

  return (
    <main className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl mb-2">
        {justCreated ? 'Workshop Created' : 'Edit Workshop'}
      </h1>
      {justCreated && (
        <p className="text-muted-foreground mb-8">
          Saved as draft. Add a co-conductor below, then publish when ready.
        </p>
      )}
      {!justCreated && <div className="mb-8" />}
      <div className="space-y-6">
        <div className="rounded-xl border bg-card p-6">
          <EditWorkshopForm
            workshop={workshop}
            onSuccess={() => navigate(`/workshops/${workshop.id}`)}
          />
        </div>
        {workshop.conductors && (
          <div className="rounded-xl border bg-card p-6">
            <ConductorsSection
              workshopId={workshop.id}
              conductors={workshop.conductors}
              ticketPrice={workshop.ticketPrice}
              maxParticipants={workshop.maxParticipants}
            />
          </div>
        )}
      </div>
    </main>
  );
}
