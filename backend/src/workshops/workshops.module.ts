import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkshopsService } from './workshops.service';
import { WorkshopsController } from './workshops.controller';
import { Workshop } from './entities/workshop.entity';
import { WorkshopConductor } from './entities/workshop-conductor.entity';
import { WorkshopPhoto } from './entities/workshop-photo.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { User } from 'src/users/entities/user.entity';
import { BookingsModule } from 'src/bookings/bookings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workshop, WorkshopConductor, WorkshopPhoto, Booking, User]),
    forwardRef(() => BookingsModule),
  ],
  controllers: [WorkshopsController],
  providers: [WorkshopsService],
  exports: [WorkshopsService],
})
export class WorkshopsModule {}
