import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
}
