'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface FormModalProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children: (props: { onSuccess: () => void }) => React.ReactNode;
  onSuccess?: () => void;
}

export default function FormModal({
  trigger,
  title,
  description,
  children,
  onSuccess,
}: FormModalProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  if (!mounted) {
    return trigger;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children({ onSuccess: handleSuccess })}
      </DialogContent>
    </Dialog>
  );
}
