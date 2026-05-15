import { Injectable, NotImplementedException } from '@nestjs/common';
import type { CancelOrderDto, CreateOrderDto, UploadReceiptDto } from './dto/orders.dto';

/** Orders service — scaffolded per PRD §10.3 /api/orders + §11 payment flow. */
@Injectable()
export class OrdersService {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  async list(_userId: string, _page?: number, _limit?: number) { throw new NotImplementedException(); }
  async detail(_userId: string, _orderId: string) { throw new NotImplementedException(); }
  async create(_userId: string, _dto: CreateOrderDto) { throw new NotImplementedException(); }
  async cancel(_userId: string, _orderId: string, _dto: CancelOrderDto) {
    throw new NotImplementedException();
  }
  async uploadReceipt(_userId: string, _orderId: string, _dto: UploadReceiptDto) {
    throw new NotImplementedException();
  }
  /* eslint-enable */
}
