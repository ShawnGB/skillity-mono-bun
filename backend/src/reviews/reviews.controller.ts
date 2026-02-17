import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('workshops')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('reviews/mine')
  getMyReviews(@CurrentUser() user: { id: string }) {
    return this.reviewsService.getUserReviews(user.id);
  }

  @Post(':id/reviews')
  createReview(
    @Param('id') workshopId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(workshopId, user.id, dto);
  }

  @Public()
  @Get(':id/reviews')
  getWorkshopReviews(@Param('id') workshopId: string) {
    return this.reviewsService.getWorkshopReviews(workshopId);
  }

  @Public()
  @Get('series/:seriesId/reviews')
  getSeriesReviews(@Param('seriesId') seriesId: string) {
    return this.reviewsService.getSeriesReviews(seriesId);
  }
}
