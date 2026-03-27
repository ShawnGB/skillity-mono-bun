import { Button } from '@/components/ui/button';

export default function ExportDataSection() {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Export My Data</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Download a copy of your personal data including your profile, bookings,
        and hosted workshops.
      </p>
      <Button variant="outline" asChild>
        <a href="/api/profile/export" download>
          Export My Data
        </a>
      </Button>
    </div>
  );
}
