import { data, redirect } from 'react-router';
import type { Route } from './+types/workshops.$id.edit';
import { getSession } from '@/lib/session.server';
import { getWorkshop } from '@/lib/workshops.server';
import EditWorkshopForm, {
  ConductorsSection,
} from '@/components/workshops/EditWorkshopForm';
import { useNavigate } from 'react-router';

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await getSession(request);
  if (!session?.user)
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

  return { workshop };
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
  const { workshop } = loaderData;
  const navigate = useNavigate();

  return (
    <main className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl mb-8">Edit Workshop</h1>
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
            />
          </div>
        )}
      </div>
    </main>
  );
}
