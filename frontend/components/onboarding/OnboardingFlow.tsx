import { useState, useEffect } from 'react';
import { useFetcher, Link } from 'react-router';
import { CheckCircle, CreditCard, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  { label: 'About You', icon: User },
  { label: 'Payment', icon: CreditCard },
  { label: 'Done', icon: CheckCircle },
];

export default function OnboardingFlow() {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const profileFetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const [step, setStep] = useState(0);
  const [conductorType, setConductorType] = useState<
    'individual' | 'company' | null
  >(null);

  const isPending = fetcher.state !== 'idle';
  const isProfilePending = profileFetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.ok) {
      setStep(2);
    }
  }, [fetcher.state, fetcher.data]);

  useEffect(() => {
    if (profileFetcher.state === 'idle' && profileFetcher.data?.ok) {
      setStep(1);
    }
  }, [profileFetcher.state, profileFetcher.data]);

  const handleAboutYouNext = () => {
    if (conductorType) {
      profileFetcher.submit(
        { conductorType },
        { method: 'post', action: '/api/profile' },
      );
    } else {
      setStep(1);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-12">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                i <= step
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-px w-12 transition-colors ${i < step ? 'bg-primary' : 'bg-muted'}`}
              />
            )}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl mb-2">Tell Us About Yourself</h1>
            <p className="text-muted-foreground">
              Are you conducting workshops as an individual or through a company?
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConductorType('individual')}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  conductorType === 'individual'
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-accent'
                }`}
              >
                <p className="font-medium text-sm">Individual</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Freelancer or sole trader
                </p>
              </button>
              <button
                type="button"
                onClick={() => setConductorType('company')}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  conductorType === 'company'
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-accent'
                }`}
              >
                <p className="font-medium text-sm">Company</p>
                <p className="text-xs text-muted-foreground mt-1">
                  GmbH, UG, or other entity
                </p>
              </button>
            </div>
            {conductorType === 'individual' && (
              <p className="text-xs text-muted-foreground">
                In Germany, workshop conductors typically register a
                Kleingewerbe (free, ~15 min at your Finanzamt).{' '}
                <a
                  href="https://www.existenzgruender.de/DE/Gruendung-vorbereiten/Gruendungswissen/Kleingewerbe/inhalt.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  Learn more
                </a>
              </p>
            )}
            {profileFetcher.data?.error && (
              <p className="text-xs text-destructive">
                {profileFetcher.data.error}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
              disabled={isProfilePending}
            >
              Skip
            </Button>
            <Button
              className="flex-1"
              onClick={handleAboutYouNext}
              disabled={isProfilePending}
            >
              {isProfilePending ? 'Saving...' : 'Next'}
            </Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl mb-2">Connect Your Payment Account</h1>
            <p className="text-muted-foreground">
              We use Mollie to handle payments securely. Connect your account so
              you can receive earnings from your workshops.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-8 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold font-sans">Mollie Payments</h3>
            <p className="text-sm text-muted-foreground">
              Secure payment processing. We keep just 5%. The rest goes directly
              to you.
            </p>

            {fetcher.data?.error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {fetcher.data.error}
              </div>
            )}

            <fetcher.Form method="post" action="/api/become-host">
              <Button
                size="lg"
                className="w-full"
                type="submit"
                disabled={isPending}
              >
                {isPending ? 'Connecting...' : 'Connect with Mollie'}
              </Button>
            </fetcher.Form>
          </div>

          <Button variant="ghost" className="w-full" onClick={() => setStep(0)}>
            &larr; Back
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl mb-2">You&rsquo;re All Set!</h1>
            <p className="text-muted-foreground">
              Your account has been upgraded to Host. You can now create
              workshops and start sharing what you know.
            </p>
          </div>
          <Button size="lg" className="w-full" asChild>
            <Link to="/workshops/new">Create Your First Workshop</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
