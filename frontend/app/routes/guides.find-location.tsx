import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

export function meta() {
  return [
    { title: 'How to Find a Workshop Venue in Berlin | u/skillity' },
    {
      name: 'description',
      content:
        'A guide to finding and booking a space for your workshop in Berlin — from free community rooms to studios and private venues.',
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://skillity.de/guides/find-location',
    },
  ];
}

const sections = [
  {
    heading: 'You probably already have somewhere',
    body: `Before you start looking: the best first venue is often the one you already have access to.

A home kitchen works for a pasta or fermentation workshop. A garage works for basic woodworking. A living room works for a language session with 6 people. A friend's studio works if you ask nicely. Starting with a space you already trust removes a lot of uncertainty from an already unfamiliar situation.

The "right" venue will feel obvious once you've run the workshop a few times. For a first session, good enough is good enough.`,
  },
  {
    heading: 'Types of spaces in Berlin — and what they cost',
    body: `Community and neighbourhood centres (Nachbarschaftshäuser, Bürgerzentren):
Many Berlin neighbourhoods have publicly subsidised community spaces available for low cost or free to individuals running non-commercial activities. Rates vary widely — some charge €5–€15/hour, others ask for a small donation. Search "[your Bezirk] Nachbarschaftshaus" or ask at your local Bürgeramt.

VHS (Volkshochschule) spaces:
Berlin's Volkshochschulen have studio and seminar rooms that are sometimes rented to outside groups. Worth calling your local VHS directly.

Libraries (Stadtbibliothek Berlin):
Several Berlin public libraries have event rooms that can be booked for free or low cost for public-facing events. Check your local branch — policies vary by Bezirk.

Coworking spaces:
Many Berlin coworking spaces have event rooms or meeting rooms available hourly. Rates are typically €20–€80/hour. Some coworking operators are open to revenue-share arrangements for workshops their members might want to attend.

Cafes and restaurants with private rooms:
Some cafes will give you the space in exchange for a minimum spend (drinks, food) rather than a flat room fee. Good for morning or afternoon sessions. Ask off-peak — Tuesday afternoon is a better moment to negotiate than Saturday morning.

Artist studios and makerspaces:
Berlin has a dense network of artist studios, ceramics studios, woodworking shops, and makerspaces (like Fab Lab Berlin or Noisebridge-style spaces). Many will rent by the hour or session to outside conductors. Access to specialist equipment (pottery wheel, laser cutter, screen printing gear) is a real draw — this is a category worth exploring actively.

Private venue hire platforms:
Peerspace and similar platforms list private spaces — lofts, studios, kitchens, rooftops — by the hour. Prices range from €30 to €300+/hour depending on size and finish. Good for when you need something specific and photogenic.`,
  },
  {
    heading: 'What to budget for a venue',
    body: `As a rough guide:
- Free: your own space, community rooms, library rooms, some Nachbarschaftshäuser
- €0–€30/session: many community centres, small studio shares, friend's space in exchange for a ticket
- €30–€80/session: coworking rooms, small studio rentals, cafe private rooms
- €80–€200/session: dedicated studio hire, Peerspace-type venues
- €200+/session: large event spaces, premium kitchens, professional studios

For a first workshop with 8 people and tickets at €40, your gross revenue is €320. A venue at €60 is 19% of gross — manageable. A venue at €200 is 63% — that's a different business.

The first few times, optimise for low fixed costs. Once you know the workshop works and at what price, you can invest in a nicer space.`,
  },
  {
    heading: 'Questions to ask a venue before you book',
    body: `Before committing, walk through these:

Access and timing:
- Can I arrive 30 minutes early to set up?
- Is there time after the session to clean up, or does the next booking follow immediately?
- Is there storage for materials if I want to leave things overnight?

Capacity and layout:
- What's the maximum number of people?
- Can the furniture be rearranged? (Tables vs chairs-in-a-circle matters a lot for workshop dynamics)
- Is there a kitchen or sink? (Essential for food, ceramics, and some craft workshops)

Practical:
- Is there reliable WiFi? (Needed if you're showing video or using a presentation)
- Is there natural light? (Matters more than people expect for crafts, art, and general mood)
- Is it accessible (lift, step-free entrance)?
- Where is the nearest public transport stop?

Commercial:
- Do they allow you to charge participants and keep the revenue?
- Are there any restrictions on what you can do in the space (food, noise, open flame, etc.)?
- What's the cancellation policy if you need to reschedule?`,
  },
  {
    heading: 'Negotiating the cost',
    body: `Most venue owners are open to a conversation, especially if you are:

- Running a series (recurring bookings are more valuable than one-offs)
- Bringing in people who might become regulars or members
- Willing to promote the space on social media or in your listings
- Flexible on timing (off-peak slots are often cheaper or free)

A straightforward ask: "I'm starting a workshop series and looking for a regular space. Would you be open to a reduced rate in exchange for a recurring monthly booking?" Many spaces will say yes.`,
  },
  {
    heading: 'When the venue is part of the experience',
    body: `For some workshops, the space is a selling point in itself. A ceramics class in an actual ceramics studio is different from the same class in a community hall. A foraging walk meets in a forest. A wine tasting is better in an actual wine bar.

If the space matches the subject matter, say so in your listing description. It adds credibility and is a genuine reason for someone to choose your workshop over a competitor's.

On the other hand: don't wait for the perfect venue. Many beloved, long-running workshops started in someone's living room. The experience comes from the conductor, not the postcode.`,
  },
];

const resources = [
  [
    'Peerspace Berlin — hourly studio and venue hire',
    'https://www.peerspace.com/s/berlin--germany',
  ],
  [
    'Fab Lab Berlin — makerspace with equipment rental',
    'https://fablab.berlin',
  ],
  [
    'Stadtbibliothek Berlin — library venue rooms',
    'https://www.berlin.de/stadtbibliothek-berlin/',
  ],
  [
    'Volkshochschule Berlin — district VHS locations',
    'https://www.berlin.de/vhs/',
  ],
];

export default function FindLocationPage() {
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
        <h1 className="text-4xl mb-4">How to Find a Venue in Berlin</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          From free community rooms to specialist studios — where to look, what
          to ask, and how much to budget for your workshop space.
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
          {resources.map(([label, href]) => (
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

      <div className="mt-8 rounded-xl border bg-card p-6 space-y-3">
        <h2 className="font-semibold">More guides</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              to="/guides/plan-workshop"
              className="text-primary underline hover:no-underline"
            >
              How to plan your first workshop &rarr;
            </Link>
          </li>
          <li>
            <Link
              to="/guides/kleingewerbe"
              className="text-primary underline hover:no-underline"
            >
              Registering a Kleingewerbe &rarr;
            </Link>
          </li>
        </ul>
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-6">
          Found your space? Create your workshop.
        </p>
        <Button asChild size="lg">
          <Link to="/workshops/new">Create Your Workshop</Link>
        </Button>
      </div>
    </main>
  );
}
