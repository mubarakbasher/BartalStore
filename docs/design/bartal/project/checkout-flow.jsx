// checkout-flow.jsx — 4-step mobile checkout: Address → Payment → Bank → Review.
// Each screen uses a consistent stepper header. Confirm screen stays in secondary-screens.

// ─── Shared stepper ─────────────────────────────────────
function CheckoutStepper({ step, lang, dark }) {
  const isAr = lang === 'ar';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const labels = isAr
    ? ['العنوان', 'الدفع', 'المراجعة']
    : ['Address', 'Payment', 'Review'];
  return (
    <div style={{ padding: '8px 16px 14px', display: 'flex', gap: 6 }}>
      {labels.map((lbl, i) => (
        <div key={i} style={{ flex: 1 }}>
          <div style={{ height: 4, borderRadius: 2, background: i <= step ? BARTAL.amber : line }}/>
          <div style={{ ...typeStyle(lang, 'micro'), color: i <= step ? (dark ? BARTAL.d_text : BARTAL.navy) : muted,
                        marginTop: 6, fontWeight: i <= step ? 700 : 500, textTransform: 'none', letterSpacing: 0 }}>
            {lbl}
          </div>
        </div>
      ))}
    </div>
  );
}

function StickyAction({ label, onClick, secondary, surface, line, lang, disabled }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: surface, borderTop: `1px solid ${line}`, padding: '14px 16px 18px',
      display: 'flex', gap: 10,
    }}>
      {secondary && (
        <button onClick={secondary.onClick} style={{
          flex: '0 0 auto', background: 'transparent', color: BARTAL.navy,
          border: `1px solid ${line}`, borderRadius: 14, padding: '16px 18px',
          ...typeStyle(lang, 'label'), color: BARTAL.navy, fontWeight: 600,
        }}>{secondary.label}</button>
      )}
      <button onClick={onClick} disabled={disabled} style={{
        flex: 1, background: disabled ? '#C9CFD4' : BARTAL.navy, color: '#fff',
        border: 'none', borderRadius: 14, padding: '16px',
        ...typeStyle(lang, 'label'), color: '#fff', fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}>{label}</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 1: ADDRESS  (delivery zone + saved addresses + landmark)
// ═══════════════════════════════════════════════════════════════
function CheckoutAddressScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const addresses = [
    { id: 'home', label: isAr ? 'المنزل' : 'Home',
      name: 'Mohammed Osman', phone: '+249 912 345 678',
      line1: isAr ? 'الرياض، بلوك ٣٢، منزل ١٤' : 'Al-Riyadh, block 32, house 14',
      city: isAr ? 'الخرطوم' : 'Khartoum',
      landmark: isAr ? 'بجانب مسجد النور' : 'Next to Al-Nur Mosque',
      on: true },
    { id: 'work', label: isAr ? 'العمل' : 'Work',
      name: 'Mohammed Osman', phone: '+249 912 345 678',
      line1: isAr ? 'العمارات، شارع ٦١' : 'Amarat, Street 61',
      city: isAr ? 'الخرطوم' : 'Khartoum',
      landmark: isAr ? 'مقابل صيدلية الشفاء' : 'Opposite Al-Shifa Pharmacy' },
  ];

  const zones = [
    { k: 'zoneA', fee: 500, d: isAr ? '٠-١ يوم' : '0-1 day' },
    { k: 'zoneB', fee: 800, d: isAr ? '١-٢ يوم' : '1-2 days', on: true },
    { k: 'zoneC', fee: 800, d: isAr ? '١-٢ يوم' : '1-2 days' },
    { k: 'zoneD', fee: 1000, d: isAr ? '١-٢ يوم' : '1-2 days' },
  ];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 110 }}>
      <ScreenHeader title={t('checkout', lang)} onBack={onBack} lang={lang} dark={dark}/>
      <CheckoutStepper step={0} lang={lang} dark={dark}/>

      {/* Saved addresses */}
      <Section lang={lang} dark={dark} title={isAr ? 'عنوان التوصيل' : 'Delivery address'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {addresses.map(a => (
            <div key={a.id} style={{
              background: surface, border: a.on ? `2px solid ${BARTAL.amber}` : `1px solid ${line}`,
              borderRadius: 14, padding: 14, position: 'relative',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    padding: '3px 10px', borderRadius: 100,
                    background: a.on ? BARTAL.amberTint : (dark ? BARTAL.d_raised : BARTAL.sand),
                    color: a.on ? BARTAL.amber : muted,
                    fontSize: 11, fontWeight: 700, letterSpacing: 0.2,
                  }}>{a.label}</div>
                  {a.on && (
                    <span style={{ ...typeStyle(lang, 'micro'), color: BARTAL.amber, fontWeight: 700, letterSpacing: 0 }}>
                      {isAr ? '● محدد' : '● Selected'}
                    </span>
                  )}
                </div>
                <span style={{ ...typeStyle(lang, 'micro'), color: muted, cursor: 'pointer' }}>
                  {isAr ? 'تعديل' : 'Edit'}
                </span>
              </div>
              <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 600 }}>{a.name}</div>
              <div style={{ ...typeStyle(lang, 'small'), color: muted, marginTop: 2, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                {a.phone}
              </div>
              <div style={{ ...typeStyle(lang, 'body', dark), marginTop: 8, lineHeight: 1.5 }}>
                {a.line1}<br/>
                <span style={{ color: muted }}>{a.city}</span>
              </div>
              <div style={{
                marginTop: 10, padding: '8px 10px', background: dark ? BARTAL.d_raised : BARTAL.sand,
                borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ color: BARTAL.amber, fontSize: 14 }}>◉</span>
                <span style={{ ...typeStyle(lang, 'small'), color: text }}>{a.landmark}</span>
              </div>
            </div>
          ))}
          <button style={{
            background: 'transparent', border: `1.5px dashed ${line}`, borderRadius: 14,
            padding: '14px', ...typeStyle(lang, 'label'), color: BARTAL.navy, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer',
          }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
            {isAr ? 'إضافة عنوان جديد' : 'Add new address'}
          </button>
        </div>
      </Section>

      {/* Delivery zone */}
      <Section lang={lang} dark={dark} title={isAr ? 'منطقة التوصيل' : 'Delivery zone'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {zones.map(z => (
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

      <StickyAction
        lang={lang} surface={surface} line={line}
        label={isAr ? 'متابعة إلى الدفع' : 'Continue to payment'}
        onClick={() => onNav && onNav('checkoutPayment')}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 2: PAYMENT METHOD
// ═══════════════════════════════════════════════════════════════
function CheckoutPaymentScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const [method, setMethod] = React.useState('bank');

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 110 }}>
      <ScreenHeader title={t('checkout', lang)} onBack={onBack} lang={lang} dark={dark}/>
      <CheckoutStepper step={1} lang={lang} dark={dark}/>

      <Section lang={lang} dark={dark} title={isAr ? 'طريقة الدفع' : 'Payment method'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { id: 'bank', icon: <BankIcon color={BARTAL.navy}/>,
              title: t('bankTransfer', lang),
              sub: isAr ? 'بنك فيصل · رفع إيصال بعد التحويل' : 'Faisal Bank · Upload receipt after transfer',
              badge: isAr ? 'موصى به' : 'Recommended' },
            { id: 'cod', icon: <CashIcon color={BARTAL.navy}/>,
              title: t('cod', lang),
              sub: isAr ? 'ادفع عند التسليم نقداً' : 'Pay cash when delivered',
              fee: 500 },
            { id: 'mobile', icon: <WalletIcon color={BARTAL.navy}/>,
              title: isAr ? 'محفظة رقمية' : 'Mobile wallet',
              sub: isAr ? 'بنكك · فوري · زين كاش' : 'Bankak · Fawry · Zain Cash',
              soon: true },
          ].map(opt => {
            const on = method === opt.id;
            return (
              <div key={opt.id} onClick={() => !opt.soon && setMethod(opt.id)} style={{
                background: surface, border: on ? `2px solid ${BARTAL.amber}` : `1px solid ${line}`,
                borderRadius: 14, padding: 14, opacity: opt.soon ? 0.55 : 1,
                cursor: opt.soon ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: dark ? BARTAL.d_raised : BARTAL.sand,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>{opt.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700 }}>{opt.title}</span>
                    {opt.badge && (
                      <span style={{ background: BARTAL.amberTint, color: BARTAL.amber,
                                     padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 700 }}>
                        {opt.badge}
                      </span>
                    )}
                    {opt.soon && (
                      <span style={{ background: dark ? BARTAL.d_raised : BARTAL.sand, color: muted,
                                     padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 700 }}>
                        {isAr ? 'قريباً' : 'Soon'}
                      </span>
                    )}
                  </div>
                  <div style={{ ...typeStyle(lang, 'small'), color: muted, marginTop: 3, lineHeight: 1.45 }}>{opt.sub}</div>
                  {opt.fee && (
                    <div style={{ ...typeStyle(lang, 'small'), color: BARTAL.amber, marginTop: 4, fontWeight: 600 }}>
                      + <PriceTag amount={opt.fee} lang={lang} size={12} color={BARTAL.amber}/> {isAr ? 'رسوم' : 'fee'}
                    </div>
                  )}
                </div>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: `2px solid ${on ? BARTAL.amber : line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 10,
                }}>
                  {on && <div style={{ width: 10, height: 10, borderRadius: '50%', background: BARTAL.amber }}/>}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Promo code */}
      <Section lang={lang} dark={dark} title={isAr ? 'كود الخصم' : 'Promo code'}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input placeholder={isAr ? 'أدخل الكود' : 'Enter code'} style={{
            flex: 1, background: surface, border: `1px solid ${line}`, borderRadius: 12,
            padding: '12px 14px', ...typeStyle(lang, 'body', dark), outline: 'none',
          }}/>
          <button style={{
            background: dark ? BARTAL.d_raised : BARTAL.sand, color: BARTAL.navy,
            border: `1px solid ${line}`, borderRadius: 12, padding: '0 18px',
            ...typeStyle(lang, 'label'), color: BARTAL.navy, fontWeight: 700, cursor: 'pointer',
          }}>
            {isAr ? 'تطبيق' : 'Apply'}
          </button>
        </div>
      </Section>

      <StickyAction
        lang={lang} surface={surface} line={line}
        label={isAr ? 'متابعة' : 'Continue'}
        onClick={() => onNav && onNav(method === 'bank' ? 'checkoutBank' : 'checkoutReview')}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 2B: BANK TRANSFER INSTRUCTIONS
// ═══════════════════════════════════════════════════════════════
function CheckoutBankScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const banks = [
    { id: 'faisal', name: isAr ? 'بنك فيصل الإسلامي' : 'Faisal Islamic Bank',
      acc: '0012-345-678-9000', on: true },
    { id: 'omdurman', name: isAr ? 'بنك أم درمان الوطني' : 'Omdurman National Bank',
      acc: '4455-223-119-8800' },
    { id: 'khartoum', name: isAr ? 'بنك الخرطوم' : 'Bank of Khartoum',
      acc: '7708-661-223-0012' },
  ];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 110 }}>
      <ScreenHeader title={t('checkout', lang)} onBack={onBack} lang={lang} dark={dark}/>
      <CheckoutStepper step={1} lang={lang} dark={dark}/>

      {/* Info banner */}
      <div style={{ margin: '0 16px 14px', padding: 14, borderRadius: 14,
                    background: BARTAL.amberTint, border: `1px solid ${BARTAL.amber}40` }}>
        <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700, marginBottom: 4 }}>
          {isAr ? 'اختر البنك الذي ستحول منه' : 'Choose the bank you\'ll transfer from'}
        </div>
        <div style={{ ...typeStyle(lang, 'small'), color: text, lineHeight: 1.5 }}>
          {isAr
            ? 'لدينا حسابات في عدة بنوك لتسهيل التحويل المحلي. بعد التحويل ستقوم برفع إيصال في الخطوة التالية.'
            : 'We have accounts in several banks for easier local transfer. You\'ll upload the receipt after transfer.'}
        </div>
      </div>

      <Section lang={lang} dark={dark} title={isAr ? 'حسابات برتال' : 'Bartal accounts'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {banks.map(b => (
            <div key={b.id} style={{
              background: surface, border: b.on ? `2px solid ${BARTAL.amber}` : `1px solid ${line}`,
              borderRadius: 14, padding: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: b.on ? 10 : 0 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: dark ? BARTAL.d_raised : BARTAL.sand,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <BankIcon color={BARTAL.navy}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700 }}>{b.name}</div>
                  <div style={{ ...typeStyle(lang, 'mono'), color: muted, marginTop: 2 }}>{b.acc}</div>
                </div>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: `2px solid ${b.on ? BARTAL.amber : line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {b.on && <div style={{ width: 10, height: 10, borderRadius: '50%', background: BARTAL.amber }}/>}
                </div>
              </div>
              {b.on && (
                <div style={{ borderTop: `1px solid ${line}`, paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <InfoRow lang={lang} dark={dark}
                           label={isAr ? 'اسم الحساب' : 'Account name'}
                           value={isAr ? 'برتال للتجارة الإلكترونية' : 'Bartal E-Commerce Ltd'}
                           mono={false}/>
                  <InfoRow lang={lang} dark={dark}
                           label={isAr ? 'رقم الحساب' : 'Account #'} value={b.acc} copy/>
                  <InfoRow lang={lang} dark={dark}
                           label={isAr ? 'SWIFT' : 'SWIFT'} value="FIBSSDKH" copy/>
                  <InfoRow lang={lang} dark={dark}
                           label={isAr ? 'المبلغ المطلوب' : 'Amount to transfer'}
                           value={<PriceTag amount={228000} lang={lang} size={15} color={BARTAL.amber}/>} copy last/>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section lang={lang} dark={dark} title={isAr ? 'ملاحظة مهمة' : 'Important note'}>
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 14 }}>
          <ul style={{ margin: 0, paddingInlineStart: 20, ...typeStyle(lang, 'small', dark), lineHeight: 1.7 }}>
            <li>{isAr ? 'استخدم رقم الطلب كمرجع في التحويل' : 'Use your order number as reference'}</li>
            <li>{isAr ? 'التحقق يستغرق ٥-١٥ دقيقة في ساعات العمل' : 'Verification takes 5–15 min during business hours'}</li>
            <li>{isAr ? 'ستصلك رسالة SMS + WhatsApp عند التأكيد' : 'You\'ll get SMS + WhatsApp on confirmation'}</li>
          </ul>
        </div>
      </Section>

      <StickyAction
        lang={lang} surface={surface} line={line}
        label={isAr ? 'متابعة إلى المراجعة' : 'Continue to review'}
        onClick={() => onNav && onNav('checkoutReview')}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 3: REVIEW & PLACE ORDER
// ═══════════════════════════════════════════════════════════════
function CheckoutReviewScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const items = CATALOG.slice(0, 2).map((p, i) => ({ ...p, qty: i === 0 ? 1 : 2 }));
  const subtotal = items.reduce((s, p) => s + p.price * p.qty, 0);
  const fee = 800;
  const discount = 5000;
  const total = subtotal + fee - discount;

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 110 }}>
      <ScreenHeader title={t('checkout', lang)} onBack={onBack} lang={lang} dark={dark}/>
      <CheckoutStepper step={2} lang={lang} dark={dark}/>

      {/* Address recap */}
      <Section lang={lang} dark={dark} title={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{isAr ? 'عنوان التوصيل' : 'Delivery address'}</span>
          <span onClick={() => onNav && onNav('checkoutAddress')}
                style={{ color: BARTAL.amber, fontWeight: 600, cursor: 'pointer', textTransform: 'none', letterSpacing: 0 }}>
            {isAr ? 'تعديل' : 'Edit'}
          </span>
        </div>
      }>
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 14 }}>
          <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 600 }}>Mohammed Osman</div>
          <div style={{ ...typeStyle(lang, 'small'), color: muted, marginTop: 2, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
            +249 912 345 678
          </div>
          <div style={{ ...typeStyle(lang, 'body', dark), marginTop: 6, lineHeight: 1.5 }}>
            {isAr ? 'الرياض، بلوك ٣٢، منزل ١٤ — الخرطوم' : 'Al-Riyadh, block 32, house 14 — Khartoum'}
          </div>
          <div style={{ ...typeStyle(lang, 'small'), color: BARTAL.amber, marginTop: 4 }}>
            ◉ {isAr ? 'بجانب مسجد النور' : 'Next to Al-Nur Mosque'}
          </div>
        </div>
      </Section>

      {/* Payment recap */}
      <Section lang={lang} dark={dark} title={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{isAr ? 'طريقة الدفع' : 'Payment method'}</span>
          <span onClick={() => onNav && onNav('checkoutPayment')}
                style={{ color: BARTAL.amber, fontWeight: 600, cursor: 'pointer', textTransform: 'none', letterSpacing: 0 }}>
            {isAr ? 'تعديل' : 'Edit'}
          </span>
        </div>
      }>
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 14,
                      display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: dark ? BARTAL.d_raised : BARTAL.sand,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BankIcon color={BARTAL.navy}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700 }}>
              {t('bankTransfer', lang)}
            </div>
            <div style={{ ...typeStyle(lang, 'small'), color: muted, marginTop: 2 }}>
              {isAr ? 'بنك فيصل · ****9000' : 'Faisal Bank · ****9000'}
            </div>
          </div>
        </div>
      </Section>

      {/* Items */}
      <Section lang={lang} dark={dark} title={`${isAr ? 'العناصر' : 'Items'} · ${items.length}`}>
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, overflow: 'hidden' }}>
          {items.map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', gap: 12, padding: 12,
              borderBottom: i < items.length - 1 ? `1px solid ${line}` : 'none',
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                <ProductPlaceholder label={p.name_en} hue={p.hue}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 600 }}>
                  {isAr ? p.name_ar : p.name_en}
                </div>
                <div style={{ ...typeStyle(lang, 'small'), color: muted, marginTop: 2 }}>
                  {isAr ? 'الكمية' : 'Qty'} {p.qty} · <PriceTag amount={p.price} lang={lang} size={12} color={muted} strong={false}/>
                </div>
              </div>
              <PriceTag amount={p.price * p.qty} lang={lang} size={14}/>
            </div>
          ))}
        </div>
      </Section>

      {/* Totals */}
      <Section lang={lang} dark={dark} title={isAr ? 'الإجمالي' : 'Summary'}>
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 14,
                      display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { k: isAr ? 'المجموع الفرعي' : 'Subtotal', v: subtotal },
            { k: isAr ? 'التوصيل (أم درمان)' : 'Delivery (Omdurman)', v: fee },
            { k: isAr ? 'خصم (BARTAL10)' : 'Discount (BARTAL10)', v: -discount, hl: true },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ ...typeStyle(lang, 'body', dark), color: r.hl ? BARTAL.success : text }}>{r.k}</span>
              <PriceTag amount={Math.abs(r.v)}
                        lang={lang} size={14}
                        color={r.hl ? BARTAL.success : text}
                        strong={false}/>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${line}`, marginTop: 4, paddingTop: 10,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ ...typeStyle(lang, 'h2', dark) }}>{isAr ? 'الإجمالي' : 'Total'}</span>
            <PriceTag amount={total} lang={lang} size={20} color={BARTAL.amber}/>
          </div>
        </div>
      </Section>

      {/* Terms */}
      <div style={{ padding: '4px 16px 8px', ...typeStyle(lang, 'small'), color: muted, lineHeight: 1.5, textAlign: 'center' }}>
        {isAr
          ? 'بالضغط على "تأكيد الطلب" فإنك توافق على شروط الاستخدام وسياسة الخصوصية.'
          : 'By placing this order, you agree to our Terms and Privacy Policy.'}
      </div>

      <StickyAction
        lang={lang} surface={surface} line={line}
        label={isAr ? 'تأكيد الطلب' : 'Place order'}
        onClick={() => onNav && onNav('confirm')}
      />
    </div>
  );
}

// ─── Missing helper icons ───────────────────────────────
function WalletIcon({ color = '#0F2748', size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12V8a2 2 0 0 0-2-2H5a2 2 0 0 1 0-4h14v4"/>
      <path d="M3 6v12a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2v-4"/>
      <circle cx="17" cy="14" r="1.4" fill={color}/>
    </svg>
  );
}

Object.assign(window, {
  CheckoutAddressScreen, CheckoutPaymentScreen, CheckoutBankScreen, CheckoutReviewScreen,
  CheckoutStepper, StickyAction, WalletIcon,
});
