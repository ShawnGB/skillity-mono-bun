import { useState } from 'react';
import { useFetcher } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  WorkshopCategory,
  WorkshopLevel,
  WorkshopSource,
  CATEGORY_LABELS,
  LEVEL_LABELS,
} from '@skillity/shared';
import { cn } from '@/lib/utils';
import { DURATION_OPTIONS } from '@/lib/constants';

interface FormValues {
  title: string;
  category: WorkshopCategory;
  level?: WorkshopLevel;
  description: string;
  maxParticipants: number;
  ticketPrice: number;
  location: string;
  date: Date;
  startTime: string;
  duration: number;
  externalUrl?: string;
}

interface CreateWorkshopFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<
    Pick<
      FormValues,
      | 'title'
      | 'category'
      | 'description'
      | 'maxParticipants'
      | 'ticketPrice'
      | 'location'
    >
  > & { seriesId?: string };
}

const STEPS = ['The Workshop', 'Schedule', 'Pricing'];

const STEP_FIELDS: (keyof FormValues)[][] = [
  ['title', 'category', 'description'],
  ['date', 'startTime', 'duration', 'location'],
  ['maxParticipants', 'ticketPrice'],
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 transition-colors',
                i < currentStep
                  ? 'bg-primary/15 text-primary'
                  : i === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
              )}
            >
              {i < currentStep ? <Check className="size-3.5" /> : i + 1}
            </div>
            <span
              className={cn(
                'text-sm font-medium hidden sm:block transition-colors',
                i === currentStep
                  ? 'text-foreground'
                  : i < currentStep
                    ? 'text-primary'
                    : 'text-muted-foreground',
              )}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                'h-px flex-1 mx-3 transition-colors',
                i < currentStep ? 'bg-primary' : 'bg-muted',
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function CreateWorkshopForm({
  onSuccess,
  defaultValues,
}: CreateWorkshopFormProps) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const [step, setStep] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const [externalTickets, setExternalTickets] = useState(false);
  const isPending = fetcher.state !== 'idle';

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues });

  const ticketPrice = watch('ticketPrice') ?? 0;
  const maxParticipants = watch('maxParticipants') ?? 0;
  const maxRevenue = Number(ticketPrice) * Number(maxParticipants);

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[step] as (keyof FormValues)[]);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = (data: FormValues) => {
    setLocalError(null);

    const [hours, minutes] = data.startTime.split(':').map(Number);
    const startsAt = new Date(data.date);
    startsAt.setHours(hours, minutes, 0, 0);

    if (startsAt <= new Date()) {
      setLocalError('Workshop must be scheduled in the future');
      return;
    }

    fetcher.submit(
      {
        title: data.title,
        category: data.category,
        description: data.description,
        maxParticipants: String(data.maxParticipants),
        ticketPrice: String(data.ticketPrice),
        currency: 'EUR',
        location: data.location,
        startsAt: startsAt.toISOString(),
        duration: String(data.duration),
        ...(data.level && { level: data.level }),
        ...(defaultValues?.seriesId && { seriesId: defaultValues.seriesId }),
        ...(externalTickets && data.externalUrl
          ? { externalUrl: data.externalUrl, source: WorkshopSource.EXTERNAL }
          : {}),
      },
      { method: 'post', action: '/api/workshops' },
    );
  };

  const error = localError ?? fetcher.data?.error;

  return (
    <div>
      <StepIndicator currentStep={step} />

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 0 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g. Intro to Wheel Throwing"
                {...register('title', {
                  required: 'Title is required',
                  maxLength: {
                    value: 50,
                    message: 'Title must be at most 50 characters',
                  },
                })}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
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
                  <p className="text-sm text-destructive">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Level</Label>
                <Controller
                  name="level"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ''}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Optional" />
                      </SelectTrigger>
                      <SelectContent className="z-[52]">
                        {Object.values(WorkshopLevel).map((lvl) => (
                          <SelectItem key={lvl} value={lvl}>
                            {LEVEL_LABELS[lvl]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell people what they'll learn, create, or experience..."
                rows={5}
                {...register('description', {
                  required: 'Description is required',
                })}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
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
                        {field.value
                          ? format(field.value, 'PPP')
                          : 'Pick a date'}
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
                <p className="text-sm text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  {...register('startTime', {
                    required: 'Start time is required',
                  })}
                />
                {errors.startTime && (
                  <p className="text-sm text-destructive">
                    {errors.startTime.message}
                  </p>
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
                        <SelectValue placeholder="Select" />
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
                  <p className="text-sm text-destructive">
                    {errors.duration.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. Studio Mitte, Berlin"
                {...register('location', { required: 'Required' })}
              />
              {errors.location && (
                <p className="text-sm text-destructive">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  placeholder="10"
                  {...register('maxParticipants', {
                    required: 'Required',
                    min: { value: 1, message: 'Must be at least 1' },
                  })}
                />
                {errors.maxParticipants && (
                  <p className="text-sm text-destructive">
                    {errors.maxParticipants.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticketPrice">Ticket Price (EUR)</Label>
                <Input
                  id="ticketPrice"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  {...register('ticketPrice', {
                    required: 'Required',
                    min: { value: 0, message: 'Cannot be negative' },
                  })}
                />
                {errors.ticketPrice && (
                  <p className="text-sm text-destructive">
                    {errors.ticketPrice.message}
                  </p>
                )}
              </div>
            </div>

            {maxRevenue > 0 && (
              <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                Full house:{' '}
                <span className="font-medium text-foreground">
                  {maxParticipants} × €{Number(ticketPrice).toFixed(2)} ={' '}
                  €{maxRevenue.toFixed(2)}
                </span>{' '}
                gross &mdash; you keep{' '}
                <span className="font-medium text-foreground">
                  €{(maxRevenue * 0.95).toFixed(2)}
                </span>{' '}
                after the 5% platform fee.
              </div>
            )}

            <div className="rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
              Running this workshop with someone? You can add a co-conductor and
              set the payout split after creating — look for the{' '}
              <span className="font-medium text-foreground">Co-conductors</span>{' '}
              section on the next page.
            </div>

            <div className="rounded-lg border p-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={externalTickets}
                  onChange={(e) => setExternalTickets(e.target.checked)}
                  className="size-4 rounded"
                />
                <span className="text-sm font-medium">
                  I sell tickets elsewhere
                </span>
              </label>
              {externalTickets && (
                <div className="space-y-2">
                  <Input
                    {...register('externalUrl', {
                      required: externalTickets
                        ? 'Ticket URL is required'
                        : false,
                    })}
                    placeholder="https://your-ticket-shop.com/workshop"
                  />
                  {errors.externalUrl && (
                    <p className="text-sm text-destructive">
                      {errors.externalUrl.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Sell on Skillity to get reviews, saved audiences, and zero
                    manual ticketing.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              disabled={isPending}
            >
              Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button type="button" className="flex-1" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Workshop'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
