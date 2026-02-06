'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createWorkshop } from '@/api/workshops.api';

interface CreateWorkshopFormData {
  title: string;
  description: string;
  maxParticipants: number;
  ticketPrice: number;
  currency: string;
  location: string;
}

interface CreateWorkshopFormProps {
  onSuccess?: () => void;
}

export default function CreateWorkshopForm({ onSuccess }: CreateWorkshopFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateWorkshopFormData>();

  const onSubmit = async (data: CreateWorkshopFormData) => {
    try {
      await createWorkshop({
        ...data,
        maxParticipants: Number(data.maxParticipants),
        ticketPrice: Number(data.ticketPrice),
      });
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create workshop:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register('title', {
            required: 'Title is required',
            maxLength: { value: 50, message: 'Title must be at most 50 characters' },
          })}
          placeholder="Workshop title"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          {...register('description', { required: 'Description is required' })}
          placeholder="Workshop description"
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maxParticipants">Max Participants</Label>
          <Input
            id="maxParticipants"
            type="number"
            {...register('maxParticipants', {
              required: 'Required',
              min: { value: 1, message: 'Must be at least 1' },
            })}
            placeholder="10"
          />
          {errors.maxParticipants && (
            <p className="text-sm text-destructive">{errors.maxParticipants.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ticketPrice">Ticket Price</Label>
          <Input
            id="ticketPrice"
            type="number"
            step="0.01"
            {...register('ticketPrice', {
              required: 'Required',
              min: { value: 0, message: 'Cannot be negative' },
            })}
            placeholder="0"
          />
          {errors.ticketPrice && (
            <p className="text-sm text-destructive">{errors.ticketPrice.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            {...register('currency', {
              required: 'Required',
              maxLength: { value: 3, message: 'Max 3 characters' },
            })}
            placeholder="EUR"
            maxLength={3}
          />
          {errors.currency && (
            <p className="text-sm text-destructive">{errors.currency.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...register('location', { required: 'Required' })}
            placeholder="Berlin, Germany"
          />
          {errors.location && (
            <p className="text-sm text-destructive">{errors.location.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Workshop'}
      </Button>
    </form>
  );
}
