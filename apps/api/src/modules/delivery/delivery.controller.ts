import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeliveryZone } from '@bartal/shared';
import { Public } from '../../common/decorators/public.decorator';
import { DeliveryService } from './delivery.service';

@ApiTags('delivery')
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly delivery: DeliveryService) {}

  @Public() @Get('zones') @ApiOperation({ summary: 'List delivery zones + fees' })
  zones() { return this.delivery.zones(); }

  @Public() @Get('fee') @ApiOperation({ summary: 'Calculate delivery fee for zone + cart total' })
  fee(@Query('zone') zone: DeliveryZone, @Query('total') total: string) {
    return this.delivery.calculateFee(zone, Number(total));
  }
}
