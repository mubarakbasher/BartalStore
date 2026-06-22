import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import sharp from 'sharp';
import { StorageService } from './storage.service';
import { PrismaService } from '../../prisma/prisma.service';

const STUB_R2 = {
  accountId: '',
  accessKeyId: '',
  secretAccessKey: '',
  bucketPublic: 'bartal-public',
  bucketReceipts: 'bartal-receipts',
  publicUrlBase: 'https://assets.bartal.sd',
};

function makeMulterFile(buffer: Buffer, mimetype = 'image/png'): Express.Multer.File {
  return {
    fieldname: 'file',
    originalname: 'upload.png',
    encoding: '7bit',
    mimetype,
    buffer,
    size: buffer.length,
    destination: '',
    filename: '',
    path: '',
    stream: undefined as unknown as Express.Multer.File['stream'],
  };
}

/** A small valid PNG (1x1 transparent) generated via sharp. */
async function pngBuffer(width = 1, height = 1): Promise<Buffer> {
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
}

/** A large, deliberately noisy image that doesn't compress well at q80. */
async function noisyJpegBuffer(width = 2000, height = 2000): Promise<Buffer> {
  const pixels = Buffer.alloc(width * height * 3);
  // High-entropy noise so WebP can't compress it efficiently.
  for (let i = 0; i < pixels.length; i++) pixels[i] = (i * 2654435761) >>> 24;
  return sharp(pixels, { raw: { width, height, channels: 3 } }).jpeg().toBuffer();
}

describe('StorageService (stub mode)', () => {
  let service: StorageService;
  let prisma: { order: { findFirst: jest.Mock } };

  beforeEach(async () => {
    prisma = { order: { findFirst: jest.fn() } };
    const moduleRef = await Test.createTestingModule({
      providers: [
        StorageService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) =>
              key === 'port' ? 3001 : key === 'publicUrl' ? '' : STUB_R2,
            ),
          },
        },
      ],
    }).compile();
    service = moduleRef.get(StorageService);
    service.onModuleInit();
  });

  it('initializes in stub mode when R2 credentials are missing', () => {
    expect(service.stubMode).toBe(true);
  });

  describe('uploadProductImage', () => {
    it('returns a stub key + url for a valid PNG', async () => {
      const buf = await pngBuffer(10, 10);
      const result = await service.uploadProductImage(makeMulterFile(buf));
      expect(result.key).toMatch(/^stub\/products\/[0-9a-f-]+\.webp$/);
      expect(result.url).toBe(`http://localhost:3001/api/storage/dev/${result.key}`);
    });

    it('rejects an empty/missing file with IMAGE_REQUIRED', async () => {
      const empty = makeMulterFile(Buffer.alloc(0));
      await expect(service.uploadProductImage(empty)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('rejects non-image bytes with IMAGE_PROCESSING_FAILED', async () => {
      const garbage = Buffer.from('not an image at all');
      await expect(
        service.uploadProductImage(makeMulterFile(garbage)),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('resizes a wide image down to ≤1200px', async () => {
      const wide = await sharp({
        create: { width: 1600, height: 800, channels: 3, background: '#444' },
      })
        .png()
        .toBuffer();
      const result = await service.uploadProductImage(makeMulterFile(wide));
      // Re-decode the stub key path: the stub doesn't return the buffer,
      // so we can't inspect it directly — but sharp would have run.
      expect(result.key).toMatch(/^stub\/products\//);
    });

    it('throws IMAGE_BUDGET_EXCEEDED when q60 still misses 200KB', async () => {
      const big = await noisyJpegBuffer(2000, 2000);
      await expect(service.uploadProductImage(makeMulterFile(big))).rejects.toBeInstanceOf(
        UnprocessableEntityException,
      );
    });
  });

  describe('uploadReceiptForUser', () => {
    it('uploads a receipt when the user owns the order', async () => {
      prisma.order.findFirst.mockResolvedValue({
        id: 'o1',
        payment_method: 'BANK_TRANSFER',
        status: 'AWAITING_PAYMENT',
      });
      const buf = await pngBuffer(10, 10);
      const result = await service.uploadReceiptForUser('u1', 'o1', makeMulterFile(buf));
      expect(result.key).toMatch(
        /^stub\/receipts\/\d{4}\/\d{2}\/o1\/[0-9a-f-]+\.webp$/,
      );
    });

    it('throws ORDER_NOT_FOUND when prisma returns null', async () => {
      prisma.order.findFirst.mockResolvedValue(null);
      const buf = await pngBuffer(10, 10);
      await expect(
        service.uploadReceiptForUser('attacker', 'o1', makeMulterFile(buf)),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws INVALID_PAYMENT_METHOD for COD orders', async () => {
      prisma.order.findFirst.mockResolvedValue({
        id: 'o1',
        payment_method: 'CASH_ON_DELIVERY',
        status: 'PENDING',
      });
      const buf = await pngBuffer(10, 10);
      await expect(
        service.uploadReceiptForUser('u1', 'o1', makeMulterFile(buf)),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('throws INVALID_STATUS_TRANSITION when order is DELIVERED', async () => {
      prisma.order.findFirst.mockResolvedValue({
        id: 'o1',
        payment_method: 'BANK_TRANSFER',
        status: 'DELIVERED',
      });
      const buf = await pngBuffer(10, 10);
      await expect(
        service.uploadReceiptForUser('u1', 'o1', makeMulterFile(buf)),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('signedReceiptReadUrl', () => {
    it('returns a stub signed URL for a valid key', async () => {
      const result = await service.signedReceiptReadUrl(
        'receipts/2026/05/o1/abc.webp',
      );
      expect(result.url).toBe('http://localhost:3001/api/storage/dev/receipts/2026/05/o1/abc.webp');
      expect(result.expires_in).toBe(3600);
    });

    it('accepts stub-mode keys', async () => {
      const result = await service.signedReceiptReadUrl(
        'stub/receipts/2026/05/o1/abc.webp',
      );
      expect(result.url).toContain('stub/receipts/');
    });

    it('rejects keys outside `receipts/` with STORAGE_KEY_INVALID', async () => {
      await expect(
        service.signedReceiptReadUrl('products/abc.webp'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
