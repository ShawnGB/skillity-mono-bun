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
    heading: 'Do you need to register at all?',
    body: `If you run workshops and charge for them, you are operating a business (Gewerbe) in Germany. This applies even if it's a side activity alongside a regular job. The good news: registering a Kleingewerbe is simple, inexpensive, and takes about 15 minutes at your local Finanzamt or online via ELSTER.

You do not need to register before your first paid workshop — but you should register as soon as you plan to do it regularly or earn meaningful income from it.`,
  },
  {
    heading: 'What is a Kleingewerbe?',
    body: `A Kleingewerbe (small trade) is the simplest form of self-employment in Germany. Unlike a GmbH or UG, there is no minimum capital, no notary required, and very little paperwork. You register as a sole trader (Einzelunternehmer or Einzelkaufmann/Einzelkauffrau depending on your revenue).

It is distinct from a Freiberufler (freelancer). Workshop conductors are generally considered Gewerbetreibende, not Freiberufler, because the income comes from organising events rather than providing independent professional services like consulting or art.`,
  },
  {
    heading: 'How to register',
    body: `1. Fill in the Fragebogen zur steuerlichen Erfassung (tax registration questionnaire) via ELSTER (elster.de) or in person at your Finanzamt.
2. You will receive a Steuernummer (tax number) within a few weeks. Keep this — you need it for invoices.
3. If your municipality requires it, you may also need to register at the Gewerbeamt (trade office). The fee is typically €20–€30. Many Fintanzamt registrations cover this automatically — check with your local office.

For activities happening mainly in Berlin, your Finanzamt is determined by your home address. You can find yours at finanzamt.berlin.de.`,
  },
  {
    heading: 'Kleinunternehmerregelung — no VAT up to €25,000',
    body: `If your total annual revenue stays below €25,000 (raised from €22,000 in 2025 under §19 UStG), you qualify for the Kleinunternehmerregelung. This means:

- You do not charge VAT (Umsatzsteuer / MwSt.) on your services
- You do not file VAT returns (Umsatzsteuervoranmeldungen)
- Your invoices must state: "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet."

This is the default for most new workshop conductors. If you expect to exceed €25,000 in year one, you may want to opt into standard VAT to reclaim input VAT on purchases — consult a Steuerberater (tax advisor) in that case.`,
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
    body: `You are not legally required to issue invoices for every workshop booking — Skillity provides payment receipts. However, for any direct payment or B2B transaction, an invoice (Rechnung) is required.

A compliant German invoice must include:
- Your full name and address
- Your Steuernummer or USt-IdNr.
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
          Kleingewerbe for Workshop Conductors
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A practical guide to teaching workshops legally in Germany — without
          a lawyer, without an accountant, and without much paperwork. Written
          for people who want to share what they know and get paid for it.
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
              'Existenzgründer — Kleingewerbe overview (DE)',
              'https://www.existenzgruender.de/DE/Gruendung-vorbereiten/Gruendungswissen/Kleingewerbe/inhalt.html',
            ],
            [
              'Finanzamt Berlin — find your local office',
              'https://www.berlin.de/sen/finanzen/steuern/finanzaemter/',
            ],
            [
              'IHK Berlin — Gewerbe registration',
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
