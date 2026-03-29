import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { WorkshopStatus } from 'src/types/enums';
import { CreateWorkshopDto } from './create-workshop.dto';

export class UpdateWorkshopDto extends PartialType(CreateWorkshopDto) {
  @IsOptional()
  @IsEnum(WorkshopStatus)
  status?: WorkshopStatus;

  @IsOptional()
  @IsString()
  coverImageUrl?: string | null;

  @IsOptional()
  @IsString()
  coverImageKey?: string | null;

  @IsOptional()
  @IsString()
  coverImageAttribution?: string | null;
}
