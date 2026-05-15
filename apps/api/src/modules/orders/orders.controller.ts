import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, type AuthedUser } from '../../common/decorators/current-user.decorator';
import { CancelOrderDto, CreateOrderDto, UploadReceiptDto } from './dto/orders.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get() @ApiOperation({ summary: 'List user orders' })
  list(
    @CurrentUser() u: AuthedUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.orders.list(
      u.id,
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
    );
  }

  @Get(':id') @ApiOperation({ summary: 'Order detail' })
  detail(@CurrentUser() u: AuthedUser, @Param('id') id: string) {
    return this.orders.detail(u.id, id);
  }

  @Post() @ApiOperation({ summary: 'Create order from cart' })
  create(@CurrentUser() u: AuthedUser, @Body() dto: CreateOrderDto) {
    return this.orders.create(u.id, dto);
  }

  @Delete(':id/cancel') @ApiOperation({ summary: 'Cancel order (if eligible)' })
  cancel(
    @CurrentUser() u: AuthedUser,
    @Param('id') id: string,
    @Body() dto: CancelOrderDto,
  ) {
    return this.orders.cancel(u.id, id, dto);
  }

  @Post(':id/receipt') @ApiOperation({ summary: 'Upload bank-transfer receipt for an order' })
  uploadReceipt(
    @CurrentUser() u: AuthedUser,
    @Param('id') id: string,
    @Body() dto: UploadReceiptDto,
  ) {
    return this.orders.uploadReceipt(u.id, id, dto);
  }
}
