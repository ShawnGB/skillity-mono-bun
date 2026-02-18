'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { AuthUser } from '@skillity/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateProfile } from '@/actions/profile';

interface HostProfileSectionProps {
  user: AuthUser;
}

interface FormValues {
  profession: string;
  city: string;
  tagline: string;
  bio: string;
}

export default function HostProfileSection({ user }: HostProfileSectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      profession: user.profession ?? '',
      city: user.city ?? '',
      tagline: user.tagline ?? '',
      bio: user.bio ?? '',
    },
  });

  const onSubmit = (data: FormValues) => {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await updateProfile(data);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md bg-primary/10 p-3 text-sm text-primary">
          Host profile updated successfully.
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

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Host Profile'}
      </Button>
    </form>
  );
}
