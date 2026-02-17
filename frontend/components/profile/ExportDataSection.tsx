'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { exportMyData } from '@/actions/profile';

export default function ExportDataSection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setLoading(true);
    setError(null);
    const result = await exportMyData();
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uskillity-data-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setLoading(false);
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Export My Data</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Download a copy of your personal data including your profile, bookings, and hosted workshops.
      </p>
      {error && <p className="text-sm text-destructive mb-4">{error}</p>}
      <Button variant="outline" onClick={handleExport} disabled={loading}>
        {loading ? 'Exporting...' : 'Export My Data'}
      </Button>
    </div>
  );
}
