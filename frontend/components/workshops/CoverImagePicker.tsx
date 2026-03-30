import { useState, useRef, useEffect } from 'react';
import { useFetcher } from 'react-router';
import { Upload, X, Images } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkshopCoverImage } from '@/components/workshops/WorkshopCoverImage';
import type { PexelsPhoto, WorkshopCategory } from '@skillity/shared';

export interface CoverImageValue {
  url: string | null;
  key: string | null;
  attribution: string | null;
}

interface CoverImagePickerProps {
  value: CoverImageValue;
  onChange: (v: CoverImageValue) => void;
  category?: WorkshopCategory;
}

export function CoverImagePicker({ value, onChange, category }: CoverImagePickerProps) {
  const uploadFetcher = useFetcher<{ url?: string; key?: string; error?: string }>();
  const pexelsFetcher = useFetcher<PexelsPhoto[]>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pexelsFetchedCategoryRef = useRef<string | null>(null);
  const [tab, setTab] = useState<'upload' | 'pexels'>('upload');

  useEffect(() => {
    if (uploadFetcher.state === 'idle' && uploadFetcher.data?.url) {
      onChange({ url: uploadFetcher.data.url, key: uploadFetcher.data.key ?? null, attribution: null });
    }
  }, [uploadFetcher.state, uploadFetcher.data]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    uploadFetcher.submit(fd, { method: 'post', action: '/api/uploads', encType: 'multipart/form-data' });
  };

  const handlePexelsTabClick = () => {
    setTab('pexels');
    if (category && pexelsFetcher.state === 'idle' && pexelsFetchedCategoryRef.current !== category) {
      pexelsFetcher.load(`/api/pexels-suggestions?category=${category}`);
      pexelsFetchedCategoryRef.current = category;
    }
  };

  const selectPexelsPhoto = (photo: PexelsPhoto) => {
    onChange({ url: photo.url, key: null, attribution: `Photo by ${photo.photographer} on Pexels` });
  };

  const clear = () => {
    onChange({ url: null, key: null, attribution: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (value.url) {
    return (
      <div className="relative aspect-[3/1] rounded-xl overflow-hidden">
        <WorkshopCoverImage
          coverImageUrl={value.url}
          coverImageAttribution={value.attribution}
          category={category}
          className="absolute inset-0"
        />
        <button
          type="button"
          onClick={clear}
          className="absolute top-2 right-2 z-10 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
        >
          <X className="size-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <div className="flex border-b text-sm">
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={cn(
            'flex-1 px-4 py-2 flex items-center justify-center gap-2 transition-colors',
            tab === 'upload' ? 'bg-muted font-medium' : 'hover:bg-muted/50',
          )}
        >
          <Upload className="size-3.5" /> Upload your own
        </button>
        <button
          type="button"
          onClick={handlePexelsTabClick}
          className={cn(
            'flex-1 px-4 py-2 flex items-center justify-center gap-2 transition-colors',
            tab === 'pexels' ? 'bg-muted font-medium' : 'hover:bg-muted/50',
          )}
        >
          <Images className="size-3.5" /> Choose a photo
        </button>
      </div>

      {tab === 'upload' && (
        <div className="p-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileSelect}
          />
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

      {tab === 'pexels' && (
        <div className="p-4">
          {!category ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Select a category first to see suggestions.
            </p>
          ) : pexelsFetcher.state !== 'idle' ? (
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
                  <img
                    src={photo.url}
                    alt={`Photo by ${photo.photographer}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No suggestions available.</p>
          )}
          {pexelsFetcher.data && (
            <p className="text-[10px] text-muted-foreground mt-2">Photos provided by Pexels</p>
          )}
        </div>
      )}
    </div>
  );
}
