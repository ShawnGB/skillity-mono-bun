import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Widerrufsbelehrung',
  robots: { index: false },
};

export default function WiderrufPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl mb-8">Widerrufsbelehrung</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl mb-4">Widerrufsrecht</h2>
          <p className="text-muted-foreground">
            Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von
            Gr&uuml;nden diesen Vertrag zu widerrufen. Die Widerrufsfrist
            betr&auml;gt vierzehn Tage ab dem Tag des Vertragsabschlusses.
          </p>
          <p className="text-muted-foreground mt-4">
            Um Ihr Widerrufsrecht auszu&uuml;ben, m&uuml;ssen Sie uns mittels
            einer eindeutigen Erkl&auml;rung (z.B. ein mit der Post versandter
            Brief oder E-Mail) &uuml;ber Ihren Entschluss, diesen Vertrag zu
            widerrufen, informieren. Richten Sie diese an:
          </p>
          <p className="text-muted-foreground mt-4">
            Shawn G. Becker<br />
            Baseler Str 38<br />
            12205 Berlin<br />
            E-Mail: contact@shawnbecker.de
          </p>
          <p className="text-muted-foreground mt-4">
            Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die
            Mitteilung &uuml;ber die Aus&uuml;bung des Widerrufsrechts vor
            Ablauf der Widerrufsfrist absenden.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">Folgen des Widerrufs</h2>
          <p className="text-muted-foreground">
            Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle
            Zahlungen, die wir von Ihnen erhalten haben,
            unverz&uuml;glich und sp&auml;testens binnen vierzehn Tagen ab dem
            Tag zur&uuml;ckzuzahlen, an dem die Mitteilung &uuml;ber Ihren
            Widerruf bei uns eingegangen ist. F&uuml;r diese
            R&uuml;ckzahlung verwenden wir dasselbe Zahlungsmittel, das Sie
            bei der urspr&uuml;nglichen Transaktion eingesetzt haben, es sei
            denn, mit Ihnen wurde ausdr&uuml;cklich etwas anderes vereinbart.
            In keinem Fall werden Ihnen wegen dieser R&uuml;ckzahlung Entgelte
            berechnet.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">Ausschluss des Widerrufsrechts</h2>
          <p className="text-muted-foreground">
            Das Widerrufsrecht erlischt bei einem Vertrag zur Erbringung von
            Dienstleistungen, wenn der Unternehmer die Dienstleistung
            vollst&auml;ndig erbracht hat und mit der Ausf&uuml;hrung der
            Dienstleistung erst begonnen hat, nachdem der Verbraucher
            dazu seine ausdr&uuml;ckliche Zustimmung gegeben hat und
            gleichzeitig seine Kenntnis davon best&auml;tigt hat, dass er sein
            Widerrufsrecht bei vollst&auml;ndiger Vertragserf&uuml;llung durch
            den Unternehmer verliert.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">Muster-Widerrufsformular</h2>
          <p className="text-muted-foreground">
            Wenn Sie den Vertrag widerrufen wollen, k&ouml;nnen Sie das
            folgende Formular verwenden (nicht vorgeschrieben):
          </p>
          <div className="mt-4 p-6 bg-muted/50 rounded-lg text-sm text-muted-foreground space-y-2">
            <p>An: Shawn G. Becker, Baseler Str 38, 12205 Berlin, contact@shawnbecker.de</p>
            <p>
              Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*)
              abgeschlossenen Vertrag &uuml;ber die Erbringung der folgenden
              Dienstleistung:
            </p>
            <p>Bestellt am (*) / erhalten am (*):</p>
            <p>Name des/der Verbraucher(s):</p>
            <p>Anschrift des/der Verbraucher(s):</p>
            <p>Datum:</p>
            <p className="text-xs mt-4">(*) Unzutreffendes streichen.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
