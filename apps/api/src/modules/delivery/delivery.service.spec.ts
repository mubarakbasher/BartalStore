import { Test } from '@nestjs/testing';
import { DeliveryService } from './delivery.service';
import { PrismaService } from '../../prisma/prisma.service';
import { DeliveryZone } from '@bartal/shared';
import { BadRequestException } from '@nestjs/common';

describe('DeliveryService', () => {
  let service: DeliveryService;
  let prisma: { deliveryZoneFee: { findMany: jest.Mock; findUnique: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      deliveryZoneFee: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        DeliveryService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = moduleRef.get(DeliveryService);
  });

  describe('zones', () => {
    it('returns all 4 Khartoum zones with merged DB overrides', async () => {
      prisma.deliveryZoneFee.findMany.mockResolvedValue([
        { zone: DeliveryZone.ZONE_A, fee: 600, free_above: 60000, estimated_days_min: 1, estimated_days_max: 2 },
      ]);
      const result = await service.zones();
      expect(result).toHaveLength(4);
      const a = result.find((z) => z.zone === DeliveryZone.ZONE_A)!;
      expect(a.fee_sdg).toBe(600);
      expect(a.free_above_sdg).toBe(60000);
      expect(a.name_ar).toBe('الخرطوم');
      expect(a.districts_en).toContain('Khartoum 2');
    });

    it('falls back to defaults when DB has no row', async () => {
      prisma.deliveryZoneFee.findMany.mockResolvedValue([]);
      const result = await service.zones();
      const b = result.find((z) => z.zone === DeliveryZone.ZONE_B)!;
      expect(b.fee_sdg).toBe(800);
    });
  });

  describe('calculateFee', () => {
    beforeEach(() => {
      prisma.deliveryZoneFee.findUnique.mockResolvedValue({
        zone: DeliveryZone.ZONE_A,
        fee: 500,
        free_above: 50000,
        estimated_days_min: 1,
        estimated_days_max: 2,
      });
    });

    it('charges the fee when total is below threshold', async () => {
      const result = await service.calculateFee(DeliveryZone.ZONE_A, 10000);
      expect(result.fee_sdg).toBe(500);
      expect(result.free_delivery).toBe(false);
    });

    it('returns free delivery when total meets the threshold', async () => {
      const result = await service.calculateFee(DeliveryZone.ZONE_A, 60000);
      expect(result.fee_sdg).toBe(0);
      expect(result.free_delivery).toBe(true);
    });

    it('rejects unknown zones', async () => {
      await expect(service.calculateFee('ZONE_X' as DeliveryZone, 1000)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('rejects negative totals', async () => {
      await expect(service.calculateFee(DeliveryZone.ZONE_A, -10)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });
});
