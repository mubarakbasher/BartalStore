import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import {
  ListProductsQueryDto,
  SearchProductsQueryDto,
} from './dto/products.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Public() @Get() @ApiOperation({ summary: 'List products (paginated, filterable)' })
  list(@Query() q: ListProductsQueryDto) { return this.products.list(q); }

  @Public() @Get('search') @ApiOperation({ summary: 'Full-text search AR + EN' })
  search(@Query() q: SearchProductsQueryDto) { return this.products.search(q); }

  @Public() @Get(':id') @ApiOperation({ summary: 'Product detail' })
  detail(@Param('id') id: string) { return this.products.detail(id); }
}
