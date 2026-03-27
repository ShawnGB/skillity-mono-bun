import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  firstName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  lastName?: string;
}

export class UserResponseDTO {
  email: string;
  firstName: string;
  lastName: string;

  @Exclude()
  password: string;

  constructor(user: Partial<UserResponseDTO>) {
    Object.assign(this, user);
  }
}
