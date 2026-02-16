import type { User } from './user';

export enum WorkshopStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  maxParticipants: number;
  ticketPrice: number;
  currency: string;
  location: string;
  startsAt: string;
  endsAt: string;
  status: WorkshopStatus;
  host: User;
  participants: User[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkshopInput {
  title: string;
  description: string;
  maxParticipants: number;
  ticketPrice: number;
  currency: string;
  location: string;
  startsAt: string;
  duration: number;
}

export interface UpdateWorkshopInput {
  title?: string;
  description?: string;
  maxParticipants?: number;
  ticketPrice?: number;
  currency?: string;
  location?: string;
  startsAt?: string;
  duration?: number;
  status?: WorkshopStatus;
}
