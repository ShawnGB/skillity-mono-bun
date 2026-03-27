import { useState, useEffect } from 'react';
import { useFetcher } from 'react-router';
import { useForm } from 'react-hook-form';
import type { AuthUser } from '@skillity/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileFormProps {
  user: AuthUser;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const isPending = fetcher.state !== 'idle';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.ok) {
      setIsEditing(false);
    }
  }, [fetcher.state, fetcher.data]);

  const onSubmit = (data: FormValues) => {
    fetcher.submit(data, { method: 'post', action: '/api/profile' });
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
            Profile updated successfully.
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              First Name
            </p>
            <p>
              {user.firstName || (
                <span className="text-muted-foreground italic">Not set</span>
              )}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Last Name
            </p>
            <p>
              {user.lastName || (
                <span className="text-muted-foreground italic">Not set</span>
              )}
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <p>{user.email}</p>
        </div>
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
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            {...register('firstName', { required: 'First name is required' })}
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            {...register('lastName', { required: 'Last name is required' })}
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email address',
            },
          })}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
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
