import ExportDataSection from '@/components/profile/ExportDataSection';
import DeleteAccountSection from '@/components/profile/DeleteAccountSection';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-xl font-sans font-semibold mb-6">Data & Privacy</h2>
        <div className="space-y-8">
          <ExportDataSection />
          <div className="border-t" />
          <DeleteAccountSection />
        </div>
      </div>
    </div>
  );
}
