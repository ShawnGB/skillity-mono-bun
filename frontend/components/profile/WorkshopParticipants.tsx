'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BookingStatus } from '@skillity/shared';
import type { WorkshopBooking } from '@skillity/shared';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface WorkshopParticipantsProps {
  bookings: WorkshopBooking[];
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const config = {
    [BookingStatus.PENDING]: { label: 'Pending', className: 'bg-yellow-500/10 text-yellow-600' },
    [BookingStatus.CONFIRMED]: { label: 'Confirmed', className: 'bg-green-500/10 text-green-600' },
    [BookingStatus.CANCELLED]: { label: 'Cancelled', className: 'bg-destructive/10 text-destructive' },
    [BookingStatus.REFUNDED]: { label: 'Refunded', className: 'bg-muted text-muted-foreground' },
  };

  const { label, className } = config[status];

  return (
    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', className)}>
      {label}
    </span>
  );
}

export default function WorkshopParticipants({ bookings }: WorkshopParticipantsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (bookings.length === 0) return null;

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        className="gap-1 text-xs text-muted-foreground"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
        {bookings.length} participant{bookings.length !== 1 ? 's' : ''}
      </Button>
      {isExpanded && (
        <div className="mt-2 rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Email</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b last:border-0">
                  <td className="px-3 py-2">
                    {booking.user.firstName} {booking.user.lastName}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {booking.user.email}
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
