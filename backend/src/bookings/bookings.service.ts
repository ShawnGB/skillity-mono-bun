import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Booking } from './entities/booking.entity';
import { HostPayout } from './entities/host-payout.entity';
import { Workshop } from 'src/workshops/entities/workshop.entity';
import { WorkshopConductor } from 'src/workshops/entities/workshop-conductor.entity';
import { BookingStatus, PayoutStatus, UserRole, WorkshopStatus } from 'src/types/enums';
import { PaymentsService } from 'src/payments/payments.service';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(HostPayout)
    private readonly hostPayoutRepository: Repository<HostPayout>,
    @InjectRepository(Workshop)
    private readonly workshopRepository: Repository<Workshop>,
    @InjectRepository(WorkshopConductor)
    private readonly conductorRepository: Repository<WorkshopConductor>,
    private readonly eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => PaymentsService))
    private readonly paymentsService: PaymentsService,
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

    if (workshop.startsAt && workshop.startsAt <= new Date()) {
      throw new BadRequestException('Workshop has already started');
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
      where: { workshopId, status: BookingStatus.CONFIRMED },
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

  async initiatePayment(bookingId: string, userId: string): Promise<{ checkoutUrl: string }> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['workshop'],
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) throw new ForbiddenException();
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Only pending bookings can be paid');
    }
    if (booking.workshop.externalUrl) {
      throw new BadRequestException('External workshops cannot be paid through this platform');
    }
    if (booking.workshop.startsAt && booking.workshop.startsAt <= new Date()) {
      throw new BadRequestException('Workshop has already started');
    }

    if (booking.molliePaymentId) {
      const existing = await this.paymentsService.getPayment(booking.molliePaymentId);
      if (existing.status === 'open') {
        return { checkoutUrl: existing.getCheckoutUrl()! };
      }
    }

    const serviceFee = Number((Number(booking.amount) * 0.05).toFixed(2));

    const { id, checkoutUrl } = await this.paymentsService.createPayment({
      bookingId: booking.id,
      workshopId: booking.workshopId,
      workshopTitle: booking.workshop.title,
      amount: Number(booking.amount),
      currency: booking.currency,
    });

    booking.molliePaymentId = id;
    booking.serviceFee = serviceFee;
    await this.bookingRepository.save(booking);

    return { checkoutUrl };
  }

  async handlePaymentConfirmed(molliePaymentId: string): Promise<void> {
    const booking = await this.bookingRepository.findOne({
      where: { molliePaymentId },
      relations: ['workshop'],
    });

    if (!booking) {
      this.logger.warn(`No booking found for molliePaymentId ${molliePaymentId}`);
      return;
    }

    if (booking.status === BookingStatus.CONFIRMED) return;

    await this.bookingRepository.manager.transaction(async (manager) => {
      const workshop = await manager.findOne(Workshop, {
        where: { id: booking.workshopId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!workshop) throw new NotFoundException('Workshop not found');

      if (workshop.status === WorkshopStatus.CANCELLED) {
        await this.paymentsService.createRefund(molliePaymentId);
        booking.status = BookingStatus.REFUNDED;
        await manager.save(booking);
        return;
      }

      const confirmedCount = await manager.count(Booking, {
        where: { workshopId: booking.workshopId, status: BookingStatus.CONFIRMED },
      });

      if (confirmedCount >= workshop.maxParticipants) {
        await this.paymentsService.createRefund(molliePaymentId);
        booking.status = BookingStatus.REFUNDED;
        await manager.save(booking);
        this.eventEmitter.emit('booking.payment.refunded_oversold', {
          bookingId: booking.id,
          userId: booking.userId,
        });
        return;
      }

      booking.status = BookingStatus.CONFIRMED;
      booking.paidAt = new Date();
      await manager.save(booking);

      const conductors = await this.conductorRepository.find({
        where: { workshopId: booking.workshopId },
      });

      const netAmount = Number(booking.amount) - Number(booking.serviceFee ?? 0);
      const payouts = conductors.map((conductor) =>
        manager.create(HostPayout, {
          bookingId: booking.id,
          hostUserId: conductor.userId,
          workshopId: booking.workshopId,
          grossAmount: Number((netAmount * Number(conductor.payoutShare)).toFixed(2)),
          payoutShare: Number(conductor.payoutShare),
          currency: booking.currency,
          status: PayoutStatus.PENDING,
        }),
      );

      await manager.save(HostPayout, payouts);
    });

    this.eventEmitter.emit('booking.confirmed', {
      bookingId: booking.id,
      userId: booking.userId,
      workshopId: booking.workshopId,
    });
  }

  async handleChargeback(molliePaymentId: string): Promise<void> {
    const booking = await this.bookingRepository.findOne({
      where: { molliePaymentId },
    });

    if (!booking) return;

    booking.status = BookingStatus.REFUNDED;
    await this.bookingRepository.save(booking);

    await this.hostPayoutRepository.update(
      { bookingId: booking.id },
      { status: PayoutStatus.CANCELLED },
    );

    this.logger.warn(`Chargeback for booking ${booking.id} — manual review required`);
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

    if (Number(booking.workshop.ticketPrice) > 0) {
      throw new BadRequestException(
        'This is a paid workshop. Use the payment flow to confirm your booking.',
      );
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Only pending bookings can be confirmed');
    }

    if (Number(booking.amount) > 0) {
      throw new BadRequestException('Paid workshops must go through the payment flow');
    }

    const saved = await this.bookingRepository.manager.transaction(async (manager) => {
      const workshop = await manager.findOne(Workshop, {
        where: { id: booking.workshopId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!workshop) throw new NotFoundException('Workshop not found');

      if (workshop.startsAt && workshop.startsAt <= new Date()) {
        throw new BadRequestException('Workshop has already started');
      }

      const confirmedCount = await manager.count(Booking, {
        where: { workshopId: booking.workshopId, status: BookingStatus.CONFIRMED },
      });

      if (confirmedCount >= workshop.maxParticipants) {
        throw new BadRequestException('Workshop is full');
      }

      booking.status = BookingStatus.CONFIRMED;
      return manager.save(booking);
    });

    this.eventEmitter.emit('booking.confirmed', {
      bookingId: saved.id,
      userId,
      workshopId: saved.workshopId,
    });
    return saved;
  }

  async cancelBooking(id: string, userId: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['workshop'],
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) throw new ForbiddenException();

    if (
      booking.status !== BookingStatus.PENDING &&
      booking.status !== BookingStatus.CONFIRMED
    ) {
      throw new BadRequestException('This booking cannot be cancelled');
    }

    const hoursUntilStart = booking.workshop.startsAt
      ? (booking.workshop.startsAt.getTime() - Date.now()) / (1000 * 60 * 60)
      : Infinity;

    if (hoursUntilStart < 72) {
      throw new BadRequestException(
        'Cancellation is no longer available. Bookings can only be cancelled up to 72 hours before the workshop starts.',
      );
    }

    if (
      booking.status === BookingStatus.CONFIRMED &&
      booking.paidAt &&
      booking.molliePaymentId
    ) {
      await this.paymentsService.createRefund(booking.molliePaymentId);
      booking.status = BookingStatus.REFUNDED;
      await this.hostPayoutRepository.update(
        { bookingId: booking.id },
        { status: PayoutStatus.CANCELLED },
      );
    } else {
      booking.status = BookingStatus.CANCELLED;
    }

    return this.bookingRepository.save(booking);
  }

  async cancelWorkshopBookings(workshopId: string): Promise<void> {
    const confirmedBookings = await this.bookingRepository.find({
      where: { workshopId, status: BookingStatus.CONFIRMED },
    });

    for (const booking of confirmedBookings) {
      if (booking.paidAt && booking.molliePaymentId) {
        try {
          await this.paymentsService.createRefund(booking.molliePaymentId);
        } catch (err) {
          this.logger.error(`Refund failed for booking ${booking.id}: ${err}`);
        }
        booking.status = BookingStatus.REFUNDED;
        await this.hostPayoutRepository.update(
          { bookingId: booking.id },
          { status: PayoutStatus.CANCELLED },
        );
      } else {
        booking.status = BookingStatus.CANCELLED;
      }
    }

    await this.bookingRepository.save(confirmedBookings);

    await this.bookingRepository.update(
      { workshopId, status: BookingStatus.PENDING },
      { status: BookingStatus.CANCELLED },
    );
  }

  async findWorkshopBookings(
    workshopId: string,
    userId: string,
    userRole: UserRole,
  ) {
    const workshop = await this.workshopRepository.findOne({
      where: { id: workshopId },
    });

    if (!workshop) throw new NotFoundException('Workshop not found');

    if (workshop.hostId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only the host or an admin can view bookings');
    }

    return this.bookingRepository.find({
      where: { workshopId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      select: {
        id: true,
        status: true,
        amount: true,
        currency: true,
        createdAt: true,
        user: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async expireStalePendingBookings() {
    const now = new Date();

    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    await this.bookingRepository
      .createQueryBuilder()
      .update(Booking)
      .set({ status: BookingStatus.CANCELLED })
      .where('status = :status', { status: BookingStatus.PENDING })
      .andWhere('mollie_payment_id IS NOT NULL')
      .andWhere('created_at < :cutoff', { cutoff: twoHoursAgo })
      .execute();

    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    await this.bookingRepository
      .createQueryBuilder()
      .update(Booking)
      .set({ status: BookingStatus.CANCELLED })
      .where('status = :status', { status: BookingStatus.PENDING })
      .andWhere('mollie_payment_id IS NULL')
      .andWhere('created_at < :cutoff', { cutoff: twentyFourHoursAgo })
      .execute();
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
