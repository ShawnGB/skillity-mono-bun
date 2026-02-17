'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createWorkshop } from '@/actions/workshops';
import { WorkshopCategory, CATEGORY_LABELS } from '@skillity/shared';
import { cn } from '@/lib/utils';

interface FormValues {
  title: string;
  category: WorkshopCategory;
  description: string;
  maxParticipants: number;
  ticketPrice: number;
  location: string;
  date: Date;
  startTime: string;
  duration: number;
}

interface CreateWorkshopFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<Pick<FormValues, 'title' | 'category' | 'description' | 'maxParticipants' | 'ticketPrice' | 'location'>> & { seriesId?: string };
}

const DURATION_OPTIONS = [
  { value: '30', label: '30 min' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' },
  { value: '150', label: '2.5 hours' },
  { value: '180', label: '3 hours' },
  { value: '240', label: '4 hours' },
];

export default function CreateWorkshopForm({
  onSuccess,
  defaultValues,
}: CreateWorkshopFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues });

  const onSubmit = (data: FormValues) => {
    setError(null);

    const [hours, minutes] = data.startTime.split(':').map(Number);
    const startsAt = new Date(data.date);
    startsAt.setHours(hours, minutes, 0, 0);

    if (startsAt <= new Date()) {
      setError('Workshop must be scheduled in the future');
      return;
    }

    startTransition(async () => {
      const result = await createWorkshop({
        title: data.title,
        category: data.category,
        description: data.description,
        maxParticipants: Number(data.maxParticipants),
        ticketPrice: Number(data.ticketPrice),
        currency: 'EUR',
        location: data.location,
        startsAt: startsAt.toISOString(),
        duration: Number(data.duration),
        ...(defaultValues?.seriesId && { seriesId: defaultValues.seriesId }),
      });
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
        onSuccess?.();
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
        <Label>Category</Label>
        <Controller
          name="category"
          control={control}
          rules={{ required: 'Category is required' }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="z-[52]">
                {Object.values(WorkshopCategory).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && (
          <p className="text-sm text-destructive">{errors.category.message}</p>
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

      <div className="space-y-2">
        <Label>Date</Label>
        <Controller
          name="date"
          control={control}
          rules={{ required: 'Date is required' }}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !field.value && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="z-[52] w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.date && (
          <p className="text-sm text-destructive">{errors.date.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            {...register('startTime', { required: 'Start time is required' })}
          />
          {errors.startTime && (
            <p className="text-sm text-destructive">{errors.startTime.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Duration</Label>
          <Controller
            name="duration"
            control={control}
            rules={{ required: 'Duration is required' }}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value?.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="z-[52]">
                  {DURATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.duration && (
            <p className="text-sm text-destructive">{errors.duration.message}</p>
          )}
        </div>
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
            <p className="text-sm text-destructive">
              {errors.maxParticipants.message}
            </p>
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
            <p className="text-sm text-destructive">
              {errors.ticketPrice.message}
            </p>
          )}
        </div>
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

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Workshop'}
      </Button>
    </form>
  );
}
