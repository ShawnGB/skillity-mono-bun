'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FormModal from '@/components/modals/FormModal';
import CreateWorkshopForm from '@/components/workshops/CreateWorkshopForm';
import type { UserRole } from '@skillity/shared';

interface WorkshopsHeaderProps {
  isAuthenticated: boolean;
  role?: UserRole;
  search?: string;
}

export default function WorkshopsHeader({
  isAuthenticated,
  role,
  search,
}: WorkshopsHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(search ?? '');
  const isHost = role === 'host' || role === 'admin';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set('search', query.trim());
    } else {
      params.delete('search');
    }
    const qs = params.toString();
    router.push(qs ? `/workshops?${qs}` : '/workshops');
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workshops</h1>
        {isAuthenticated && isHost && (
          <FormModal
            trigger={<Button>Create Workshop</Button>}
            title="Create a workshop"
            description="Fill in the details for your new workshop."
            onSuccess={() => router.refresh()}
          >
            {({ onSuccess }) => <CreateWorkshopForm onSuccess={onSuccess} />}
          </FormModal>
        )}
        {isAuthenticated && !isHost && (
          <Button asChild variant="outline">
            <Link href="/onboarding">Become a Host to Create</Link>
          </Button>
        )}
      </div>
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workshops..."
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="secondary" size="sm">
          Search
        </Button>
      </form>
    </div>
  );
}
