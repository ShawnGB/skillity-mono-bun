import { useState, useEffect } from 'react';
import { useFetcher } from 'react-router';
import { useForm } from 'react-hook-form';
import { CreditCard, User } from 'lucide-react';
import type { AuthUser } from '@skillity/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const steps = [
  { label: 'About You', icon: User },
  { label: 'Payment', icon: CreditCard },
];

interface ProfileFormValues {
  tagline: string;
  profession: string;
  conductorType: 'individual' | 'company' | '';
  companyName: string;
}

interface OnboardingFlowProps {
  user: AuthUser;
}

export default function OnboardingFlow({ user }: OnboardingFlowProps) {
  const becomeHostFetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const profileFetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const [step, setStep] = useState(0);

  const isBecomeHostPending = becomeHostFetcher.state !== 'idle' || !!becomeHostFetcher.data;
  const isProfilePending = profileFetcher.state !== 'idle';

  const { register, handleSubmit, watch, setValue } = useForm<ProfileFormValues>({
    defaultValues: {
      tagline: user.tagline ?? '',
      profession: user.profession ?? '',
      conductorType: (user.conductorType ?? '') as 'individual' | 'company' | '',
      companyName: user.companyName ?? '',
    },
  });

  const conductorType = watch('conductorType');

  useEffect(() => {
    if (profileFetcher.state === 'idle' && profileFetcher.data?.ok) {
      setStep(1);
    }
  }, [profileFetcher.state, profileFetcher.data]);

  const onProfileSubmit = (data: ProfileFormValues) => {
    const payload: Record<string, string> = {
      tagline: data.tagline,
      profession: data.profession,
    };
    if (data.conductorType) payload.conductorType = data.conductorType;
    if (data.conductorType === 'company') payload.companyName = data.companyName;

    profileFetcher.submit(payload, { method: 'post', action: '/api/profile' });
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
        <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl mb-2">Tell Us About Yourself</h1>
            <p className="text-muted-foreground">
              This is optional — you can always update it later.
            </p>
          </div>

          {profileFetcher.data?.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {profileFetcher.data.error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="profession">Profession</Label>
              <Input
                id="profession"
                placeholder="e.g. Ceramic artist, Sound designer"
                {...register('profession')}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                placeholder="e.g. Teaching pottery for 10 years in Berlin"
                maxLength={120}
                {...register('tagline')}
              />
              <p className="text-xs text-muted-foreground">
                Shown below your name on your host profile.
              </p>
            </div>

            <div className="rounded-lg border p-4 space-y-3">
              <Label className="text-sm font-medium">Conductor type</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('conductorType', 'individual')}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    conductorType === 'individual'
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-accent'
                  }`}
                >
                  <p className="text-sm font-medium">Individual</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Freelancer or sole trader
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setValue('conductorType', 'company')}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    conductorType === 'company'
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-accent'
                  }`}
                >
                  <p className="text-sm font-medium">Company</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
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
              {conductorType === 'company' && (
                <div className="space-y-1.5">
                  <Label htmlFor="companyName">Company name</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g. Kreativ Studio GmbH"
                    maxLength={200}
                    {...register('companyName')}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
              disabled={isProfilePending}
            >
              Skip
            </Button>
            <Button type="submit" className="flex-1" disabled={isProfilePending}>
              {isProfilePending ? 'Saving...' : 'Next'}
            </Button>
          </div>
        </form>
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

            {becomeHostFetcher.data?.error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {becomeHostFetcher.data.error}
              </div>
            )}

            <becomeHostFetcher.Form method="post" action="/api/become-host">
              <Button
                size="lg"
                className="w-full"
                type="submit"
                disabled={isBecomeHostPending}
              >
                {isBecomeHostPending ? 'Connecting...' : 'Connect with Mollie'}
              </Button>
            </becomeHostFetcher.Form>
          </div>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setStep(0)}
          >
            &larr; Back
          </Button>
        </div>
      )}

    </div>
  );
}
