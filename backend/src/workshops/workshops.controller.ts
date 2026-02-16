import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { WorkshopsService } from './workshops.service';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../types/enums';

@Controller('workshops')
export class WorkshopsController {
  constructor(private readonly workshopsService: WorkshopsService) {}

  @Post()
  @Roles(UserRole.HOST, UserRole.ADMIN)
  create(
    @Body() createWorkshopDto: CreateWorkshopDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.workshopsService.create(createWorkshopDto, user.id);
  }

  @Public()
  @Get()
  findAll() {
    return this.workshopsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workshopsService.findOne(id);
  }
}
