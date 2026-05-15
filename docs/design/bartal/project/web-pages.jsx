// web-pages.jsx — Additional web pages (category, PDP, cart, checkout, account)
// Each is a full-fidelity desktop view. Home lives in web-admin.jsx as WebOverview.

// ─── Shared header (reused across pages) ────────────────────────
function WebHeader({ lang, dark, active = 'home' }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const LINKS = [
    { k: 'home',  ar: 'الرئيسية',      en: 'Home' },
    { k: 'elec',  ar: 'الإلكترونيات',  en: 'Electronics' },
    { k: 'frag',  ar: 'العطور',        en: 'Fragrance' },
    { k: 'offers',ar: 'العروض',        en: 'Offers' },
  ];

  return (
    <>
      <div style={{
        background: BARTAL.navyInk, color: '#fff', padding: '8px 24px',
        fontSize: 12, textAlign: 'center', letterSpacing: 0.3,
      }}>
        {isAr ? 'توصيل مجاني على الطلبات فوق ٥٠٬٠٠٠ ج.س — جميع مناطق الخرطوم' : 'Free delivery on orders over 50,000 SDG — all Khartoum zones'}
      </div>
      <div style={{
        background: surface, borderBottom: `1px solid ${line}`,
        padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 28,
      }}>
        <BartalLogo color={dark ? BARTAL.d_text : BARTAL.navy} accent={BARTAL.amber} size={24} lang={lang}/>
        <div style={{ display: 'flex', gap: 20, flex: 1 }}>
          {LINKS.map(l => {
            const on = l.k === active;
            return (
              <div key={l.k} style={{
                fontSize: 14, fontWeight: on ? 700 : 500,
                color: on ? (dark ? BARTAL.d_text : BARTAL.navy) : muted,
                borderBottom: on ? `2px solid ${BARTAL.amber}` : 'none',
                paddingBottom: 3,
              }}>{l[lang]}</div>
            );
          })}
        </div>
        <div style={{
          background: dark ? BARTAL.d_raised : BARTAL.sand, borderRadius: 8, padding: '7px 12px',
          fontSize: 13, color: muted, display: 'flex', alignItems: 'center', gap: 8, width: 240,
        }}>
          <SearchIcon color={muted} size={14}/>
          {t('search', lang)}
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: muted }}>{lang === 'ar' ? 'EN' : 'ع'}</div>
          <UserIcon color={text} size={18}/>
          <div style={{ position: 'relative' }}>
            <BagIcon color={text} size={20}/>
            <div style={{
              position: 'absolute', top: -4, insetInlineEnd: -6,
              background: BARTAL.amber, color: '#fff',
              width: 16, height: 16, borderRadius: 8,
              fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>2</div>
          </div>
        </div>
      </div>
    </>
  );
}

function WebFooter({ lang, dark }) {
  const isAr = lang === 'ar';
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  return (
    <div style={{
      background: dark ? BARTAL.d_surface : BARTAL.sand, padding: '20px 24px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderTop: `1px solid ${line}`, fontSize: 11, color: muted,
    }}>
      <div>© 2026 Bartal · {isAr ? 'الخرطوم، السودان' : 'Khartoum, Sudan'}</div>
      <div style={{ display: 'flex', gap: 16 }}>
        <span>{isAr ? 'سياسة الشحن' : 'Shipping'}</span>
        <span>{isAr ? 'الإرجاع' : 'Returns'}</span>
        <span>{isAr ? 'اتصل بنا' : 'Contact'}</span>
        <span style={{ color: BARTAL.amber }}>WhatsApp +249 91 234 5678</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 2. CATEGORY  — filters sidebar + grid
// ═══════════════════════════════════════════════════════════════
function WebCategory({ lang, dark }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  // Use catalog × 3 for a fuller grid
  const items = [...CATALOG, ...CATALOG, ...CATALOG].slice(0, 12)
    .map((p, i) => ({ ...p, id: `${p.id}-${i}` }));

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'auto',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
    }}>
      <WebHeader lang={lang} dark={dark} active="frag"/>

      {/* Breadcrumb */}
      <div style={{
        padding: '16px 24px 6px', fontSize: 12, color: muted,
        display: 'flex', gap: 6, alignItems: 'center',
      }}>
        <span>{isAr ? 'الرئيسية' : 'Home'}</span>
        <span>{isAr ? '◂' : '▸'}</span>
        <span style={{ color: text, fontWeight: 600 }}>
          {isAr ? 'العطور وبخور' : 'Fragrance & Bakhoor'}
        </span>
      </div>

      {/* Title row */}
      <div style={{
        padding: '4px 24px 18px', display: 'flex',
        alignItems: 'flex-end', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, color: text }}>
            {isAr ? 'العطور وبخور' : 'Fragrance & Bakhoor'}
          </div>
          <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>
            {isAr ? '١٢٨ منتجاً · ترتيب حسب' : '128 products · Sort by'}
            <span style={{ color: text, fontWeight: 600, marginInlineStart: 6 }}>
              {isAr ? 'الأكثر مبيعاً ▾' : 'Best selling ▾'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            isAr ? 'الأكثر مبيعاً' : 'Best selling',
            isAr ? 'الأحدث' : 'Newest',
            isAr ? 'السعر: الأقل' : 'Price: low',
            isAr ? 'السعر: الأعلى' : 'Price: high',
          ].map((s, i) => (
            <div key={i} style={{
              padding: '6px 12px', borderRadius: 100, fontSize: 12,
              background: i === 0 ? BARTAL.amber : 'transparent',
              color: i === 0 ? '#fff' : muted,
              border: i === 0 ? 'none' : `1px solid ${line}`,
              fontWeight: 600,
            }}>{s}</div>
          ))}
        </div>
      </div>

      {/* Main: filters + grid */}
      <div style={{ padding: '0 24px 20px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20 }}>
        {/* Filters */}
        <div style={{
          background: surface, border: `1px solid ${line}`, borderRadius: 12,
          padding: 18, alignSelf: 'start',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 14 }}>
            {isAr ? 'تصفية' : 'Filters'}
          </div>

          {/* Price */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: text, marginBottom: 8,
                           textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {isAr ? 'السعر (ج.س)' : 'Price (SDG)'}
            </div>
            <div style={{
              height: 4, background: line, borderRadius: 2, position: 'relative', margin: '14px 0',
            }}>
              <div style={{ position: 'absolute', insetInlineStart: '15%', width: '60%', height: '100%', background: BARTAL.amber, borderRadius: 2 }}/>
              <div style={{ position: 'absolute', insetInlineStart: '15%', top: -5, width: 14, height: 14, borderRadius: 7, background: '#fff', border: `2px solid ${BARTAL.amber}` }}/>
              <div style={{ position: 'absolute', insetInlineStart: '75%', top: -5, width: 14, height: 14, borderRadius: 7, background: '#fff', border: `2px solid ${BARTAL.amber}` }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: muted, fontFamily: "'JetBrains Mono', monospace" }}>
              <span>15,000</span>
              <span>285,000</span>
            </div>
          </div>

          {/* Brand */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: text, marginBottom: 8,
                           textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {isAr ? 'الماركة' : 'Brand'}
            </div>
            {[
              { n: isAr ? 'عجمل' : 'Ajmal', c: 34, on: true },
              { n: isAr ? 'الرحاب' : 'Al Rehab', c: 28, on: true },
              { n: isAr ? 'السويدي' : 'Al Suwaidi', c: 18 },
              { n: 'Swiss Arabian', c: 14 },
              { n: 'Rasasi', c: 12 },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 12 }}>
                <div style={{
                  width: 16, height: 16, borderRadius: 4,
                  border: `1.5px solid ${b.on ? BARTAL.amber : line}`,
                  background: b.on ? BARTAL.amber : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {b.on && <CheckIcon color="#fff" size={10}/>}
                </div>
                <span style={{ flex: 1, color: text }}>{b.n}</span>
                <span style={{ color: muted, fontSize: 11 }}>{b.c}</span>
              </div>
            ))}
            <div style={{ marginTop: 6, fontSize: 11, color: BARTAL.amber, fontWeight: 600 }}>
              {isAr ? '+ المزيد' : '+ Show more'}
            </div>
          </div>

          {/* Type */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: text, marginBottom: 8,
                           textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {isAr ? 'النوع' : 'Type'}
            </div>
            {[
              isAr ? 'عطور' : 'Perfume',
              isAr ? 'بخور' : 'Bakhoor',
              isAr ? 'عود' : 'Oud',
              isAr ? 'دهن العود' : 'Oud oil',
            ].map((n, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 12 }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${line}` }}/>
                <span style={{ color: text }}>{n}</span>
              </div>
            ))}
          </div>

          {/* Delivery */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: text, marginBottom: 8,
                           textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {isAr ? 'التوصيل' : 'Delivery'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 12 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${line}` }}/>
              <span style={{ color: text }}>{isAr ? 'متوفر اليوم' : 'Same day'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 12 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4,
                            border: `1.5px solid ${BARTAL.amber}`, background: BARTAL.amber,
                            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckIcon color="#fff" size={10}/>
              </div>
              <span style={{ color: text }}>{isAr ? 'خلال ٢٤ ساعة' : 'Within 24h'}</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {items.map(p => (
            <div key={p.id} style={{
              background: surface, borderRadius: 12, border: `1px solid ${line}`, overflow: 'hidden',
            }}>
              <div style={{ height: 170, position: 'relative' }}>
                <ProductPlaceholder label={p.name_en} hue={p.hue}/>
                {/* heart */}
                <div style={{
                  position: 'absolute', top: 10, insetInlineEnd: 10,
                  width: 30, height: 30, borderRadius: 15, background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)', fontSize: 14,
                }}>♡</div>
              </div>
              <div style={{ padding: '12px 14px 14px' }}>
                <div style={{ fontSize: 10, color: muted, letterSpacing: 0.5,
                              textTransform: 'uppercase', fontWeight: 600 }}>{p.brand}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: text, minHeight: 34, marginTop: 3,
                              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {isAr ? p.name_ar : p.name_en}
                </div>
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <PriceTag amount={p.price} lang={lang} size={14} color={BARTAL.amber}/>
                  <div style={{
                    fontSize: 11, color: BARTAL.success, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 3,
                  }}>
                    <TruckIcon color={BARTAL.success} size={11}/>
                    {isAr ? '٢٤س' : '24h'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <WebFooter lang={lang} dark={dark}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 3. PRODUCT DETAIL (PDP)
// ═══════════════════════════════════════════════════════════════
function WebPDP({ lang, dark }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;
  const p = CATALOG[0];

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'auto',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
    }}>
      <WebHeader lang={lang} dark={dark} active="elec"/>

      <div style={{ padding: '16px 24px 6px', fontSize: 12, color: muted,
                    display: 'flex', gap: 6, alignItems: 'center' }}>
        <span>{isAr ? 'الرئيسية' : 'Home'}</span>
        <span>{isAr ? '◂' : '▸'}</span>
        <span>{isAr ? 'الإلكترونيات' : 'Electronics'}</span>
        <span>{isAr ? '◂' : '▸'}</span>
        <span style={{ color: text, fontWeight: 600 }}>{isAr ? p.name_ar : p.name_en}</span>
      </div>

      <div style={{ padding: '18px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
        {/* Gallery */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 68 }}>
            {[p.hue, 'navy', 'amber', 'warm'].map((h, i) => (
              <div key={i} style={{
                width: 68, height: 68, borderRadius: 8, overflow: 'hidden',
                border: i === 0 ? `2px solid ${BARTAL.amber}` : `1px solid ${line}`,
              }}>
                <ProductPlaceholder label="view" hue={h}/>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, height: 460, borderRadius: 14, overflow: 'hidden', border: `1px solid ${line}` }}>
            <ProductPlaceholder label={p.name_en} hue={p.hue}/>
          </div>
        </div>

        {/* Info */}
        <div>
          <div style={{ fontSize: 12, color: BARTAL.amber, fontWeight: 600, letterSpacing: 0.5,
                        textTransform: 'uppercase' }}>{p.brand}</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: text, lineHeight: 1.2, marginTop: 4 }}>
            {isAr ? p.name_ar : p.name_en}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, fontSize: 12, color: muted }}>
            <span style={{ color: BARTAL.amber }}>★★★★☆</span>
            <span>4.6 · {isAr ? '١٢٨ تقييم' : '128 reviews'}</span>
            <span>·</span>
            <span style={{ color: BARTAL.success, fontWeight: 600 }}>{isAr ? 'متوفر' : 'In stock'}</span>
          </div>

          <div style={{ marginTop: 22, paddingBottom: 22, borderBottom: `1px solid ${line}` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <PriceTag amount={p.price} lang={lang} size={30} color={BARTAL.amber}/>
              <span style={{ fontSize: 14, color: muted, textDecoration: 'line-through' }}>
                {(p.price * 1.25).toLocaleString()} {isAr ? 'ج.س' : 'SDG'}
              </span>
              <span style={{
                fontSize: 11, background: BARTAL.amberTint, color: BARTAL.amber,
                padding: '2px 8px', borderRadius: 10, fontWeight: 700,
              }}>-20%</span>
            </div>
            <div style={{ fontSize: 12, color: muted, marginTop: 4 }}>
              {isAr ? 'شامل الضريبة · يوفر ٢٥٬٠٠٠ ج.س' : 'Incl. VAT · You save 25,000 SDG'}
            </div>
          </div>

          {/* Color */}
          <div style={{ marginTop: 22 }}>
            <div style={{ fontSize: 12, color: muted, fontWeight: 600, marginBottom: 8 }}>
              {isAr ? 'اللون: ' : 'Color: '}
              <span style={{ color: text }}>{isAr ? 'أزرق كحلي' : 'Navy blue'}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['navy', 'amber', 'warm', 'rose'].map((h, i) => (
                <div key={i} style={{
                  width: 38, height: 38, borderRadius: 19, overflow: 'hidden',
                  border: i === 0 ? `2.5px solid ${BARTAL.amber}` : `1.5px solid ${line}`,
                }}>
                  <ProductPlaceholder label="" hue={h}/>
                </div>
              ))}
            </div>
          </div>

          {/* Qty + CTA */}
          <div style={{ marginTop: 22, display: 'flex', gap: 12 }}>
            <div style={{
              display: 'flex', alignItems: 'center', border: `1px solid ${line}`,
              borderRadius: 10, background: surface,
            }}>
              <div style={{ padding: '10px 14px', fontSize: 16, color: text, fontWeight: 700 }}>−</div>
              <div style={{ padding: '10px 14px', fontSize: 14, color: text, fontWeight: 700,
                            borderInline: `1px solid ${line}` }}>1</div>
              <div style={{ padding: '10px 14px', fontSize: 16, color: text, fontWeight: 700 }}>+</div>
            </div>
            <button style={{
              flex: 1, background: BARTAL.amber, color: '#fff', border: 'none',
              padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 700,
              fontFamily: 'inherit',
            }}>
              {isAr ? 'أضف إلى السلة' : 'Add to cart'}
            </button>
            <button style={{
              background: surface, color: text, border: `1px solid ${line}`,
              padding: '12px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600,
              fontFamily: 'inherit',
            }}>♡</button>
          </div>

          {/* Delivery card */}
          <div style={{
            marginTop: 22, padding: 14, border: `1px solid ${line}`, borderRadius: 10,
            background: dark ? BARTAL.d_raised : BARTAL.sand,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <TruckIcon color={BARTAL.success} size={18}/>
              <div style={{ fontSize: 13, fontWeight: 700, color: text }}>
                {isAr ? 'توصيل خلال ٢٤ ساعة' : 'Delivery within 24h'}
              </div>
            </div>
            <div style={{ fontSize: 12, color: muted, lineHeight: 1.5 }}>
              {isAr
                ? 'التوصيل إلى الخرطوم ٢ · ٨٠٠ ج.س · يصل غداً'
                : 'Delivery to Khartoum 2 · 800 SDG · arrives tomorrow'}
            </div>
            <div style={{ fontSize: 12, color: BARTAL.amber, fontWeight: 600, marginTop: 6 }}>
              {isAr ? 'تغيير المنطقة ▾' : 'Change zone ▾'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '10px 24px', borderTop: `1px solid ${line}`, marginTop: 20 }}>
        <div style={{ display: 'flex', gap: 24, borderBottom: `1px solid ${line}` }}>
          {[
            isAr ? 'الوصف' : 'Description',
            isAr ? 'المواصفات' : 'Specifications',
            isAr ? 'التقييمات (١٢٨)' : 'Reviews (128)',
            isAr ? 'الشحن والإرجاع' : 'Shipping & Returns',
          ].map((tab, i) => (
            <div key={i} style={{
              padding: '12px 0', fontSize: 13, fontWeight: i === 0 ? 700 : 500,
              color: i === 0 ? text : muted,
              borderBottom: i === 0 ? `2px solid ${BARTAL.amber}` : 'none',
            }}>{tab}</div>
          ))}
        </div>
        <div style={{ padding: '16px 0 30px', fontSize: 13, color: muted, lineHeight: 1.7, maxWidth: 700 }}>
          {isAr
            ? 'سماعات لاسلكية احترافية بجودة صوت فائقة الوضوح وإلغاء ضوضاء نشط من الجيل الثاني. مدة تشغيل تصل إلى ٣٠ ساعة مع العلبة، شحن سريع ١٥ دقيقة = ٣ ساعات استماع. متوافقة مع جميع الأجهزة عبر البلوتوث ٥.٣.'
            : 'Professional wireless headphones with exceptional sound clarity and 2nd-gen active noise cancellation. Up to 30 hours of playback with the case, fast charge 15 min = 3 hours listening. Compatible with all devices via Bluetooth 5.3.'}
        </div>
      </div>

      <WebFooter lang={lang} dark={dark}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 4. CART  — 2-col layout: items + summary
// ═══════════════════════════════════════════════════════════════
function WebCart({ lang, dark }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const items = CATALOG.slice(0, 3).map((p, i) => ({ ...p, qty: [1, 2, 1][i] }));
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const delivery = 800;
  const total = subtotal + delivery;

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'auto',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
    }}>
      <WebHeader lang={lang} dark={dark}/>

      <div style={{ padding: '24px 24px 10px' }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: text }}>
          {isAr ? 'سلة التسوق' : 'Shopping cart'}
        </div>
        <div style={{ fontSize: 13, color: muted, marginTop: 2 }}>
          {isAr ? `${items.length} منتجات` : `${items.length} items`}
        </div>
      </div>

      <div style={{ padding: '10px 24px 30px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        {/* Items */}
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'hidden' }}>
          {items.map((it, i) => (
            <div key={it.id} style={{
              display: 'grid', gridTemplateColumns: '88px 1fr auto auto', gap: 14, alignItems: 'center',
              padding: 16, borderTop: i === 0 ? 'none' : `1px solid ${line}`,
            }}>
              <div style={{ width: 88, height: 88, borderRadius: 10, overflow: 'hidden' }}>
                <ProductPlaceholder label={it.name_en} hue={it.hue}/>
              </div>
              <div>
                <div style={{ fontSize: 10, color: muted, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>{it.brand}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: text, marginTop: 2 }}>
                  {isAr ? it.name_ar : it.name_en}
                </div>
                <div style={{ fontSize: 11, color: BARTAL.success, marginTop: 4, fontWeight: 600 }}>
                  ● {isAr ? 'متوفر · يصل غداً' : 'In stock · arrives tomorrow'}
                </div>
                <div style={{ marginTop: 6, display: 'flex', gap: 12, fontSize: 11 }}>
                  <span style={{ color: muted, textDecoration: 'underline' }}>
                    {isAr ? 'حفظ لاحقاً' : 'Save for later'}
                  </span>
                  <span style={{ color: BARTAL.danger, textDecoration: 'underline' }}>
                    {isAr ? 'حذف' : 'Remove'}
                  </span>
                </div>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', border: `1px solid ${line}`, borderRadius: 8,
              }}>
                <div style={{ padding: '6px 10px', fontSize: 14, color: text, fontWeight: 700 }}>−</div>
                <div style={{ padding: '6px 12px', fontSize: 13, color: text, fontWeight: 700,
                              borderInline: `1px solid ${line}` }}>{it.qty}</div>
                <div style={{ padding: '6px 10px', fontSize: 14, color: text, fontWeight: 700 }}>+</div>
              </div>
              <div style={{ textAlign: isAr ? 'left' : 'right', minWidth: 100 }}>
                <PriceTag amount={it.price * it.qty} lang={lang} size={15} color={text}/>
                {it.qty > 1 && (
                  <div style={{ fontSize: 10, color: muted, marginTop: 2 }}>
                    {it.price.toLocaleString()} × {it.qty}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Promo banner */}
          <div style={{
            padding: '14px 16px', borderTop: `1px solid ${line}`,
            background: dark ? BARTAL.d_raised : BARTAL.amberTint,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ fontSize: 22 }}>🎁</div>
            <div style={{ fontSize: 12, color: text, flex: 1 }}>
              {isAr
                ? 'أضف ٢٢٬٠٠٠ ج.س إضافية لتحصل على توصيل مجاني'
                : 'Add 22,000 SDG more to get free delivery'}
            </div>
            <div style={{ fontSize: 12, color: BARTAL.amber, fontWeight: 600 }}>
              {isAr ? 'تسوق ←' : '← Keep shopping'}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: text, marginBottom: 14 }}>
              {isAr ? 'ملخص الطلب' : 'Order summary'}
            </div>
            {[
              [isAr ? 'المجموع الفرعي' : 'Subtotal', subtotal.toLocaleString()],
              [isAr ? 'التوصيل (الخرطوم ٢)' : 'Delivery (Khartoum 2)', delivery.toLocaleString()],
              [isAr ? 'الضريبة' : 'Tax', isAr ? 'شاملة' : 'Included'],
            ].map(([k, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
                <span style={{ color: muted }}>{k}</span>
                <span style={{ color: text, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
              </div>
            ))}

            {/* Promo input */}
            <div style={{
              marginTop: 10, display: 'flex', gap: 6, padding: 2,
              border: `1px solid ${line}`, borderRadius: 8,
            }}>
              <div style={{ flex: 1, padding: '8px 10px', fontSize: 12, color: muted }}>
                {isAr ? 'رمز الخصم' : 'Promo code'}
              </div>
              <div style={{
                padding: '8px 14px', background: BARTAL.navy, color: '#fff',
                borderRadius: 6, fontSize: 12, fontWeight: 600,
              }}>
                {isAr ? 'تطبيق' : 'Apply'}
              </div>
            </div>

            <div style={{ height: 1, background: line, margin: '14px 0' }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 14, color: text, fontWeight: 700 }}>
                {isAr ? 'الإجمالي' : 'Total'}
              </span>
              <PriceTag amount={total} lang={lang} size={20} color={BARTAL.amber}/>
            </div>

            <button style={{
              width: '100%', background: BARTAL.amber, color: '#fff', border: 'none',
              padding: '13px', borderRadius: 10, fontSize: 14, fontWeight: 700,
              fontFamily: 'inherit', marginTop: 16,
            }}>
              {isAr ? 'المتابعة للدفع ←' : 'Proceed to checkout →'}
            </button>

            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: muted }}>
              {isAr ? '🔒 دفع آمن عبر التحويل البنكي' : '🔒 Secure bank transfer payment'}
            </div>
          </div>

          {/* Trust badges */}
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: '12px 16px' }}>
            {[
              [TruckIcon, isAr ? 'توصيل سريع عبر الخرطوم' : 'Fast Khartoum delivery'],
              [PackageIcon, isAr ? 'إرجاع خلال ٧ أيام' : '7-day returns'],
              [CameraIcon, isAr ? 'دفع بإيصال البنك' : 'Pay by bank receipt'],
            ].map(([Ic, lbl], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 12, color: text }}>
                <Ic color={BARTAL.amber} size={16}/>
                {lbl}
              </div>
            ))}
          </div>
        </div>
      </div>

      <WebFooter lang={lang} dark={dark}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 5. CHECKOUT  — 3-step stepper with bank transfer upload
// ═══════════════════════════════════════════════════════════════
function WebCheckout({ lang, dark, step = 'payment' }) {
  // step: 'address' | 'payment' | 'bank' | 'review'
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const stepIdx = { address: 0, payment: 1, bank: 1, review: 2 }[step] ?? 1;
  const steps = [
    { lbl: isAr ? 'العنوان' : 'Address',  done: stepIdx > 0, on: stepIdx === 0 },
    { lbl: isAr ? 'الدفع' : 'Payment',    done: stepIdx > 1, on: stepIdx === 1 },
    { lbl: isAr ? 'المراجعة' : 'Review',  done: false,       on: stepIdx === 2 },
  ];

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'auto',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
    }}>
      <WebHeader lang={lang} dark={dark}/>

      {/* Stepper */}
      <div style={{
        padding: '20px 24px 14px', background: surface,
        borderBottom: `1px solid ${line}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: 600, margin: '0 auto' }}>
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 14,
                  background: s.done ? BARTAL.success : (s.on ? BARTAL.amber : (dark ? BARTAL.d_raised : '#F3F4F6')),
                  color: (s.done || s.on) ? '#fff' : muted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                }}>
                  {s.done ? <CheckIcon color="#fff" size={12}/> : i + 1}
                </div>
                <div style={{
                  fontSize: 13, fontWeight: s.on ? 700 : 500,
                  color: (s.done || s.on) ? text : muted,
                }}>{s.lbl}</div>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  flex: 1, height: 2, background: s.done ? BARTAL.success : line, margin: '0 14px',
                }}/>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        {/* Payment method */}
        <div>
          {step === 'address' && <WebCheckoutAddress lang={lang} dark={dark}/>}
          {step === 'bank' && <WebCheckoutBank lang={lang} dark={dark}/>}
          {step === 'review' && <WebCheckoutReview lang={lang} dark={dark}/>}
          {step === 'payment' && <>
          <div style={{ fontSize: 20, fontWeight: 700, color: text, marginBottom: 14 }}>
            {isAr ? 'طريقة الدفع' : 'Payment method'}
          </div>

          {/* Bank transfer (selected) */}
          <div style={{
            background: surface, border: `2px solid ${BARTAL.amber}`, borderRadius: 12,
            padding: 18, marginBottom: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 20, height: 20, borderRadius: 10, border: `2px solid ${BARTAL.amber}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, background: BARTAL.amber }}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: text }}>
                  {isAr ? 'تحويل بنكي' : 'Bank transfer'}
                </div>
                <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>
                  {isAr ? 'حوّل المبلغ ثم ارفع إيصال البنك' : 'Transfer the amount, then upload your bank receipt'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {['FIB', 'BOK', 'FSB'].map(b => (
                  <div key={b} style={{
                    padding: '3px 7px', background: BARTAL.navy, color: '#fff',
                    borderRadius: 4, fontSize: 10, fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>{b}</div>
                ))}
              </div>
            </div>

            {/* Bank details */}
            <div style={{
              background: dark ? BARTAL.d_raised : BARTAL.sand, borderRadius: 10,
              padding: 14, marginBottom: 14,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              <div style={{ fontSize: 10, color: muted, marginBottom: 8, fontFamily: isAr ? "'Cairo'" : "'Poppins'", textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
                {isAr ? 'التحويل إلى' : 'Transfer to'}
              </div>
              {[
                [isAr ? 'البنك' : 'Bank',       'Faisal Islamic Bank'],
                [isAr ? 'اسم الحساب' : 'Account', 'BARTAL ECOMMERCE LTD'],
                [isAr ? 'رقم الحساب' : 'Account #', '0012-345-678-9000'],
                [isAr ? 'المبلغ' : 'Amount',     '227,800 SDG'],
                [isAr ? 'المرجع' : 'Reference',  'BRT-2026-00847'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 12 }}>
                  <span style={{ color: muted, fontFamily: isAr ? "'Cairo'" : "'Poppins'" }}>{k}</span>
                  <span style={{ color: text, fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Upload */}
            <div style={{
              border: `2px dashed ${BARTAL.amber}`, borderRadius: 10,
              padding: '22px 14px', textAlign: 'center',
              background: BARTAL.amberTint,
            }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>📸</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 3 }}>
                {isAr ? 'ارفع إيصال التحويل' : 'Upload transfer receipt'}
              </div>
              <div style={{ fontSize: 11, color: muted }}>
                {isAr ? 'صورة واضحة · PNG أو JPG · حتى ٥ ميجا' : 'Clear photo · PNG or JPG · up to 5MB'}
              </div>
              <div style={{
                display: 'inline-block', marginTop: 10,
                padding: '8px 16px', background: BARTAL.amber, color: '#fff',
                borderRadius: 8, fontSize: 12, fontWeight: 700,
              }}>
                {isAr ? 'اختر ملف' : 'Choose file'}
              </div>
            </div>
          </div>

          {/* Alternative: COD */}
          <div style={{
            background: surface, border: `1px solid ${line}`, borderRadius: 12,
            padding: 16, display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: 10, border: `1.5px solid ${line}`,
            }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: text }}>
                {isAr ? 'الدفع عند الاستلام' : 'Cash on delivery'}
              </div>
              <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>
                {isAr ? 'رسوم إضافية ٢٬٠٠٠ ج.س · يتطلب إثبات هوية' : 'Additional fee 2,000 SDG · requires ID verification'}
              </div>
            </div>
          </div>
          </>}
        </div>

        {/* Summary */}
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 18, alignSelf: 'start' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 14 }}>
            {isAr ? 'ملخص الطلب' : 'Order summary'}
          </div>
          {CATALOG.slice(0, 3).map(p => (
            <div key={p.id} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                <ProductPlaceholder label={p.name_en} hue={p.hue}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: text, fontWeight: 500,
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isAr ? p.name_ar : p.name_en}
                </div>
                <div style={{ fontSize: 10, color: muted, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>
                  {p.price.toLocaleString()} SDG × 1
                </div>
              </div>
            </div>
          ))}

          <div style={{ height: 1, background: line, margin: '12px 0' }}/>
          {[
            [isAr ? 'المجموع' : 'Subtotal', '227,000'],
            [isAr ? 'التوصيل' : 'Delivery', '800'],
          ].map(([k, v], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 12 }}>
              <span style={{ color: muted }}>{k}</span>
              <span style={{ color: text, fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
            </div>
          ))}
          <div style={{ height: 1, background: line, margin: '12px 0' }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 13, color: text, fontWeight: 700 }}>{isAr ? 'الإجمالي' : 'Total'}</span>
            <PriceTag amount={227800} lang={lang} size={18} color={BARTAL.amber}/>
          </div>

          {/* Delivery to */}
          <div style={{
            marginTop: 14, padding: 12,
            background: dark ? BARTAL.d_raised : BARTAL.sand, borderRadius: 8,
          }}>
            <div style={{ fontSize: 10, color: muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {isAr ? 'التوصيل إلى' : 'Delivering to'}
            </div>
            <div style={{ fontSize: 12, color: text, marginTop: 4, fontWeight: 500 }}>
              Mohammed Osman · +249 91 234 5678
            </div>
            <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>
              {isAr ? 'الخرطوم ٢ · مبنى النيل، الطابق ٣' : 'Khartoum 2 · Nile Building, 3rd floor'}
            </div>
          </div>
        </div>
      </div>

      <WebFooter lang={lang} dark={dark}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 6. ACCOUNT  — dashboard w/ orders, addresses, etc.
// ═══════════════════════════════════════════════════════════════
function WebAccount({ lang, dark }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const ORDERS = [
    { id: 'BRT-00844', date: isAr ? '١٩ أبريل ٢٠٢٦' : '19 Apr 2026', items: 2, amt: 228000, st: 'receipt' },
    { id: 'BRT-00812', date: isAr ? '١٥ أبريل ٢٠٢٦' : '15 Apr 2026', items: 1, amt: 67000,  st: 'delivered' },
    { id: 'BRT-00798', date: isAr ? '١٠ أبريل ٢٠٢٦' : '10 Apr 2026', items: 3, amt: 145000, st: 'delivered' },
    { id: 'BRT-00762', date: isAr ? '٢ أبريل ٢٠٢٦' : '2 Apr 2026',   items: 1, amt: 42000,  st: 'cancelled' },
  ];

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'auto',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
    }}>
      <WebHeader lang={lang} dark={dark}/>

      <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20 }}>
        {/* Sidebar */}
        <div>
          {/* Profile */}
          <div style={{
            background: surface, border: `1px solid ${line}`, borderRadius: 12,
            padding: 16, marginBottom: 12, textAlign: 'center',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 32, background: BARTAL.amber,
              margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 22, fontWeight: 700,
            }}>MO</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: text }}>Mohammed Osman</div>
            <div style={{ fontSize: 11, color: muted, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>
              +249 91 234 5678
            </div>
            <div style={{
              display: 'inline-block', marginTop: 8,
              padding: '2px 10px', background: BARTAL.amberTint, color: BARTAL.amber,
              borderRadius: 10, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
            }}>
              {isAr ? 'عضو ذهبي' : 'Gold member'}
            </div>
          </div>

          {/* Nav */}
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'hidden' }}>
            {[
              { lbl: isAr ? 'لوحة الحساب' : 'Overview',  on: true,  icon: GridIcon },
              { lbl: isAr ? 'طلباتي' : 'My orders',      icon: PackageIcon, badge: 1 },
              { lbl: isAr ? 'المفضلة' : 'Wishlist',      icon: CameraIcon },
              { lbl: isAr ? 'العناوين' : 'Addresses',    icon: TruckIcon },
              { lbl: isAr ? 'الإعدادات' : 'Settings',    icon: UserIcon },
            ].map((it, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px', fontSize: 13, fontWeight: it.on ? 700 : 500,
                color: it.on ? BARTAL.amber : text,
                background: it.on ? (dark ? 'rgba(212,134,11,0.1)' : BARTAL.amberTint) : 'transparent',
                borderTop: i === 0 ? 'none' : `1px solid ${line}`,
                borderInlineStart: it.on ? `3px solid ${BARTAL.amber}` : `3px solid transparent`,
              }}>
                <it.icon color={it.on ? BARTAL.amber : muted} size={15}/>
                <span style={{ flex: 1 }}>{it.lbl}</span>
                {it.badge && (
                  <div style={{
                    background: BARTAL.danger, color: '#fff',
                    width: 18, height: 18, borderRadius: 9,
                    fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{it.badge}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, color: text, marginBottom: 4 }}>
            {isAr ? `أهلاً، محمد` : `Hi, Mohammed`}
          </div>
          <div style={{ fontSize: 13, color: muted, marginBottom: 18 }}>
            {isAr ? 'عضو منذ فبراير ٢٠٢٥ · ٤٢ طلب' : 'Member since Feb 2025 · 42 orders'}
          </div>

          {/* Stats cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
            {[
              { lbl: isAr ? 'إجمالي الإنفاق' : 'Total spent',     val: '1.4M', unit: 'SDG' },
              { lbl: isAr ? 'طلبات نشطة' : 'Active orders',       val: '2',    unit: '' },
              { lbl: isAr ? 'نقاط المكافآت' : 'Loyalty points',   val: '840',  unit: 'pts' },
            ].map((k, i) => (
              <div key={i} style={{
                background: surface, border: `1px solid ${line}`, borderRadius: 12,
                padding: '14px 16px',
              }}>
                <div style={{ fontSize: 10, color: muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{k.lbl}</div>
                <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 5 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: text }}>{k.val}</div>
                  {k.unit && <div style={{ fontSize: 11, color: muted }}>{k.unit}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Active alert */}
          <div style={{
            background: BARTAL.amberTint, border: `1px solid ${BARTAL.amber}`,
            borderRadius: 12, padding: 14, marginBottom: 18,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ fontSize: 22 }}>⚠️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: text }}>
                {isAr ? 'طلب BRT-00844 قيد المراجعة' : 'Order BRT-00844 under review'}
              </div>
              <div style={{ fontSize: 11, color: BARTAL.text, marginTop: 2 }}>
                {isAr ? 'رفعت الإيصال منذ ١٤ دقيقة — عادة ٥–١٥ دقيقة للموافقة' : 'Receipt uploaded 14 min ago — usually approved within 5–15 min'}
              </div>
            </div>
          </div>

          {/* Orders */}
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{
              padding: '14px 16px', borderBottom: `1px solid ${line}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: text }}>
                {isAr ? 'طلباتي الأخيرة' : 'Recent orders'}
              </div>
              <div style={{ fontSize: 12, color: BARTAL.amber, fontWeight: 600 }}>
                {isAr ? 'عرض الكل ←' : 'View all →'}
              </div>
            </div>
            {ORDERS.map((o, i) => (
              <div key={o.id} style={{
                padding: '14px 16px', borderTop: i === 0 ? 'none' : `1px solid ${line}`,
                display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 14, alignItems: 'center',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: dark ? BARTAL.d_raised : BARTAL.sand,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <PackageIcon color={BARTAL.amber} size={18}/>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: text, fontFamily: "'JetBrains Mono', monospace" }}>
                    {o.id}
                  </div>
                  <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>
                    {o.date} · {isAr ? `${o.items} منتج` : `${o.items} items`}
                  </div>
                </div>
                <div><StatusPill st={o.st}/></div>
                <div style={{ textAlign: isAr ? 'left' : 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: text, fontFamily: "'JetBrains Mono', monospace" }}>
                    {o.amt.toLocaleString()} <span style={{ fontSize: 10, color: muted, fontWeight: 500 }}>SDG</span>
                  </div>
                  <div style={{ fontSize: 11, color: BARTAL.amber, fontWeight: 600, marginTop: 2 }}>
                    {isAr ? 'التفاصيل ←' : 'Details →'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <WebFooter lang={lang} dark={dark}/>
    </div>
  );
}

Object.assign(window, {
  WebHeader, WebFooter, WebCategory, WebPDP, WebCart, WebCheckout, WebAccount,
});
