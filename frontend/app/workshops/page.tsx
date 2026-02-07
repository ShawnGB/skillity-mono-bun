import WorkshopsListing from '@/components/workshops/WorkshopsListing';
import WorkshopsHeader from '@/components/workshops/WorkshopsHeader';
import { getSession } from '@/data/auth';

export default async function WorkshopsPage() {
  const session = await getSession();
  const isAuthenticated = !!session?.user;

  return (
    <div className="container mx-auto px-4 py-8">
      <WorkshopsHeader isAuthenticated={isAuthenticated} />
      <WorkshopsListing />
    </div>
  );
}
