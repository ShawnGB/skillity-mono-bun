import { createContext } from 'react-router';
import type { AuthUser } from '@skillity/shared';

export const sessionContext = createContext<{
  user: AuthUser;
  cookie: string;
} | null>(null);
