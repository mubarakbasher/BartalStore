import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { PrismaService } from '../src/prisma/prisma.service';

const ADMIN_PHONE = process.env.SEED_ADMIN_PHONE ?? '+249912000001';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';
const CUSTOMER_PHONE = '+249977770000';
const CUSTOMER_PASSWORD = 'AdminE2EPwd123';
const CUSTOMER_NAME = 'Admin E2E Customer';
const TEST_PRODUCT_SLUG = 'admin-e2e-tea';
const TEST_CATEGORY_SLUG = 'admin-e2e';
const RECEIPT_KEY = 'receipts/2026/05/admin-e2e/key.webp';

describe('Admin (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testProductId: string;
  let originalZoneCFee: number | null = null;

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
    // Drop customer + their orders + reviews + audit entries first.
    const customer = await prisma.user.findUnique({ where: { phone: CUSTOMER_PHONE } });
    if (customer) {
      await prisma.auditLog.deleteMany({ where: { actor_id: customer.id } });
      await prisma.review.deleteMany({ where: { user_id: customer.id } });
      await prisma.order.deleteMany({ where: { user_id: customer.id } });
      await prisma.address.deleteMany({ where: { user_id: customer.id } });
      await prisma.user.delete({ where: { id: customer.id } });
    }
    // Drop audit rows created by the admin specifically for our test entities
    const product = await prisma.product.findUnique({ where: { slug: TEST_PRODUCT_SLUG } });
    if (product) {
      await prisma.auditLog.deleteMany({
        where: { entity_type: 'Product', entity_id: product.id },
      });
      await prisma.review.deleteMany({ where: { product_id: product.id } });
      await prisma.product.delete({ where: { id: product.id } });
    }
    const category = await prisma.category.findUnique({ where: { slug: TEST_CATEGORY_SLUG } });
    if (category) {
      await prisma.auditLog.deleteMany({
        where: { entity_type: 'Category', entity_id: category.id },
      });
      const remaining = await prisma.product.count({ where: { category_id: category.id } });
      if (remaining === 0) {
        try {
          await prisma.category.delete({ where: { id: category.id } });
        } catch {
          /* non-fatal */
        }
      }
    }
    // Tidy up audit_logs for the seeded admin's e2e zone-fee / settings actions.
    await prisma.auditLog.deleteMany({
      where: {
        OR: [
          { entity_type: 'DeliveryZoneFee', entity_id: 'ZONE_C' },
          { entity_type: 'AppSetting' },
        ],
      },
    });
    // Restore the test setting we touched.
    await prisma.appSetting.deleteMany({ where: { key: 'ui.banner_ar' } });
  }

  async function seed() {
    const category = await prisma.category.upsert({
      where: { slug: TEST_CATEGORY_SLUG },
      update: {},
      create: {
        name_ar: 'تجربة',
        name_en: 'E2E',
        slug: TEST_CATEGORY_SLUG,
        sort_order: 99,
      },
    });
    const product = await prisma.product.create({
      data: {
        name_ar: 'كركديه إداري',
        name_en: 'Admin Karkadeh',
        description_ar: '...',
        description_en: '...',
        slug: TEST_PRODUCT_SLUG,
        price: new Prisma.Decimal(1500),
        stock: 25,
        category_id: category.id,
      },
    });
    testProductId = product.id;
    const zoneC = await prisma.deliveryZoneFee.findUnique({ where: { zone: 'ZONE_C' } });
    if (zoneC) originalZoneCFee = Number(zoneC.fee);
  }

  async function loginAdmin(): Promise<string> {
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ phone: ADMIN_PHONE, password: ADMIN_PASSWORD })
      .expect(200);
    return login.body.data.accessToken;
  }

  async function registerCustomer(): Promise<string> {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ phone: CUSTOMER_PHONE, name: CUSTOMER_NAME, password: CUSTOMER_PASSWORD })
      .expect(201);
    const user = await prisma.user.findUniqueOrThrow({ where: { phone: CUSTOMER_PHONE } });
    const otp = await prisma.otpCode.findFirstOrThrow({
      where: { user_id: user.id, used: false },
      orderBy: { created_at: 'desc' },
    });
    const verify = await request(app.getHttpServer())
      .post('/api/auth/verify-otp')
      .send({ phone: CUSTOMER_PHONE, code: otp.code, purpose: 'REGISTER' })
      .expect(200);
    return verify.body.data.accessToken;
  }

  it('admin manages full order flow + customers + zone + settings, audit log records every mutation', async () => {
    const adminToken = await loginAdmin();
    const adminAuth = `Bearer ${adminToken}`;

    const customerToken = await registerCustomer();
    const customerAuth = `Bearer ${customerToken}`;

    // Customer creates address → bank-transfer order → uploads receipt (key shape).
    const addrRes = await request(app.getHttpServer())
      .post('/api/users/me/addresses')
      .set('Authorization', customerAuth)
      .send({
        label: 'Home',
        full_name: CUSTOMER_NAME,
        phone: CUSTOMER_PHONE,
        district: 'Al-Riyadh',
        landmark: 'Next to test mosque',
        zone: 'ZONE_B',
      })
      .expect(201);
    const orderRes = await request(app.getHttpServer())
      .post('/api/orders')
      .set('Authorization', customerAuth)
      .send({
        address_id: addrRes.body.data.id,
        payment_method: 'BANK_TRANSFER',
        items: [{ product_id: testProductId, quantity: 1 }],
      })
      .expect(201);
    const orderId: string = orderRes.body.data.id;
    await request(app.getHttpServer())
      .post(`/api/orders/${orderId}/receipt`)
      .set('Authorization', customerAuth)
      .send({ receipt_url: RECEIPT_KEY })
      .expect(201);

    // 1. Admin lists orders, scoped to RECEIPT_UPLOADED.
    const list = await request(app.getHttpServer())
      .get('/api/admin/orders?status=RECEIPT_UPLOADED&limit=50')
      .set('Authorization', adminAuth)
      .expect(200);
    expect(list.body.data.items.some((o: { id: string }) => o.id === orderId)).toBe(true);

    // 2. Confirm payment → PAYMENT_CONFIRMED + audit + SMS row.
    const pay = await request(app.getHttpServer())
      .put(`/api/admin/orders/${orderId}/payment`)
      .set('Authorization', adminAuth)
      .send({ status: 'PAID' })
      .expect(200);
    expect(pay.body.data.status).toBe('PAYMENT_CONFIRMED');
    expect(pay.body.data.payment_status).toBe('PAID');
    const audit1 = await prisma.auditLog.findFirst({
      where: { entity_type: 'Order', entity_id: orderId, action: 'PAYMENT_CONFIRMED' },
    });
    expect(audit1).not.toBeNull();

    // 3. Move to PROCESSING (admin action; no SMS event).
    const processing = await request(app.getHttpServer())
      .put(`/api/admin/orders/${orderId}/status`)
      .set('Authorization', adminAuth)
      .send({ status: 'PROCESSING', note: 'packing started' })
      .expect(200);
    expect(processing.body.data.status).toBe('PROCESSING');

    // 4. Move to SHIPPED → SMS row appears.
    await request(app.getHttpServer())
      .put(`/api/admin/orders/${orderId}/status`)
      .set('Authorization', adminAuth)
      .send({ status: 'SHIPPED' })
      .expect(200);
    const shippedHistory = await prisma.orderStatusHistory.findFirst({
      where: { order_id: orderId, status: 'SHIPPED' },
    });
    expect(shippedHistory).not.toBeNull();
    // SMS goes out in the customer's language (AR by default) — assert via the
    // order_number which appears in every template.
    const orderNumber = pay.body.data.order_number;
    const shippedSms = await prisma.smsLog.findFirst({
      where: { phone: CUSTOMER_PHONE, message: { contains: orderNumber } },
      orderBy: { created_at: 'desc' },
    });
    expect(shippedSms).not.toBeNull();
    expect(shippedSms!.message).toMatch(/شحن|shipped/i);

    // 4b. Order detail returns the full enriched shape.
    const detail = await request(app.getHttpServer())
      .get(`/api/admin/orders/${orderId}`)
      .set('Authorization', adminAuth)
      .expect(200);
    expect(detail.body.data.id).toBe(orderId);
    expect(detail.body.data.status).toBe('SHIPPED');
    expect(detail.body.data.items.length).toBe(1);
    expect(detail.body.data.history.length).toBeGreaterThan(0);
    expect(detail.body.data.address.landmark).toBeDefined();
    // 404 on unknown id
    const notFound = await request(app.getHttpServer())
      .get('/api/admin/orders/clxxxxxxxxxxxxxxxxxxxxxxx')
      .set('Authorization', adminAuth)
      .expect(404);
    expect(notFound.body.error.code).toBe('ORDER_NOT_FOUND');

    // 5. Customers list finds our customer with order count 1.
    const customers = await request(app.getHttpServer())
      .get(`/api/admin/customers?q=${encodeURIComponent(CUSTOMER_PHONE)}`)
      .set('Authorization', adminAuth)
      .expect(200);
    const me = customers.body.data.items.find(
      (u: { phone: string }) => u.phone === CUSTOMER_PHONE,
    );
    expect(me).toBeDefined();
    expect(me.order_count).toBe(1);

    // 6. Zone fee update → audit row.
    const zoneRes = await request(app.getHttpServer())
      .put('/api/admin/delivery/zones/ZONE_C')
      .set('Authorization', adminAuth)
      .send({ fee: 1234, estimated_days_min: 2, estimated_days_max: 4 })
      .expect(200);
    expect(zoneRes.body.data.fee).toBe(1234);
    const zoneAudit = await prisma.auditLog.findFirst({
      where: { entity_type: 'DeliveryZoneFee', entity_id: 'ZONE_C' },
      orderBy: { created_at: 'desc' },
    });
    expect(zoneAudit).not.toBeNull();
    // Restore the zone before the next assertion (cleanup-as-you-go for shared fixture).
    if (originalZoneCFee !== null) {
      await prisma.deliveryZoneFee.update({
        where: { zone: 'ZONE_C' },
        data: { fee: new Prisma.Decimal(originalZoneCFee) },
      });
    }

    // 7. Settings batch update → audit row.
    await request(app.getHttpServer())
      .put('/api/admin/settings')
      .set('Authorization', adminAuth)
      .send({ settings: { 'ui.banner_ar': 'إعلان تجريبي' } })
      .expect(200);
    const settings = await request(app.getHttpServer())
      .get('/api/admin/settings')
      .set('Authorization', adminAuth)
      .expect(200);
    expect(settings.body.data['ui.banner_ar']).toBe('إعلان تجريبي');
    const settingsAudit = await prisma.auditLog.findFirst({
      where: { entity_type: 'AppSetting', action: 'SETTINGS_UPDATE' },
      orderBy: { created_at: 'desc' },
    });
    expect(settingsAudit).not.toBeNull();

    // 8. Catalog flow: admin lists products with `inactive` filter, fetches detail,
    //    updates an image (PUT primary flip), deletes an image (auto-promote), lists categories.
    const listProducts = await request(app.getHttpServer())
      .get('/api/admin/products?status=all&limit=50')
      .set('Authorization', adminAuth)
      .expect(200);
    expect(listProducts.body.data.items.some((p: { slug: string }) => p.slug === TEST_PRODUCT_SLUG)).toBe(true);
    expect(listProducts.body.data.counts).toEqual(
      expect.objectContaining({ all: expect.any(Number), active: expect.any(Number) }),
    );

    const productDetail = await request(app.getHttpServer())
      .get(`/api/admin/products/${testProductId}`)
      .set('Authorization', adminAuth)
      .expect(200);
    expect(productDetail.body.data.id).toBe(testProductId);

    // Seed 2 product images directly (skips storage flow). First is primary.
    const img1 = await prisma.productImage.create({
      data: {
        product_id: testProductId,
        url: 'stub://receipts/admin-e2e/img1.webp',
        sort_order: 0,
        is_primary: true,
      },
    });
    const img2 = await prisma.productImage.create({
      data: {
        product_id: testProductId,
        url: 'stub://receipts/admin-e2e/img2.webp',
        sort_order: 1,
        is_primary: false,
      },
    });

    // Flip primary to img2 via PUT.
    const flip = await request(app.getHttpServer())
      .put(`/api/admin/products/${testProductId}/images/${img2.id}`)
      .set('Authorization', adminAuth)
      .send({ is_primary: true })
      .expect(200);
    expect(flip.body.data.is_primary).toBe(true);
    const img1AfterFlip = await prisma.productImage.findUnique({ where: { id: img1.id } });
    expect(img1AfterFlip?.is_primary).toBe(false);

    // Delete the primary image (img2) — img1 should auto-promote.
    await request(app.getHttpServer())
      .delete(`/api/admin/products/${testProductId}/images/${img2.id}`)
      .set('Authorization', adminAuth)
      .expect(200);
    const img1AfterDelete = await prisma.productImage.findUnique({ where: { id: img1.id } });
    expect(img1AfterDelete?.is_primary).toBe(true);

    // 404 on unknown image.
    const missing = await request(app.getHttpServer())
      .delete(`/api/admin/products/${testProductId}/images/clxxxxxxxxxxxxxxxxxxxxxxx`)
      .set('Authorization', adminAuth)
      .expect(404);
    expect(missing.body.error.code).toBe('IMAGE_NOT_FOUND');

    // Cleanup the remaining seeded image (the cleanup() helper deletes the product but
    // there's no FK cascade rule we're testing here — explicit delete keeps the test deterministic).
    await prisma.productImage.deleteMany({ where: { product_id: testProductId } });

    const listCategories = await request(app.getHttpServer())
      .get('/api/admin/categories')
      .set('Authorization', adminAuth)
      .expect(200);
    expect(Array.isArray(listCategories.body.data)).toBe(true);
    expect(
      listCategories.body.data.some(
        (c: { slug: string; product_count: number }) =>
          c.slug === TEST_CATEGORY_SLUG && typeof c.product_count === 'number',
      ),
    ).toBe(true);

    // 9. Review moderation: advance order to DELIVERED so the customer is
    //    eligible to post reviews. Then post a clean review + a flagged one,
    //    list each tab, approve + reject, and assert customer-facing list filters.
    await request(app.getHttpServer())
      .put(`/api/admin/orders/${orderId}/status`)
      .set('Authorization', adminAuth)
      .send({ status: 'DELIVERED' })
      .expect(200);

    // Customer posts the clean review.
    const cleanReview = await request(app.getHttpServer())
      .post(`/api/products/${testProductId}/reviews`)
      .set('Authorization', customerAuth)
      .send({ rating: 5, comment: 'amazing scent, excellent packaging' })
      .expect(201);
    const cleanId: string = cleanReview.body.data.id;

    // Seed a flagged review via Prisma directly (uses a synthetic second buyer to
    // satisfy the (product_id, user_id) unique constraint).
    const otherBuyer = await prisma.user.create({
      data: {
        phone: '+249977770001',
        name: 'Second Buyer',
        password_hash: 'x',
        is_verified: true,
        is_active: true,
        role: 'CUSTOMER',
      },
    });
    const flagged = await prisma.review.create({
      data: {
        product_id: testProductId,
        user_id: otherBuyer.id,
        rating: 1,
        comment: 'arrived defective, refund please',
        is_verified_purchase: true,
        flagged_reason: 'Auto-flag: contains "defective"',
        moderation_status: 'PENDING',
      },
    });

    // List filtered tabs.
    const pendingList = await request(app.getHttpServer())
      .get('/api/admin/reviews?status=pending')
      .set('Authorization', adminAuth)
      .expect(200);
    expect(pendingList.body.data.items.map((r: { id: string }) => r.id)).toContain(cleanId);

    const flaggedList = await request(app.getHttpServer())
      .get('/api/admin/reviews?status=flagged')
      .set('Authorization', adminAuth)
      .expect(200);
    expect(flaggedList.body.data.items.map((r: { id: string }) => r.id)).toContain(flagged.id);

    // Approve the clean review; the public list should now include it.
    await request(app.getHttpServer())
      .post(`/api/admin/reviews/${cleanId}/approve`)
      .set('Authorization', adminAuth)
      .expect(201);

    const publicList = await request(app.getHttpServer())
      .get(`/api/products/${testProductId}/reviews`)
      .expect(200);
    expect(publicList.body.data.items.map((r: { id: string }) => r.id)).toContain(cleanId);
    expect(publicList.body.data.items.map((r: { id: string }) => r.id)).not.toContain(flagged.id);

    // Reject the flagged review with a reason.
    const reject = await request(app.getHttpServer())
      .post(`/api/admin/reviews/${flagged.id}/reject`)
      .set('Authorization', adminAuth)
      .send({ reason: 'Promotional / spam' })
      .expect(201);
    expect(reject.body.data.rejection_reason).toBe('Promotional / spam');

    // Reject reason validation: too short.
    await request(app.getHttpServer())
      .post(`/api/admin/reviews/${cleanId}/reject`)
      .set('Authorization', adminAuth)
      .send({ reason: 'no' })
      .expect(400);

    // KPIs respond + sum to a number.
    const kpis = await request(app.getHttpServer())
      .get('/api/admin/reviews/kpis')
      .set('Authorization', adminAuth)
      .expect(200);
    expect(typeof kpis.body.data.pending).toBe('number');
    expect(typeof kpis.body.data.flagged).toBe('number');

    // Staff list contains the seeded admin.
    const staff = await request(app.getHttpServer())
      .get('/api/admin/staff')
      .set('Authorization', adminAuth)
      .expect(200);
    expect(staff.body.data.items.some((s: { phone: string }) => s.phone === ADMIN_PHONE)).toBe(
      true,
    );

    // Audit log includes at least 2 review entries.
    const auditFeed = await request(app.getHttpServer())
      .get('/api/admin/audit-log?entity_type=Review&limit=20')
      .set('Authorization', adminAuth)
      .expect(200);
    const reviewAudits = auditFeed.body.data.items.filter(
      (a: { entity_type: string }) => a.entity_type === 'Review',
    );
    expect(reviewAudits.length).toBeGreaterThanOrEqual(2);

    // Tidy up the synthetic second buyer + their review entries.
    await prisma.auditLog.deleteMany({ where: { entity_type: 'Review' } });
    await prisma.review.deleteMany({ where: { product_id: testProductId } });
    await prisma.user.delete({ where: { id: otherBuyer.id } });

    // 10. Non-admin gets 403 on an admin route.
    const deny = await request(app.getHttpServer())
      .get('/api/admin/orders')
      .set('Authorization', customerAuth)
      .expect(403);
    expect(deny.body.error.code).toBe('FORBIDDEN');
  }, 120_000);
});
