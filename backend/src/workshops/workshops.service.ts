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
import { Repository } from 'typeorm';
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
    const { duration, startsAt: startsAtStr, ...rest } = createWorkshopDto;

    const startsAt = new Date(startsAtStr);
    if (startsAt <= new Date()) {
      throw new BadRequestException('Workshop start time must be in the future');
    }

    const endsAt = new Date(startsAt.getTime() + duration * 60 * 1000);

    const workshop = this.workshopRepository.create({
      ...rest,
      startsAt,
      endsAt,
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

  async findAll(category?: string) {
    const workshops = await this.workshopRepository.find({
      where: category ? { category: category as any } : undefined,
      order: { startsAt: 'ASC' },
      relations: ['host'],
    });

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
    const participantCount = (workshop.bookings ?? []).filter(
      (b: any) => b.status === BookingStatus.CONFIRMED,
    ).length;

    const { bookings, ...rest } = workshop;
    return { ...rest, participantCount };
  }
}
