import { Test, TestingModule } from '@nestjs/testing';
import { WorkshopsService } from './workshops.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Workshop } from './entities/workshop.entity';
import { WorkshopConductor } from './entities/workshop-conductor.entity';
import { WorkshopPhoto } from './entities/workshop-photo.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { User } from '../users/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StorageService } from '../storage/storage.service';
import { BookingsService } from '../bookings/bookings.service';
import { WorkshopStatus } from '../types/enums';
import { BadRequestException } from '@nestjs/common';

const makeRepo = (overrides = {}) => ({
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  count: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findAndCount: jest.fn(),
  ...overrides,
});

describe('WorkshopsService — publishing gate', () => {
  let service: WorkshopsService;
  let workshopRepo: ReturnType<typeof makeRepo>;
  let conductorRepo: ReturnType<typeof makeRepo>;
  let userRepo: ReturnType<typeof makeRepo>;

  const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

  beforeEach(async () => {
    workshopRepo = makeRepo();
    conductorRepo = makeRepo();
    userRepo = makeRepo();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkshopsService,
        { provide: getRepositoryToken(Workshop), useValue: workshopRepo },
        { provide: getRepositoryToken(WorkshopConductor), useValue: conductorRepo },
        { provide: getRepositoryToken(WorkshopPhoto), useValue: makeRepo() },
        { provide: getRepositoryToken(Booking), useValue: makeRepo() },
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
        { provide: StorageService, useValue: { delete: jest.fn() } },
        { provide: BookingsService, useValue: { cancelWorkshopBookings: jest.fn() } },
      ],
    }).compile();

    service = module.get<WorkshopsService>(WorkshopsService);
  });

  it('throws BadRequestException when host has no mollieOrganizationId', async () => {
    const workshop = {
      id: 'ws1',
      hostId: 'u1',
      status: WorkshopStatus.DRAFT,
      startsAt: futureDate,
      endsAt: new Date(futureDate.getTime() + 2 * 60 * 60 * 1000),
      coverImageKey: null,
    };
    workshopRepo.findOne.mockResolvedValue(workshop);
    conductorRepo.find.mockResolvedValue([]);
    userRepo.findOne.mockResolvedValue({ id: 'u1', mollieOrganizationId: null, firstName: 'Anna', lastName: 'Schmidt' });

    await expect(
      service.update('ws1', { status: WorkshopStatus.PUBLISHED }, { id: 'u1', role: 'host' as any }),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when a co-conductor has no mollieOrganizationId', async () => {
    const workshop = {
      id: 'ws1',
      hostId: 'u1',
      status: WorkshopStatus.DRAFT,
      startsAt: futureDate,
      endsAt: new Date(futureDate.getTime() + 2 * 60 * 60 * 1000),
      coverImageKey: null,
    };
    workshopRepo.findOne.mockResolvedValue(workshop);
    conductorRepo.find.mockResolvedValue([{ userId: 'u2' }]);
    userRepo.findOne
      .mockResolvedValueOnce({ id: 'u1', mollieOrganizationId: 'org_1', firstName: 'Anna', lastName: 'Schmidt' })
      .mockResolvedValueOnce({ id: 'u2', mollieOrganizationId: null, firstName: 'Max', lastName: 'Müller' });

    await expect(
      service.update('ws1', { status: WorkshopStatus.PUBLISHED }, { id: 'u1', role: 'host' as any }),
    ).rejects.toThrow('Max Müller has not connected');
  });

  it('allows publishing when all conductors have mollieOrganizationId', async () => {
    const workshop = {
      id: 'ws1',
      hostId: 'u1',
      status: WorkshopStatus.DRAFT,
      startsAt: futureDate,
      endsAt: new Date(futureDate.getTime() + 2 * 60 * 60 * 1000),
      coverImageKey: null,
      coverImageUrl: null,
    };
    workshopRepo.findOne.mockResolvedValue(workshop);
    conductorRepo.find.mockResolvedValue([]);
    userRepo.findOne.mockResolvedValue({ id: 'u1', mollieOrganizationId: 'org_1' });
    workshopRepo.save.mockResolvedValue({ ...workshop, status: WorkshopStatus.PUBLISHED });

    const result = await service.update('ws1', { status: WorkshopStatus.PUBLISHED }, { id: 'u1', role: 'host' as any });
    expect(result).toBeDefined();
  });
});
