import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import request from 'supertest';
import sharp from 'sharp';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { PrismaService } from '../src/prisma/prisma.service';

const CUSTOMER_PHONE = '+249966665555';
const CUSTOMER_PASSWORD = 'StorageE2EPassword123';
const CUSTOMER_NAME = 'Storage E2E';
const ADMIN_PHONE = '+249955554444';
const ADMIN_PASSWORD = 'StorageAdminPassword123';
const ADMIN_NAME = 'Storage E2E Admin';
const TEST_PRODUCT_SLUG = 'storage-e2e-tea';

async function pngBuffer(width = 8, height = 8): Promise<Buffer> {
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 200, g: 50, b: 50, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
}

describe('Storage (e2e, stub mode)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testProductId: string;
  let testCategoryId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication({ bufferLogs: true });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));
    await app.init();
    prisma = app.get(PrismaService);
    await cleanup();
    await seed();
  });

  afterAll(async () => {
    await cleanup();
    await app.close();
  });

  async function cleanup() {
    for (const phone of [CUSTOMER_PHONE, ADMIN_PHONE]) {
      const user = await prisma.user.findUnique({ where: { phone } });
      if (user) {
        await prisma.order.deleteMany({ where: { user_id: user.id } });
        await prisma.address.deleteMany({ where: { user_id: user.id } });
        await prisma.user.delete({ where: { id: user.id } });
      }
    }
    const product = await prisma.product.findUnique({ where: { slug: TEST_PRODUCT_SLUG } });
    if (product) await prisma.product.delete({ where: { id: product.id } });
    if (testCategoryId) {
      const remaining = await prisma.product.count({ where: { category_id: testCategoryId } });
      if (remaining === 0) {
        try {
          await prisma.category.delete({ where: { id: testCategoryId } });
        } catch {
          /* shared fixture — non-fatal */
        }
      }
    }
  }

  async function seed() {
    const category = await prisma.category.upsert({
      where: { slug: 'storage-e2e' },
      update: {},
      create: { name_ar: 'تجربة', name_en: 'E2E', slug: 'storage-e2e', sort_order: 99 },
    });
    testCategoryId = category.id;
    const product = await prisma.product.create({
      data: {
        name_ar: 'منتج اختبار',
        name_en: 'Test product',
        description_ar: '...',
        description_en: '...',
        slug: TEST_PRODUCT_SLUG,
        price: new Prisma.Decimal(1500),
        stock: 25,
        category_id: category.id,
      },
    });
    testProductId = product.id;
  }

  async function registerAndLogin(
    phone: string,
    name: string,
    password: string,
    role: 'CUSTOMER' | 'ADMIN' = 'CUSTOMER',
  ): Promise<string> {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ phone, name, password })
      .expect(201);
    const user = await prisma.user.findUniqueOrThrow({ where: { phone } });
    const otp = await prisma.otpCode.findFirstOrThrow({
      where: { user_id: user.id, used: false },
      orderBy: { created_at: 'desc' },
    });
    const verify = await request(app.getHttpServer())
      .post('/api/auth/verify-otp')
      .send({ phone, code: otp.code, purpose: 'REGISTER' })
      .expect(200);
    if (role === 'ADMIN') {
      await prisma.user.update({ where: { id: user.id }, data: { role: 'ADMIN' } });
      const login = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ phone, password })
        .expect(200);
      return login.body.data.accessToken;
    }
    return verify.body.data.accessToken;
  }

  it('customer can upload a receipt for their own bank-transfer order', async () => {
    const customerToken = await registerAndLogin(
      CUSTOMER_PHONE,
      CUSTOMER_NAME,
      CUSTOMER_PASSWORD,
    );
    const customerAuth = `Bearer ${customerToken}`;

    // Create an address + bank-transfer order so storage has a valid target.
    const addr = await request(app.getHttpServer())
      .post('/api/users/me/addresses')
      .set('Authorization', customerAuth)
      .send({
        label: 'Home',
        full_name: CUSTOMER_NAME,
        phone: CUSTOMER_PHONE,
        district: 'Al-Riyadh',
        landmark: 'Test landmark',
        zone: 'ZONE_B',
      })
      .expect(201);
    const orderRes = await request(app.getHttpServer())
      .post('/api/orders')
      .set('Authorization', customerAuth)
      .send({
        address_id: addr.body.data.id,
        payment_method: 'BANK_TRANSFER',
        items: [{ product_id: testProductId, quantity: 1 }],
      })
      .expect(201);
    const orderId: string = orderRes.body.data.id;

    // Happy path: upload a PNG.
    const png = await pngBuffer(16, 16);
    const upload = await request(app.getHttpServer())
      .post('/api/storage/receipts')
      .set('Authorization', customerAuth)
      .field('order_id', orderId)
      .attach('file', png, { filename: 'receipt.png', contentType: 'image/png' })
      .expect(201);
    expect(upload.body).toMatchObject({
      success: true,
      data: { key: expect.stringMatching(/^stub\/receipts\/\d{4}\/\d{2}\/.+?\/[0-9a-f-]+\.webp$/) },
    });

    // The returned key is valid input for POST /orders/:id/receipt.
    const orderReceipt = await request(app.getHttpServer())
      .post(`/api/orders/${orderId}/receipt`)
      .set('Authorization', customerAuth)
      .send({ receipt_url: upload.body.data.key })
      .expect(201);
    expect(orderReceipt.body.data.status).toBe('RECEIPT_UPLOADED');
    expect(orderReceipt.body.data.receipt_url).toBe(upload.body.data.key);

    // Foreign-order rejection: upload against a fake order id.
    const reject = await request(app.getHttpServer())
      .post('/api/storage/receipts')
      .set('Authorization', customerAuth)
      .field('order_id', 'clxxxxxxxxxxxxxxxxxxxxxx')
      .attach('file', png, { filename: 'receipt.png', contentType: 'image/png' })
      .expect(404);
    expect(reject.body.error.code).toBe('ORDER_NOT_FOUND');
  }, 60_000);

  it('admin can sign a 1-hour read URL for a receipt key; non-admin gets 403', async () => {
    const adminToken = await registerAndLogin(
      ADMIN_PHONE,
      ADMIN_NAME,
      ADMIN_PASSWORD,
      'ADMIN',
    );
    const adminAuth = `Bearer ${adminToken}`;
    const sign = await request(app.getHttpServer())
      .post('/api/storage/receipts/signed-url')
      .set('Authorization', adminAuth)
      .send({ key: 'receipts/2026/05/o1/abc.webp' })
      .expect(201);
    expect(sign.body.data).toMatchObject({
      url: expect.stringMatching(/\/api\/storage\/dev\/receipts\//),
      expires_in: 3600,
    });

    // Non-admin (the previously registered customer) gets 403.
    const customer = await prisma.user.findUniqueOrThrow({ where: { phone: CUSTOMER_PHONE } });
    expect(customer.role).toBe('CUSTOMER');
    const customerLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ phone: CUSTOMER_PHONE, password: CUSTOMER_PASSWORD })
      .expect(200);
    const denied = await request(app.getHttpServer())
      .post('/api/storage/receipts/signed-url')
      .set('Authorization', `Bearer ${customerLogin.body.data.accessToken}`)
      .send({ key: 'receipts/2026/05/o1/abc.webp' })
      .expect(403);
    expect(denied.body.error.code).toBe('FORBIDDEN');
  }, 60_000);
});
