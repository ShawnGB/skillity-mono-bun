import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { HostPayout } from './entities/host-payout.entity';
import { Workshop } from '../workshops/entities/workshop.entity';
import { WorkshopConductor } from '../workshops/entities/workshop-conductor.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentsService } from '../payments/payments.service';
import { PayoutStatus } from '../types/enums';

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
  },
  ...overrides,
});

describe('BookingsService — processPayouts', () => {
  let service: BookingsService;
  let hostPayoutRepo: ReturnType<typeof makeRepo>;
  let paymentsService: { createPayment: jest.Mock; createRefund: jest.Mock; getPayment: jest.Mock; createTransfer: jest.Mock };

  beforeEach(async () => {
    hostPayoutRepo = makeRepo();
    paymentsService = {
      createPayment: jest.fn(),
      createRefund: jest.fn(),
      getPayment: jest.fn(),
      createTransfer: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getRepositoryToken(Booking), useValue: makeRepo() },
        { provide: getRepositoryToken(HostPayout), useValue: hostPayoutRepo },
        { provide: getRepositoryToken(Workshop), useValue: makeRepo() },
        { provide: getRepositoryToken(WorkshopConductor), useValue: makeRepo() },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
        { provide: PaymentsService, useValue: paymentsService },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('creates transfer and marks payout PAID when conductor has mollieOrganizationId', async () => {
    const payout = {
      id: 'hp1',
      hostUserId: 'u1',
      grossAmount: 95,
      currency: 'EUR',
      status: PayoutStatus.PENDING,
      mollieTransferId: null,
      hostUser: { id: 'u1', mollieOrganizationId: 'org_abc' },
    };
    hostPayoutRepo.find.mockResolvedValue([payout]);
    paymentsService.createTransfer.mockResolvedValue({ id: 'trx_1' });
    hostPayoutRepo.save.mockResolvedValue({ ...payout, status: PayoutStatus.PAID, mollieTransferId: 'trx_1' });

    await service.processPayouts();

    expect(paymentsService.createTransfer).toHaveBeenCalledWith({
      destination: 'org_abc',
      amount: 95,
      currency: 'EUR',
      idempotencyKey: 'hp1',
    });
    expect(hostPayoutRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ status: PayoutStatus.PAID, mollieTransferId: 'trx_1' }),
    );
  });

  it('skips payout when conductor has no mollieOrganizationId', async () => {
    const payout = {
      id: 'hp2',
      hostUserId: 'u1',
      grossAmount: 50,
      currency: 'EUR',
      status: PayoutStatus.PENDING,
      mollieTransferId: null,
      hostUser: { id: 'u1', mollieOrganizationId: null },
    };
    hostPayoutRepo.find.mockResolvedValue([payout]);

    await service.processPayouts();

    expect(paymentsService.createTransfer).not.toHaveBeenCalled();
    expect(hostPayoutRepo.save).not.toHaveBeenCalled();
  });

  it('leaves payout as PENDING and continues when transfer throws', async () => {
    const payout1 = {
      id: 'hp3',
      grossAmount: 50,
      currency: 'EUR',
      status: PayoutStatus.PENDING,
      mollieTransferId: null,
      hostUser: { id: 'u1', mollieOrganizationId: 'org_1' },
    };
    const payout2 = {
      id: 'hp4',
      grossAmount: 80,
      currency: 'EUR',
      status: PayoutStatus.PENDING,
      mollieTransferId: null,
      hostUser: { id: 'u2', mollieOrganizationId: 'org_2' },
    };
    hostPayoutRepo.find.mockResolvedValue([payout1, payout2]);
    paymentsService.createTransfer
      .mockRejectedValueOnce(new Error('Mollie down'))
      .mockResolvedValueOnce({ id: 'trx_2' });
    hostPayoutRepo.save.mockResolvedValue({});

    await service.processPayouts();

    expect(paymentsService.createTransfer).toHaveBeenCalledTimes(2);
    expect(hostPayoutRepo.save).toHaveBeenCalledTimes(1);
    expect(hostPayoutRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'hp4', status: PayoutStatus.PAID }),
    );
  });
});
