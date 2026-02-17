export enum UserRole {
  ADMIN = 'admin',
  HOST = 'host',
  GUEST = 'guest',
}

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

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}
