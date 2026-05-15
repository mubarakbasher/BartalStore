// secondary-screens.jsx — shared secondary screens used by all 3 variations
// Cart, Checkout, Orders, Receipt upload flow. Styled minimally so the variation
// choice stays the star — secondary screens are "house style" (neutral navy+amber).

function CartScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const items = [CATALOG[0], CATALOG[1]];
  const subtotal = items.reduce((s, p) => s + p.price, 0);
  const fee = 800;

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 140 }}>
      <ScreenHeader title={t('cart', lang)} onBack={onBack} lang={lang} dark={dark}/>
      <div style={{ padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(p => (
          <div key={p.id} style={{
            background: surface, borderRadius: 14, border: `1px solid ${line}`,
            padding: 10, display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <div style={{ width: 72, height: 72, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
              <ProductPlaceholder label={p.name_en} hue={p.hue}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...typeStyle(lang, 'micro'), color: muted }}>{p.brand}</div>
              <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 600, marginTop: 2,
                            display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {isAr ? p.name_ar : p.name_en}
              </div>
              <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <PriceTag amount={p.price} lang={lang} size={14} color={BARTAL.amber}/>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {['−', '1', '+'].map((c, i) => (
                    <div key={i} style={{
                      width: 26, height: 26, borderRadius: 8,
                      background: i === 1 ? 'transparent' : (dark ? BARTAL.d_raised : BARTAL.sand),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      ...typeStyle(lang, 'label', dark), fontWeight: 700,
                    }}>{c}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ padding: '16px', marginTop: 4 }}>
        <div style={{ background: surface, borderRadius: 14, border: `1px solid ${line}`, padding: '14px 16px' }}>
          <SumRow lang={lang} dark={dark} label={t('subtotal', lang)} value={<PriceTag amount={subtotal} lang={lang} size={14}/>}/>
          <SumRow lang={lang} dark={dark} label={`${t('deliveryFee', lang)} · ${t('zoneB', lang)}`}
                  value={<PriceTag amount={fee} lang={lang} size={14}/>}/>
          <div style={{ height: 1, background: line, margin: '10px 0' }}/>
          <SumRow lang={lang} dark={dark} label={<span style={{ fontWeight: 700 }}>{t('total', lang)}</span>}
                  value={<PriceTag amount={subtotal + fee} lang={lang} size={18} color={BARTAL.amber}/>}/>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: surface, borderTop: `1px solid ${line}`,
        padding: '14px 16px 18px',
      }}>
        <button onClick={() => onNav && onNav('checkout')} style={{
          width: '100%', background: BARTAL.navy, color: '#fff', border: 'none',
          borderRadius: 14, padding: '16px', fontWeight: 700,
          ...typeStyle(lang, 'label'), color: '#fff',
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
        }}>
          {t('checkout', lang)} · <PriceTag amount={subtotal + fee} lang={lang} size={14} color="#fff"/>
          <ArrowIcon color="#fff" flipped={isAr}/>
        </button>
      </div>
    </div>
  );
}

function CheckoutScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 110 }}>
      <ScreenHeader title={t('checkout', lang)} onBack={onBack} lang={lang} dark={dark}/>

      {/* stepper */}
      <div style={{ padding: '8px 16px 14px', display: 'flex', gap: 6 }}>
        {[isAr ? 'العنوان' : 'Address', isAr ? 'الدفع' : 'Payment', isAr ? 'تأكيد' : 'Confirm'].map((lbl, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{ height: 4, borderRadius: 2, background: i <= 1 ? BARTAL.amber : line }}/>
            <div style={{ ...typeStyle(lang, 'micro'), color: i <= 1 ? (dark ? BARTAL.d_text : BARTAL.navy) : muted,
                          marginTop: 6, fontWeight: i <= 1 ? 700 : 500, textTransform: 'none', letterSpacing: 0 }}>
              {lbl}
            </div>
          </div>
        ))}
      </div>

      {/* Delivery zone */}
      <Section lang={lang} dark={dark} title={isAr ? 'منطقة التوصيل' : 'Delivery zone'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { k: 'zoneA', fee: 500, d: isAr ? '٠-١ يوم' : '0-1 day' },
            { k: 'zoneB', fee: 800, d: isAr ? '١-٢ يوم' : '1-2 days', on: true },
            { k: 'zoneC', fee: 800, d: isAr ? '١-٢ يوم' : '1-2 days' },
            { k: 'zoneD', fee: 1000, d: isAr ? '١-٢ يوم' : '1-2 days' },
          ].map(z => (
            <div key={z.k} style={{
              padding: '12px 14px', borderRadius: 12,
              border: z.on ? `2px solid ${BARTAL.amber}` : `1px solid ${line}`,
              background: z.on ? BARTAL.amberTint : surface,
            }}>
              <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700, marginBottom: 2 }}>{t(z.k, lang)}</div>
              <div style={{ ...typeStyle(lang, 'small'), color: muted }}>
                <PriceTag amount={z.fee} lang={lang} size={12}/> · {z.d}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Address with landmark — required */}
      <Section lang={lang} dark={dark} title={isAr ? 'العنوان' : 'Address'}>
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 14 }}>
          <FieldRow lang={lang} dark={dark} label={isAr ? 'الاسم الكامل' : 'Full name'} value="Mohammed Osman Ahmed"/>
          <FieldRow lang={lang} dark={dark} label={isAr ? 'الهاتف' : 'Phone'} value="+249 912 345 678"/>
          <FieldRow lang={lang} dark={dark} label={isAr ? 'الحي' : 'District'} value={isAr ? 'الرياض، بلوك ٣٢' : 'Al-Riyadh, block 32'}/>
          <FieldRow lang={lang} dark={dark}
                    label={<span>{t('landmark', lang)} <span style={{ color: BARTAL.danger }}>*</span></span>}
                    value={t('landmarkHint', lang)}
                    required/>
          <FieldRow lang={lang} dark={dark} label={isAr ? 'ملاحظات' : 'Notes'} value={isAr ? 'اتصل عند الوصول' : 'Call on arrival'} last/>
        </div>
      </Section>

      {/* Payment method */}
      <Section lang={lang} dark={dark} title={isAr ? 'طريقة الدفع' : 'Payment method'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PayOption lang={lang} dark={dark} on={true} icon={<BankIcon color={BARTAL.navy}/>}
                     title={t('bankTransfer', lang)}
                     sub={isAr ? 'بنك فيصل · رفع إيصال بعد التحويل' : 'Faisal Bank · Upload receipt after transfer'}/>
          <PayOption lang={lang} dark={dark} on={false} icon={<CashIcon color={BARTAL.navy}/>}
                     title={t('cod', lang)}
                     sub={isAr ? 'ادفع عند التسليم' : 'Pay when delivered'}/>
        </div>
      </Section>

      {/* Sticky action */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: surface, borderTop: `1px solid ${line}`,
        padding: '14px 16px 18px',
      }}>
        <button onClick={() => onNav && onNav('confirm')} style={{
          width: '100%', background: BARTAL.navy, color: '#fff', border: 'none',
          borderRadius: 14, padding: '16px', ...typeStyle(lang, 'label'), color: '#fff', fontWeight: 700,
        }}>
          {isAr ? 'تأكيد الطلب' : 'Place order'}
        </button>
      </div>
    </div>
  );
}

function ConfirmScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 110 }}>
      <ScreenHeader title="" onBack={onBack} lang={lang} dark={dark}/>

      {/* Motif hero */}
      <div style={{ padding: '0 16px 16px', textAlign: 'center' }}>
        <div style={{
          position: 'relative', padding: '24px 16px 20px',
          background: dark ? BARTAL.d_raised : '#fff',
          borderRadius: 20, border: `1px solid ${line}`, overflow: 'hidden',
        }}>
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none' }}>
            <defs>
              <pattern id="cfm" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <g stroke={BARTAL.navy} strokeWidth="1" fill="none">
                  <path d="M30 6 L36 22 L50 16 L44 30 L58 36 L44 42 L50 56 L36 50 L30 66 L24 50 L10 56 L16 42 L2 36 L16 30 L10 16 L24 22 Z"/>
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cfm)"/>
          </svg>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: BARTAL.success,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
            }}>
              <CheckIcon color="#fff" size={32}/>
            </div>
            <div style={{ ...typeStyle(lang, 'h1', dark), marginBottom: 4 }}>
              {isAr ? 'تم إنشاء طلبك' : 'Order placed'}
            </div>
            <div style={{ ...typeStyle(lang, 'small'), color: muted, marginBottom: 10 }}>
              {isAr ? 'رقم الطلب' : 'Order number'} · <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontWeight: 700 }}>BRT-2026-00842</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bank transfer instructions — key Sudan-specific flow */}
      <Section lang={lang} dark={dark} title={isAr ? 'تعليمات التحويل البنكي' : 'Bank transfer instructions'}>
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 14 }}>
          <InfoRow lang={lang} dark={dark} label={isAr ? 'البنك' : 'Bank'} value={isAr ? 'بنك فيصل الإسلامي' : 'Faisal Islamic Bank'} mono={false}/>
          <InfoRow lang={lang} dark={dark} label={isAr ? 'اسم الحساب' : 'Account name'} value={isAr ? 'برتال للتجارة الإلكترونية' : 'Bartal E-Commerce'} mono={false}/>
          <InfoRow lang={lang} dark={dark} label={isAr ? 'رقم الحساب' : 'Account #'} value="0012-345-678-9000" copy/>
          <InfoRow lang={lang} dark={dark} label={isAr ? 'المبلغ' : 'Amount'}
                   value={<PriceTag amount={228000} lang={lang} size={15} color={BARTAL.amber}/>} copy/>
          <InfoRow lang={lang} dark={dark} label={isAr ? 'المرجع' : 'Reference'} value="BRT-2026-00842" copy last/>
        </div>
      </Section>

      {/* Upload receipt CTA */}
      <div style={{ padding: '0 16px' }}>
        <div style={{
          background: BARTAL.amberTint,
          border: `1.5px dashed ${BARTAL.amber}`, borderRadius: 16,
          padding: '20px 16px', textAlign: 'center',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%', background: BARTAL.amber,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
          }}>
            <CameraIcon color="#fff" size={26}/>
          </div>
          <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700, marginBottom: 4 }}>
            {t('uploadReceipt', lang)}
          </div>
          <div style={{ ...typeStyle(lang, 'small'), color: BARTAL.textMute, marginBottom: 12, maxWidth: 260, margin: '0 auto 12px' }}>
            {isAr ? 'سيتم التحقق من الإيصال خلال ٢٤ ساعة' : 'Your receipt will be verified within 24 hours'}
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button style={{
              background: BARTAL.navy, color: '#fff', border: 'none',
              borderRadius: 10, padding: '10px 16px', fontWeight: 700,
              ...typeStyle(lang, 'small'), color: '#fff',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <CameraIcon color="#fff" size={14}/>
              {isAr ? 'التقاط صورة' : 'Take photo'}
            </button>
            <button style={{
              background: '#fff', color: BARTAL.navy, border: `1px solid ${BARTAL.navy}`,
              borderRadius: 10, padding: '10px 16px', fontWeight: 700,
              ...typeStyle(lang, 'small'), color: BARTAL.navy,
            }}>
              {isAr ? 'من المعرض' : 'From gallery'}
            </button>
          </div>
        </div>

        <button onClick={() => onNav && onNav('orders')} style={{
          width: '100%', marginTop: 14,
          background: 'transparent', color: BARTAL.amber, border: 'none',
          padding: '12px', ...typeStyle(lang, 'label'), color: BARTAL.amber, fontWeight: 600,
        }}>
          {isAr ? 'عرض الطلب' : 'View order'} →
        </button>
      </div>
    </div>
  );
}

function OrdersScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;

  const orders = [
    { num: 'BRT-2026-00842', status: 'RECEIPT_UPLOADED', total: 228000, items: 2, date: isAr ? 'اليوم' : 'Today', p: CATALOG[0] },
    { num: 'BRT-2026-00829', status: 'SHIPPED', total: 42000, items: 1, date: isAr ? 'أمس' : 'Yesterday', p: CATALOG[1] },
    { num: 'BRT-2026-00811', status: 'DELIVERED', total: 95000, items: 1, date: isAr ? '١٢ أبريل' : 'Apr 12', p: CATALOG[4] },
  ];

  const statusChip = (s) => {
    const map = {
      RECEIPT_UPLOADED: { ar: 'قيد المراجعة', en: 'Under review', bg: '#FEF3E2', fg: BARTAL.amber },
      SHIPPED: { ar: 'في الطريق', en: 'On the way', bg: '#E3ECF7', fg: BARTAL.navy },
      DELIVERED: { ar: 'تم التسليم', en: 'Delivered', bg: '#E8F5E9', fg: BARTAL.success },
    };
    const m = map[s];
    return (
      <div style={{
        background: m.bg, color: m.fg, padding: '4px 10px', borderRadius: 100,
        ...typeStyle(lang, 'micro'), color: m.fg, fontWeight: 700, textTransform: 'none', letterSpacing: 0,
      }}>● {m[lang]}</div>
    );
  };

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 20 }}>
      <ScreenHeader title={t('orders', lang)} onBack={onBack} lang={lang} dark={dark}/>

      <div style={{ padding: '6px 16px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {[
          { ar: 'الكل', en: 'All', on: true },
          { ar: 'قيد المعالجة', en: 'Processing' },
          { ar: 'في الطريق', en: 'Shipping' },
          { ar: 'مكتملة', en: 'Completed' },
        ].map((f, i) => (
          <div key={i} style={{
            padding: '7px 14px', borderRadius: 100,
            background: f.on ? BARTAL.navy : 'transparent',
            border: f.on ? 'none' : `1px solid ${line}`,
            color: f.on ? '#fff' : (dark ? BARTAL.d_text : BARTAL.text),
            ...typeStyle(lang, 'small'),
            color: f.on ? '#fff' : (dark ? BARTAL.d_text : BARTAL.text),
            fontWeight: 600, whiteSpace: 'nowrap',
          }}>{f[lang]}</div>
        ))}
      </div>

      <div style={{ padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.map(o => (
          <div key={o.num} onClick={() => onNav && onNav(o.status === 'SHIPPED' ? 'tracking' : 'orderDetail')} style={{
            background: surface, borderRadius: 14, border: `1px solid ${line}`, padding: 14,
            cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <div style={{ ...typeStyle(lang, 'mono'), color: muted, fontWeight: 600 }}>{o.num}</div>
                <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginTop: 2 }}>{o.date}</div>
              </div>
              {statusChip(o.status)}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 54, height: 54, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                <ProductPlaceholder label={o.p.name_en} hue={o.p.hue}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 600 }}>
                  {isAr ? o.p.name_ar : o.p.name_en}
                </div>
                <div style={{ ...typeStyle(lang, 'small'), color: muted, marginTop: 2 }}>
                  {o.items} {isAr ? 'صنف' : 'items'} · <PriceTag amount={o.total} lang={lang} size={12} color={muted} strong={false}/>
                </div>
              </div>
              <ArrowIcon color={muted} flipped={isAr} size={14}/>
            </div>

            {o.status === 'SHIPPED' && (
              <div style={{ marginTop: 10, padding: 10, background: dark ? BARTAL.d_raised : BARTAL.sand,
                            borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <TruckIcon color={BARTAL.navy} size={14}/>
                <span style={{ ...typeStyle(lang, 'small'), color: dark ? BARTAL.d_text : BARTAL.navy }}>
                  {isAr ? 'في طريقه إلى أمدرمان — ١-٢ يوم' : 'On the way to Omdurman — 1-2 days'}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── helpers ────────────────────────────────────────────
function ScreenHeader({ title, onBack, lang, dark }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  return (
    <div style={{
      padding: '16px 16px 10px', display: 'flex', alignItems: 'center', gap: 10,
      position: 'sticky', top: 0, background: dark ? BARTAL.d_bg : BARTAL.sand, zIndex: 2,
    }}>
      <div onClick={onBack} style={{
        width: 36, height: 36, borderRadius: 10, background: surface,
        border: `1px solid ${line}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}>
        <BackIcon flipped={isAr} color={dark ? BARTAL.d_text : BARTAL.navy}/>
      </div>
      <div style={{ ...typeStyle(lang, 'h2', dark), flex: 1 }}>{title}</div>
    </div>
  );
}

function Section({ title, children, lang, dark }) {
  return (
    <div style={{ padding: '8px 16px 16px' }}>
      <div style={{ ...typeStyle(lang, 'micro'), color: dark ? BARTAL.d_textMute : BARTAL.textMute, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function SumRow({ label, value, lang, dark }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
      <span style={{ ...typeStyle(lang, 'body', dark), color: dark ? BARTAL.d_textMute : BARTAL.textMute }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function FieldRow({ label, value, last, required, lang, dark }) {
  const line = dark ? BARTAL.d_line : BARTAL.line;
  return (
    <div style={{ padding: '10px 0', borderBottom: last ? 'none' : `1px solid ${line}` }}>
      <div style={{ ...typeStyle(lang, 'micro'), color: dark ? BARTAL.d_textMute : BARTAL.textMute, marginBottom: 3, textTransform: 'none', letterSpacing: 0 }}>
        {label}
      </div>
      <div style={{ ...typeStyle(lang, 'body', dark), fontWeight: 500,
                    color: required ? BARTAL.amber : (dark ? BARTAL.d_text : BARTAL.text) }}>
        {value}
      </div>
    </div>
  );
}

function PayOption({ on, icon, title, sub, lang, dark }) {
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'center', padding: 14,
      background: on ? BARTAL.amberTint : surface,
      border: on ? `2px solid ${BARTAL.amber}` : `1px solid ${line}`, borderRadius: 14,
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: dark ? BARTAL.d_raised : '#fff',
                    border: `1px solid ${line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700 }}>{title}</div>
        <div style={{ ...typeStyle(lang, 'small'), color: dark ? BARTAL.d_textMute : BARTAL.textMute }}>{sub}</div>
      </div>
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        background: on ? BARTAL.amber : 'transparent',
        border: on ? 'none' : `2px solid ${line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {on && <CheckIcon color="#fff" size={12}/>}
      </div>
    </div>
  );
}

function InfoRow({ label, value, copy, last, mono = true, lang, dark }) {
  const line = dark ? BARTAL.d_line : BARTAL.line;
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '11px 0', borderBottom: last ? 'none' : `1px solid ${line}`,
    }}>
      <span style={{ ...typeStyle(lang, 'small'), color: dark ? BARTAL.d_textMute : BARTAL.textMute }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={mono ? { ...typeStyle(lang, 'mono'), color: dark ? BARTAL.d_text : BARTAL.text, fontWeight: 700 }
                          : { ...typeStyle(lang, 'label', dark), fontWeight: 700 }}>
          {value}
        </span>
        {copy && (
          <div style={{
            width: 26, height: 26, borderRadius: 7, border: `1px solid ${line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CopyIcon color={BARTAL.amber} size={13}/>
          </div>
        )}
      </div>
    </div>
  );
}

function BankIcon({ color = '#000', size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 10L12 4l9 6v2H3v-2zM5 12v8M10 12v8M14 12v8M19 12v8M2 20h20" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>;
}
function CashIcon({ color = '#000', size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth="1.8"/>
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8"/>
    <path d="M5 9v6M19 9v6" stroke={color} strokeWidth="1.8"/>
  </svg>;
}
function CopyIcon({ color = '#000', size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="8" y="8" width="12" height="12" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M16 4H6a2 2 0 00-2 2v10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>;
}

Object.assign(window, {
  CartScreen, CheckoutScreen, ConfirmScreen, OrdersScreen,
  ScreenHeader, Section, SumRow, FieldRow, PayOption, InfoRow,
  BankIcon, CashIcon, CopyIcon,
});
