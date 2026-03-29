import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { WorkshopsService } from './workshops.service';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole, WorkshopCategory, PhotoStatus } from '../types/enums';
import type { User } from '../users/entities/user.entity';

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
    @Query('level') level?: string,
    @Query('search') search?: string,
  ) {
    return this.workshopsService.findAll(category, hostId, level, search);
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

  @Get('pexels-suggestions')
  @Roles(UserRole.HOST, UserRole.ADMIN)
  getPexelsSuggestions(@Query('category') category: string) {
    return this.workshopsService.getPexelsSuggestions(category);
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

  @Post(':id/conductors')
  @Roles(UserRole.HOST, UserRole.ADMIN)
  addConductor(
    @Param('id') id: string,
    @Body() body: { userId: string; payoutShare: number },
    @CurrentUser() user: { id: string },
  ) {
    return this.workshopsService.addConductor(id, user.id, body);
  }

  @Delete(':id/conductors/:userId')
  @Roles(UserRole.HOST, UserRole.ADMIN)
  removeConductor(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.workshopsService.removeConductor(id, user.id, userId);
  }

  @Patch(':id/conductors/split')
  @Roles(UserRole.HOST, UserRole.ADMIN)
  updateSplit(
    @Param('id') id: string,
    @Body() body: { splits: { userId: string; payoutShare: number }[] },
    @CurrentUser() user: { id: string },
  ) {
    return this.workshopsService.updateSplit(id, user.id, body.splits);
  }

  @Delete(':id')
  @Roles(UserRole.HOST, UserRole.ADMIN)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: UserRole },
  ) {
    return this.workshopsService.remove(id, user.id, user.role);
  }

  @Public()
  @Get(':id/photos')
  getPhotos(
    @Param('id') id: string,
    @CurrentUser() user?: User,
  ) {
    return this.workshopsService.getPhotos(id, user?.id, user?.role);
  }

  @Post(':id/photos')
  addPhoto(
    @Param('id') id: string,
    @Body() body: { url: string; storageKey: string; caption?: string },
    @CurrentUser() user: User,
  ) {
    return this.workshopsService.addPhoto(
      id,
      user.id,
      user.role,
      body.url,
      body.storageKey,
      body.caption,
    );
  }

  @Patch(':id/photos/:photoId/approve')
  @Roles(UserRole.HOST, UserRole.ADMIN)
  approvePhoto(
    @Param('id') id: string,
    @Param('photoId') photoId: string,
    @CurrentUser() user: { id: string; role: UserRole },
  ) {
    return this.workshopsService.updatePhotoStatus(id, photoId, PhotoStatus.APPROVED, user.id, user.role);
  }

  @Patch(':id/photos/:photoId/reject')
  @Roles(UserRole.HOST, UserRole.ADMIN)
  rejectPhoto(
    @Param('id') id: string,
    @Param('photoId') photoId: string,
    @CurrentUser() user: { id: string; role: UserRole },
  ) {
    return this.workshopsService.updatePhotoStatus(id, photoId, PhotoStatus.REJECTED, user.id, user.role);
  }

  @Patch(':id/photos/:photoId/promote')
  @Roles(UserRole.HOST, UserRole.ADMIN)
  promotePhoto(
    @Param('id') id: string,
    @Param('photoId') photoId: string,
    @CurrentUser() user: { id: string; role: UserRole },
  ) {
    return this.workshopsService.promotePhoto(id, photoId, user.id, user.role);
  }
}
