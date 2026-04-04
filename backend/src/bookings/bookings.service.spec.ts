import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Workshop } from '../workshops/entities/workshop.entity';
import { HostPayout } from './entities/host-payout.entity';
import { WorkshopConductor } from '../workshops/entities/workshop-conductor.entity';
import { PaymentsService } from '../payments/payments.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BadRequestException } from '@nestjs/common';
import { BookingStatus } from '../types/enums';

const mockBookingRepo = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  count: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  manager: { transaction: jest.fn() },
});

const mockWorkshopRepo = () => ({
  findOne: jest.fn(),
});

const mockHostPayoutRepo = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
});

const mockPaymentsService = () => ({
  initiatePayment: jest.fn(),
});

describe('BookingsService.confirmBooking', () => {
  let service: BookingsService;
  let bookingRepo: ReturnType<typeof mockBookingRepo>;

  beforeEach(async () => {
    bookingRepo = mockBookingRepo();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getRepositoryToken(Booking), useValue: bookingRepo },
        { provide: getRepositoryToken(Workshop), useValue: mockWorkshopRepo() },
        { provide: getRepositoryToken(HostPayout), useValue: mockHostPayoutRepo() },
        { provide: getRepositoryToken(WorkshopConductor), useValue: { find: jest.fn() } },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
        { provide: PaymentsService, useValue: mockPaymentsService() },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('throws BadRequestException when trying to confirm a paid booking directly', async () => {
    const paidBooking = {
      id: 'booking-1',
      userId: 'user-1',
      workshopId: 'ws-1',
      status: BookingStatus.PENDING,
      workshop: { ticketPrice: 25.0, startsAt: new Date(Date.now() + 86400000 * 10) },
    };
    bookingRepo.findOne.mockResolvedValue(paidBooking);

    await expect(service.confirmBooking('booking-1', 'user-1')).rejects.toThrow(
      'This is a paid workshop. Use the payment flow to confirm your booking.',
    );
  });

  it('allows confirming a free booking directly', async () => {
    const freeBooking = {
      id: 'booking-2',
      userId: 'user-1',
      workshopId: 'ws-2',
      status: BookingStatus.PENDING,
      workshop: { ticketPrice: 0, startsAt: new Date(Date.now() + 86400000 * 10) },
    };
    bookingRepo.findOne.mockResolvedValue(freeBooking);
    bookingRepo.manager.transaction.mockImplementation(async (fn: any) => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue({ ...freeBooking.workshop, maxParticipants: 10 }),
        count: jest.fn().mockResolvedValue(0),
        save: jest.fn().mockResolvedValue({ ...freeBooking, status: BookingStatus.CONFIRMED }),
      };
      return fn(mockManager);
    });

    const result = await service.confirmBooking('booking-2', 'user-1');
    expect(result.status).toBe(BookingStatus.CONFIRMED);
  });
});
