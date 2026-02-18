import type { Metadata } from 'next';
import WorkshopsListing from '@/components/workshops/WorkshopsListing';
import WorkshopsHeader from '@/components/workshops/WorkshopsHeader';
import { getSession } from '@/data/auth';

export const metadata: Metadata = {
  title: 'Browse Workshops',
  description:
    'Explore workshops in your city. Filter by category: crafts, cooking, music, visual arts, and more.',
};

interface WorkshopsPageProps {
  searchParams: Promise<{ category?: string; level?: string; search?: string }>;
}

export default async function WorkshopsPage({ searchParams }: WorkshopsPageProps) {
  const { category, level, search } = await searchParams;
  const session = await getSession();
  const isAuthenticated = !!session?.user;
  const role = session?.user?.role;

  return (
    <div className="container mx-auto px-4 py-8">
      <WorkshopsHeader isAuthenticated={isAuthenticated} role={role} search={search} />
      <WorkshopsListing category={category} level={level} search={search} />
    </div>
  );
}
