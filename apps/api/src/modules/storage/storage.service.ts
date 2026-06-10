import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import type { AppConfig } from '../../config/configuration';
import { PrismaService } from '../../prisma/prisma.service';
import {
  bannerKey,
  productKey,
  receiptKey,
  stubBannerKey,
  stubProductKey,
  stubReceiptKey,
} from './helpers/keys';

const MAX_RAW_UPLOAD_BYTES = 10 * 1024 * 1024;
const TARGET_OUTPUT_BYTES = 200 * 1024;
const MAX_WIDTH_PX = 1200;
const SIGNED_URL_TTL_SECONDS = 3600;

interface ProcessedImage {
  data: Buffer;
  bytes: number;
  quality: number;
}

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private client: S3Client | null = null;
  private r2Config!: AppConfig['r2'];
  /** True when R2 credentials are absent — uploads return fake stub keys. */
  stubMode = true;
  /** Dev-only local mirror so stub uploads are viewable without real R2. */
  private devDir = '';
  private devBaseUrl = '';

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  onModuleInit(): void {
    this.r2Config = this.config.get<AppConfig['r2']>('r2')!;
    this.stubMode = !this.r2Config.accessKeyId || !this.r2Config.accountId;
    const port = this.config.get<number>('port') ?? 3001;
    this.devDir = join(process.cwd(), '.dev-storage');
    this.devBaseUrl = `http://localhost:${port}/api/storage/dev`;
    if (this.stubMode) {
      this.logger.warn(
        '[R2:STUB] Storage running in stub mode — uploads return fake keys (no R2 credentials).',
      );
      return;
    }
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${this.r2Config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.r2Config.accessKeyId,
        secretAccessKey: this.r2Config.secretAccessKey,
      },
      forcePathStyle: false,
    });
    this.logger.log('Storage connected to Cloudflare R2');
  }

  // ───────────────────────────────────────────────────────────────────
  // Public methods
  // ───────────────────────────────────────────────────────────────────

  async uploadProductImage(
    file: Express.Multer.File,
  ): Promise<{ key: string; url: string }> {
    this.requireFile(file);
    const processed = await this.processToWebp(file.buffer);
    if (this.stubMode) {
      const key = stubProductKey();
      await this.writeDevFile(key, processed.data);
      this.logger.warn(
        `[R2:STUB] uploadProductImage → ${key} (${processed.bytes}B @ q${processed.quality})`,
      );
      return { key, url: this.devFileUrl(key) };
    }
    const key = productKey();
    await this.putObject(this.r2Config.bucketPublic, key, processed.data);
    const url = this.r2Config.publicUrlBase
      ? `${this.r2Config.publicUrlBase.replace(/\/$/, '')}/${key}`
      : `https://${this.r2Config.bucketPublic}.${this.r2Config.accountId}.r2.cloudflarestorage.com/${key}`;
    return { key, url };
  }

  /**
   * Slice 3b-3: banner image upload. Same sharp + WebP pipeline as
   * `uploadProductImage` — only the R2 key prefix differs (`banners/`),
   * which keeps admin tooling that scans by prefix straightforward.
   */
  async uploadBannerImage(
    file: Express.Multer.File,
  ): Promise<{ key: string; url: string }> {
    this.requireFile(file);
    const processed = await this.processToWebp(file.buffer);
    if (this.stubMode) {
      const key = stubBannerKey();
      await this.writeDevFile(key, processed.data);
      this.logger.warn(
        `[R2:STUB] uploadBannerImage → ${key} (${processed.bytes}B @ q${processed.quality})`,
      );
      return { key, url: this.devFileUrl(key) };
    }
    const key = bannerKey();
    await this.putObject(this.r2Config.bucketPublic, key, processed.data);
    const url = this.r2Config.publicUrlBase
      ? `${this.r2Config.publicUrlBase.replace(/\/$/, '')}/${key}`
      : `https://${this.r2Config.bucketPublic}.${this.r2Config.accountId}.r2.cloudflarestorage.com/${key}`;
    return { key, url };
  }

  async uploadReceiptForUser(
    userId: string,
    orderId: string,
    file: Express.Multer.File,
  ): Promise<{ key: string }> {
    this.requireFile(file);
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, user_id: userId },
      select: { id: true, payment_method: true, status: true },
    });
    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message_en: 'Order not found.',
        message_ar: 'الطلب غير موجود.',
      });
    }
    if (order.payment_method !== 'BANK_TRANSFER') {
      throw new ConflictException({
        code: 'INVALID_PAYMENT_METHOD',
        message_en: 'Receipt upload is only valid for bank-transfer orders.',
        message_ar: 'رفع الإيصال متاح فقط لطلبات الحوالة البنكية.',
      });
    }
    if (order.status !== 'AWAITING_PAYMENT' && order.status !== 'PAYMENT_REJECTED') {
      throw new ConflictException({
        code: 'INVALID_STATUS_TRANSITION',
        message_en: `Cannot upload a receipt for an order in status ${order.status}.`,
        message_ar: 'لا يمكن رفع الإيصال في الحالة الحالية للطلب.',
        from: order.status,
        to: 'RECEIPT_UPLOADED',
      });
    }
    const processed = await this.processToWebp(file.buffer);
    if (this.stubMode) {
      const key = stubReceiptKey(orderId);
      await this.writeDevFile(key, processed.data);
      this.logger.warn(
        `[R2:STUB] uploadReceiptForUser → ${key} (${processed.bytes}B @ q${processed.quality})`,
      );
      return { key };
    }
    const key = receiptKey(orderId);
    await this.putObject(this.r2Config.bucketReceipts, key, processed.data);
    return { key };
  }

  async signedReceiptReadUrl(
    key: string,
  ): Promise<{ url: string; expires_in: number }> {
    if (!key.startsWith('receipts/') && !key.startsWith('stub/receipts/')) {
      throw new BadRequestException({
        code: 'STORAGE_KEY_INVALID',
        message_en: 'Invalid receipt key.',
        message_ar: 'مفتاح الإيصال غير صالح.',
      });
    }
    if (this.stubMode) {
      return {
        url: this.devFileUrl(key),
        expires_in: SIGNED_URL_TTL_SECONDS,
      };
    }
    const url = await getSignedUrl(
      this.client!,
      new GetObjectCommand({ Bucket: this.r2Config.bucketReceipts, Key: key }),
      { expiresIn: SIGNED_URL_TTL_SECONDS },
    );
    return { url, expires_in: SIGNED_URL_TTL_SECONDS };
  }

  // ───────────────────────────────────────────────────────────────────
  // Dev-only local storage (stub mode) — makes stub uploads viewable
  // (admin receipt viewer, product/banner images) without real R2 creds.
  // ───────────────────────────────────────────────────────────────────

  get isStubMode(): boolean {
    return this.stubMode;
  }

  private devFileUrl(key: string): string {
    return `${this.devBaseUrl}/${key}`;
  }

  private async writeDevFile(key: string, data: Buffer): Promise<void> {
    if (process.env.NODE_ENV === 'test') return; // keep unit/e2e runs disk-clean
    try {
      const target = join(this.devDir, key);
      await fs.mkdir(dirname(target), { recursive: true });
      await fs.writeFile(target, data);
    } catch (err) {
      this.logger.warn(`[R2:STUB] failed to write dev file ${key}: ${(err as Error).message}`);
    }
  }

  /** Reads a previously-stubbed file. Returns null on miss or path escape. */
  async readDevFile(key: string): Promise<Buffer | null> {
    const target = normalize(join(this.devDir, key));
    if (!target.startsWith(normalize(this.devDir))) return null; // no escaping devDir
    try {
      return await fs.readFile(target);
    } catch {
      return null;
    }
  }

  // ───────────────────────────────────────────────────────────────────
  // Internals
  // ───────────────────────────────────────────────────────────────────

  private requireFile(file: Express.Multer.File | undefined): asserts file is Express.Multer.File {
    if (!file || !file.buffer || file.buffer.length === 0) {
      throw new BadRequestException({
        code: 'IMAGE_REQUIRED',
        message_en: 'Image file is required.',
        message_ar: 'يجب إرفاق صورة.',
      });
    }
    // Belt + braces — controller's FileInterceptor enforces this too.
    if (file.buffer.length > MAX_RAW_UPLOAD_BYTES) {
      throw new BadRequestException({
        code: 'IMAGE_TOO_LARGE',
        message_en: 'Image must be 10MB or smaller.',
        message_ar: 'يجب ألا يتجاوز حجم الصورة 10 ميغابايت.',
      });
    }
  }

  /**
   * Resize (if >1200px wide) + encode WebP at q80; if output >200KB, retry at q60.
   * Hard-rejects with IMAGE_BUDGET_EXCEEDED if still oversize after q60.
   */
  private async processToWebp(input: Buffer): Promise<ProcessedImage> {
    let pipeline: sharp.Sharp;
    let meta: sharp.Metadata;
    try {
      pipeline = sharp(input, { failOn: 'error' }).rotate();
      meta = await pipeline.metadata();
    } catch {
      throw this.imageProcessingFailed();
    }
    if (!meta.width || !meta.height) throw this.imageProcessingFailed();

    const resized =
      meta.width > MAX_WIDTH_PX
        ? pipeline.resize({ width: MAX_WIDTH_PX, withoutEnlargement: true })
        : pipeline;

    let buf: Buffer;
    try {
      buf = await resized.clone().webp({ quality: 80, effort: 4 }).toBuffer();
    } catch {
      throw this.imageProcessingFailed();
    }
    if (buf.byteLength <= TARGET_OUTPUT_BYTES) {
      return { data: buf, bytes: buf.byteLength, quality: 80 };
    }
    try {
      buf = await resized.clone().webp({ quality: 60, effort: 4 }).toBuffer();
    } catch {
      throw this.imageProcessingFailed();
    }
    if (buf.byteLength <= TARGET_OUTPUT_BYTES) {
      return { data: buf, bytes: buf.byteLength, quality: 60 };
    }
    throw new UnprocessableEntityException({
      code: 'IMAGE_BUDGET_EXCEEDED',
      message_en: 'Image is too detailed to compress under 200KB. Try a smaller image.',
      message_ar: 'لا يمكن ضغط الصورة إلى أقل من ٢٠٠ كيلوبايت. جرّب صورة أصغر.',
    });
  }

  private async putObject(bucket: string, key: string, data: Buffer): Promise<void> {
    try {
      await this.client!.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: data,
          ContentType: 'image/webp',
        }),
      );
    } catch (err) {
      this.logger.error(
        `R2 PUT failed for ${bucket}/${key}: ${err instanceof Error ? err.message : err}`,
      );
      throw new InternalServerErrorException({
        code: 'STORAGE_UPLOAD_FAILED',
        message_en: 'Could not upload image. Please retry.',
        message_ar: 'تعذّر رفع الصورة. حاول مرة أخرى.',
      });
    }
  }

  private imageProcessingFailed(): BadRequestException {
    return new BadRequestException({
      code: 'IMAGE_PROCESSING_FAILED',
      message_en: 'Could not process the image. Please try a different file.',
      message_ar: 'تعذرت معالجة الصورة. يُرجى تجربة ملف آخر.',
    });
  }
}
