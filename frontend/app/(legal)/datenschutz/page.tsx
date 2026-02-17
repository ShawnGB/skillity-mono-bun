import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutz',
  robots: { index: false },
};

export default function DatenschutzPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl mb-8">Datenschutzerkl&auml;rung</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl mb-4">1. Verantwortlicher</h2>
          <p className="text-muted-foreground">
            [Name / Firma]<br />
            [Anschrift]<br />
            E-Mail: [email@example.com]
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">2. Erhebung und Speicherung personenbezogener Daten</h2>
          <p className="text-muted-foreground">
            Placeholder: Details zur Datenerhebung bei Registrierung, Buchung und Nutzung der Plattform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">3. Weitergabe von Daten</h2>
          <p className="text-muted-foreground">
            Placeholder: Informationen zur Weitergabe an Dritte, Zahlungsdienstleister etc.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">4. Ihre Rechte</h2>
          <p className="text-muted-foreground">
            Placeholder: Auskunft, Berichtigung, L&ouml;schung, Datenportabilit&auml;t gem. Art. 15-20 DSGVO.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">5. Cookies</h2>
          <p className="text-muted-foreground">
            Placeholder: Informationen zu verwendeten Cookies und deren Zweck.
          </p>
        </section>
      </div>
    </main>
  );
}
