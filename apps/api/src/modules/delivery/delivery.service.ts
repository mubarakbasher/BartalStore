import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DeliveryZone,
  DELIVERY_ZONE_BY_KEY,
  KHARTOUM_DELIVERY_ZONES,
} from '@bartal/shared';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DeliveryService {
  constructor(private readonly prisma: PrismaService) {}

  async zones() {
    const rows = await this.prisma.deliveryZoneFee.findMany();
    const byZone = new Map(rows.map((r) => [r.zone, r]));

    return KHARTOUM_DELIVERY_ZONES.map((cfg) => {
      const row = byZone.get(cfg.zone);
      const fee = row ? Number(row.fee) : cfg.default_fee_sdg;
      const free_above =
        row && row.free_above !== null ? Number(row.free_above) : cfg.free_above_sdg;
      return {
        zone: cfg.zone,
        name_ar: cfg.name_ar,
        name_en: cfg.name_en,
        districts_ar: cfg.districts_ar,
        districts_en: cfg.districts_en,
        fee_sdg: fee,
        free_above_sdg: free_above,
        estimated_days_min: row?.estimated_days_min ?? cfg.estimated_days_min,
        estimated_days_max: row?.estimated_days_max ?? cfg.estimated_days_max,
      };
    });
  }

  async calculateFee(zone: DeliveryZone, total: number) {
    if (!DELIVERY_ZONE_BY_KEY[zone]) {
      throw new BadRequestException({
        code: 'INVALID_ZONE',
        message_en: 'Unknown delivery zone.',
        message_ar: 'منطقة التوصيل غير معروفة.',
      });
    }
    if (!Number.isFinite(total) || total < 0) {
      throw new BadRequestException({
        code: 'INVALID_TOTAL',
        message_en: 'Cart total must be a non-negative number.',
        message_ar: 'إجمالي الطلب يجب أن يكون رقماً صحيحاً.',
      });
    }

    const row = await this.prisma.deliveryZoneFee.findUnique({ where: { zone } });
    const cfg = DELIVERY_ZONE_BY_KEY[zone];

    const fee = row ? Number(row.fee) : cfg.default_fee_sdg;
    const free_above =
      row && row.free_above !== null ? Number(row.free_above) : cfg.free_above_sdg;

    const charged_fee = free_above !== null && total >= free_above ? 0 : fee;

    return {
      zone,
      cart_total: total,
      fee_sdg: charged_fee,
      free_delivery: charged_fee === 0,
      threshold_sdg: free_above,
      estimated_days_min: row?.estimated_days_min ?? cfg.estimated_days_min,
      estimated_days_max: row?.estimated_days_max ?? cfg.estimated_days_max,
    };
  }
}
