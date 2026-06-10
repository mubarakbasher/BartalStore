import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, type AuthedUser } from '../../common/decorators/current-user.decorator';
import { WishlistService } from './wishlist.service';

@ApiTags('wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlist: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'List the current user wishlist' })
  list(@CurrentUser() u: AuthedUser) {
    return this.wishlist.list(u.id);
  }

  @Post(':productId')
  @ApiOperation({ summary: 'Add a product to the wishlist (idempotent)' })
  add(@CurrentUser() u: AuthedUser, @Param('productId') productId: string) {
    return this.wishlist.add(u.id, productId);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove a product from the wishlist (idempotent)' })
  remove(@CurrentUser() u: AuthedUser, @Param('productId') productId: string) {
    return this.wishlist.remove(u.id, productId);
  }
}
