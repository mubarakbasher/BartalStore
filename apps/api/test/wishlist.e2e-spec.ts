import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { PrismaService } from '../src/prisma/prisma.service';

const USER_PHONE = '+249955551111';
const USER_PASSWORD = 'WishlistE2EPwd123';
const USER_NAME = 'Wishlist User';
const TEST_PRODUCT_SLUG = 'wishlist-e2e-item';

describe('Wishlist (e2e)', () => {
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
    const user = await prisma.user.findUnique({ where: { phone: USER_PHONE } });
    if (user) {
      await prisma.wishlistItem.deleteMany({ where: { user_id: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
    }
    const product = await prisma.product.findUnique({ where: { slug: TEST_PRODUCT_SLUG } });
    if (product) {
      await prisma.wishlistItem.deleteMany({ where: { product_id: product.id } });
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
      where: { slug: 'wishlist-e2e' },
      update: {},
      create: { name_ar: 'تجربة', name_en: 'E2E', slug: 'wishlist-e2e', sort_order: 98 },
    });
    testCategoryId = category.id;
    const product = await prisma.product.create({
      data: {
        name_ar: 'منتج المفضلة',
        name_en: 'Wishlist Item',
        description_ar: '...',
        description_en: '...',
        slug: TEST_PRODUCT_SLUG,
        price: new Prisma.Decimal(9900),
        stock: 12,
        category_id: category.id,
      },
    });
    testProductId = product.id;
  }

  async function registerVerifyLogin(): Promise<string> {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ phone: USER_PHONE, name: USER_NAME, password: USER_PASSWORD })
      .expect(201);
    const user = await prisma.user.findUniqueOrThrow({ where: { phone: USER_PHONE } });
    const otp = await prisma.otpCode.findFirstOrThrow({
      where: { user_id: user.id, used: false },
      orderBy: { created_at: 'desc' },
    });
    const verify = await request(app.getHttpServer())
      .post('/api/auth/verify-otp')
      .send({ phone: USER_PHONE, code: otp.code, purpose: 'REGISTER' })
      .expect(200);
    return verify.body.data.accessToken;
  }

  it('add → list → idempotent add → remove → list', async () => {
    const token = await registerVerifyLogin();
    const auth = `Bearer ${token}`;

    // Empty to start
    const empty = await request(app.getHttpServer())
      .get('/api/wishlist')
      .set('Authorization', auth)
      .expect(200);
    expect(empty.body.data).toHaveLength(0);

    // Add
    const add = await request(app.getHttpServer())
      .post(`/api/wishlist/${testProductId}`)
      .set('Authorization', auth)
      .expect(201);
    expect(add.body).toMatchObject({
      success: true,
      data: { product_id: testProductId, slug: TEST_PRODUCT_SLUG, price: 9900 },
    });

    // List shows the item
    const list = await request(app.getHttpServer())
      .get('/api/wishlist')
      .set('Authorization', auth)
      .expect(200);
    expect(list.body.data).toHaveLength(1);
    expect(list.body.data[0].product_id).toBe(testProductId);

    // Idempotent re-add (no duplicate)
    await request(app.getHttpServer())
      .post(`/api/wishlist/${testProductId}`)
      .set('Authorization', auth)
      .expect(201);
    const afterDup = await request(app.getHttpServer())
      .get('/api/wishlist')
      .set('Authorization', auth)
      .expect(200);
    expect(afterDup.body.data).toHaveLength(1);

    // Remove
    await request(app.getHttpServer())
      .delete(`/api/wishlist/${testProductId}`)
      .set('Authorization', auth)
      .expect(200);
    const afterRemove = await request(app.getHttpServer())
      .get('/api/wishlist')
      .set('Authorization', auth)
      .expect(200);
    expect(afterRemove.body.data).toHaveLength(0);
  }, 60_000);

  it('requires auth', async () => {
    await request(app.getHttpServer()).get('/api/wishlist').expect(401);
  });
});
