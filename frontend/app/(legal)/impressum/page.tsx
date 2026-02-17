export default function ImpressumPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl mb-8">Impressum</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl mb-4">Angaben gem. 5 TMG</h2>
          <p className="text-muted-foreground">
            [Name / Firma]<br />
            [Anschrift]<br />
            [PLZ Ort]
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">Kontakt</h2>
          <p className="text-muted-foreground">
            E-Mail: [email@example.com]<br />
            Telefon: [+49 xxx xxxxxxx]
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">Verantwortlich f. d. Inhalt gem. 55 Abs. 2 RStV</h2>
          <p className="text-muted-foreground">
            [Name]<br />
            [Anschrift]
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">Haftungsausschluss</h2>
          <p className="text-muted-foreground">
            Placeholder: Haftung fur Inhalte, Links und Urheberrecht werden hier erganzt.
          </p>
        </section>
      </div>
    </main>
  );
}
