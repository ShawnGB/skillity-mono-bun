import type { User } from './user';

export interface Workshop {
  id: string;
  title: string;
  description: string;
  maxParticipants: number;
  ticketPrice: number;
  currency: string;
  location: string;
  host: User;
  participants: User[];
}

export interface CreateWorkshopInput {
  title: string;
  description: string;
  maxParticipants: number;
  ticketPrice: number;
  currency: string;
  location: string;
}

export interface UpdateWorkshopInput {
  title?: string;
  description?: string;
  maxParticipants?: number;
  ticketPrice?: number;
  currency?: string;
  location?: string;
}
