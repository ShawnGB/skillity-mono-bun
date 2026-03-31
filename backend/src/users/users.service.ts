import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UserResponseDTO } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Workshop } from '../workshops/entities/workshop.entity';
import { In, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingStatus, UserRole, WorkshopStatus } from '../types/enums';
import { ReviewsService } from '../reviews/reviews.service';
import { StorageService } from '../storage/storage.service';
import { randomUUID } from 'crypto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly UsersRepository: Repository<User>,
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
    @InjectRepository(Workshop)
    private readonly workshopsRepository: Repository<Workshop>,
    private readonly reviewsService: ReviewsService,
    private readonly storage: StorageService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDTO> {
    const user = this.UsersRepository.create(createUserDto);
    if (!user) throw new NotFoundException('User could not be created');

    user.password = await bcrypt.hash(user.password, 10);

    await this.UsersRepository.save(user);

    return new UserResponseDTO(user);
  }

  async findAll() {
    return await this.UsersRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt'],
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.UsersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.UsersRepository.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async lookupByEmail(email: string) {
    const user = await this.UsersRepository.findOne({
      where: { email },
      select: ['id', 'firstName', 'lastName'],
    });
    if (!user) return null;
    return { id: user.id, firstName: user.firstName, lastName: user.lastName };
  }

  async becomeHost(userId: string) {
    const user = await this.UsersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== UserRole.GUEST) {
      throw new BadRequestException('Only guests can upgrade to host');
    }

    user.role = UserRole.HOST;
    await this.UsersRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.UsersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.bio !== undefined) user.bio = dto.bio;
    if (dto.tagline !== undefined) user.tagline = dto.tagline;
    if (dto.profession !== undefined) user.profession = dto.profession;
    if (dto.city !== undefined) user.city = dto.city;
    if (dto.conductorType !== undefined) user.conductorType = dto.conductorType;
    if (dto.companyName !== undefined) user.companyName = dto.companyName;
    if (dto.vatNumber !== undefined) user.vatNumber = dto.vatNumber;

    if (dto.avatarUrl !== undefined) {
      const oldKey = user.avatarKey;
      user.avatarUrl = dto.avatarUrl ?? null;
      user.avatarKey = dto.avatarKey ?? null;
      if (oldKey && oldKey !== dto.avatarKey) {
        await this.storage.delete(oldKey).catch(() => null);
      }
    }

    await this.UsersRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      bio: user.bio,
      tagline: user.tagline,
      profession: user.profession,
      city: user.city,
      conductorType: user.conductorType,
      companyName: user.companyName,
      vatNumber: user.vatNumber,
      avatarUrl: user.avatarUrl,
    };
  }

  async getHostProfile(id: string) {
    const user = await this.UsersRepository.findOne({ where: { id } });
    if (
      !user ||
      (user.role !== UserRole.HOST && user.role !== UserRole.ADMIN)
    ) {
      throw new NotFoundException('Host not found');
    }

    const workshopCount = await this.workshopsRepository.count({
      where: {
        hostId: id,
        status: Not(In([WorkshopStatus.DRAFT, WorkshopStatus.CANCELLED])),
      },
    });

    const { averageRating, reviewCount } =
      await this.reviewsService.getHostAverageRating(id);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      tagline: user.tagline,
      profession: user.profession,
      city: user.city,
      conductorType: user.conductorType,
      companyName: user.companyName,
      avatarUrl: user.avatarUrl,
      averageRating,
      reviewCount,
      workshopCount,
      memberSince: user.createdAt.toISOString(),
    };
  }

  async deleteAccount(userId: string) {
    const user = await this.UsersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    await this.bookingsRepository.update(
      {
        userId,
        status: In([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
      },
      { status: BookingStatus.CANCELLED },
    );

    user.email = `deleted_${randomUUID()}@deleted.local`;
    user.firstName = 'Deleted';
    user.lastName = 'User';
    user.password = await bcrypt.hash(randomUUID(), 10);
    user.deletedAt = new Date();

    await this.UsersRepository.save(user);
  }

  async exportData(userId: string) {
    const user = await this.UsersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const bookings = await this.bookingsRepository.find({
      where: { userId },
      relations: ['workshop'],
    });

    const workshops = await this.workshopsRepository.find({
      where: { hostId: userId },
    });

    return {
      profile: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
      },
      bookings: bookings.map((b) => ({
        id: b.id,
        status: b.status,
        amount: b.amount,
        currency: b.currency,
        workshopTitle: b.workshop?.title,
        createdAt: b.createdAt,
      })),
      hostedWorkshops: workshops.map((w) => ({
        id: w.id,
        title: w.title,
        status: w.status,
        ticketPrice: w.ticketPrice,
        currency: w.currency,
        createdAt: w.createdAt,
      })),
      exportedAt: new Date().toISOString(),
    };
  }
}
