export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string | null;
  tagline?: string | null;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  tagline?: string;
}

export interface HostProfile {
  id: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  tagline: string | null;
  averageRating: number | null;
  reviewCount: number;
  workshopCount: number;
  memberSince: string;
}
