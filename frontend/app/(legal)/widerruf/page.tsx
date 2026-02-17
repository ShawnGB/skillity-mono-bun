export default function WiderrufPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl mb-8">Widerrufsbelehrung</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl mb-4">Widerrufsrecht</h2>
          <p className="text-muted-foreground">
            Placeholder: Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Grunden diesen Vertrag zu widerrufen.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">Folgen des Widerrufs</h2>
          <p className="text-muted-foreground">
            Placeholder: Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen unverzuglich zuruckzuzahlen.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">Ausschluss des Widerrufsrechts</h2>
          <p className="text-muted-foreground">
            Placeholder: Das Widerrufsrecht erlischt bei Dienstleistungen, wenn der Unternehmer die Dienstleistung vollstandig erbracht hat.
          </p>
        </section>
      </div>
    </main>
  );
}
