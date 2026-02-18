'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, CreditCard, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { becomeHost } from '@/actions/auth';

const steps = [
  { label: 'About You', icon: User },
  { label: 'Payment', icon: CreditCard },
  { label: 'Done', icon: CheckCircle },
];

export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleConnectMollie = () => {
    setError(null);
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const result = await becomeHost();
      if (result.error) {
        setError(result.error);
      } else {
        setStep(2);
      }
    });
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
                className={`h-px w-12 transition-colors ${
                  i < step ? 'bg-primary' : 'bg-muted'
                }`}
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
              This is optional. You can always fill it in later.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">A bit about you</Label>
              <Input
                id="bio"
                placeholder="Tell people what you're into and why you want to share it."
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
            >
              Skip
            </Button>
            <Button className="flex-1" onClick={() => setStep(1)}>
              Next
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
              Secure payment processing. We keep just 5%. The rest goes
              directly to you.
            </p>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={handleConnectMollie}
              disabled={isPending}
            >
              {isPending ? 'Connecting...' : 'Connect with Mollie'}
            </Button>
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
          <Button
            size="lg"
            className="w-full"
            onClick={() => router.push('/workshops')}
          >
            Create Your First Workshop
          </Button>
        </div>
      )}
    </div>
  );
}
