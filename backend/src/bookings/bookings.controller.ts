import { Controller, Get, Post, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../types/enums';

@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('workshops/:id/book')
  createBooking(
    @Param('id') workshopId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.bookingsService.createBooking(workshopId, user.id);
  }

  @Get('workshops/:id/bookings')
  @Roles(UserRole.HOST, UserRole.ADMIN)
  findWorkshopBookings(
    @Param('id') workshopId: string,
    @CurrentUser() user: { id: string; role: UserRole },
  ) {
    return this.bookingsService.findWorkshopBookings(workshopId, user.id, user.role);
  }

  @Get('bookings/mine')
  findMyBookings(@CurrentUser() user: { id: string }) {
    return this.bookingsService.findMyBookings(user.id);
  }

  @Get('bookings/:id')
  findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.bookingsService.findOne(id, user.id);
  }

  @Post('bookings/:id/confirm')
  confirmBooking(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.bookingsService.confirmBooking(id, user.id);
  }

  @Post('bookings/:id/cancel')
  cancelBooking(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.bookingsService.cancelBooking(id, user.id);
  }
}
