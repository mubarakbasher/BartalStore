import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, type Address, type User } from '@prisma/client';
import { OrderStatus } from '@bartal/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { comparePassword, hashPassword } from '../../common/utils/password';
import type { PublicUser } from '../auth/auth.service';
import type {
  ChangePasswordDto,
  CreateAddressDto,
  UpdateAddressDto,
  UpdateProfileDto,
} from './dto/users.dto';

/**
 * Internal Date-typed profile shape. The JSON wire format clients consume
 * is `UserProfileView` in `@bartal/shared` (dates serialized to ISO
 * strings) — keep the two in sync when adding fields.
 */
export interface UserProfileView extends PublicUser {
  orders_count: number;
  lifetime_spend: number;
}

function publicUserShape(user: User): PublicUser {
  return {
    id: user.id,
    phone: user.phone,
    name: user.name,
    email: user.email,
    role: user.role,
    language: user.language,
    is_verified: user.is_verified,
    email_verified: user.email_verified,
    national_id_status: user.national_id_status,
    date_of_birth: user.date_of_birth,
    gender: user.gender,
    loyalty_points: user.loyalty_points,
    created_at: user.created_at,
  };
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private get bcryptRounds(): number {
    return this.config.get<number>('jwt.bcryptRounds') ?? 12;
  }

  // ───────────────────────────────────────────────────────────────────
  // Profile
  // ───────────────────────────────────────────────────────────────────

  async getProfile(userId: string): Promise<UserProfileView> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.is_active) throw this.userNotFoundError();
    return this.withStats(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserProfileView> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.is_active) throw this.userNotFoundError();

    if (dto.email !== undefined && dto.email !== user.email) {
      const taken = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (taken && taken.id !== userId) {
        throw new ConflictException({
          code: 'EMAIL_EXISTS',
          message_en: 'This email is already used by another account.',
          message_ar: 'هذا البريد الإلكتروني مستخدم في حساب آخر.',
        });
      }
    }

    const data: Prisma.UserUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.language !== undefined) data.language = dto.language;
    if (dto.fcm_token !== undefined) data.fcm_token = dto.fcm_token;
    if (dto.date_of_birth !== undefined) {
      data.date_of_birth = dto.date_of_birth === null ? null : new Date(dto.date_of_birth);
    }
    if (dto.gender !== undefined) data.gender = dto.gender;

    const updated = await this.prisma.user.update({ where: { id: userId }, data });
    return this.withStats(updated);
  }

  /**
   * Enriches a user row with computed order stats. `lifetime_spend` mirrors
   * the admin customer-detail aggregate (excludes CANCELLED + REFUNDED).
   */
  private async withStats(user: User): Promise<UserProfileView> {
    const [count, spend] = await Promise.all([
      this.prisma.order.count({
        where: { user_id: user.id, status: { notIn: [OrderStatus.CANCELLED, OrderStatus.REFUNDED] } },
      }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { user_id: user.id, status: { notIn: [OrderStatus.CANCELLED, OrderStatus.REFUNDED] } },
      }),
    ]);
    return {
      ...publicUserShape(user),
      orders_count: count,
      lifetime_spend: spend._sum.total ? Number(spend._sum.total) : 0,
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<{ success: true }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.is_active) throw this.userNotFoundError();

    const ok = await comparePassword(dto.currentPassword, user.password_hash);
    if (!ok) {
      throw new UnauthorizedException({
        code: 'INVALID_CURRENT_PASSWORD',
        message_en: 'Your current password is incorrect.',
        message_ar: 'كلمة المرور الحالية غير صحيحة.',
      });
    }

    const newHash = await hashPassword(dto.newPassword, this.bcryptRounds);

    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: userId }, data: { password_hash: newHash } }),
      this.prisma.refreshToken.updateMany({
        where: { user_id: userId, revoked: false },
        data: { revoked: true },
      }),
    ]);

    return { success: true };
  }

  async updateFcmToken(
    userId: string,
    token: string | null,
  ): Promise<{ fcm_token: string | null }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.is_active) throw this.userNotFoundError();
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { fcm_token: token },
      select: { fcm_token: true },
    });
    return { fcm_token: updated.fcm_token };
  }

  async deleteAccount(userId: string): Promise<{ success: true }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.is_active) throw this.userNotFoundError();

    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: userId }, data: { is_active: false } }),
      this.prisma.refreshToken.updateMany({
        where: { user_id: userId, revoked: false },
        data: { revoked: true },
      }),
    ]);

    return { success: true };
  }

  // ───────────────────────────────────────────────────────────────────
  // Addresses
  // ───────────────────────────────────────────────────────────────────

  async listAddresses(userId: string): Promise<Address[]> {
    return this.prisma.address.findMany({
      where: { user_id: userId },
      orderBy: [{ is_default: 'desc' }, { created_at: 'desc' }],
    });
  }

  async createAddress(userId: string, dto: CreateAddressDto): Promise<Address> {
    const existingCount = await this.prisma.address.count({ where: { user_id: userId } });
    // First address auto-promotes to default regardless of dto.
    const shouldBeDefault = existingCount === 0 ? true : !!dto.is_default;

    const data: Prisma.AddressUncheckedCreateInput = {
      user_id: userId,
      label: dto.label,
      full_name: dto.full_name,
      phone: dto.phone,
      secondary_phone: dto.secondary_phone ?? null,
      district: dto.district,
      street: dto.street ?? null,
      landmark: dto.landmark,
      delivery_notes: dto.delivery_notes ?? null,
      zone: dto.zone,
      is_default: shouldBeDefault,
    };

    if (shouldBeDefault && existingCount > 0) {
      const [, created] = await this.prisma.$transaction([
        this.prisma.address.updateMany({
          where: { user_id: userId, is_default: true },
          data: { is_default: false },
        }),
        this.prisma.address.create({ data }),
      ]);
      return created;
    }

    return this.prisma.address.create({ data });
  }

  async updateAddress(
    userId: string,
    addressId: string,
    dto: UpdateAddressDto,
  ): Promise<Address> {
    const existing = await this.findOwnedAddress(userId, addressId);

    const data: Prisma.AddressUpdateInput = {};
    if (dto.label !== undefined) data.label = dto.label;
    if (dto.full_name !== undefined) data.full_name = dto.full_name;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.secondary_phone !== undefined) data.secondary_phone = dto.secondary_phone;
    if (dto.district !== undefined) data.district = dto.district;
    if (dto.street !== undefined) data.street = dto.street;
    if (dto.landmark !== undefined) data.landmark = dto.landmark;
    if (dto.delivery_notes !== undefined) data.delivery_notes = dto.delivery_notes;
    if (dto.zone !== undefined) data.zone = dto.zone;

    const promoteToDefault = dto.is_default === true && !existing.is_default;
    if (dto.is_default !== undefined) data.is_default = dto.is_default;

    if (promoteToDefault) {
      const [, updated] = await this.prisma.$transaction([
        this.prisma.address.updateMany({
          where: { user_id: userId, is_default: true, id: { not: addressId } },
          data: { is_default: false },
        }),
        this.prisma.address.update({ where: { id: addressId }, data }),
      ]);
      return updated;
    }

    return this.prisma.address.update({ where: { id: addressId }, data });
  }

  async deleteAddress(userId: string, addressId: string): Promise<{ success: true }> {
    await this.findOwnedAddress(userId, addressId);
    try {
      await this.prisma.address.delete({ where: { id: addressId } });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2003'
      ) {
        throw new ConflictException({
          code: 'ADDRESS_HAS_ORDERS',
          message_en: 'This address is attached to past orders and cannot be deleted.',
          message_ar: 'هذا العنوان مرتبط بطلبات سابقة ولا يمكن حذفه.',
        });
      }
      throw err;
    }
    // Intentional: deletion does NOT auto-promote another address to default.
    return { success: true };
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<Address> {
    await this.findOwnedAddress(userId, addressId);

    const [, updated] = await this.prisma.$transaction([
      this.prisma.address.updateMany({
        where: { user_id: userId, is_default: true, id: { not: addressId } },
        data: { is_default: false },
      }),
      this.prisma.address.update({
        where: { id: addressId },
        data: { is_default: true },
      }),
    ]);

    return updated;
  }

  // ───────────────────────────────────────────────────────────────────
  // Internals
  // ───────────────────────────────────────────────────────────────────

  /**
   * Single-query ownership-safe lookup. Using `findFirst({ id, user_id })`
   * (not `findUnique` then code-side check) avoids leaking address-id
   * existence via response-timing differences.
   */
  private async findOwnedAddress(userId: string, addressId: string): Promise<Address> {
    const row = await this.prisma.address.findFirst({
      where: { id: addressId, user_id: userId },
    });
    if (!row) {
      throw new NotFoundException({
        code: 'ADDRESS_NOT_FOUND',
        message_en: 'Address not found.',
        message_ar: 'العنوان غير موجود.',
      });
    }
    return row;
  }

  private userNotFoundError(): NotFoundException {
    return new NotFoundException({
      code: 'USER_NOT_FOUND',
      message_en: 'User not found.',
      message_ar: 'المستخدم غير موجود.',
    });
  }
}
