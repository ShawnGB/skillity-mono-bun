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
import { Not, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { UserRole, WorkshopStatus, BookingStatus } from 'src/types/enums';

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
  ) {}

  async create(createWorkshopDto: CreateWorkshopDto, hostId: string) {
    const { duration, startsAt: startsAtStr, seriesId, ...rest } = createWorkshopDto;

    const startsAt = new Date(startsAtStr);
    if (startsAt <= new Date()) {
      throw new BadRequestException('Workshop start time must be in the future');
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

    return await this.workshopRepository.save(workshop);
  }

  async findByHost(hostId: string) {
    const workshops = await this.workshopRepository.find({
      where: { hostId },
      order: { startsAt: 'DESC' },
      relations: ['host', 'bookings'],
    });

    return workshops.map((w) => this.withParticipantCount(this.withEffectiveStatus(w)));
  }

  async findAll(category?: string, hostId?: string, level?: string, search?: string) {
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

    return this.withParticipantCount(this.withEffectiveStatus(workshop));
  }

  async update(
    id: string,
    updateWorkshopDto: UpdateWorkshopDto,
    user: { id: string; role: UserRole },
  ) {
    const workshop = await this.workshopRepository.findOne({ where: { id } });
    if (!workshop) throw new NotFoundException('Workshop not found');

    if (workshop.hostId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only the host or an admin can update this workshop');
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
    }

    if (updateWorkshopDto.startsAt || updateWorkshopDto.duration) {
      const startsAt = updateWorkshopDto.startsAt
        ? new Date(updateWorkshopDto.startsAt)
        : workshop.startsAt;
      const duration = updateWorkshopDto.duration ?? this.getDurationMinutes(workshop);

      if (startsAt && duration) {
        Object.assign(updateWorkshopDto, {
          startsAt: startsAt,
          endsAt: new Date(startsAt.getTime() + duration * 60 * 1000),
        });
      }
      delete (updateWorkshopDto as Record<string, unknown>).duration;
    }

    Object.assign(workshop, updateWorkshopDto);
    return await this.workshopRepository.save(workshop);
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
    return (workshop.endsAt.getTime() - workshop.startsAt.getTime()) / (60 * 1000);
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
