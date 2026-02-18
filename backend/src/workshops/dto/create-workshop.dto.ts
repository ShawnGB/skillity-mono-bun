import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsPositive,
  Min,
  Max,
  IsDateString,
  IsInt,
  IsOptional,
  IsUrl,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { WorkshopCategory, WorkshopLevel } from 'src/types/enums';

export class CreateWorkshopDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @IsEnum(WorkshopCategory)
  category: WorkshopCategory;

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

  @IsDateString()
  @IsNotEmpty()
  startsAt: string;

  @IsInt()
  @Min(30)
  @Max(480)
  duration: number;

  @IsOptional()
  @IsEnum(WorkshopLevel)
  level?: WorkshopLevel;

  @IsOptional()
  @IsUrl()
  externalUrl?: string;

  @IsOptional()
  @IsUUID()
  seriesId?: string;
}
