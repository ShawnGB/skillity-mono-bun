import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  lastName: string;
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
