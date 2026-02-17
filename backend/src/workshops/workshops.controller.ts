import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { WorkshopsService } from './workshops.service';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole, WorkshopCategory } from '../types/enums';

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
  findAll(
    @Query('category') category?: WorkshopCategory,
    @Query('hostId') hostId?: string,
  ) {
    return this.workshopsService.findAll(category, hostId);
  }

  @Get('mine')
  @Roles(UserRole.HOST, UserRole.ADMIN)
  findMine(@CurrentUser() user: { id: string }) {
    return this.workshopsService.findByHost(user.id);
  }

  @Public()
  @Get('series/:seriesId')
  findBySeries(@Param('seriesId') seriesId: string) {
    return this.workshopsService.findSeriesSiblings(seriesId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workshopsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.HOST, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateWorkshopDto: UpdateWorkshopDto,
    @CurrentUser() user: { id: string; role: UserRole },
  ) {
    return this.workshopsService.update(id, updateWorkshopDto, user);
  }
}
