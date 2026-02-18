import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Guidelines',
  description:
    'Our guidelines for creating a respectful, safe, and welcoming community on uSkillity.',
};

export default function GuidelinesPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl mb-4">Community Guidelines</h1>
      <p className="text-muted-foreground mb-8">
        uSkillity is built on trust between hosts and learners. These guidelines
        help keep our community safe and welcoming for everyone.
      </p>
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl mb-4">Respect and Kindness</h2>
          <ul className="text-muted-foreground space-y-2 list-disc pl-5">
            <li>Treat everyone with respect. Be kind and constructive.</li>
            <li>
              Discrimination, racism, sexism, or harassment of any kind will not
              be tolerated.
            </li>
            <li>
              Treat others as you want to be treated. This applies to workshops,
              reviews, and all communication on the platform.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl mb-4">Content Standards</h2>
          <ul className="text-muted-foreground space-y-2 list-disc pl-5">
            <li>No spam, solicitation, or unsolicited advertising.</li>
            <li>
              No illegal, harmful, or misleading content.
            </li>
            <li>
              Workshop descriptions must accurately reflect what participants
              will experience.
            </li>
            <li>Stay on topic in your workshops and communications.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl mb-4">Reviews</h2>
          <ul className="text-muted-foreground space-y-2 list-disc pl-5">
            <li>
              Reviews must reflect your personal experience as a participant.
            </li>
            <li>Be honest and fair. Critique is welcome, personal attacks are not.</li>
            <li>Paid, incentivized, or fake reviews are prohibited.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl mb-4">Account Integrity</h2>
          <ul className="text-muted-foreground space-y-2 list-disc pl-5">
            <li>Use your real name. No fake or duplicate accounts.</li>
            <li>No trolling or intentional disruption of workshops.</li>
            <li>
              Users under 18 need parental or guardian consent to participate.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl mb-4">Feedback and Issues</h2>
          <p className="text-muted-foreground">
            If you experience something that violates these guidelines, or if
            you have feedback on how we can improve, please contact us at{' '}
            <a
              href="mailto:contact@shawnbecker.de"
              className="text-primary hover:underline"
            >
              contact@shawnbecker.de
            </a>
            . We take every report seriously.
          </p>
        </section>
      </div>
    </main>
  );
}
