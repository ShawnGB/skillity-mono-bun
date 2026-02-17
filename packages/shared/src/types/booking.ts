import type { Workshop } from './workshop';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface Booking {
  id: string;
  status: BookingStatus;
  userId: string;
  workshopId: string;
  workshop: Workshop;
  paymentId: string | null;
  amount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingInput {
  workshopId: string;
}
