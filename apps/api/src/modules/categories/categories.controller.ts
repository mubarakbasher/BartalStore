import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { CategoriesService } from './categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Public() @Get() @ApiOperation({ summary: 'Category tree' })
  tree() { return this.categories.tree(); }

  @Public() @Get(':id') @ApiOperation({ summary: 'Category detail' })
  detail(@Param('id') id: string) { return this.categories.detail(id); }

  @Public() @Get(':id/products') @ApiOperation({ summary: 'Products in category' })
  products(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.categories.productsIn(
      id,
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
    );
  }
}
