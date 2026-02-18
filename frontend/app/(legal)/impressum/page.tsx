import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum',
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl mb-8">Impressum</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl mb-4">Angaben gem. &sect; 5 TMG</h2>
          <p className="text-muted-foreground">
            Shawn G. Becker<br />
            Baseler Str 38<br />
            12205 Berlin
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">Kontakt</h2>
          <p className="text-muted-foreground">
            E-Mail: contact@shawnbecker.de<br />
            Telefon: +49 170 966 47 25
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">
            Verantwortlich f. d. Inhalt gem. &sect; 55 Abs. 2 RSt
          </h2>
          <p className="text-muted-foreground">
            Shawn G. Becker<br />
            Baseler Str 38<br />
            12205 Berlin
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">Haftung f&uuml;r Inhalte</h2>
          <p className="text-muted-foreground">
            Die Inhalte unserer Seiten wurden mit gr&ouml;&szlig;ter Sorgfalt
            erstellt. F&uuml;r die Richtigkeit, Vollst&auml;ndigkeit und
            Aktualit&auml;t der Inhalte k&ouml;nnen wir jedoch keine
            Gew&auml;hr &uuml;bernehmen. Als Diensteanbieter sind wir
            gem&auml;&szlig; &sect; 7 Abs. 1 TMG f&uuml;r eigene Inhalte auf
            diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
            &sect;&sect; 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
            verpflichtet, &uuml;bermittelte oder gespeicherte fremde
            Informationen zu &uuml;berwachen oder nach Umst&auml;nden zu
            forschen, die auf eine rechtswidrige T&auml;tigkeit hinweisen.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">Haftung f&uuml;r Links</h2>
          <p className="text-muted-foreground">
            Unser Angebot enth&auml;lt Links zu externen Webseiten Dritter, auf
            deren Inhalte wir keinen Einfluss haben. Deshalb k&ouml;nnen wir
            f&uuml;r diese fremden Inhalte auch keine Gew&auml;hr
            &uuml;bernehmen. F&uuml;r die Inhalte der verlinkten Seiten ist
            stets der jeweilige Anbieter oder Betreiber der Seiten
            verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
            Verlinkung auf m&ouml;gliche Rechtsverst&ouml;&szlig;e
            &uuml;berpr&uuml;ft. Rechtswidrige Inhalte waren zum Zeitpunkt der
            Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle
            der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer
            Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
            Rechtsverletzungen werden wir derartige Links umgehend entfernen.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">Urheberrecht</h2>
          <p className="text-muted-foreground">
            Die durch den Seitenbetreiber erstellten Inhalte und Werke auf
            diesen Seiten unterliegen dem deutschen Urheberrecht. Die
            Vervielf&auml;ltigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung au&szlig;erhalb der Grenzen des Urheberrechtes
            bed&uuml;rfen der schriftlichen Zustimmung des jeweiligen Autors
            bzw. Erstellers. Downloads und Kopien dieser Seite sind nur f&uuml;r
            den privaten, nicht kommerziellen Gebrauch gestattet.
          </p>
        </section>
      </div>
    </main>
  );
}
