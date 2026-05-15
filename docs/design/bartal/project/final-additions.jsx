// final-additions.jsx — Mobile (CategoriesBrowse, PdpReviews, CartPromo)
//                       Admin (ShippingLabels, InventoryLog, AbandonedCarts)

// ═══════════════════════════════════════════════════════════════
// MOBILE · ALL CATEGORIES BROWSE
// ═══════════════════════════════════════════════════════════════
function MobileCategoriesScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const tops = [
    { k: 'fragrance',   ar: 'العطور والبخور',   en: 'Fragrance & Bakhoor', count: 184, hue: 'amber',
      subs_ar: ['عطور رجالية','عطور نسائية','دهن العود','مسك','بخور','عود خام','أطقم هدايا'],
      subs_en: ['Men\u2019s perfume','Women\u2019s perfume','Dahn al oud','Musk','Bakhoor','Raw oud','Gift sets'] },
    { k: 'electronics', ar: 'الإلكترونيات',      en: 'Electronics',         count: 312, hue: 'navy',
      subs_ar: ['هواتف ذكية','سماعات','ساعات ذكية','أجهزة لوحية','شواحن','إكسسوارات'],
      subs_en: ['Smartphones','Headphones','Smartwatches','Tablets','Chargers','Accessories'] },
    { k: 'beauty',      ar: 'الجمال والعناية',  en: 'Beauty & Care',        count: 96,  hue: 'rose',
      subs_ar: ['عناية بالبشرة','مكياج','عناية بالشعر','عطور نسائية','صابون طبيعي'],
      subs_en: ['Skincare','Makeup','Haircare','Women\u2019s fragrance','Natural soap'] },
    { k: 'home',        ar: 'المنزل والمعيشة',   en: 'Home & Living',       count: 71,  hue: 'green',
      subs_ar: ['مبخرات','معطرات الجو','ديكور','أدوات مطبخ'],
      subs_en: ['Incense burners','Air fresheners','Decor','Kitchenware'] },
  ];

  const [active, setActive] = React.useState(0);
  const cat = tops[active];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={isAr ? 'الفئات' : 'Categories'} onBack={onBack} lang={lang} dark={dark}/>

      <div style={{ padding: '0 16px 10px' }}>
        <div style={{
          background: surface, border: `1px solid ${line}`, borderRadius: 10,
          padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke={muted} strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke={muted} strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ ...typeStyle(lang, 'small'), color: muted }}>
            {isAr ? 'ابحث في الفئات…' : 'Search in categories…'}
          </span>
        </div>
      </div>

      {/* Two-column: sidebar + content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{
          width: 108, flexShrink: 0, background: surface,
          borderInlineEnd: `1px solid ${line}`, overflow: 'auto',
        }}>
          {tops.map((c, i) => {
            const on = i === active;
            return (
              <div key={c.k} onClick={() => setActive(i)} style={{
                padding: '14px 10px', cursor: 'pointer',
                background: on ? bg : 'transparent',
                borderInlineStart: on ? `3px solid ${BARTAL.amber}` : '3px solid transparent',
                position: 'relative',
              }}>
                <div style={{ width: 56, height: 56, margin: '0 auto 6px', borderRadius: 12, overflow: 'hidden' }}>
                  <ProductPlaceholder label="" hue={c.hue}/>
                </div>
                <div style={{ ...typeStyle(lang, 'micro'), color: on ? text : muted,
                              textTransform: 'none', letterSpacing: 0, textAlign: 'center',
                              fontWeight: on ? 700 : 500, fontSize: 11, lineHeight: 1.3 }}>
                  {c[lang]}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '14px 14px 80px' }}>
          {/* Featured hero card for this category */}
          <div onClick={() => onNav('searchResults')} style={{
            height: 110, borderRadius: 14, overflow: 'hidden', position: 'relative', marginBottom: 14,
          }}>
            <ProductPlaceholder label={cat.en} hue={cat.hue}/>
            <div style={{
              position: 'absolute', inset: 0, padding: 14,
              background: 'linear-gradient(180deg, transparent 30%, rgba(11,25,48,0.75) 100%)',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#fff',
            }}>
              <div style={{ ...typeStyle(lang, 'h3'), color: '#fff', fontWeight: 700, fontSize: 16 }}>
                {isAr ? `تسوق ${cat.ar}` : `Shop ${cat.en}`}
              </div>
              <div style={{ ...typeStyle(lang, 'small'), color: 'rgba(255,255,255,0.85)' }}>
                {isAr ? `${cat.count}+ منتج` : `${cat.count}+ products`}
              </div>
            </div>
          </div>

          {/* Subcategory tiles */}
          <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginBottom: 10 }}>
            {isAr ? 'الأقسام الفرعية' : 'Subcategories'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {cat[`subs_${lang}`].map((s, i) => (
              <div key={i} onClick={() => onNav('searchResults')} style={{
                background: surface, border: `1px solid ${line}`, borderRadius: 12,
                padding: '12px 12px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                  <ProductPlaceholder label="" hue={['amber','navy','rose','green','warm'][i % 5]}/>
                </div>
                <div style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: 600, lineHeight: 1.3 }}>
                  {s}
                </div>
              </div>
            ))}
          </div>

          {/* Top brands strip */}
          <div style={{ ...typeStyle(lang, 'micro'), color: muted, margin: '20px 0 10px' }}>
            {isAr ? 'أبرز الماركات' : 'Top brands'}
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {['Ajmal','Anker','Samsung','Al Haramain','Nabeel','Xiaomi'].map((b, i) => (
              <div key={b} style={{
                padding: '10px 14px', background: surface, border: `1px solid ${line}`,
                borderRadius: 100, ...typeStyle(lang, 'small'), color: text, fontWeight: 600, whiteSpace: 'nowrap',
              }}>{b}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOBILE · PRODUCT REVIEWS LIST (read-only)
// ═══════════════════════════════════════════════════════════════
function MobilePdpReviewsScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const breakdown = [
    { stars: 5, pct: 78, count: 244 },
    { stars: 4, pct: 14, count: 44 },
    { stars: 3, pct: 5,  count: 16 },
    { stars: 2, pct: 2,  count: 6 },
    { stars: 1, pct: 1,  count: 2 },
  ];

  const reviews = [
    { name_ar: 'محمد عثمان', name_en: 'Mohammed Osman', city_ar: 'الخرطوم', city_en: 'Khartoum',
      date: '12 Apr 2026', stars: 5, verified: true, helpful: 24,
      title_ar: 'رائحة فاخرة وأصلية', title_en: 'Genuine and luxurious scent',
      body_ar: 'وصل في الوقت المحدد، التغليف ممتاز ورائحة العود حقيقية تدوم طوال اليوم. أنصح به بشدة.',
      body_en: 'Arrived on time, packaging is excellent, and the oud scent lasts the whole day. Highly recommend.',
      photos: 2 },
    { name_ar: 'سارة أحمد', name_en: 'Sara Ahmed', city_ar: 'أمدرمان', city_en: 'Omdurman',
      date: '08 Apr 2026', stars: 5, verified: true, helpful: 18,
      title_ar: 'منتج أصلي 100%', title_en: '100% authentic',
      body_ar: 'تأكدت من الأصل من خلال الرمز على العلبة. اشتريت قبل ذلك من المتاجر التقليدية بسعر أعلى.',
      body_en: 'Verified the authenticity from the box code. Cheaper than retail and same quality.',
      photos: 0 },
    { name_ar: 'عمر سعد', name_en: 'Omar Saad', city_ar: 'بحري', city_en: 'Bahri',
      date: '02 Apr 2026', stars: 4, verified: true, helpful: 9,
      title_ar: 'جيد ولكن العبوة صغيرة', title_en: 'Good but small bottle',
      body_ar: 'الرائحة ممتازة، لكن العبوة 3 مل أصغر مما توقعت. سأطلب الحجم الأكبر في المرة القادمة.',
      body_en: 'Scent is amazing but the 3ml is smaller than I expected — I\u2019ll order the bigger size next time.',
      photos: 1 },
    { name_ar: 'فاطمة الأمين', name_en: 'Fatima Al-Amin', city_ar: 'الخرطوم', city_en: 'Khartoum',
      date: '27 Mar 2026', stars: 5, verified: true, helpful: 14,
      title_ar: 'هدية مثالية', title_en: 'Perfect gift',
      body_ar: 'اشتريته كهدية لزوجي وأعجبه كثيراً. التغليف الكلاسيكي مناسب جداً للهدايا.',
      body_en: 'Bought it as a gift for my husband — he loved it. The classic packaging makes it ideal as a gift.',
      photos: 0 },
  ];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto' }}>
      <ScreenHeader title={isAr ? 'التقييمات (312)' : 'Reviews (312)'} onBack={onBack} lang={lang} dark={dark}/>

      {/* summary */}
      <div style={{ background: surface, margin: '0 16px 14px', padding: 16, borderRadius: 14, border: `1px solid ${line}` }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ ...typeStyle(lang, 'display'), fontSize: 40, fontWeight: 700, color: text, lineHeight: 1 }}>4.9</div>
            <div style={{ display: 'flex', gap: 2, justifyContent: 'center', margin: '4px 0' }}>
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={BARTAL.amber}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
                </svg>
              ))}
            </div>
            <div style={{ ...typeStyle(lang, 'micro'), color: muted, textTransform: 'none', letterSpacing: 0 }}>
              {isAr ? '312 تقييم' : '312 reviews'}
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {breakdown.map(b => (
              <div key={b.stars} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                <span style={{ color: muted, width: 12 }}>{b.stars}</span>
                <svg width="9" height="9" viewBox="0 0 24 24" fill={BARTAL.amber}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
                </svg>
                <div style={{ flex: 1, height: 5, background: dark ? BARTAL.d_line : BARTAL.line, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${b.pct}%`, height: '100%', background: BARTAL.amber }}/>
                </div>
                <span style={{ color: muted, width: 28, textAlign: 'end' }}>{b.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* filter chips */}
      <div style={{ padding: '0 16px 12px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {[
          { ar: 'الكل (312)', en: 'All (312)', on: true },
          { ar: 'مع صور (62)', en: 'With photos (62)' },
          { ar: '٥ نجوم', en: '5 stars' },
          { ar: 'موثّقة الشراء', en: 'Verified buyers' },
        ].map((c, i) => (
          <div key={i} style={{
            padding: '6px 12px', borderRadius: 100, whiteSpace: 'nowrap',
            background: c.on ? BARTAL.navy : surface, color: c.on ? '#fff' : text,
            border: `1px solid ${c.on ? BARTAL.navy : line}`,
            ...typeStyle(lang, 'small'), color: c.on ? '#fff' : text, fontWeight: 600,
          }}>{c[lang]}</div>
        ))}
      </div>

      {/* sort */}
      <div style={{ padding: '0 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ ...typeStyle(lang, 'small'), color: muted }}>
          {isAr ? 'الأحدث أولاً' : 'Newest first'}
          <span style={{ marginInlineStart: 6, fontSize: 9 }}>▼</span>
        </div>
      </div>

      {/* reviews */}
      <div style={{ padding: '0 16px 80px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {reviews.map((r, i) => (
          <div key={i} style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 17, background: BARTAL.amber + '30',
                color: BARTAL.amber, fontFamily: "'Poppins'", fontWeight: 700, fontSize: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{r.name_en.split(' ').map(n => n[0]).join('').slice(0,2)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: 700 }}>
                  {isAr ? r.name_ar : r.name_en}
                </div>
                <div style={{ ...typeStyle(lang, 'micro'), color: muted, textTransform: 'none', letterSpacing: 0 }}>
                  {isAr ? r.city_ar : r.city_en} · {r.date}
                </div>
              </div>
              {r.verified && (
                <div style={{
                  padding: '3px 8px', borderRadius: 100, background: BARTAL.success + '15',
                  color: BARTAL.success, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4,
                  fontFamily: lang === 'ar' ? "'Cairo'" : "'Poppins'",
                }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={BARTAL.success} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {isAr ? 'موثّق' : 'Verified'}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
              {[1,2,3,4,5].map(i2 => (
                <svg key={i2} width="11" height="11" viewBox="0 0 24 24" fill={i2 <= r.stars ? BARTAL.amber : (dark ? BARTAL.d_line : BARTAL.line)}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
                </svg>
              ))}
            </div>

            <div style={{ ...typeStyle(lang, 'body', dark), fontWeight: 700, marginBottom: 4, fontSize: 14 }}>
              {isAr ? r.title_ar : r.title_en}
            </div>
            <div style={{ ...typeStyle(lang, 'body', dark), color: muted, fontSize: 13, lineHeight: 1.55 }}>
              {isAr ? r.body_ar : r.body_en}
            </div>

            {r.photos > 0 && (
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                {Array.from({ length: r.photos }).map((_, p) => (
                  <div key={p} style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden' }}>
                    <ProductPlaceholder label={`photo ${p+1}`} hue={['amber','warm'][p % 2]}/>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12, ...typeStyle(lang, 'small'), color: muted }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M7 11V21H4V11M7 11l4-8a2 2 0 012 2v5h6l-2 8a2 2 0 01-2 2H7" stroke={muted} strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                {isAr ? `مفيد (${r.helpful})` : `Helpful (${r.helpful})`}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M3 21l1.5-4A8 8 0 1112 20a8 8 0 01-4.5-1.4L3 21z" stroke={muted} strokeWidth="1.8"/>
                </svg>
                {isAr ? 'رد' : 'Reply'}
              </span>
              <span style={{ marginInlineStart: 'auto' }}>{isAr ? 'بلّغ' : 'Report'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA — write a review */}
      <div style={{
        position: 'sticky', bottom: 0, padding: '12px 16px',
        background: dark ? BARTAL.d_bg + 'EE' : BARTAL.sand + 'EE',
        backdropFilter: 'blur(8px)', borderTop: `1px solid ${line}`,
      }}>
        <div onClick={() => onNav('writeReview')} style={{
          background: BARTAL.amber, color: '#fff', padding: '14px',
          borderRadius: 12, textAlign: 'center', fontWeight: 700,
          ...typeStyle(lang, 'body'), color: '#fff', cursor: 'pointer',
        }}>
          {isAr ? 'اكتب تقييمك' : 'Write a review'}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOBILE · CART WITH PROMO APPLIED
// ═══════════════════════════════════════════════════════════════
function MobileCartPromoScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const items = [
    { p: CATALOG[1], qty: 2 },
    { p: CATALOG[5], qty: 1 },
    { p: CATALOG[3], qty: 1 },
  ];
  const subtotal = items.reduce((s, i) => s + i.p.price * i.qty, 0);
  const discount = Math.round(subtotal * 0.15);
  const delivery = 2500;
  const total = subtotal - discount + delivery;

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={isAr ? 'السلة' : 'Cart'} onBack={onBack} lang={lang} dark={dark}/>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 16px' }}>
        {/* promo applied banner */}
        <div style={{
          background: 'linear-gradient(135deg, ' + BARTAL.success + ' 0%, #1F5C24 100%)',
          color: '#fff', padding: 14, borderRadius: 14, marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 12, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
            <MotifBg color="#fff" opacity={0.5} style={{ width: '100%', height: '100%' }}>
              <div style={{ width: '100%', height: '100%' }}/>
            </MotifBg>
          </div>
          <div style={{
            width: 38, height: 38, borderRadius: 19, background: 'rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            position: 'relative', zIndex: 1,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <div style={{ ...typeStyle(lang, 'body'), color: '#fff', fontWeight: 700, fontSize: 14 }}>
              {isAr ? 'تم تطبيق كود EID15' : 'Code EID15 applied'}
            </div>
            <div style={{ ...typeStyle(lang, 'small'), color: 'rgba(255,255,255,0.85)' }}>
              {isAr ? `وفّرت ${fmtSDG(discount, lang, isAr ? 'arabic':'latin')} ج.س` : `You saved ${fmtSDG(discount, lang)} SDG`}
            </div>
          </div>
          <div style={{
            position: 'relative', zIndex: 1, padding: '6px 10px', borderRadius: 100,
            background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer',
            fontFamily: lang === 'ar' ? "'Cairo'" : "'Poppins'",
          }}>
            {isAr ? 'إزالة' : 'Remove'}
          </div>
        </div>

        {/* line items */}
        <div style={{ background: surface, borderRadius: 14, border: `1px solid ${line}`, marginBottom: 14 }}>
          {items.map((it, i) => (
            <div key={it.p.id} style={{
              padding: 12, display: 'flex', gap: 12,
              borderBottom: i < items.length - 1 ? `1px solid ${line}` : 'none',
            }}>
              <div style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                <ProductPlaceholder label={it.p.name_en} hue={it.p.hue}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...typeStyle(lang, 'micro'), color: muted, textTransform: 'none', letterSpacing: 0 }}>
                  {it.p.brand}
                </div>
                <div style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: 600, lineHeight: 1.3,
                              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {isAr ? it.p.name_ar : it.p.name_en}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                  <PriceTag amount={it.p.price * it.qty} lang={lang} size={13} color={BARTAL.amber}/>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: bg, borderRadius: 8, padding: '2px 4px' }}>
                    <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  color: text, fontSize: 14, cursor: 'pointer' }}>−</div>
                    <div style={{ minWidth: 16, textAlign: 'center', fontSize: 12, fontWeight: 700, color: text }}>{it.qty}</div>
                    <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  color: text, fontSize: 14, cursor: 'pointer' }}>+</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* free-shipping unlock */}
        <div style={{
          background: BARTAL.amberTint, border: `1px solid ${BARTAL.amber}40`,
          borderRadius: 12, padding: 12, marginBottom: 14,
        }}>
          <div style={{ ...typeStyle(lang, 'small'), color: BARTAL.navyInk, fontWeight: 600, marginBottom: 8 }}>
            {isAr
              ? `أضف ${fmtSDG(5000, lang, 'arabic')} ج.س للحصول على توصيل مجاني`
              : `Add ${fmtSDG(5000, lang)} SDG more for free delivery`}
          </div>
          <div style={{ height: 6, background: '#fff', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: '78%', height: '100%', background: BARTAL.amber, borderRadius: 3 }}/>
          </div>
        </div>

        {/* summary */}
        <div style={{ background: surface, borderRadius: 14, border: `1px solid ${line}`, padding: 14 }}>
          <SumRow label={isAr ? 'المجموع الفرعي' : 'Subtotal'}
                  value={<PriceTag amount={subtotal} lang={lang} size={13} strong={false}/>} lang={lang} dark={dark}/>
          <SumRow label={isAr ? 'الخصم (EID15)' : 'Discount (EID15)'}
                  value={
                    <span style={{ color: BARTAL.success, fontFamily: lang === 'ar' ? "'Cairo'":"'Poppins'", fontWeight: 600, fontSize: 13 }}>
                      −{fmtSDG(discount, lang, isAr ? 'arabic':'latin')} {isAr ? 'ج.س' : 'SDG'}
                    </span>
                  } lang={lang} dark={dark}/>
          <SumRow label={isAr ? 'رسوم التوصيل' : 'Delivery fee'}
                  value={<PriceTag amount={delivery} lang={lang} size={13} strong={false}/>} lang={lang} dark={dark}/>
          <div style={{ height: 1, background: line, margin: '8px 0' }}/>
          <SumRow label={
                    <span style={{ ...typeStyle(lang, 'body', dark), fontWeight: 700 }}>{isAr ? 'الإجمالي' : 'Total'}</span>
                  }
                  value={<PriceTag amount={total} lang={lang} size={17} color={BARTAL.amber}/>} lang={lang} dark={dark}/>
        </div>
      </div>

      <div style={{ padding: '12px 16px', background: surface, borderTop: `1px solid ${line}` }}>
        <div onClick={() => onNav('checkoutAddress')} style={{
          background: BARTAL.navy, color: '#fff', padding: '15px',
          borderRadius: 12, textAlign: 'center', fontWeight: 700,
          ...typeStyle(lang, 'body'), color: '#fff', cursor: 'pointer',
        }}>
          {isAr ? `اذهب للدفع · ${fmtSDG(total, lang, 'arabic')} ج.س` : `Proceed to checkout · ${fmtSDG(total, lang)} SDG`}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ADMIN · SHIPPING LABELS
// ═══════════════════════════════════════════════════════════════
function AdminShippingLabels({ dark }) {
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';

  const labels = [
    { id: 'BTL-2847', name: 'Mohammed Osman', phone: '+249 91 234 5678',
      addr: 'Al-Riyadh, block 32, house 14, near Al-Fateh mosque', city: 'Khartoum', zone: 'A',
      cod: false, items: 2, weight: '0.6 kg', total: 84000, status: 'Ready' },
    { id: 'BTL-2846', name: 'Sara Ahmed', phone: '+249 92 845 1122',
      addr: 'Omdurman, Al-Souq al-Arabi, opposite the post office', city: 'Omdurman', zone: 'B',
      cod: true, items: 1, weight: '0.3 kg', total: 28500, status: 'Ready' },
    { id: 'BTL-2845', name: 'Omar Saad', phone: '+249 90 555 4433',
      addr: 'Bahri, Industrial area, gate 4, blue building', city: 'Bahri', zone: 'C',
      cod: false, items: 3, weight: '1.2 kg', total: 145000, status: 'Printed' },
    { id: 'BTL-2844', name: 'Fatima Al-Amin', phone: '+249 91 877 6655',
      addr: 'East Khartoum, Al-Manshiya, house 8B', city: 'East Khartoum', zone: 'D',
      cod: true, items: 2, weight: '0.5 kg', total: 60500, status: 'Ready' },
  ];

  const [selected, setSelected] = React.useState(['BTL-2847', 'BTL-2846']);
  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <div style={{ height: '100%', display: 'flex', overflow: 'hidden' }}>
      {/* Left: list */}
      <div style={{ width: 460, flexShrink: 0, borderInlineEnd: `1px solid ${line}`, overflow: 'auto', background: surface }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${line}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 12, color: muted, flex: 1 }}>{selected.length} selected · {labels.length} ready</div>
          <div style={{ padding: '6px 12px', borderRadius: 6, background: 'transparent', border: `1px solid ${line}`,
                        color: text, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Sort: Zone ▼</div>
        </div>
        {labels.map((l, i) => {
          const on = selected.includes(l.id);
          return (
            <div key={l.id} onClick={() => toggle(l.id)} style={{
              padding: '14px 18px', borderBottom: `1px solid ${line}`, display: 'flex', alignItems: 'flex-start', gap: 12,
              background: on ? (dark ? BARTAL.d_raised : '#FFFBEF') : 'transparent', cursor: 'pointer',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 4, marginTop: 2, flexShrink: 0,
                border: `2px solid ${on ? BARTAL.amber : line}`, background: on ? BARTAL.amber : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {on && <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round"/></svg>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 700, color: text }}>#{l.id}</span>
                  <span style={{ padding: '2px 7px', borderRadius: 4, background: 'Z'.charCodeAt(0) + l.zone.charCodeAt(0) % 2 ? BARTAL.navy + '15' : BARTAL.amber + '20',
                                color: BARTAL.navy, fontSize: 9, fontWeight: 700, fontFamily: "'Poppins'" }}>ZONE {l.zone}</span>
                  {l.cod && <span style={{ padding: '2px 7px', borderRadius: 4, background: BARTAL.amber + '20',
                                color: BARTAL.amber, fontSize: 9, fontWeight: 700, fontFamily: "'Poppins'" }}>COD</span>}
                  <span style={{ marginInlineStart: 'auto', fontSize: 10, color: muted, fontWeight: 600,
                                 fontFamily: "'Poppins'" }}>{l.status}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 2 }}>{l.name}</div>
                <div style={{ fontSize: 11, color: muted, marginBottom: 4, lineHeight: 1.4 }}>{l.addr} · {l.city}</div>
                <div style={{ fontSize: 11, color: muted, display: 'flex', gap: 10 }}>
                  <span>{l.items} items</span><span>·</span><span>{l.weight}</span><span>·</span>
                  <span style={{ color: BARTAL.amber, fontWeight: 700 }}>{fmtSDG(l.total)} SDG</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right: preview */}
      <div style={{ flex: 1, background: dark ? BARTAL.d_bg : '#F5F6F8', overflow: 'auto', padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: text, flex: 1 }}>
            Preview · 4×6" thermal labels · {selected.length} sheets
          </div>
          <div style={{ padding: '8px 14px', borderRadius: 6, background: 'transparent', border: `1px solid ${line}`,
                        color: text, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Download PDF</div>
          <div style={{ padding: '8px 14px', borderRadius: 6, background: BARTAL.amber, color: '#fff',
                        fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z" stroke="#fff" strokeWidth="2"/>
            </svg>
            Print {selected.length} labels
          </div>
        </div>

        {/* labels grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {labels.filter(l => selected.includes(l.id)).map(l => (
            <ShippingLabelPreview key={l.id} label={l}/>
          ))}
          {selected.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: muted, fontSize: 13 }}>
              Select orders on the left to preview labels.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ShippingLabelPreview({ label }) {
  const l = label;
  return (
    <div style={{
      background: '#fff', borderRadius: 4, color: '#111', boxShadow: '0 4px 16px rgba(11,25,48,0.1)',
      padding: 18, fontFamily: "'Poppins'", aspectRatio: '4/6', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: 10, marginBottom: 10 }}>
        <BartalLogo color="#0B1930" accent={BARTAL.amber} size={18} lang="en"/>
        <div style={{ marginInlineStart: 'auto', textAlign: 'end' }}>
          <div style={{ fontSize: 9, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Order</div>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, fontWeight: 700 }}>#{l.id}</div>
        </div>
      </div>

      <div style={{ fontSize: 8, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>FROM</div>
      <div style={{ fontSize: 10, lineHeight: 1.45, marginBottom: 12 }}>
        Bartal Fulfillment · Khartoum<br/>
        Industrial area, gate 12 · +249 90 000 0000
      </div>

      <div style={{ fontSize: 8, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>SHIP TO</div>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{l.name}</div>
      <div style={{ fontSize: 11, lineHeight: 1.45, marginBottom: 4 }}>{l.addr}<br/>{l.city}, Sudan</div>
      <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 600 }}>{l.phone}</div>

      {/* zone pill */}
      <div style={{
        marginTop: 10, display: 'inline-flex', padding: '4px 10px', borderRadius: 4,
        background: '#000', color: '#fff', fontWeight: 700, fontSize: 11, letterSpacing: 1,
      }}>ZONE {l.zone} · {l.city.toUpperCase()}</div>

      {/* bottom bars */}
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 14 }}>
        {l.cod && (
          <div style={{ background: BARTAL.amber, color: '#fff', padding: '6px 10px', textAlign: 'center',
                        fontSize: 13, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>
            COD · COLLECT {fmtSDG(l.total)} SDG
          </div>
        )}
        {/* barcode */}
        <svg viewBox="0 0 200 30" width="100%" height="30">
          {Array.from({ length: 60 }).map((_, i) => (
            <rect key={i} x={i * 3.3} y="0" width={[1,2,1,3,1,2,2,1,3,1][i % 10]} height="30" fill="#000"/>
          ))}
        </svg>
        <div style={{ textAlign: 'center', fontFamily: "'JetBrains Mono'", fontSize: 10, marginTop: 4 }}>
          *{l.id}*
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ADMIN · INVENTORY LOG
// ═══════════════════════════════════════════════════════════════
function AdminInventoryLog({ dark }) {
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';

  const moves = [
    { t: '14:42', date: 'Today', sku: 'AUR-3ML', name: 'Royal Oud Perfume Oil',  type: 'sale',     qty: -2, ref: '#BTL-2847', user: 'system', stock: 36 },
    { t: '13:18', date: 'Today', sku: 'WPH-001', name: 'Wireless Pro Headphones', type: 'sale',     qty: -1, ref: '#BTL-2846', user: 'system', stock: 11 },
    { t: '11:50', date: 'Today', sku: 'BKR-50G', name: 'Indian Agarwood Bakhoor', type: 'restock',  qty: +40,ref: 'PO-104',    user: 'Fatima A.', stock: 40 },
    { t: '11:30', date: 'Today', sku: 'WPH-001', name: 'Wireless Pro Headphones', type: 'restock',  qty: +12,ref: 'PO-104',    user: 'Fatima A.', stock: 12 },
    { t: '10:14', date: 'Today', sku: 'RSE-6ML', name: 'Rose Attar',              type: 'return',   qty: +1, ref: '#BTL-2812', user: 'Omar M.',   stock: 23 },
    { t: '09:02', date: 'Today', sku: 'SAM-128', name: 'Smartphone 128GB',         type: 'adjust',  qty: -1, ref: 'Damaged', user: 'Omar M.',   stock: 6  },
    { t: '17:38', date: 'Yesterday', sku: 'AUR-3ML', name: 'Royal Oud Perfume Oil', type: 'sale',   qty: -3, ref: '#BTL-2841', user: 'system', stock: 38 },
    { t: '14:20', date: 'Yesterday', sku: 'SWX-5',   name: 'Smartwatch Series 5',   type: 'sale',   qty: -1, ref: '#BTL-2840', user: 'system', stock: 15 },
    { t: '11:00', date: 'Yesterday', sku: 'WPH-001', name: 'Wireless Pro Headphones', type: 'adjust', qty: -2, ref: 'Stocktake', user: 'Fatima A.', stock: 13 },
  ];

  const typeStyleAdmin = {
    sale:    { bg: BARTAL.info + '15',    color: BARTAL.info,    label: 'Sale' },
    restock: { bg: BARTAL.success + '15', color: BARTAL.success, label: 'Restock' },
    return:  { bg: BARTAL.amber + '20',   color: BARTAL.amber,   label: 'Return' },
    adjust:  { bg: BARTAL.danger + '15',  color: BARTAL.danger,  label: 'Adjust' },
  };

  const groups = [...new Set(moves.map(m => m.date))];

  return (
    <div style={{ padding: 24, fontFamily: "'Poppins'", color: text, height: '100%', overflow: 'auto' }}>
      {/* summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
        {[
          { lbl: 'Movements today',   val: '14',    sub: '+3 vs yesterday' },
          { lbl: 'Net change (units)', val: '+46',  sub: 'Restock heavy', color: BARTAL.success },
          { lbl: 'Low stock SKUs',    val: '14',    sub: '≤ 5 units left', color: BARTAL.danger },
          { lbl: 'Pending POs',       val: '3',     sub: '~ 240 units inbound' },
        ].map((s, i) => (
          <div key={i} style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, color: muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.lbl}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color || text, marginTop: 4, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* filters bar */}
      <div style={{
        background: surface, border: `1px solid ${line}`, borderRadius: 12,
        padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: text, marginInlineEnd: 4 }}>Filter</div>
        {['All', 'Sale', 'Restock', 'Return', 'Adjust'].map((f, i) => (
          <div key={f} style={{
            padding: '5px 12px', borderRadius: 100, fontSize: 11, fontWeight: 600,
            background: i === 0 ? BARTAL.navy : 'transparent', color: i === 0 ? '#fff' : text,
            border: `1px solid ${i === 0 ? BARTAL.navy : line}`, cursor: 'pointer',
          }}>{f}</div>
        ))}
        <div style={{ flex: 1 }}/>
        <div style={{
          padding: '6px 12px', borderRadius: 6, background: surface, border: `1px solid ${line}`,
          fontSize: 11, color: text, fontWeight: 600, cursor: 'pointer',
        }}>Last 7 days ▼</div>
        <div style={{
          padding: '6px 12px', borderRadius: 6, background: surface, border: `1px solid ${line}`,
          fontSize: 11, color: text, fontWeight: 600, cursor: 'pointer',
        }}>Export CSV</div>
      </div>

      {/* table */}
      <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid',
          gridTemplateColumns: '80px 1.6fr 1fr 70px 1fr 90px 90px',
          padding: '12px 16px', background: dark ? BARTAL.d_raised : '#FAFAFA',
          fontSize: 10, color: muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
          borderBottom: `1px solid ${line}`,
        }}>
          <div>Time</div>
          <div>SKU · Product</div>
          <div>Type</div>
          <div style={{ textAlign: 'end' }}>Qty</div>
          <div>Reference</div>
          <div>User</div>
          <div style={{ textAlign: 'end' }}>On hand</div>
        </div>
        {groups.map(g => (
          <React.Fragment key={g}>
            <div style={{ padding: '10px 16px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                          letterSpacing: 1, color: muted, background: dark ? BARTAL.d_bg : '#FBFAF7' }}>{g}</div>
            {moves.filter(m => m.date === g).map((m, i) => {
              const ts = typeStyleAdmin[m.type];
              const positive = m.qty > 0;
              return (
                <div key={i} style={{ display: 'grid',
                  gridTemplateColumns: '80px 1.6fr 1fr 70px 1fr 90px 90px',
                  padding: '12px 16px', borderBottom: `1px solid ${line}`, fontSize: 12, color: text, alignItems: 'center',
                }}>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: muted }}>{m.t}</div>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: muted, marginBottom: 1 }}>{m.sku}</div>
                    <div style={{ fontWeight: 600 }}>{m.name}</div>
                  </div>
                  <div>
                    <span style={{ padding: '3px 9px', borderRadius: 4, background: ts.bg, color: ts.color,
                                   fontSize: 10, fontWeight: 700 }}>{ts.label}</span>
                  </div>
                  <div style={{ textAlign: 'end', fontWeight: 700, fontFamily: "'JetBrains Mono'", fontSize: 12,
                                color: positive ? BARTAL.success : BARTAL.danger }}>
                    {positive ? '+' : ''}{m.qty}
                  </div>
                  <div style={{ fontFamily: m.ref.startsWith('#') || m.ref.startsWith('PO') ? "'JetBrains Mono'" : "'Poppins'",
                                fontSize: 11, color: m.ref.startsWith('#') || m.ref.startsWith('PO') ? BARTAL.info : muted }}>{m.ref}</div>
                  <div style={{ fontSize: 11, color: m.user === 'system' ? muted : text, fontStyle: m.user === 'system' ? 'italic' : 'normal' }}>{m.user}</div>
                  <div style={{ textAlign: 'end', fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 600 }}>{m.stock}</div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div style={{ textAlign: 'center', padding: 16, fontSize: 11, color: muted }}>
        Showing 9 of 248 movements · <span style={{ color: BARTAL.info, fontWeight: 600, cursor: 'pointer' }}>Load more</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ADMIN · ABANDONED CARTS
// ═══════════════════════════════════════════════════════════════
function AdminAbandonedCarts({ dark }) {
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';

  const carts = [
    { name: 'Mohammed Osman', phone: '+249 91 234 5678', items: 3, value: 248000, age: '2h ago',
      stage: 'payment', last: 'Bank transfer · started', recovered: 'low', initials: 'MO' },
    { name: 'Sara Ahmed',    phone: '+249 92 845 1122', items: 1, value: 42000,  age: '4h ago',
      stage: 'address', last: 'Filled address · no payment', recovered: 'medium', initials: 'SA' },
    { name: 'Anonymous',    phone: '—',                items: 2, value: 91500,  age: '6h ago',
      stage: 'cart',    last: 'Added 2 items, left page', recovered: 'low', initials: '?' },
    { name: 'Omar Saad',    phone: '+249 90 555 4433', items: 5, value: 412000, age: '8h ago',
      stage: 'review',  last: 'Reviewed, did not place', recovered: 'high', initials: 'OS' },
    { name: 'Fatima Al-Amin',phone: '+249 91 877 6655',items: 1, value: 28500,  age: '1d ago',
      stage: 'cart',    last: 'Added 1 item, idle', recovered: 'medium', initials: 'FA' },
    { name: 'Anonymous',    phone: '—',                items: 4, value: 156000, age: '1d ago',
      stage: 'address', last: 'Stuck on city selector', recovered: 'low', initials: '?' },
    { name: 'Yousif Hassan',phone: '+249 99 111 2233', items: 2, value: 73000,  age: '2d ago',
      stage: 'payment', last: 'COD rejected (out of zone)', recovered: 'medium', initials: 'YH' },
  ];

  const stages = { cart: { bg: '#E6E8EC', color: '#374151' },
                   address: { bg: BARTAL.info + '15', color: BARTAL.info },
                   payment: { bg: BARTAL.amber + '20', color: BARTAL.amber },
                   review: { bg: BARTAL.success + '15', color: BARTAL.success } };

  const rec = { high: { color: BARTAL.success, label: 'Hot' },
                medium: { color: BARTAL.amber, label: 'Warm' },
                low: { color: muted, label: 'Cold' } };

  return (
    <div style={{ padding: 24, fontFamily: "'Poppins'", color: text, height: '100%', overflow: 'auto' }}>
      {/* funnel summary */}
      <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 18, marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: text }}>Checkout funnel · last 7 days</div>
            <div style={{ fontSize: 11, color: muted }}>Where shoppers drop off and what we can recover</div>
          </div>
          <div style={{ display: 'flex', gap: 10, fontSize: 12 }}>
            <div><span style={{ color: muted }}>Recoverable value:</span>
                 <span style={{ marginInlineStart: 6, fontWeight: 700, color: BARTAL.success }}>4.2M SDG</span></div>
            <div><span style={{ color: muted }}>Recovery rate:</span>
                 <span style={{ marginInlineStart: 6, fontWeight: 700 }}>14.2%</span></div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {[
            { lbl: 'Browse → cart', val: '1,847', pct: 100 },
            { lbl: 'Cart → address',  val: '684',   pct: 37 },
            { lbl: 'Address → payment', val: '412',  pct: 22 },
            { lbl: 'Payment → review', val: '281',   pct: 15 },
            { lbl: 'Review → placed',  val: '187',   pct: 10 },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ height: 60, background: BARTAL.amber + (i === 0 ? '' : '30'), borderRadius: 6, marginBottom: 6,
                            display: 'flex', alignItems: 'flex-end', padding: '4px 8px', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, padding: 6 }}>
                  <div style={{ height: `${s.pct}%`, background: BARTAL.amber, borderRadius: 4 }}/>
                </div>
                <div style={{ position: 'relative', color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono'" }}>{s.val}</div>
              </div>
              <div style={{ fontSize: 10, color: muted, fontWeight: 600 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* table */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, flex: 1 }}>Abandoned carts · 7 today</div>
        <div style={{ padding: '6px 12px', borderRadius: 6, background: surface, border: `1px solid ${line}`,
                      fontSize: 11, color: text, fontWeight: 600, cursor: 'pointer' }}>Stage: All ▼</div>
        <div style={{ padding: '6px 12px', borderRadius: 6, background: BARTAL.amber, color: '#fff',
                      fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Send WhatsApp · 4 selected</div>
      </div>

      <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid',
          gridTemplateColumns: '32px 1.4fr 80px 70px 110px 1fr 70px 130px',
          padding: '12px 16px', background: dark ? BARTAL.d_raised : '#FAFAFA',
          fontSize: 10, color: muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
          borderBottom: `1px solid ${line}`,
        }}>
          <div></div>
          <div>Customer</div>
          <div>Items</div>
          <div style={{ textAlign: 'end' }}>Value</div>
          <div>Stage</div>
          <div>Last event</div>
          <div>Score</div>
          <div style={{ textAlign: 'end' }}>Action</div>
        </div>
        {carts.map((c, i) => {
          const s = stages[c.stage];
          const r = rec[c.recovered];
          return (
            <div key={i} style={{ display: 'grid',
              gridTemplateColumns: '32px 1.4fr 80px 70px 110px 1fr 70px 130px',
              padding: '14px 16px', borderBottom: i < carts.length - 1 ? `1px solid ${line}` : 'none',
              fontSize: 12, alignItems: 'center',
            }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${line}` }}/>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 16, flexShrink: 0,
                  background: c.name === 'Anonymous' ? '#E6E8EC' : BARTAL.amber + '25',
                  color: c.name === 'Anonymous' ? muted : BARTAL.amber,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 11,
                }}>{c.initials}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: text, fontSize: 12 }}>{c.name}</div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: muted }}>{c.phone} · {c.age}</div>
                </div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono'" }}>{c.items}</div>
              <div style={{ textAlign: 'end', fontWeight: 700, color: BARTAL.amber, fontFamily: "'JetBrains Mono'" }}>{fmtSDG(c.value)}</div>
              <div>
                <span style={{ padding: '3px 9px', borderRadius: 4, background: s.bg, color: s.color,
                               fontSize: 10, fontWeight: 700, textTransform: 'capitalize' }}>{c.stage}</span>
              </div>
              <div style={{ fontSize: 11, color: muted }}>{c.last}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: 4, background: r.color }}/>
                <span style={{ fontSize: 11, fontWeight: 600, color: r.color }}>{r.label}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                <div style={{ padding: '5px 8px', borderRadius: 5, border: `1px solid ${line}`,
                              fontSize: 10, color: text, fontWeight: 600, cursor: 'pointer' }}>WhatsApp</div>
                <div style={{ padding: '5px 8px', borderRadius: 5, border: `1px solid ${line}`,
                              fontSize: 10, color: text, fontWeight: 600, cursor: 'pointer' }}>SMS</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, {
  MobileCategoriesScreen, MobilePdpReviewsScreen, MobileCartPromoScreen,
  AdminShippingLabels, AdminInventoryLog, AdminAbandonedCarts,
  ShippingLabelPreview,
});
