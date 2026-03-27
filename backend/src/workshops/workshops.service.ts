import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Workshop } from './entities/workshop.entity';
import { WorkshopConductor } from './entities/workshop-conductor.entity';
import { In, Not, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRole, WorkshopStatus, BookingStatus } from 'src/types/enums';
import { Booking } from 'src/bookings/entities/booking.entity';

const VALID_TRANSITIONS: Record<WorkshopStatus, WorkshopStatus[]> = {
  [WorkshopStatus.DRAFT]: [WorkshopStatus.PUBLISHED, WorkshopStatus.CANCELLED],
  [WorkshopStatus.PUBLISHED]: [WorkshopStatus.CANCELLED],
  [WorkshopStatus.CANCELLED]: [],
  [WorkshopStatus.COMPLETED]: [],
};

@Injectable()
export class WorkshopsService {
  constructor(
    @InjectRepository(Workshop)
    private readonly workshopRepository: Repository<Workshop>,
    @InjectRepository(WorkshopConductor)
    private readonly conductorRepository: Repository<WorkshopConductor>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createWorkshopDto: CreateWorkshopDto, hostId: string) {
    const {
      duration,
      startsAt: startsAtStr,
      seriesId,
      ...rest
    } = createWorkshopDto;

    const startsAt = new Date(startsAtStr);
    if (startsAt <= new Date()) {
      throw new BadRequestException(
        'Workshop start time must be in the future',
      );
    }

    const endsAt = new Date(startsAt.getTime() + duration * 60 * 1000);

    const workshop = this.workshopRepository.create({
      ...rest,
      startsAt,
      endsAt,
      seriesId: seriesId ?? randomUUID(),
      status: WorkshopStatus.DRAFT,
      hostId,
    });

    if (!workshop) throw new ConflictException('Could not create Workshop');

    const saved = await this.workshopRepository.save(workshop);

    // Register host as primary conductor
    const conductor = this.conductorRepository.create({
      workshopId: saved.id,
      userId: hostId,
      isPrimary: true,
      payoutShare: 1.0,
    });
    await this.conductorRepository.save(conductor);

    return saved;
  }

  async findByHost(hostId: string) {
    const workshops = await this.workshopRepository.find({
      where: { hostId },
      order: { startsAt: 'DESC' },
      relations: ['host', 'bookings'],
    });

    return workshops.map((w) =>
      this.withParticipantCount(this.withEffectiveStatus(w)),
    );
  }

  async findAll(
    category?: string,
    hostId?: string,
    level?: string,
    search?: string,
  ) {
    const qb = this.workshopRepository
      .createQueryBuilder('workshop')
      .leftJoinAndSelect('workshop.host', 'host')
      .orderBy('workshop.startsAt', 'ASC');

    if (category) qb.andWhere('workshop.category = :category', { category });
    if (hostId) qb.andWhere('workshop.hostId = :hostId', { hostId });
    if (level) qb.andWhere('workshop.level = :level', { level });
    if (search) {
      const term = `%${search.toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(workshop.title) LIKE :search OR LOWER(workshop.description) LIKE :search)',
        { search: term },
      );
    }

    const workshops = await qb.getMany();

    return workshops.map((w) => ({
      ...this.withEffectiveStatus(w),
      participantCount: 0,
    }));
  }

  async findOne(id: string) {
    const workshop = await this.workshopRepository.findOne({
      where: { id },
      relations: ['host', 'bookings'],
    });

    if (!workshop) throw new NotFoundException('Workshop not found');

    const conductors = await this.conductorRepository.find({
      where: { workshopId: id },
      relations: ['user'],
      order: { isPrimary: 'DESC' },
    });

    const conductorProfiles = conductors.map((c) => ({
      userId: c.userId,
      isPrimary: c.isPrimary,
      payoutShare: Number(c.payoutShare),
      firstName: c.user.firstName,
      lastName: c.user.lastName,
      tagline: c.user.tagline,
    }));

    return {
      ...this.withParticipantCount(this.withEffectiveStatus(workshop)),
      conductors: conductorProfiles,
    };
  }

  async update(
    id: string,
    updateWorkshopDto: UpdateWorkshopDto,
    user: { id: string; role: UserRole },
  ) {
    const workshop = await this.workshopRepository.findOne({ where: { id } });
    if (!workshop) throw new NotFoundException('Workshop not found');

    if (workshop.hostId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Only the host or an admin can update this workshop',
      );
    }

    if (updateWorkshopDto.status) {
      const allowed = VALID_TRANSITIONS[workshop.status];
      if (!allowed.includes(updateWorkshopDto.status)) {
        throw new BadRequestException(
          `Cannot transition from ${workshop.status} to ${updateWorkshopDto.status}`,
        );
      }

      if (
        updateWorkshopDto.status === WorkshopStatus.PUBLISHED &&
        !workshop.startsAt &&
        !updateWorkshopDto.startsAt
      ) {
        throw new BadRequestException(
          'Cannot publish a workshop without a scheduled date',
        );
      }

      if (updateWorkshopDto.status === WorkshopStatus.CANCELLED) {
        const hoursUntilStart = workshop.startsAt
          ? (workshop.startsAt.getTime() - Date.now()) / (1000 * 60 * 60)
          : Infinity;

        if (hoursUntilStart < 72) {
          throw new BadRequestException(
            'Workshops can only be cancelled up to 72 hours before they start',
          );
        }

        await this.bookingRepository.update(
          {
            workshopId: id,
            status: In([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
          },
          { status: BookingStatus.REFUNDED },
        );
      }
    }

    if (updateWorkshopDto.startsAt || updateWorkshopDto.duration) {
      const startsAt = updateWorkshopDto.startsAt
        ? new Date(updateWorkshopDto.startsAt)
        : workshop.startsAt;
      const duration =
        updateWorkshopDto.duration ?? this.getDurationMinutes(workshop);

      if (startsAt && duration) {
        Object.assign(updateWorkshopDto, {
          startsAt: startsAt,
          endsAt: new Date(startsAt.getTime() + duration * 60 * 1000),
        });
      }
      delete (updateWorkshopDto as Record<string, unknown>).duration;
    }

    const wasPublished = updateWorkshopDto.status === WorkshopStatus.PUBLISHED;
    Object.assign(workshop, updateWorkshopDto);
    const saved = await this.workshopRepository.save(workshop);
    if (wasPublished) {
      this.eventEmitter.emit('workshop.published', { workshopId: saved.id, hostId: saved.hostId });
    }
    return saved;
  }

  async addConductor(
    workshopId: string,
    requesterId: string,
    dto: { userId: string; payoutShare: number },
  ) {
    const workshop = await this.workshopRepository.findOne({
      where: { id: workshopId },
    });
    if (!workshop) throw new NotFoundException('Workshop not found');
    if (workshop.hostId !== requesterId) {
      throw new ForbiddenException('Only the primary host can add conductors');
    }

    const existing = await this.conductorRepository.find({
      where: { workshopId },
    });

    // Validate that shares will sum to 1.0 after adding
    const otherShares = existing.reduce((sum, c) => {
      // Exclude the new user if updating
      if (c.userId === dto.userId) return sum;
      return sum + Number(c.payoutShare);
    }, 0);
    const total = Math.round((otherShares + dto.payoutShare) * 10000) / 10000;
    if (total > 1.0001) {
      throw new BadRequestException('Payout shares must sum to 1.0');
    }

    // If conductor already exists, update their share
    const existingConductor = existing.find((c) => c.userId === dto.userId);
    if (existingConductor) {
      existingConductor.payoutShare = dto.payoutShare;
      return this.conductorRepository.save(existingConductor);
    }

    const conductor = this.conductorRepository.create({
      workshopId,
      userId: dto.userId,
      isPrimary: false,
      payoutShare: dto.payoutShare,
    });
    return this.conductorRepository.save(conductor);
  }

  async removeConductor(
    workshopId: string,
    requesterId: string,
    userId: string,
  ) {
    const workshop = await this.workshopRepository.findOne({
      where: { id: workshopId },
    });
    if (!workshop) throw new NotFoundException('Workshop not found');
    if (workshop.hostId !== requesterId) {
      throw new ForbiddenException(
        'Only the primary host can remove conductors',
      );
    }

    const conductor = await this.conductorRepository.findOne({
      where: { workshopId, userId },
    });
    if (!conductor) throw new NotFoundException('Conductor not found');
    if (conductor.isPrimary) {
      throw new BadRequestException('Cannot remove the primary conductor');
    }

    await this.conductorRepository.remove(conductor);
  }

  async findSeriesSiblings(seriesId: string, excludeId?: string) {
    const where: Record<string, any> = {
      seriesId,
      status: WorkshopStatus.PUBLISHED,
    };
    if (excludeId) {
      where.id = Not(excludeId);
    }

    const workshops = await this.workshopRepository.find({
      where,
      order: { startsAt: 'ASC' },
      relations: ['host'],
    });

    return workshops
      .map((w) => ({
        ...this.withEffectiveStatus(w),
        participantCount: 0,
      }))
      .filter((w) => w.status === WorkshopStatus.PUBLISHED);
  }

  private getDurationMinutes(workshop: Workshop): number | null {
    if (!workshop.startsAt || !workshop.endsAt) return null;
    return (
      (workshop.endsAt.getTime() - workshop.startsAt.getTime()) / (60 * 1000)
    );
  }

  private withEffectiveStatus(workshop: Workshop): Workshop {
    if (
      workshop.status === WorkshopStatus.PUBLISHED &&
      workshop.endsAt &&
      workshop.endsAt < new Date()
    ) {
      return { ...workshop, status: WorkshopStatus.COMPLETED };
    }
    return workshop;
  }

  private withParticipantCount(workshop: Workshop & { bookings?: any[] }) {
    const allBookings = workshop.bookings ?? [];
    const participantCount = allBookings.filter(
      (b: any) => b.status === BookingStatus.CONFIRMED,
    ).length;
    const pendingCount = allBookings.filter(
      (b: any) => b.status === BookingStatus.PENDING,
    ).length;
    const estimatedRevenue = participantCount * Number(workshop.ticketPrice);

    const { bookings, ...rest } = workshop;
    return { ...rest, participantCount, pendingCount, estimatedRevenue };
  }
}
