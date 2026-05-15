/**
 * Page-level translations. Re-uses @bartal/shared for cross-stack strings
 * (auth labels, status names, error envelopes) and adds web-specific copy
 * pulled from the Claude design (docs/design/bartal/project/tokens.jsx → STR).
 */
import { ar as sharedAr, en as sharedEn, type Translations } from '@bartal/shared';
import type { Locale } from './config';

const webAr = {
  announcement: 'توصيل مجاني على الطلبات فوق ٥٠٬٠٠٠ ج.س — جميع مناطق الخرطوم',
  nav: {
    home: 'الرئيسية',
    electronics: 'الإلكترونيات',
    fragrance: 'العطور',
    offers: 'العروض',
    categories: 'الفئات',
  },
  hero: {
    eyebrow: 'مجموعة الربيع',
    title: 'كل ما تحتاجه، من بابك.',
    body: 'آلاف المنتجات بأسعار مميزة. توصيل سريع عبر الخرطوم.',
    cta: 'تسوق الآن',
  },
  sections: {
    featured: 'مختارات بَرتال',
    newArrivals: 'وصل حديثاً',
    seeAll: 'عرض الكل',
    shopByCategory: 'تسوق حسب القسم',
  },
  product: {
    addToCart: 'أضف إلى السلة',
    buyNow: 'اشتر الآن',
    inStock: 'متوفر',
    outOfStock: 'نفذت الكمية',
    lowStock: 'تبقى {count} فقط',
    reviewsCount: '{count} تقييم',
    description: 'الوصف',
    specs: 'المواصفات',
    quantity: 'الكمية',
    brand: 'الماركة',
    sku: 'الرمز',
  },
  filters: {
    title: 'تصفية',
    price: 'السعر (ج.س)',
    brand: 'الماركة',
    type: 'النوع',
    delivery: 'التوصيل',
    sameDay: 'متوفر اليوم',
    sort: {
      bestSelling: 'الأكثر مبيعاً',
      newest: 'الأحدث',
      priceLow: 'السعر: الأقل',
      priceHigh: 'السعر: الأعلى',
    },
    showMore: '+ المزيد',
    productsCount: '{count} منتج',
  },
  cart: {
    title: 'سلتك',
    empty: 'سلتك فارغة',
    emptyHint: 'لم تضف أي منتج بعد. ابدأ التسوق الآن.',
    subtotal: 'المجموع الفرعي',
    deliveryFee: 'رسوم التوصيل',
    total: 'الإجمالي',
    checkout: 'إتمام الشراء',
    continueShopping: 'متابعة التسوق',
    qtyInCart: 'في السلة',
    delivery: {
      free: 'توصيل مجاني',
      to: 'التوصيل إلى',
      estimated: 'الوصول المتوقع {days} أيام',
    },
  },
  auth: {
    loginTitle: 'تسجيل الدخول',
    loginSubtitle: 'أدخل رقم هاتفك للمتابعة.',
    registerTitle: 'إنشاء حساب جديد',
    registerSubtitle: 'انضم إلى بَرتال خلال دقيقة.',
    phone: 'رقم الهاتف',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    fullName: 'الاسم الكامل',
    submit: 'متابعة',
    forgot: 'نسيت كلمة المرور؟',
    haveAccount: 'لديك حساب بالفعل؟',
    noAccount: 'ليس لديك حساب؟',
    comingSoon: 'مرحلة المصادقة قيد التنفيذ — ستعمل هذه الصفحة في الإصدار القادم.',
  },
  account: {
    title: 'حسابي',
    profile: 'الملف الشخصي',
    addresses: 'العناوين',
    orders: 'طلباتي',
    wishlist: 'المفضلة',
    security: 'الأمان',
    logout: 'تسجيل الخروج',
    loginRequired: 'يلزم تسجيل الدخول',
    loginRequiredHint: 'سجّل دخولك لعرض هذه الصفحة.',
  },
  checkout: {
    title: 'إتمام الشراء',
    step1: 'العنوان',
    step2: 'الدفع',
    step3: 'المراجعة',
    placeOrder: 'تأكيد الطلب',
    comingSoon: 'إتمام الشراء يفعّل بعد ربط المصادقة. المعاينة فقط حالياً.',
  },
  footer: {
    shipping: 'سياسة الشحن',
    returns: 'الإرجاع',
    contact: 'اتصل بنا',
    whatsapp: 'واتساب',
    copyright: '© 2026 بَرتال · الخرطوم، السودان',
  },
  search: {
    placeholder: 'ابحث عن أي شيء',
    noResults: 'لا توجد منتجات مطابقة لبحثك.',
  },
  errors: {
    loadFailed: 'تعذّر تحميل البيانات.',
    retry: 'حاول مرة أخرى',
    offline: 'أنت غير متصل بالإنترنت',
  },
};

const webEn: typeof webAr = {
  announcement: 'Free delivery on orders over 50,000 SDG — all Khartoum zones',
  nav: {
    home: 'Home',
    electronics: 'Electronics',
    fragrance: 'Fragrance',
    offers: 'Offers',
    categories: 'Categories',
  },
  hero: {
    eyebrow: 'Spring collection',
    title: 'Everything you need, delivered.',
    body: 'Thousands of products at great prices. Fast delivery across Khartoum.',
    cta: 'Shop now',
  },
  sections: {
    featured: 'Bartal picks',
    newArrivals: 'New arrivals',
    seeAll: 'See all',
    shopByCategory: 'Shop by category',
  },
  product: {
    addToCart: 'Add to cart',
    buyNow: 'Buy now',
    inStock: 'In stock',
    outOfStock: 'Out of stock',
    lowStock: 'Only {count} left',
    reviewsCount: '{count} reviews',
    description: 'Description',
    specs: 'Specifications',
    quantity: 'Quantity',
    brand: 'Brand',
    sku: 'SKU',
  },
  filters: {
    title: 'Filters',
    price: 'Price (SDG)',
    brand: 'Brand',
    type: 'Type',
    delivery: 'Delivery',
    sameDay: 'Same day',
    sort: {
      bestSelling: 'Best selling',
      newest: 'Newest',
      priceLow: 'Price: low',
      priceHigh: 'Price: high',
    },
    showMore: '+ Show more',
    productsCount: '{count} products',
  },
  cart: {
    title: 'Your cart',
    empty: 'Your cart is empty',
    emptyHint: 'No items yet. Start shopping now.',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery fee',
    total: 'Total',
    checkout: 'Checkout',
    continueShopping: 'Continue shopping',
    qtyInCart: 'in cart',
    delivery: {
      free: 'Free delivery',
      to: 'Deliver to',
      estimated: 'Arrives in {days} days',
    },
  },
  auth: {
    loginTitle: 'Log in',
    loginSubtitle: 'Enter your phone number to continue.',
    registerTitle: 'Create an account',
    registerSubtitle: 'Join Bartal in under a minute.',
    phone: 'Phone number',
    password: 'Password',
    confirmPassword: 'Confirm password',
    fullName: 'Full name',
    submit: 'Continue',
    forgot: 'Forgot password?',
    haveAccount: 'Already have an account?',
    noAccount: "Don't have an account?",
    comingSoon: 'Auth is still being wired — this page goes live in the next pass.',
  },
  account: {
    title: 'My account',
    profile: 'Profile',
    addresses: 'Addresses',
    orders: 'Orders',
    wishlist: 'Wishlist',
    security: 'Security',
    logout: 'Log out',
    loginRequired: 'Log in required',
    loginRequiredHint: 'Sign in to view this page.',
  },
  checkout: {
    title: 'Checkout',
    step1: 'Address',
    step2: 'Payment',
    step3: 'Review',
    placeOrder: 'Place order',
    comingSoon: 'Checkout activates once auth lands. Preview only for now.',
  },
  footer: {
    shipping: 'Shipping',
    returns: 'Returns',
    contact: 'Contact',
    whatsapp: 'WhatsApp',
    copyright: '© 2026 Bartal · Khartoum, Sudan',
  },
  search: {
    placeholder: 'Search anything',
    noResults: 'No products match your search.',
  },
  errors: {
    loadFailed: 'Failed to load data.',
    retry: 'Try again',
    offline: "You're offline",
  },
};

export interface Dictionary {
  shared: Translations;
  web: typeof webAr;
}

export const dictionaries: Record<Locale, Dictionary> = {
  ar: { shared: sharedAr, web: webAr },
  en: { shared: sharedEn, web: webEn },
};

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

/** Interpolate `{key}` placeholders in a translation string. */
export function tt(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
}
