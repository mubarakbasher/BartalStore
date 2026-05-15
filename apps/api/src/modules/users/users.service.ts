import { Injectable, NotImplementedException } from '@nestjs/common';
import type {
  ChangePasswordDto,
  CreateAddressDto,
  UpdateAddressDto,
  UpdateProfileDto,
} from './dto/users.dto';

/** Users service — scaffolded per PRD §10.3 /api/users. */
@Injectable()
export class UsersService {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  async getProfile(_userId: string) { throw new NotImplementedException(); }
  async updateProfile(_userId: string, _dto: UpdateProfileDto) { throw new NotImplementedException(); }
  async changePassword(_userId: string, _dto: ChangePasswordDto) { throw new NotImplementedException(); }
  async deleteAccount(_userId: string) { throw new NotImplementedException(); }

  async listAddresses(_userId: string) { throw new NotImplementedException(); }
  async createAddress(_userId: string, _dto: CreateAddressDto) { throw new NotImplementedException(); }
  async updateAddress(_userId: string, _addressId: string, _dto: UpdateAddressDto) { throw new NotImplementedException(); }
  async deleteAddress(_userId: string, _addressId: string) { throw new NotImplementedException(); }
  async setDefaultAddress(_userId: string, _addressId: string) { throw new NotImplementedException(); }
  /* eslint-enable */
}
