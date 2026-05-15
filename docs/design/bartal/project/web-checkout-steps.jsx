// web-checkout-steps.jsx — Address / Bank / Review blocks used by WebCheckout.
// These render ONLY the left column; WebCheckout provides header, stepper, and summary sidebar.

// ═══════════════════════════════════════════════════════════════
// WEB · ADDRESS STEP
// ═══════════════════════════════════════════════════════════════
function WebCheckoutAddress({ lang, dark }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const addresses = [
    { id: 'home', label: isAr ? 'المنزل' : 'Home',
      name: 'Mohammed Osman Ahmed', phone: '+249 91 234 5678',
      line1: isAr ? 'الرياض، بلوك ٣٢، منزل ١٤' : 'Al-Riyadh, block 32, house 14',
      city: isAr ? 'الخرطوم' : 'Khartoum',
      landmark: isAr ? 'بجانب مسجد النور' : 'Next to Al-Nur Mosque',
      on: true },
    { id: 'work', label: isAr ? 'العمل' : 'Work',
      name: 'Mohammed Osman Ahmed', phone: '+249 91 234 5678',
      line1: isAr ? 'العمارات، شارع ٦١' : 'Amarat, Street 61',
      city: isAr ? 'الخرطوم' : 'Khartoum',
      landmark: isAr ? 'مقابل صيدلية الشفاء' : 'Opposite Al-Shifa Pharmacy' },
  ];

  const zones = [
    { k: isAr ? 'المنطقة أ · الخرطوم وسط' : 'Zone A · Khartoum Central',    fee: 500,  d: isAr ? '٠-١ يوم' : '0-1 day' },
    { k: isAr ? 'المنطقة ب · أم درمان' : 'Zone B · Omdurman',                fee: 800,  d: isAr ? '١-٢ يوم' : '1-2 days', on: true },
    { k: isAr ? 'المنطقة ج · الخرطوم بحري' : 'Zone C · Khartoum North',      fee: 800,  d: isAr ? '١-٢ يوم' : '1-2 days' },
    { k: isAr ? 'المنطقة د · ولايات أخرى' : 'Zone D · Other states',         fee: 1000, d: isAr ? '٣-٥ أيام' : '3-5 days' },
  ];

  return (
    <>
      <div style={{ fontSize: 20, fontWeight: 700, color: text, marginBottom: 14 }}>
        {isAr ? 'عنوان التوصيل' : 'Delivery address'}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {addresses.map(a => (
          <div key={a.id} style={{
            background: surface,
            border: a.on ? `2px solid ${BARTAL.amber}` : `1px solid ${line}`,
            borderRadius: 12, padding: 18, cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ display: 'flex', gap: 14, flex: 1 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 10, flexShrink: 0, marginTop: 2,
                  border: `2px solid ${a.on ? BARTAL.amber : line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {a.on && <div style={{ width: 10, height: 10, borderRadius: 5, background: BARTAL.amber }}/>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: text }}>{a.name}</span>
                    <span style={{
                      padding: '2px 8px', borderRadius: 100,
                      background: a.on ? BARTAL.amberTint : (dark ? BARTAL.d_raised : BARTAL.sand),
                      color: a.on ? BARTAL.amber : muted,
                      fontSize: 10, fontWeight: 700, letterSpacing: 0.2,
                    }}>{a.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: muted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>
                    {a.phone}
                  </div>
                  <div style={{ fontSize: 13, color: text, lineHeight: 1.55 }}>
                    {a.line1} — <span style={{ color: muted }}>{a.city}</span>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 12, color: BARTAL.amber, fontWeight: 600 }}>
                    ◉ {a.landmark}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 12, color: BARTAL.navy, fontWeight: 600 }}>
                <span style={{ cursor: 'pointer' }}>{isAr ? 'تعديل' : 'Edit'}</span>
                <span style={{ color: line }}>|</span>
                <span style={{ cursor: 'pointer', color: BARTAL.danger }}>{isAr ? 'حذف' : 'Delete'}</span>
              </div>
            </div>
          </div>
        ))}

        <button style={{
          background: 'transparent', border: `1.5px dashed ${line}`, borderRadius: 12,
          padding: '16px', fontSize: 13, color: BARTAL.navy, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer',
          fontFamily: isAr ? "'Cairo'" : "'Poppins'",
        }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
          {isAr ? 'إضافة عنوان جديد' : 'Add new address'}
        </button>
      </div>

      {/* Delivery zone */}
      <div style={{ fontSize: 15, fontWeight: 700, color: text, marginBottom: 10 }}>
        {isAr ? 'منطقة التوصيل' : 'Delivery zone'}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {zones.map((z, i) => (
          <div key={i} style={{
            padding: 14, borderRadius: 12,
            background: surface,
            border: z.on ? `2px solid ${BARTAL.amber}` : `1px solid ${line}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 2 }}>{z.k}</div>
              <div style={{ fontSize: 11, color: muted }}>{z.d}</div>
            </div>
            <PriceTag amount={z.fee} lang={lang} size={14}/>
          </div>
        ))}
      </div>

      {/* Landmark required */}
      <div style={{
        padding: 14, borderRadius: 10,
        background: BARTAL.amberTint, border: `1px solid ${BARTAL.amber}40`,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 4 }}>
          {isAr ? 'علامة مميزة مطلوبة' : 'Landmark required'}
        </div>
        <div style={{ fontSize: 12, color: muted, lineHeight: 1.5 }}>
          {isAr
            ? 'خرائط سوداء محدودة. ذكر علامة قريبة (مسجد، صيدلية، مدرسة) يساعد السائق على إيجاد العنوان بسهولة.'
            : 'Street maps are limited. A nearby landmark (mosque, pharmacy, school) helps the driver find your address.'}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// WEB · BANK TRANSFER INSTRUCTIONS STEP
// ═══════════════════════════════════════════════════════════════
function WebCheckoutBank({ lang, dark }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const banks = [
    { id: 'faisal',   name: isAr ? 'بنك فيصل الإسلامي' : 'Faisal Islamic Bank',   acc: '0012-345-678-9000', swift: 'FIBSSDKH', on: true },
    { id: 'omdurman', name: isAr ? 'بنك أم درمان الوطني' : 'Omdurman National',    acc: '4455-223-119-8800', swift: 'ONBKSDKH' },
    { id: 'khartoum', name: isAr ? 'بنك الخرطوم' : 'Bank of Khartoum',             acc: '7708-661-223-0012', swift: 'BKHTSDKH' },
  ];

  return (
    <>
      <div style={{ fontSize: 20, fontWeight: 700, color: text, marginBottom: 6 }}>
        {isAr ? 'تفاصيل التحويل البنكي' : 'Bank transfer details'}
      </div>
      <div style={{ fontSize: 13, color: muted, marginBottom: 18, lineHeight: 1.55 }}>
        {isAr
          ? 'اختر البنك الذي ستحول منه. سيتم تأكيد الطلب فور مطابقة الإيصال يدوياً من قبل فريقنا (٥-١٥ دقيقة).'
          : 'Choose the bank you\'ll transfer from. Your order is confirmed once our team manually matches the receipt (5-15 min).'}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {banks.map(b => (
          <div key={b.id} style={{
            background: surface,
            border: b.on ? `2px solid ${BARTAL.amber}` : `1px solid ${line}`,
            borderRadius: 12, padding: 18,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 20, height: 20, borderRadius: 10, flexShrink: 0,
                border: `2px solid ${b.on ? BARTAL.amber : line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {b.on && <div style={{ width: 10, height: 10, borderRadius: 5, background: BARTAL.amber }}/>}
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                background: dark ? BARTAL.d_raised : BARTAL.sand,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BankIcon color={BARTAL.navy}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: text }}>{b.name}</div>
                <div style={{ fontSize: 12, color: muted, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>
                  {b.acc}
                </div>
              </div>
              {b.on && (
                <div style={{
                  padding: '4px 10px', borderRadius: 100,
                  background: BARTAL.amberTint, color: BARTAL.amber,
                  fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
                }}>{isAr ? 'موصى به' : 'Recommended'}</div>
              )}
            </div>

            {b.on && (
              <div style={{
                marginTop: 14, padding: 14,
                background: dark ? BARTAL.d_raised : BARTAL.sand, borderRadius: 10,
              }}>
                <div style={{ fontSize: 10, color: muted, fontWeight: 700, letterSpacing: 0.5,
                              textTransform: 'uppercase', marginBottom: 10 }}>
                  {isAr ? 'نسخ إلى تطبيق البنك' : 'Copy to your banking app'}
                </div>
                {[
                  [isAr ? 'اسم الحساب' : 'Account name',       'BARTAL ECOMMERCE LTD'],
                  [isAr ? 'رقم الحساب' : 'Account #',          b.acc],
                  [isAr ? 'SWIFT' : 'SWIFT',                  b.swift],
                  [isAr ? 'المبلغ' : 'Amount',                 '227,800 SDG'],
                  [isAr ? 'المرجع' : 'Reference',              'BRT-2026-00847'],
                ].map(([k, v], i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '7px 0', borderBottom: i < 4 ? `1px dashed ${line}` : 'none',
                  }}>
                    <span style={{ fontSize: 12, color: muted }}>{k}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: text, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
                      <span style={{ fontSize: 11, color: BARTAL.amber, fontWeight: 600, cursor: 'pointer' }}>
                        {isAr ? 'نسخ' : 'Copy'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{
        padding: 14, borderRadius: 10,
        background: dark ? BARTAL.d_raised : BARTAL.sand, border: `1px solid ${line}`,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 8 }}>
          {isAr ? 'ماذا بعد التحويل؟' : 'After you transfer'}
        </div>
        <ol style={{ margin: 0, paddingInlineStart: 18, fontSize: 12, color: muted, lineHeight: 1.8 }}>
          <li>{isAr ? 'اضغط "تأكيد الطلب" في الخطوة التالية' : 'Click "Place order" in the next step'}</li>
          <li>{isAr ? 'ارفع صورة إيصال التحويل' : 'Upload a photo of your transfer receipt'}</li>
          <li>{isAr ? 'سنؤكد الطلب خلال ٥-١٥ دقيقة' : 'We confirm within 5-15 min'}</li>
          <li>{isAr ? 'ستصلك رسالة SMS + WhatsApp' : 'You\'ll get SMS + WhatsApp notification'}</li>
        </ol>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// WEB · REVIEW & PLACE ORDER STEP
// ═══════════════════════════════════════════════════════════════
function WebCheckoutReview({ lang, dark }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const items = CATALOG.slice(0, 3).map((p, i) => ({ ...p, qty: i === 0 ? 1 : (i === 1 ? 2 : 1) }));

  const Card = ({ title, editStep, children }) => (
    <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 18, marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: text, letterSpacing: 0.3, textTransform: 'uppercase' }}>{title}</div>
        <div style={{ fontSize: 12, color: BARTAL.amber, fontWeight: 600, cursor: 'pointer' }}>
          {isAr ? `تعديل ${editStep}` : `Edit ${editStep}`} ←
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <>
      <div style={{ fontSize: 20, fontWeight: 700, color: text, marginBottom: 14 }}>
        {isAr ? 'مراجعة الطلب' : 'Review order'}
      </div>

      <Card title={isAr ? 'التوصيل إلى' : 'Ship to'} editStep={isAr ? 'العنوان' : 'address'}>
        <div style={{ fontSize: 14, fontWeight: 600, color: text }}>Mohammed Osman Ahmed</div>
        <div style={{ fontSize: 12, color: muted, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>
          +249 91 234 5678
        </div>
        <div style={{ fontSize: 13, color: text, marginTop: 6, lineHeight: 1.55 }}>
          {isAr ? 'الرياض، بلوك ٣٢، منزل ١٤ — الخرطوم' : 'Al-Riyadh, block 32, house 14 — Khartoum'}
        </div>
        <div style={{ fontSize: 12, color: BARTAL.amber, fontWeight: 600, marginTop: 4 }}>
          ◉ {isAr ? 'بجانب مسجد النور' : 'Next to Al-Nur Mosque'}
        </div>
      </Card>

      <Card title={isAr ? 'طريقة الدفع' : 'Payment'} editStep={isAr ? 'الدفع' : 'payment'}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: dark ? BARTAL.d_raised : BARTAL.sand,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BankIcon color={BARTAL.navy}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: text }}>
              {isAr ? 'تحويل بنكي — بنك فيصل' : 'Bank transfer — Faisal Bank'}
            </div>
            <div style={{ fontSize: 11, color: muted, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>
              ****9000
            </div>
          </div>
          <span style={{ fontSize: 11, color: BARTAL.amber, fontWeight: 700, padding: '4px 10px',
                         borderRadius: 100, background: BARTAL.amberTint }}>
            {isAr ? 'رفع الإيصال بعد الطلب' : 'Upload receipt after placing'}
          </span>
        </div>
      </Card>

      <Card title={isAr ? `العناصر (${items.length})` : `Items (${items.length})`} editStep={isAr ? 'السلة' : 'cart'}>
        {items.map((p, i) => (
          <div key={p.id} style={{
            display: 'grid', gridTemplateColumns: '48px 1fr auto auto', gap: 14, alignItems: 'center',
            padding: '10px 0', borderBottom: i < items.length - 1 ? `1px solid ${line}` : 'none',
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden' }}>
              <ProductPlaceholder label={p.name_en} hue={p.hue}/>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: text,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {isAr ? p.name_ar : p.name_en}
              </div>
              <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>SKU BRT-{p.id.toUpperCase()}</div>
            </div>
            <div style={{ fontSize: 12, color: muted, fontFamily: "'JetBrains Mono', monospace" }}>×{p.qty}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: text, fontFamily: "'JetBrains Mono', monospace",
                          textAlign: isAr ? 'left' : 'right', minWidth: 90 }}>
              {(p.price * p.qty).toLocaleString()} SDG
            </div>
          </div>
        ))}
      </Card>

      {/* Terms */}
      <div style={{
        padding: 14, borderRadius: 10,
        background: dark ? BARTAL.d_raised : BARTAL.sand, border: `1px solid ${line}`,
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <input type="checkbox" defaultChecked style={{ marginTop: 3, accentColor: BARTAL.amber }}/>
        <div style={{ fontSize: 12, color: muted, lineHeight: 1.55 }}>
          {isAr
            ? 'أوافق على شروط الاستخدام وسياسة الخصوصية وسياسة الإرجاع الخاصة ببرتال. '
            : 'I agree to Bartal\'s Terms of Service, Privacy Policy, and Return Policy. '}
          <span style={{ color: BARTAL.amber, fontWeight: 600, cursor: 'pointer' }}>
            {isAr ? 'اقرأ المزيد' : 'Learn more'}
          </span>
        </div>
      </div>

      {/* Place order CTA */}
      <button style={{
        width: '100%', marginTop: 16,
        background: BARTAL.navy, color: '#fff', border: 'none',
        borderRadius: 12, padding: '18px', fontSize: 15, fontWeight: 700,
        fontFamily: isAr ? "'Cairo'" : "'Poppins'", cursor: 'pointer',
      }}>
        {isAr ? 'تأكيد الطلب والمتابعة لرفع الإيصال' : 'Place order & continue to receipt upload'}
      </button>
    </>
  );
}

Object.assign(window, {
  WebCheckoutAddress, WebCheckoutBank, WebCheckoutReview,
});
