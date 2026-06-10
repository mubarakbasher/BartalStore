import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import {
  CurrentUser,
  type AuthedUser,
} from '../../common/decorators/current-user.decorator';
import { SignedUrlBodyDto, UploadReceiptFormDto } from './dto/storage.dto';
import { imageMimeFilter } from './helpers/keys';
import { StorageService } from './storage.service';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

@ApiTags('storage')
@ApiBearerAuth()
@Controller('storage')
export class StorageController {
  constructor(private readonly storage: StorageService) {}

  @Post('products')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_UPLOAD_BYTES },
      fileFilter: imageMimeFilter,
    }),
  )
  @ApiOperation({ summary: 'Upload a product image (admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  uploadProduct(@UploadedFile() file: Express.Multer.File) {
    return this.storage.uploadProductImage(file);
  }

  @Post('receipts')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_UPLOAD_BYTES },
      fileFilter: imageMimeFilter,
    }),
  )
  @ApiOperation({ summary: 'Upload a bank-transfer receipt for one of your orders' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        order_id: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
      required: ['order_id', 'file'],
    },
  })
  uploadReceipt(
    @CurrentUser() user: AuthedUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadReceiptFormDto,
  ) {
    return this.storage.uploadReceiptForUser(user.id, dto.order_id, file);
  }

  @Post('receipts/signed-url')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Return a 1-hour signed read URL for a receipt key (admin only)' })
  signedUrl(@Body() dto: SignedUrlBodyDto) {
    return this.storage.signedReceiptReadUrl(dto.key);
  }

  /**
   * Dev-only static serve for stub-mode uploads. Active ONLY when R2 is stubbed
   * (no credentials) so receipts/product images are viewable locally without R2.
   * Returns 404 in production (real images come from R2/CDN). Public so `<img>`
   * tags from the admin/web origins can load it directly.
   */
  @Public()
  @Get('dev/*key')
  @ApiOperation({ summary: 'Dev-only: serve a stub-stored image (stub mode only)' })
  async devFile(@Req() req: Request, @Res() res: Response): Promise<void> {
    if (!this.storage.isStubMode) {
      res.status(404).end();
      return;
    }
    // Express 5 named wildcards expose the match as an array of segments.
    const match = (req.params as Record<string, string | string[]>).key;
    const key = Array.isArray(match) ? match.join('/') : (match ?? '');
    const buf = await this.storage.readDevFile(key);
    if (!buf) {
      res.status(404).end();
      return;
    }
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'private, max-age=3600');
    res.end(buf);
  }
}
