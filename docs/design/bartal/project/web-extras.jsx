// web-extras.jsx — Missing web pages:
// SearchResults, Wishlist, OrderHistory, OrderDetailWeb, ReceiptUploadWeb, ToS, FAQ

function WebShell({ lang, dark, children, breadcrumb }) {
  const isAr = lang === 'ar';
  const surface = dark ? '#132744' : '#fff';
  const bg = dark ? BARTAL.d_bg : '#FBFAF7';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto',
                                              fontFamily: isAr ? "'Cairo'" : "'Poppins'" }}>
      {/* top nav */}
      <div style={{
        background: surface, borderBottom: `1px solid ${line}`,
        padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 24,
      }}>
        <BartalLogo color={dark ? '#F3EFE6' : BARTAL.navy} accent={BARTAL.amber} size={22} lang={lang}/>
        <div style={{ display: 'flex', gap: 22 }}>
          {[
            { ar: 'الرئيسية', en: 'Home' },
            { ar: 'الفئات', en: 'Categories' },
            { ar: 'العروض', en: 'Deals' },
            { ar: 'العلامات', en: 'Brands' },
          ].map((l, i) => (
            <span key={i} style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: i === 0 ? 700 : 500 }}>{l[lang]}</span>
          ))}
        </div>
        <div style={{ flex: 1, maxWidth: 380, display: 'flex', alignItems: 'center', gap: 8,
                      background: bg, border: `1px solid ${line}`, borderRadius: 10, padding: '8px 14px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke={muted} strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke={muted} strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ ...typeStyle(lang, 'small'), color: muted }}>
            {isAr ? 'ابحث عن أي شيء' : 'Search anything'}
          </span>
        </div>
        <span style={{ ...typeStyle(lang, 'small'), color: text }}>♡</span>
        <span style={{ ...typeStyle(lang, 'small'), color: text }}>{isAr ? 'حسابي' : 'Account'}</span>
        <div style={{ position: 'relative', padding: '6px 12px', borderRadius: 100, background: BARTAL.amber, color: '#fff',
                      ...typeStyle(lang, 'small'), color: '#fff', fontWeight: 700 }}>
          {isAr ? 'السلة · ٢' : 'Cart · 2'}
        </div>
      </div>
      {breadcrumb && (
        <div style={{ padding: '14px 32px 0', ...typeStyle(lang, 'small'), color: muted }}>
          {breadcrumb}
        </div>
      )}
      <div style={{ padding: '20px 32px 40px' }}>{children}</div>
    </div>
  );
}

// ════════ WEB SEARCH RESULTS ════════
function WebSearchResults({ lang, dark }) {
  const isAr = lang === 'ar';
  const surface = dark ? '#132744' : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  return (
    <WebShell lang={lang} dark={dark} breadcrumb={isAr ? 'الرئيسية / نتائج البحث' : 'Home / Search results'}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ ...typeStyle(lang, 'h1', dark), marginBottom: 4 }}>
          {isAr ? 'نتائج البحث عن «عطر»' : 'Search results for "perfume"'}
        </div>
        <div style={{ ...typeStyle(lang, 'small'), color: muted }}>
          {isAr ? '٤ نتائج · مرتبة حسب الصلة' : '4 results · sorted by relevance'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>
        {/* Filter rail */}
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 16, height: 'fit-content' }}>
          <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginBottom: 8 }}>
            {isAr ? 'الفئة' : 'Category'}
          </div>
          {[{ ar: 'العطور', en: 'Fragrance', n: 4, on: true }, { ar: 'البخور', en: 'Bakhoor', n: 1 },
            { ar: 'الإلكترونيات', en: 'Electronics', n: 0 }].map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0',
                                  ...typeStyle(lang, 'small'), color: c.on ? BARTAL.amber : text,
                                  fontWeight: c.on ? 700 : 500 }}>
              <span>{c[lang]}</span><span>{c.n}</span>
            </div>
          ))}

          <div style={{ height: 1, background: line, margin: '14px 0' }}/>
          <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginBottom: 8 }}>
            {isAr ? 'السعر' : 'Price'}
          </div>
          <div style={{ height: 4, background: line, borderRadius: 2, position: 'relative', margin: '14px 0' }}>
            <div style={{ position: 'absolute', left: '5%', right: '40%', height: 4, background: BARTAL.amber, borderRadius: 2 }}/>
            <div style={{ position: 'absolute', left: '5%', top: -6, width: 16, height: 16, borderRadius: 9, background: '#fff', border: `2px solid ${BARTAL.amber}` }}/>
            <div style={{ position: 'absolute', left: '60%', top: -6, width: 16, height: 16, borderRadius: 9, background: '#fff', border: `2px solid ${BARTAL.amber}` }}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', ...typeStyle(lang, 'small'), color: muted }}>
            <PriceTag amount={0} lang={lang} size={11}/><PriceTag amount={50000} lang={lang} size={11}/>
          </div>

          <div style={{ height: 1, background: line, margin: '14px 0' }}/>
          <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginBottom: 8 }}>
            {isAr ? 'العلامة' : 'Brand'}
          </div>
          {['Ajmal', 'Al Haramain', 'Nabeel'].map((b, i) => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0' }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${i < 2 ? BARTAL.amber : line}`,
                            background: i < 2 ? BARTAL.amber : 'transparent' }}/>
              <span style={{ ...typeStyle(lang, 'small'), color: text }}>{b}</span>
            </div>
          ))}
        </div>

        {/* Results grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {CATALOG.filter(p => p.cat === 'fragrance').slice(0, 3).concat(CATALOG[0]).map(p => (
            <div key={p.id} style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ height: 160 }}><ProductPlaceholder label={p.name_en} hue={p.hue}/></div>
              <div style={{ padding: 12 }}>
                <div style={{ ...typeStyle(lang, 'micro'), color: muted }}>{p.brand}</div>
                <div style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: 600, marginTop: 4 }}>
                  {isAr ? p.name_ar : p.name_en}
                </div>
                <div style={{ marginTop: 8 }}><PriceTag amount={p.price} lang={lang} size={14} color={BARTAL.amber}/></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WebShell>
  );
}

// ════════ WEB WISHLIST ════════
function WebWishlist({ lang, dark }) {
  const isAr = lang === 'ar';
  const surface = dark ? '#132744' : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  return (
    <WebShell lang={lang} dark={dark} breadcrumb={isAr ? 'الرئيسية / حسابي / المفضلة' : 'Home / Account / Wishlist'}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
        <div>
          <div style={{ ...typeStyle(lang, 'h1', dark), marginBottom: 4 }}>{isAr ? 'المفضلة' : 'My wishlist'}</div>
          <div style={{ ...typeStyle(lang, 'small'), color: muted }}>{isAr ? '٥ منتجات محفوظة' : '5 saved items'}</div>
        </div>
        <span style={{ ...typeStyle(lang, 'small'), color: BARTAL.amber, fontWeight: 700 }}>
          {isAr ? 'إضافة الكل إلى السلة' : 'Add all to cart →'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {CATALOG.slice(0, 4).map((p, i) => (
          <div key={p.id} style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 8, [isAr ? 'left' : 'right']: 8, zIndex: 2,
                          width: 32, height: 32, borderRadius: '50%', background: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: BARTAL.amber, fontSize: 16 }}>♥</div>
            <div style={{ height: 160 }}><ProductPlaceholder label={p.name_en} hue={p.hue}/></div>
            <div style={{ padding: 12 }}>
              <div style={{ ...typeStyle(lang, 'micro'), color: muted }}>{p.brand}</div>
              <div style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: 600, marginTop: 4,
                            display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {isAr ? p.name_ar : p.name_en}
              </div>
              <div style={{ marginTop: 6 }}><PriceTag amount={p.price} lang={lang} size={14} color={BARTAL.amber}/></div>
              {i === 1 && (
                <div style={{ marginTop: 6, padding: '2px 8px', borderRadius: 100, display: 'inline-block',
                              background: BARTAL.danger + '15', color: BARTAL.danger,
                              ...typeStyle(lang, 'micro'), color: BARTAL.danger, fontWeight: 700,
                              textTransform: 'none', letterSpacing: 0 }}>
                  {isAr ? 'انخفض السعر' : 'Price dropped'}
                </div>
              )}
              <button style={{
                width: '100%', marginTop: 10, background: BARTAL.navy, color: '#fff', border: 'none',
                borderRadius: 8, padding: '8px', ...typeStyle(lang, 'small'), color: '#fff', fontWeight: 700,
              }}>{isAr ? 'أضف إلى السلة' : 'Add to cart'}</button>
            </div>
          </div>
        ))}
      </div>
    </WebShell>
  );
}

// ════════ WEB ORDER HISTORY ════════
function WebOrderHistory({ lang, dark }) {
  const isAr = lang === 'ar';
  const surface = dark ? '#132744' : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const orders = [
    { num: 'BRT-2026-00842', date: '19 Apr 2026', status: 'review', total: 228000, items: 2 },
    { num: 'BRT-2026-00829', date: '17 Apr 2026', status: 'shipped', total: 42000, items: 1 },
    { num: 'BRT-2026-00811', date: '12 Apr 2026', status: 'delivered', total: 95000, items: 1 },
    { num: 'BRT-2026-00794', date: '5 Apr 2026', status: 'delivered', total: 156000, items: 3 },
    { num: 'BRT-2026-00760', date: '28 Mar 2026', status: 'cancelled', total: 28500, items: 1 },
  ];

  const chip = (s) => {
    const m = {
      review: { ar: 'قيد المراجعة', en: 'Under review', bg: '#FEF3E2', fg: BARTAL.amber },
      shipped: { ar: 'في الطريق', en: 'On the way', bg: '#E3ECF7', fg: BARTAL.navy },
      delivered: { ar: 'تم التسليم', en: 'Delivered', bg: '#E8F5E9', fg: BARTAL.success },
      cancelled: { ar: 'ملغي', en: 'Cancelled', bg: '#FDECEA', fg: BARTAL.danger },
    }[s];
    return <span style={{ background: m.bg, color: m.fg, padding: '4px 10px', borderRadius: 100,
                          ...typeStyle(lang, 'micro'), color: m.fg, fontWeight: 700, textTransform: 'none', letterSpacing: 0 }}>● {m[lang]}</span>;
  };

  return (
    <WebShell lang={lang} dark={dark} breadcrumb={isAr ? 'الرئيسية / حسابي / الطلبات' : 'Home / Account / Orders'}>
      <div style={{ ...typeStyle(lang, 'h1', dark), marginBottom: 16 }}>
        {isAr ? 'سجل الطلبات' : 'Order history'}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[{ ar: 'الكل', en: 'All', on: true }, { ar: 'قيد المعالجة', en: 'Processing' },
          { ar: 'في الطريق', en: 'Shipping' }, { ar: 'مكتملة', en: 'Completed' }].map((f, i) => (
          <div key={i} style={{
            padding: '8px 14px', borderRadius: 100,
            background: f.on ? BARTAL.navy : 'transparent',
            border: f.on ? 'none' : `1px solid ${line}`,
            color: f.on ? '#fff' : text, ...typeStyle(lang, 'small'),
            color: f.on ? '#fff' : text, fontWeight: 600,
          }}>{f[lang]}</div>
        ))}
      </div>

      <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr 0.5fr',
                      padding: '12px 16px', background: dark ? BARTAL.d_raised : '#F7F3EC',
                      borderBottom: `1px solid ${line}`,
                      ...typeStyle(lang, 'micro'), color: muted }}>
          <div>{isAr ? 'رقم الطلب' : 'Order #'}</div>
          <div>{isAr ? 'التاريخ' : 'Date'}</div>
          <div>{isAr ? 'العناصر' : 'Items'}</div>
          <div>{isAr ? 'الإجمالي' : 'Total'}</div>
          <div>{isAr ? 'الحالة' : 'Status'}</div>
          <div></div>
        </div>
        {orders.map((o, i) => (
          <div key={o.num} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr 0.5fr',
                                    padding: '14px 16px', alignItems: 'center',
                                    borderBottom: i < orders.length - 1 ? `1px solid ${line}` : 'none' }}>
            <div style={{ ...typeStyle(lang, 'mono'), color: text, fontWeight: 700 }}>{o.num}</div>
            <div style={{ ...typeStyle(lang, 'small'), color: muted }}>{o.date}</div>
            <div style={{ ...typeStyle(lang, 'small'), color: text }}>{o.items}</div>
            <div><PriceTag amount={o.total} lang={lang} size={14}/></div>
            <div>{chip(o.status)}</div>
            <div style={{ ...typeStyle(lang, 'small'), color: BARTAL.amber, fontWeight: 700, textAlign: isAr ? 'left' : 'right' }}>
              {isAr ? 'تفاصيل' : 'Details'} →
            </div>
          </div>
        ))}
      </div>
    </WebShell>
  );
}

// ════════ WEB ORDER DETAIL ════════
function WebOrderDetail({ lang, dark }) {
  const isAr = lang === 'ar';
  const surface = dark ? '#132744' : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  return (
    <WebShell lang={lang} dark={dark} breadcrumb={isAr ? 'الرئيسية / حسابي / الطلبات / BRT-2026-00842' : 'Home / Account / Orders / BRT-2026-00842'}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ ...typeStyle(lang, 'h1', dark), marginBottom: 4 }}>
          {isAr ? 'الطلب' : 'Order'} <span style={{ ...typeStyle(lang, 'mono'), fontSize: 22 }}>BRT-2026-00842</span>
        </div>
        <div style={{ ...typeStyle(lang, 'small'), color: muted }}>
          {isAr ? 'تم الإنشاء ١٩ أبريل ٢٠٢٦ · ٢:١٤ م' : 'Placed Apr 19, 2026 · 2:14 PM'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <div>
          {/* Status timeline */}
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 18, marginBottom: 16 }}>
            <div style={{ ...typeStyle(lang, 'h3', dark), marginBottom: 16 }}>
              {isAr ? 'حالة الطلب' : 'Order status'}
            </div>
            {[
              { ar: 'تم الطلب', en: 'Placed', t: '2:14 PM', done: true },
              { ar: 'تم رفع الإيصال', en: 'Receipt uploaded', t: '2:32 PM', done: true },
              { ar: 'تم التحقق من الدفع', en: 'Payment verified', t: '4:51 PM', done: true, current: true },
              { ar: 'في التحضير', en: 'Preparing', t: '—', done: false },
              { ar: 'في الطريق', en: 'Shipping', t: '—', done: false },
              { ar: 'تم التسليم', en: 'Delivered', t: '—', done: false },
            ].map((s, i, arr) => (
              <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: i < arr.length - 1 ? 14 : 0, position: 'relative' }}>
                {i < arr.length - 1 && (
                  <div style={{ position: 'absolute', insetInlineStart: 9, top: 22, bottom: -2, width: 2,
                                background: s.done ? BARTAL.success : line }}/>
                )}
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: s.current ? BARTAL.amber : (s.done ? BARTAL.success : line),
                  border: s.current ? `3px solid ${BARTAL.amberTint}` : 'none',
                  flexShrink: 0,
                }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: s.current ? 700 : 500 }}>
                    {s[lang]}
                  </div>
                  <div style={{ ...typeStyle(lang, 'micro'), color: muted, textTransform: 'none', letterSpacing: 0, marginTop: 2 }}>
                    {s.t}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Items */}
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 18, marginBottom: 16 }}>
            <div style={{ ...typeStyle(lang, 'h3', dark), marginBottom: 14 }}>
              {isAr ? 'العناصر (٢)' : 'Items (2)'}
            </div>
            {CATALOG.slice(0, 2).map((p, i) => (
              <div key={p.id} style={{ display: 'flex', gap: 14, paddingBottom: 14,
                                       borderBottom: i < 1 ? `1px solid ${line}` : 'none', marginBottom: i < 1 ? 14 : 0 }}>
                <div style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden' }}>
                  <ProductPlaceholder label={p.name_en} hue={p.hue}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...typeStyle(lang, 'micro'), color: muted }}>{p.brand}</div>
                  <div style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: 600 }}>
                    {isAr ? p.name_ar : p.name_en}
                  </div>
                  <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginTop: 4 }}>
                    {isAr ? 'الكمية ١' : 'Qty 1'}
                  </div>
                </div>
                <PriceTag amount={p.price} lang={lang} size={14} color={BARTAL.amber}/>
              </div>
            ))}
          </div>

          {/* Receipt */}
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ ...typeStyle(lang, 'h3', dark) }}>{isAr ? 'إيصال التحويل' : 'Bank receipt'}</div>
              <span style={{ background: BARTAL.success + '20', color: BARTAL.success, padding: '4px 10px',
                             borderRadius: 100, ...typeStyle(lang, 'micro'), color: BARTAL.success, fontWeight: 700,
                             textTransform: 'none', letterSpacing: 0 }}>● {isAr ? 'تم الاعتماد' : 'Approved'}</span>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ width: 100, height: 130, borderRadius: 8, overflow: 'hidden' }}>
                <ProductPlaceholder label="receipt" hue="warm"/>
              </div>
              <div style={{ flex: 1, ...typeStyle(lang, 'small'), color: muted, lineHeight: 1.7 }}>
                <div>{isAr ? 'البنك' : 'Bank'}: <strong style={{ color: text }}>{isAr ? 'بنك فيصل' : 'Faisal Bank'}</strong></div>
                <div>{isAr ? 'المبلغ' : 'Amount'}: <strong style={{ color: text }}>228,000 SDG</strong></div>
                <div>{isAr ? 'المرجع' : 'Reference'}: <strong style={{ color: text, fontFamily: "'JetBrains Mono'" }}>BRT-2026-00842</strong></div>
                <div>{isAr ? 'تاريخ الرفع' : 'Uploaded'}: <strong style={{ color: text }}>{isAr ? '١٩ أبريل · ٢:٣٢ م' : 'Apr 19 · 2:32 PM'}</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Side rail */}
        <div>
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 18, marginBottom: 14 }}>
            <div style={{ ...typeStyle(lang, 'h3', dark), marginBottom: 12 }}>{isAr ? 'الإجمالي' : 'Summary'}</div>
            {[
              { l_ar: 'المجموع الفرعي', l_en: 'Subtotal', v: 227200 },
              { l_ar: 'التوصيل · أمدرمان', l_en: 'Delivery · Omdurman', v: 800 },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0',
                                    ...typeStyle(lang, 'small'), color: muted }}>
                <span>{r[`l_${lang}`]}</span><PriceTag amount={r.v} lang={lang} size={13}/>
              </div>
            ))}
            <div style={{ height: 1, background: line, margin: '10px 0' }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700 }}>{isAr ? 'الإجمالي' : 'Total'}</span>
              <PriceTag amount={228000} lang={lang} size={18} color={BARTAL.amber}/>
            </div>
          </div>

          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 18, marginBottom: 14 }}>
            <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginBottom: 6 }}>
              {isAr ? 'عنوان التوصيل' : 'Shipping address'}
            </div>
            <div style={{ ...typeStyle(lang, 'small'), color: text, lineHeight: 1.6 }}>
              Mohammed Osman Ahmed<br/>
              {isAr ? 'الرياض، بلوك ٣٢' : 'Al-Riyadh, block 32'}<br/>
              {isAr ? 'بجوار مسجد الفتح' : 'Near Al-Fateh mosque'}<br/>
              {isAr ? 'أمدرمان · السودان' : 'Omdurman · Sudan'}<br/>
              <span style={{ ...typeStyle(lang, 'mono'), color: muted }}>+249 912 345 678</span>
            </div>
          </div>

          <button style={{ width: '100%', background: 'transparent', border: `1px solid ${line}`,
                           padding: '12px', borderRadius: 10, ...typeStyle(lang, 'small'),
                           color: text, fontWeight: 700 }}>
            {isAr ? 'إعادة طلب' : 'Reorder'}
          </button>
        </div>
      </div>
    </WebShell>
  );
}

// ════════ WEB RECEIPT UPLOAD ════════
function WebReceiptUpload({ lang, dark }) {
  const isAr = lang === 'ar';
  const surface = dark ? '#132744' : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  return (
    <WebShell lang={lang} dark={dark} breadcrumb={isAr ? 'الرئيسية / حسابي / الطلبات / رفع إيصال' : 'Home / Account / Orders / Upload receipt'}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ ...typeStyle(lang, 'h1', dark), marginBottom: 6 }}>
          {isAr ? 'رفع إيصال التحويل' : 'Upload bank receipt'}
        </div>
        <div style={{ ...typeStyle(lang, 'small'), color: muted, marginBottom: 22 }}>
          {isAr ? 'الطلب BRT-2026-00842 · المبلغ ٢٢٨,٠٠٠ ج.س' : 'Order BRT-2026-00842 · 228,000 SDG'}
        </div>

        <div style={{ background: BARTAL.amberTint, border: `1.5px dashed ${BARTAL.amber}`,
                      borderRadius: 16, padding: '46px 30px', textAlign: 'center', marginBottom: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: BARTAL.amber,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <CameraIcon color="#fff" size={28}/>
          </div>
          <div style={{ ...typeStyle(lang, 'h3', dark), marginBottom: 6 }}>
            {isAr ? 'اسحب الإيصال هنا أو اختر ملف' : 'Drop receipt here or browse files'}
          </div>
          <div style={{ ...typeStyle(lang, 'small'), color: muted, marginBottom: 16 }}>
            {isAr ? 'JPG · PNG · PDF حتى ١٠ ميجا' : 'JPG · PNG · PDF up to 10MB'}
          </div>
          <button style={{ background: BARTAL.navy, color: '#fff', border: 'none', borderRadius: 10,
                           padding: '10px 22px', ...typeStyle(lang, 'small'), color: '#fff', fontWeight: 700 }}>
            {isAr ? 'اختيار ملف' : 'Choose file'}
          </button>
        </div>

        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 18 }}>
          <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginBottom: 10 }}>
            {isAr ? 'تأكد من ظهور هذه التفاصيل بوضوح' : 'Make sure these details are clearly visible'}
          </div>
          {[{ ar: 'اسم البنك المُحول منه', en: 'Sending bank name' },
            { ar: 'المبلغ ٢٢٨,٠٠٠ ج.س', en: 'Amount 228,000 SDG' },
            { ar: 'المرجع BRT-2026-00842', en: 'Reference BRT-2026-00842' },
            { ar: 'التاريخ والوقت', en: 'Date and time' }].map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: BARTAL.success,
                            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckIcon color="#fff" size={11}/>
              </div>
              <span style={{ ...typeStyle(lang, 'small'), color: text }}>{c[lang]}</span>
            </div>
          ))}
        </div>
      </div>
    </WebShell>
  );
}

// ════════ WEB ToS / FAQ ════════
function WebToS({ lang, dark }) {
  const isAr = lang === 'ar';
  const surface = dark ? '#132744' : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const sections = [
    { t_ar: '١. قبول الشروط', t_en: '1. Acceptance of terms' },
    { t_ar: '٢. الحساب والتسجيل', t_en: '2. Account & registration' },
    { t_ar: '٣. الطلبات والدفع', t_en: '3. Orders & payment' },
    { t_ar: '٤. التوصيل والشحن', t_en: '4. Shipping & delivery' },
    { t_ar: '٥. الإرجاع والاسترداد', t_en: '5. Returns & refunds' },
    { t_ar: '٦. الاستخدام المسموح', t_en: '6. Acceptable use' },
    { t_ar: '٧. الملكية الفكرية', t_en: '7. Intellectual property' },
    { t_ar: '٨. حدود المسؤولية', t_en: '8. Limitation of liability' },
    { t_ar: '٩. تعديل الشروط', t_en: '9. Changes to terms' },
    { t_ar: '١٠. القانون الحاكم', t_en: '10. Governing law (Sudan)' },
  ];

  return (
    <WebShell lang={lang} dark={dark} breadcrumb={isAr ? 'الرئيسية / الشروط' : 'Home / Terms of service'}>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 30, maxWidth: 1100 }}>
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 14, height: 'fit-content', position: 'sticky', top: 20 }}>
          <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginBottom: 8 }}>
            {isAr ? 'الفهرس' : 'On this page'}
          </div>
          {sections.map((s, i) => (
            <div key={i} style={{ padding: '6px 0', ...typeStyle(lang, 'small'),
                                  color: i === 2 ? BARTAL.amber : text, fontWeight: i === 2 ? 700 : 500 }}>
              {s[`t_${lang}`]}
            </div>
          ))}
        </div>

        <div>
          <div style={{ ...typeStyle(lang, 'h1', dark), marginBottom: 6 }}>
            {isAr ? 'الشروط والأحكام' : 'Terms of service'}
          </div>
          <div style={{ ...typeStyle(lang, 'small'), color: muted, marginBottom: 24 }}>
            {isAr ? 'آخر تحديث: ١ أبريل ٢٠٢٦' : 'Last updated: April 1, 2026'}
          </div>

          {sections.slice(0, 4).map((s, i) => (
            <div key={i} style={{ marginBottom: 28 }}>
              <div style={{ ...typeStyle(lang, 'h2', dark), marginBottom: 10 }}>{s[`t_${lang}`]}</div>
              <div style={{ ...typeStyle(lang, 'body', dark), color: muted, lineHeight: 1.8 }}>
                {isAr
                  ? 'باستخدامك لمنصة برتال، فإنك توافق على هذه الشروط. تحتفظ شركة برتال بالحق في تعديل هذه الشروط في أي وقت. يُلزم العملاء بمراجعة الشروط بشكل دوري للاطلاع على أي تحديثات. التسجيل يتطلب رقم هاتف صالح في السودان والامتثال للقوانين المحلية.'
                  : 'By using the Bartal platform, you agree to these terms. Bartal reserves the right to modify these terms at any time. Customers are responsible for reviewing the terms periodically for any updates. Registration requires a valid Sudan phone number and compliance with local laws.'}
              </div>
            </div>
          ))}
          <div style={{ ...typeStyle(lang, 'small'), color: muted, fontStyle: 'italic' }}>
            {isAr ? '… يتبع' : '… continued'}
          </div>
        </div>
      </div>
    </WebShell>
  );
}

function WebFaq({ lang, dark }) {
  const isAr = lang === 'ar';
  const surface = dark ? '#132744' : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const cats = [
    { ar: 'الطلبات والتوصيل', en: 'Orders & delivery', n: 8 },
    { ar: 'الدفع والإيصالات', en: 'Payment & receipts', n: 6 },
    { ar: 'الإرجاع', en: 'Returns', n: 4 },
    { ar: 'الحساب', en: 'Account', n: 5 },
  ];

  const faqs = [
    { q_ar: 'كيف أرفع إيصال التحويل البنكي؟', q_en: 'How do I upload a bank transfer receipt?', open: true,
      a_ar: 'بعد إتمام التحويل، افتح الطلب من «طلباتي» واضغط على زر «رفع الإيصال». يقبل النظام صور JPG و PNG و PDF حتى ١٠ ميجا. يتم التحقق خلال ٢٤ ساعة كحد أقصى.',
      a_en: 'After completing your transfer, open the order from "My orders" and click "Upload receipt". JPG, PNG and PDF up to 10MB. Verification takes up to 24 hours.' },
    { q_ar: 'كم تستغرق عملية التحقق من الإيصال؟', q_en: 'How long does receipt verification take?' },
    { q_ar: 'ما هي المدن المشمولة بالتوصيل؟', q_en: 'Which cities are covered by delivery?' },
    { q_ar: 'هل يمكنني الدفع عند الاستلام؟', q_en: 'Can I pay cash on delivery?' },
    { q_ar: 'كيف أرجع منتجاً؟', q_en: 'How do I return an item?' },
    { q_ar: 'ما هي رسوم التوصيل؟', q_en: 'What are the delivery fees?' },
  ];

  return (
    <WebShell lang={lang} dark={dark} breadcrumb={isAr ? 'الرئيسية / الأسئلة الشائعة' : 'Home / FAQ'}>
      <div style={{ ...typeStyle(lang, 'h1', dark), marginBottom: 6 }}>
        {isAr ? 'الأسئلة الشائعة' : 'Frequently asked questions'}
      </div>
      <div style={{ ...typeStyle(lang, 'small'), color: muted, marginBottom: 22 }}>
        {isAr ? 'إجابات سريعة على أسئلة عملاء برتال الأكثر شيوعاً.' : 'Quick answers to the questions Bartal customers ask most.'}
      </div>

      {/* search */}
      <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12,
                    padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, maxWidth: 600 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke={muted} strokeWidth="2"/>
          <path d="M21 21l-4.35-4.35" stroke={muted} strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span style={{ ...typeStyle(lang, 'body', dark), color: muted }}>
          {isAr ? 'ابحث عن سؤال…' : 'Search for a question…'}
        </span>
      </div>

      {/* category cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22, maxWidth: 800 }}>
        {cats.map((c, i) => (
          <div key={i} style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 14 }}>
            <div style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: 700, marginBottom: 4 }}>
              {c[lang]}
            </div>
            <div style={{ ...typeStyle(lang, 'micro'), color: muted, textTransform: 'none', letterSpacing: 0 }}>
              {isAr ? `${c.n} مقالات` : `${c.n} articles`}
            </div>
          </div>
        ))}
      </div>

      {/* questions */}
      <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'hidden', maxWidth: 800 }}>
        {faqs.map((f, i) => (
          <div key={i} style={{ padding: '16px 18px',
                                borderBottom: i < faqs.length - 1 ? `1px solid ${line}` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ ...typeStyle(lang, 'body', dark), fontWeight: 600, flex: 1 }}>{f[`q_${lang}`]}</div>
              <span style={{ color: muted, fontSize: 18, flexShrink: 0 }}>{f.open ? '−' : '+'}</span>
            </div>
            {f.open && f[`a_${lang}`] && (
              <div style={{ ...typeStyle(lang, 'small'), color: muted, marginTop: 10, lineHeight: 1.7 }}>
                {f[`a_${lang}`]}
              </div>
            )}
          </div>
        ))}
      </div>
    </WebShell>
  );
}

Object.assign(window, {
  WebSearchResults, WebWishlist, WebOrderHistory, WebOrderDetail,
  WebReceiptUpload, WebToS, WebFaq,
});
