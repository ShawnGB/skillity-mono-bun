import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { WorkshopStatus } from 'src/types/enums';
import { CreateWorkshopDto } from './create-workshop.dto';

export class UpdateWorkshopDto extends PartialType(CreateWorkshopDto) {
  @IsOptional()
  @IsEnum(WorkshopStatus)
  status?: WorkshopStatus;
}
