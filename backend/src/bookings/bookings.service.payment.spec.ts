import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { HostPayout } from './entities/host-payout.entity';
import { Workshop } from '../workshops/entities/workshop.entity';
import { WorkshopConductor } from '../workshops/entities/workshop-conductor.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentsService } from '../payments/payments.service';
import { BookingStatus, PayoutStatus } from '../types/enums';
import { BadRequestException } from '@nestjs/common';

const makeRepo = (overrides = {}) => ({
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  count: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({}),
  }),
  manager: {
    transaction: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  },
  ...overrides,
});

describe('BookingsService — payment paths', () => {
  let service: BookingsService;
  let bookingRepo: ReturnType<typeof makeRepo>;
  let hostPayoutRepo: ReturnType<typeof makeRepo>;
  let workshopRepo: ReturnType<typeof makeRepo>;
  let conductorRepo: ReturnType<typeof makeRepo>;
  let paymentsService: { createPayment: jest.Mock; createRefund: jest.Mock; getPayment: jest.Mock };
  let eventEmitter: { emit: jest.Mock };

  const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

  beforeEach(async () => {
    bookingRepo = makeRepo();
    hostPayoutRepo = makeRepo();
    workshopRepo = makeRepo();
    conductorRepo = makeRepo();
    paymentsService = {
      createPayment: jest.fn(),
      createRefund: jest.fn(),
      getPayment: jest.fn(),
    };
    eventEmitter = { emit: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getRepositoryToken(Booking), useValue: bookingRepo },
        { provide: getRepositoryToken(HostPayout), useValue: hostPayoutRepo },
        { provide: getRepositoryToken(Workshop), useValue: workshopRepo },
        { provide: getRepositoryToken(WorkshopConductor), useValue: conductorRepo },
        { provide: EventEmitter2, useValue: eventEmitter },
        { provide: PaymentsService, useValue: paymentsService },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  // ─── initiatePayment ────────────────────────────────────────────────────────

  describe('initiatePayment', () => {
    it('calls createPayment and saves molliePaymentId + serviceFee', async () => {
      const booking = {
        id: 'b1',
        userId: 'u1',
        workshopId: 'ws1',
        status: BookingStatus.PENDING,
        molliePaymentId: null,
        amount: 100,
        currency: 'EUR',
        workshop: { id: 'ws1', title: 'Pottery', externalUrl: null, startsAt: futureDate },
      };
      bookingRepo.findOne.mockResolvedValue(booking);
      // createPayment returns { id, checkoutUrl } directly (not via links)
      paymentsService.createPayment.mockResolvedValue({
        id: 'tr_123',
        checkoutUrl: 'https://mollie.com/tr_123',
      });
      bookingRepo.save.mockResolvedValue({
        ...booking,
        molliePaymentId: 'tr_123',
        serviceFee: 5,
      });

      const result = await service.initiatePayment('b1', 'u1');

      expect(result.checkoutUrl).toBe('https://mollie.com/tr_123');
      expect(paymentsService.createPayment).toHaveBeenCalledWith(
        expect.objectContaining({ bookingId: 'b1', amount: 100 }),
      );
      // The service mutates the booking object in-place before saving, so we
      // assert on the shape rather than strict object identity.
      expect(bookingRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ molliePaymentId: 'tr_123', serviceFee: 5 }),
      );
    });

    it('computes serviceFee as 5 % of amount (rounded to 2 dp)', async () => {
      const booking = {
        id: 'b2',
        userId: 'u1',
        workshopId: 'ws1',
        status: BookingStatus.PENDING,
        molliePaymentId: null,
        amount: 33,     // 5 % of 33 = 1.65
        currency: 'EUR',
        workshop: { id: 'ws1', title: 'Pottery', externalUrl: null, startsAt: futureDate },
      };
      bookingRepo.findOne.mockResolvedValue(booking);
      paymentsService.createPayment.mockResolvedValue({ id: 'tr_abc', checkoutUrl: 'https://x' });
      bookingRepo.save.mockResolvedValue(booking);

      await service.initiatePayment('b2', 'u1');

      expect(bookingRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ serviceFee: 1.65 }),
      );
    });

    it('returns existing checkoutUrl if payment is still open (idempotent retry)', async () => {
      const booking = {
        id: 'b1',
        userId: 'u1',
        workshopId: 'ws1',
        status: BookingStatus.PENDING,
        molliePaymentId: 'tr_existing',
        amount: 100,
        currency: 'EUR',
        workshop: { id: 'ws1', title: 'Pottery', externalUrl: null, startsAt: futureDate },
      };
      bookingRepo.findOne.mockResolvedValue(booking);
      // getPayment returns the Mollie payment object; the service reads
      // existing.links?.checkout?.href for the checkout URL
      paymentsService.getPayment.mockResolvedValue({
        status: 'open',
        links: { checkout: { href: 'https://mollie.com/tr_existing' } },
      });

      const result = await service.initiatePayment('b1', 'u1');

      expect(result.checkoutUrl).toBe('https://mollie.com/tr_existing');
      expect(paymentsService.createPayment).not.toHaveBeenCalled();
      expect(bookingRepo.save).not.toHaveBeenCalled();
    });

    it('creates a fresh payment when existing Mollie payment is no longer open', async () => {
      const booking = {
        id: 'b1',
        userId: 'u1',
        workshopId: 'ws1',
        status: BookingStatus.PENDING,
        molliePaymentId: 'tr_expired',
        amount: 50,
        currency: 'EUR',
        workshop: { id: 'ws1', title: 'Pottery', externalUrl: null, startsAt: futureDate },
      };
      bookingRepo.findOne.mockResolvedValue(booking);
      paymentsService.getPayment.mockResolvedValue({ status: 'expired', links: {} });
      paymentsService.createPayment.mockResolvedValue({
        id: 'tr_new',
        checkoutUrl: 'https://mollie.com/tr_new',
      });
      bookingRepo.save.mockResolvedValue(booking);

      const result = await service.initiatePayment('b1', 'u1');

      expect(paymentsService.createPayment).toHaveBeenCalledTimes(1);
      expect(result.checkoutUrl).toBe('https://mollie.com/tr_new');
    });

    it('throws BadRequestException for non-PENDING booking', async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: 'b1',
        userId: 'u1',
        status: BookingStatus.CONFIRMED,
        workshop: { externalUrl: null, startsAt: futureDate },
      });

      await expect(service.initiatePayment('b1', 'u1')).rejects.toThrow(BadRequestException);
      expect(paymentsService.createPayment).not.toHaveBeenCalled();
    });

    it('throws BadRequestException when workshop has already started', async () => {
      const past = new Date(Date.now() - 1000);
      bookingRepo.findOne.mockResolvedValue({
        id: 'b1',
        userId: 'u1',
        status: BookingStatus.PENDING,
        molliePaymentId: null,
        workshop: { externalUrl: null, startsAt: past },
      });

      await expect(service.initiatePayment('b1', 'u1')).rejects.toThrow(BadRequestException);
    });
  });

  // ─── cancelBooking ──────────────────────────────────────────────────────────

  describe('cancelBooking', () => {
    it('issues Mollie refund and sets REFUNDED for confirmed paid bookings', async () => {
      const booking = {
        id: 'b1',
        userId: 'u1',
        status: BookingStatus.CONFIRMED,
        paidAt: new Date(),
        molliePaymentId: 'tr_123',
        workshop: { startsAt: futureDate },
      };
      bookingRepo.findOne.mockResolvedValue(booking);
      paymentsService.createRefund.mockResolvedValue({});
      hostPayoutRepo.update.mockResolvedValue({});
      bookingRepo.save.mockResolvedValue({ ...booking, status: BookingStatus.REFUNDED });

      await service.cancelBooking('b1', 'u1');

      expect(paymentsService.createRefund).toHaveBeenCalledWith('tr_123');
      // The service mutates booking.status = REFUNDED in-place, then calls save(booking)
      expect(bookingRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: BookingStatus.REFUNDED }),
      );
      expect(hostPayoutRepo.update).toHaveBeenCalledWith(
        { bookingId: 'b1' },
        { status: PayoutStatus.CANCELLED },
      );
    });

    it('sets CANCELLED without Mollie call for PENDING bookings', async () => {
      const booking = {
        id: 'b2',
        userId: 'u1',
        status: BookingStatus.PENDING,
        paidAt: null,
        molliePaymentId: null,
        workshop: { startsAt: futureDate },
      };
      bookingRepo.findOne.mockResolvedValue(booking);
      bookingRepo.save.mockResolvedValue({ ...booking, status: BookingStatus.CANCELLED });

      await service.cancelBooking('b2', 'u1');

      expect(paymentsService.createRefund).not.toHaveBeenCalled();
      expect(bookingRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: BookingStatus.CANCELLED }),
      );
    });

    it('sets CANCELLED without Mollie call for CONFIRMED free bookings (no paidAt)', async () => {
      // A CONFIRMED booking that went through the free flow has no paidAt / molliePaymentId
      const booking = {
        id: 'b3',
        userId: 'u1',
        status: BookingStatus.CONFIRMED,
        paidAt: null,
        molliePaymentId: null,
        workshop: { startsAt: futureDate },
      };
      bookingRepo.findOne.mockResolvedValue(booking);
      bookingRepo.save.mockResolvedValue({ ...booking, status: BookingStatus.CANCELLED });

      await service.cancelBooking('b3', 'u1');

      expect(paymentsService.createRefund).not.toHaveBeenCalled();
      expect(bookingRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: BookingStatus.CANCELLED }),
      );
    });

    it('throws BadRequestException when cancelling within 72 h of start', async () => {
      const soon = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 h away
      const booking = {
        id: 'b4',
        userId: 'u1',
        status: BookingStatus.CONFIRMED,
        paidAt: new Date(),
        molliePaymentId: 'tr_456',
        workshop: { startsAt: soon },
      };
      bookingRepo.findOne.mockResolvedValue(booking);

      await expect(service.cancelBooking('b4', 'u1')).rejects.toThrow(BadRequestException);
      expect(paymentsService.createRefund).not.toHaveBeenCalled();
    });

    it('throws BadRequestException for already-cancelled/refunded bookings', async () => {
      bookingRepo.findOne.mockResolvedValue({
        id: 'b5',
        userId: 'u1',
        status: BookingStatus.CANCELLED,
        workshop: { startsAt: futureDate },
      });

      await expect(service.cancelBooking('b5', 'u1')).rejects.toThrow(BadRequestException);
    });
  });
});
