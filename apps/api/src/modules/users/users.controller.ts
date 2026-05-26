import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, type AuthedUser } from '../../common/decorators/current-user.decorator';
import {
  ChangePasswordDto,
  CreateAddressDto,
  UpdateAddressDto,
  UpdateProfileDto,
} from './dto/users.dto';
import { UpdateFcmTokenDto } from './dto/update-fcm-token.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me') @ApiOperation({ summary: 'Get current user profile' })
  me(@CurrentUser() u: AuthedUser) { return this.users.getProfile(u.id); }

  @Put('me') @ApiOperation({ summary: 'Update profile' })
  updateMe(@CurrentUser() u: AuthedUser, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(u.id, dto);
  }

  @Put('me/fcm-token') @ApiOperation({ summary: 'Register / clear FCM push token' })
  updateFcmToken(@CurrentUser() u: AuthedUser, @Body() dto: UpdateFcmTokenDto) {
    return this.users.updateFcmToken(u.id, dto.fcm_token);
  }

  @Post('me/change-password') @ApiOperation({ summary: 'Change password' })
  changePassword(@CurrentUser() u: AuthedUser, @Body() dto: ChangePasswordDto) {
    return this.users.changePassword(u.id, dto);
  }

  @Delete('me') @ApiOperation({ summary: 'Delete account' })
  deleteMe(@CurrentUser() u: AuthedUser) { return this.users.deleteAccount(u.id); }

  @Get('me/addresses') @ApiOperation({ summary: 'List user addresses' })
  listAddresses(@CurrentUser() u: AuthedUser) { return this.users.listAddresses(u.id); }

  @Post('me/addresses') @ApiOperation({ summary: 'Add a delivery address (landmark required)' })
  addAddress(@CurrentUser() u: AuthedUser, @Body() dto: CreateAddressDto) {
    return this.users.createAddress(u.id, dto);
  }

  @Put('me/addresses/:id') @ApiOperation({ summary: 'Update an address' })
  updateAddress(
    @CurrentUser() u: AuthedUser,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.users.updateAddress(u.id, id, dto);
  }

  @Delete('me/addresses/:id') @ApiOperation({ summary: 'Delete an address' })
  deleteAddress(@CurrentUser() u: AuthedUser, @Param('id') id: string) {
    return this.users.deleteAddress(u.id, id);
  }

  @Put('me/addresses/:id/default') @ApiOperation({ summary: 'Set address as default' })
  setDefault(@CurrentUser() u: AuthedUser, @Param('id') id: string) {
    return this.users.setDefaultAddress(u.id, id);
  }
}
