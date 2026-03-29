import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Workshop } from './entities/workshop.entity';
import { WorkshopConductor } from './entities/workshop-conductor.entity';
import { WorkshopPhoto } from './entities/workshop-photo.entity';
import { In, LessThan, Not, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRole, WorkshopStatus, BookingStatus, PhotoStatus } from 'src/types/enums';
import { Booking } from 'src/bookings/entities/booking.entity';
import { StorageService } from 'src/storage/storage.service';

const PEXELS_CATEGORY_KEYWORDS: Record<string, string> = {
  crafts_and_making: 'pottery ceramics craft workshop',
  cooking_and_food: 'cooking class food workshop',
  music_and_sound: 'music workshop band rehearsal',
  visual_arts: 'painting art workshop studio',
  writing: 'writing workshop creative writing',
  digital_skills: 'coding workshop technology',
  movement_and_body: 'yoga dance movement workshop',
  languages: 'language learning classroom',
  science_and_nature: 'science nature workshop',
  business_and_entrepreneurship: 'business workshop entrepreneurship',
};

export interface PexelsPhoto {
  id: number;
  url: string;
  photographer: string;
  pexelsUrl: string;
}

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
    @InjectRepository(WorkshopPhoto)
    private readonly photoRepository: Repository<WorkshopPhoto>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly eventEmitter: EventEmitter2,
    private readonly storage: StorageService,
  ) {}

  private readonly pexelsCache = new Map<string, { photos: PexelsPhoto[]; ts: number }>();

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

  async findByHost(userId: string) {
    const conductorRows = await this.conductorRepository.find({
      where: { userId },
      select: ['workshopId'],
    });
    const conductedIds = conductorRows.map((c) => c.workshopId);

    const hostedWorkshops = await this.workshopRepository.find({
      where: { hostId: userId },
      order: { startsAt: 'DESC' },
      relations: ['host', 'bookings'],
    });

    const coCondWorkshops =
      conductedIds.length > 0
        ? await this.workshopRepository
            .createQueryBuilder('workshop')
            .leftJoinAndSelect('workshop.host', 'host')
            .leftJoinAndSelect('workshop.bookings', 'bookings')
            .where('workshop.id IN (:...ids)', { ids: conductedIds })
            .andWhere('workshop.hostId != :userId', { userId })
            .orderBy('workshop.startsAt', 'DESC')
            .getMany()
        : [];

    const all = [...hostedWorkshops, ...coCondWorkshops];
    all.sort(
      (a, b) =>
        (b.startsAt?.getTime() ?? 0) - (a.startsAt?.getTime() ?? 0),
    );

    return all.map((w) =>
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
      avatarUrl: c.user.avatarUrl,
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

    const oldImageKey = workshop.coverImageKey;
    const wasPublished = updateWorkshopDto.status === WorkshopStatus.PUBLISHED;
    Object.assign(workshop, updateWorkshopDto);
    const saved = await this.workshopRepository.save(workshop);

    if (
      oldImageKey &&
      updateWorkshopDto.coverImageKey !== undefined &&
      updateWorkshopDto.coverImageKey !== oldImageKey
    ) {
      await this.storage.delete(oldImageKey).catch(() => null);
    }

    if (wasPublished) {
      this.eventEmitter.emit('workshop.published', { workshopId: saved.id, hostId: saved.hostId });
    }
    return saved;
  }

  async remove(id: string, userId: string, role: UserRole) {
    const workshop = await this.workshopRepository.findOne({ where: { id } });
    if (!workshop) throw new NotFoundException('Workshop not found');
    if (workshop.hostId !== userId && role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only the host or an admin can delete this workshop');
    }

    const photos = await this.photoRepository.find({ where: { workshopId: id } });
    await Promise.all(photos.map((p) => this.storage.delete(p.storageKey).catch(() => null)));

    if (workshop.coverImageKey) {
      await this.storage.delete(workshop.coverImageKey).catch(() => null);
    }

    await this.workshopRepository.remove(workshop);
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

  async updateSplit(
    workshopId: string,
    requesterId: string,
    splits: { userId: string; payoutShare: number }[],
  ) {
    const workshop = await this.workshopRepository.findOne({
      where: { id: workshopId },
    });
    if (!workshop) throw new NotFoundException('Workshop not found');
    if (workshop.hostId !== requesterId) {
      throw new ForbiddenException(
        'Only the primary host can update the payout split',
      );
    }

    const total =
      Math.round(
        splits.reduce((sum, s) => sum + s.payoutShare, 0) * 10000,
      ) / 10000;
    if (Math.abs(total - 1.0) > 0.001) {
      throw new BadRequestException('Payout shares must sum to 1.0');
    }

    const existing = await this.conductorRepository.find({
      where: { workshopId },
    });

    for (const split of splits) {
      const row = existing.find((c) => c.userId === split.userId);
      if (row) {
        row.payoutShare = split.payoutShare;
        await this.conductorRepository.save(row);
      } else {
        const conductor = this.conductorRepository.create({
          workshopId,
          userId: split.userId,
          isPrimary: split.userId === workshop.hostId,
          payoutShare: split.payoutShare,
        });
        await this.conductorRepository.save(conductor);
      }
    }
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

  async getPexelsSuggestions(category: string): Promise<PexelsPhoto[]> {
    const apiKey = process.env.PEXELS_API_KEY;
    if (!apiKey) return [];

    const cached = this.pexelsCache.get(category);
    if (cached && Date.now() - cached.ts < 86_400_000) return cached.photos;

    const keyword = PEXELS_CATEGORY_KEYWORDS[category] ?? `${category} workshop`;
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=6&orientation=landscape`,
      { headers: { Authorization: apiKey } },
    );
    if (!res.ok) return [];

    const data = (await res.json()) as { photos: { id: number; src: { large: string }; photographer: string; url: string }[] };
    const photos: PexelsPhoto[] = data.photos.map((p) => ({
      id: p.id,
      url: p.src.large,
      photographer: p.photographer,
      pexelsUrl: p.url,
    }));

    this.pexelsCache.set(category, { photos, ts: Date.now() });
    return photos;
  }

  async addPhoto(
    workshopId: string,
    uploaderId: string,
    uploaderRole: UserRole,
    url: string,
    storageKey: string,
    caption?: string,
  ) {
    const workshop = await this.workshopRepository.findOne({ where: { id: workshopId } });
    if (!workshop) throw new NotFoundException('Workshop not found');

    const isHost = workshop.hostId === uploaderId || uploaderRole === UserRole.ADMIN;

    if (!isHost) {
      const booking = await this.bookingRepository.findOne({
        where: { workshopId, userId: uploaderId, status: BookingStatus.CONFIRMED },
      });
      if (!booking) throw new ForbiddenException('Only confirmed attendees can contribute photos');

      const pending = await this.photoRepository.count({
        where: { workshopId, uploaderId, status: PhotoStatus.PENDING },
      });
      if (pending >= 3) {
        throw new BadRequestException('You already have 3 photos pending review for this workshop');
      }
    }

    const approved = await this.photoRepository.count({
      where: { workshopId, status: PhotoStatus.APPROVED },
    });
    if (approved >= 20) {
      throw new BadRequestException('This workshop has reached the maximum of 20 approved photos');
    }

    const photo = this.photoRepository.create({
      workshopId,
      uploaderId,
      url,
      storageKey,
      status: isHost ? PhotoStatus.APPROVED : PhotoStatus.PENDING,
      caption: caption ?? null,
    });
    return this.photoRepository.save(photo);
  }

  async getPhotos(workshopId: string, requesterId?: string, requesterRole?: UserRole) {
    const workshop = await this.workshopRepository.findOne({ where: { id: workshopId } });
    if (!workshop) throw new NotFoundException('Workshop not found');

    const isHostOrAdmin =
      requesterId === workshop.hostId || requesterRole === UserRole.ADMIN;

    if (isHostOrAdmin) {
      return this.photoRepository.find({
        where: { workshopId },
        order: { createdAt: 'DESC' },
      });
    }

    return this.photoRepository.find({
      where: { workshopId, status: PhotoStatus.APPROVED },
      order: { createdAt: 'DESC' },
    });
  }

  async updatePhotoStatus(
    workshopId: string,
    photoId: string,
    status: PhotoStatus.APPROVED | PhotoStatus.REJECTED,
    requesterId: string,
    requesterRole: UserRole,
  ) {
    const workshop = await this.workshopRepository.findOne({ where: { id: workshopId } });
    if (!workshop) throw new NotFoundException('Workshop not found');
    if (workshop.hostId !== requesterId && requesterRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only the host can manage photos');
    }

    const photo = await this.photoRepository.findOne({ where: { id: photoId, workshopId } });
    if (!photo) throw new NotFoundException('Photo not found');

    if (status === PhotoStatus.REJECTED) {
      await this.storage.delete(photo.storageKey).catch(() => null);
      await this.photoRepository.remove(photo);
      return { deleted: true };
    }

    photo.status = status;
    return this.photoRepository.save(photo);
  }

  async promotePhoto(
    workshopId: string,
    photoId: string,
    requesterId: string,
    requesterRole: UserRole,
  ) {
    const workshop = await this.workshopRepository.findOne({ where: { id: workshopId } });
    if (!workshop) throw new NotFoundException('Workshop not found');
    if (workshop.hostId !== requesterId && requesterRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only the host can promote photos');
    }

    const photo = await this.photoRepository.findOne({ where: { id: photoId, workshopId } });
    if (!photo) throw new NotFoundException('Photo not found');
    if (photo.status !== PhotoStatus.APPROVED) throw new BadRequestException('Only approved photos can be promoted');

    const oldKey = workshop.coverImageKey;
    workshop.coverImageUrl = photo.url;
    workshop.coverImageKey = photo.storageKey;
    workshop.coverImageAttribution = null;
    await this.workshopRepository.save(workshop);

    if (oldKey && oldKey !== photo.storageKey) {
      await this.storage.delete(oldKey).catch(() => null);
    }

    return { coverImageUrl: workshop.coverImageUrl };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupStalePendingPhotos() {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const stale = await this.photoRepository.find({
      where: { status: PhotoStatus.PENDING, createdAt: LessThan(cutoff) },
    });
    await Promise.all(stale.map((p) => this.storage.delete(p.storageKey).catch(() => null)));
    if (stale.length > 0) await this.photoRepository.remove(stale);
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
