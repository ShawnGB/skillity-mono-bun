import { UserRole } from '../../types/enums';

export class AuthUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export class AuthResponseDto {
  user: AuthUserDto;
  message: string;
}
