import { Injectable, NotImplementedException } from '@nestjs/common';
import type { CreateReviewDto, ListProductsQueryDto, SearchProductsQueryDto } from './dto/products.dto';

/** Products service — scaffolded per PRD §10.3 /api/products. */
@Injectable()
export class ProductsService {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  async list(_q: ListProductsQueryDto) { throw new NotImplementedException(); }
  async detail(_id: string) { throw new NotImplementedException(); }
  async search(_q: SearchProductsQueryDto) { throw new NotImplementedException(); }
  async listReviews(_productId: string) { throw new NotImplementedException(); }
  async createReview(_userId: string, _productId: string, _dto: CreateReviewDto) {
    throw new NotImplementedException();
  }
  /* eslint-enable */
}
