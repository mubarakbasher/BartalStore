// tokens.jsx — Bartal design tokens + shared primitives
// Declares the system used across mobile/web/admin surfaces.

// ─── PALETTE ────────────────────────────────────────────────
// Primary: deep navy #1B3A6B (per spec). Accent: amber #D4860B.
// I've derived a tonal ramp + dark-mode pair that keeps the
// amber readable on navy (WCAG AA body text).
const BARTAL = {
  // Light
  navy:       '#1B3A6B',
  navyDeep:   '#122647',
  navyInk:    '#0B1930',
  amber:      '#D4860B',
  amberSoft:  '#F2B544',
  amberTint:  '#FDF4E2',
  sand:       '#F7F3EC',   // warm background tint
  paper:      '#FBFAF7',
  surface:    '#FFFFFF',
  line:       '#E8E2D5',
  text:       '#1A1A1A',
  textMute:   '#6B6356',
  success:    '#2E7D32',
  danger:     '#C62828',
  info:       '#3A6DB0',

  // Dark
  d_bg:       '#0B1930',
  d_surface:  '#132744',
  d_raised:   '#1B3358',
  d_line:     '#254270',
  d_text:     '#F3EFE6',
  d_textMute: '#9FB1CE',
};

// ─── SUDANESE GEOMETRIC MOTIF ──────────────────────────────
// Subtle interlocking-star tile used as background/hero motif.
// Drawn from traditional Islamic geometric patterns common in
// Sudanese architecture (8-fold star + cross). Monochrome, low opacity.
function MotifTile({ color = BARTAL.navy, opacity = 0.08, size = 80, strokeWidth = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ display: 'block' }}>
      <defs>
        <pattern id={`motif-${color.replace('#','')}`} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <g stroke={color} strokeWidth={strokeWidth} fill="none" opacity={opacity}>
            {/* 8-point star */}
            <path d="M40 8 L48 24 L64 16 L56 32 L72 40 L56 48 L64 64 L48 56 L40 72 L32 56 L16 64 L24 48 L8 40 L24 32 L16 16 L32 24 Z"/>
            {/* inner square rotated */}
            <path d="M40 24 L56 40 L40 56 L24 40 Z"/>
            {/* corner crosses */}
            <path d="M0 0 L8 8 M80 0 L72 8 M0 80 L8 72 M80 80 L72 72"/>
          </g>
        </pattern>
      </defs>
      <rect width="80" height="80" fill={`url(#motif-${color.replace('#','')})`}/>
    </svg>
  );
}

// Motif as repeating background — used on checkout banner, receipt state
function MotifBg({ color = BARTAL.navy, opacity = 0.06, children, style = {} }) {
  const id = `motif-bg-${color.replace('#','')}-${Math.floor(opacity*100)}`;
  return (
    <div style={{ position: 'relative', ...style }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <defs>
          <pattern id={id} x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
            <g stroke={color} strokeWidth="1" fill="none" opacity={opacity}>
              <path d="M32 6 L38 19 L51 13 L45 26 L58 32 L45 38 L51 51 L38 45 L32 58 L26 45 L13 51 L19 38 L6 32 L19 26 L13 13 L26 19 Z"/>
              <path d="M32 19 L45 32 L32 45 L19 32 Z"/>
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`}/>
      </svg>
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}

// ─── BARTAL WORDMARK ───────────────────────────────────────
// Arabic "برتال" + Latin "bartal" lockup.
function BartalLogo({ color = BARTAL.navy, accent = BARTAL.amber, size = 28, lang = 'ar', compact = false }) {
  if (compact) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <LogoMark color={color} accent={accent} size={size} />
      </div>
    );
  }
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <LogoMark color={color} accent={accent} size={size} />
      <div style={{
        fontFamily: lang === 'ar' ? "'Cairo', system-ui" : "'Poppins', system-ui",
        fontWeight: 700, fontSize: size * 0.85, color, letterSpacing: lang === 'ar' ? 0 : -0.5,
        lineHeight: 1,
      }}>
        {lang === 'ar' ? 'برتال' : 'bartal'}
      </div>
    </div>
  );
}

// Logo mark: 8-pointed star with amber centre — doorway/portal metaphor (برتال = portal)
function LogoMark({ color = BARTAL.navy, accent = BARTAL.amber, size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <path d="M16 2 L20 12 L30 12 L22 18 L26 28 L16 22 L6 28 L10 18 L2 12 L12 12 Z"
            fill={color}/>
      <circle cx="16" cy="17" r="3.2" fill={accent}/>
    </svg>
  );
}

// ─── STRIPED PLACEHOLDER (for product imagery) ─────────────
// Subtly-striped box with a monospace label.
function ProductPlaceholder({ label = 'product', hue = 'warm', dark = false, style = {} }) {
  const palettes = {
    warm:   ['#F2E3C4', '#E8D3A8', '#D4B982'],
    navy:   ['#D7DDE8', '#B7C4D8', '#8FA3C2'],
    amber:  ['#FBEACB', '#F2D79E', '#E5B867'],
    rose:   ['#F0DAD2', '#DDBCB0', '#C5998C'],
    green:  ['#D9E3D4', '#BACBB0', '#95AF87'],
    night:  ['#1B3358', '#254270', '#0B1930'],
  };
  const p = palettes[hue] || palettes.warm;
  const id = `ph-${hue}-${label.replace(/\W/g,'')}`;
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      overflow: 'hidden', borderRadius: 'inherit',
      ...style,
    }}>
      <svg width="100%" height="100%" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={id} x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="12" fill={p[0]}/>
            <rect x="6" width="6" height="12" fill={p[1]}/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={p[0]}/>
        <rect width="100%" height="100%" fill={`url(#${id})`}/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'JetBrains Mono', 'SF Mono', ui-monospace, monospace",
        fontSize: 10, color: p[2], textTransform: 'uppercase', letterSpacing: 1,
        padding: 8, textAlign: 'center',
      }}>
        {label}
      </div>
    </div>
  );
}

// ─── PRICE TAG (always SDG, locale-aware numerals) ─────────
function fmtSDG(amount, lang = 'en', numerals = 'latin') {
  const latin = new Intl.NumberFormat('en-US').format(amount);
  if (numerals === 'arabic') {
    // Eastern Arabic numerals ٠-٩
    const map = '٠١٢٣٤٥٦٧٨٩';
    return latin.replace(/\d/g, d => map[+d]);
  }
  return latin;
}

function PriceTag({ amount, lang = 'en', numerals = 'latin', size = 16, color, strong = true, compare }) {
  const formatted = fmtSDG(amount, lang, numerals);
  const unit = lang === 'ar' ? 'ج.س' : 'SDG';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'baseline', gap: 4,
      fontFamily: lang === 'ar' ? "'Cairo', system-ui" : "'Poppins', system-ui",
      color: color || BARTAL.navyInk,
      direction: lang === 'ar' ? 'rtl' : 'ltr',
    }}>
      <span style={{ fontSize: size, fontWeight: strong ? 700 : 500 }}>{formatted}</span>
      <span style={{ fontSize: size * 0.65, fontWeight: 500, opacity: 0.7 }}>{unit}</span>
      {compare != null && (
        <span style={{
          fontSize: size * 0.75, fontWeight: 400, opacity: 0.5,
          textDecoration: 'line-through', marginInlineStart: 6,
        }}>{fmtSDG(compare, lang, numerals)}</span>
      )}
    </span>
  );
}

// ─── TYPE STYLES ──────────────────────────────────────────
// Cairo for AR, Poppins for EN — loaded globally.
const typeStyle = (lang, variant, dark) => {
  const fam = lang === 'ar' ? "'Cairo', system-ui" : "'Poppins', system-ui";
  const color = dark ? BARTAL.d_text : BARTAL.text;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const v = {
    display: { fontFamily: fam, fontWeight: 700, fontSize: 32, lineHeight: 1.15, color, letterSpacing: lang === 'ar' ? 0 : -0.5 },
    h1:      { fontFamily: fam, fontWeight: 700, fontSize: 24, lineHeight: 1.2, color },
    h2:      { fontFamily: fam, fontWeight: 600, fontSize: 20, lineHeight: 1.3, color },
    h3:      { fontFamily: fam, fontWeight: 600, fontSize: 17, lineHeight: 1.35, color },
    body:    { fontFamily: fam, fontWeight: 400, fontSize: 15, lineHeight: 1.5, color },
    small:   { fontFamily: fam, fontWeight: 400, fontSize: 13, lineHeight: 1.45, color: muted },
    micro:   { fontFamily: fam, fontWeight: 500, fontSize: 11, lineHeight: 1.3, color: muted, letterSpacing: 0.5, textTransform: 'uppercase' },
    label:   { fontFamily: fam, fontWeight: 500, fontSize: 14, lineHeight: 1.3, color },
    mono:    { fontFamily: "'JetBrains Mono', 'SF Mono', ui-monospace, monospace", fontWeight: 500, fontSize: 12, color },
  };
  return v[variant] || v.body;
};

// ─── i18n strings ─────────────────────────────────────────
const STR = {
  // common
  home:         { ar: 'الرئيسية',      en: 'Home' },
  shop:         { ar: 'المتجر',        en: 'Shop' },
  cart:         { ar: 'السلة',          en: 'Cart' },
  orders:       { ar: 'طلباتي',         en: 'Orders' },
  profile:      { ar: 'حسابي',         en: 'Profile' },
  search:       { ar: 'ابحث عن أي شيء', en: 'Search anything' },
  categories:   { ar: 'الفئات',        en: 'Categories' },
  featured:     { ar: 'مختارات بارتال', en: 'Featured' },
  newArrivals:  { ar: 'وصل حديثاً',    en: 'New arrivals' },
  seeAll:       { ar: 'عرض الكل',      en: 'See all' },
  addToCart:    { ar: 'أضف إلى السلة',  en: 'Add to cart' },
  buyNow:       { ar: 'اشتر الآن',     en: 'Buy now' },
  outOfStock:   { ar: 'نفذت الكمية',    en: 'Out of stock' },
  inStock:      { ar: 'متوفر',          en: 'In stock' },
  reviews:      { ar: 'تقييم',          en: 'reviews' },
  description:  { ar: 'الوصف',         en: 'Description' },
  specs:        { ar: 'المواصفات',      en: 'Specifications' },
  deliveryTo:   { ar: 'التوصيل إلى',    en: 'Deliver to' },
  deliveryFee:  { ar: 'رسوم التوصيل',   en: 'Delivery fee' },
  freeDelivery: { ar: 'توصيل مجاني',    en: 'Free delivery' },
  subtotal:     { ar: 'المجموع الفرعي', en: 'Subtotal' },
  total:        { ar: 'الإجمالي',       en: 'Total' },
  checkout:     { ar: 'إتمام الشراء',   en: 'Checkout' },
  bankTransfer: { ar: 'تحويل بنكي',     en: 'Bank transfer' },
  cod:          { ar: 'الدفع عند الاستلام', en: 'Cash on delivery' },
  landmark:     { ar: 'علامة مميزة',    en: 'Landmark' },
  landmarkHint: { ar: 'بجوار مسجد الفتح، البوابة الزرقاء', en: 'Near Al-Fateh mosque, blue gate' },
  uploadReceipt:{ ar: 'رفع صورة الإيصال', en: 'Upload receipt' },
  zoneA:        { ar: 'وسط الخرطوم',    en: 'Central Khartoum' },
  zoneB:        { ar: 'أمدرمان',        en: 'Omdurman' },
  zoneC:        { ar: 'بحري',           en: 'Bahri (North)' },
  zoneD:        { ar: 'شرق الخرطوم',    en: 'East Khartoum' },
  offline:      { ar: 'أنت غير متصل بالإنترنت', en: "You're offline" },
  tagline:      { ar: 'بوابتك للتسوق في السودان', en: 'Your gateway to shopping in Sudan' },
};
const t = (key, lang) => (STR[key] && STR[key][lang]) || key;

// ─── BARTAL SAMPLE CATALOG ────────────────────────────────
// Electronics + Beauty/fragrance (per answer)
const CATALOG = [
  { id: 'p1', cat: 'electronics', hue: 'navy',
    name_ar: 'سماعات لاسلكية برو', name_en: 'Wireless Pro Headphones',
    brand: 'Anker', price: 185000, compare: 220000, rating: 4.7, reviews: 128, stock: 12,
    tagline_ar: 'عزل ضوضاء نشط · 40 ساعة بطارية',
    tagline_en: 'Active noise-cancelling · 40h battery' },
  { id: 'p2', cat: 'fragrance', hue: 'amber',
    name_ar: 'دهن العود الملكي', name_en: 'Royal Oud Perfume Oil',
    brand: 'Ajmal', price: 42000, compare: null, rating: 4.9, reviews: 312, stock: 38,
    tagline_ar: '3 مل · عود كمبودي فاخر',
    tagline_en: '3ml · Cambodian oud, gift-boxed' },
  { id: 'p3', cat: 'electronics', hue: 'navy',
    name_ar: 'هاتف ذكي 128 جيجا', name_en: 'Smartphone 128GB',
    brand: 'Samsung', price: 620000, compare: 695000, rating: 4.5, reviews: 54, stock: 6,
    tagline_ar: 'شاشة أموليد 6.5" · بطارية 5000',
    tagline_en: '6.5" AMOLED · 5000mAh battery' },
  { id: 'p4', cat: 'fragrance', hue: 'rose',
    name_ar: 'عطر شرقي نسائي', name_en: 'Rose Attar',
    brand: 'Al Haramain', price: 28500, compare: null, rating: 4.8, reviews: 201, stock: 22,
    tagline_ar: 'مستخلص الورد الطائفي · 6 مل',
    tagline_en: 'Taif rose extract · 6ml' },
  { id: 'p5', cat: 'electronics', hue: 'night',
    name_ar: 'ساعة ذكية', name_en: 'Smartwatch Series 5',
    brand: 'Xiaomi', price: 95000, compare: null, rating: 4.4, reviews: 88, stock: 15,
    tagline_ar: 'مقاومة للماء · قياس النبض',
    tagline_en: 'Water-resistant · Heart rate' },
  { id: 'p6', cat: 'fragrance', hue: 'warm',
    name_ar: 'بخور عود هندي', name_en: 'Indian Agarwood Bakhoor',
    brand: 'Nabeel', price: 18000, compare: 22000, rating: 4.6, reviews: 144, stock: 40,
    tagline_ar: '50 جرام · رائحة تدوم',
    tagline_en: '50g · long-lasting' },
];

Object.assign(window, {
  BARTAL, MotifTile, MotifBg, BartalLogo, LogoMark,
  ProductPlaceholder, PriceTag, fmtSDG, typeStyle,
  STR, t, CATALOG,
});
