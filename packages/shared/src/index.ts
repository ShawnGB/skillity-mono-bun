export type {
  UserRole,
  AuthUser,
  LoginInput,
  RegisterInput,
  AuthResponse,
} from './types/auth';

export type { User, CreateUserInput, UpdateProfileInput, HostProfile } from './types/user';

export type { Review, CreateReviewInput } from './types/review';

export { WorkshopStatus, WorkshopCategory, WorkshopLevel, CATEGORY_LABELS, LEVEL_LABELS } from './types/workshop';
export type {
  Workshop,
  CreateWorkshopInput,
  UpdateWorkshopInput,
} from './types/workshop';

export { BookingStatus } from './types/booking';
export type {
  Booking,
  CreateBookingInput,
  WorkshopBooking,
  WorkshopBookingParticipant,
} from './types/booking';

export type { WishlistItem, WishlistToggleResult } from './types/wishlist';
