import { useState, useEffect, useRef } from 'react';
import { useFetcher } from 'react-router';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { format, differenceInMinutes } from 'date-fns';
import { CalendarIcon, Trash2, Search, Upload, X, Images } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  WorkshopStatus,
  WorkshopCategory,
  CATEGORY_LABELS,
} from '@skillity/shared';
import type { Workshop, ConductorProfile, PexelsPhoto } from '@skillity/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LocationAutocomplete from '@/components/ui/location-autocomplete';
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
import { cn } from '@/lib/utils';
import { DURATION_OPTIONS } from '@/lib/constants';

interface EditWorkshopFormProps {
  workshop: Workshop;
  onSuccess?: () => void;
}

interface FormValues {
  title: string;
  category: WorkshopCategory;
  description: string;
  maxParticipants: number;
  ticketPrice: number;
  location: string;
  locationLat?: number;
  locationLng?: number;
  date: Date;
  startTime: string;
  duration: number;
}

function deriveDuration(startsAt: string, endsAt: string): number {
  const minutes = differenceInMinutes(new Date(endsAt), new Date(startsAt));
  return DURATION_OPTIONS.map((o) => Number(o.value)).reduce((prev, curr) =>
    Math.abs(curr - minutes) < Math.abs(prev - minutes) ? curr : prev,
  );
}

export default function EditWorkshopForm({
  workshop,
  onSuccess,
}: EditWorkshopFormProps) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const uploadFetcher = useFetcher<{ url?: string; key?: string; error?: string }>();
  const pexelsFetcher = useFetcher<PexelsPhoto[]>();
  const [localError, setLocalError] = useState<string | null>(null);
  const [coverImageTab, setCoverImageTab] = useState<'upload' | 'pexels'>('upload');
  const [coverImageUrl, setCoverImageUrl] = useState<string>(workshop.coverImageUrl ?? '');
  const [coverImageKey, setCoverImageKey] = useState<string>(workshop.coverImageKey ?? '');
  const [coverImageAttribution, setCoverImageAttribution] = useState<string>(workshop.coverImageAttribution ?? '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pexelsFetchedCategoryRef = useRef<string | null>(null);
  const isPending = fetcher.state !== 'idle';
  const isPublished = workshop.status === WorkshopStatus.PUBLISHED;
  const startsAtDate = new Date(workshop.startsAt);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: workshop.title,
      category: workshop.category,
      description: workshop.description,
      maxParticipants: workshop.maxParticipants,
      ticketPrice: workshop.ticketPrice,
      location: workshop.location,
      date: startsAtDate,
      startTime: format(startsAtDate, 'HH:mm'),
      duration: deriveDuration(workshop.startsAt, workshop.endsAt),
    },
  });

  const watchedCategory = useWatch({ control, name: 'category' });

  const savedOk = fetcher.state === 'idle' && fetcher.data?.ok === true;

  useEffect(() => {
    if (savedOk) onSuccess?.();
  }, [savedOk, onSuccess]);

  useEffect(() => {
    if (uploadFetcher.state === 'idle' && uploadFetcher.data?.url) {
      setCoverImageUrl(uploadFetcher.data.url);
      setCoverImageKey(uploadFetcher.data.key ?? '');
      setCoverImageAttribution('');
    }
  }, [uploadFetcher.state, uploadFetcher.data]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    uploadFetcher.submit(fd, { method: 'post', action: '/api/uploads', encType: 'multipart/form-data' });
  };

  const clearCoverImage = () => {
    setCoverImageUrl('');
    setCoverImageKey('');
    setCoverImageAttribution('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const selectPexelsPhoto = (photo: PexelsPhoto) => {
    setCoverImageUrl(photo.url);
    setCoverImageKey('');
    setCoverImageAttribution(`Photo by ${photo.photographer} on Pexels`);
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
        ...(!isPublished && { ticketPrice: String(data.ticketPrice) }),
        location: data.location,
        ...(data.locationLat !== undefined && { locationLat: String(data.locationLat) }),
        ...(data.locationLng !== undefined && { locationLng: String(data.locationLng) }),
        startsAt: startsAt.toISOString(),
        duration: String(data.duration),
        coverImageUrl: coverImageUrl || '',
        coverImageKey: coverImageKey || '',
        coverImageAttribution: coverImageAttribution || '',
      },
      { method: 'post', action: `/api/workshops/${workshop.id}` },
    );
  };

  const error = localError ?? fetcher.data?.error;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {savedOk && !onSuccess && (
        <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
          Changes saved.
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register('title', {
            required: 'Title is required',
            maxLength: {
              value: 50,
              message: 'Title must be at most 50 characters',
            },
          })}
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
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Cover Photo */}
      <div className="space-y-2">
        <Label>Cover Photo</Label>
        {coverImageUrl ? (
          <div className="relative rounded-xl overflow-hidden aspect-[3/1]">
            <img src={coverImageUrl} alt="Cover preview" className="w-full h-full object-cover" />
            {coverImageAttribution && (
              <span className="absolute bottom-2 right-2 text-[10px] text-white/70 bg-black/40 px-1.5 py-0.5 rounded">
                {coverImageAttribution}
              </span>
            )}
            <button
              type="button"
              onClick={clearCoverImage}
              className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <div className="rounded-xl border overflow-hidden">
            <div className="flex border-b text-sm">
              <button
                type="button"
                onClick={() => setCoverImageTab('upload')}
                className={`flex-1 px-4 py-2 flex items-center justify-center gap-2 transition-colors ${coverImageTab === 'upload' ? 'bg-muted font-medium' : 'hover:bg-muted/50'}`}
              >
                <Upload className="size-3.5" /> Upload your own
              </button>
              <button
                type="button"
                onClick={() => {
                  setCoverImageTab('pexels');
                  if (watchedCategory && pexelsFetcher.state === 'idle' && pexelsFetchedCategoryRef.current !== watchedCategory) {
                    pexelsFetcher.load(`/api/pexels-suggestions?category=${watchedCategory}`);
                    pexelsFetchedCategoryRef.current = watchedCategory;
                  }
                }}
                className={`flex-1 px-4 py-2 flex items-center justify-center gap-2 transition-colors ${coverImageTab === 'pexels' ? 'bg-muted font-medium' : 'hover:bg-muted/50'}`}
              >
                <Images className="size-3.5" /> Choose a photo
              </button>
            </div>

            {coverImageTab === 'upload' && (
              <div className="p-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadFetcher.state !== 'idle'}
                  className="w-full rounded-lg border-2 border-dashed border-muted-foreground/30 py-6 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors disabled:opacity-50"
                >
                  {uploadFetcher.state !== 'idle' ? 'Uploading...' : 'Click to upload (JPEG, PNG, WebP · max 5MB)'}
                </button>
                {uploadFetcher.data?.error && (
                  <p className="text-xs text-destructive mt-2">{uploadFetcher.data.error}</p>
                )}
              </div>
            )}

            {coverImageTab === 'pexels' && (
              <div className="p-4">
                {pexelsFetcher.state !== 'idle' ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Loading suggestions...</p>
                ) : pexelsFetcher.data && pexelsFetcher.data.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {pexelsFetcher.data.map((photo) => (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() => selectPexelsPhoto(photo)}
                        className="relative aspect-[3/2] rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                      >
                        <img src={photo.url} alt={`Photo by ${photo.photographer}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {watchedCategory ? 'No suggestions available.' : 'Save the category first to see suggestions.'}
                  </p>
                )}
                {pexelsFetcher.data && <p className="text-[10px] text-muted-foreground mt-2">Photos provided by Pexels</p>}
              </div>
            )}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileSelect}
        />
        {!coverImageUrl && (
          <p className="text-xs text-muted-foreground">
            No image? A category-based gradient will be shown instead.
          </p>
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
            <p className="text-sm text-destructive">
              {errors.duration.message}
            </p>
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
            disabled={isPublished}
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

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Controller
          name="location"
          control={control}
          rules={{ required: 'Required' }}
          render={({ field }) => (
            <LocationAutocomplete
              id="location"
              placeholder="Berlin, Germany"
              value={field.value ?? ''}
              onChange={field.onChange}
              onCoordinatesChange={(lat, lng) => {
                setValue('locationLat', lat);
                setValue('locationLng', lng);
              }}
            />
          )}
        />
        {errors.location && (
          <p className="text-sm text-destructive">{errors.location.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}

interface ConductorsSectionProps {
  workshopId: string;
  conductors: ConductorProfile[];
  ticketPrice: number;
  maxParticipants: number;
}

type LookupResult = {
  user: { id: string; firstName: string | null; lastName: string | null } | null;
};

function conductorLabel(c: { firstName: string; lastName: string }) {
  return `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim() || 'Unknown';
}

export function ConductorsSection({
  workshopId,
  conductors,
  ticketPrice,
  maxParticipants,
}: ConductorsSectionProps) {
  const splitFetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const removeFetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const lookupFetcher = useFetcher<LookupResult>();

  const primary = conductors.find((c) => c.isPrimary);
  const coConductor = conductors.find((c) => !c.isPrimary);
  const maxRevenue = Number(ticketPrice) * Number(maxParticipants);

  const [splitValue, setSplitValue] = useState(
    primary ? Math.round(primary.payoutShare * 100) : 100,
  );
  const [emailInput, setEmailInput] = useState('');

  const isPending =
    splitFetcher.state !== 'idle' || removeFetcher.state !== 'idle';
  const isLooking = lookupFetcher.state !== 'idle';
  const lookedUpUser = lookupFetcher.data?.user ?? null;

  const handleSaveSplit = (overrideCoId?: string) => {
    const coId = overrideCoId ?? coConductor?.userId;
    if (!primary || !coId) return;

    const splits = [
      { userId: primary.userId, payoutShare: splitValue / 100 },
      { userId: coId, payoutShare: (100 - splitValue) / 100 },
    ];

    splitFetcher.submit(
      { intent: 'split', splits: JSON.stringify(splits) },
      { method: 'post', action: `/api/workshops/${workshopId}/conductors` },
    );
    setEmailInput('');
  };

  const handleLookup = () => {
    if (!emailInput.trim()) return;
    lookupFetcher.load(
      `/api/users/lookup?email=${encodeURIComponent(emailInput.trim())}`,
    );
  };

  const handleRemove = (userId: string) => {
    removeFetcher.submit(
      { intent: 'remove', userId },
      { method: 'post', action: `/api/workshops/${workshopId}/conductors` },
    );
  };

  const primaryShare = splitValue;
  const coShare = 100 - splitValue;
  const primaryEarnings = maxRevenue * (primaryShare / 100);
  const coEarnings = maxRevenue * (coShare / 100);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-medium mb-0.5">Co-conductors</h3>
        <p className="text-sm text-muted-foreground">
          Split revenue with a co-conductor. Shares must sum to 100%.
        </p>
      </div>

      {(splitFetcher.data?.error || removeFetcher.data?.error) && (
        <p className="text-sm text-destructive">
          {splitFetcher.data?.error ?? removeFetcher.data?.error}
        </p>
      )}
      {splitFetcher.state === 'idle' && splitFetcher.data?.ok && (
        <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
          Split saved.
        </div>
      )}

      {coConductor && primary ? (
        <div className="space-y-4">
          {maxRevenue > 0 && (
            <p className="text-xs text-muted-foreground">
              Full house:{' '}
              <span className="font-medium text-foreground">
                {maxParticipants} × €{Number(ticketPrice).toFixed(2)} = €
                {maxRevenue.toFixed(2)}
              </span>{' '}
              gross
            </p>
          )}

          <div className="rounded-xl border bg-muted/30 p-5 space-y-4">
            <div className="flex items-end justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{conductorLabel(primary)}</p>
                <p className="text-2xl font-serif font-bold tabular-nums">
                  {primaryShare}%
                </p>
                {maxRevenue > 0 && (
                  <p className="text-xs text-muted-foreground">
                    ≈ €{primaryEarnings.toFixed(2)} at full house
                  </p>
                )}
              </div>
              <div className="text-right space-y-0.5">
                <p className="text-sm font-medium">
                  {conductorLabel(coConductor)}
                </p>
                <p className="text-2xl font-serif font-bold tabular-nums">
                  {coShare}%
                </p>
                {maxRevenue > 0 && (
                  <p className="text-xs text-muted-foreground">
                    ≈ €{coEarnings.toFixed(2)} at full house
                  </p>
                )}
              </div>
            </div>

            <Slider
              value={[splitValue]}
              onValueChange={([val]) => setSplitValue(val)}
              min={5}
              max={95}
              step={5}
            />

            <p className="text-xs text-muted-foreground text-center">
              Drag to adjust. Percentages are of gross ticket revenue before
              the 5% platform fee.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleRemove(coConductor.userId)}
              disabled={isPending}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="size-3" />
              Remove {conductorLabel(coConductor)}
            </button>
            <Button
              size="sm"
              onClick={() => handleSaveSplit()}
              disabled={isPending}
            >
              {isPending ? 'Saving...' : 'Save split'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border px-4 py-3 flex items-center justify-between text-sm">
            <span className="font-medium">
              {primary ? conductorLabel(primary) : 'You'}
            </span>
            <span className="text-muted-foreground">100% — primary</span>
          </div>

          <div className="space-y-3">
            <Label className="text-sm">Add a co-conductor by email</Label>
            <div className="flex gap-2">
              <Input
                placeholder="colleague@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                className="flex-1 text-sm"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleLookup}
                disabled={isLooking || !emailInput.trim()}
              >
                <Search className="size-3.5" />
              </Button>
            </div>

            {lookupFetcher.state === 'idle' &&
              lookupFetcher.data !== undefined && (
                <div>
                  {lookedUpUser ? (
                    <div className="space-y-4 rounded-xl border bg-muted/30 p-5">
                      <p className="text-sm">
                        Found:{' '}
                        <span className="font-medium">
                          {conductorLabel({
                            firstName: lookedUpUser.firstName ?? '',
                            lastName: lookedUpUser.lastName ?? '',
                          })}
                        </span>
                      </p>

                      {maxRevenue > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Full house:{' '}
                          <span className="font-medium text-foreground">
                            {maxParticipants} × €
                            {Number(ticketPrice).toFixed(2)} = €
                            {maxRevenue.toFixed(2)}
                          </span>{' '}
                          gross
                        </p>
                      )}

                      <div className="flex items-end justify-between">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">
                            {primary ? conductorLabel(primary) : 'You'}
                          </p>
                          <p className="text-2xl font-serif font-bold tabular-nums">
                            {splitValue}%
                          </p>
                          {maxRevenue > 0 && (
                            <p className="text-xs text-muted-foreground">
                              ≈ €{(maxRevenue * (splitValue / 100)).toFixed(2)}{' '}
                              at full house
                            </p>
                          )}
                        </div>
                        <div className="text-right space-y-0.5">
                          <p className="text-sm font-medium">
                            {conductorLabel({
                              firstName: lookedUpUser.firstName ?? '',
                              lastName: lookedUpUser.lastName ?? '',
                            })}
                          </p>
                          <p className="text-2xl font-serif font-bold tabular-nums">
                            {100 - splitValue}%
                          </p>
                          {maxRevenue > 0 && (
                            <p className="text-xs text-muted-foreground">
                              ≈ €
                              {(
                                maxRevenue *
                                ((100 - splitValue) / 100)
                              ).toFixed(2)}{' '}
                              at full house
                            </p>
                          )}
                        </div>
                      </div>

                      <Slider
                        value={[splitValue]}
                        onValueChange={([val]) => setSplitValue(val)}
                        min={5}
                        max={95}
                        step={5}
                      />

                      <p className="text-xs text-muted-foreground text-center">
                        Drag to adjust. Percentages are of gross ticket revenue
                        before the 5% platform fee.
                      </p>

                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => handleSaveSplit(lookedUpUser.id)}
                        disabled={isPending}
                      >
                        {isPending ? 'Adding...' : 'Add co-conductor'}
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No account found for that email.
                    </p>
                  )}
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
