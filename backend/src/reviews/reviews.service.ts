import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Workshop } from '../workshops/entities/workshop.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { BookingStatus, WorkshopStatus } from '../types/enums';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Workshop)
    private readonly workshopRepository: Repository<Workshop>,
  ) {}

  async createReview(workshopId: string, userId: string, dto: CreateReviewDto) {
    const workshop = await this.workshopRepository.findOne({
      where: { id: workshopId },
    });
    if (!workshop) throw new NotFoundException('Workshop not found');

    const isEnded =
      workshop.status === WorkshopStatus.COMPLETED ||
      (workshop.status === WorkshopStatus.PUBLISHED &&
        workshop.endsAt &&
        workshop.endsAt < new Date());

    if (!isEnded) {
      throw new ForbiddenException('Cannot review a workshop that has not ended');
    }

    const booking = await this.bookingRepository.findOne({
      where: { workshopId, userId, status: BookingStatus.CONFIRMED },
    });
    if (!booking) {
      throw new ForbiddenException('You must have a confirmed booking to review this workshop');
    }

    const existing = await this.reviewRepository.findOne({
      where: { workshopId, userId },
    });
    if (existing) {
      throw new ConflictException('You have already reviewed this workshop');
    }

    const review = this.reviewRepository.create({
      rating: dto.rating,
      comment: dto.comment ?? null,
      userId,
      workshopId,
    });

    return await this.reviewRepository.save(review);
  }

  async getWorkshopReviews(workshopId: string) {
    const reviews = await this.reviewRepository.find({
      where: { workshopId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    return reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      userId: r.userId,
      workshopId: r.workshopId,
      reviewerName: `${r.user.firstName} ${r.user.lastName}`,
      createdAt: r.createdAt,
    }));
  }

  async getSeriesReviews(seriesId: string) {
    const reviews = await this.reviewRepository
      .createQueryBuilder('review')
      .innerJoinAndSelect('review.user', 'user')
      .innerJoin('review.workshop', 'workshop')
      .where('workshop.series_id = :seriesId', { seriesId })
      .orderBy('review.createdAt', 'DESC')
      .getMany();

    return reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      userId: r.userId,
      workshopId: r.workshopId,
      reviewerName: `${r.user.firstName} ${r.user.lastName}`,
      createdAt: r.createdAt,
    }));
  }

  async getUserReviews(userId: string) {
    const reviews = await this.reviewRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      userId: r.userId,
      workshopId: r.workshopId,
      reviewerName: '',
      createdAt: r.createdAt,
    }));
  }

  async getHostAverageRating(hostId: string): Promise<{
    averageRating: number | null;
    reviewCount: number;
  }> {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .innerJoin('review.workshop', 'workshop')
      .where('workshop.host_id = :hostId', { hostId })
      .select('AVG(review.rating)', 'avg')
      .addSelect('COUNT(review.id)', 'count')
      .getRawOne();

    return {
      averageRating: result.avg ? parseFloat(parseFloat(result.avg).toFixed(1)) : null,
      reviewCount: parseInt(result.count, 10),
    };
  }
}
