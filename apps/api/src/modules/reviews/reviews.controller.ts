import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import {
  CurrentUser,
  type AuthedUser,
} from '../../common/decorators/current-user.decorator';
import { CreateReviewDto, ListReviewsQueryDto } from './dto/reviews.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('reviews')
@Controller('products')
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Public()
  @Get(':id/reviews')
  @ApiOperation({ summary: 'List product reviews (paginated, with summary)' })
  list(@Param('id') productId: string, @Query() query: ListReviewsQueryDto) {
    return this.reviews.list(productId, query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/reviews')
  @ApiOperation({ summary: 'Add a review (verified-purchase only)' })
  create(
    @CurrentUser() u: AuthedUser,
    @Param('id') productId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviews.create(u.id, productId, dto);
  }
}
