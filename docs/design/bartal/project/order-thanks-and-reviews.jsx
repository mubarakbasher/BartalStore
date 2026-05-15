// order-thanks-and-reviews.jsx
// 1. WebOrderConfirm — thank-you page after checkout (Sudan bank-transfer flavor)
// 2. WebWriteReview  — desktop write-review page
// 3. MobileWriteReview — mobile write-review screen (used in all 3 mobile variations)

// ═══════════════════════════════════════════════════════════════
// WEB · ORDER CONFIRMATION (THANK YOU)
// ═══════════════════════════════════════════════════════════════
function WebOrderConfirm({ lang, dark }) {
  const isAr = lang === 'ar';
  const surface = dark ? '#132744' : '#fff';
  const bg = dark ? BARTAL.d_bg : '#FBFAF7';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const Row = ({ label, value, mono, copy }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '11px 0', borderBottom: `1px dashed ${line}`, gap: 12 }}>
      <div style={{ ...typeStyle(lang, 'small'), color: muted }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ ...typeStyle(lang, mono ? 'mono' : 'small'), color: text, fontWeight: 600 }}>{value}</div>
        {copy && (
          <div title="Copy" style={{
            width: 26, height: 26, borderRadius: 6, border: `1px solid ${line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            background: dark ? BARTAL.d_raised : '#F8F6F0',
          }}>
            <CopyIcon color={muted} size={13}/>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <WebShell lang={lang} dark={dark} breadcrumb={isAr ? 'الرئيسية / الدفع / تأكيد الطلب' : 'Home / Checkout / Confirmation'}>
      {/* hero */}
      <div style={{
        background: surface, border: `1px solid ${line}`, borderRadius: 16,
        padding: '36px 32px', display: 'flex', alignItems: 'center', gap: 24,
        marginBottom: 22, position: 'relative', overflow: 'hidden',
      }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: dark ? 0.07 : 0.05, pointerEvents: 'none' }}>
          <defs>
            <pattern id="thanks-mo" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
              <g stroke={BARTAL.amber} strokeWidth="1" fill="none">
                <path d="M32 6 L38 19 L51 13 L45 26 L58 32 L45 38 L51 51 L38 45 L32 58 L26 45 L13 51 L19 38 L6 32 L19 26 L13 13 L26 19 Z"/>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#thanks-mo)"/>
        </svg>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', background: BARTAL.success, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1,
          boxShadow: `0 8px 24px ${BARTAL.success}40`,
        }}>
          <CheckIcon color="#fff" size={40}/>
        </div>
        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <div style={{ ...typeStyle(lang, 'micro'), color: BARTAL.amber, marginBottom: 6 }}>
            {isAr ? 'شكراً لك يا محمد' : 'Thank you, Mohammed'}
          </div>
          <div style={{ ...typeStyle(lang, 'display', dark), fontSize: 30, marginBottom: 8 }}>
            {isAr ? 'تم استلام طلبك' : 'Your order is in.'}
          </div>
          <div style={{ ...typeStyle(lang, 'body'), color: muted, maxWidth: 600 }}>
            {isAr
              ? 'أرسلنا تأكيداً إلى بريدك الإلكتروني وعلى واتساب. أكمل التحويل البنكي أدناه ثم ارفع الإيصال — سنبدأ التحضير فور التحقق.'
              : 'A confirmation has been sent to your email and WhatsApp. Complete the bank transfer below, then upload the receipt — we’ll start preparing your order as soon as it’s verified.'}
          </div>
        </div>
        <div style={{ textAlign: isAr ? 'left' : 'right', position: 'relative', zIndex: 1 }}>
          <div style={{ ...typeStyle(lang, 'micro'), color: muted }}>{isAr ? 'رقم الطلب' : 'Order number'}</div>
          <div style={{ ...typeStyle(lang, 'mono'), color: text, fontSize: 18, fontWeight: 700, marginTop: 4 }}>
            BRT-2026-00842
          </div>
          <div style={{ ...typeStyle(lang, 'small'), color: muted, marginTop: 4 }}>
            {isAr ? '١٩ أبريل ٢٠٢٦ · ٢:١٤ م' : 'Apr 19, 2026 · 2:14 PM'}
          </div>
        </div>
      </div>

      {/* 2-col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        {/* LEFT — bank instructions + items */}
        <div>
          {/* Bank panel */}
          <div style={{
            background: BARTAL.amberTint, border: `1.5px solid ${BARTAL.amber}`, borderRadius: 14,
            padding: 22, marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ ...typeStyle(lang, 'micro'), color: BARTAL.amber }}>
                  {isAr ? 'الخطوة ١' : 'Step 1'}
                </div>
                <div style={{ ...typeStyle(lang, 'h2'), color: BARTAL.navyInk, marginTop: 2 }}>
                  {isAr ? 'حوّل المبلغ إلى الحساب التالي' : 'Transfer the amount to this account'}
                </div>
              </div>
              <div style={{
                background: '#fff', padding: '6px 12px', borderRadius: 100,
                ...typeStyle(lang, 'micro'), color: BARTAL.amber, border: `1px solid ${BARTAL.amber}`,
              }}>
                {isAr ? 'صالح ٢٤ ساعة' : 'Valid for 24h'}
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 10, padding: '6px 16px' }}>
              <Row label={isAr ? 'البنك' : 'Bank'} value={isAr ? 'بنك فيصل الإسلامي' : 'Faisal Islamic Bank'}/>
              <Row label={isAr ? 'اسم الحساب' : 'Account name'} value={isAr ? 'برتال للتجارة الإلكترونية' : 'Bartal E-Commerce Ltd.'}/>
              <Row label={isAr ? 'رقم الحساب' : 'Account number'} value="0012-345-678-9000" mono copy/>
              <Row label={isAr ? 'IBAN' : 'IBAN'} value="SD13 4567 8900 1234 5678 9000" mono copy/>
              <Row label={isAr ? 'المبلغ المستحق' : 'Amount due'}
                   value={<PriceTag amount={228000} lang={lang} size={15} color={BARTAL.amber}/>} copy/>
              <Row label={isAr ? 'مرجع التحويل' : 'Transfer reference'} value="BRT-2026-00842" mono copy/>
            </div>
            <div style={{
              marginTop: 12, padding: '10px 14px', background: '#fff7e6',
              border: `1px solid ${BARTAL.amber}`, borderRadius: 8,
              ...typeStyle(lang, 'small'), color: BARTAL.navyInk,
            }}>
              <strong>{isAr ? 'مهم: ' : 'Important: '}</strong>
              {isAr
                ? 'اكتب رقم الطلب في خانة "الملاحظات" حتى نتمكن من ربط التحويل بطلبك.'
                : 'Write the order number in the bank "notes" / "reference" field so we can match the transfer to your order.'}
            </div>
          </div>

          {/* Step 2 — upload */}
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 22, marginBottom: 16 }}>
            <div style={{ ...typeStyle(lang, 'micro'), color: BARTAL.amber }}>
              {isAr ? 'الخطوة ٢' : 'Step 2'}
            </div>
            <div style={{ ...typeStyle(lang, 'h2', dark), marginTop: 2, marginBottom: 12 }}>
              {isAr ? 'ارفع صورة إيصال التحويل' : 'Upload the transfer receipt'}
            </div>
            <div style={{
              border: `1.5px dashed ${line}`, borderRadius: 12,
              padding: '28px 20px', textAlign: 'center',
              background: dark ? BARTAL.d_raised : BARTAL.sand,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', background: BARTAL.amberTint,
                margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CameraIcon color={BARTAL.amber} size={26}/>
              </div>
              <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700, marginBottom: 4 }}>
                {isAr ? 'اسحب الإيصال هنا أو انقر للتصفح' : 'Drag receipt here or click to browse'}
              </div>
              <div style={{ ...typeStyle(lang, 'small'), color: muted }}>
                {isAr ? 'JPG, PNG, PDF — حتى ١٠ ميجابايت' : 'JPG, PNG, PDF — up to 10 MB'}
              </div>
              <button style={{
                marginTop: 14, background: BARTAL.amber, border: 'none', color: '#fff',
                padding: '10px 22px', borderRadius: 10, fontWeight: 700,
                ...typeStyle(lang, 'small'), color: '#fff', cursor: 'pointer',
              }}>
                {isAr ? 'اختر ملفاً' : 'Choose file'}
              </button>
            </div>
            <div style={{ ...typeStyle(lang, 'small'), color: muted, marginTop: 10, textAlign: 'center' }}>
              {isAr ? 'يمكنك أيضاً الرفع لاحقاً من صفحة الطلب' : 'You can also upload later from the order page'}
            </div>
          </div>

          {/* Items summary */}
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 22 }}>
            <div style={{ ...typeStyle(lang, 'h3', dark), marginBottom: 14 }}>
              {isAr ? 'ملخص الطلب' : 'Order summary'}
            </div>
            {CATALOG.slice(0, 2).map((p, i) => (
              <div key={p.id} style={{
                display: 'flex', gap: 14, paddingBottom: 14,
                borderBottom: i < 1 ? `1px solid ${line}` : 'none', marginBottom: i < 1 ? 14 : 0,
              }}>
                <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                  <ProductPlaceholder label={p.name_en} hue={p.hue}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...typeStyle(lang, 'micro'), color: muted }}>{p.brand}</div>
                  <div style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: 600 }}>
                    {isAr ? p.name_ar : p.name_en}
                  </div>
                  <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginTop: 2 }}>
                    {isAr ? 'الكمية: ١' : 'Qty: 1'}
                  </div>
                </div>
                <PriceTag amount={p.price} lang={lang} size={14}/>
              </div>
            ))}
            <div style={{ paddingTop: 12, borderTop: `1px solid ${line}`, marginTop: 4 }}>
              {[
                [isAr ? 'المجموع الفرعي' : 'Subtotal', 227000],
                [isAr ? 'التوصيل · وسط الخرطوم' : 'Delivery · Central Khartoum', 1000],
              ].map(([lbl, amt], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <div style={{ ...typeStyle(lang, 'small'), color: muted }}>{lbl}</div>
                  <PriceTag amount={amt} lang={lang} size={13} strong={false}/>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, marginTop: 6, borderTop: `1px solid ${line}` }}>
                <div style={{ ...typeStyle(lang, 'h3', dark) }}>{isAr ? 'الإجمالي' : 'Total'}</div>
                <PriceTag amount={228000} lang={lang} size={18} color={BARTAL.amber}/>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — what happens next + delivery + actions */}
        <div>
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 22, marginBottom: 16 }}>
            <div style={{ ...typeStyle(lang, 'h3', dark), marginBottom: 14 }}>
              {isAr ? 'ماذا يحدث بعد ذلك؟' : 'What happens next'}
            </div>
            {[
              { ar: 'حوّل المبلغ من تطبيق البنك', en: 'Transfer the amount from your bank app', t: isAr ? 'الآن' : 'Now', done: false, current: true },
              { ar: 'ارفع صورة الإيصال', en: 'Upload the receipt photo', t: isAr ? 'بعد التحويل' : 'After transfer' },
              { ar: 'سنتحقق من التحويل', en: 'We verify the transfer', t: isAr ? '٢–٤ ساعات' : '2–4 hours' },
              { ar: 'نحضّر الطلب', en: 'We prepare your order', t: isAr ? 'يوم العمل التالي' : 'Next business day' },
              { ar: 'يصل إلى بابك', en: 'Delivered to your door', t: isAr ? '٢–٣ أيام' : '2–3 days' },
            ].map((s, i, arr) => (
              <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: i < arr.length - 1 ? 12 : 0, position: 'relative' }}>
                {i < arr.length - 1 && (
                  <div style={{ position: 'absolute', insetInlineStart: 11, top: 22, bottom: -2, width: 2, background: line }}/>
                )}
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: s.current ? BARTAL.amber : (dark ? BARTAL.d_raised : BARTAL.sand),
                  border: s.current ? 'none' : `2px solid ${line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  ...typeStyle(lang, 'micro'), color: s.current ? '#fff' : muted, letterSpacing: 0,
                  fontWeight: 700,
                }}>
                  {i + 1}
                </div>
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

          {/* Delivery address card */}
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 22, marginBottom: 16 }}>
            <div style={{ ...typeStyle(lang, 'h3', dark), marginBottom: 10 }}>
              {isAr ? 'التوصيل إلى' : 'Delivering to'}
            </div>
            <div style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: 600 }}>
              {isAr ? 'محمد عثمان' : 'Mohammed Osman'}
            </div>
            <div style={{ ...typeStyle(lang, 'small'), color: muted, marginTop: 4, lineHeight: 1.6 }}>
              {isAr
                ? 'الخرطوم ٢ — شارع المعونة — مربع ١٤ — منزل ٢٧ بجوار مسجد الفتح، البوابة الزرقاء'
                : 'Khartoum 2 — Al-Maouna St. — Block 14, House 27 Near Al-Fateh mosque, blue gate'}
            </div>
            <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginTop: 8 }}>
              {isAr ? 'الهاتف: ' : 'Phone: '} <span style={{ ...typeStyle(lang, 'mono') }}>+249 91 234 5678</span>
            </div>
          </div>

          {/* Action stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button style={{
              background: BARTAL.navy, color: '#fff', border: 'none', borderRadius: 10,
              padding: '12px', fontWeight: 700, cursor: 'pointer',
              ...typeStyle(lang, 'small'), color: '#fff',
            }}>
              {isAr ? 'تتبع طلبي' : 'Track my order'}
            </button>
            <button style={{
              background: 'transparent', color: text, border: `1px solid ${line}`, borderRadius: 10,
              padding: '11px', fontWeight: 600, cursor: 'pointer',
              ...typeStyle(lang, 'small'), color: text,
            }}>
              {isAr ? 'متابعة التسوق' : 'Continue shopping'}
            </button>
            <button style={{
              background: 'transparent', color: muted, border: 'none',
              padding: '8px', fontWeight: 500, cursor: 'pointer',
              ...typeStyle(lang, 'small'), color: muted,
            }}>
              {isAr ? '⤓ تنزيل الفاتورة (PDF)' : '⤓ Download invoice (PDF)'}
            </button>
          </div>
        </div>
      </div>
    </WebShell>
  );
}

// ═══════════════════════════════════════════════════════════════
// WEB · WRITE REVIEW
// ═══════════════════════════════════════════════════════════════
function WebWriteReview({ lang, dark }) {
  const isAr = lang === 'ar';
  const surface = dark ? '#132744' : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;
  const product = CATALOG[1]; // Royal Oud
  const [stars, setStars] = React.useState(5);
  const [hover, setHover] = React.useState(0);
  const [body, setBody] = React.useState(isAr
    ? 'رائحة فاخرة ودائمة. التغليف ممتاز ووصل بسرعة إلى الخرطوم. سأطلب مرة أخرى بالتأكيد.'
    : 'Beautiful, long-lasting scent. Excellent packaging and arrived in Khartoum quickly. Will absolutely re-order.');
  const [tags, setTags] = React.useState([0, 2]);
  const TAG_OPTS = [
    { ar: 'رائحة قوية', en: 'Strong scent' },
    { ar: 'يدوم طويلاً', en: 'Long lasting' },
    { ar: 'تغليف فاخر', en: 'Premium packaging' },
    { ar: 'سعر ممتاز', en: 'Great price' },
    { ar: 'توصيل سريع', en: 'Fast delivery' },
    { ar: 'مطابق للوصف', en: 'As described' },
  ];

  return (
    <WebShell lang={lang} dark={dark}
              breadcrumb={isAr ? 'الرئيسية / حسابي / الطلبات / BRT-2026-00842 / كتابة تقييم' : 'Home / Account / Orders / BRT-2026-00842 / Write review'}>
      <div style={{ ...typeStyle(lang, 'h1', dark), marginBottom: 6 }}>
        {isAr ? 'كتابة تقييم' : 'Write a review'}
      </div>
      <div style={{ ...typeStyle(lang, 'small'), color: muted, marginBottom: 22 }}>
        {isAr ? 'سيظهر تقييمك مع علامة "مشتر موثّق" للعملاء الآخرين.' : 'Your review will appear with a "Verified buyer" badge for other shoppers.'}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* form */}
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 28 }}>
          {/* product */}
          <div style={{ display: 'flex', gap: 14, paddingBottom: 22, borderBottom: `1px solid ${line}`, marginBottom: 22 }}>
            <div style={{ width: 72, height: 72, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
              <ProductPlaceholder label={product.name_en} hue={product.hue}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...typeStyle(lang, 'micro'), color: muted }}>{product.brand}</div>
              <div style={{ ...typeStyle(lang, 'h3', dark), marginTop: 2 }}>
                {isAr ? product.name_ar : product.name_en}
              </div>
              <div style={{ ...typeStyle(lang, 'micro'), color: BARTAL.success, marginTop: 6, textTransform: 'none', letterSpacing: 0 }}>
                ✓ {isAr ? 'مشتر موثّق · طلب BRT-2026-00842' : 'Verified buyer · order BRT-2026-00842'}
              </div>
            </div>
          </div>

          {/* stars */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ ...typeStyle(lang, 'label', dark), marginBottom: 8 }}>
              {isAr ? 'تقييمك العام' : 'Your overall rating'}
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {[1,2,3,4,5].map(n => (
                <div key={n}
                     onClick={() => setStars(n)}
                     onMouseEnter={() => setHover(n)}
                     onMouseLeave={() => setHover(0)}
                     style={{ cursor: 'pointer', padding: 2 }}>
                  <StarIcon color={(hover || stars) >= n ? BARTAL.amber : (dark ? BARTAL.d_line : '#E0DBC9')} size={32}/>
                </div>
              ))}
              <div style={{ ...typeStyle(lang, 'small'), color: text, marginInlineStart: 12, fontWeight: 600 }}>
                {[
                  '',
                  isAr ? 'سيء' : 'Poor',
                  isAr ? 'مقبول' : 'Fair',
                  isAr ? 'جيد' : 'Good',
                  isAr ? 'جيد جداً' : 'Very good',
                  isAr ? 'ممتاز' : 'Excellent',
                ][hover || stars]}
              </div>
            </div>
          </div>

          {/* tags */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ ...typeStyle(lang, 'label', dark), marginBottom: 8 }}>
              {isAr ? 'ما الذي أعجبك؟ (اختياري)' : 'What did you like? (optional)'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TAG_OPTS.map((tag, i) => {
                const on = tags.includes(i);
                return (
                  <div key={i}
                       onClick={() => setTags(on ? tags.filter(x => x !== i) : [...tags, i])}
                       style={{
                    padding: '8px 14px', borderRadius: 100, cursor: 'pointer',
                    background: on ? BARTAL.navy : (dark ? BARTAL.d_raised : BARTAL.sand),
                    color: on ? '#fff' : (dark ? BARTAL.d_text : text),
                    border: `1px solid ${on ? BARTAL.navy : line}`,
                    ...typeStyle(lang, 'small'), color: on ? '#fff' : (dark ? BARTAL.d_text : text),
                    fontWeight: 500,
                  }}>
                    {on ? '✓ ' : ''}{tag[lang]}
                  </div>
                );
              })}
            </div>
          </div>

          {/* title */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...typeStyle(lang, 'label', dark), marginBottom: 8 }}>
              {isAr ? 'عنوان التقييم' : 'Review title'}
            </div>
            <input defaultValue={isAr ? 'عود فاخر، أنصح به' : 'Premium oud, highly recommend'}
                   style={{
              width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${line}`,
              background: dark ? BARTAL.d_bg : '#fff', color: text,
              ...typeStyle(lang, 'body'), color: text,
              fontFamily: isAr ? "'Cairo'" : "'Poppins'", outline: 'none',
            }}/>
          </div>

          {/* body */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ ...typeStyle(lang, 'label', dark) }}>{isAr ? 'تفاصيل التقييم' : 'Review details'}</div>
              <div style={{ ...typeStyle(lang, 'micro'), color: muted }}>{body.length} / 500</div>
            </div>
            <textarea value={body} onChange={e => setBody(e.target.value)}
                      style={{
              width: '100%', minHeight: 120, padding: '12px 14px', borderRadius: 10,
              border: `1px solid ${line}`, background: dark ? BARTAL.d_bg : '#fff', color: text,
              ...typeStyle(lang, 'body'), color: text,
              fontFamily: isAr ? "'Cairo'" : "'Poppins'", resize: 'vertical', outline: 'none',
            }}/>
          </div>

          {/* photo upload */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ ...typeStyle(lang, 'label', dark), marginBottom: 8 }}>
              {isAr ? 'أضف صوراً (اختياري · حتى ٤)' : 'Add photos (optional · up to 4)'}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: 80, height: 80, borderRadius: 10, overflow: 'hidden',
                  border: `1px solid ${line}`, position: 'relative',
                }}>
                  <ProductPlaceholder label={`photo ${i+1}`} hue={['warm','amber','rose'][i]}/>
                </div>
              ))}
              <div style={{
                width: 80, height: 80, borderRadius: 10,
                border: `1.5px dashed ${line}`, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                background: dark ? BARTAL.d_raised : BARTAL.sand,
              }}>
                <div style={{ fontSize: 24, color: muted, lineHeight: 1 }}>+</div>
                <div style={{ ...typeStyle(lang, 'micro'), color: muted, letterSpacing: 0, textTransform: 'none' }}>
                  {isAr ? 'إضافة' : 'Add'}
                </div>
              </div>
            </div>
          </div>

          {/* anonymous toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                        background: dark ? BARTAL.d_raised : BARTAL.sand, borderRadius: 10, marginBottom: 22 }}>
            <div style={{
              width: 36, height: 20, borderRadius: 10, padding: 2,
              background: 'rgba(27,58,107,0.2)', position: 'relative', flexShrink: 0,
            }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff' }}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: 600 }}>
                {isAr ? 'انشر بدون اسم' : 'Post anonymously'}
              </div>
              <div style={{ ...typeStyle(lang, 'micro'), color: muted, letterSpacing: 0, textTransform: 'none', marginTop: 2 }}>
                {isAr ? 'سيظهر اسمك كـ "زبون موثّق"' : 'Your name will appear as "Verified shopper"'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{
              background: BARTAL.amber, color: '#fff', border: 'none', borderRadius: 10,
              padding: '13px 28px', fontWeight: 700, cursor: 'pointer',
              ...typeStyle(lang, 'small'), color: '#fff',
            }}>
              {isAr ? 'نشر التقييم' : 'Submit review'}
            </button>
            <button style={{
              background: 'transparent', color: text, border: `1px solid ${line}`, borderRadius: 10,
              padding: '13px 22px', fontWeight: 600, cursor: 'pointer',
              ...typeStyle(lang, 'small'), color: text,
            }}>
              {isAr ? 'حفظ كمسودة' : 'Save draft'}
            </button>
          </div>
        </div>

        {/* aside — guidelines */}
        <aside>
          <div style={{ background: BARTAL.amberTint, border: `1px solid ${BARTAL.amber}40`, borderRadius: 14,
                        padding: 18, marginBottom: 14 }}>
            <div style={{ ...typeStyle(lang, 'micro'), color: BARTAL.amber, marginBottom: 6 }}>
              {isAr ? 'إرشادات' : 'Guidelines'}
            </div>
            <div style={{ ...typeStyle(lang, 'h3'), color: BARTAL.navyInk, marginBottom: 10 }}>
              {isAr ? 'تقييمات تفيد الآخرين' : 'Reviews that help others'}
            </div>
            <ul style={{ paddingInlineStart: 18, margin: 0, ...typeStyle(lang, 'small'), color: BARTAL.navyInk, lineHeight: 1.8 }}>
              <li>{isAr ? 'كن صادقاً وموضوعياً' : 'Be honest and objective'}</li>
              <li>{isAr ? 'تكلم عن جودة المنتج وتجربتك معه' : 'Talk about quality and your experience'}</li>
              <li>{isAr ? 'تجنّب المعلومات الشخصية' : 'Avoid sharing personal information'}</li>
              <li>{isAr ? 'لا للغة المسيئة أو الترويج' : 'No abusive language or promotions'}</li>
            </ul>
          </div>
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 18 }}>
            <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginBottom: 6 }}>
              {isAr ? 'كم من الوقت سيستغرق ظهور التقييم؟' : 'When will my review appear?'}
            </div>
            <div style={{ ...typeStyle(lang, 'small'), color: text, lineHeight: 1.6 }}>
              {isAr
                ? 'يمر التقييم بمراجعة سريعة (عادةً أقل من ٢٤ ساعة) للتأكد من اتباع الإرشادات.'
                : 'Reviews go through a quick check (usually under 24 hours) to make sure they follow our guidelines.'}
            </div>
          </div>
        </aside>
      </div>
    </WebShell>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOBILE · WRITE REVIEW
// ═══════════════════════════════════════════════════════════════
function MobileWriteReview({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;
  const product = CATALOG[1];
  const [stars, setStars] = React.useState(5);
  const [body] = React.useState(isAr
    ? 'رائحة فاخرة ودائمة. التغليف ممتاز ووصل بسرعة.'
    : 'Beautiful, long-lasting scent. Packaging was excellent.');

  const TAG_OPTS = [
    { ar: 'يدوم طويلاً', en: 'Long lasting' },
    { ar: 'رائحة قوية', en: 'Strong scent' },
    { ar: 'تغليف فاخر', en: 'Premium packaging' },
    { ar: 'توصيل سريع', en: 'Fast delivery' },
  ];
  const [picked, setPicked] = React.useState([0, 2]);

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 120 }}>
      <ScreenHeader title={isAr ? 'كتابة تقييم' : 'Write a review'} onBack={onBack} lang={lang} dark={dark}/>

      {/* product card */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{
          background: surface, border: `1px solid ${line}`, borderRadius: 14,
          padding: 14, display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
            <ProductPlaceholder label={product.name_en} hue={product.hue}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...typeStyle(lang, 'micro'), color: muted }}>{product.brand}</div>
            <div style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: 600 }}>
              {isAr ? product.name_ar : product.name_en}
            </div>
            <div style={{ ...typeStyle(lang, 'micro'), color: BARTAL.success, marginTop: 4, textTransform: 'none', letterSpacing: 0 }}>
              ✓ {isAr ? 'مشتر موثّق' : 'Verified buyer'}
            </div>
          </div>
        </div>
      </div>

      {/* stars */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{
          background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 18, textAlign: 'center',
        }}>
          <div style={{ ...typeStyle(lang, 'small'), color: muted, marginBottom: 10 }}>
            {isAr ? 'تقييمك' : 'Your rating'}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 10 }}>
            {[1,2,3,4,5].map(n => (
              <div key={n} onClick={() => setStars(n)} style={{ padding: 4, cursor: 'pointer' }}>
                <StarIcon color={stars >= n ? BARTAL.amber : (dark ? BARTAL.d_line : '#E0DBC9')} size={32}/>
              </div>
            ))}
          </div>
          <div style={{ ...typeStyle(lang, 'label'), color: BARTAL.amber, fontWeight: 700 }}>
            {[
              '',
              isAr ? 'سيء' : 'Poor',
              isAr ? 'مقبول' : 'Fair',
              isAr ? 'جيد' : 'Good',
              isAr ? 'جيد جداً' : 'Very good',
              isAr ? 'ممتاز' : 'Excellent',
            ][stars]}
          </div>
        </div>
      </div>

      {/* tags */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{
          background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 14,
        }}>
          <div style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: 600, marginBottom: 10 }}>
            {isAr ? 'ما أعجبك؟' : 'What stood out?'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {TAG_OPTS.map((tag, i) => {
              const on = picked.includes(i);
              return (
                <div key={i} onClick={() => setPicked(on ? picked.filter(x => x !== i) : [...picked, i])}
                     style={{
                  padding: '6px 12px', borderRadius: 100,
                  background: on ? BARTAL.navy : (dark ? BARTAL.d_raised : BARTAL.sand),
                  color: on ? '#fff' : text,
                  border: `1px solid ${on ? BARTAL.navy : line}`,
                  ...typeStyle(lang, 'micro'), color: on ? '#fff' : text, letterSpacing: 0, textTransform: 'none',
                  fontWeight: 600,
                }}>
                  {on ? '✓ ' : ''}{tag[lang]}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{
          background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 14,
        }}>
          <div style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: 600, marginBottom: 8 }}>
            {isAr ? 'تفاصيل (اختياري)' : 'Details (optional)'}
          </div>
          <div style={{
            background: dark ? BARTAL.d_bg : '#FBFAF7', borderRadius: 10, padding: 12,
            ...typeStyle(lang, 'body'), color: text, minHeight: 80, lineHeight: 1.5,
          }}>
            {body}
          </div>
        </div>
      </div>

      {/* photo */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{
          background: surface, border: `1px solid ${line}`, borderRadius: 14, padding: 14,
        }}>
          <div style={{ ...typeStyle(lang, 'small'), color: text, fontWeight: 600, marginBottom: 10 }}>
            {isAr ? 'إضافة صورة' : 'Add a photo'}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[0,1].map(i => (
              <div key={i} style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden' }}>
                <ProductPlaceholder label={`photo ${i+1}`} hue={['amber','rose'][i]}/>
              </div>
            ))}
            <div style={{
              width: 64, height: 64, borderRadius: 10, border: `1.5px dashed ${line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: dark ? BARTAL.d_raised : BARTAL.sand,
              fontSize: 24, color: muted, lineHeight: 1,
            }}>+</div>
          </div>
        </div>
      </div>

      {/* footer button */}
      <div style={{
        position: 'absolute', bottom: 0, insetInlineStart: 0, insetInlineEnd: 0,
        padding: '12px 16px', background: surface, borderTop: `1px solid ${line}`,
      }}>
        <button onClick={() => onNav && onNav('orders')} style={{
          width: '100%', background: BARTAL.amber, color: '#fff', border: 'none',
          borderRadius: 12, padding: 14, fontWeight: 700, cursor: 'pointer',
          ...typeStyle(lang, 'label'), color: '#fff',
        }}>
          {isAr ? 'نشر التقييم' : 'Submit review'}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { WebOrderConfirm, WebWriteReview, MobileWriteReview });
