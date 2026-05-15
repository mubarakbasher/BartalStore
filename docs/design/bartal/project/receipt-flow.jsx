// receipt-flow.jsx — The core Bartal workflow: bank transfer → upload receipt → admin review → tracking.
// Four mobile screens + one admin screen, all AR/EN, light/dark.
// Uses ScreenHeader, Section, InfoRow, BankIcon, CopyIcon from secondary-screens.jsx.

// ═══════════════════════════════════════════════════════════════
// MOBILE: ORDER DETAIL  — expanded order info from Orders list
// ═══════════════════════════════════════════════════════════════
function OrderDetailScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const items = CATALOG.slice(0, 2);
  const subtotal = items.reduce((s, p) => s + p.price, 0);
  const fee = 800;
  const total = subtotal + fee;

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 120 }}>
      <ScreenHeader title={isAr ? 'تفاصيل الطلب' : 'Order details'} onBack={onBack} lang={lang} dark={dark}/>

      {/* Status hero */}
      <div style={{
        margin: '10px 16px 0', padding: 16, borderRadius: 16,
        background: BARTAL.amberTint, border: `1px solid ${BARTAL.amber}40`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div>
            <div style={{ ...typeStyle(lang, 'micro'), color: muted }}>
              {isAr ? 'رقم الطلب' : 'Order ID'}
            </div>
            <div style={{ ...typeStyle(lang, 'mono'), fontSize: 16, fontWeight: 700, color: text, marginTop: 2 }}>
              BRT-2026-00847
            </div>
          </div>
          <div style={{
            padding: '4px 10px', borderRadius: 10,
            background: '#FEF3C7', color: '#B45309',
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
          }}>
            {isAr ? 'بانتظار الإيصال' : 'Awaiting receipt'}
          </div>
        </div>
        <div style={{ fontSize: 13, color: text, lineHeight: 1.55 }}>
          {isAr
            ? 'أكمل طلبك برفع إيصال التحويل البنكي. سيتم التأكيد خلال ٥–١٥ دقيقة.'
            : 'Complete your order by uploading the bank transfer receipt. Confirmation in 5–15 min.'}
        </div>
        <button onClick={() => onNav && onNav('upload')} style={{
          marginTop: 12, width: '100%', background: BARTAL.amber, color: '#fff',
          border: 'none', borderRadius: 10, padding: '12px',
          ...typeStyle(lang, 'label'), color: '#fff', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <CameraIcon color="#fff" size={16}/>
          {isAr ? 'رفع الإيصال' : 'Upload receipt'}
        </button>
      </div>

      {/* Items */}
      <Section title={isAr ? `المنتجات (${items.length})` : `Items (${items.length})`} lang={lang} dark={dark}>
        <div style={{ background: surface, borderRadius: 14, border: `1px solid ${line}`, overflow: 'hidden' }}>
          {items.map((p, i) => (
            <div key={p.id} style={{
              padding: 12, display: 'flex', gap: 12, alignItems: 'center',
              borderTop: i === 0 ? 'none' : `1px solid ${line}`,
            }}>
              <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                <ProductPlaceholder label={p.name_en} hue={p.hue}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...typeStyle(lang, 'micro'), color: muted }}>{p.brand}</div>
                <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 600, marginTop: 1,
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isAr ? p.name_ar : p.name_en}
                </div>
                <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginTop: 3 }}>
                  {isAr ? 'الكمية: ١' : 'Qty: 1'}
                </div>
              </div>
              <PriceTag amount={p.price} lang={lang} size={13} color={text}/>
            </div>
          ))}
        </div>
      </Section>

      {/* Delivery address */}
      <Section title={isAr ? 'التوصيل إلى' : 'Delivery to'} lang={lang} dark={dark}>
        <div style={{ background: surface, borderRadius: 14, border: `1px solid ${line}`, padding: 14 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <PinIcon color={BARTAL.amber} size={18}/>
            <div style={{ flex: 1 }}>
              <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700 }}>
                {isAr ? 'محمد عثمان' : 'Mohammed Osman'}
              </div>
              <div style={{ ...typeStyle(lang, 'small'), color: muted, marginTop: 3, lineHeight: 1.5 }}>
                {isAr
                  ? 'الخرطوم ٢ · مبنى النيل، الطابق ٣، شقة ٧'
                  : 'Khartoum 2 · Nile Building, 3rd floor, apt 7'}
              </div>
              <div style={{ ...typeStyle(lang, 'mono'), color: muted, marginTop: 3, fontSize: 11 }}>
                +249 91 234 5678
              </div>
            </div>
          </div>
          <div style={{
            marginTop: 10, padding: '8px 10px', borderRadius: 8,
            background: dark ? BARTAL.d_raised : BARTAL.sand,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <TruckIcon color={BARTAL.success} size={13}/>
            <span style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: 600 }}>
              {isAr ? 'يصل غداً · ٢١ أبريل' : 'Arrives tomorrow · Apr 21'}
            </span>
          </div>
        </div>
      </Section>

      {/* Payment summary */}
      <Section title={isAr ? 'ملخص الدفع' : 'Payment summary'} lang={lang} dark={dark}>
        <div style={{ background: surface, borderRadius: 14, border: `1px solid ${line}`, padding: '4px 14px' }}>
          <InfoRow lang={lang} dark={dark} mono={false}
                   label={isAr ? 'المجموع الفرعي' : 'Subtotal'}
                   value={<PriceTag amount={subtotal} lang={lang} size={13}/>}/>
          <InfoRow lang={lang} dark={dark} mono={false}
                   label={isAr ? 'التوصيل (الخرطوم ٢)' : 'Delivery (Khartoum 2)'}
                   value={<PriceTag amount={fee} lang={lang} size={13}/>}/>
          <InfoRow lang={lang} dark={dark} mono={false} last
                   label={<span style={{ fontWeight: 700 }}>{isAr ? 'الإجمالي' : 'Total'}</span>}
                   value={<PriceTag amount={total} lang={lang} size={16} color={BARTAL.amber}/>}/>
        </div>
        <div style={{
          marginTop: 10, padding: '10px 12px',
          background: surface, border: `1px solid ${line}`, borderRadius: 10,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <BankIcon color={BARTAL.navy} size={18}/>
          <div style={{ flex: 1 }}>
            <div style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: 600 }}>
              {isAr ? 'تحويل بنكي · بنك فيصل الإسلامي' : 'Bank transfer · Faisal Islamic Bank'}
            </div>
            <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginTop: 2 }}>
              {isAr ? 'مرجع: BRT-2026-00847' : 'Ref: BRT-2026-00847'}
            </div>
          </div>
        </div>
      </Section>

      {/* Help */}
      <div style={{ padding: '0 16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
          background: '#25D36612', border: '1px solid #25D36650', borderRadius: 12,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 15, background: '#25D366',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 13,
          }}>W</div>
          <div style={{ flex: 1 }}>
            <div style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: 600 }}>
              {isAr ? 'تحتاج مساعدة؟' : 'Need help?'}
            </div>
            <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginTop: 2 }}>
              {isAr ? 'راسلنا على واتساب: 91 234 5678' : 'WhatsApp us: +249 91 234 5678'}
            </div>
          </div>
          <ArrowIcon color={muted} flipped={isAr}/>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOBILE: UPLOAD RECEIPT  — photo pick + preview + submit
// ═══════════════════════════════════════════════════════════════
function UploadReceiptScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 120 }}>
      <ScreenHeader title={isAr ? 'رفع الإيصال' : 'Upload receipt'} onBack={onBack} lang={lang} dark={dark}/>

      {/* Amount to send */}
      <Section title={isAr ? 'المبلغ المطلوب تحويله' : 'Amount to transfer'} lang={lang} dark={dark}>
        <div style={{
          background: BARTAL.navy, color: '#fff', borderRadius: 14, padding: 18, textAlign: 'center',
        }}>
          <div style={{ ...typeStyle(lang, 'micro'), color: BARTAL.amberSoft, letterSpacing: 1.5 }}>
            {isAr ? 'الإجمالي' : 'TOTAL'}
          </div>
          <div style={{ marginTop: 4 }}>
            <PriceTag amount={227800} lang={lang} size={30} color="#fff"/>
          </div>
          <div style={{
            marginTop: 10, padding: '6px 12px', display: 'inline-flex', gap: 6,
            background: 'rgba(255,255,255,0.12)', borderRadius: 100,
            ...typeStyle(lang, 'mono'), fontSize: 11, color: BARTAL.amberSoft, fontWeight: 700,
          }}>
            <span>{isAr ? 'المرجع' : 'REF'}</span>
            <span style={{ color: '#fff' }}>BRT-2026-00847</span>
          </div>
        </div>
      </Section>

      {/* Bank details w/ copy */}
      <Section title={isAr ? 'التحويل إلى' : 'Transfer to'} lang={lang} dark={dark}>
        <div style={{ background: surface, borderRadius: 14, border: `1px solid ${line}`, padding: '4px 14px' }}>
          <InfoRow lang={lang} dark={dark} mono={false}
                   label={isAr ? 'البنك' : 'Bank'}
                   value="Faisal Islamic Bank"/>
          <InfoRow lang={lang} dark={dark} mono={false}
                   label={isAr ? 'اسم الحساب' : 'Account name'}
                   value="BARTAL ECOMMERCE"/>
          <InfoRow lang={lang} dark={dark} copy
                   label={isAr ? 'رقم الحساب' : 'Account #'}
                   value="0012-345-678-9000"/>
          <InfoRow lang={lang} dark={dark} copy last
                   label={isAr ? 'المرجع' : 'Reference'}
                   value="BRT-2026-00847"/>
        </div>
      </Section>

      {/* Upload zone */}
      <Section title={isAr ? 'صورة الإيصال' : 'Receipt photo'} lang={lang} dark={dark}>
        <div style={{
          background: BARTAL.amberTint, border: `2px dashed ${BARTAL.amber}`,
          borderRadius: 16, padding: '30px 16px', textAlign: 'center',
        }}>
          <div style={{
            width: 54, height: 54, borderRadius: 27, background: '#fff',
            margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(212,134,11,0.2)',
          }}>
            <CameraIcon color={BARTAL.amber} size={24}/>
          </div>
          <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700, color: text }}>
            {isAr ? 'التقط صورة الإيصال' : 'Take a photo of your receipt'}
          </div>
          <div style={{ ...typeStyle(lang, 'small'), color: muted, marginTop: 4, maxWidth: 280, margin: '4px auto 0' }}>
            {isAr
              ? 'تأكد من وضوح رقم المرجع والمبلغ والتاريخ'
              : 'Make sure the reference, amount and date are clearly visible'}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16, maxWidth: 280, margin: '16px auto 0' }}>
            <button style={{
              flex: 1, background: BARTAL.amber, color: '#fff', border: 'none',
              borderRadius: 10, padding: '11px', ...typeStyle(lang, 'small'), color: '#fff', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <CameraIcon color="#fff" size={14}/>
              {isAr ? 'كاميرا' : 'Camera'}
            </button>
            <button style={{
              flex: 1, background: '#fff', color: BARTAL.navy, border: `1px solid ${BARTAL.amber}`,
              borderRadius: 10, padding: '11px', ...typeStyle(lang, 'small'), color: BARTAL.navy, fontWeight: 700,
            }}>
              {isAr ? 'من المعرض' : 'From gallery'}
            </button>
          </div>
        </div>

        {/* Tips */}
        <div style={{ marginTop: 12 }}>
          {[
            isAr ? 'الصورة واضحة وغير مظلمة' : 'Photo is clear and not dark',
            isAr ? 'رقم المرجع BRT-2026-00847 ظاهر' : 'Reference BRT-2026-00847 is visible',
            isAr ? 'المبلغ يطابق الإجمالي' : 'Amount matches total',
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 2px' }}>
              <div style={{
                width: 18, height: 18, borderRadius: 9, background: BARTAL.success,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <CheckIcon color="#fff" size={11}/>
              </div>
              <span style={{ ...typeStyle(lang, 'small'), color: muted }}>{tip}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <div style={{ padding: '8px 16px' }}>
        <button onClick={() => onNav && onNav('submitted')} style={{
          width: '100%', background: BARTAL.amber, color: '#fff', border: 'none',
          borderRadius: 14, padding: '16px', fontWeight: 700,
          ...typeStyle(lang, 'label'), color: '#fff',
        }}>
          {isAr ? 'إرسال الإيصال للمراجعة' : 'Submit receipt for review'}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOBILE: RECEIPT SUBMITTED — success state
// ═══════════════════════════════════════════════════════════════
function ReceiptSubmittedScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{
      width: '100%', height: '100%', background: bg, overflow: 'auto',
      display: 'flex', flexDirection: 'column',
    }}>
      <ScreenHeader title="" onBack={onBack} lang={lang} dark={dark}/>

      {/* Hero */}
      <div style={{
        padding: '20px 24px 10px', textAlign: 'center', flex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Animated-feel checkmark */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <div style={{
            width: 120, height: 120, borderRadius: 60, background: BARTAL.amberTint,
            position: 'absolute', inset: 0, opacity: 0.6,
          }}/>
          <div style={{
            width: 100, height: 100, borderRadius: 50,
            background: `linear-gradient(135deg, ${BARTAL.amber} 0%, #F59E0B 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 10px 30px ${BARTAL.amber}50`, position: 'relative',
            margin: '10px',
          }}>
            <CheckIcon color="#fff" size={50}/>
          </div>
        </div>

        <div style={{ fontSize: 24, fontWeight: 700, color: text, marginBottom: 8,
                      fontFamily: isAr ? "'Cairo'" : "'Poppins'" }}>
          {isAr ? 'تم استلام الإيصال' : 'Receipt received'}
        </div>
        <div style={{ ...typeStyle(lang, 'body', dark), color: muted, textAlign: 'center', maxWidth: 300, lineHeight: 1.6 }}>
          {isAr
            ? 'نراجع الإيصال الآن. ستتلقى إشعاراً على واتساب خلال ٥–١٥ دقيقة.'
            : "We're reviewing your receipt. You'll get a WhatsApp notification within 5–15 min."}
        </div>

        {/* Timeline preview */}
        <div style={{
          marginTop: 28, background: surface, borderRadius: 14, border: `1px solid ${line}`,
          padding: 16, width: '100%', maxWidth: 320, textAlign: 'start',
        }}>
          {[
            { lbl: isAr ? 'تم الطلب' : 'Order placed',          time: '14:32', done: true },
            { lbl: isAr ? 'تم رفع الإيصال' : 'Receipt uploaded', time: '14:34', done: true, active: true },
            { lbl: isAr ? 'قيد المراجعة' : 'Under review',       time: isAr ? 'قيد الانتظار' : 'pending' },
            { lbl: isAr ? 'مؤكد · قيد التجهيز' : 'Confirmed · preparing', time: '' },
          ].map((s, i, arr) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 10,
                  background: s.done ? BARTAL.success : (s.active ? BARTAL.amber : line),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: s.active ? `0 0 0 4px ${BARTAL.amber}30` : 'none',
                }}>
                  {s.done && <CheckIcon color="#fff" size={11}/>}
                </div>
                {i < arr.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: s.done ? BARTAL.success : line, marginTop: 2 }}/>
                )}
              </div>
              <div style={{ flex: 1, paddingBottom: i < arr.length - 1 ? 14 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ ...typeStyle(lang, 'small'),
                                  color: (s.done || s.active) ? text : muted,
                                  fontWeight: s.active ? 700 : 500 }}>{s.lbl}</span>
                  <span style={{ ...typeStyle(lang, 'micro'), color: muted }}>{s.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '10px 16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={() => onNav && onNav('tracking')} style={{
          width: '100%', background: BARTAL.navy, color: '#fff', border: 'none',
          borderRadius: 14, padding: '14px', ...typeStyle(lang, 'label'), color: '#fff', fontWeight: 700,
        }}>
          {isAr ? 'تتبع الطلب' : 'Track order'}
        </button>
        <button onClick={() => onNav && onNav('home')} style={{
          width: '100%', background: 'transparent', color: text,
          border: `1px solid ${line}`, borderRadius: 14, padding: '14px',
          ...typeStyle(lang, 'label', dark), fontWeight: 600,
        }}>
          {isAr ? 'متابعة التسوق' : 'Continue shopping'}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOBILE: ORDER TRACKING  — timeline + courier info
// ═══════════════════════════════════════════════════════════════
function TrackingScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const STEPS = [
    { lbl: isAr ? 'تم الطلب' : 'Order placed',             time: isAr ? '١٤:٣٢ أمس' : '14:32 Yesterday',      done: true },
    { lbl: isAr ? 'تم تأكيد الدفع' : 'Payment confirmed',  time: isAr ? '١٤:٤٧ أمس' : '14:47 Yesterday',      done: true },
    { lbl: isAr ? 'قيد التجهيز' : 'Preparing',             time: isAr ? '٠٨:١٥' : '08:15',                   done: true },
    { lbl: isAr ? 'في الطريق' : 'Out for delivery',        time: isAr ? '١١:٠٢ · الآن' : '11:02 · now',      active: true },
    { lbl: isAr ? 'تم التسليم' : 'Delivered',              time: isAr ? 'حوالي ١٣:٠٠' : 'around 13:00',      next: true },
  ];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 100 }}>
      <ScreenHeader title={isAr ? 'تتبع الطلب' : 'Track order'} onBack={onBack} lang={lang} dark={dark}/>

      {/* Live status hero */}
      <div style={{
        margin: '10px 16px 0', padding: 18, borderRadius: 16,
        background: `linear-gradient(135deg, ${BARTAL.navy}, ${BARTAL.navyInk})`,
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
          <defs>
            <pattern id="tracking-motif" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <g stroke={BARTAL.amberSoft} strokeWidth="0.6" fill="none">
                <path d="M30 4 L36 18 L50 12 L44 26 L56 30 L44 34 L50 48 L36 42 L30 56 L24 42 L10 48 L16 34 L4 30 L16 26 L10 12 L24 18 Z"/>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tracking-motif)"/>
        </svg>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ ...typeStyle(lang, 'micro'), color: BARTAL.amberSoft, letterSpacing: 1.5 }}>
              {isAr ? 'الحالة' : 'STATUS'}
            </div>
            <div style={{
              padding: '3px 9px', borderRadius: 8,
              background: BARTAL.amber, ...typeStyle(lang, 'micro'), fontSize: 10,
              fontWeight: 700, color: '#fff', letterSpacing: 0.5,
            }}>
              {isAr ? 'مباشر' : 'LIVE'}
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4, lineHeight: 1.2,
                        fontFamily: isAr ? "'Cairo'" : "'Poppins'" }}>
            {isAr ? 'في الطريق إليك' : 'On the way to you'}
          </div>
          <div style={{ ...typeStyle(lang, 'body'), color: BARTAL.amberSoft, marginTop: 4, opacity: 0.9 }}>
            {isAr ? 'الوصول المتوقع خلال ٣٥ دقيقة' : 'Expected in 35 min'}
          </div>

          {/* Fake map strip */}
          <div style={{
            marginTop: 14, height: 44, background: 'rgba(255,255,255,0.1)', borderRadius: 10,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', insetInlineStart: 12, top: 12, width: 20, height: 20, borderRadius: 10,
              background: BARTAL.amber, border: '3px solid #fff', boxShadow: `0 0 0 4px ${BARTAL.amber}40`,
            }}/>
            <div style={{
              position: 'absolute', insetInlineEnd: 12, top: 14, width: 16, height: 16, borderRadius: 8,
              border: '2px solid #fff',
            }}/>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <path d="M 25 22 Q 120 -10, 200 22 T 380 22" stroke={BARTAL.amber} strokeWidth="2" fill="none" strokeDasharray="4 4"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Courier card */}
      <Section title={isAr ? 'المندوب' : 'Courier'} lang={lang} dark={dark}>
        <div style={{
          background: surface, borderRadius: 14, border: `1px solid ${line}`,
          padding: 14, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 24, background: BARTAL.amber,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0,
          }}>
            {isAr ? 'ع' : 'AH'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700 }}>
              {isAr ? 'أحمد حسن' : 'Ahmed Hassan'}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 2 }}>
              <span style={{ color: BARTAL.amber, fontSize: 12 }}>★★★★★</span>
              <span style={{ ...typeStyle(lang, 'micro'), color: muted }}>4.9 · {isAr ? '٢٨٤ توصيل' : '284 deliveries'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 20, background: '#25D366',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700,
            }}>W</div>
            <div style={{
              width: 40, height: 40, borderRadius: 20, background: BARTAL.navy,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 16,
            }}>📞</div>
          </div>
        </div>
      </Section>

      {/* Timeline */}
      <Section title={isAr ? 'التقدم' : 'Progress'} lang={lang} dark={dark}>
        <div style={{ background: surface, borderRadius: 14, border: `1px solid ${line}`, padding: 16 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 11,
                  background: s.done ? BARTAL.success : (s.active ? BARTAL.amber : (dark ? BARTAL.d_raised : line)),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: s.active ? `0 0 0 5px ${BARTAL.amber}30` : 'none',
                }}>
                  {s.done && <CheckIcon color="#fff" size={12}/>}
                  {s.active && <div style={{ width: 8, height: 8, borderRadius: 4, background: '#fff' }}/>}
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    width: 2, flex: 1, marginTop: 2,
                    background: s.done ? BARTAL.success : (dark ? BARTAL.d_raised : line),
                  }}/>
                )}
              </div>
              <div style={{ flex: 1, paddingBottom: i < STEPS.length - 1 ? 16 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ ...typeStyle(lang, 'label', dark),
                                  fontWeight: s.active ? 700 : 500,
                                  color: s.next ? muted : text }}>
                    {s.lbl}
                  </span>
                  <span style={{ ...typeStyle(lang, 'micro'), color: muted }}>{s.time}</span>
                </div>
                {s.active && (
                  <div style={{ ...typeStyle(lang, 'small'), color: BARTAL.amber, marginTop: 2, fontWeight: 600 }}>
                    {isAr ? 'المندوب على بُعد ٢ كم' : 'Courier is 2 km away'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Order ref */}
      <div style={{ padding: '0 16px' }}>
        <div style={{
          background: surface, borderRadius: 12, border: `1px solid ${line}`,
          padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ ...typeStyle(lang, 'small'), color: muted }}>
            {isAr ? 'رقم الطلب' : 'Order'}
          </span>
          <span style={{ ...typeStyle(lang, 'mono'), color: text, fontWeight: 700, fontSize: 12 }}>
            BRT-2026-00847
          </span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ADMIN: RECEIPT VIEWER — the business-critical workflow
// Two-panel layout: receipt photo (left) + order details + approve/reject (right)
// ═══════════════════════════════════════════════════════════════
function AdminReceiptViewer({ dark }) {
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#0B1930';
  const bg = dark ? BARTAL.d_bg : '#F5F6F8';

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16, fontFamily: "'Poppins'" }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 11, color: muted, fontWeight: 600, letterSpacing: 0.5,
                        textTransform: 'uppercase', marginBottom: 2 }}>
            Orders <span style={{ margin: '0 6px' }}>›</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>BRT-2026-00847</span> <span style={{ margin: '0 6px' }}>›</span>
            Receipt review
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: text }}>
            Receipt review — BRT-2026-00847
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{
            padding: '4px 10px', borderRadius: 100,
            background: '#FEF3C7', color: '#B45309',
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
          }}>
            Pending review
          </div>
          <div style={{
            padding: '7px 14px', borderRadius: 8,
            background: surface, border: `1px solid ${line}`, color: text, fontSize: 12, fontWeight: 600,
          }}>
            Assign to me
          </div>
          <div style={{
            padding: '7px 14px', borderRadius: 8,
            background: surface, border: `1px solid ${line}`, color: text, fontSize: 12, fontWeight: 600,
          }}>
            Skip ↷
          </div>
        </div>
      </div>

      {/* SLA banner */}
      <div style={{
        padding: '10px 14px', borderRadius: 10,
        background: BARTAL.amberTint, border: `1px solid ${BARTAL.amber}`,
        display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: text,
      }}>
        <div style={{ fontSize: 16 }}>⚡</div>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 700 }}>Submitted 4 min ago.</span>{' '}
          Review SLA 15 min · 11 min remaining to hit guaranteed response.
        </div>
        <div style={{ fontSize: 11, color: muted, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>11:32</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 16 }}>
        {/* ── LEFT: Receipt image viewer ── */}
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{
            padding: '10px 14px', borderBottom: `1px solid ${line}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: text }}>Receipt photo</div>
            <div style={{ display: 'flex', gap: 6, fontSize: 11, color: muted }}>
              <span style={{ padding: '4px 8px', border: `1px solid ${line}`, borderRadius: 6 }}>−</span>
              <span style={{ padding: '4px 8px', border: `1px solid ${line}`, borderRadius: 6 }}>100%</span>
              <span style={{ padding: '4px 8px', border: `1px solid ${line}`, borderRadius: 6 }}>+</span>
              <span style={{ padding: '4px 8px', border: `1px solid ${line}`, borderRadius: 6 }}>⟲</span>
              <span style={{ padding: '4px 8px', border: `1px solid ${line}`, borderRadius: 6 }}>⛶</span>
            </div>
          </div>

          {/* Receipt render (simulated bank receipt) */}
          <div style={{
            padding: 22, background: dark ? '#0B1930' : '#F0EFEB', minHeight: 520,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          }}>
            <div style={{
              width: '100%', maxWidth: 340, background: '#FBF9F3', color: '#1a1a1a',
              boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
              transform: 'rotate(-0.6deg)', padding: '28px 24px',
              fontFamily: "'Courier New', monospace", fontSize: 11,
            }}>
              {/* Bank letterhead */}
              <div style={{ textAlign: 'center', borderBottom: '1px dashed #999', paddingBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>FAISAL ISLAMIC BANK</div>
                <div style={{ fontSize: 9, color: '#666', marginTop: 2 }}>KHARTOUM MAIN BRANCH · 20-APR-2026</div>
              </div>

              <div style={{ textAlign: 'center', marginTop: 14, fontWeight: 700, fontSize: 12 }}>
                TRANSFER RECEIPT
              </div>

              <div style={{ marginTop: 14, lineHeight: 1.8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>FROM:</span><span>**** **** 4281</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>TO:</span><span>0012-345-678-9000</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>NAME:</span><span>BARTAL ECOMMERCE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>REFERENCE:</span>
                  <span style={{ background: '#FFE29A', padding: '0 3px' }}>BRT-2026-00847</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>DATE:</span><span>20-APR-2026 11:14</span>
                </div>
              </div>

              <div style={{ marginTop: 14, borderTop: '1px dashed #999', paddingTop: 14,
                            display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 14 }}>
                <span>AMOUNT:</span>
                <span style={{ background: '#FFE29A', padding: '0 3px' }}>227,800 SDG</span>
              </div>

              <div style={{ marginTop: 14, fontSize: 9, color: '#666', textAlign: 'center', lineHeight: 1.5 }}>
                TXN ID: FIB8472910384<br/>
                STATUS: COMPLETED ✓<br/>
                KEEP THIS RECEIPT FOR YOUR RECORDS
              </div>

              <div style={{ marginTop: 14, textAlign: 'center', fontSize: 30, letterSpacing: 3, color: '#999' }}>
                ▓▌▓▌▓▓▌▓▌▓▌▓
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Match panel + order + actions ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Match check — auto-diff of expected vs extracted */}
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: text }}>Automated match check</div>
              <div style={{
                padding: '3px 8px', borderRadius: 100,
                background: '#D1FAE5', color: '#065F46', fontSize: 10, fontWeight: 700,
              }}>
                4 of 4 match
              </div>
            </div>
            {[
              { k: 'Amount',    exp: '227,800 SDG',         got: '227,800 SDG',         ok: true  },
              { k: 'Reference', exp: 'BRT-2026-00847',      got: 'BRT-2026-00847',      ok: true  },
              { k: 'Account',   exp: '0012-345-678-9000',   got: '0012-345-678-9000',   ok: true  },
              { k: 'Date',      exp: '20-Apr-2026',         got: '20-Apr-2026 11:14',   ok: true  },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '22px 90px 1fr 1fr', gap: 8,
                alignItems: 'center', padding: '6px 0',
                borderTop: i === 0 ? 'none' : `1px solid ${line}`,
                fontSize: 12,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 9,
                  background: row.ok ? BARTAL.success : BARTAL.danger,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CheckIcon color="#fff" size={10}/>
                </div>
                <div style={{ color: muted, fontWeight: 600 }}>{row.k}</div>
                <div style={{ color: text, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{row.exp}</div>
                <div style={{ color: row.ok ? BARTAL.success : BARTAL.danger,
                              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700 }}>
                  {row.got}
                </div>
              </div>
            ))}
          </div>

          {/* Order snapshot */}
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 12 }}>Order snapshot</div>

            {/* Customer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 18, background: BARTAL.amber,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 13,
              }}>MO</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: text, fontWeight: 700 }}>Mohammed Osman</div>
                <div style={{ fontSize: 11, color: muted, fontFamily: "'JetBrains Mono', monospace" }}>
                  +249 91 234 5678 · 42 orders · Gold
                </div>
              </div>
              <div style={{ fontSize: 11, color: BARTAL.amber, fontWeight: 600 }}>View →</div>
            </div>

            {/* Items */}
            <div style={{ borderTop: `1px solid ${line}`, paddingTop: 10 }}>
              {CATALOG.slice(0, 2).map(p => (
                <div key={p.id} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, overflow: 'hidden' }}>
                    <ProductPlaceholder label={p.name_en} hue={p.hue}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: text, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name_en}
                    </div>
                    <div style={{ color: muted, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
                      {p.price.toLocaleString()} × 1
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{ borderTop: `1px solid ${line}`, paddingTop: 10, marginTop: 6,
                          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 12, color: muted }}>Order total</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: BARTAL.amber,
                             fontFamily: "'JetBrains Mono', monospace" }}>227,800 SDG</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 11, color: muted, fontWeight: 600, marginBottom: 10,
                          textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Decision
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <button style={{
                flex: 1, background: BARTAL.success, color: '#fff', border: 'none',
                padding: '14px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                fontFamily: 'inherit', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <CheckIcon color="#fff" size={16}/>
                Approve & notify customer
              </button>
              <button style={{
                background: surface, color: BARTAL.danger, border: `1.5px solid ${BARTAL.danger}`,
                padding: '14px 18px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                fontFamily: 'inherit', cursor: 'pointer',
              }}>
                ✕ Reject
              </button>
            </div>
            <div style={{ fontSize: 11, color: muted, lineHeight: 1.5 }}>
              Approving will send a WhatsApp confirmation to{' '}
              <span style={{ color: text, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>+249 91 234 5678</span>
              {' '}and move the order to <span style={{ color: text, fontWeight: 600 }}>Preparing</span>.
            </div>
          </div>

          {/* Activity */}
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 10 }}>Activity</div>
            {[
              { t: '14:32', e: 'Order placed',            who: 'customer' },
              { t: '14:34', e: 'Receipt uploaded',        who: 'customer' },
              { t: '14:36', e: 'Auto-matched 4/4 fields', who: 'system',  hl: true },
              { t: '—',     e: 'Awaiting admin approval', who: '—' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '5px 0', fontSize: 11 }}>
                <span style={{ color: muted, fontFamily: "'JetBrains Mono', monospace", minWidth: 40 }}>{a.t}</span>
                <span style={{ color: a.hl ? BARTAL.amber : text, fontWeight: a.hl ? 700 : 500, flex: 1 }}>{a.e}</span>
                <span style={{ color: muted, fontSize: 10 }}>{a.who}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  OrderDetailScreen, UploadReceiptScreen, ReceiptSubmittedScreen, TrackingScreen,
  AdminReceiptViewer,
});
