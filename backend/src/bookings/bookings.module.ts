import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { HostPayout } from './entities/host-payout.entity';
import { Workshop } from 'src/workshops/entities/workshop.entity';
import { WorkshopConductor } from 'src/workshops/entities/workshop-conductor.entity';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, HostPayout, Workshop, WorkshopConductor]),
    forwardRef(() => PaymentsModule),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
