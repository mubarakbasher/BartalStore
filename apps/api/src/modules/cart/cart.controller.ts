import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, type AuthedUser } from '../../common/decorators/current-user.decorator';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart.dto';
import { CartService } from './cart.service';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get() @ApiOperation({ summary: 'Get current cart' })
  get(@CurrentUser() u: AuthedUser) { return this.cart.get(u.id); }

  @Post('items') @ApiOperation({ summary: 'Add item to cart' })
  add(@CurrentUser() u: AuthedUser, @Body() dto: AddCartItemDto) {
    return this.cart.addItem(u.id, dto);
  }

  @Put('items/:productId') @ApiOperation({ summary: 'Update item quantity' })
  update(
    @CurrentUser() u: AuthedUser,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cart.updateItem(u.id, productId, dto);
  }

  @Delete('items/:productId') @ApiOperation({ summary: 'Remove item from cart' })
  remove(@CurrentUser() u: AuthedUser, @Param('productId') productId: string) {
    return this.cart.removeItem(u.id, productId);
  }

  @Delete() @ApiOperation({ summary: 'Clear the cart' })
  clear(@CurrentUser() u: AuthedUser) { return this.cart.clear(u.id); }
}
