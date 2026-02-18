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
            Shawn G. Becker<br />
            Baseler Str 38<br />
            12205 Berlin<br />
            E-Mail: contact@shawnbecker.de<br />
            Telefon: +49 170 966 47 25
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">
            2. Erhebung personenbezogener Daten
          </h2>
          <p className="text-muted-foreground">
            Wir erheben personenbezogene Daten, wenn Sie sich auf unserer
            Plattform registrieren, einen Workshop buchen oder die Plattform
            nutzen. Dies umfasst insbesondere: Name, E-Mail-Adresse und
            Passwort bei der Registrierung; Buchungs- und Zahlungsdaten bei der
            Buchung eines Workshops; Nutzungsdaten wie IP-Adresse, Browsertyp
            und Zugriffszeiten.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">3. Rechtsgrundlagen</h2>
          <p className="text-muted-foreground">
            Die Verarbeitung Ihrer Daten erfolgt auf Grundlage von Art. 6
            Abs. 1 DSGVO: Vertragserf&uuml;llung (lit. b) f&uuml;r die
            Bereitstellung der Plattform und Abwicklung von Buchungen;
            berechtigte Interessen (lit. f) f&uuml;r die Verbesserung unserer
            Dienste und die Gew&auml;hrleistung der Sicherheit; Einwilligung
            (lit. a) soweit Sie uns eine solche erteilt haben.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">4. Cookies</h2>
          <p className="text-muted-foreground">
            Wir verwenden ausschlie&szlig;lich funktionale httpOnly-Cookies
            f&uuml;r die Authentifizierung. Diese Cookies sind technisch
            notwendig f&uuml;r den Betrieb der Plattform und enthalten keine
            Tracking- oder Werbedaten. Eine gesonderte Einwilligung ist
            f&uuml;r diese technisch notwendigen Cookies nicht erforderlich.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">5. Zahlungsdienstleister</h2>
          <p className="text-muted-foreground">
            F&uuml;r die Abwicklung von Zahlungen nutzen wir den
            Zahlungsdienstleister Mollie B.V., Keizersgracht 126, 1015 CW
            Amsterdam, Niederlande. Bei einer Buchung werden die f&uuml;r die
            Zahlungsabwicklung erforderlichen Daten (Name, Zahlungsinformationen)
            an Mollie &uuml;bermittelt. Die Datenverarbeitung durch Mollie
            erfolgt gem&auml;&szlig; deren eigener Datenschutzerkl&auml;rung.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">6. Ihre Rechte</h2>
          <p className="text-muted-foreground">
            Gem&auml;&szlig; Art. 15 bis 21 DSGVO haben Sie folgende Rechte:
            Auskunft &uuml;ber Ihre gespeicherten Daten (Art. 15); Berichtigung
            unrichtiger Daten (Art. 16); L&ouml;schung Ihrer Daten (Art. 17);
            Einschr&auml;nkung der Verarbeitung (Art. 18);
            Datenportabilit&auml;t (Art. 20); Widerspruch gegen die
            Verarbeitung (Art. 21). Zur Aus&uuml;bung Ihrer Rechte wenden Sie
            sich bitte an contact@shawnbecker.de.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">7. Beschwerderecht</h2>
          <p className="text-muted-foreground">
            Sie haben das Recht, sich bei einer Datenschutzaufsichtsbeh&ouml;rde
            zu beschweren. Die f&uuml;r uns zust&auml;ndige
            Aufsichtsbeh&ouml;rde ist die Berliner Beauftragte f&uuml;r
            Datenschutz und Informationsfreiheit, Friedrichstr. 219, 10969
            Berlin.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">8. Kontakt</h2>
          <p className="text-muted-foreground">
            Bei Fragen zum Datenschutz erreichen Sie uns unter
            contact@shawnbecker.de.
          </p>
        </section>
      </div>
    </main>
  );
}
