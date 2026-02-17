import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AGB',
  robots: { index: false },
};

export default function AGBPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl mb-8">Allgemeine Gesch&auml;ftsbedingungen</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl mb-4">1. Geltungsbereich</h2>
          <p className="text-muted-foreground">
            Placeholder: Diese AGB gelten fur alle uber die Plattform uSkillity abgeschlossenen Vertrage.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">2. Vertragsschluss</h2>
          <p className="text-muted-foreground">
            Placeholder: Beschreibung des Buchungsprozesses und Vertragsabschlusses.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">3. Preise und Zahlung</h2>
          <p className="text-muted-foreground">
            Placeholder: Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">4. Stornierung</h2>
          <p className="text-muted-foreground">
            Placeholder: Regelungen zur Stornierung durch Teilnehmer und Veranstalter.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">5. Haftung</h2>
          <p className="text-muted-foreground">
            Placeholder: Haftungsbeschrankungen und -ausschlusse.
          </p>
        </section>
      </div>
    </main>
  );
}
