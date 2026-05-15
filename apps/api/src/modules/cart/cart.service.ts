import { Injectable, NotImplementedException } from '@nestjs/common';
import type { AddCartItemDto, UpdateCartItemDto } from './dto/cart.dto';

/**
 * Cart service — scaffolded per PRD §10.3 /api/cart.
 * TODO: Redis-backed cart with PG fallback on `CartSession`. Cart must survive
 * offline drops and power outages (PRD §7.1.3).
 */
@Injectable()
export class CartService {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  async get(_userId: string) { throw new NotImplementedException(); }
  async addItem(_userId: string, _dto: AddCartItemDto) { throw new NotImplementedException(); }
  async updateItem(_userId: string, _productId: string, _dto: UpdateCartItemDto) {
    throw new NotImplementedException();
  }
  async removeItem(_userId: string, _productId: string) { throw new NotImplementedException(); }
  async clear(_userId: string) { throw new NotImplementedException(); }
  /* eslint-enable */
}
