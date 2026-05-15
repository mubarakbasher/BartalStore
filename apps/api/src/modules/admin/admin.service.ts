import { Injectable, NotImplementedException } from '@nestjs/common';
import { DeliveryZone } from '@bartal/shared';
import type {
  CreateCategoryDto,
  CreateProductDto,
  UpdateCategoryDto,
  UpdateOrderPaymentDto,
  UpdateOrderStatusDto,
  UpdateProductDto,
  UpdateSettingsDto,
  UpdateZoneFeeDto,
} from './dto/admin.dto';

/** Admin service — scaffolded per PRD §7.2 + §10.3 /api/admin. */
@Injectable()
export class AdminService {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  async dashboard() { throw new NotImplementedException(); }
  async listOrders(_filters: Record<string, unknown>) { throw new NotImplementedException(); }
  async updateOrderStatus(_orderId: string, _dto: UpdateOrderStatusDto, _adminId: string) {
    throw new NotImplementedException();
  }
  async updateOrderPayment(_orderId: string, _dto: UpdateOrderPaymentDto, _adminId: string) {
    throw new NotImplementedException();
  }
  async createProduct(_dto: CreateProductDto) { throw new NotImplementedException(); }
  async updateProduct(_productId: string, _dto: UpdateProductDto) { throw new NotImplementedException(); }
  async deleteProduct(_productId: string) { throw new NotImplementedException(); }
  async uploadProductImages(_productId: string) { throw new NotImplementedException(); }
  async createCategory(_dto: CreateCategoryDto) { throw new NotImplementedException(); }
  async updateCategory(_categoryId: string, _dto: UpdateCategoryDto) { throw new NotImplementedException(); }
  async listCustomers(_page?: number, _limit?: number) { throw new NotImplementedException(); }
  async customerDetail(_customerId: string) { throw new NotImplementedException(); }
  async updateZoneFee(_zone: DeliveryZone, _dto: UpdateZoneFeeDto) { throw new NotImplementedException(); }
  async salesAnalytics(_from?: string, _to?: string) { throw new NotImplementedException(); }
  async topProducts(_limit?: number) { throw new NotImplementedException(); }
  async getSettings() { throw new NotImplementedException(); }
  async updateSettings(_dto: UpdateSettingsDto) { throw new NotImplementedException(); }
  /* eslint-enable */
}
