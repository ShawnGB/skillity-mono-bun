import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('wishlist')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  findAll(@CurrentUser() user: { id: string }) {
    return this.wishlistsService.findByUser(user.id);
  }

  @Get('check')
  checkBatch(
    @Query('ids') ids: string,
    @CurrentUser() user: { id: string },
  ) {
    const workshopIds = ids ? ids.split(',').filter(Boolean) : [];
    return this.wishlistsService.checkBatch(user.id, workshopIds);
  }

  @Post(':workshopId')
  toggle(
    @Param('workshopId') workshopId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.wishlistsService.toggle(user.id, workshopId);
  }

  @Delete(':workshopId')
  remove(
    @Param('workshopId') workshopId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.wishlistsService.remove(user.id, workshopId);
  }
}
