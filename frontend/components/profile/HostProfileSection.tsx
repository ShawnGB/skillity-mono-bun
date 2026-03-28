import { useState, useEffect } from 'react';
import { useFetcher, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import type { AuthUser } from '@skillity/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface HostProfileSectionProps {
  user: AuthUser;
}

interface FormValues {
  profession: string;
  city: string;
  tagline: string;
  bio: string;
  conductorType: 'individual' | 'company' | '';
  companyName: string;
  vatNumber: string;
}

function FieldValue({ value }: { value: string | null | undefined }) {
  if (!value || value.trim() === '') {
    return <span className="text-muted-foreground italic">Not set</span>;
  }
  return <>{value}</>;
}

export default function HostProfileSection({ user }: HostProfileSectionProps) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const isPending = fetcher.state !== 'idle';

  const { register, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: {
      profession: user.profession ?? '',
      city: user.city ?? '',
      tagline: user.tagline ?? '',
      bio: user.bio ?? '',
      conductorType: (user.conductorType ?? '') as
        | 'individual'
        | 'company'
        | '',
      companyName: user.companyName ?? '',
      vatNumber: user.vatNumber ?? '',
    },
  });

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.ok) {
      setIsEditing(false);
    }
  }, [fetcher.state, fetcher.data]);

  const conductorType = watch('conductorType');

  const onSubmit = (data: FormValues) => {
    const payload: Record<string, string> = {
      profession: data.profession,
      city: data.city,
      tagline: data.tagline,
      bio: data.bio,
      vatNumber: data.vatNumber,
    };
    if (data.conductorType) payload.conductorType = data.conductorType;
    if (data.conductorType === 'company')
      payload.companyName = data.companyName;
    fetcher.submit(payload, { method: 'post', action: '/api/profile' });
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        {fetcher.data?.ok && (
          <div className="rounded-md bg-primary/10 p-3 text-sm text-primary">
            Host profile updated successfully.
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Profession
            </p>
            <p>
              <FieldValue value={user.profession} />
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">City</p>
            <p>
              <FieldValue value={user.city} />
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Tagline</p>
          <p>
            <FieldValue value={user.tagline} />
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Bio</p>
          <p className="whitespace-pre-wrap">
            <FieldValue value={user.bio} />
          </p>
        </div>
        {user.conductorType && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Conductor Type
              </p>
              <p className="capitalize">{user.conductorType}</p>
            </div>
            {user.conductorType === 'company' && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Company Name
                </p>
                <p>
                  <FieldValue value={user.companyName} />
                </p>
              </div>
            )}
          </div>
        )}
        {user.vatNumber && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              VAT / Kleingewerbe Number
            </p>
            <p>{user.vatNumber}</p>
          </div>
        )}
        <Button variant="outline" onClick={() => setIsEditing(true)}>
          Edit
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fetcher.data?.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {fetcher.data.error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="profession">Profession</Label>
          <Input
            id="profession"
            placeholder="e.g. Ceramic Artist"
            maxLength={120}
            {...register('profession')}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="e.g. Berlin"
            maxLength={100}
            {...register('city')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Input
          id="tagline"
          placeholder="e.g. Passionate pottery instructor"
          maxLength={120}
          {...register('tagline')}
        />
        <p className="text-xs text-muted-foreground">
          A short description that appears below your name (max 120 characters).
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell people about yourself and your experience..."
          maxLength={1000}
          rows={5}
          {...register('bio')}
        />
      </div>

      <div className="space-y-3 rounded-lg border p-4">
        <Label className="text-sm font-medium">Conductor Type</Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="radio"
              value="individual"
              {...register('conductorType')}
            />
            Individual
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="radio"
              value="company"
              {...register('conductorType')}
            />
            Company
          </label>
        </div>
        {conductorType === 'individual' && (
          <p className="text-xs text-muted-foreground">
            In Germany, workshop conductors typically register a Kleingewerbe
            (free, ~15 min at your Finanzamt).{' '}
            <Link
              to="/guides/kleingewerbe"
              className="underline hover:text-foreground"
            >
              Learn more
            </Link>
          </p>
        )}
        {conductorType === 'company' && (
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              placeholder="e.g. Kreativ Studio GmbH"
              maxLength={200}
              {...register('companyName')}
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="vatNumber">VAT / Kleingewerbe Number</Label>
          <Input
            id="vatNumber"
            placeholder="e.g. DE123456789 or Steuernummer"
            maxLength={50}
            {...register('vatNumber')}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Host Profile'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
