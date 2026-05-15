// admin-extras2.jsx — Missing admin pages:
// OrderDetail, CustomerDetail, Refunds, Promos, Banners CMS, Staff/Audit log

// ════════ ADMIN ORDER DETAIL ════════
function AdminOrderDetail({ dark }) {
  const surface = dark ? BARTAL.d_surface : '#fff';
  const bg = dark ? BARTAL.d_bg : '#F5F6F8';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';
  const subtle = dark ? BARTAL.d_raised : '#F9FAFB';

  return (
    <div style={{ padding: 24, fontFamily: "'Poppins'", color: text, height: '100%', overflow: 'auto' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 12, color: muted, marginBottom: 4 }}>
            ← Back to orders
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'JetBrains Mono'", color: text }}>BRT-2026-00842</div>
          <div style={{ fontSize: 13, color: muted, marginTop: 4 }}>Placed Apr 19, 2026 · 2:14 PM by Mohammed Osman</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ background: 'transparent', border: `1px solid ${line}`, padding: '8px 14px',
                           borderRadius: 8, fontSize: 12, fontWeight: 600, color: text }}>Print</button>
          <button style={{ background: BARTAL.danger + '15', border: `1px solid ${BARTAL.danger}40`, padding: '8px 14px',
                           borderRadius: 8, fontSize: 12, fontWeight: 600, color: BARTAL.danger }}>Cancel order</button>
          <button style={{ background: BARTAL.amber, border: 'none', padding: '8px 14px',
                           borderRadius: 8, fontSize: 12, fontWeight: 700, color: '#fff' }}>Mark as shipped</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <div>
          {/* status timeline */}
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 10, padding: 18, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Order timeline</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { l: 'Placed', t: '2:14 PM', done: true },
                { l: 'Receipt up.', t: '2:32 PM', done: true },
                { l: 'Verified', t: '4:51 PM', done: true, current: true },
                { l: 'Preparing', t: '—', done: false },
                { l: 'Shipped', t: '—', done: false },
                { l: 'Delivered', t: '—', done: false },
              ].map((s, i, arr) => (
                <div key={i} style={{ flex: 1, position: 'relative' }}>
                  {i < arr.length - 1 && (
                    <div style={{ position: 'absolute', top: 9, left: '60%', right: 0, height: 2,
                                  background: s.done ? BARTAL.success : line }}/>
                  )}
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: s.current ? BARTAL.amber : (s.done ? BARTAL.success : line),
                    border: s.current ? `3px solid ${BARTAL.amberTint}` : 'none',
                    margin: '0 0 8px',
                  }}/>
                  <div style={{ fontSize: 12, fontWeight: s.current ? 700 : 500, color: text }}>{s.l}</div>
                  <div style={{ fontSize: 10, color: muted, fontFamily: "'JetBrains Mono'" }}>{s.t}</div>
                </div>
              ))}
            </div>
          </div>

          {/* items */}
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 10, marginBottom: 16 }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${line}`, fontSize: 14, fontWeight: 700 }}>
              Items (2)
            </div>
            {CATALOG.slice(0, 2).map((p, i) => (
              <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 90px',
                                       gap: 14, padding: '14px 18px', alignItems: 'center',
                                       borderBottom: i < 1 ? `1px solid ${line}` : 'none' }}>
                <div style={{ width: 50, height: 50, borderRadius: 6, overflow: 'hidden' }}>
                  <ProductPlaceholder label={p.name_en} hue={p.hue}/>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{p.name_en}</div>
                  <div style={{ fontSize: 11, color: muted, fontFamily: "'JetBrains Mono'" }}>SKU-{p.id.toUpperCase()}</div>
                </div>
                <div style={{ fontSize: 13, color: text }}>1 × </div>
                <div style={{ fontSize: 13, color: text, fontFamily: "'JetBrains Mono'" }}>{p.price.toLocaleString()}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: text, fontFamily: "'JetBrains Mono'", textAlign: 'right' }}>
                  {p.price.toLocaleString()} SDG
                </div>
              </div>
            ))}
            <div style={{ padding: '14px 18px', background: subtle, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: muted }}>
                <span>Subtotal</span><span style={{ fontFamily: "'JetBrains Mono'" }}>227,200 SDG</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: muted }}>
                <span>Delivery · Omdurman</span><span style={{ fontFamily: "'JetBrains Mono'" }}>800 SDG</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: `1px solid ${line}`, marginTop: 4,
                            fontWeight: 700, color: text, fontSize: 14 }}>
                <span>Total</span><span style={{ fontFamily: "'JetBrains Mono'", color: BARTAL.amber }}>228,000 SDG</span>
              </div>
            </div>
          </div>

          {/* receipt review */}
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 10, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Bank receipt</div>
              <span style={{ background: BARTAL.success + '20', color: BARTAL.success, padding: '3px 10px',
                             borderRadius: 100, fontSize: 11, fontWeight: 700 }}>● Approved by Sara M.</span>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ width: 130, height: 170, borderRadius: 6, overflow: 'hidden' }}>
                <ProductPlaceholder label="receipt-img" hue="warm"/>
              </div>
              <div style={{ flex: 1, fontSize: 12, lineHeight: 1.8 }}>
                <div style={{ color: muted }}>Bank: <strong style={{ color: text }}>Faisal Islamic Bank</strong></div>
                <div style={{ color: muted }}>Amount detected: <strong style={{ color: text, fontFamily: "'JetBrains Mono'" }}>228,000 SDG</strong></div>
                <div style={{ color: muted }}>Reference: <strong style={{ color: text, fontFamily: "'JetBrains Mono'" }}>BRT-2026-00842</strong> ✓</div>
                <div style={{ color: muted }}>Uploaded: <strong style={{ color: text }}>Apr 19 · 2:32 PM</strong></div>
                <div style={{ color: muted }}>Approved: <strong style={{ color: text }}>Apr 19 · 4:51 PM by Sara M.</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* side rail */}
        <div>
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 10, padding: 18, marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Customer</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: BARTAL.amber, color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>MO</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Mohammed Osman</div>
                <div style={{ fontSize: 11, color: muted }}>14 orders · since Mar 2024</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: muted, lineHeight: 1.7 }}>
              <div>+249 912 345 678</div>
              <div>m.osman@example.sd</div>
              <a style={{ color: BARTAL.amber, fontWeight: 700 }}>View customer →</a>
            </div>
          </div>

          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 10, padding: 18, marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Shipping</div>
            <div style={{ fontSize: 12, color: text, lineHeight: 1.7 }}>
              Mohammed Osman Ahmed<br/>
              Al-Riyadh, block 32<br/>
              Near Al-Fateh mosque, blue gate<br/>
              Omdurman, Sudan<br/>
              <span style={{ color: muted, fontFamily: "'JetBrains Mono'" }}>+249 912 345 678</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: muted }}>
              Notes: <em>"Call on arrival"</em>
            </div>
          </div>

          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 10, padding: 18 }}>
            <div style={{ fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Internal notes</div>
            <div style={{ fontSize: 12, color: text, padding: 10, background: subtle, borderRadius: 6, marginBottom: 8 }}>
              Customer requested afternoon delivery if possible. — <span style={{ color: muted }}>Sara M., 5:02 PM</span>
            </div>
            <textarea placeholder="Add a note…" style={{
              width: '100%', minHeight: 60, fontSize: 12, padding: 8,
              border: `1px solid ${line}`, borderRadius: 6, fontFamily: 'inherit', background: bg, color: text,
            }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════ ADMIN CUSTOMER DETAIL ════════
function AdminCustomerDetail({ dark }) {
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';
  const subtle = dark ? BARTAL.d_raised : '#F9FAFB';

  return (
    <div style={{ padding: 24, fontFamily: "'Poppins'", color: text, height: '100%', overflow: 'auto' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: BARTAL.amber, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22 }}>MO</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Mohammed Osman Ahmed</div>
          <div style={{ fontSize: 12, color: muted }}>Customer since Mar 2024 · ID: CUST-00284 · Khartoum</div>
        </div>
        <button style={{ background: 'transparent', border: `1px solid ${line}`, padding: '8px 14px',
                         borderRadius: 8, fontSize: 12, fontWeight: 600, color: text }}>Email</button>
        <button style={{ background: BARTAL.success, border: 'none', padding: '8px 14px',
                         borderRadius: 8, fontSize: 12, fontWeight: 700, color: '#fff' }}>WhatsApp</button>
      </div>

      {/* stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
        {[
          { l: 'Lifetime value', v: '1.84M', u: 'SDG', accent: BARTAL.amber },
          { l: 'Total orders', v: '14', u: '', accent: text },
          { l: 'Avg. order', v: '131k', u: 'SDG', accent: text },
          { l: 'Last order', v: 'Today', u: '', accent: BARTAL.success },
        ].map((s, i) => (
          <div key={i} style={{ background: surface, border: `1px solid ${line}`, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{s.l}</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'JetBrains Mono'", color: s.accent }}>
              {s.v}<span style={{ fontSize: 12, color: muted, marginLeft: 4 }}>{s.u}</span>
            </div>
          </div>
        ))}
      </div>

      {/* tabs */}
      <div style={{ display: 'flex', gap: 18, borderBottom: `1px solid ${line}`, marginBottom: 16 }}>
        {['Orders', 'Addresses', 'Notes', 'Activity'].map((t, i) => (
          <div key={t} style={{
            padding: '10px 0', fontSize: 13, fontWeight: i === 0 ? 700 : 500,
            color: i === 0 ? BARTAL.amber : muted,
            borderBottom: i === 0 ? `2px solid ${BARTAL.amber}` : 'none', marginBottom: -1,
          }}>{t}</div>
        ))}
      </div>

      {/* orders table */}
      <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr',
                      padding: '10px 18px', background: subtle, borderBottom: `1px solid ${line}`,
                      fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          <div>Order</div><div>Date</div><div>Items</div><div>Total</div><div>Status</div>
        </div>
        {[
          { n: 'BRT-2026-00842', d: 'Apr 19', i: 2, t: 228000, s: 'Verified', c: BARTAL.success },
          { n: 'BRT-2026-00811', d: 'Apr 12', i: 1, t: 95000, s: 'Delivered', c: BARTAL.success },
          { n: 'BRT-2026-00794', d: 'Apr 5', i: 3, t: 156000, s: 'Delivered', c: BARTAL.success },
          { n: 'BRT-2026-00772', d: 'Mar 29', i: 1, t: 42000, s: 'Delivered', c: BARTAL.success },
          { n: 'BRT-2026-00760', d: 'Mar 28', i: 1, t: 28500, s: 'Cancelled', c: BARTAL.danger },
        ].map((o, i, arr) => (
          <div key={o.n} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr',
                                  padding: '12px 18px', alignItems: 'center', fontSize: 13,
                                  borderBottom: i < arr.length - 1 ? `1px solid ${line}` : 'none' }}>
            <div style={{ fontFamily: "'JetBrains Mono'", color: BARTAL.amber, fontWeight: 700 }}>{o.n}</div>
            <div style={{ color: muted }}>{o.d}</div>
            <div>{o.i}</div>
            <div style={{ fontFamily: "'JetBrains Mono'" }}>{o.t.toLocaleString()} SDG</div>
            <div style={{ color: o.c, fontWeight: 700, fontSize: 12 }}>● {o.s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════ ADMIN REFUNDS ════════
function AdminRefunds({ dark }) {
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';
  const subtle = dark ? BARTAL.d_raised : '#F9FAFB';

  const refunds = [
    { id: 'RFD-00041', order: 'BRT-2026-00811', cust: 'Fatima Al-Mahdi', amt: 95000, reason: 'Item damaged on arrival', age: '2h', urgent: true },
    { id: 'RFD-00040', order: 'BRT-2026-00794', cust: 'Ahmed Bashir', amt: 42000, reason: 'Wrong fragrance shipped', age: '5h' },
    { id: 'RFD-00039', order: 'BRT-2026-00788', cust: 'Salma El-Tayeb', amt: 18000, reason: 'Customer changed mind', age: '1d' },
    { id: 'RFD-00038', order: 'BRT-2026-00772', cust: 'Omar Saeed', amt: 28500, reason: 'Did not match description', age: '2d' },
  ];

  return (
    <div style={{ padding: 24, fontFamily: "'Poppins'", color: text, height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Refunds & returns</div>
          <div style={{ fontSize: 12, color: muted }}>4 pending · 2.3M SDG refunded this month</div>
        </div>
        <button style={{ background: BARTAL.amber, border: 'none', padding: '8px 14px', borderRadius: 8,
                         fontSize: 12, fontWeight: 700, color: '#fff' }}>Export CSV</button>
      </div>

      {/* filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[
          { l: 'All', n: 24, on: true }, { l: 'Pending', n: 4 }, { l: 'Approved', n: 16 },
          { l: 'Rejected', n: 3 }, { l: 'Processed', n: 1 },
        ].map((f, i) => (
          <div key={i} style={{
            padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: f.on ? BARTAL.navy : 'transparent',
            border: f.on ? 'none' : `1px solid ${line}`,
            color: f.on ? '#fff' : text,
          }}>{f.l} <span style={{ opacity: 0.6, marginLeft: 4 }}>{f.n}</span></div>
        ))}
      </div>

      <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '110px 130px 1.4fr 2fr 1fr 100px 130px',
                      padding: '10px 18px', background: subtle, borderBottom: `1px solid ${line}`,
                      fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          <div>Refund</div><div>Order</div><div>Customer</div><div>Reason</div><div>Amount</div><div>Age</div><div>Action</div>
        </div>
        {refunds.map((r, i) => (
          <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '110px 130px 1.4fr 2fr 1fr 100px 130px',
                                   padding: '14px 18px', alignItems: 'center', fontSize: 13,
                                   borderBottom: i < refunds.length - 1 ? `1px solid ${line}` : 'none',
                                   background: r.urgent ? BARTAL.danger + '08' : 'transparent' }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 700, color: text }}>{r.id}</div>
            <div style={{ fontFamily: "'JetBrains Mono'", color: BARTAL.amber, fontWeight: 700 }}>{r.order}</div>
            <div>{r.cust}</div>
            <div style={{ color: muted, fontSize: 12 }}>{r.reason}</div>
            <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 700 }}>{r.amt.toLocaleString()} SDG</div>
            <div style={{ color: r.urgent ? BARTAL.danger : muted, fontWeight: r.urgent ? 700 : 500 }}>
              {r.urgent && '● '}{r.age}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{ background: BARTAL.success, border: 'none', padding: '6px 10px',
                               borderRadius: 6, fontSize: 11, color: '#fff', fontWeight: 700 }}>Approve</button>
              <button style={{ background: 'transparent', border: `1px solid ${line}`, padding: '6px 10px',
                               borderRadius: 6, fontSize: 11, color: text, fontWeight: 600 }}>Deny</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════ ADMIN PROMOS ════════
function AdminPromos({ dark }) {
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';
  const subtle = dark ? BARTAL.d_raised : '#F9FAFB';

  const promos = [
    { code: 'RAMADAN15', desc: '15% off all fragrance', type: 'Percentage', val: '15%', uses: '847 / 2,000', exp: 'May 1, 2026', status: 'Active', c: BARTAL.success },
    { code: 'WELCOME10', desc: 'First-order discount', type: 'Percentage', val: '10%', uses: '1,432 / ∞', exp: 'No expiry', status: 'Active', c: BARTAL.success },
    { code: 'FREESHIP50', desc: 'Free shipping over 50k', type: 'Free shipping', val: '—', uses: '291 / 500', exp: 'Apr 30', status: 'Active', c: BARTAL.success },
    { code: 'EID2026', desc: 'Eid 2026 — 20% off everything', type: 'Percentage', val: '20%', uses: '0 / 5,000', exp: 'Apr 25', status: 'Scheduled', c: BARTAL.amber },
    { code: 'SUMMER22', desc: 'Summer 2022 promo', type: 'Fixed amount', val: '5,000 SDG', uses: '2,891 / 3,000', exp: 'Aug 31, 2022', status: 'Expired', c: muted },
  ];

  return (
    <div style={{ padding: 24, fontFamily: "'Poppins'", color: text, height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Promo codes</div>
          <div style={{ fontSize: 12, color: muted }}>3 active · 1 scheduled · 5 total</div>
        </div>
        <button style={{ background: BARTAL.amber, border: 'none', padding: '9px 16px', borderRadius: 8,
                         fontSize: 12, fontWeight: 700, color: '#fff' }}>+ New promo code</button>
      </div>

      {/* stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
        {[
          { l: 'Codes redeemed (30d)', v: '2,570' },
          { l: 'Discount given (30d)', v: '4.2M', u: 'SDG', accent: BARTAL.amber },
          { l: 'Avg. cart with promo', v: '+34%' },
          { l: 'Top code', v: 'RAMADAN15' },
        ].map((s, i) => (
          <div key={i} style={{ background: surface, border: `1px solid ${line}`, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{s.l}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'JetBrains Mono'", color: s.accent || text }}>
              {s.v} {s.u && <span style={{ fontSize: 11, color: muted }}>{s.u}</span>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '160px 2fr 1fr 100px 1.2fr 130px 130px',
                      padding: '10px 18px', background: subtle, borderBottom: `1px solid ${line}`,
                      fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          <div>Code</div><div>Description</div><div>Type</div><div>Value</div><div>Uses</div><div>Expires</div><div>Status</div>
        </div>
        {promos.map((p, i) => (
          <div key={p.code} style={{ display: 'grid', gridTemplateColumns: '160px 2fr 1fr 100px 1.2fr 130px 130px',
                                     padding: '14px 18px', alignItems: 'center', fontSize: 13,
                                     borderBottom: i < promos.length - 1 ? `1px solid ${line}` : 'none' }}>
            <div style={{ display: 'inline-block', padding: '4px 10px', background: BARTAL.amberTint,
                          borderRadius: 6, color: BARTAL.amber, fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 12 }}>
              {p.code}
            </div>
            <div style={{ color: text }}>{p.desc}</div>
            <div style={{ color: muted, fontSize: 12 }}>{p.type}</div>
            <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 700 }}>{p.val}</div>
            <div style={{ color: muted, fontFamily: "'JetBrains Mono'", fontSize: 12 }}>{p.uses}</div>
            <div style={{ color: muted, fontSize: 12 }}>{p.exp}</div>
            <div style={{ color: p.c, fontWeight: 700, fontSize: 12 }}>● {p.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════ ADMIN BANNERS CMS ════════
function AdminBanners({ dark }) {
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';
  const subtle = dark ? BARTAL.d_raised : '#F9FAFB';

  const banners = [
    { id: 1, title_en: 'Ramadan offers — up to 30% off', title_ar: 'عروض رمضان — حتى ٣٠٪ خصم', position: 1, status: 'Live', hue: 'amber', cta: '/c/fragrance', clicks: '12,847' },
    { id: 2, title_en: 'New iPhone 17 — pre-order now', title_ar: 'آيفون ١٧ الجديد — احجز الآن', position: 2, status: 'Live', hue: 'navy', cta: '/p/iphone-17', clicks: '8,291' },
    { id: 3, title_en: 'Bakhoor & Oud collection', title_ar: 'مجموعة البخور والعود', position: 3, status: 'Live', hue: 'rose', cta: '/c/bakhoor', clicks: '4,512' },
    { id: 4, title_en: 'Eid 2026 — coming soon', title_ar: 'عيد ٢٠٢٦ — قريباً', position: 4, status: 'Draft', hue: 'green', cta: '—', clicks: '—' },
  ];

  return (
    <div style={{ padding: 24, fontFamily: "'Poppins'", color: text, height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Homepage banners</div>
          <div style={{ fontSize: 12, color: muted }}>Drag to reorder · 3 live · 1 draft</div>
        </div>
        <button style={{ background: BARTAL.amber, border: 'none', padding: '9px 16px', borderRadius: 8,
                         fontSize: 12, fontWeight: 700, color: '#fff' }}>+ Add banner</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {banners.map(b => (
          <div key={b.id} style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12,
                                   padding: 14, display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ color: muted, fontSize: 18, cursor: 'grab' }}>⋮⋮</div>
            <div style={{ width: 60, height: 36, borderRadius: 6, overflow: 'hidden', background: subtle,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono'", color: muted }}>
              #{b.position}
            </div>
            <div style={{ width: 200, height: 80, borderRadius: 8, overflow: 'hidden' }}>
              <ProductPlaceholder label="banner" hue={b.hue}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 4 }}>{b.title_en}</div>
              <div style={{ fontFamily: "'Cairo'", fontSize: 13, color: muted, direction: 'rtl', textAlign: 'left' }}>{b.title_ar}</div>
              <div style={{ marginTop: 6, fontSize: 11, color: muted, fontFamily: "'JetBrains Mono'" }}>
                CTA: {b.cta} · Clicks: {b.clicks}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
              <span style={{ background: b.status === 'Live' ? BARTAL.success + '20' : muted + '20',
                             color: b.status === 'Live' ? BARTAL.success : muted,
                             padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>
                ● {b.status}
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={{ background: 'transparent', border: `1px solid ${line}`, padding: '5px 10px',
                                 borderRadius: 6, fontSize: 11, color: text, fontWeight: 600 }}>Edit</button>
                <button style={{ background: 'transparent', border: 'none', color: BARTAL.danger,
                                 fontSize: 11, fontWeight: 600 }}>×</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════ ADMIN STAFF / AUDIT LOG ════════
function AdminStaff({ dark }) {
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';
  const subtle = dark ? BARTAL.d_raised : '#F9FAFB';

  const staff = [
    { name: 'Sara Mahmoud', role: 'Admin', email: 'sara@bartal.sd', last: 'Active now', online: true },
    { name: 'Khalid Hassan', role: 'Receipt verifier', email: 'khalid@bartal.sd', last: '12 min ago', online: true },
    { name: 'Layla Abbas', role: 'Order manager', email: 'layla@bartal.sd', last: '2h ago', online: false },
    { name: 'Yusuf Idris', role: 'Customer support', email: 'yusuf@bartal.sd', last: 'Yesterday', online: false },
    { name: 'Hind El-Tayeb', role: 'Catalog editor', email: 'hind@bartal.sd', last: '3 days ago', online: false },
  ];

  const audit = [
    { user: 'Sara M.', action: 'Approved receipt', target: 'BRT-2026-00842', time: '4:51 PM', c: BARTAL.success },
    { user: 'Khalid H.', action: 'Rejected receipt', target: 'BRT-2026-00839', time: '4:32 PM', c: BARTAL.danger },
    { user: 'Layla A.', action: 'Updated stock', target: 'AUR (12 → 8)', time: '3:18 PM', c: BARTAL.info },
    { user: 'Sara M.', action: 'Created promo', target: 'EID2026', time: '2:44 PM', c: BARTAL.amber },
    { user: 'Hind E.', action: 'Edited product', target: 'Royal Oud Perfume', time: '1:22 PM', c: BARTAL.info },
    { user: 'Yusuf I.', action: 'Issued refund', target: 'RFD-00040 · 42k SDG', time: '11:08 AM', c: BARTAL.amber },
  ];

  return (
    <div style={{ padding: 24, fontFamily: "'Poppins'", color: text, height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Staff & audit log</div>
          <div style={{ fontSize: 12, color: muted }}>5 team members · all activity tracked</div>
        </div>
        <button style={{ background: BARTAL.amber, border: 'none', padding: '9px 16px', borderRadius: 8,
                         fontSize: 12, fontWeight: 700, color: '#fff' }}>+ Invite member</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 18 }}>
        {/* Staff list */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Team members</div>
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 10, overflow: 'hidden' }}>
            {staff.map((s, i) => (
              <div key={s.email} style={{ display: 'flex', gap: 12, padding: '14px 16px', alignItems: 'center',
                                          borderBottom: i < staff.length - 1 ? `1px solid ${line}` : 'none' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: BARTAL.navy,
                                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: 13 }}>
                    {s.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {s.online && (
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: 11, height: 11,
                                  borderRadius: '50%', background: BARTAL.success, border: `2px solid ${surface}` }}/>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: text }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: muted, fontFamily: "'JetBrains Mono'" }}>{s.email}</div>
                </div>
                <div style={{ fontSize: 11, padding: '3px 9px', borderRadius: 6,
                              background: subtle, color: text, fontWeight: 600 }}>{s.role}</div>
                <div style={{ fontSize: 11, color: muted, minWidth: 80, textAlign: 'right' }}>{s.last}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit log */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Recent activity</div>
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 10, overflow: 'hidden' }}>
            {audit.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', alignItems: 'center',
                                    borderBottom: i < audit.length - 1 ? `1px solid ${line}` : 'none' }}>
                <div style={{ width: 4, alignSelf: 'stretch', background: a.c, borderRadius: 2 }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: text }}>
                    <strong>{a.user}</strong> <span style={{ color: muted }}>{a.action}</span>{' '}
                    <span style={{ fontFamily: "'JetBrains Mono'", color: BARTAL.amber, fontWeight: 700 }}>{a.target}</span>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: muted, fontFamily: "'JetBrains Mono'" }}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  AdminOrderDetail, AdminCustomerDetail, AdminRefunds,
  AdminPromos, AdminBanners, AdminStaff,
});
