import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsPositive,
  Min,
  IsUUID,
} from 'class-validator';

export class CreateWorkshopDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  maxParticipants: number;

  @IsNumber()
  @Min(0)
  ticketPrice: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(3)
  currency: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsUUID()
  @IsNotEmpty()
  hostId: string;
}
