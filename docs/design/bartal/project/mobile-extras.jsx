// mobile-extras.jsx — Missing mobile screens:
// SearchResults, FiltersSheet, Wishlist, Notifications,
// ReceiptRejected, EditProfile, ChangePassword, HelpFAQ

// ════════ SEARCH RESULTS ════════
function SearchResultsScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;
  const [showFilters, setShowFilters] = React.useState(false);

  const results = CATALOG.filter(p => p.cat === 'fragrance' || p.id === 'p1');

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', position: 'relative' }}>
      {/* search bar header */}
      <div style={{
        padding: '14px 16px 10px', display: 'flex', alignItems: 'center', gap: 10,
        position: 'sticky', top: 0, background: dark ? BARTAL.d_bg : BARTAL.sand, zIndex: 2,
      }}>
        <div onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 10, background: surface,
          border: `1px solid ${line}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><BackIcon flipped={isAr} color={dark ? BARTAL.d_text : BARTAL.navy}/></div>
        <div style={{
          flex: 1, height: 40, background: surface, border: `1px solid ${line}`,
          borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke={muted} strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke={muted} strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ ...typeStyle(lang, 'body', dark), fontWeight: 600 }}>
            {isAr ? 'عطر' : 'perfume'}
          </span>
          <div style={{ flex: 1 }}/>
          <span style={{ ...typeStyle(lang, 'small'), color: muted, fontSize: 16 }}>×</span>
        </div>
      </div>

      {/* results count + sort/filter row */}
      <div style={{ padding: '6px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ ...typeStyle(lang, 'small'), color: muted }}>
          {isAr ? `${results.length} نتيجة` : `${results.length} results`}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            padding: '6px 12px', borderRadius: 100, background: surface, border: `1px solid ${line}`,
            ...typeStyle(lang, 'small'), color: text, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {isAr ? 'ترتيب' : 'Sort'} <span style={{ fontSize: 9 }}>▼</span>
          </div>
          <div onClick={() => setShowFilters(true)} style={{
            padding: '6px 12px', borderRadius: 100, background: BARTAL.navy, color: '#fff',
            ...typeStyle(lang, 'small'), color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M6 12h12M10 18h4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {isAr ? 'فلتر · ٢' : 'Filter · 2'}
          </div>
        </div>
      </div>

      {/* active chips */}
      <div style={{ padding: '0 16px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {[{ ar: 'العطور', en: 'Fragrance' }, { ar: '< ٥٠ ألف', en: '< 50k SDG' }].map((c, i) => (
          <div key={i} style={{
            padding: '4px 10px', borderRadius: 100, background: BARTAL.amberTint,
            color: BARTAL.amber, ...typeStyle(lang, 'micro'), color: BARTAL.amber, fontWeight: 700,
            textTransform: 'none', letterSpacing: 0, display: 'flex', gap: 6, alignItems: 'center',
          }}>{c[lang]} <span>×</span></div>
        ))}
      </div>

      {/* grid */}
      <div style={{ padding: '4px 16px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {results.map(p => (
          <div key={p.id} onClick={() => onNav('detail')} style={{
            background: surface, borderRadius: 12, border: `1px solid ${line}`, overflow: 'hidden',
          }}>
            <div style={{ height: 110 }}>
              <ProductPlaceholder label={p.name_en} hue={p.hue}/>
            </div>
            <div style={{ padding: 10 }}>
              <div style={{ ...typeStyle(lang, 'micro'), color: muted }}>{p.brand}</div>
              <div style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: 600, marginTop: 2,
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 36 }}>
                {isAr ? p.name_ar : p.name_en}
              </div>
              <div style={{ marginTop: 6 }}>
                <PriceTag amount={p.price} lang={lang} size={13} color={BARTAL.amber}/>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* filters sheet */}
      {showFilters && (
        <FiltersSheet lang={lang} dark={dark} onClose={() => setShowFilters(false)}/>
      )}
    </div>
  );
}

function FiltersSheet({ lang, dark, onClose }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div style={{
        background: surface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
        padding: '12px 0 18px', maxHeight: '85%', overflow: 'auto',
      }} dir={isAr ? 'rtl' : 'ltr'}>
        <div style={{ width: 40, height: 4, background: line, borderRadius: 2, margin: '0 auto 12px' }}/>
        <div style={{ padding: '0 18px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ ...typeStyle(lang, 'h2', dark) }}>{isAr ? 'الفلاتر' : 'Filters'}</div>
          <div onClick={onClose} style={{ ...typeStyle(lang, 'small'), color: BARTAL.amber, fontWeight: 700 }}>
            {isAr ? 'مسح الكل' : 'Clear all'}
          </div>
        </div>

        {/* Category */}
        <div style={{ padding: '0 18px 14px' }}>
          <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginBottom: 8 }}>
            {isAr ? 'الفئة' : 'Category'}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[{ ar: 'الكل', en: 'All' }, { ar: 'العطور', en: 'Fragrance', on: true },
              { ar: 'الإلكترونيات', en: 'Electronics' }, { ar: 'البخور', en: 'Bakhoor' }].map((c, i) => (
              <div key={i} style={{
                padding: '7px 14px', borderRadius: 100,
                background: c.on ? BARTAL.amber : 'transparent',
                border: c.on ? 'none' : `1px solid ${line}`,
                color: c.on ? '#fff' : text, ...typeStyle(lang, 'small'),
                color: c.on ? '#fff' : text, fontWeight: 600,
              }}>{c[lang]}</div>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div style={{ padding: '12px 18px 14px', borderTop: `1px solid ${line}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ ...typeStyle(lang, 'micro'), color: muted }}>
              {isAr ? 'نطاق السعر' : 'Price range'}
            </div>
            <div style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: 600 }}>
              <PriceTag amount={0} lang={lang} size={11}/> – <PriceTag amount={50000} lang={lang} size={11}/>
            </div>
          </div>
          <div style={{ height: 4, background: line, borderRadius: 2, position: 'relative' }}>
            <div style={{ position: 'absolute', left: '5%', right: '40%', height: 4, background: BARTAL.amber, borderRadius: 2 }}/>
            <div style={{ position: 'absolute', left: '5%', top: -7, width: 18, height: 18, borderRadius: 9, background: '#fff', border: `2px solid ${BARTAL.amber}` }}/>
            <div style={{ position: 'absolute', left: '60%', top: -7, width: 18, height: 18, borderRadius: 9, background: '#fff', border: `2px solid ${BARTAL.amber}` }}/>
          </div>
        </div>

        {/* Brand */}
        <div style={{ padding: '12px 18px 14px', borderTop: `1px solid ${line}` }}>
          <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginBottom: 8 }}>
            {isAr ? 'العلامة التجارية' : 'Brand'}
          </div>
          {['Ajmal', 'Al Haramain', 'Nabeel', 'Anker'].map((b, i) => (
            <div key={b} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0',
              borderBottom: i < 3 ? `1px solid ${line}` : 'none',
            }}>
              <span style={{ ...typeStyle(lang, 'body', dark) }}>{b}</span>
              <div style={{
                width: 22, height: 22, borderRadius: 5,
                border: `2px solid ${i < 2 ? BARTAL.amber : line}`,
                background: i < 2 ? BARTAL.amber : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{i < 2 && <CheckIcon color="#fff" size={12}/>}</div>
            </div>
          ))}
        </div>

        {/* Rating */}
        <div style={{ padding: '12px 18px 18px', borderTop: `1px solid ${line}` }}>
          <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginBottom: 8 }}>
            {isAr ? 'التقييم' : 'Minimum rating'}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[4, 3, 2].map((r, i) => (
              <div key={r} style={{
                flex: 1, padding: '10px', borderRadius: 10,
                background: i === 0 ? BARTAL.amberTint : 'transparent',
                border: `1px solid ${i === 0 ? BARTAL.amber : line}`,
                textAlign: 'center', ...typeStyle(lang, 'small'), color: text, fontWeight: 600,
              }}>{r}+ ★</div>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 18px', display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, background: 'transparent', border: `1px solid ${line}`, color: text,
            borderRadius: 12, padding: '14px', fontWeight: 700, ...typeStyle(lang, 'label', dark), color: text,
          }}>{isAr ? 'إلغاء' : 'Cancel'}</button>
          <button onClick={onClose} style={{
            flex: 2, background: BARTAL.navy, color: '#fff', border: 'none',
            borderRadius: 12, padding: '14px', fontWeight: 700, ...typeStyle(lang, 'label'), color: '#fff',
          }}>{isAr ? 'عرض ٤ نتائج' : 'Show 4 results'}</button>
        </div>
      </div>
    </div>
  );
}

// ════════ WISHLIST ════════
function WishlistScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const items = CATALOG.slice(0, 5);

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 30 }}>
      <ScreenHeader title={isAr ? 'المفضلة' : 'Wishlist'} onBack={onBack} lang={lang} dark={dark}/>
      <div style={{ padding: '0 16px 8px', ...typeStyle(lang, 'small'), color: muted }}>
        {isAr ? `${items.length} منتجات محفوظة` : `${items.length} saved items`}
      </div>
      <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((p, i) => (
          <div key={p.id} onClick={() => onNav('detail')} style={{
            background: surface, borderRadius: 14, border: `1px solid ${line}`,
            padding: 12, display: 'flex', gap: 12, alignItems: 'center', position: 'relative',
          }}>
            <div style={{ width: 76, height: 76, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
              <ProductPlaceholder label={p.name_en} hue={p.hue}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...typeStyle(lang, 'micro'), color: muted }}>{p.brand}</div>
              <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 600, marginTop: 2,
                            display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {isAr ? p.name_ar : p.name_en}
              </div>
              <div style={{ marginTop: 4 }}>
                <PriceTag amount={p.price} lang={lang} size={13} color={BARTAL.amber}/>
              </div>
              {i === 2 && (
                <div style={{ marginTop: 6, padding: '3px 8px', borderRadius: 100,
                              background: BARTAL.danger + '15', color: BARTAL.danger,
                              ...typeStyle(lang, 'micro'), color: BARTAL.danger, fontWeight: 700,
                              textTransform: 'none', letterSpacing: 0, display: 'inline-block' }}>
                  {isAr ? '✦ السعر انخفض' : '✦ Price dropped'}
                </div>
              )}
              {i === 4 && (
                <div style={{ marginTop: 6, padding: '3px 8px', borderRadius: 100,
                              background: muted + '20', color: muted,
                              ...typeStyle(lang, 'micro'), color: muted, fontWeight: 700,
                              textTransform: 'none', letterSpacing: 0, display: 'inline-block' }}>
                  {isAr ? 'نفذت الكمية' : 'Out of stock'}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: BARTAL.amber,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                  <path d="M7 4h-2a2 2 0 00-2 2v14l4-2 4 2 4-2 4 2V6a2 2 0 00-2-2h-2M9 4h6" stroke="#fff" strokeWidth="0" fill="#fff"/>
                  <path d="M5 21l7-3 7 3V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16z" stroke="#fff" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: 'transparent',
                border: `1px solid ${line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill={BARTAL.amber} stroke={BARTAL.amber} strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════ NOTIFICATIONS ════════
function NotificationsScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const notes = [
    { type: 'receipt-approved', unread: true,
      ar: 'تم اعتماد إيصالك ✓', en: 'Your receipt was approved',
      sub_ar: 'طلب BRT-2026-00842 — جاري التحضير', sub_en: 'Order BRT-2026-00842 — preparing for shipment',
      time_ar: 'منذ ١٠ دقائق', time_en: '10 min ago', color: BARTAL.success },
    { type: 'shipped', unread: true,
      ar: 'طلبك في الطريق', en: 'Your order shipped',
      sub_ar: 'سائق برتال يحمل طلبك إلى أمدرمان', sub_en: 'Courier headed to Omdurman now',
      time_ar: 'منذ ٢ ساعة', time_en: '2h ago', color: BARTAL.navy },
    { type: 'price-drop', unread: false,
      ar: 'انخفض سعر منتج في مفضلتك', en: 'Price dropped on a saved item',
      sub_ar: 'هاتف ذكي ١٢٨ جيجا — وفر ٧٥ ألف', sub_en: 'Smartphone 128GB — save 75,000 SDG',
      time_ar: 'أمس', time_en: 'Yesterday', color: BARTAL.amber },
    { type: 'promo', unread: false,
      ar: 'كود خصم رمضان ١٥٪', en: '15% Ramadan discount',
      sub_ar: 'استخدم الكود RAMADAN15 — ينتهي ١ مايو', sub_en: 'Use code RAMADAN15 — expires May 1',
      time_ar: '٢ أيام', time_en: '2 days ago', color: BARTAL.amber },
    { type: 'delivered', unread: false,
      ar: 'تم تسليم الطلب', en: 'Order delivered',
      sub_ar: 'BRT-2026-00811 — يرجى التقييم', sub_en: 'BRT-2026-00811 — please rate',
      time_ar: '١٢ أبريل', time_en: 'Apr 12', color: BARTAL.success },
  ];

  const iconFor = (type) => {
    if (type === 'receipt-approved') return <CheckIcon color="#fff" size={18}/>;
    if (type === 'shipped') return <TruckIcon color="#fff" size={18}/>;
    if (type === 'price-drop') return <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>↓</span>;
    if (type === 'promo') return <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>%</span>;
    return <CheckIcon color="#fff" size={18}/>;
  };

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 30 }}>
      <ScreenHeader title={isAr ? 'الإشعارات' : 'Notifications'} onBack={onBack} lang={lang} dark={dark}/>
      <div style={{ padding: '0 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ ...typeStyle(lang, 'small'), color: muted }}>
          {isAr ? '٢ غير مقروءة' : '2 unread'}
        </div>
        <div style={{ ...typeStyle(lang, 'small'), color: BARTAL.amber, fontWeight: 700 }}>
          {isAr ? 'تحديد الكل كمقروء' : 'Mark all read'}
        </div>
      </div>

      <div style={{ padding: '4px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {notes.map((n, i) => (
          <div key={i} style={{
            background: surface, borderRadius: 12, border: `1px solid ${line}`,
            padding: 12, display: 'flex', gap: 12, alignItems: 'flex-start',
            borderInlineStart: n.unread ? `3px solid ${BARTAL.amber}` : `1px solid ${line}`,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', background: n.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>{iconFor(n.type)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: n.unread ? 700 : 600 }}>
                {n[lang === 'ar' ? 'ar' : 'en']}
              </div>
              <div style={{ ...typeStyle(lang, 'small'), color: muted, marginTop: 2,
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {n[`sub_${lang}`]}
              </div>
              <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginTop: 4 }}>
                {n[`time_${lang}`]}
              </div>
            </div>
            {n.unread && <div style={{ width: 8, height: 8, borderRadius: 4, background: BARTAL.amber, marginTop: 6 }}/>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════ RECEIPT REJECTED ════════
function ReceiptRejectedScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 110 }}>
      <ScreenHeader title="" onBack={onBack} lang={lang} dark={dark}/>

      <div style={{ padding: '0 16px 16px', textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: BARTAL.danger + '15',
          border: `2px solid ${BARTAL.danger}`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
        }}>
          <span style={{ color: BARTAL.danger, fontSize: 38, fontWeight: 800, lineHeight: 1 }}>!</span>
        </div>
        <div style={{ ...typeStyle(lang, 'h1', dark), marginBottom: 8 }}>
          {isAr ? 'تعذر التحقق من الإيصال' : 'Receipt couldn\'t be verified'}
        </div>
        <div style={{ ...typeStyle(lang, 'body', dark), color: muted, maxWidth: 320, margin: '0 auto' }}>
          {isAr ? 'لم نتمكن من قراءة المبلغ أو الرقم المرجعي. يرجى رفع صورة أوضح.'
                : 'We couldn\'t read the amount or reference number. Please upload a clearer photo.'}
        </div>
      </div>

      {/* admin note */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{
          background: BARTAL.danger + '0F', border: `1px solid ${BARTAL.danger}40`,
          borderRadius: 12, padding: 14,
        }}>
          <div style={{ ...typeStyle(lang, 'micro'), color: BARTAL.danger, marginBottom: 6, fontWeight: 700 }}>
            {isAr ? 'ملاحظة من فريق التحقق' : 'Note from verification team'}
          </div>
          <div style={{ ...typeStyle(lang, 'small'), color: text, lineHeight: 1.6 }}>
            {isAr
              ? '«المرجع في الإيصال لا يطابق رقم الطلب BRT-2026-00842. تأكد من ذكر الرقم المرجعي عند التحويل.»'
              : '"The reference on the receipt doesn\'t match order BRT-2026-00842. Please include the reference number when transferring."'}
          </div>
        </div>
      </div>

      {/* original receipt */}
      <Section lang={lang} dark={dark} title={isAr ? 'الإيصال المرفوع' : 'Submitted receipt'}>
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 12, display: 'flex', gap: 12 }}>
          <div style={{ width: 80, height: 100, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
                        position: 'relative', filter: 'grayscale(0.4) brightness(0.85)' }}>
            <ProductPlaceholder label="receipt" hue="warm"/>
            <div style={{ position: 'absolute', inset: 0, background: BARTAL.danger + '40',
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>×</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginBottom: 4 }}>
              {isAr ? 'تم الرفع' : 'Uploaded'}
            </div>
            <div style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: 600 }}>
              {isAr ? 'الأمس · ٤:٢٢ م' : 'Yesterday · 4:22 PM'}
            </div>
            <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginTop: 8, marginBottom: 4 }}>
              {isAr ? 'الحالة' : 'Status'}
            </div>
            <div style={{ ...typeStyle(lang, 'small'), color: BARTAL.danger, fontWeight: 700 }}>
              {isAr ? '● مرفوض' : '● Rejected'}
            </div>
          </div>
        </div>
      </Section>

      {/* sticky CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: surface, borderTop: `1px solid ${line}`,
        padding: '14px 16px 18px', display: 'flex', gap: 10,
      }}>
        <button style={{
          flex: 1, background: 'transparent', color: text, border: `1px solid ${line}`,
          borderRadius: 12, padding: '14px', fontWeight: 700, ...typeStyle(lang, 'label', dark), color: text,
        }}>{isAr ? 'تواصل' : 'Contact'}</button>
        <button onClick={() => onNav && onNav('upload')} style={{
          flex: 2, background: BARTAL.amber, color: '#fff', border: 'none',
          borderRadius: 12, padding: '14px', fontWeight: 700, ...typeStyle(lang, 'label'), color: '#fff',
        }}>{isAr ? 'إعادة الرفع' : 'Re-upload receipt'}</button>
      </div>
    </div>
  );
}

// ════════ EDIT PROFILE ════════
function EditProfileScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const Field = ({ label, value, hint }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginBottom: 6, textTransform: 'none', letterSpacing: 0 }}>
        {label}
      </div>
      <div style={{
        background: surface, border: `1px solid ${line}`, borderRadius: 12,
        padding: '14px 14px', ...typeStyle(lang, 'body', dark), fontWeight: 500,
      }}>{value}</div>
      {hint && <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginTop: 4, textTransform: 'none', letterSpacing: 0 }}>{hint}</div>}
    </div>
  );

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 110 }}>
      <ScreenHeader title={isAr ? 'المعلومات الشخصية' : 'Personal info'} onBack={onBack} lang={lang} dark={dark}/>

      {/* avatar */}
      <div style={{ padding: '8px 16px 18px', textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{
            width: 86, height: 86, borderRadius: '50%', background: BARTAL.amber,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 32, fontWeight: 800, fontFamily: "'Poppins'",
          }}>MO</div>
          <div style={{
            position: 'absolute', bottom: 0, [isAr ? 'left' : 'right']: 0,
            width: 30, height: 30, borderRadius: '50%', background: BARTAL.navy,
            border: `3px solid ${bg}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CameraIcon color="#fff" size={14}/>
          </div>
        </div>
        <div style={{ ...typeStyle(lang, 'small'), color: BARTAL.amber, fontWeight: 700, marginTop: 8 }}>
          {isAr ? 'تغيير الصورة' : 'Change photo'}
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <Field label={isAr ? 'الاسم الأول' : 'First name'} value="Mohammed"/>
        <Field label={isAr ? 'اسم العائلة' : 'Last name'} value="Osman"/>
        <Field label={isAr ? 'رقم الهاتف' : 'Phone number'}
               value="+249 912 345 678"
               hint={isAr ? 'تم التحقق ✓' : 'Verified ✓'}/>
        <Field label={isAr ? 'البريد الإلكتروني' : 'Email'} value="m.osman@example.sd"/>
        <Field label={isAr ? 'تاريخ الميلاد' : 'Date of birth'} value={isAr ? '١٥ مارس ١٩٩٢' : 'Mar 15, 1992'}/>
        <Field label={isAr ? 'الجنس' : 'Gender'} value={isAr ? 'ذكر' : 'Male'}/>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: surface, borderTop: `1px solid ${line}`,
        padding: '14px 16px 18px',
      }}>
        <button onClick={onBack} style={{
          width: '100%', background: BARTAL.navy, color: '#fff', border: 'none',
          borderRadius: 12, padding: '15px', fontWeight: 700, ...typeStyle(lang, 'label'), color: '#fff',
        }}>{isAr ? 'حفظ التغييرات' : 'Save changes'}</button>
      </div>
    </div>
  );
}

// ════════ CHANGE PASSWORD ════════
function ChangePasswordScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const PwField = ({ label, masked, strength }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginBottom: 6, textTransform: 'none', letterSpacing: 0 }}>
        {label}
      </div>
      <div style={{
        background: surface, border: `1px solid ${line}`, borderRadius: 12,
        padding: '14px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ ...typeStyle(lang, 'body', dark), letterSpacing: 4, fontFamily: "'JetBrains Mono', monospace" }}>{masked}</span>
        <span style={{ color: muted, fontSize: 16 }}>👁</span>
      </div>
      {strength && (
        <div style={{ marginTop: 6 }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i <= 3 ? BARTAL.success : line,
              }}/>
            ))}
          </div>
          <div style={{ ...typeStyle(lang, 'micro'), color: BARTAL.success, fontWeight: 700, textTransform: 'none', letterSpacing: 0 }}>
            {isAr ? 'قوة جيدة' : 'Strong password'}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 110 }}>
      <ScreenHeader title={isAr ? 'تغيير كلمة المرور' : 'Change password'} onBack={onBack} lang={lang} dark={dark}/>
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ ...typeStyle(lang, 'body', dark), color: muted, marginBottom: 16 }}>
          {isAr ? 'يجب أن تكون كلمة المرور ٨ أحرف على الأقل وتحتوي على رقم.'
                : 'Password must be at least 8 characters and contain a number.'}
        </div>
        <PwField label={isAr ? 'كلمة المرور الحالية' : 'Current password'} masked="••••••••"/>
        <PwField label={isAr ? 'كلمة المرور الجديدة' : 'New password'} masked="•••••••••••" strength/>
        <PwField label={isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm new password'} masked="•••••••••••"/>

        <div style={{ marginTop: 8, ...typeStyle(lang, 'small'), color: BARTAL.amber, fontWeight: 700 }}>
          {isAr ? 'نسيت كلمة المرور الحالية؟' : 'Forgot current password?'}
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: surface, borderTop: `1px solid ${line}`,
        padding: '14px 16px 18px',
      }}>
        <button onClick={onBack} style={{
          width: '100%', background: BARTAL.navy, color: '#fff', border: 'none',
          borderRadius: 12, padding: '15px', fontWeight: 700, ...typeStyle(lang, 'label'), color: '#fff',
        }}>{isAr ? 'تحديث كلمة المرور' : 'Update password'}</button>
      </div>
    </div>
  );
}

// ════════ HELP / FAQ ════════
function HelpFaqScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const topics = [
    { ar: 'الطلبات والتوصيل', en: 'Orders & delivery', count: 8 },
    { ar: 'الدفع والإيصالات', en: 'Payment & receipts', count: 6 },
    { ar: 'الإرجاع والاستبدال', en: 'Returns & refunds', count: 4 },
    { ar: 'الحساب والأمان', en: 'Account & security', count: 5 },
  ];

  const faqs = [
    { q_ar: 'كيف أرفع إيصال التحويل البنكي؟',
      q_en: 'How do I upload my bank transfer receipt?',
      open: true,
      a_ar: 'بعد إتمام التحويل البنكي، افتح "طلباتي" → اختر الطلب → اضغط "رفع الإيصال". يقبل التطبيق صور JPG و PNG حتى ١٠ ميجا.',
      a_en: 'After completing the transfer, go to "My orders" → select order → tap "Upload receipt". JPG and PNG up to 10MB.' },
    { q_ar: 'متى يتم اعتماد الإيصال؟', q_en: 'When will my receipt be approved?',
      a_ar: '', a_en: '' },
    { q_ar: 'ما هي رسوم التوصيل؟', q_en: 'What are the delivery fees?',
      a_ar: '', a_en: '' },
    { q_ar: 'هل يمكنني الإرجاع بعد التسليم؟', q_en: 'Can I return items after delivery?',
      a_ar: '', a_en: '' },
  ];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 30 }}>
      <ScreenHeader title={isAr ? 'مركز المساعدة' : 'Help center'} onBack={onBack} lang={lang} dark={dark}/>

      {/* search */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{
          height: 44, background: surface, border: `1px solid ${line}`,
          borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke={muted} strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke={muted} strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ ...typeStyle(lang, 'body', dark), color: muted }}>
            {isAr ? 'ابحث في الأسئلة الشائعة' : 'Search help articles'}
          </span>
        </div>
      </div>

      {/* WhatsApp banner */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{
          background: BARTAL.success, borderRadius: 14, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: BARTAL.success, fontSize: 22,
          }}>✆</div>
          <div style={{ flex: 1 }}>
            <div style={{ ...typeStyle(lang, 'label'), color: '#fff', fontWeight: 700 }}>
              {isAr ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
            </div>
            <div style={{ ...typeStyle(lang, 'small'), color: '#fff', opacity: 0.9 }}>
              {isAr ? 'الرد خلال ١٥ دقيقة · ٨ص-١٠م' : 'Reply within 15 min · 8am-10pm'}
            </div>
          </div>
          <ArrowIcon color="#fff" flipped={isAr}/>
        </div>
      </div>

      {/* topics */}
      <Section lang={lang} dark={dark} title={isAr ? 'تصفح حسب الموضوع' : 'Browse by topic'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {topics.map((tp, i) => (
            <div key={i} style={{
              background: surface, border: `1px solid ${line}`, borderRadius: 12,
              padding: '14px 12px',
            }}>
              <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700, marginBottom: 4 }}>
                {tp[lang]}
              </div>
              <div style={{ ...typeStyle(lang, 'micro'), color: muted, textTransform: 'none', letterSpacing: 0 }}>
                {isAr ? `${tp.count} مقالات` : `${tp.count} articles`}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section lang={lang} dark={dark} title={isAr ? 'الأكثر شيوعاً' : 'Most asked'}>
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, overflow: 'hidden' }}>
          {faqs.map((f, i) => (
            <div key={i} style={{
              padding: '14px',
              borderBottom: i < faqs.length - 1 ? `1px solid ${line}` : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ ...typeStyle(lang, 'body', dark), fontWeight: 600, flex: 1 }}>
                  {f[`q_${lang}`]}
                </div>
                <span style={{ color: muted, fontSize: 16, flexShrink: 0 }}>{f.open ? '−' : '+'}</span>
              </div>
              {f.open && (
                <div style={{ ...typeStyle(lang, 'small'), color: muted, marginTop: 8, lineHeight: 1.6 }}>
                  {f[`a_${lang}`]}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// Expose to global scope
Object.assign(window, {
  SearchResultsScreen, FiltersSheet, WishlistScreen, NotificationsScreen,
  ReceiptRejectedScreen, EditProfileScreen, ChangePasswordScreen, HelpFaqScreen,
});
