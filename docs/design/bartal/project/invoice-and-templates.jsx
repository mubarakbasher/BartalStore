// invoice-and-templates.jsx
// 1. WebInvoicePrint  — print-ready invoice + packing slip (web tab, A4-ish)
// 2. AdminTemplates   — email + WhatsApp + SMS message template gallery (admin)

// ═══════════════════════════════════════════════════════════════
// PRINT INVOICE / PACKING SLIP
// ═══════════════════════════════════════════════════════════════
function WebInvoicePrint({ lang, dark }) {
  const isAr = lang === 'ar';
  const muted = '#6B6356';
  const text = '#1A1A1A';
  const line = '#E8E2D5';

  const Items = [
    { sku: 'AJM-OUD-3ML', name_ar: 'دهن العود الملكي', name_en: 'Royal Oud Perfume Oil', qty: 1, price: 42000 },
    { sku: 'ANK-WHP-PRO', name_ar: 'سماعات لاسلكية برو', name_en: 'Wireless Pro Headphones', qty: 1, price: 185000 },
  ];
  const subtotal = Items.reduce((a, i) => a + i.price * i.qty, 0);
  const delivery = 1000;
  const total = subtotal + delivery;

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{
      width: '100%', height: '100%', background: '#E8E2D5', overflow: 'auto', padding: '24px 0',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
    }}>
      {/* Toolbar */}
      <div style={{ maxWidth: 820, margin: '0 auto 14px', display: 'flex', alignItems: 'center', gap: 10, padding: '0 24px' }}>
        <div style={{ flex: 1, fontSize: 13, color: '#1B3A6B', fontWeight: 600 }}>
          {isAr ? 'فاتورة وقسيمة تعبئة — جاهزة للطباعة (A4)' : 'Invoice + Packing slip — print ready (A4)'}
        </div>
        <button style={{
          background: '#1B3A6B', color: '#fff', border: 'none', borderRadius: 8,
          padding: '8px 16px', fontWeight: 700, fontSize: 12, cursor: 'pointer',
          fontFamily: 'inherit',
        }}>⎙ {isAr ? 'طباعة' : 'Print'}</button>
        <button style={{
          background: '#fff', color: '#1B3A6B', border: '1px solid #1B3A6B', borderRadius: 8,
          padding: '8px 16px', fontWeight: 700, fontSize: 12, cursor: 'pointer',
          fontFamily: 'inherit',
        }}>⤓ {isAr ? 'PDF' : 'Download PDF'}</button>
      </div>

      {/* Page 1 — Invoice */}
      <div style={{
        width: 820, margin: '0 auto 24px', background: '#fff', color: text,
        boxShadow: '0 6px 24px rgba(0,0,0,0.12)', padding: '40px 48px 36px',
        position: 'relative', minHeight: 1080,
      }}>
        {/* watermark */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none', display: 'flex',
                      alignItems: 'center', justifyContent: 'center' }}>
          <svg width="380" height="380" viewBox="0 0 32 32">
            <path d="M16 2 L20 12 L30 12 L22 18 L26 28 L16 22 L6 28 L10 18 L2 12 L12 12 Z" fill="#1B3A6B"/>
          </svg>
        </div>

        <div style={{ position: 'relative' }}>
          {/* header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <BartalLogo color="#1B3A6B" accent="#D4860B" size={28} lang={lang}/>
              <div style={{ fontSize: 11, color: muted, marginTop: 8, lineHeight: 1.6 }}>
                {isAr ? 'برتال للتجارة الإلكترونية المحدودة' : 'Bartal E-Commerce Ltd.'}<br/>
                {isAr ? 'الخرطوم — السودان' : 'Khartoum — Sudan'}<br/>
                {isAr ? 'الرقم الضريبي: ' : 'Tax ID: '}<span style={{ fontFamily: "'JetBrains Mono', monospace" }}>SDN-44-1289</span>
              </div>
            </div>
            <div style={{ textAlign: isAr ? 'left' : 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#1B3A6B', letterSpacing: 1, marginBottom: 6 }}>
                {isAr ? 'فاتورة' : 'INVOICE'}
              </div>
              <div style={{ fontSize: 11, color: muted, lineHeight: 1.6 }}>
                <div><span style={{ display: 'inline-block', minWidth: 90, color: '#888' }}>{isAr ? 'الرقم' : 'Invoice #'}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: text }}>BRT-2026-00842</span></div>
                <div><span style={{ display: 'inline-block', minWidth: 90, color: '#888' }}>{isAr ? 'التاريخ' : 'Date'}</span>
                  {isAr ? '١٩ أبريل ٢٠٢٦' : 'Apr 19, 2026'}</div>
                <div><span style={{ display: 'inline-block', minWidth: 90, color: '#888' }}>{isAr ? 'الاستحقاق' : 'Due'}</span>
                  {isAr ? '٢٠ أبريل ٢٠٢٦' : 'Apr 20, 2026'}</div>
              </div>
            </div>
          </div>

          {/* parties */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32,
                        padding: 18, background: '#FBFAF7', borderRadius: 8, border: `1px solid ${line}` }}>
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', color: muted, letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
                {isAr ? 'الزبون' : 'Bill to'}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                {isAr ? 'محمد عثمان' : 'Mohammed Osman'}
              </div>
              <div style={{ fontSize: 11, color: muted, lineHeight: 1.6 }}>
                {isAr ? 'الخرطوم ٢ — شارع المعونة' : 'Khartoum 2 — Al-Maouna St.'}<br/>
                {isAr ? 'مربع ١٤، منزل ٢٧' : 'Block 14, House 27'}<br/>
                <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>+249 91 234 5678</span><br/>
                mo@example.sd
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', color: muted, letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
                {isAr ? 'الدفع' : 'Payment'}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                {isAr ? 'تحويل بنكي · بنك فيصل الإسلامي' : 'Bank transfer · Faisal Islamic'}
              </div>
              <div style={{ fontSize: 11, color: muted, lineHeight: 1.6 }}>
                {isAr ? 'الحساب: ' : 'Account: '}<span style={{ fontFamily: "'JetBrains Mono', monospace" }}>0012-345-678-9000</span><br/>
                {isAr ? 'المرجع: ' : 'Reference: '}<span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: text }}>BRT-2026-00842</span><br/>
                <span style={{ display: 'inline-block', padding: '2px 8px', background: '#E5F4E8', color: '#2E7D32',
                               borderRadius: 4, fontWeight: 600, marginTop: 4 }}>
                  ✓ {isAr ? 'تم التحقق' : 'Verified'}
                </span>
              </div>
            </div>
          </div>

          {/* line items */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
            <thead>
              <tr style={{ background: '#1B3A6B', color: '#fff' }}>
                <th style={{ padding: '10px 12px', textAlign: isAr ? 'right' : 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  {isAr ? 'الصنف' : 'Item'}
                </th>
                <th style={{ padding: '10px 12px', textAlign: isAr ? 'right' : 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, width: 110 }}>SKU</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, width: 50 }}>
                  {isAr ? 'الكمية' : 'Qty'}
                </th>
                <th style={{ padding: '10px 12px', textAlign: isAr ? 'left' : 'right', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, width: 110 }}>
                  {isAr ? 'السعر' : 'Price'}
                </th>
                <th style={{ padding: '10px 12px', textAlign: isAr ? 'left' : 'right', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, width: 130 }}>
                  {isAr ? 'الإجمالي' : 'Total'}
                </th>
              </tr>
            </thead>
            <tbody>
              {Items.map((it, i) => (
                <tr key={it.sku} style={{ borderBottom: `1px solid ${line}` }}>
                  <td style={{ padding: '14px 12px', fontSize: 13, fontWeight: 500 }}>
                    {isAr ? it.name_ar : it.name_en}
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: 11, color: muted, fontFamily: "'JetBrains Mono', monospace" }}>{it.sku}</td>
                  <td style={{ padding: '14px 12px', textAlign: 'center', fontSize: 13 }}>{it.qty}</td>
                  <td style={{ padding: '14px 12px', textAlign: isAr ? 'left' : 'right', fontSize: 13 }}>
                    <PriceTag amount={it.price} lang={lang} size={12} strong={false}/>
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: isAr ? 'left' : 'right', fontSize: 13, fontWeight: 600 }}>
                    <PriceTag amount={it.price * it.qty} lang={lang} size={12}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
            <div style={{ width: 320 }}>
              {[
                [isAr ? 'المجموع الفرعي' : 'Subtotal', subtotal],
                [isAr ? 'التوصيل · وسط الخرطوم' : 'Delivery · Central Khartoum', delivery],
                [isAr ? 'الضريبة (٠٪)' : 'VAT (0%)', 0],
              ].map(([lbl, amt], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0',
                                       fontSize: 12, color: muted }}>
                  <div>{lbl}</div>
                  <PriceTag amount={amt} lang={lang} size={12} strong={false}/>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0',
                            borderTop: `2px solid #1B3A6B`, marginTop: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1B3A6B' }}>
                  {isAr ? 'الإجمالي المستحق' : 'Total due'}
                </div>
                <PriceTag amount={total} lang={lang} size={16} color="#D4860B"/>
              </div>
            </div>
          </div>

          {/* notes / footer */}
          <div style={{ borderTop: `1px solid ${line}`, paddingTop: 16, marginTop: 16,
                        display: 'flex', justifyContent: 'space-between', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', color: muted, letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
                {isAr ? 'ملاحظات' : 'Notes'}
              </div>
              <div style={{ fontSize: 11, color: muted, lineHeight: 1.6 }}>
                {isAr
                  ? 'شكراً لتسوقك في برتال. للاستفسارات: support@bartal.sd · واتساب 0091 234 5678'
                  : 'Thank you for shopping with Bartal. Questions? support@bartal.sd · WhatsApp 0091 234 5678'}
              </div>
            </div>
            {/* QR placeholder */}
            <div style={{ width: 76, height: 76, background: '#000', position: 'relative', flexShrink: 0 }}>
              <svg viewBox="0 0 11 11" width="76" height="76" style={{ display: 'block' }}>
                {Array.from({length: 11}).flatMap((_,r)=>Array.from({length: 11}).map((_,c)=>{
                  const v = (r*7 + c*13 + r*c) % 5;
                  if (v === 0) return null;
                  return <rect key={r+'-'+c} x={c} y={r} width="1" height="1" fill="#fff"/>;
                }))}
                <rect x="0" y="0" width="3" height="3" fill="#fff"/>
                <rect x="1" y="1" width="1" height="1" fill="#000"/>
                <rect x="8" y="0" width="3" height="3" fill="#fff"/>
                <rect x="9" y="1" width="1" height="1" fill="#000"/>
                <rect x="0" y="8" width="3" height="3" fill="#fff"/>
                <rect x="1" y="9" width="1" height="1" fill="#000"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Page 2 — Packing slip */}
      <div style={{
        width: 820, margin: '0 auto', background: '#fff', color: text,
        boxShadow: '0 6px 24px rgba(0,0,0,0.12)', padding: '36px 48px',
        minHeight: 720,
      }}>
        {/* dashed perforation */}
        <div style={{ borderBottom: `2px dashed ${line}`, paddingBottom: 12, marginBottom: 18,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1B3A6B', letterSpacing: 1 }}>
              {isAr ? 'قسيمة تعبئة' : 'PACKING SLIP'}
            </div>
            <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>
              {isAr ? 'لمستودع برتال — اقتطع من هنا' : 'For Bartal warehouse — cut along dashed line'}
            </div>
          </div>
          <div style={{ textAlign: isAr ? 'left' : 'right' }}>
            <div style={{ fontSize: 11, color: muted }}>{isAr ? 'الطلب' : 'Order'}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 16 }}>BRT-2026-00842</div>
          </div>
        </div>

        {/* delivery + ship-from */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 200px', gap: 16, marginBottom: 22 }}>
          <div style={{ padding: 14, border: `1px solid ${line}`, borderRadius: 6 }}>
            <div style={{ fontSize: 9, textTransform: 'uppercase', color: muted, letterSpacing: 1, marginBottom: 6, fontWeight: 700 }}>
              {isAr ? 'الشحن من' : 'Ship from'}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>
              {isAr ? 'مستودع برتال — الخرطوم' : 'Bartal Warehouse — Khartoum'}
            </div>
            <div style={{ fontSize: 11, color: muted, marginTop: 4, lineHeight: 1.6 }}>
              {isAr ? 'الصناعية، شارع المعمل ١١' : 'Industrial Area, Maamal St. 11'}
            </div>
          </div>
          <div style={{ padding: 14, border: `2px solid #1B3A6B`, borderRadius: 6, background: '#FBFAF7' }}>
            <div style={{ fontSize: 9, textTransform: 'uppercase', color: '#1B3A6B', letterSpacing: 1, marginBottom: 6, fontWeight: 700 }}>
              {isAr ? 'الشحن إلى' : 'Ship to'}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>
              {isAr ? 'محمد عثمان' : 'Mohammed Osman'}
            </div>
            <div style={{ fontSize: 11, color: muted, marginTop: 4, lineHeight: 1.6 }}>
              {isAr ? 'الخرطوم ٢ — شارع المعونة' : 'Khartoum 2 — Al-Maouna St.'}<br/>
              {isAr ? 'مربع ١٤، منزل ٢٧' : 'Block 14, House 27'}<br/>
              {isAr ? 'بجوار مسجد الفتح، البوابة الزرقاء' : 'Near Al-Fateh mosque, blue gate'}<br/>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: text }}>+249 91 234 5678</span>
            </div>
          </div>
          {/* Barcode */}
          <div style={{ padding: 14, border: `1px solid ${line}`, borderRadius: 6, textAlign: 'center' }}>
            <div style={{ fontSize: 9, textTransform: 'uppercase', color: muted, letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>
              {isAr ? 'الباركود' : 'Tracking'}
            </div>
            <svg viewBox="0 0 100 30" width="160" height="48" style={{ display: 'block', margin: '0 auto' }}>
              {[2,1,3,1,2,2,1,4,1,2,3,1,2,1,3,2,1,2,4,1,2,1,3,1,2,2,1,3].map((w, i, arr) => {
                const x = arr.slice(0, i).reduce((a, b) => a + b, 0);
                return i % 2 === 0
                  ? <rect key={i} x={x} y="0" width={w} height="30" fill="#000"/>
                  : null;
              })}
            </svg>
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", marginTop: 6, color: text }}>
              BRT-2026-00842
            </div>
          </div>
        </div>

        {/* checklist */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 18 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid #1B3A6B` }}>
              <th style={{ padding: '8px 10px', textAlign: 'center', fontSize: 10, color: muted, textTransform: 'uppercase', letterSpacing: 0.8, width: 36 }}>
                {isAr ? '✓' : 'Pick'}
              </th>
              <th style={{ padding: '8px 10px', textAlign: isAr ? 'right' : 'left', fontSize: 10, color: muted, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                {isAr ? 'الصنف' : 'Item'}
              </th>
              <th style={{ padding: '8px 10px', textAlign: isAr ? 'right' : 'left', fontSize: 10, color: muted, textTransform: 'uppercase', letterSpacing: 0.8, width: 110 }}>SKU</th>
              <th style={{ padding: '8px 10px', textAlign: isAr ? 'right' : 'left', fontSize: 10, color: muted, textTransform: 'uppercase', letterSpacing: 0.8, width: 100 }}>
                {isAr ? 'الموقع' : 'Bin'}
              </th>
              <th style={{ padding: '8px 10px', textAlign: 'center', fontSize: 10, color: muted, textTransform: 'uppercase', letterSpacing: 0.8, width: 50 }}>
                {isAr ? 'الكمية' : 'Qty'}
              </th>
            </tr>
          </thead>
          <tbody>
            {Items.map((it, i) => (
              <tr key={it.sku} style={{ borderBottom: `1px solid ${line}` }}>
                <td style={{ padding: '14px 10px', textAlign: 'center' }}>
                  <div style={{ width: 18, height: 18, border: `2px solid ${text}`, borderRadius: 3, margin: '0 auto' }}/>
                </td>
                <td style={{ padding: '14px 10px', fontSize: 13, fontWeight: 500 }}>
                  {isAr ? it.name_ar : it.name_en}
                </td>
                <td style={{ padding: '14px 10px', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: muted }}>{it.sku}</td>
                <td style={{ padding: '14px 10px', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                  {['B-12-04', 'A-03-11'][i]}
                </td>
                <td style={{ padding: '14px 10px', textAlign: 'center', fontSize: 14, fontWeight: 700 }}>{it.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* sign-off */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 32 }}>
          {[
            { ar: 'تم التعبئة', en: 'Packed by' },
            { ar: 'تم التحقق', en: 'Verified by' },
            { ar: 'استلم العميل', en: 'Received by' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ borderTop: `1px solid #000`, paddingTop: 6, fontSize: 10, color: muted, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                {s[lang]}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 30, padding: 12, background: '#FDF4E2', border: '1px solid #D4860B',
                      borderRadius: 6, fontSize: 11, color: '#1B3A6B', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 16, lineHeight: 1 }}>⚠</div>
          <div style={{ lineHeight: 1.6 }}>
            <strong>{isAr ? 'تنبيه: ' : 'Heads up: '}</strong>
            {isAr
              ? 'يحتوي الطلب على عطر زجاجي — استخدم الفقاعات الواقية وضع علامة هش.'
              : 'Order includes glass perfume bottle — use bubble wrap and mark FRAGILE.'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ADMIN · MESSAGE TEMPLATES (Email / WhatsApp / SMS)
// ═══════════════════════════════════════════════════════════════
function AdminTemplates({ dark }) {
  const surface = dark ? '#132744' : '#fff';
  const bg = dark ? BARTAL.d_bg : '#F5F6F8';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';

  const [active, setActive] = React.useState('order_placed');
  const [channel, setChannel] = React.useState('email');

  const TEMPLATES = [
    { k: 'order_placed', name: 'Order placed', trigger: 'On order created', usage: '142 / day', icon: '🛒' },
    { k: 'receipt_received', name: 'Receipt received', trigger: 'On receipt upload', usage: '98 / day', icon: '📩' },
    { k: 'receipt_approved', name: 'Receipt approved', trigger: 'On payment verified', usage: '92 / day', icon: '✓' },
    { k: 'receipt_rejected', name: 'Receipt rejected', trigger: 'On manual rejection', usage: '6 / day', icon: '✕' },
    { k: 'order_shipped', name: 'Out for delivery', trigger: 'On status = shipping', usage: '88 / day', icon: '🚚' },
    { k: 'order_delivered', name: 'Order delivered', trigger: 'On status = delivered', usage: '85 / day', icon: '📦' },
    { k: 'review_request', name: 'Ask for review', trigger: '3 days post-delivery', usage: '70 / week', icon: '⭐' },
    { k: 'cart_abandon', name: 'Cart reminder', trigger: '4h after abandon', usage: '24 / day', icon: '↩' },
    { k: 'password_reset', name: 'Password reset', trigger: 'On reset request', usage: '4 / day', icon: '🔑' },
    { k: 'otp_login', name: 'Login OTP', trigger: 'On login verify', usage: '320 / day', icon: '#' },
    { k: 'low_stock', name: 'Back in stock', trigger: 'Stock restored', usage: '12 / week', icon: '📥' },
    { k: 'promo_blast', name: 'Promo announcement', trigger: 'Manual broadcast', usage: '2 / month', icon: '📢' },
  ];

  const CONTENT = {
    order_placed: {
      email_subj: 'Your Bartal order BRT-2026-00842 — bank transfer needed',
      email_subj_ar: 'طلبك في برتال BRT-2026-00842 — يرجى إتمام التحويل',
      email: `Hi {{first_name}},

Thank you for shopping with Bartal! Your order **{{order_id}}** has been received.

To complete your purchase, please transfer **{{total}} SDG** to:
  Bank: Faisal Islamic Bank
  Account: 0012-345-678-9000
  Reference: {{order_id}}  ← important!

Then upload the receipt: {{receipt_link}}

We'll verify within 4 hours and start preparing your order.

— The Bartal team
support@bartal.sd · WhatsApp +249 91 234 5678`,
      whatsapp: `🎉 *Order received — {{order_id}}*

Hi {{first_name}}! Thanks for your order.

💰 *Amount due:* {{total}} SDG
🏦 *Bank:* Faisal Islamic
🔢 *Account:* 0012-345-678-9000
📝 *Reference:* {{order_id}}

After transferring, reply with the receipt photo or upload here:
👉 {{receipt_link}}

We'll verify within 4 hours.`,
      sms: `Bartal: Order {{order_id}} received. Transfer {{total}} SDG to Faisal Islamic 0012-345-678-9000, ref {{order_id}}. Upload receipt: {{short_link}}`,
    },
    receipt_approved: {
      email_subj: 'Payment confirmed — your order is being prepared',
      email_subj_ar: 'تم تأكيد الدفع — جارٍ تحضير طلبك',
      email: `Hi {{first_name}},

Great news — we've verified your bank transfer for **{{order_id}}**.

Your order is now being prepared at our Khartoum warehouse and will ship within 1 business day.

You'll get another message when it's out for delivery.

Estimated delivery: **{{eta}}**

Track here: {{tracking_link}}

— The Bartal team`,
      whatsapp: `✅ *Payment verified*

Hi {{first_name}}! Your transfer for *{{order_id}}* has been confirmed.

📦 We're preparing your order now
🚚 ETA: {{eta}}
📍 Track: {{tracking_link}}

Thank you!`,
      sms: `Bartal: Payment verified for {{order_id}}. Preparing your order. ETA {{eta}}. Track: {{short_link}}`,
    },
    receipt_rejected: {
      email_subj: 'We couldn\'t verify your receipt — let\'s fix this',
      email_subj_ar: 'لم نتمكن من التحقق من الإيصال — لنحل هذا معاً',
      email: `Hi {{first_name}},

We tried to verify the receipt for order **{{order_id}}** but ran into an issue:

> {{rejection_reason}}

Don't worry — your order is on hold, not cancelled. Please re-upload a clear photo of the receipt:
{{upload_link}}

If you've already transferred and need help, reply to this email or WhatsApp us at +249 91 234 5678.

— The Bartal team`,
      whatsapp: `⚠ *Receipt issue — {{order_id}}*

Hi {{first_name}}, we couldn't verify your receipt:
_{{rejection_reason}}_

Your order is on hold. Please reply with a clearer photo of the receipt, or upload here:
{{upload_link}}`,
      sms: `Bartal: Issue verifying receipt for {{order_id}}. Please re-upload: {{short_link}} or reply to this SMS.`,
    },
    review_request: {
      email_subj: 'How was your Bartal order?',
      email_subj_ar: 'كيف كانت تجربتك مع برتال؟',
      email: `Hi {{first_name}},

Hope you're enjoying your recent purchase! Mind taking 30 seconds to leave a review?

{{#each items}}
  • {{name}} — {{review_link}}
{{/each}}

Your honest feedback helps other shoppers in Sudan find great products. Thank you!

— The Bartal team`,
      whatsapp: `⭐ Hi {{first_name}}!

How did you like your Bartal order? Tap below to leave a quick review — it really helps other shoppers.

{{review_link}}`,
      sms: `Bartal: How was your order? Leave a quick review: {{short_link}}`,
    },
  };

  const fallback = CONTENT.order_placed;
  const c = CONTENT[active] || fallback;

  return (
    <div style={{ width: '100%', height: '100%', background: bg, padding: 24, overflow: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 18, height: '100%' }}>
        {/* List */}
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 14, overflow: 'auto' }}>
          <div style={{ fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 10, padding: '0 6px' }}>
            12 templates
          </div>
          {TEMPLATES.map(tmp => {
            const on = tmp.k === active;
            return (
              <div key={tmp.k} onClick={() => setActive(tmp.k)} style={{
                padding: '10px 12px', borderRadius: 8, cursor: 'pointer', marginBottom: 2,
                background: on ? '#1B3A6B' : 'transparent',
                color: on ? '#fff' : text,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: on ? 'rgba(255,255,255,0.18)' : (dark ? BARTAL.d_raised : '#F3F4F6'),
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                  {tmp.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{tmp.name}</div>
                  <div style={{ fontSize: 10, color: on ? 'rgba(255,255,255,0.7)' : muted, marginTop: 1 }}>
                    {tmp.usage}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto' }}>
          {/* meta strip */}
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: text }}>
                  {TEMPLATES.find(t => t.k === active)?.name}
                </div>
                <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>
                  Trigger: {TEMPLATES.find(t => t.k === active)?.trigger} · last edited 2 days ago by Fatima A.
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{
                  background: 'transparent', color: text, border: `1px solid ${line}`,
                  borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins'",
                }}>Send test</button>
                <button style={{
                  background: '#D4860B', color: '#fff', border: 'none',
                  borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins'",
                }}>Save changes</button>
              </div>
            </div>

            {/* channel tabs */}
            <div style={{ display: 'flex', gap: 4, padding: 3, background: dark ? BARTAL.d_raised : '#F3F4F6', borderRadius: 8, width: 'fit-content' }}>
              {[
                { k: 'email', l: 'Email', icon: '✉' },
                { k: 'whatsapp', l: 'WhatsApp', icon: '💬' },
                { k: 'sms', l: 'SMS', icon: '📱' },
              ].map(t => {
                const on = t.k === channel;
                return (
                  <div key={t.k} onClick={() => setChannel(t.k)} style={{
                    padding: '7px 14px', borderRadius: 6, cursor: 'pointer',
                    background: on ? surface : 'transparent',
                    color: on ? text : muted,
                    fontSize: 12, fontWeight: 600,
                    boxShadow: on ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <span>{t.icon}</span>{t.l}
                  </div>
                );
              })}
            </div>
          </div>

          {/* split: editor | preview */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14, flex: 1 }}>
            {/* editor */}
            <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 18,
                          display: 'flex', flexDirection: 'column', gap: 12 }}>
              {channel === 'email' && (
                <>
                  <div>
                    <div style={{ fontSize: 11, color: muted, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                      Subject (EN / AR)
                    </div>
                    <input defaultValue={c.email_subj} style={{
                      width: '100%', padding: '10px 12px', borderRadius: 8,
                      border: `1px solid ${line}`, background: dark ? BARTAL.d_bg : '#fff', color: text,
                      fontSize: 13, fontFamily: "'Poppins'", outline: 'none', marginBottom: 6,
                    }}/>
                    <input defaultValue={c.email_subj_ar} dir="rtl" style={{
                      width: '100%', padding: '10px 12px', borderRadius: 8,
                      border: `1px solid ${line}`, background: dark ? BARTAL.d_bg : '#fff', color: text,
                      fontSize: 13, fontFamily: "'Cairo'", outline: 'none',
                    }}/>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 11, color: muted, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                      Body — Markdown supported
                    </div>
                    <textarea defaultValue={c.email} style={{
                      flex: 1, minHeight: 280, padding: '12px',
                      borderRadius: 8, border: `1px solid ${line}`,
                      background: dark ? BARTAL.d_bg : '#FBFAF7', color: text,
                      fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                      lineHeight: 1.6, outline: 'none', resize: 'none',
                    }}/>
                  </div>
                </>
              )}
              {channel === 'whatsapp' && (
                <>
                  <div style={{ fontSize: 11, color: muted, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    WhatsApp message — *bold*, _italic_, ~strike~
                  </div>
                  <textarea defaultValue={c.whatsapp} style={{
                    flex: 1, minHeight: 320, padding: '12px',
                    borderRadius: 8, border: `1px solid ${line}`,
                    background: dark ? BARTAL.d_bg : '#FBFAF7', color: text,
                    fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                    lineHeight: 1.6, outline: 'none', resize: 'none',
                  }}/>
                  <div style={{ fontSize: 11, color: muted }}>
                    Approved as Meta Business template <strong style={{ color: BARTAL.success }}>order_update_v2</strong>
                  </div>
                </>
              )}
              {channel === 'sms' && (
                <>
                  <div style={{ fontSize: 11, color: muted, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    SMS body (160 char target)
                  </div>
                  <textarea defaultValue={c.sms} style={{
                    minHeight: 120, padding: '12px',
                    borderRadius: 8, border: `1px solid ${line}`,
                    background: dark ? BARTAL.d_bg : '#FBFAF7', color: text,
                    fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                    lineHeight: 1.6, outline: 'none', resize: 'none',
                  }}/>
                  <div style={{ fontSize: 11, color: muted, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{c.sms.length} chars · 1 segment</span>
                    <span>Sender ID: <strong style={{ color: text }}>BARTAL</strong></span>
                  </div>
                </>
              )}

              {/* variable chips */}
              <div style={{ borderTop: `1px solid ${line}`, paddingTop: 12 }}>
                <div style={{ fontSize: 10, color: muted, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  Available variables — click to insert
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['{{first_name}}','{{order_id}}','{{total}}','{{eta}}','{{tracking_link}}','{{receipt_link}}','{{rejection_reason}}','{{short_link}}'].map(v => (
                    <div key={v} style={{
                      padding: '4px 10px', borderRadius: 100,
                      background: dark ? BARTAL.d_raised : '#EEF1F5', color: '#1B3A6B',
                      fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                      cursor: 'pointer', border: `1px solid ${line}`,
                    }}>{v}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 11, color: muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Live preview
              </div>
              {channel === 'email' && (
                <div style={{ background: '#fff', border: `1px solid ${line}`, borderRadius: 10, padding: 14, fontSize: 11, color: '#222' }}>
                  <div style={{ borderBottom: '1px solid #eee', paddingBottom: 8, marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, color: '#222', fontSize: 13 }}>{c.email_subj.replace('{{order_id}}','BRT-2026-00842')}</div>
                    <div style={{ color: '#888', marginTop: 3, fontSize: 10 }}>Bartal &lt;noreply@bartal.sd&gt; → mo@example.sd</div>
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontFamily: "'Poppins'" }}>
                    {c.email
                      .replace(/\{\{first_name\}\}/g, 'Mohammed')
                      .replace(/\{\{order_id\}\}/g, 'BRT-2026-00842')
                      .replace(/\{\{total\}\}/g, '228,000')
                      .replace(/\{\{eta\}\}/g, 'Apr 22')
                      .replace(/\{\{receipt_link\}\}/g, 'bartal.sd/r/xy42')
                      .replace(/\{\{tracking_link\}\}/g, 'bartal.sd/t/2845')
                      .replace(/\{\{upload_link\}\}/g, 'bartal.sd/u/xy42')
                      .replace(/\{\{rejection_reason\}\}/g, 'photo too blurry')
                      .replace(/\*\*(.*?)\*\*/g, '$1')
                      .replace(/\{\{#each items\}\}[\s\S]*?\{\{\/each\}\}/, '• Royal Oud — bartal.sd/r1\n  • Wireless Pro — bartal.sd/r2')
                    }
                  </div>
                </div>
              )}
              {channel === 'whatsapp' && (
                <div style={{ background: '#0a0a0a', borderRadius: 14, padding: 14, position: 'relative' }}>
                  <div style={{ background: '#005C4B', color: '#fff', borderRadius: 10, padding: 12,
                                fontSize: 12, lineHeight: 1.5, fontFamily: "'Poppins'", whiteSpace: 'pre-wrap',
                                marginInlineStart: 30, position: 'relative' }}>
                    {c.whatsapp
                      .replace(/\{\{first_name\}\}/g, 'Mohammed')
                      .replace(/\{\{order_id\}\}/g, 'BRT-2026-00842')
                      .replace(/\{\{total\}\}/g, '228,000')
                      .replace(/\{\{eta\}\}/g, 'Apr 22')
                      .replace(/\{\{receipt_link\}\}/g, 'bartal.sd/r/xy42')
                      .replace(/\{\{tracking_link\}\}/g, 'bartal.sd/t/2845')
                      .replace(/\{\{upload_link\}\}/g, 'bartal.sd/u/xy42')
                      .replace(/\{\{rejection_reason\}\}/g, 'photo too blurry')
                      .replace(/\*(.*?)\*/g, '$1')
                      .replace(/_(.*?)_/g, '$1')}
                    <div style={{ textAlign: 'right', fontSize: 9, opacity: 0.7, marginTop: 4 }}>2:14 PM ✓✓</div>
                  </div>
                </div>
              )}
              {channel === 'sms' && (
                <div style={{ background: '#fff', border: `1px solid ${line}`, borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 10, color: muted, marginBottom: 6 }}>From: BARTAL</div>
                  <div style={{ background: '#E5F2FF', color: '#000', borderRadius: 14, padding: '8px 12px',
                                fontSize: 12, lineHeight: 1.5, fontFamily: "'Poppins'" }}>
                    {c.sms
                      .replace(/\{\{order_id\}\}/g, 'BRT-2026-00842')
                      .replace(/\{\{total\}\}/g, '228,000')
                      .replace(/\{\{short_link\}\}/g, 'bartal.sd/r/xy42')
                      .replace(/\{\{eta\}\}/g, 'Apr 22')}
                  </div>
                </div>
              )}

              <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 10, padding: 12,
                            fontSize: 11, color: muted, lineHeight: 1.6 }}>
                <div style={{ fontWeight: 700, color: text, marginBottom: 4 }}>Sending stats · last 7d</div>
                Delivered: <strong style={{ color: text }}>982</strong> &nbsp;·&nbsp; Opened: <strong style={{ color: text }}>71%</strong><br/>
                Clicked: <strong style={{ color: text }}>34%</strong> &nbsp;·&nbsp; Bounced: <strong style={{ color: BARTAL.danger }}>2</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WebInvoicePrint, AdminTemplates });
