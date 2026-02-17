import { redirect } from 'next/navigation';
import { getSession } from '@/data/auth';
import ProfileNav from '@/components/profile/ProfileNav';

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) redirect('/workshops');

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl mb-6">Dashboard</h1>
      <ProfileNav role={session.user.role} />
      {children}
    </main>
  );
}
