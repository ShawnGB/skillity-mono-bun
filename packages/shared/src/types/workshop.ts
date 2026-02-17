import type { User } from './user';

export enum WorkshopStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum WorkshopCategory {
  CRAFTS_AND_MAKING = 'crafts_and_making',
  COOKING_AND_FOOD = 'cooking_and_food',
  MUSIC_AND_SOUND = 'music_and_sound',
  VISUAL_ARTS = 'visual_arts',
  WRITING = 'writing',
  DIGITAL_SKILLS = 'digital_skills',
  MOVEMENT_AND_BODY = 'movement_and_body',
  LANGUAGES = 'languages',
  SCIENCE_AND_NATURE = 'science_and_nature',
  BUSINESS_AND_ENTREPRENEURSHIP = 'business_and_entrepreneurship',
}

export const CATEGORY_LABELS: Record<WorkshopCategory, string> = {
  [WorkshopCategory.CRAFTS_AND_MAKING]: 'Crafts & Making',
  [WorkshopCategory.COOKING_AND_FOOD]: 'Cooking & Food',
  [WorkshopCategory.MUSIC_AND_SOUND]: 'Music & Sound',
  [WorkshopCategory.VISUAL_ARTS]: 'Visual Arts',
  [WorkshopCategory.WRITING]: 'Writing',
  [WorkshopCategory.DIGITAL_SKILLS]: 'Digital Skills',
  [WorkshopCategory.MOVEMENT_AND_BODY]: 'Movement & Body',
  [WorkshopCategory.LANGUAGES]: 'Languages',
  [WorkshopCategory.SCIENCE_AND_NATURE]: 'Science & Nature',
  [WorkshopCategory.BUSINESS_AND_ENTREPRENEURSHIP]: 'Business & Entrepreneurship',
};

export interface Workshop {
  id: string;
  title: string;
  category: WorkshopCategory;
  description: string;
  maxParticipants: number;
  ticketPrice: number;
  currency: string;
  location: string;
  startsAt: string;
  endsAt: string;
  status: WorkshopStatus;
  host: User;
  participantCount: number;
  externalUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkshopInput {
  title: string;
  category: WorkshopCategory;
  description: string;
  maxParticipants: number;
  ticketPrice: number;
  currency: string;
  location: string;
  startsAt: string;
  duration: number;
  externalUrl?: string;
}

export interface UpdateWorkshopInput {
  title?: string;
  category?: WorkshopCategory;
  description?: string;
  maxParticipants?: number;
  ticketPrice?: number;
  currency?: string;
  location?: string;
  startsAt?: string;
  duration?: number;
  status?: WorkshopStatus;
  externalUrl?: string;
}
