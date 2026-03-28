import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

export function meta() {
  return [
    { title: 'How to Plan Your First Workshop | u/skillity' },
    {
      name: 'description',
      content:
        'A practical guide to planning your first workshop — from choosing a topic to what to do on the day.',
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://skillity.de/guides/plan-workshop',
    },
  ];
}

const sections = [
  {
    heading: 'Start with the experience, not the content',
    body: `The most common mistake in planning a first workshop is starting with "what do I know?" instead of "what will people feel or be able to do at the end?"

Before you decide on content, write one sentence: "After this workshop, participants will be able to ___." That sentence is your anchor. Everything else — what you cover, how long it takes, what materials you bring — should serve it.

Good anchors are concrete and achievable in a single session:
- "...bake a sourdough loaf from scratch"
- "...have a 2-minute conversation in Italian"
- "...throw a basic pinch pot on a wheel"

Avoid anchors that are vague ("...understand ceramics better") or too large for one session ("...speak German fluently").`,
  },
  {
    heading: 'How long should it be?',
    body: `Two hours is the sweet spot for most first workshops. Long enough to actually do something, short enough to stay focused and not exhaust anyone — including you.

A rough structure that works:
- 10–15 min: Welcome, introductions, what we're doing today
- 60–80 min: The actual doing — the hands-on part
- 20–30 min: Refinement, Q&A, show and tell
- 5 min: Wrap-up

Three-hour workshops work well for more complex crafts (ceramics, cooking) where you need time for the material to behave. Anything longer than three hours is hard to sustain on a first run — save that for when you know the format.`,
  },
  {
    heading: 'How many people?',
    body: `Start smaller than you think. 6–8 people is ideal for a first workshop. Small enough that you can give everyone individual attention, large enough that the energy in the room feels real.

Reasons to stay small at first:
- You can focus on quality over logistics
- It's easier to recover if something goes wrong
- You get better feedback — smaller groups talk more openly
- If it sells out, that's a great problem and a reason to run it again

Once you've run it once and know what works, you can scale. Some workshops stay small by design (jewellery, life drawing, intense language sessions). Others can easily grow to 15–20 (cooking classes, talks, group crafts).`,
  },
  {
    heading: 'Setting a price',
    body: `Price your workshop to cover your costs plus your time — and don't apologise for it.

A simple formula:
- Materials per person + your share of the venue cost = cost per head
- Add your time: if the workshop takes 2 hours to run and 1 hour to prepare, that's 3 hours. What's your hourly rate?
- Add a small buffer for things you forgot (there always are some)

What this looks like in practice: if materials cost €10/person, venue is €60 shared across 8 people (€7.50 each), and you value your time at €30/hour × 3 hours = €90 / 8 people = €11.25, then your floor is around €29/person. Pricing at €35–€45 is reasonable.

A few other things worth knowing:
- People pay more for a specific outcome than a vague experience. "Learn to make pasta from scratch" commands a higher price than "Italian food class."
- Underpricing signals low value. If your workshop is worth attending, price it that way.
- It's easier to lower a price than raise it. Start where you're comfortable, not at the absolute minimum.`,
  },
  {
    heading: 'Writing a description that works',
    body: `Your workshop description has one job: help the right person decide to book.

Lead with what they'll do or make — not your biography or your teaching philosophy. Save the personal context for later in the description.

A structure that works:
1. One sentence on what participants will actually do or create
2. Two or three sentences on what makes your approach or this experience particular
3. What's included (materials, drinks, etc.) and what to bring
4. Who it's for (and who it's not for, if relevant)
5. Any practical notes (wear old clothes, arrive hungry, beginners welcome)

Keep it honest. If it's physically demanding, say so. If it's messy, say so. Accurate descriptions mean fewer awkward surprises and better reviews.`,
  },
  {
    heading: 'What to prepare before the day',
    body: `A week before:
- Confirm your venue and any access details
- Buy or gather all materials — more than you think you need
- Do a rough run-through in your head or with a friend
- Send participants any important info (what to wear, what to bring, where to find the entrance)

The day before:
- Prep everything you can in advance (cut materials, pre-measure quantities, test any equipment)
- Know your timing: which parts might run long? What can you cut if you're behind?

On the morning:
- Arrive early. At least 30 minutes before the start time.
- Set up the space before anyone arrives — nothing kills the vibe like participants standing around while you set up
- Have a simple welcome routine ready so early arrivals don't just stand awkwardly`,
  },
  {
    heading: 'On the day',
    body: `A few things that consistently make workshops better, regardless of topic:

People remember how they felt, not what they learned. Make the room feel welcoming from the moment they walk in — music, name cards, something ready on the table, a warm hello.

Start with a brief genuine introduction. Who you are, why you care about this, what you want them to leave with. Not a long bio — two minutes maximum.

Give people permission to fail. Especially for craft workshops: explicitly tell participants that the first attempt is for learning, not for the shelf. It takes the pressure off and people relax and do better work.

Check in as you go. Walk around, notice who's struggling, offer help quietly rather than calling out mistakes in front of the group.

End deliberately. Don't just trail off. Bring everyone back together, let people share what they made or learned, say something genuine to close. It only takes five minutes but it makes the whole session feel complete.`,
  },
  {
    heading: 'After: the part most people skip',
    body: `The first run of a workshop is research. Treat it that way.

Write down what happened while it's fresh: what went long, what went fast, what confused people, what delighted them. You won't remember the details in a week.

Ask for honest feedback. Not just "did you enjoy it?" — ask what was unclear, what they'd change, whether the time felt right. People are more candid in a short written form than in person.

Reviews on Skillity are only from people who attended, so they're worth more than they look. Respond to them — it shows future participants that you take the work seriously.

Then: run it again. The second version is almost always significantly better than the first. Most good workshop conductors will tell you it takes three or four runs before a workshop really finds its shape.`,
  },
];

export default function PlanWorkshopPage() {
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
        <h1 className="text-4xl mb-4">How to Plan Your First Workshop</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          From choosing what to teach to what to do on the day — a practical
          walkthrough for people who want to run a great first session, not a
          perfect one.
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

      <div className="mt-16 rounded-xl border bg-card p-6 space-y-3">
        <h2 className="font-semibold">More guides</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              to="/guides/find-location"
              className="text-primary underline hover:no-underline"
            >
              How to find a venue in Berlin &rarr;
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
          Ready to put this into practice?
        </p>
        <Button asChild size="lg">
          <Link to="/workshops/new">Create Your First Workshop</Link>
        </Button>
      </div>
    </main>
  );
}
