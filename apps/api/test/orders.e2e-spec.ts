import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { PrismaService } from '../src/prisma/prisma.service';

const TEST_PHONE = '+249977776666';
const TEST_PASSWORD = 'OrdersE2EPassword123';
const TEST_NAME = 'Orders E2E Test';
const TEST_PRODUCT_SLUG = 'orders-e2e-tea';
const TEST_RECEIPT_URL = 'receipts/2026/05/orders-e2e/test-key.webp';

describe('Orders (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testCategoryId: string;
  let testProductId: string;

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
    await seedProduct();
  });

  afterAll(async () => {
    await cleanup();
    await app.close();
  });

  async function cleanup() {
    const user = await prisma.user.findUnique({ where: { phone: TEST_PHONE } });
    if (user) {
      // Delete orders + their items/history first (Address has no cascade from Order).
      await prisma.order.deleteMany({ where: { user_id: user.id } });
      await prisma.address.deleteMany({ where: { user_id: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
    }
    const product = await prisma.product.findUnique({ where: { slug: TEST_PRODUCT_SLUG } });
    if (product) {
      await prisma.product.delete({ where: { id: product.id } });
    }
    if (testCategoryId) {
      const remaining = await prisma.product.count({ where: { category_id: testCategoryId } });
      if (remaining === 0) {
        try {
          await prisma.category.delete({ where: { id: testCategoryId } });
        } catch {
          // Other fixtures may already share this category — non-fatal.
        }
      }
    }
  }

  async function seedProduct() {
    const category = await prisma.category.upsert({
      where: { slug: 'orders-e2e' },
      update: {},
      create: {
        name_ar: 'تجربة',
        name_en: 'E2E',
        slug: 'orders-e2e',
        sort_order: 99,
      },
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

  async function fetchLatestOtp(): Promise<string> {
    const user = await prisma.user.findUniqueOrThrow({ where: { phone: TEST_PHONE } });
    const otp = await prisma.otpCode.findFirstOrThrow({
      where: { user_id: user.id, used: false },
      orderBy: { created_at: 'desc' },
    });
    return otp.code;
  }

  it('full flow: register → address → create order → list → upload receipt', async () => {
    // 1. Register + verify
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ phone: TEST_PHONE, name: TEST_NAME, password: TEST_PASSWORD })
      .expect(201);
    const code = await fetchLatestOtp();
    const verify = await request(app.getHttpServer())
      .post('/api/auth/verify-otp')
      .send({ phone: TEST_PHONE, code, purpose: 'REGISTER' })
      .expect(200);
    const accessToken: string = verify.body.data.accessToken;
    const auth = `Bearer ${accessToken}`;

    // 2. Create address
    const addressRes = await request(app.getHttpServer())
      .post('/api/users/me/addresses')
      .set('Authorization', auth)
      .send({
        label: 'Home',
        full_name: TEST_NAME,
        phone: TEST_PHONE,
        district: 'Al-Riyadh',
        landmark: 'Next to test mosque',
        zone: 'ZONE_B',
      })
      .expect(201);
    const addressId: string = addressRes.body.data.id;

    // 3. Create order
    const createRes = await request(app.getHttpServer())
      .post('/api/orders')
      .set('Authorization', auth)
      .send({
        address_id: addressId,
        payment_method: 'BANK_TRANSFER',
        items: [{ product_id: testProductId, quantity: 2 }],
      })
      .expect(201);
    expect(createRes.body).toMatchObject({
      success: true,
      data: {
        order_number: expect.stringMatching(/^BRT-\d{4}-\d{5}$/),
        status: 'AWAITING_PAYMENT',
        payment_method: 'BANK_TRANSFER',
        payment_status: 'UNPAID',
      },
    });
    const orderId: string = createRes.body.data.id;
    expect(createRes.body.data.items).toHaveLength(1);
    expect(createRes.body.data.items[0]).toMatchObject({
      product_id: testProductId,
      quantity: 2,
      unit_price: 1500,
    });

    // Stock decremented
    const after = await prisma.product.findUniqueOrThrow({ where: { id: testProductId } });
    expect(after.stock).toBe(23);

    // 4. List
    const listRes = await request(app.getHttpServer())
      .get('/api/orders?page=1&limit=10')
      .set('Authorization', auth)
      .expect(200);
    expect(listRes.body.data.items.some((o: { id: string }) => o.id === orderId)).toBe(true);

    // 5. Detail
    const detailRes = await request(app.getHttpServer())
      .get(`/api/orders/${orderId}`)
      .set('Authorization', auth)
      .expect(200);
    expect(detailRes.body.data.id).toBe(orderId);

    // 6. Upload receipt
    const receiptRes = await request(app.getHttpServer())
      .post(`/api/orders/${orderId}/receipt`)
      .set('Authorization', auth)
      .send({ receipt_url: TEST_RECEIPT_URL })
      .expect(201);
    expect(receiptRes.body.data.status).toBe('RECEIPT_UPLOADED');
    expect(receiptRes.body.data.receipt_url).toBe(TEST_RECEIPT_URL);

    // 7. Re-upload after RECEIPT_UPLOADED is rejected
    const replay = await request(app.getHttpServer())
      .post(`/api/orders/${orderId}/receipt`)
      .set('Authorization', auth)
      .send({ receipt_url: TEST_RECEIPT_URL })
      .expect(409);
    expect(replay.body).toMatchObject({
      success: false,
      error: { code: 'INVALID_STATUS_TRANSITION' },
    });
  }, 60_000);
});
