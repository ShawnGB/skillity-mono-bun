import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

export default function MyWorkshopsHeader() {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">My Workshops</h2>
      <Button size="sm" asChild>
        <Link to="/workshops/new">
          <Plus className="mr-2 size-4" />
          Create Workshop
        </Link>
      </Button>
    </div>
  );
}
