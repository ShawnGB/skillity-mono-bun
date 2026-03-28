import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

export function meta() {
  return [
    { title: 'Kleingewerbe Guide for Workshop Conductors | u/skillity' },
    {
      name: 'description',
      content:
        'A practical guide to registering as a Kleingewerbe in Germany — for workshop conductors who want to teach and get paid legally.',
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://skillity.de/guides/kleingewerbe',
    },
  ];
}

const sections = [
  {
    heading: 'Can you start before registering?',
    body: `Short answer: yes. You can run your first workshop and even take payment before your registration is complete — as long as you intend to register and do so soon after.

The Steuernummer (tax number) can take a few weeks to arrive by post. But the wait does not stop you. Once you have submitted the Fragebogen zur steuerlichen Erfassung (see below), you can start. On any invoice you issue before the number arrives, write: "Steuernummer beantragt" (tax number applied for). This is legally recognised.

So: submit the form, run your workshop, and your number will follow.`,
  },
  {
    heading: 'What is a Kleingewerbe?',
    body: `A Kleingewerbe (small trade) is the simplest form of self-employment in Germany. No minimum capital, no notary, no accountant required to start. You register as a sole trader (Einzelunternehmer).

It is different from a Freiberufler (freelancer). Workshop conductors are generally considered Gewerbetreibende, not Freiberufler, because the income comes from organising events rather than providing a specific professional service like consulting, legal advice, or art. In practice this rarely matters — the paperwork is similar and the tax treatment is the same for small earners.`,
  },
  {
    heading: 'How to register — two steps, one often enough',
    body: `There are two separate registrations in Germany. Most people only need to do step one.

Step 1 — Finanzamt (tax office): Fill in the Fragebogen zur steuerlichen Erfassung. This is the main registration. You can do it online via ELSTER (elster.de) or in person. A few weeks later your Steuernummer arrives by post. This is what you put on invoices.

Step 2 — Gewerbeamt (trade office): Some municipalities also require a formal Gewerbeanmeldung here. The fee is typically €20–€30 and it takes about 15 minutes. In Berlin, the Gewerbeamt notifies the Finanzamt automatically when you register — so in practice many people do step 2 first and skip step 1, since the Finanzamt then sends the Fragebogen to you.

Either route works. For most workshop conductors, submitting via ELSTER is the quickest path.

For Berlin: your Finanzamt is determined by your home address. Find yours at finanzamt.berlin.de.`,
  },
  {
    heading: 'Already have a Steuernummer?',
    body: `If you already have a Steuernummer from previous freelance work or employment, you do not need a new one. You use the same number.

What you do need to do: inform your Finanzamt that you are now running a Gewerbebetrieb (business activity). You can do this via ELSTER by updating your tax situation, or by writing a short letter to your Finanzamt. If you are also registering at the Gewerbeamt, they notify the Finanzamt on your behalf.

Your existing Steuernummer goes on your invoices. Nothing else changes.`,
  },
  {
    heading: 'Kleinunternehmerregelung — no VAT up to €25,000',
    body: `If your total annual revenue stays below €25,000 (raised from €22,000 in 2025 under §19 UStG), you qualify for the Kleinunternehmerregelung. This means:

- You do not charge VAT (Umsatzsteuer / MwSt.) on your services
- You do not file VAT returns (Umsatzsteuervoranmeldungen)
- Your invoices must state: "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet."

This is the default for most new workshop conductors and makes everything much simpler. If you expect to exceed €25,000 in year one, consult a Steuerberater (tax advisor) about opting into standard VAT to reclaim input VAT on purchases.`,
  },
  {
    heading: 'What counts as income',
    body: `Ticket revenue from workshops is taxable income (Einkünfte aus Gewerbebetrieb). This includes:

- Direct ticket sales through Skillity
- Any workshop fees paid privately or via bank transfer
- Revenue from related activities (selling materials, private lessons)

Deductible business expenses (Betriebsausgaben) include: venue hire, materials and supplies, platform fees (the 5% Skillity fee is deductible), equipment, and a proportion of your phone or internet if used for the business.

Keep all receipts. You will declare your profit on your annual income tax return (Einkommensteuererklärung) using the Anlage G form.`,
  },
  {
    heading: 'Invoicing basics',
    body: `You are not legally required to issue invoices for every workshop booking — Skillity provides payment receipts to attendees. However, for any direct payment or B2B transaction, an invoice (Rechnung) is required.

A compliant German invoice must include:
- Your full name and address
- Your Steuernummer (or "Steuernummer beantragt" if still waiting)
- The recipient's name and address
- Invoice date and a sequential invoice number
- Description of the service
- Net amount, VAT rate (or § 19 UStG note), and total
- Payment terms

Invoice numbering must be sequential and without gaps. Keep copies for 10 years.`,
  },
  {
    heading: 'When to consider a GmbH or UG instead',
    body: `For most workshop conductors starting out, a Kleingewerbe is the right choice. Consider a GmbH or UG (Unternehmergesellschaft, the "Mini-GmbH") if:

- You expect significant revenue and want to limit personal liability
- You have co-founders and need a shared legal entity
- You are taking on employees or larger commercial contracts
- You want a clear separation between personal and business finances for investors

A UG can be founded with as little as €1 of share capital, but requires a notary and has ongoing administrative requirements. A Steuerberater or Gründungsberater can help you decide.`,
  },
];

export default function KleingewerbePage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <Link
        to="/teach"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; Back to becoming a conductor
      </Link>

      <div className="mt-8 mb-12">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
          Guide
        </p>
        <h1 className="text-4xl mb-4">
          Registering a Kleingewerbe
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          The shortest path to teaching workshops legally in Germany. No
          lawyer, no accountant, and less waiting than you think.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          This guide is for informational purposes only and does not constitute
          legal or tax advice. When in doubt, consult a Steuerberater.
        </p>
      </div>

      <div className="space-y-10">
        {sections.map((section, i) => (
          <div key={i} className="space-y-3">
            <h2 className="text-xl font-semibold">{section.heading}</h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              {section.body.split('\n\n').map((para, j) => (
                <p key={j} className="whitespace-pre-line">
                  {para}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-xl border bg-card p-6 space-y-4">
        <h2 className="font-semibold">Useful links</h2>
        <ul className="space-y-2 text-sm">
          {[
            ['ELSTER — online tax registration', 'https://www.elster.de'],
            [
              'Finanzamt Berlin — find your local office',
              'https://www.berlin.de/sen/finanzen/steuern/finanzaemter/',
            ],
            [
              'Berlin.de — Gewerbeanmeldung online',
              'https://service.berlin.de/dienstleistung/305249/',
            ],
            [
              'IHK Berlin — Gewerbe registration info',
              'https://www.ihk.de/berlin/fuer-unternehmen/recht-und-fair-play/gewerberecht/gewerbeanmeldung',
            ],
          ].map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:no-underline"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-6">
          Ready to start? Create your first workshop on Skillity.
        </p>
        <Button asChild size="lg">
          <Link to="/onboarding">Become a Conductor</Link>
        </Button>
      </div>
    </main>
  );
}
