import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { PrismaService } from '../src/prisma/prisma.service';

const BUYER_PHONE = '+249944443333';
const BUYER_PASSWORD = 'ReviewsE2EPwd123';
const BUYER_NAME = 'Reviews Buyer';
const STRANGER_PHONE = '+249933332222';
const STRANGER_PASSWORD = 'StrangerPwd123';
const STRANGER_NAME = 'Reviews Stranger';
const TEST_PRODUCT_SLUG = 'reviews-e2e-tea';

describe('Reviews (e2e)', () => {
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
    await seed();
  });

  afterAll(async () => {
    await cleanup();
    await app.close();
  });

  async function cleanup() {
    for (const phone of [BUYER_PHONE, STRANGER_PHONE]) {
      const user = await prisma.user.findUnique({ where: { phone } });
      if (user) {
        await prisma.review.deleteMany({ where: { user_id: user.id } });
        await prisma.order.deleteMany({ where: { user_id: user.id } });
        await prisma.address.deleteMany({ where: { user_id: user.id } });
        await prisma.user.delete({ where: { id: user.id } });
      }
    }
    const product = await prisma.product.findUnique({ where: { slug: TEST_PRODUCT_SLUG } });
    if (product) {
      await prisma.review.deleteMany({ where: { product_id: product.id } });
      await prisma.product.delete({ where: { id: product.id } });
    }
    if (testCategoryId) {
      const remaining = await prisma.product.count({ where: { category_id: testCategoryId } });
      if (remaining === 0) {
        try {
          await prisma.category.delete({ where: { id: testCategoryId } });
        } catch {
          /* shared category — non-fatal */
        }
      }
    }
  }

  async function seed() {
    const category = await prisma.category.upsert({
      where: { slug: 'reviews-e2e' },
      update: {},
      create: { name_ar: 'تجربة', name_en: 'E2E', slug: 'reviews-e2e', sort_order: 99 },
    });
    testCategoryId = category.id;
    const product = await prisma.product.create({
      data: {
        name_ar: 'كركديه اختبار',
        name_en: 'Test Karkadeh',
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

  async function registerVerifyLogin(
    phone: string,
    name: string,
    password: string,
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
    return verify.body.data.accessToken;
  }

  it('verified buyer can post a review; duplicate is 409', async () => {
    const buyerToken = await registerVerifyLogin(BUYER_PHONE, BUYER_NAME, BUYER_PASSWORD);
    const buyerAuth = `Bearer ${buyerToken}`;
    const buyer = await prisma.user.findUniqueOrThrow({ where: { phone: BUYER_PHONE } });

    const address = await prisma.address.create({
      data: {
        user_id: buyer.id,
        label: 'Home',
        full_name: BUYER_NAME,
        phone: BUYER_PHONE,
        district: 'Al-Riyadh',
        landmark: 'Next to test mosque',
        zone: 'ZONE_B',
        is_default: true,
      },
    });

    // Insert a DELIVERED order directly so verified-purchase passes.
    await prisma.order.create({
      data: {
        order_number: 'BRT-2026-99001',
        user_id: buyer.id,
        address_id: address.id,
        status: 'DELIVERED',
        payment_method: 'CASH_ON_DELIVERY',
        payment_status: 'PAID',
        subtotal: new Prisma.Decimal(1500),
        delivery_fee: new Prisma.Decimal(1000),
        discount: new Prisma.Decimal(0),
        total: new Prisma.Decimal(2500),
        delivered_at: new Date(),
        items: {
          create: [
            {
              product_id: testProductId,
              product_name_ar: 'كركديه اختبار',
              product_name_en: 'Test Karkadeh',
              quantity: 1,
              unit_price: new Prisma.Decimal(1500),
              total_price: new Prisma.Decimal(1500),
            },
          ],
        },
      },
    });

    // Happy path: POST review (lands in moderation queue as PENDING)
    const post = await request(app.getHttpServer())
      .post(`/api/products/${testProductId}/reviews`)
      .set('Authorization', buyerAuth)
      .send({ rating: 5, comment: 'ممتاز جدا' })
      .expect(201);
    expect(post.body).toMatchObject({
      success: true,
      data: {
        product_id: testProductId,
        rating: 5,
        comment: 'ممتاز جدا',
        is_verified_purchase: true,
      },
    });

    // Customer-facing GET filters to APPROVED only; the just-created review is PENDING.
    const pending = await request(app.getHttpServer())
      .get(`/api/products/${testProductId}/reviews`)
      .expect(200);
    expect(pending.body.data.items).toHaveLength(0);
    expect(pending.body.data.summary.count).toBe(0);

    // Promote the review to APPROVED (simulating admin moderation) and re-list.
    await prisma.review.updateMany({
      where: { product_id: testProductId, user_id: buyer.id },
      data: { moderation_status: 'APPROVED', moderated_at: new Date() },
    });
    const list = await request(app.getHttpServer())
      .get(`/api/products/${testProductId}/reviews`)
      .expect(200);
    expect(list.body.data.items).toHaveLength(1);
    expect(list.body.data.summary).toMatchObject({
      count: 1,
      average_rating: 5,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 },
    });

    // Duplicate → 409
    const dup = await request(app.getHttpServer())
      .post(`/api/products/${testProductId}/reviews`)
      .set('Authorization', buyerAuth)
      .send({ rating: 4 })
      .expect(409);
    expect(dup.body.error.code).toBe('REVIEW_ALREADY_EXISTS');
  }, 60_000);

  it('non-buyer gets 403 NOT_A_BUYER', async () => {
    const strangerToken = await registerVerifyLogin(
      STRANGER_PHONE,
      STRANGER_NAME,
      STRANGER_PASSWORD,
    );
    const res = await request(app.getHttpServer())
      .post(`/api/products/${testProductId}/reviews`)
      .set('Authorization', `Bearer ${strangerToken}`)
      .send({ rating: 5 })
      .expect(403);
    expect(res.body.error.code).toBe('NOT_A_BUYER');
  }, 60_000);
});
