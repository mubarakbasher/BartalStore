// admin-reviews.jsx — Reviews moderation page

function AdminReviews({ dark }) {
  const surface = dark ? '#132744' : '#fff';
  const bg = dark ? BARTAL.d_bg : '#F5F6F8';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';

  const [filter, setFilter] = React.useState('pending');
  const [selected, setSelected] = React.useState('r2');

  const REVIEWS = [
    { id: 'r1', status: 'pending', stars: 5, name: 'Mohammed Osman', verified: true,
      product: 'Royal Oud Perfume Oil', sku: 'AJM-OUD-3ML', city: 'Khartoum',
      title: 'Premium oud, highly recommend',
      body: 'Beautiful, long-lasting scent. Excellent packaging and arrived in Khartoum quickly. Will absolutely re-order.',
      tags: ['Strong scent', 'Premium packaging'], photos: 2, time: '12 min ago', flagged: false },
    { id: 'r2', status: 'pending', stars: 2, name: 'Salma Hassan', verified: true,
      product: 'Wireless Pro Headphones', sku: 'ANK-WHP-PRO', city: 'Omdurman',
      title: 'Battery dies after 6 hours',
      body: 'Sound is great but battery life nowhere near 40h advertised — barely 6 on full volume. Possibly defective unit. Already messaged support.',
      tags: ['Not as described'], photos: 1, time: '34 min ago', flagged: true, flagReason: 'Auto-flag: contains "defective"' },
    { id: 'r3', status: 'pending', stars: 4, name: 'Ahmed Yousif', verified: true,
      product: 'Smartphone 128GB', sku: 'SAM-S128', city: 'Bahri',
      title: 'Good phone, slow delivery',
      body: 'Phone itself is solid. Delivery took 5 days though, hoping for faster next time.',
      tags: ['As described'], photos: 0, time: '1 hour ago', flagged: false },
    { id: 'r4', status: 'pending', stars: 1, name: 'Anonymous', verified: false,
      product: 'Rose Attar', sku: 'AHA-RS-6ML', city: 'Khartoum',
      title: 'visit cheapsite. example for cheaper!!!',
      body: 'click my link cheap perfumes www.spamsite.example get 90% off!!!',
      tags: [], photos: 0, time: '2 hours ago', flagged: true, flagReason: 'Auto-flag: spam keywords + URL' },
    { id: 'r5', status: 'approved', stars: 5, name: 'Fatima Bakri', verified: true,
      product: 'Indian Agarwood Bakhoor', sku: 'NAB-BKR-50', city: 'Khartoum',
      title: 'Smells like home',
      body: 'Reminds me of my grandmother\'s house. Long-lasting, real bakhoor.',
      tags: ['Long lasting', 'As described'], photos: 3, time: 'Apr 18 · approved', flagged: false },
    { id: 'r6', status: 'rejected', stars: 5, name: 'Anonymous', verified: false,
      product: 'Smartwatch Series 5', sku: 'XMI-WAT-5', city: '—',
      title: 'best best best',
      body: 'best best best best',
      tags: [], photos: 0, time: 'Apr 17 · rejected — low quality', flagged: true, flagReason: 'Manual: low effort' },
  ];

  const filtered = REVIEWS.filter(r => filter === 'all' || r.status === filter);
  const counts = {
    all: REVIEWS.length,
    pending: REVIEWS.filter(r => r.status === 'pending').length,
    flagged: REVIEWS.filter(r => r.flagged && r.status === 'pending').length,
    approved: REVIEWS.filter(r => r.status === 'approved').length,
    rejected: REVIEWS.filter(r => r.status === 'rejected').length,
  };

  const sel = REVIEWS.find(r => r.id === selected) || REVIEWS[0];

  const Stars = ({ n, size = 14 }) => (
    <div style={{ display: 'inline-flex', gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <StarIcon key={i} color={i <= n ? '#D4860B' : (dark ? BARTAL.d_line : '#E0DBC9')} size={size}/>
      ))}
    </div>
  );

  return (
    <div style={{ width: '100%', height: '100%', background: bg, padding: 24, overflow: 'hidden',
                  display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {[
          { lbl: 'Pending review', val: counts.pending, sub: '4 awaiting first response', tone: '#D4860B' },
          { lbl: 'Auto-flagged', val: counts.flagged, sub: 'spam / abuse / off-topic', tone: '#C62828' },
          { lbl: 'Avg rating · 30d', val: '4.6', sub: '↑ 0.2 vs last month', tone: BARTAL.success },
          { lbl: 'Verified buyers', val: '94%', sub: 'rest are guest reviews', tone: '#1B3A6B' },
          { lbl: 'Median response', val: '3h 12m', sub: 'target: under 24h', tone: BARTAL.success },
        ].map((k, i) => (
          <div key={i} style={{ background: surface, border: `1px solid ${line}`, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 10, color: muted, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700, marginBottom: 6 }}>{k.lbl}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: k.tone }}>{k.val}</div>
            <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 14, flex: 1, minHeight: 0 }}>
        {/* List */}
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${line}` }}>
            {[
              { k: 'pending', l: 'Pending', n: counts.pending },
              { k: 'flagged', l: 'Flagged', n: counts.flagged },
              { k: 'approved', l: 'Approved', n: counts.approved },
              { k: 'rejected', l: 'Rejected', n: counts.rejected },
            ].map(t => {
              const on = t.k === filter;
              return (
                <div key={t.k} onClick={() => setFilter(t.k)} style={{
                  flex: 1, padding: '11px 6px', textAlign: 'center', cursor: 'pointer',
                  borderBottom: on ? `2px solid #D4860B` : '2px solid transparent',
                  fontSize: 12, fontWeight: 600,
                  color: on ? '#D4860B' : muted,
                  background: on ? (dark ? BARTAL.d_raised : '#FDF4E2') : 'transparent',
                }}>
                  {t.l} <span style={{ fontWeight: 700 }}>{t.n}</span>
                </div>
              );
            })}
          </div>

          <div style={{ overflow: 'auto', flex: 1 }}>
            {filtered.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: muted, fontSize: 13 }}>
                Nothing to moderate here.
              </div>
            )}
            {filtered.map((r, i) => {
              const on = r.id === selected;
              return (
                <div key={r.id} onClick={() => setSelected(r.id)} style={{
                  padding: '14px 16px', cursor: 'pointer',
                  background: on ? (dark ? BARTAL.d_raised : '#FDF4E2') : 'transparent',
                  borderInlineStart: on ? `3px solid #D4860B` : '3px solid transparent',
                  borderBottom: i < filtered.length - 1 ? `1px solid ${line}` : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Stars n={r.stars} size={12}/>
                      {r.flagged && (
                        <div style={{
                          background: '#FBE9E7', color: '#C62828', borderRadius: 4,
                          padding: '1px 6px', fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
                        }}>FLAGGED</div>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: muted }}>{r.time}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 4, lineHeight: 1.3 }}>
                    {r.title}
                  </div>
                  <div style={{ fontSize: 11, color: muted, lineHeight: 1.5,
                                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {r.body}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, fontSize: 10, color: muted }}>
                    <span style={{ fontWeight: 600, color: text }}>{r.name}</span>
                    {r.verified && (
                      <span style={{ background: '#E5F4E8', color: BARTAL.success, padding: '1px 6px', borderRadius: 3, fontWeight: 600 }}>
                        ✓ Verified
                      </span>
                    )}
                    {r.photos > 0 && <span>📷 {r.photos}</span>}
                    <span style={{ marginInlineStart: 'auto' }}>{r.product}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail */}
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'auto' }}>
          {/* header strip */}
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${line}`,
                        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', gap: 14, flex: 1 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%', background: '#1B3A6B',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                fontWeight: 700, fontSize: 14, flexShrink: 0,
              }}>{sel.name.split(' ').map(s => s[0]).slice(0,2).join('')}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: text }}>{sel.name}</div>
                  {sel.verified
                    ? <span style={{ background: '#E5F4E8', color: BARTAL.success, padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>✓ Verified buyer</span>
                    : <span style={{ background: '#FFF3E0', color: '#D4860B', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>Guest</span>}
                </div>
                <div style={{ fontSize: 11, color: muted }}>
                  {sel.city} · 4 prior reviews · joined Jan 2026 · {sel.time}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Stars n={sel.stars} size={20}/>
              <div style={{ fontSize: 11, color: muted, marginTop: 4, fontFamily: "'JetBrains Mono'" }}>
                {sel.product} · {sel.sku}
              </div>
            </div>
          </div>

          {/* flag banner */}
          {sel.flagged && sel.status === 'pending' && (
            <div style={{ background: '#FBE9E7', borderInlineStart: `3px solid #C62828`,
                          padding: '12px 24px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ fontSize: 18 }}>⚠</div>
              <div style={{ flex: 1, fontSize: 12, color: '#7F1D1D', lineHeight: 1.5 }}>
                <strong>Auto-flagged.</strong> {sel.flagReason}. Review carefully before approving.
              </div>
            </div>
          )}

          {/* body */}
          <div style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: text, marginBottom: 10 }}>
              {sel.title}
            </div>
            <div style={{ fontSize: 13, color: text, lineHeight: 1.7, marginBottom: 16 }}>
              {sel.body}
            </div>

            {sel.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {sel.tags.map(t => (
                  <div key={t} style={{
                    background: dark ? BARTAL.d_raised : '#EEF1F5', color: '#1B3A6B',
                    padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                  }}>{t}</div>
                ))}
              </div>
            )}

            {sel.photos > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 11, color: muted, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  Customer photos ({sel.photos})
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {Array.from({ length: sel.photos }).map((_, i) => (
                    <div key={i} style={{ width: 100, height: 100, borderRadius: 8, overflow: 'hidden', border: `1px solid ${line}` }}>
                      <ProductPlaceholder label={`photo ${i+1}`} hue={['amber','rose','warm'][i]}/>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Internal context */}
            <div style={{ background: dark ? BARTAL.d_bg : '#FBFAF7', border: `1px solid ${line}`,
                          borderRadius: 10, padding: 14, marginBottom: 18 }}>
              <div style={{ fontSize: 10, color: muted, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700, marginBottom: 8 }}>
                Internal context
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12 }}>
                {[
                  ['Order', 'BRT-2026-00842', true],
                  ['Delivered', 'Apr 16, 2026 (3 days ago)', false],
                  ['Avg rating', '4.7 from 128 reviews', false],
                  ['Past flagged', '0 reviews', false],
                  ['Order value', '228,000 SDG', false],
                  ['NPS', 'Promoter (9/10)', false],
                ].map(([k, v, mono], i) => (
                  <div key={i}>
                    <div style={{ color: muted, marginBottom: 2 }}>{k}</div>
                    <div style={{ color: text, fontWeight: 600, fontFamily: mono ? "'JetBrains Mono'" : "'Poppins'" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action zone */}
            {sel.status === 'pending' ? (
              <>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <button style={{
                    flex: 1, background: BARTAL.success, color: '#fff', border: 'none',
                    borderRadius: 10, padding: '12px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    fontFamily: "'Poppins'", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}>
                    ✓ Approve & publish
                  </button>
                  <button style={{
                    background: '#fff', color: '#1B3A6B', border: `1px solid #1B3A6B`,
                    borderRadius: 10, padding: '12px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    fontFamily: "'Poppins'",
                  }}>Reply</button>
                  <button style={{
                    background: '#fff', color: '#C62828', border: `1px solid #C62828`,
                    borderRadius: 10, padding: '12px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    fontFamily: "'Poppins'",
                  }}>✕ Reject</button>
                </div>

                <div style={{ fontSize: 11, color: muted, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  Reject with reason — sends WhatsApp notification
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {[
                    'Off-topic',
                    'Promotional / spam',
                    'Personal info shared',
                    'Abusive language',
                    'Low quality / no detail',
                    'Suspected fake',
                    'Duplicate review',
                  ].map(r => (
                    <div key={r} style={{
                      padding: '6px 12px', borderRadius: 100,
                      background: dark ? BARTAL.d_raised : '#fff',
                      color: text, border: `1px solid ${line}`,
                      fontSize: 11, fontWeight: 500, cursor: 'pointer',
                    }}>{r}</div>
                  ))}
                </div>

                {/* Reply composer (collapsed-ish) */}
                <div style={{ background: dark ? BARTAL.d_bg : '#FBFAF7', border: `1px solid ${line}`,
                              borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, color: muted, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                    Public reply (appears under the review)
                  </div>
                  <textarea
                    defaultValue={sel.stars <= 2
                      ? "Hi " + sel.name.split(' ')[0] + ", we're sorry to hear about the battery issue. We'd like to make this right — please reply to your order email and we'll arrange a replacement or refund."
                      : "Thank you " + sel.name.split(' ')[0] + " — glad you loved it!"}
                    style={{
                    width: '100%', minHeight: 70, padding: '10px',
                    borderRadius: 8, border: `1px solid ${line}`,
                    background: surface, color: text,
                    fontSize: 12, fontFamily: "'Poppins'", lineHeight: 1.6, outline: 'none', resize: 'vertical',
                  }}/>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                    <div style={{ fontSize: 10, color: muted }}>Signed as <strong>Bartal Support</strong></div>
                    <button style={{
                      background: '#1B3A6B', color: '#fff', border: 'none',
                      borderRadius: 6, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                      fontFamily: "'Poppins'",
                    }}>Approve + reply</button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{
                background: sel.status === 'approved' ? '#E5F4E8' : '#FBE9E7',
                color: sel.status === 'approved' ? BARTAL.success : '#C62828',
                padding: '12px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                {sel.status === 'approved' ? '✓' : '✕'}
                <span>This review has been {sel.status}.</span>
                <button style={{
                  marginInlineStart: 'auto', background: 'transparent', border: '1px solid currentColor',
                  borderRadius: 6, padding: '4px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  color: 'inherit', fontFamily: "'Poppins'",
                }}>Move back to pending</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminReviews });
