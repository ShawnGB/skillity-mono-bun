import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Workshop } from 'src/workshops/entities/workshop.entity';
import { BookingStatus, WorkshopStatus } from 'src/types/enums';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Workshop)
    private readonly workshopRepository: Repository<Workshop>,
  ) {}

  async createBooking(workshopId: string, userId: string) {
    const workshop = await this.workshopRepository.findOne({
      where: { id: workshopId },
    });

    if (!workshop) throw new NotFoundException('Workshop not found');

    const effectiveStatus = this.getEffectiveStatus(workshop);
    if (effectiveStatus !== WorkshopStatus.PUBLISHED) {
      throw new BadRequestException('Workshop is not available for booking');
    }

    if (workshop.externalUrl) {
      throw new BadRequestException('External workshops cannot be booked directly');
    }

    const existingBooking = await this.bookingRepository.findOne({
      where: [
        { workshopId, userId, status: BookingStatus.PENDING },
        { workshopId, userId, status: BookingStatus.CONFIRMED },
      ],
    });

    if (existingBooking) {
      throw new BadRequestException('You already have an active booking for this workshop');
    }

    const confirmedCount = await this.bookingRepository.count({
      where: {
        workshopId,
        status: BookingStatus.CONFIRMED,
      },
    });

    if (confirmedCount >= workshop.maxParticipants) {
      throw new BadRequestException('Workshop is full');
    }

    const booking = this.bookingRepository.create({
      userId,
      workshopId,
      status: BookingStatus.PENDING,
      amount: workshop.ticketPrice,
      currency: workshop.currency,
    });

    return this.bookingRepository.save(booking);
  }

  async findMyBookings(userId: string) {
    return this.bookingRepository.find({
      where: { userId },
      relations: ['workshop', 'workshop.host'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['workshop', 'workshop.host'],
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) throw new ForbiddenException();

    return booking;
  }

  async confirmBooking(id: string, userId: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['workshop'],
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) throw new ForbiddenException();

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Only pending bookings can be confirmed');
    }

    const confirmedCount = await this.bookingRepository.count({
      where: {
        workshopId: booking.workshopId,
        status: BookingStatus.CONFIRMED,
      },
    });

    if (confirmedCount >= booking.workshop.maxParticipants) {
      throw new BadRequestException('Workshop is full');
    }

    booking.status = BookingStatus.CONFIRMED;
    booking.paymentId = `mock_${Date.now()}`;

    return this.bookingRepository.save(booking);
  }

  async cancelBooking(id: string, userId: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) throw new ForbiddenException();

    if (
      booking.status !== BookingStatus.PENDING &&
      booking.status !== BookingStatus.CONFIRMED
    ) {
      throw new BadRequestException('This booking cannot be cancelled');
    }

    booking.status = BookingStatus.CANCELLED;

    return this.bookingRepository.save(booking);
  }

  private getEffectiveStatus(workshop: Workshop): WorkshopStatus {
    if (
      workshop.status === WorkshopStatus.PUBLISHED &&
      workshop.endsAt &&
      workshop.endsAt < new Date()
    ) {
      return WorkshopStatus.COMPLETED;
    }
    return workshop.status;
  }
}
