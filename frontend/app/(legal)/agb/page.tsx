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
            Diese Allgemeinen Gesch&auml;ftsbedingungen (AGB) gelten f&uuml;r
            die Nutzung der Plattform uSkillity, betrieben von Shawn G. Becker,
            Baseler Str 38, 12205 Berlin. uSkillity ist eine technische
            Plattform, die Gastgebern (Hosts) und Teilnehmern (Lernenden) die
            M&ouml;glichkeit bietet, Workshops zu organisieren und zu buchen.
            uSkillity tritt nicht als Vermittler oder Vertragspartner der
            zwischen Hosts und Teilnehmern geschlossenen Vertr&auml;ge auf.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">2. Leistungsgegenstand</h2>
          <p className="text-muted-foreground">
            uSkillity stellt eine Online-Plattform zur Verf&uuml;gung, &uuml;ber
            die Nutzer Pr&auml;senz-Workshops anbieten und buchen k&ouml;nnen.
            Die Plattform erm&ouml;glicht es Hosts, Workshops zu erstellen und
            zu ver&ouml;ffentlichen, und Lernenden, diese Workshops zu finden
            und zu buchen.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">3. Registrierung</h2>
          <p className="text-muted-foreground">
            Die Nutzung der Plattform setzt eine Registrierung voraus. Nutzer
            m&uuml;ssen vollj&auml;hrig sein und ihren echten Namen verwenden.
            Accounts sind nicht &uuml;bertragbar. Jeder Nutzer darf nur ein Konto
            f&uuml;hren. Minderj&auml;hrige ben&ouml;tigen die Zustimmung eines
            Erziehungsberechtigten.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">4. Verantwortlichkeit der Nutzer</h2>
          <p className="text-muted-foreground">
            Nutzer sind f&uuml;r die von ihnen eingestellten Inhalte selbst
            verantwortlich. Hosts sind f&uuml;r die inhaltliche Richtigkeit
            ihrer Workshop-Beschreibungen sowie f&uuml;r die ordnungsgem&auml;&szlig;e
            Durchf&uuml;hrung ihrer Workshops verantwortlich. uSkillity
            &uuml;bernimmt keine Haftung f&uuml;r nutzergenerierte Inhalte.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">5. Vertragsschluss</h2>
          <p className="text-muted-foreground">
            Die Ver&ouml;ffentlichung eines Workshops durch einen Host stellt
            ein verbindliches Angebot dar. Mit der Buchung durch einen
            Teilnehmer kommt ein Vertrag zwischen dem Host und dem Teilnehmer
            zustande. uSkillity ist nicht Vertragspartei dieses Vertrages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">6. Preise und Zahlung</h2>
          <p className="text-muted-foreground">
            Hosts legen die Preise f&uuml;r ihre Workshops selbst fest. Auf den
            vom Host festgelegten Preis wird eine Servicepauschale von 5%
            aufgeschlagen, die vom Teilnehmer getragen wird. Der Host
            erh&auml;lt 100% des von ihm festgelegten Preises. Die Zahlung
            erfolgt &uuml;ber den Zahlungsdienstleister Mollie. Eine Vorauszahlung
            bei Buchung ist erforderlich. Alle Preise verstehen sich in Euro.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">7. Stornierung</h2>
          <p className="text-muted-foreground">
            Teilnehmer k&ouml;nnen eine Buchung bis 72 Stunden vor Beginn des
            Workshops kostenfrei stornieren. Bei sp&auml;terer Stornierung
            erfolgt keine R&uuml;ckerstattung. Hosts k&ouml;nnen einen Workshop
            bis 72 Stunden vor Beginn absagen. Bei Absage durch den Host
            erhalten alle Teilnehmer eine vollst&auml;ndige R&uuml;ckerstattung.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">8. Bewertungen</h2>
          <p className="text-muted-foreground">
            Bewertungen m&uuml;ssen auf pers&ouml;nlichen Erfahrungen beruhen
            und sachlich formuliert sein. Bezahlte oder gef&auml;lschte
            Bewertungen sind untersagt. uSkillity beh&auml;lt sich das Recht
            vor, Bewertungen zu entfernen, die gegen diese Grunds&auml;tze
            versto&szlig;en.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">9. Haftung</h2>
          <p className="text-muted-foreground">
            uSkillity haftet nur f&uuml;r Sch&auml;den, die auf vors&auml;tzlichem
            oder grob fahrl&auml;ssigem Verhalten beruhen. Als technische
            Plattform &uuml;bernimmt uSkillity keine Haftung f&uuml;r die
            Qualit&auml;t, Sicherheit oder Rechtm&auml;&szlig;igkeit der
            angebotenen Workshops. Die Haftung f&uuml;r leichte
            Fahrl&auml;ssigkeit ist ausgeschlossen, soweit keine wesentlichen
            Vertragspflichten verletzt werden.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">10. Beendigung</h2>
          <p className="text-muted-foreground">
            Nutzer k&ouml;nnen ihr Konto jederzeit l&ouml;schen. uSkillity kann
            Nutzerkonten mit einer Frist von 14 Tagen k&uuml;ndigen. Bei
            schwerwiegenden Verst&ouml;&szlig;en gegen diese AGB kann eine
            sofortige Sperrung erfolgen. Bestehende Buchungen bleiben von einer
            K&uuml;ndigung unber&uuml;hrt.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">11. Schlussbestimmungen</h2>
          <p className="text-muted-foreground">
            Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist
            Berlin. Sollten einzelne Bestimmungen dieser AGB unwirksam sein,
            bleibt die Wirksamkeit der &uuml;brigen Bestimmungen unber&uuml;hrt.
          </p>
        </section>
      </div>
    </main>
  );
}
