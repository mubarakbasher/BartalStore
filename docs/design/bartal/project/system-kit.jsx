// system-kit.jsx — Empty states, errors, offline, skeletons + static pages (About, Privacy, Contact, 404)
// AR/EN, light/dark.

// ═══════════════════════════════════════════════════════════════
// MOBILE: EMPTY STATES — reusable component
// ═══════════════════════════════════════════════════════════════
function MobileEmptyState({ lang, dark, kind = 'cart', onNav, onBack }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const text = dark ? BARTAL.d_text : BARTAL.navyInk;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;

  const variants = {
    cart: {
      title_ar: 'سلتك فارغة',          title_en: 'Your cart is empty',
      body_ar:  'اكتشف منتجات رائعة وأضفها لسلتك — من العطور إلى الإلكترونيات.',
      body_en:  'Discover great products — fragrance, electronics, fashion and more.',
      cta_ar: 'ابدأ التسوق', cta_en: 'Browse products', go: 'home',
      illo: 'cart',
    },
    orders: {
      title_ar: 'لا توجد طلبات بعد',    title_en: 'No orders yet',
      body_ar:  'طلباتك ستظهر هنا فور إتمام أول عملية شراء.',
      body_en:  'Your orders will appear here once you\u2019ve placed your first one.',
      cta_ar: 'تسوق الآن', cta_en: 'Start shopping', go: 'home',
      illo: 'package',
    },
    search: {
      title_ar: 'لا توجد نتائج',        title_en: 'No results found',
      body_ar:  'جرّب كلمات بحث أخرى أو تصفح الفئات.',
      body_en:  'Try different keywords or browse our categories.',
      cta_ar: 'تصفح الفئات', cta_en: 'Browse categories', go: 'home',
      illo: 'search',
    },
    addresses: {
      title_ar: 'لا توجد عناوين',       title_en: 'No saved addresses',
      body_ar:  'أضف عنواناً لتسريع عملية الدفع في المرات القادمة.',
      body_en:  'Add an address to speed up checkout next time.',
      cta_ar: 'أضف عنواناً', cta_en: 'Add address', go: 'addAddress',
      illo: 'pin',
    },
  };
  const v = variants[kind] || variants.cart;

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'hidden',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 18, border: `1px solid ${line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ChevronIcon color={text} flipped={isAr} size={18}/>
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: text }}>
          {kind === 'cart' ? (isAr ? 'سلتي' : 'My cart')
            : kind === 'orders' ? (isAr ? 'طلباتي' : 'My orders')
            : kind === 'search' ? (isAr ? 'البحث' : 'Search')
            : (isAr ? 'عناويني' : 'My addresses')}
        </div>
      </div>

      {/* Centered empty illo + copy */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 36px', textAlign: 'center',
      }}>
        <EmptyIllustration kind={v.illo} dark={dark}/>

        <div style={{ fontSize: 20, fontWeight: 700, color: text, marginTop: 22, marginBottom: 10 }}>
          {isAr ? v.title_ar : v.title_en}
        </div>
        <div style={{ fontSize: 13, color: muted, lineHeight: 1.6, maxWidth: 280, marginBottom: 28 }}>
          {isAr ? v.body_ar : v.body_en}
        </div>

        <button onClick={() => onNav && onNav(v.go)} style={{
          background: BARTAL.amber, color: '#fff', border: 'none',
          padding: '13px 32px', borderRadius: 12, fontSize: 14, fontWeight: 700,
          fontFamily: 'inherit',
        }}>
          {isAr ? v.cta_ar : v.cta_en}
        </button>
      </div>
    </div>
  );
}

// Empty-state SVG illustrations
function EmptyIllustration({ kind, dark }) {
  const stroke = dark ? BARTAL.d_line : '#E5DFD4';
  const fill = dark ? BARTAL.d_raised : '#FAF7F0';
  if (kind === 'cart') {
    return (
      <svg width="148" height="132" viewBox="0 0 148 132" fill="none">
        <rect x="28" y="42" width="92" height="70" rx="6" fill={fill} stroke={stroke} strokeWidth="1.5"/>
        <path d="M20 28 L32 28 L42 82 L118 82" stroke={BARTAL.amber} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="54" cy="108" r="8" fill={BARTAL.amber}/>
        <circle cx="104" cy="108" r="8" fill={BARTAL.amber}/>
        <path d="M56 52 L88 52 M56 64 L76 64" stroke={stroke} strokeWidth="2" strokeLinecap="round"/>
        {/* floating star motif */}
        <g transform="translate(110 20)" opacity="0.4">
          <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill={BARTAL.amber}/>
        </g>
      </svg>
    );
  }
  if (kind === 'package') {
    return (
      <svg width="148" height="132" viewBox="0 0 148 132" fill="none">
        <path d="M74 14 L124 36 L124 92 L74 114 L24 92 L24 36 Z" fill={fill} stroke={stroke} strokeWidth="1.5"/>
        <path d="M24 36 L74 58 L124 36" stroke={stroke} strokeWidth="1.5"/>
        <path d="M74 58 L74 114" stroke={stroke} strokeWidth="1.5"/>
        <path d="M49 25 L99 47" stroke={BARTAL.amber} strokeWidth="2.5"/>
        <circle cx="74" cy="70" r="4" fill={BARTAL.amber}/>
      </svg>
    );
  }
  if (kind === 'search') {
    return (
      <svg width="148" height="132" viewBox="0 0 148 132" fill="none">
        <circle cx="62" cy="58" r="30" fill={fill} stroke={stroke} strokeWidth="1.5"/>
        <path d="M84 80 L110 106" stroke={BARTAL.amber} strokeWidth="4" strokeLinecap="round"/>
        <path d="M50 58 L74 58 M62 46 L62 70" stroke={stroke} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  }
  // pin
  return (
    <svg width="148" height="132" viewBox="0 0 148 132" fill="none">
      <path d="M74 18 C55 18 40 33 40 52 C40 76 74 112 74 112 C74 112 108 76 108 52 C108 33 93 18 74 18 Z" fill={fill} stroke={stroke} strokeWidth="1.5"/>
      <circle cx="74" cy="52" r="12" fill={BARTAL.amber}/>
      <path d="M30 118 L118 118" stroke={stroke} strokeWidth="2" strokeDasharray="4 4"/>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOBILE: ERROR / OFFLINE
// ═══════════════════════════════════════════════════════════════
function MobileErrorScreen({ lang, dark, kind = 'error', onBack }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const text = dark ? BARTAL.d_text : BARTAL.navyInk;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;

  const variants = {
    error: {
      tag_ar: 'خطأ في الخادم',           tag_en: 'Server error',
      title_ar: 'حدث خطأ غير متوقع',     title_en: 'Something went wrong',
      body_ar:  'نحن نعمل على إصلاح المشكلة. حاول مرة أخرى بعد قليل.',
      body_en:  'We\u2019re working on a fix. Try again in a moment.',
      cta_ar: 'إعادة المحاولة', cta_en: 'Try again',
      code: '500',
      color: BARTAL.danger,
    },
    offline: {
      tag_ar: 'غير متصل',                tag_en: 'Offline',
      title_ar: 'لا يوجد اتصال بالإنترنت', title_en: 'No internet connection',
      body_ar:  'تحقق من الواي فاي أو البيانات الخلوية وحاول مجدداً.',
      body_en:  'Check your Wi-Fi or mobile data and try again.',
      cta_ar: 'إعادة المحاولة', cta_en: 'Retry',
      code: 'WiFi',
      color: BARTAL.navy,
    },
  };
  const v = variants[kind] || variants.error;

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'hidden',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
      display: 'flex', flexDirection: 'column',
    }}>
      {kind === 'offline' && (
        <div style={{
          background: BARTAL.danger, color: '#fff',
          padding: '8px 16px', fontSize: 12, fontWeight: 600, textAlign: 'center',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: '#fff', animation: 'blink 1.2s infinite' }}/>
          {isAr ? 'أنت غير متصل بالإنترنت' : 'You are offline'}
        </div>
      )}

      <div style={{ padding: '14px 18px' }}>
        <div onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 18, border: `1px solid ${line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ChevronIcon color={text} flipped={isAr} size={18}/>
        </div>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 36px', textAlign: 'center',
      }}>
        {/* Glyph / code block */}
        <div style={{ position: 'relative', marginBottom: 28 }}>
          <div style={{
            width: 120, height: 120, borderRadius: 28,
            background: dark ? BARTAL.d_raised : '#fff',
            border: `2px solid ${v.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 14px 40px ${v.color}22`,
          }}>
            {kind === 'offline' ? (
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <path d="M30 44 L30 44.01" stroke={v.color} strokeWidth="4" strokeLinecap="round"/>
                <path d="M18 34 C23 30 37 30 42 34" stroke={v.color} strokeWidth="3" strokeLinecap="round" fill="none"/>
                <path d="M10 24 C16 18 44 18 50 24" stroke={v.color} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5"/>
                <path d="M8 12 L52 52" stroke={BARTAL.danger} strokeWidth="4" strokeLinecap="round"/>
              </svg>
            ) : (
              <div style={{
                fontFamily: "'JetBrains Mono'",
                fontSize: 40, fontWeight: 700, color: v.color, letterSpacing: -1,
              }}>{v.code}</div>
            )}
          </div>
        </div>

        <div style={{
          fontSize: 10, color: v.color, letterSpacing: 2, textTransform: 'uppercase',
          fontWeight: 700, marginBottom: 10,
        }}>
          {isAr ? v.tag_ar : v.tag_en}
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: text, marginBottom: 10, textWrap: 'balance' }}>
          {isAr ? v.title_ar : v.title_en}
        </div>
        <div style={{ fontSize: 13, color: muted, lineHeight: 1.6, maxWidth: 280, marginBottom: 28 }}>
          {isAr ? v.body_ar : v.body_en}
        </div>

        <button style={{
          background: BARTAL.amber, color: '#fff', border: 'none',
          padding: '13px 32px', borderRadius: 12, fontSize: 14, fontWeight: 700,
          fontFamily: 'inherit', marginBottom: 12,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 14 }}>↻</span>
          {isAr ? v.cta_ar : v.cta_en}
        </button>

        {kind === 'error' && (
          <div style={{ fontSize: 11, color: muted, fontFamily: "'JetBrains Mono'" }}>
            ref: ERR-{Math.floor(Math.random() * 900000 + 100000)}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOBILE: SKELETON (home list / PDP)
// ═══════════════════════════════════════════════════════════════
function MobileSkeletonScreen({ lang, dark, kind = 'home' }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const shimmer = dark ? BARTAL.d_raised : '#ECE6D8';
  const shimmerLight = dark ? '#2A4872' : '#F5F0E4';

  const Bar = ({ w, h = 12, r = 6, style }) => (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: `linear-gradient(90deg, ${shimmer} 0%, ${shimmerLight} 50%, ${shimmer} 100%)`,
      backgroundSize: '200% 100%',
      animation: 'sk-shimmer 1.6s ease-in-out infinite',
      ...style,
    }}/>
  );

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'hidden',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
      display: 'flex', flexDirection: 'column',
    }}>
      <style>{`@keyframes sk-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

      {kind === 'home' ? (
        <>
          {/* Search bar skel */}
          <div style={{ padding: '14px 18px 10px' }}>
            <Bar w="100%" h={42} r={12}/>
          </div>
          {/* Category chips */}
          <div style={{ display: 'flex', gap: 8, padding: '6px 18px 14px', overflow: 'hidden' }}>
            {[64, 78, 58, 90, 70].map((w, i) => (
              <Bar key={i} w={w} h={32} r={16}/>
            ))}
          </div>
          {/* Hero banner */}
          <div style={{ padding: '0 18px 14px' }}>
            <Bar w="100%" h={140} r={14}/>
          </div>
          {/* Section heading */}
          <div style={{ padding: '4px 18px 10px', display: 'flex', justifyContent: 'space-between' }}>
            <Bar w={110} h={18}/>
            <Bar w={48} h={12}/>
          </div>
          {/* Product grid */}
          <div style={{ padding: '0 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Bar w="100%" h={130} r={10}/>
                <Bar w="80%" h={10}/>
                <Bar w="50%" h={10}/>
                <Bar w="40%" h={14}/>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* PDP skeleton */}
          <div style={{ padding: '14px 18px' }}>
            <Bar w={36} h={36} r={18}/>
          </div>
          <div style={{ padding: '0 18px 14px' }}>
            <Bar w="100%" h={280} r={14}/>
          </div>
          <div style={{ padding: '0 18px', display: 'flex', gap: 8, marginBottom: 16 }}>
            {[0, 1, 2, 3].map(i => (<Bar key={i} w={56} h={56} r={8}/>))}
          </div>
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Bar w="50%" h={12}/>
            <Bar w="90%" h={22}/>
            <Bar w="65%" h={22}/>
            <Bar w={110} h={28}/>
            <div style={{ height: 8 }}/>
            <Bar w="100%" h={12}/>
            <Bar w="95%" h={12}/>
            <Bar w="70%" h={12}/>
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WEB: SYSTEM STATES inside browser canvas
// ═══════════════════════════════════════════════════════════════
function WebSystemState({ lang, dark, kind = 'error' }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const text = dark ? BARTAL.d_text : BARTAL.text;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;

  const variants = {
    '404': {
      code: '404',
      tag_ar: 'الصفحة غير موجودة',   tag_en: 'Page not found',
      title_ar: 'يبدو أننا ضعنا في الطريق', title_en: 'Looks like we took a wrong turn',
      body_ar:  'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
      body_en:  'The page you\u2019re looking for doesn\u2019t exist or has been moved.',
      color: BARTAL.amber,
    },
    '500': {
      code: '500',
      tag_ar: 'خطأ في الخادم',       tag_en: 'Server error',
      title_ar: 'حدث خطأ غير متوقع',  title_en: 'Something went wrong on our end',
      body_ar:  'نحن نعمل على إصلاح المشكلة. حاول مرة أخرى بعد قليل.',
      body_en:  'Our team has been notified. Please try again shortly.',
      color: BARTAL.danger,
    },
    offline: {
      code: 'WiFi',
      tag_ar: 'غير متصل',            tag_en: 'You\u2019re offline',
      title_ar: 'لا يوجد اتصال بالإنترنت', title_en: 'No internet connection',
      body_ar:  'تحقق من اتصال الشبكة وحاول مجدداً.',
      body_en:  'Check your connection and try again.',
      color: BARTAL.navy,
    },
  };
  const v = variants[kind] || variants['404'];

  const suggestions_ar = ['الصفحة الرئيسية', 'العطور', 'الإلكترونيات', 'تتبع الطلبات'];
  const suggestions_en = ['Homepage', 'Fragrance', 'Electronics', 'Track order'];

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg,
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 48, position: 'relative', overflow: 'hidden',
    }}>
      {/* Backdrop motif */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: dark ? 0.06 : 0.04 }}>
        <defs>
          <pattern id={`sys-motif-${kind}`} x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <g stroke={v.color} strokeWidth="1" fill="none">
              <path d="M50 8 L60 28 L80 22 L72 42 L92 50 L72 58 L80 78 L60 72 L50 92 L40 72 L20 78 L28 58 L8 50 L28 42 L20 22 L40 28 Z"/>
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#sys-motif-${kind})`}/>
      </svg>

      {kind === 'offline' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          background: BARTAL.danger, color: '#fff',
          padding: '10px 20px', fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: '#fff', animation: 'blink 1.2s infinite' }}/>
          {isAr ? 'أنت غير متصل — جاري المحاولة لإعادة الاتصال...' : 'You are offline — trying to reconnect...'}
        </div>
      )}

      {/* Big glyph */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 20, marginBottom: 30,
        position: 'relative',
      }}>
        <div style={{
          fontFamily: "'JetBrains Mono'",
          fontSize: 140, fontWeight: 700, color: v.color, letterSpacing: -6, lineHeight: 1,
        }}>
          {v.code === 'WiFi' ? (
            <svg width="130" height="130" viewBox="0 0 130 130" fill="none">
              <path d="M65 98 L65 98.01" stroke={v.color} strokeWidth="8" strokeLinecap="round"/>
              <path d="M40 78 C50 70 80 70 90 78" stroke={v.color} strokeWidth="7" strokeLinecap="round" fill="none"/>
              <path d="M24 58 C34 46 96 46 106 58" stroke={v.color} strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.55"/>
              <path d="M10 38 C20 22 110 22 120 38" stroke={v.color} strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.3"/>
              <path d="M14 18 L116 118" stroke={BARTAL.danger} strokeWidth="8" strokeLinecap="round"/>
            </svg>
          ) : v.code}
        </div>
        <div style={{
          width: 72, height: 72, borderRadius: 36, background: v.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 30, fontWeight: 700,
        }}>
          {kind === '404' ? '?' : kind === '500' ? '!' : '×'}
        </div>
      </div>

      <div style={{
        fontSize: 11, color: v.color, letterSpacing: 2, textTransform: 'uppercase',
        fontWeight: 700, marginBottom: 12,
      }}>
        {isAr ? v.tag_ar : v.tag_en}
      </div>
      <div style={{
        fontSize: 30, fontWeight: 700, color: text, marginBottom: 12,
        textAlign: 'center', maxWidth: 520, textWrap: 'balance',
      }}>
        {isAr ? v.title_ar : v.title_en}
      </div>
      <div style={{
        fontSize: 15, color: muted, lineHeight: 1.6, maxWidth: 500,
        textAlign: 'center', marginBottom: 32,
      }}>
        {isAr ? v.body_ar : v.body_en}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: kind === '404' ? 36 : 0 }}>
        <button style={{
          background: BARTAL.amber, color: '#fff', border: 'none',
          padding: '13px 28px', borderRadius: 10, fontSize: 14, fontWeight: 700,
          fontFamily: 'inherit', cursor: 'pointer',
        }}>
          {kind === '404' ? (isAr ? 'العودة للرئيسية' : 'Back to homepage')
            : (isAr ? 'إعادة المحاولة' : 'Try again')}
        </button>
        <button style={{
          background: surface, color: text, border: `1px solid ${line}`,
          padding: '13px 28px', borderRadius: 10, fontSize: 14, fontWeight: 600,
          fontFamily: 'inherit', cursor: 'pointer',
        }}>
          {isAr ? 'تواصل مع الدعم' : 'Contact support'}
        </button>
      </div>

      {kind === '404' && (
        <div style={{
          padding: '20px 24px', background: surface, borderRadius: 12,
          border: `1px solid ${line}`, maxWidth: 460,
        }}>
          <div style={{
            fontSize: 11, color: muted, letterSpacing: 1.5, textTransform: 'uppercase',
            fontWeight: 600, marginBottom: 10,
          }}>
            {isAr ? 'جرّب زيارة' : 'Try visiting'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(isAr ? suggestions_ar : suggestions_en).map((s, i) => (
              <div key={i} style={{
                padding: '7px 14px', borderRadius: 100, background: BARTAL.amberTint,
                color: BARTAL.amber, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                border: `1px solid ${BARTAL.amber}33`,
              }}>{s}</div>
            ))}
          </div>
        </div>
      )}

      {/* tiny request id */}
      {kind !== 'offline' && (
        <div style={{
          position: 'absolute', bottom: 20, fontSize: 10, color: muted,
          fontFamily: "'JetBrains Mono'",
        }}>
          ref: {kind === '404' ? 'RNF' : 'ERR'}-{Math.floor(Math.random() * 900000 + 100000)} · bartal.sd
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WEB: STATIC PAGES — About, Privacy, Contact
// ═══════════════════════════════════════════════════════════════
function WebStaticShell({ lang, dark, eyebrow, title, subtitle, children }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const text = dark ? BARTAL.d_text : BARTAL.text;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'auto',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
    }}>
      {/* Compact nav bar */}
      <div style={{
        padding: '14px 40px', background: surface,
        borderBottom: `1px solid ${line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoMark color={BARTAL.amber} accent={BARTAL.navyInk} size={26}/>
          <div style={{ fontSize: 17, fontWeight: 700, color: text }}>
            {isAr ? 'برتال' : 'bartal'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 22, fontSize: 13, color: muted }}>
          {[
            { ar: 'تسوق',       en: 'Shop' },
            { ar: 'الفئات',     en: 'Categories' },
            { ar: 'من نحن',     en: 'About' },
            { ar: 'المساعدة',   en: 'Help' },
          ].map((l, i) => (
            <span key={i} style={{ cursor: 'pointer', fontWeight: 500 }}>{isAr ? l.ar : l.en}</span>
          ))}
        </div>
        <button style={{
          background: BARTAL.amber, color: '#fff', border: 'none',
          padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700,
          fontFamily: 'inherit',
        }}>
          {isAr ? 'تسجيل الدخول' : 'Sign in'}
        </button>
      </div>

      {/* Hero */}
      <div style={{
        padding: '48px 40px 36px', maxWidth: 980, margin: '0 auto',
      }}>
        <div style={{
          fontSize: 11, color: BARTAL.amber, letterSpacing: 2, textTransform: 'uppercase',
          fontWeight: 700, marginBottom: 14,
        }}>
          {eyebrow}
        </div>
        <div style={{ fontSize: 40, fontWeight: 700, color: text, lineHeight: 1.15, marginBottom: 14, textWrap: 'balance', letterSpacing: isAr ? 0 : -1 }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 16, color: muted, lineHeight: 1.6, maxWidth: 680 }}>
            {subtitle}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 40px 80px' }}>
        {children}
      </div>
    </div>
  );
}

function WebAbout({ lang, dark }) {
  const isAr = lang === 'ar';
  const text = dark ? BARTAL.d_text : BARTAL.text;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;

  return (
    <WebStaticShell
      lang={lang} dark={dark}
      eyebrow={isAr ? 'من نحن' : 'About us'}
      title={isAr ? 'سوق واحد لكل السودان — على بُعد تحويل بنكي واحد.' : 'One marketplace for all of Sudan — one bank transfer away.'}
      subtitle={isAr
        ? 'بدأنا برتال عام ٢٠٢٤ من الخرطوم بفكرة بسيطة: التسوق عبر الإنترنت يجب أن يعمل للجميع، حتى بدون بطاقات ائتمانية.'
        : 'We started Bartal in 2024 in Khartoum with a simple idea: online shopping should work for everyone — even without credit cards.'}
    >
      {/* Brand strip — motif */}
      <div style={{
        height: 200, borderRadius: 16, marginBottom: 44,
        background: BARTAL.navyInk, position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.25 }}>
          <defs>
            <pattern id="about-motif" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
              <g stroke={BARTAL.amberSoft} strokeWidth="0.9" fill="none">
                <path d="M45 6 L54 25 L73 18 L66 37 L84 45 L66 53 L73 72 L54 65 L45 84 L36 65 L17 72 L24 53 L6 45 L24 37 L17 18 L36 25 Z"/>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-motif)"/>
        </svg>
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: '#fff', letterSpacing: isAr ? 0 : -1.5 }}>
            {isAr ? 'برتال' : 'bartal'}
          </div>
          <div style={{ fontSize: 12, color: BARTAL.amberSoft, letterSpacing: 3, textTransform: 'uppercase', marginTop: 6, fontWeight: 600 }}>
            {isAr ? 'من السودان · للسودان' : 'From Sudan · for Sudan'}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 48 }}>
        {[
          { n: '12,400+', l_ar: 'عميل نشط',    l_en: 'active customers' },
          { n: '180+',    l_ar: 'بائع موثوق',   l_en: 'trusted sellers' },
          { n: '18',      l_ar: 'ولاية',         l_en: 'states covered' },
          { n: '24h',     l_ar: 'توصيل الخرطوم', l_en: 'Khartoum delivery' },
        ].map((s, i) => (
          <div key={i} style={{ padding: 18, background: surface, borderRadius: 12, border: `1px solid ${line}` }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: BARTAL.amber, fontFamily: "'JetBrains Mono'" }}>{s.n}</div>
            <div style={{ fontSize: 12, color: muted, marginTop: 4 }}>{isAr ? s.l_ar : s.l_en}</div>
          </div>
        ))}
      </div>

      {/* Values */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: text, marginBottom: 20 }}>
          {isAr ? 'ما الذي نؤمن به' : 'What we stand for'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            {
              glyph: '🏛',
              t_ar: 'محلي أولاً',         t_en: 'Local first',
              b_ar: 'ندعم البائعين السودانيين ونربطهم بالعملاء مباشرة. كل ريال يبقى في الاقتصاد المحلي.',
              b_en: 'We back Sudanese sellers and connect them to customers directly. Every SDG stays in the local economy.',
            },
            {
              glyph: '🤝',
              t_ar: 'ثقة تُبنى',          t_en: 'Trust, built in',
              b_ar: 'كل طلب مُوثّق. كل إيصال مُراجع. خلاف؟ نحن بينكما حتى تُحل.',
              b_en: 'Every order documented. Every receipt reviewed. A dispute? We stand between until it\u2019s resolved.',
            },
            {
              glyph: '📱',
              t_ar: 'يعمل مع كل شبكة',      t_en: 'Works on any network',
              b_ar: 'صفحات خفيفة، واتساب كخط مساعدة، وطرق دفع تعمل بدون بطاقات. السودان قبل كل شيء.',
              b_en: 'Light pages, WhatsApp as a lifeline, payment methods that work without cards. Sudan first.',
            },
          ].map((v, i) => (
            <div key={i} style={{ padding: 22, background: surface, borderRadius: 12, border: `1px solid ${line}` }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{v.glyph}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: text, marginBottom: 8 }}>
                {isAr ? v.t_ar : v.t_en}
              </div>
              <div style={{ fontSize: 13, color: muted, lineHeight: 1.6 }}>
                {isAr ? v.b_ar : v.b_en}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: text, marginBottom: 20 }}>
          {isAr ? 'الفريق المؤسس' : 'Our founders'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { initial: 'AM', name_ar: 'أحمد محمد',      name_en: 'Ahmed Mohamed',      role_ar: 'الرئيس التنفيذي', role_en: 'CEO · Co-founder',   color: BARTAL.amber },
            { initial: 'SE', name_ar: 'سارة الأمين',     name_en: 'Sara Al-Amin',       role_ar: 'رئيسة المنتج',     role_en: 'CPO · Co-founder',   color: BARTAL.navy },
            { initial: 'MO', name_ar: 'محمد عثمان',      name_en: 'Mohamed Osman',      role_ar: 'رئيس التقنية',     role_en: 'CTO · Co-founder',   color: '#0F7A3F' },
          ].map((p, i) => (
            <div key={i} style={{ padding: 22, background: surface, borderRadius: 12, border: `1px solid ${line}`, textAlign: 'center' }}>
              <div style={{
                width: 72, height: 72, borderRadius: 36, background: p.color, margin: '0 auto 12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 24, fontWeight: 700, fontFamily: "'Poppins'",
              }}>{p.initial}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: text, marginBottom: 4 }}>
                {isAr ? p.name_ar : p.name_en}
              </div>
              <div style={{ fontSize: 12, color: muted }}>
                {isAr ? p.role_ar : p.role_en}
              </div>
            </div>
          ))}
        </div>
      </div>
    </WebStaticShell>
  );
}

function WebPrivacy({ lang, dark }) {
  const isAr = lang === 'ar';
  const text = dark ? BARTAL.d_text : BARTAL.text;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const surface = dark ? BARTAL.d_surface : '#fff';

  const sections_en = [
    { t: '1. Information we collect', b: 'We collect your name, phone number, delivery address, and order history. Phone numbers are verified via WhatsApp or SMS OTP. We do NOT collect credit card data (Bartal uses bank transfers and cash on delivery).' },
    { t: '2. How we use your data',   b: 'To process orders, coordinate delivery, send WhatsApp order updates, improve product recommendations, and prevent fraud on bank-transfer receipts. We never sell your data to third parties.' },
    { t: '3. Data we share',          b: 'With the seller fulfilling your order (name, delivery address, phone). With our delivery partners (delivery address, phone, order details). With banks when disputing a transfer. Never for marketing.' },
    { t: '4. Your rights',            b: 'You can request a copy of your data, correct inaccuracies, or delete your account at any time via Account → Security or by emailing privacy@bartal.sd. Deletion is irreversible after 30 days.' },
    { t: '5. Data retention',         b: 'Active accounts: we retain order history for the life of your account. Deleted accounts: data is purged within 30 days except financial records required by Sudanese law (retained 7 years).' },
    { t: '6. Contact',                b: 'Questions? Email privacy@bartal.sd or WhatsApp +249 91 000 0000. Our Data Protection Officer responds within 3 business days.' },
  ];
  const sections_ar = [
    { t: '١. المعلومات التي نجمعها',     b: 'نجمع اسمك ورقم هاتفك وعنوان التوصيل وسجل الطلبات. يتم التحقق من رقم الهاتف عبر واتساب أو رمز SMS. لا نجمع بيانات بطاقات الائتمان (برتال يستخدم التحويل البنكي والدفع عند الاستلام).' },
    { t: '٢. كيف نستخدم بياناتك',        b: 'لمعالجة الطلبات وتنسيق التوصيل وإرسال تحديثات الطلب عبر واتساب وتحسين التوصيات ومنع الاحتيال في إيصالات التحويل. لا نبيع بياناتك لأي طرف ثالث أبداً.' },
    { t: '٣. البيانات التي نشاركها',      b: 'مع البائع الذي يُنفّذ طلبك (الاسم، عنوان التوصيل، الهاتف). مع شركاء التوصيل (العنوان، الهاتف، تفاصيل الطلب). مع البنوك عند الاعتراض على تحويل. لا نشاركها للتسويق أبداً.' },
    { t: '٤. حقوقك',                    b: 'يمكنك طلب نسخة من بياناتك أو تصحيحها أو حذف حسابك في أي وقت عبر "الحساب ← الأمان" أو بمراسلة privacy@bartal.sd. الحذف نهائي بعد ٣٠ يوماً.' },
    { t: '٥. الاحتفاظ بالبيانات',        b: 'للحسابات النشطة: نحتفظ بسجل الطلبات طوال عمر الحساب. للحسابات المحذوفة: تُمسح البيانات خلال ٣٠ يوماً باستثناء السجلات المالية المطلوبة قانونياً (٧ سنوات).' },
    { t: '٦. تواصل معنا',                b: 'أسئلة؟ راسلنا على privacy@bartal.sd أو واتساب +249 91 000 0000. يرد موظف حماية البيانات خلال ٣ أيام عمل.' },
  ];

  const sections = isAr ? sections_ar : sections_en;

  return (
    <WebStaticShell
      lang={lang} dark={dark}
      eyebrow={isAr ? 'سياسة الخصوصية' : 'Privacy policy'}
      title={isAr ? 'كيف نتعامل مع بياناتك.' : 'How we handle your data.'}
      subtitle={isAr
        ? 'آخر تحديث: ١٩ أبريل ٢٠٢٦. الوثيقة الرسمية متوفرة بالعربية والإنجليزية وتحكمها قوانين جمهورية السودان.'
        : 'Last updated: 19 April 2026. Authoritative in both Arabic and English, governed by the laws of the Republic of Sudan.'}
    >
      {/* Quick summary box */}
      <div style={{
        padding: '20px 24px', background: BARTAL.amberTint,
        borderRadius: 12, border: `1px solid ${BARTAL.amber}44`, marginBottom: 36,
        display: 'flex', gap: 16, alignItems: 'flex-start',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 18, background: BARTAL.amber,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 18, fontWeight: 700, flexShrink: 0,
        }}>i</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: BARTAL.navyInk, marginBottom: 4 }}>
            {isAr ? 'الخلاصة' : 'In plain language'}
          </div>
          <div style={{ fontSize: 13, color: BARTAL.navyInk, lineHeight: 1.6 }}>
            {isAr
              ? 'نجمع الحد الأدنى الضروري لمعالجة طلبك. لا نبيع بياناتك. يمكنك حذف حسابك متى شئت.'
              : 'We collect only what we need to process your order. We never sell your data. You can delete your account anytime.'}
          </div>
        </div>
      </div>

      {/* TOC */}
      <div style={{
        padding: 20, background: surface, borderRadius: 12, border: `1px solid ${line}`,
        marginBottom: 36,
      }}>
        <div style={{
          fontSize: 11, color: muted, letterSpacing: 1.5, textTransform: 'uppercase',
          fontWeight: 600, marginBottom: 10,
        }}>
          {isAr ? 'فهرس' : 'Contents'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {sections.map((s, i) => (
            <div key={i} style={{ fontSize: 13, color: BARTAL.amber, fontWeight: 600, cursor: 'pointer' }}>
              → {s.t}
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      {sections.map((s, i) => (
        <div key={i} style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: text, marginBottom: 10 }}>
            {s.t}
          </div>
          <div style={{ fontSize: 14, color: muted, lineHeight: 1.75 }}>
            {s.b}
          </div>
        </div>
      ))}
    </WebStaticShell>
  );
}

function WebContact({ lang, dark }) {
  const isAr = lang === 'ar';
  const text = dark ? BARTAL.d_text : BARTAL.text;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const surface = dark ? BARTAL.d_surface : '#fff';

  return (
    <WebStaticShell
      lang={lang} dark={dark}
      eyebrow={isAr ? 'تواصل معنا' : 'Contact us'}
      title={isAr ? 'نحن هنا للمساعدة.' : 'We\u2019re here to help.'}
      subtitle={isAr
        ? 'فريق الدعم متاح ٩ صباحاً — ٩ مساءً يومياً بتوقيت الخرطوم (GMT+2). نرد على واتساب خلال ٣٠ دقيقة.'
        : 'Our support team is available 9 AM – 9 PM daily (GMT+2, Khartoum time). WhatsApp replies within 30 minutes.'}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 32 }}>
        {/* Form */}
        <div style={{ padding: 28, background: surface, borderRadius: 14, border: `1px solid ${line}` }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: text, marginBottom: 18 }}>
            {isAr ? 'أرسل لنا رسالة' : 'Send us a message'}
          </div>

          {[
            { label_ar: 'الاسم الكامل', label_en: 'Full name',     v: 'Ahmed Mohamed Ali', type: 'text' },
            { label_ar: 'رقم الهاتف',  label_en: 'Phone number',  v: '+249 91 234 5678',  type: 'phone' },
            { label_ar: 'رقم الطلب (اختياري)', label_en: 'Order ID (optional)', v: 'BRT-001847', type: 'text' },
          ].map((f, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: muted, marginBottom: 6, fontWeight: 600 }}>
                {isAr ? f.label_ar : f.label_en}
              </div>
              <div style={{
                height: 44, padding: '0 14px', background: dark ? BARTAL.d_bg : BARTAL.paper,
                border: `1px solid ${line}`, borderRadius: 8,
                display: 'flex', alignItems: 'center',
                fontSize: 14, color: text,
                fontFamily: f.type === 'phone' ? 'ui-monospace, monospace' : 'inherit',
              }}>
                {f.v}
              </div>
            </div>
          ))}

          {/* Topic picker */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: muted, marginBottom: 6, fontWeight: 600 }}>
              {isAr ? 'الموضوع' : 'What can we help with?'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(isAr
                ? ['مشكلة في الطلب', 'استرجاع', 'تحويل بنكي', 'شكوى', 'اقتراح', 'أخرى']
                : ['Order issue', 'Refund', 'Bank transfer', 'Complaint', 'Suggestion', 'Other']
              ).map((t, i) => (
                <div key={i} style={{
                  padding: '6px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                  background: i === 0 ? BARTAL.amber : 'transparent',
                  color: i === 0 ? '#fff' : muted,
                  border: `1px solid ${i === 0 ? BARTAL.amber : line}`,
                  cursor: 'pointer',
                }}>{t}</div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, color: muted, marginBottom: 6, fontWeight: 600 }}>
              {isAr ? 'الرسالة' : 'Message'}
            </div>
            <div style={{
              height: 120, padding: 14, background: dark ? BARTAL.d_bg : BARTAL.paper,
              border: `1px solid ${line}`, borderRadius: 8,
              fontSize: 14, color: text, lineHeight: 1.55,
            }}>
              {isAr
                ? 'السلام عليكم، طلبي BRT-001847 لم يصل حتى الآن رغم أن التتبع يقول إنه في الطريق منذ يومين. يرجى المتابعة.'
                : 'Hello, my order BRT-001847 has not arrived yet although tracking shows out-for-delivery for 2 days. Please check.'}
            </div>
          </div>

          <button style={{
            width: '100%', background: BARTAL.amber, color: '#fff', border: 'none',
            padding: '13px', borderRadius: 10, fontSize: 14, fontWeight: 700,
            fontFamily: 'inherit', cursor: 'pointer',
          }}>
            {isAr ? 'إرسال الرسالة' : 'Send message'}
          </button>
        </div>

        {/* Other channels */}
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: text, marginBottom: 18 }}>
            {isAr ? 'قنوات أخرى' : 'Other ways to reach us'}
          </div>

          {[
            {
              icon: 'W', bg: '#25D366',
              title_ar: 'واتساب', title_en: 'WhatsApp',
              v: '+249 91 000 0000',
              sub_ar: 'الأسرع · متوسط الرد ٣٠ دقيقة',
              sub_en: 'Fastest · ~30 min average response',
              primary: true,
            },
            {
              icon: '✉', bg: BARTAL.navy,
              title_ar: 'البريد الإلكتروني', title_en: 'Email',
              v: 'support@bartal.sd',
              sub_ar: 'ردود خلال ٢٤ ساعة',
              sub_en: 'Within 24 hours',
            },
            {
              icon: '☏', bg: BARTAL.amber,
              title_ar: 'هاتف', title_en: 'Phone',
              v: '+249 18 329 0000',
              sub_ar: '٩ ص — ٩ م بتوقيت الخرطوم',
              sub_en: '9 AM – 9 PM Khartoum time',
            },
          ].map((c, i) => (
            <div key={i} style={{
              padding: 18, marginBottom: 12, borderRadius: 12,
              background: surface, border: `1px solid ${c.primary ? '#25D36655' : line}`,
              display: 'flex', gap: 14, alignItems: 'flex-start',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 21, background: c.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 18, fontWeight: 700, flexShrink: 0,
              }}>{c.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 4 }}>
                  {isAr ? c.title_ar : c.title_en}
                </div>
                <div style={{ fontSize: 15, color: BARTAL.amber, fontFamily: 'ui-monospace, monospace', fontWeight: 600, marginBottom: 4 }}>
                  {c.v}
                </div>
                <div style={{ fontSize: 11, color: muted }}>
                  {isAr ? c.sub_ar : c.sub_en}
                </div>
              </div>
              {c.primary && (
                <div style={{
                  position: 'absolute', top: 10, insetInlineEnd: 10,
                  fontSize: 9, padding: '2px 7px', borderRadius: 8,
                  background: '#25D366', color: '#fff', fontWeight: 700, letterSpacing: 1,
                }}>
                  {isAr ? 'مفضّل' : 'PREFERRED'}
                </div>
              )}
            </div>
          ))}

          {/* Office */}
          <div style={{ padding: 18, borderRadius: 12, background: surface, border: `1px solid ${line}`, marginTop: 16 }}>
            <div style={{ fontSize: 11, color: muted, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>
              {isAr ? 'المقر الرئيسي' : 'Headquarters'}
            </div>
            <div style={{ fontSize: 14, color: text, lineHeight: 1.6, fontWeight: 500 }}>
              {isAr
                ? <>بيت ١٢، بلوك ٥<br/>شارع الجمهورية، المقرن<br/>الخرطوم، السودان</>
                : <>House 12, Block 5<br/>Jamhoriya St., Al-Mogran<br/>Khartoum, Sudan</>}
            </div>
          </div>
        </div>
      </div>
    </WebStaticShell>
  );
}

Object.assign(window, {
  MobileEmptyState, MobileErrorScreen, MobileSkeletonScreen, EmptyIllustration,
  WebSystemState, WebStaticShell, WebAbout, WebPrivacy, WebContact,
});
