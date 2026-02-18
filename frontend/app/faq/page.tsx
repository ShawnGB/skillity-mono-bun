import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about hosting and attending workshops on uSkillity.',
};

const hostFaq = [
  {
    question: 'What qualifications do I need to host a workshop?',
    answer:
      'No degree or certification required. If you have passion for a topic and are willing to share it, you can host a workshop on uSkillity.',
  },
  {
    question: 'How do I cancel a workshop?',
    answer:
      'You can cancel a workshop up to 72 hours before the start date. All booked participants will receive a full refund automatically.',
  },
  {
    question: 'When do I get paid?',
    answer:
      'Payments are processed through Mollie after your workshop concludes. You receive 100% of the price you set.',
  },
  {
    question: 'What is the commission?',
    answer:
      'We add a 5% service fee on top of your listed price. This fee is paid by the learner. You keep everything you charge.',
  },
  {
    question: 'What if a participant behaves inappropriately?',
    answer:
      'Contact us at contact@shawnbecker.de and we will handle it. You can also leave feedback on the participant.',
  },
];

const learnerFaq = [
  {
    question: 'Can I get a refund?',
    answer:
      'Yes. You can cancel a booking up to 72 hours before the workshop starts for a full refund. After that, no refund is issued. If the host cancels, you always get a full refund.',
  },
  {
    question: 'How do I contact the host?',
    answer:
      'If you have questions about a workshop, contact us at contact@shawnbecker.de and we will connect you with the host.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'Payments are handled through Mollie, which supports a range of methods including credit card, iDEAL, and more depending on your location.',
  },
  {
    question: 'What if a workshop is cancelled?',
    answer:
      'If a host cancels their workshop, you receive a full refund automatically. No action needed on your part.',
  },
  {
    question: 'How are prices set?',
    answer:
      'Each host sets their own price. A 5% service fee is added on top at checkout to support the platform.',
  },
];

export default function FAQPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl mb-4">Frequently Asked Questions</h1>
      <p className="text-muted-foreground mb-12">
        Everything you need to know about hosting and attending workshops on
        uSkillity.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl mb-6">For Hosts</h2>
        <div className="space-y-6">
          {hostFaq.map((item) => (
            <div key={item.question}>
              <h3 className="font-medium text-lg mb-2">{item.question}</h3>
              <p className="text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl mb-6">For Learners</h2>
        <div className="space-y-6">
          {learnerFaq.map((item) => (
            <div key={item.question}>
              <h3 className="font-medium text-lg mb-2">{item.question}</h3>
              <p className="text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
