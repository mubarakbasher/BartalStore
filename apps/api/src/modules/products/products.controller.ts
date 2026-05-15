import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, type AuthedUser } from '../../common/decorators/current-user.decorator';
import {
  CreateReviewDto,
  ListProductsQueryDto,
  SearchProductsQueryDto,
} from './dto/products.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Public() @Get() @ApiOperation({ summary: 'List products (paginated, filterable)' })
  list(@Query() q: ListProductsQueryDto) { return this.products.list(q); }

  @Public() @Get('search') @ApiOperation({ summary: 'Full-text search AR + EN' })
  search(@Query() q: SearchProductsQueryDto) { return this.products.search(q); }

  @Public() @Get(':id') @ApiOperation({ summary: 'Product detail' })
  detail(@Param('id') id: string) { return this.products.detail(id); }

  @Public() @Get(':id/reviews') @ApiOperation({ summary: 'List product reviews' })
  reviews(@Param('id') id: string) { return this.products.listReviews(id); }

  @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  @Post(':id/reviews') @ApiOperation({ summary: 'Add a review (verified purchase only)' })
  addReview(
    @CurrentUser() u: AuthedUser,
    @Param('id') productId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.products.createReview(u.id, productId, dto);
  }
}
