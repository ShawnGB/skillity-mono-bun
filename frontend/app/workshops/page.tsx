import WorkshopsListing from '@/components/workshops/WorkshopsListing';
import WorkshopsHeader from '@/components/workshops/WorkshopsHeader';
import { getSession } from '@/data/auth';

interface WorkshopsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function WorkshopsPage({ searchParams }: WorkshopsPageProps) {
  const { category } = await searchParams;
  const session = await getSession();
  const isAuthenticated = !!session?.user;
  const role = session?.user?.role;

  return (
    <div className="container mx-auto px-4 py-8">
      <WorkshopsHeader isAuthenticated={isAuthenticated} role={role} />
      <WorkshopsListing category={category} />
    </div>
  );
}
