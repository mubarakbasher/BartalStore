import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { DeliveryZone, Language } from '@bartal/shared';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/users.dto';
import { PrismaService } from '../../prisma/prisma.service';

jest.mock('../../common/utils/password', () => ({
  hashPassword: jest.fn(async (pwd: string) => `hashed:${pwd}`),
  comparePassword: jest.fn(async (pwd: string, hash: string) => hash === `hashed:${pwd}`),
}));

const CONFIG_VALUES: Record<string, unknown> = {
  'jwt.bcryptRounds': 4,
};

function makeUser(overrides: Partial<{ id: string; phone: string; email: string | null; is_active: boolean }> = {}) {
  return {
    id: overrides.id ?? 'u1',
    phone: overrides.phone ?? '+249912345678',
    name: 'Mohammed Osman',
    email: overrides.email === undefined ? 'mo@example.sd' : overrides.email,
    password_hash: 'hashed:Password123',
    is_verified: true,
    email_verified: false,
    national_id_status: 'UNVERIFIED' as const,
    date_of_birth: null,
    gender: null,
    loyalty_points: 0,
    is_active: overrides.is_active ?? true,
    role: 'CUSTOMER' as const,
    language: 'AR' as const,
    fcm_token: null,
    last_login_at: null,
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
  };
}

function makeAddress(overrides: Partial<{ id: string; user_id: string; is_default: boolean }> = {}) {
  return {
    id: overrides.id ?? 'a1',
    user_id: overrides.user_id ?? 'u1',
    label: 'Home',
    full_name: 'Mohammed Osman',
    phone: '+249912345678',
    secondary_phone: null,
    district: 'Al-Riyadh',
    street: 'Block 32',
    landmark: 'Next to Al-Nur Mosque',
    delivery_notes: null,
    zone: 'ZONE_B' as DeliveryZone,
    is_default: overrides.is_default ?? false,
    created_at: new Date('2026-01-01'),
  };
}

describe('UsersService', () => {
  let service: UsersService;
  let prisma: {
    user: { findUnique: jest.Mock; update: jest.Mock };
    order: { count: jest.Mock; aggregate: jest.Mock };
    address: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
      delete: jest.Mock;
    };
    refreshToken: { updateMany: jest.Mock };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      user: { findUnique: jest.fn(), update: jest.fn() },
      order: {
        count: jest.fn().mockResolvedValue(0),
        aggregate: jest.fn().mockResolvedValue({ _sum: { total: null } }),
      },
      address: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
      },
      refreshToken: { updateMany: jest.fn() },
      $transaction: jest.fn(async (ops: Promise<unknown>[]) => Promise.all(ops)),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: ConfigService,
          useValue: { get: jest.fn((key: string) => CONFIG_VALUES[key]) },
        },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
  });

  describe('getProfile', () => {
    it('returns the public user shape', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      const result = await service.getProfile('u1');
      expect(result).toMatchObject({
        id: 'u1',
        phone: '+249912345678',
        name: 'Mohammed Osman',
        is_verified: true,
      });
      expect(result).not.toHaveProperty('password_hash');
    });

    it('throws USER_NOT_FOUND for missing or inactive users', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getProfile('missing')).rejects.toBeInstanceOf(NotFoundException);

      prisma.user.findUnique.mockResolvedValue(makeUser({ is_active: false }));
      await expect(service.getProfile('u1')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('enriches the profile with computed order stats + new profile fields', async () => {
      prisma.user.findUnique.mockResolvedValue(
        makeUser({ id: 'u1' }),
      );
      prisma.order.count.mockResolvedValue(3);
      prisma.order.aggregate.mockResolvedValue({ _sum: { total: new Prisma.Decimal(127500) } });
      const result = await service.getProfile('u1');
      expect(result).toMatchObject({
        orders_count: 3,
        lifetime_spend: 127500,
        loyalty_points: 0,
        email_verified: false,
        national_id_status: 'UNVERIFIED',
      });
    });
  });

  describe('updateProfile', () => {
    it('applies only the provided fields', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(makeUser());
      prisma.user.update.mockResolvedValue(makeUser({ id: 'u1' }));
      await service.updateProfile('u1', { name: 'New Name', language: Language.EN });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u1' },
        data: { name: 'New Name', language: 'EN' },
      });
    });

    it('rejects email collisions with another account', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(makeUser({ email: 'old@example.sd' }))
        .mockResolvedValueOnce(makeUser({ id: 'other', email: 'new@example.sd' }));
      await expect(
        service.updateProfile('u1', { email: 'new@example.sd' }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('allows the same email belonging to the same user (no-op uniqueness)', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(makeUser({ email: 'mo@example.sd' }))
        .mockResolvedValueOnce(makeUser({ id: 'u1', email: 'mo@example.sd' }));
      prisma.user.update.mockResolvedValue(makeUser({ email: 'mo@example.sd' }));
      const result = await service.updateProfile('u1', { email: 'mo@example.sd' });
      expect(result.email).toBe('mo@example.sd');
    });
  });

  describe('changePassword', () => {
    it('rehashes + revokes all refresh tokens on success', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.user.update.mockResolvedValue(makeUser());
      prisma.refreshToken.updateMany.mockResolvedValue({ count: 2 });

      const result = await service.changePassword('u1', {
        currentPassword: 'Password123',
        newPassword: 'NewPassword123',
      });

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { user_id: 'u1', revoked: false },
        data: { revoked: true },
      });
      expect(result).toEqual({ success: true });
    });

    it('throws INVALID_CURRENT_PASSWORD when the current password is wrong', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      await expect(
        service.changePassword('u1', {
          currentPassword: 'wrong',
          newPassword: 'NewPassword123',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteAccount', () => {
    it('soft-deletes and revokes refresh tokens', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.user.update.mockResolvedValue(makeUser({ is_active: false }));
      prisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.deleteAccount('u1');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u1' },
        data: { is_active: false },
      });
      expect(prisma.refreshToken.updateMany).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });
  });

  describe('updateFcmToken', () => {
    it('sets the token on the current user', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.user.update.mockResolvedValue({ fcm_token: 'tok-xyz' });
      const result = await service.updateFcmToken('u1', 'tok-xyz');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u1' },
        data: { fcm_token: 'tok-xyz' },
        select: { fcm_token: true },
      });
      expect(result).toEqual({ fcm_token: 'tok-xyz' });
    });

    it('clears the token when null is passed', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser());
      prisma.user.update.mockResolvedValue({ fcm_token: null });
      const result = await service.updateFcmToken('u1', null);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u1' },
        data: { fcm_token: null },
        select: { fcm_token: true },
      });
      expect(result).toEqual({ fcm_token: null });
    });

    it('throws USER_NOT_FOUND for inactive users', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser({ is_active: false }));
      await expect(service.updateFcmToken('u1', 'tok')).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('listAddresses', () => {
    it('orders by default desc, then created_at desc', async () => {
      prisma.address.findMany.mockResolvedValue([makeAddress({ is_default: true })]);
      await service.listAddresses('u1');
      expect(prisma.address.findMany).toHaveBeenCalledWith({
        where: { user_id: 'u1' },
        orderBy: [{ is_default: 'desc' }, { created_at: 'desc' }],
      });
    });
  });

  describe('createAddress', () => {
    const dto = {
      label: 'Home',
      full_name: 'Mohammed Osman',
      phone: '+249912345678',
      district: 'Al-Riyadh',
      landmark: 'Next to Al-Nur Mosque',
      zone: DeliveryZone.ZONE_B,
    };

    it("auto-promotes the user's first address to default even when not requested", async () => {
      prisma.address.count.mockResolvedValue(0);
      prisma.address.create.mockResolvedValue(makeAddress({ is_default: true }));

      const result = await service.createAddress('u1', dto);
      expect(prisma.address.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ user_id: 'u1', is_default: true }),
      });
      // No defaults to unset on the first one — should not run a transaction.
      expect(prisma.$transaction).not.toHaveBeenCalled();
      expect(result.is_default).toBe(true);
    });

    it('unsets other defaults inside a transaction when is_default=true', async () => {
      prisma.address.count.mockResolvedValue(2);
      prisma.address.create.mockResolvedValue(makeAddress({ is_default: true }));
      prisma.address.updateMany.mockResolvedValue({ count: 1 });

      await service.createAddress('u1', { ...dto, is_default: true });
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.address.updateMany).toHaveBeenCalledWith({
        where: { user_id: 'u1', is_default: true },
        data: { is_default: false },
      });
    });

    it('creates non-default without touching the transaction path', async () => {
      prisma.address.count.mockResolvedValue(2);
      prisma.address.create.mockResolvedValue(makeAddress({ is_default: false }));

      await service.createAddress('u1', dto);
      expect(prisma.$transaction).not.toHaveBeenCalled();
      expect(prisma.address.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ is_default: false }),
      });
    });
  });

  describe('updateAddress', () => {
    it('updates only the provided fields', async () => {
      prisma.address.findFirst.mockResolvedValue(makeAddress({ is_default: false }));
      prisma.address.update.mockResolvedValue(makeAddress());

      await service.updateAddress('u1', 'a1', { label: 'Office' });
      expect(prisma.address.update).toHaveBeenCalledWith({
        where: { id: 'a1' },
        data: { label: 'Office' },
      });
    });

    it('promotes to default inside a transaction when toggling is_default true', async () => {
      prisma.address.findFirst.mockResolvedValue(makeAddress({ is_default: false }));
      prisma.address.update.mockResolvedValue(makeAddress({ is_default: true }));
      prisma.address.updateMany.mockResolvedValue({ count: 1 });

      await service.updateAddress('u1', 'a1', { is_default: true });
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.address.updateMany).toHaveBeenCalledWith({
        where: { user_id: 'u1', is_default: true, id: { not: 'a1' } },
        data: { is_default: false },
      });
    });

    it('rejects ownership mismatch with ADDRESS_NOT_FOUND', async () => {
      prisma.address.findFirst.mockResolvedValue(null);
      await expect(
        service.updateAddress('attacker', 'a1', { label: 'X' }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.address.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteAddress', () => {
    it('deletes when owned and not linked to orders', async () => {
      prisma.address.findFirst.mockResolvedValue(makeAddress());
      prisma.address.delete.mockResolvedValue({});
      const result = await service.deleteAddress('u1', 'a1');
      expect(prisma.address.delete).toHaveBeenCalledWith({ where: { id: 'a1' } });
      expect(result).toEqual({ success: true });
    });

    it('rethrows P2003 (FK violation from orders) as ADDRESS_HAS_ORDERS 409', async () => {
      prisma.address.findFirst.mockResolvedValue(makeAddress());
      prisma.address.delete.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('FK', { code: 'P2003', clientVersion: 'x' }),
      );
      await expect(service.deleteAddress('u1', 'a1')).rejects.toBeInstanceOf(ConflictException);
    });

    it('rejects ownership mismatch', async () => {
      prisma.address.findFirst.mockResolvedValue(null);
      await expect(service.deleteAddress('attacker', 'a1')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('setDefaultAddress', () => {
    it('unsets other defaults + flips this one in a transaction', async () => {
      prisma.address.findFirst.mockResolvedValue(makeAddress({ is_default: false }));
      prisma.address.update.mockResolvedValue(makeAddress({ is_default: true }));
      prisma.address.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.setDefaultAddress('u1', 'a1');
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.address.updateMany).toHaveBeenCalledWith({
        where: { user_id: 'u1', is_default: true, id: { not: 'a1' } },
        data: { is_default: false },
      });
      expect(result.is_default).toBe(true);
    });

    it('rejects ownership mismatch', async () => {
      prisma.address.findFirst.mockResolvedValue(null);
      await expect(service.setDefaultAddress('attacker', 'a1')).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});

describe('UpdateProfileDto validation', () => {
  it('accepts explicit null date_of_birth (clear-the-field path)', async () => {
    const dto = plainToInstance(UpdateProfileDto, { date_of_birth: null });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('accepts a valid ISO date_of_birth', async () => {
    const dto = plainToInstance(UpdateProfileDto, { date_of_birth: '1995-04-12' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects a malformed date_of_birth', async () => {
    const dto = plainToInstance(UpdateProfileDto, { date_of_birth: 'not-a-date' });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'date_of_birth')).toBe(true);
  });
});
