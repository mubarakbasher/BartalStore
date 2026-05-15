import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeliveryZone } from '@bartal/shared';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CurrentUser, type AuthedUser } from '../../common/decorators/current-user.decorator';
import {
  CreateCategoryDto,
  CreateProductDto,
  UpdateCategoryDto,
  UpdateOrderPaymentDto,
  UpdateOrderStatusDto,
  UpdateProductDto,
  UpdateSettingsDto,
  UpdateZoneFeeDto,
} from './dto/admin.dto';
import { AdminService } from './admin.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  // --- Dashboard & analytics ---
  @Get('dashboard') @ApiOperation({ summary: 'Dashboard KPIs' })
  dashboard() { return this.admin.dashboard(); }

  @Get('analytics/sales') @ApiOperation({ summary: 'Sales analytics' })
  salesAnalytics(@Query('from') from?: string, @Query('to') to?: string) {
    return this.admin.salesAnalytics(from, to);
  }

  @Get('analytics/products') @ApiOperation({ summary: 'Top products' })
  topProducts(@Query('limit') limit?: string) {
    return this.admin.topProducts(limit ? Number(limit) : undefined);
  }

  // --- Orders ---
  @Get('orders') @ApiOperation({ summary: 'List all orders (filterable)' })
  listOrders(@Query() filters: Record<string, string>) {
    return this.admin.listOrders(filters);
  }

  @Put('orders/:id/status') @ApiOperation({ summary: 'Update order status' })
  updateOrderStatus(
    @CurrentUser() u: AuthedUser,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.admin.updateOrderStatus(id, dto, u.id);
  }

  @Put('orders/:id/payment') @ApiOperation({ summary: 'Confirm or reject payment' })
  updateOrderPayment(
    @CurrentUser() u: AuthedUser,
    @Param('id') id: string,
    @Body() dto: UpdateOrderPaymentDto,
  ) {
    return this.admin.updateOrderPayment(id, dto, u.id);
  }

  // --- Products ---
  @Post('products') @ApiOperation({ summary: 'Create product' })
  createProduct(@Body() dto: CreateProductDto) { return this.admin.createProduct(dto); }

  @Put('products/:id') @ApiOperation({ summary: 'Update product' })
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.admin.updateProduct(id, dto);
  }

  @Delete('products/:id') @ApiOperation({ summary: 'Soft delete product' })
  deleteProduct(@Param('id') id: string) { return this.admin.deleteProduct(id); }

  @Post('products/:id/images') @ApiOperation({ summary: 'Upload product images (presigned to R2)' })
  uploadProductImages(@Param('id') id: string) { return this.admin.uploadProductImages(id); }

  // --- Categories ---
  @Post('categories') @ApiOperation({ summary: 'Create category' })
  createCategory(@Body() dto: CreateCategoryDto) { return this.admin.createCategory(dto); }

  @Put('categories/:id') @ApiOperation({ summary: 'Update category' })
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.admin.updateCategory(id, dto);
  }

  // --- Customers ---
  @Get('customers') @ApiOperation({ summary: 'List customers' })
  listCustomers(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.admin.listCustomers(
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
    );
  }

  @Get('customers/:id') @ApiOperation({ summary: 'Customer detail + history' })
  customerDetail(@Param('id') id: string) { return this.admin.customerDetail(id); }

  // --- Delivery & settings ---
  @Put('delivery/zones/:zone') @ApiOperation({ summary: 'Update zone fee + ETA' })
  updateZoneFee(@Param('zone') zone: DeliveryZone, @Body() dto: UpdateZoneFeeDto) {
    return this.admin.updateZoneFee(zone, dto);
  }

  @Get('settings') @ApiOperation({ summary: 'Get app settings' })
  getSettings() { return this.admin.getSettings(); }

  @Put('settings') @ApiOperation({ summary: 'Update app settings' })
  updateSettings(@Body() dto: UpdateSettingsDto) { return this.admin.updateSettings(dto); }
}
