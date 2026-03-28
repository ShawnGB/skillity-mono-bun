import ExportDataSection from '@/components/profile/ExportDataSection';
import DeleteAccountSection from '@/components/profile/DeleteAccountSection';

export function meta() {
  return [{ title: 'Settings | Skillity' }];
}

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <h2 className="text-2xl">Settings</h2>

      <section className="rounded-xl border bg-card p-6">
        <ExportDataSection />
      </section>

      <section className="rounded-xl border border-destructive/30 bg-card p-6">
        <DeleteAccountSection />
      </section>
    </div>
  );
}
