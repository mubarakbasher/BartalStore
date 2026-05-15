/* eslint-disable no-console */
import { PrismaClient, DeliveryZone, UserRole, Language } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { KHARTOUM_DELIVERY_ZONES } from '@bartal/shared';

const prisma = new PrismaClient();

const env = {
  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL ?? 'admin@bartal.sd',
  SEED_ADMIN_PHONE: process.env.SEED_ADMIN_PHONE ?? '+249912000001',
  SEED_ADMIN_NAME: process.env.SEED_ADMIN_NAME ?? 'Bartal Admin',
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!',
  BCRYPT_ROUNDS: Number(process.env.BCRYPT_ROUNDS ?? 12),
  STORE_NAME_AR: process.env.STORE_NAME_AR ?? 'بَرتال',
  STORE_NAME_EN: process.env.STORE_NAME_EN ?? 'Bartal',
  STORE_BANK_NAME_AR: process.env.STORE_BANK_NAME_AR ?? 'بنك الخرطوم',
  STORE_BANK_NAME_EN: process.env.STORE_BANK_NAME_EN ?? 'Bank of Khartoum',
  STORE_BANK_ACCOUNT_NAME: process.env.STORE_BANK_ACCOUNT_NAME ?? 'Bartal Trading',
  STORE_BANK_ACCOUNT_NUMBER: process.env.STORE_BANK_ACCOUNT_NUMBER ?? '0000-0000-0000-0000',
  WHATSAPP_SUPPORT_NUMBER: process.env.WHATSAPP_SUPPORT_NUMBER ?? '+249912345678',
};

async function seedAdmin() {
  const password_hash = await bcrypt.hash(env.SEED_ADMIN_PASSWORD, env.BCRYPT_ROUNDS);
  const admin = await prisma.user.upsert({
    where: { phone: env.SEED_ADMIN_PHONE },
    update: { role: UserRole.ADMIN, is_verified: true, name: env.SEED_ADMIN_NAME },
    create: {
      phone: env.SEED_ADMIN_PHONE,
      email: env.SEED_ADMIN_EMAIL,
      name: env.SEED_ADMIN_NAME,
      password_hash,
      is_verified: true,
      role: UserRole.ADMIN,
      language: Language.AR,
    },
  });
  console.log(`✓ Admin: ${admin.phone}`);
}

async function seedDeliveryZones() {
  for (const z of KHARTOUM_DELIVERY_ZONES) {
    await prisma.deliveryZoneFee.upsert({
      where: { zone: z.zone as DeliveryZone },
      update: {
        fee: z.default_fee_sdg,
        free_above: z.free_above_sdg ?? null,
        estimated_days_min: z.estimated_days_min,
        estimated_days_max: z.estimated_days_max,
      },
      create: {
        zone: z.zone as DeliveryZone,
        fee: z.default_fee_sdg,
        free_above: z.free_above_sdg ?? null,
        estimated_days_min: z.estimated_days_min,
        estimated_days_max: z.estimated_days_max,
      },
    });
  }
  console.log(`✓ Delivery zones: ${KHARTOUM_DELIVERY_ZONES.length}`);
}

async function seedAppSettings() {
  const entries: Array<[string, string]> = [
    ['store.name_ar', env.STORE_NAME_AR],
    ['store.name_en', env.STORE_NAME_EN],
    ['store.bank_name_ar', env.STORE_BANK_NAME_AR],
    ['store.bank_name_en', env.STORE_BANK_NAME_EN],
    ['store.bank_account_name', env.STORE_BANK_ACCOUNT_NAME],
    ['store.bank_account_number', env.STORE_BANK_ACCOUNT_NUMBER],
    ['support.whatsapp_number', env.WHATSAPP_SUPPORT_NUMBER],
  ];
  for (const [key, value] of entries) {
    await prisma.appSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  console.log(`✓ App settings: ${entries.length}`);
}

const CATEGORIES = [
  { slug: 'electronics', name_ar: 'إلكترونيات', name_en: 'Electronics' },
  { slug: 'fashion', name_ar: 'أزياء', name_en: 'Fashion' },
  { slug: 'home-kitchen', name_ar: 'المنزل والمطبخ', name_en: 'Home & Kitchen' },
  { slug: 'food-grocery', name_ar: 'مواد غذائية', name_en: 'Food & Grocery' },
  { slug: 'beauty', name_ar: 'العناية الشخصية', name_en: 'Beauty & Personal Care' },
  { slug: 'books', name_ar: 'كتب', name_en: 'Books' },
];

async function seedCategories() {
  let order = 0;
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, sort_order: order++, is_active: true },
    });
  }
  console.log(`✓ Categories: ${CATEGORIES.length}`);
}

const PRODUCTS: Array<{
  slug: string;
  category_slug: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  stock: number;
  is_featured?: boolean;
}> = [
  { slug: 'samsung-a15', category_slug: 'electronics', name_ar: 'سامسونج جالاكسي A15', name_en: 'Samsung Galaxy A15', description_ar: 'هاتف ذكي اقتصادي بكاميرا ثلاثية وذاكرة 128 جيجابايت.', description_en: 'Budget smartphone with triple camera and 128GB storage.', price: 185000, stock: 12, is_featured: true },
  { slug: 'tecno-spark', category_slug: 'electronics', name_ar: 'تكنو سبارك 20', name_en: 'Tecno Spark 20', description_ar: 'هاتف ذكي بشاشة 6.6 بوصة وبطارية 5000 ملي أمبير.', description_en: '6.6" display, 5000mAh battery.', price: 95000, stock: 25 },
  { slug: 'anker-powerbank', category_slug: 'electronics', name_ar: 'باور بانك أنكر 20000', name_en: 'Anker PowerCore 20000', description_ar: 'شاحن محمول 20000 ملي أمبير، يدعم الشحن السريع.', description_en: '20000mAh portable charger, fast-charge compatible.', price: 22000, stock: 40 },
  { slug: 'thobe-sudani', category_slug: 'fashion', name_ar: 'ثوب سوداني تقليدي', name_en: 'Traditional Sudanese Thobe', description_ar: 'ثوب نسائي بقماش خفيف ومريح، متوفر بألوان متعددة.', description_en: 'Lightweight women\'s traditional thobe, multiple colors.', price: 18000, stock: 30, is_featured: true },
  { slug: 'jalabiya-mens', category_slug: 'fashion', name_ar: 'جلابية رجالي', name_en: 'Men\'s Jalabiya', description_ar: 'جلابية بيضاء قطنية بقياسات متعددة.', description_en: 'White cotton jalabiya in multiple sizes.', price: 14500, stock: 22 },
  { slug: 'leather-sandals', category_slug: 'fashion', name_ar: 'صندل جلد سوداني', name_en: 'Sudanese Leather Sandals', description_ar: 'صندل من الجلد الطبيعي بصناعة يدوية.', description_en: 'Handmade genuine-leather sandals.', price: 9000, stock: 35 },
  { slug: 'kanoun-charcoal', category_slug: 'home-kitchen', name_ar: 'كانون فحم سوداني', name_en: 'Sudanese Charcoal Brazier', description_ar: 'كانون تقليدي للقهوة والشاي، مصنوع من الطين.', description_en: 'Traditional clay brazier for coffee and tea.', price: 6500, stock: 18 },
  { slug: 'jebena-coffee-pot', category_slug: 'home-kitchen', name_ar: 'جبنة قهوة سودانية', name_en: 'Sudanese Coffee Pot (Jebena)', description_ar: 'إبريق قهوة فخاري تقليدي.', description_en: 'Traditional clay coffee pot.', price: 4500, stock: 28 },
  { slug: 'tea-set-6', category_slug: 'home-kitchen', name_ar: 'طقم أكواب شاي ٦ قطع', name_en: '6-Piece Tea Glass Set', description_ar: 'طقم أكواب شاي زجاجية بستة قطع وصينية.', description_en: 'Six glass tea cups with tray.', price: 7000, stock: 50 },
  { slug: 'karkadeh', category_slug: 'food-grocery', name_ar: 'كركديه سوداني (كيلو)', name_en: 'Sudanese Hibiscus (1kg)', description_ar: 'كركديه طبيعي عالي الجودة من الإقليم الشرقي.', description_en: 'High-quality hibiscus from eastern Sudan.', price: 3200, stock: 100, is_featured: true },
  { slug: 'gum-arabic', category_slug: 'food-grocery', name_ar: 'صمغ عربي (نصف كيلو)', name_en: 'Gum Arabic (500g)', description_ar: 'صمغ عربي نقي من كردفان.', description_en: 'Pure gum arabic from Kordofan.', price: 4800, stock: 60 },
  { slug: 'ajwa-dates', category_slug: 'food-grocery', name_ar: 'تمر عجوة (كيلو)', name_en: 'Ajwa Dates (1kg)', description_ar: 'تمر عجوة طازج، يعبأ يدوياً.', description_en: 'Fresh Ajwa dates, hand-packed.', price: 5500, stock: 45 },
  { slug: 'shea-butter', category_slug: 'beauty', name_ar: 'زبدة الشيا الطبيعية', name_en: 'Natural Shea Butter', description_ar: 'زبدة شيا خام للعناية بالبشرة والشعر.', description_en: 'Raw shea butter for skin and hair care.', price: 4000, stock: 70 },
  { slug: 'frankincense-oil', category_slug: 'beauty', name_ar: 'زيت اللبان الطبيعي', name_en: 'Pure Frankincense Oil', description_ar: 'زيت لبان طبيعي 30 مل.', description_en: 'Pure frankincense oil, 30ml.', price: 6800, stock: 32 },
  { slug: 'rose-water', category_slug: 'beauty', name_ar: 'ماء الورد الطبيعي', name_en: 'Natural Rose Water', description_ar: 'ماء ورد طبيعي 250 مل للعناية بالبشرة.', description_en: 'Natural rose water 250ml.', price: 2500, stock: 80 },
  { slug: 'tayeb-saleh-collection', category_slug: 'books', name_ar: 'موسم الهجرة إلى الشمال — الطيب صالح', name_en: 'Season of Migration to the North — Tayeb Salih', description_ar: 'رواية كلاسيكية للروائي السوداني الطيب صالح.', description_en: 'Classic novel by the Sudanese author Tayeb Salih.', price: 3500, stock: 25 },
  { slug: 'sudan-history', category_slug: 'books', name_ar: 'تاريخ السودان الحديث', name_en: 'Modern History of Sudan', description_ar: 'مرجع تاريخي شامل عن السودان الحديث.', description_en: 'Comprehensive reference on modern Sudan.', price: 6500, stock: 15 },
  { slug: 'arabic-cookbook', category_slug: 'books', name_ar: 'المطبخ السوداني الأصيل', name_en: 'Authentic Sudanese Cooking', description_ar: 'كتاب وصفات للمطبخ السوداني التقليدي.', description_en: 'Recipe book for traditional Sudanese cuisine.', price: 4200, stock: 20 },
  { slug: 'prayer-mat', category_slug: 'home-kitchen', name_ar: 'سجادة صلاة فاخرة', name_en: 'Premium Prayer Mat', description_ar: 'سجادة صلاة مخملية بطبعات إسلامية.', description_en: 'Velvet prayer mat with Islamic patterns.', price: 3800, stock: 50 },
  { slug: 'hibiscus-juice-glass', category_slug: 'home-kitchen', name_ar: 'إبريق كركديه زجاجي', name_en: 'Hibiscus Juice Pitcher', description_ar: 'إبريق زجاجي بسعة 1.5 لتر مع غطاء.', description_en: 'Glass pitcher 1.5L with lid.', price: 5200, stock: 38 },
];

async function seedProducts() {
  const categories = await prisma.category.findMany();
  const bySlug = new Map(categories.map((c) => [c.slug, c.id]));

  for (const p of PRODUCTS) {
    const category_id = bySlug.get(p.category_slug);
    if (!category_id) {
      console.warn(`! Missing category for ${p.slug}`);
      continue;
    }
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { price: p.price, stock: p.stock, is_featured: p.is_featured ?? false },
      create: {
        slug: p.slug,
        name_ar: p.name_ar,
        name_en: p.name_en,
        description_ar: p.description_ar,
        description_en: p.description_en,
        price: p.price,
        stock: p.stock,
        is_featured: p.is_featured ?? false,
        is_active: true,
        category_id,
      },
    });
  }
  console.log(`✓ Products: ${PRODUCTS.length}`);
}

async function main() {
  console.log('Seeding Bartal database…');
  await seedAdmin();
  await seedDeliveryZones();
  await seedAppSettings();
  await seedCategories();
  await seedProducts();
  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
