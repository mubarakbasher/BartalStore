// web-admin.jsx — Web (Next.js look) + Admin dashboard overview screens
// These are condensed hero views used in the canvas so the user can see
// all three surfaces at a glance. Full-fidelity enough to judge direction.

// ═══ WEB (Next.js, SSR, AR/EN) ═══
function WebOverview({ lang = 'en', dark = false }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'auto',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
    }}>
      {/* Top announcement bar */}
      <div style={{
        background: BARTAL.navyInk, color: '#fff', padding: '8px 24px',
        fontSize: 12, textAlign: 'center', letterSpacing: 0.3,
      }}>
        {isAr ? 'توصيل مجاني على الطلبات فوق ٥٠٬٠٠٠ ج.س — جميع مناطق الخرطوم' : 'Free delivery on orders over 50,000 SDG — all Khartoum zones'}
      </div>

      {/* Navbar */}
      <div style={{
        background: surface, borderBottom: `1px solid ${line}`,
        padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 28,
      }}>
        <BartalLogo color={dark ? BARTAL.d_text : BARTAL.navy} accent={BARTAL.amber} size={24} lang={lang}/>
        <div style={{ display: 'flex', gap: 20, flex: 1 }}>
          {[
            { ar: 'الرئيسية', en: 'Home', on: true },
            { ar: 'الإلكترونيات', en: 'Electronics' },
            { ar: 'العطور', en: 'Fragrance' },
            { ar: 'العروض', en: 'Offers' },
          ].map((l, i) => (
            <div key={i} style={{
              fontSize: 14, fontWeight: l.on ? 700 : 500,
              color: l.on ? (dark ? BARTAL.d_text : BARTAL.navy) : muted,
              borderBottom: l.on ? `2px solid ${BARTAL.amber}` : 'none',
              paddingBottom: 3,
            }}>{l[lang]}</div>
          ))}
        </div>
        <div style={{
          background: dark ? BARTAL.d_raised : BARTAL.sand, borderRadius: 8, padding: '7px 12px',
          fontSize: 13, color: muted, display: 'flex', alignItems: 'center', gap: 8, width: 240,
        }}>
          <SearchIcon color={muted} size={14}/>
          {t('search', lang)}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: muted }}>{lang === 'ar' ? 'EN' : 'ع'}</div>
          <div style={{ position: 'relative' }}>
            <BagIcon color={text} size={20}/>
            <div style={{
              position: 'absolute', top: -4, insetInlineEnd: -6,
              background: BARTAL.amber, color: '#fff',
              width: 16, height: 16, borderRadius: 8,
              fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>2</div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: '28px 24px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{
          background: BARTAL.navyInk, borderRadius: 16, padding: '30px 26px',
          color: '#fff', position: 'relative', overflow: 'hidden', minHeight: 220,
        }}>
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
            <defs>
              <pattern id="whero" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
                <g stroke={BARTAL.amberSoft} strokeWidth="0.8" fill="none">
                  <path d="M28 4 L33 18 L47 14 L42 26 L54 32 L42 38 L47 50 L33 46 L28 60 L23 46 L9 50 L14 38 L2 32 L14 26 L9 14 L23 18 Z"/>
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#whero)"/>
          </svg>
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: BARTAL.amberSoft, marginBottom: 10, textTransform: 'uppercase' }}>
              {isAr ? 'مجموعة الربيع' : 'Spring collection'}
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.15, marginBottom: 10 }}>
              {isAr ? 'كل ما تحتاجه، من بابك.' : 'Everything you need, delivered.'}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 18, maxWidth: 300 }}>
              {isAr ? 'آلاف المنتجات بأسعار مميزة. توصيل سريع عبر الخرطوم.' : 'Thousands of products at great prices. Fast delivery across Khartoum.'}
            </div>
            <div style={{
              display: 'inline-flex', background: BARTAL.amber, color: '#fff',
              padding: '11px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, gap: 8, alignItems: 'center',
            }}>
              {isAr ? 'تسوق الآن' : 'Shop now'} <ArrowIcon color="#fff" flipped={isAr} size={14}/>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 20 }}>
          {[
            { t_ar: 'إلكترونيات', t_en: 'Electronics', s_ar: 'خصم حتى ٢٥٪', s_en: 'Up to 25% off', hue: 'navy' },
            { t_ar: 'عطور وبخور', t_en: 'Fragrance & Bakhoor', s_ar: 'وصل حديثاً', s_en: 'New arrivals', hue: 'amber' },
          ].map((c, i) => (
            <div key={i} style={{
              borderRadius: 16, position: 'relative', overflow: 'hidden',
            }}>
              <ProductPlaceholder label={c.t_en} hue={c.hue}/>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, rgba(11,25,48,0.65) 0%, transparent 70%)',
                padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                color: '#fff',
              }}>
                <div style={{ fontSize: 11, color: BARTAL.amberSoft, marginBottom: 4 }}>{c[`s_${lang}`]}</div>
                <div style={{ fontSize: 19, fontWeight: 700 }}>{c[`t_${lang}`]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div style={{ padding: '8px 24px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: text }}>{t('featured', lang)}</div>
          <div style={{ fontSize: 13, color: BARTAL.amber, fontWeight: 600 }}>{t('seeAll', lang)} →</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {CATALOG.slice(0, 4).map(p => (
            <div key={p.id} style={{
              background: surface, borderRadius: 12, border: `1px solid ${line}`, overflow: 'hidden',
            }}>
              <div style={{ height: 140 }}><ProductPlaceholder label={p.name_en} hue={p.hue}/></div>
              <div style={{ padding: '10px 12px 12px' }}>
                <div style={{ fontSize: 10, color: muted, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>
                  {p.brand}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: text, minHeight: 34, marginTop: 3,
                              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {isAr ? p.name_ar : p.name_en}
                </div>
                <div style={{ marginTop: 6 }}>
                  <PriceTag amount={p.price} lang={lang} size={13} color={BARTAL.amber}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: dark ? BARTAL.d_surface : BARTAL.sand, padding: '20px 24px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderTop: `1px solid ${line}`, fontSize: 11, color: muted }}>
        <div>© 2026 Bartal · {isAr ? 'الخرطوم، السودان' : 'Khartoum, Sudan'}</div>
        <div style={{ display: 'flex', gap: 16 }}>
          <span>{isAr ? 'سياسة الشحن' : 'Shipping'}</span>
          <span>{isAr ? 'الإرجاع' : 'Returns'}</span>
          <span>{isAr ? 'اتصل بنا' : 'Contact'}</span>
          <span style={{ color: BARTAL.amber }}>WhatsApp +249 91 234 5678</span>
        </div>
      </div>
    </div>
  );
}

// ═══ ADMIN DASHBOARD — receipt verification focus ═══
function AdminOverview({ lang = 'en', dark = false }) {
  const isAr = lang === 'ar';
  const bg = dark ? BARTAL.d_bg : '#F5F6F8';
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';

  return (
    <div dir="ltr" style={{
      width: '100%', height: '100%', background: bg, overflow: 'hidden',
      display: 'flex', fontFamily: "'Poppins', system-ui",
    }}>
      {/* Sidebar */}
      <div style={{
        width: 220, background: BARTAL.navyInk, color: '#fff', padding: '20px 14px',
        display: 'flex', flexDirection: 'column', gap: 18, flexShrink: 0,
      }}>
        <BartalLogo color="#fff" accent={BARTAL.amber} size={22} lang="en"/>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 10 }}>
          Admin
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { lbl: 'Dashboard', icon: GridIcon },
            { lbl: 'Orders', icon: PackageIcon, badge: 8 },
            { lbl: 'Products', icon: BagIcon },
            { lbl: 'Categories', icon: GridIcon },
            { lbl: 'Customers', icon: UserIcon },
            { lbl: 'Delivery zones', icon: TruckIcon },
            { lbl: 'Receipts', icon: CameraIcon, on: true, badge: 3 },
            { lbl: 'Analytics', icon: GridIcon },
          ].map((it, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8,
              background: it.on ? BARTAL.amber : 'transparent',
              fontSize: 13, color: it.on ? '#fff' : 'rgba(255,255,255,0.75)',
              fontWeight: it.on ? 700 : 500,
            }}>
              <it.icon color={it.on ? '#fff' : 'rgba(255,255,255,0.6)'} size={16}/>
              <span style={{ flex: 1 }}>{it.lbl}</span>
              {it.badge && (
                <div style={{
                  background: it.on ? '#fff' : BARTAL.amber, color: it.on ? BARTAL.amber : '#fff',
                  minWidth: 18, height: 18, borderRadius: 9, padding: '0 6px',
                  fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{it.badge}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{
          background: surface, borderBottom: `1px solid ${line}`, padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: text, flex: 1 }}>Receipt verification</div>
          <div style={{ fontSize: 12, color: muted }}>3 pending · 12 today</div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: BARTAL.amber,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: 13 }}>FA</div>
        </div>

        {/* ReceiptViewer — the critical admin component */}
        <div style={{ flex: 1, padding: 20, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, overflow: 'auto' }}>
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${line}`,
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 12, fontWeight: 700, color: text }}>
                  BRT-2026-00842
                </div>
                <div style={{ fontSize: 11, color: muted }}>Uploaded 14 min ago</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['−', '100%', '+'].map((c, i) => (
                  <div key={i} style={{
                    padding: '5px 10px', background: '#F3F4F6', borderRadius: 6,
                    fontSize: 11, fontWeight: 600, color: text,
                  }}>{c}</div>
                ))}
              </div>
            </div>
            {/* receipt image */}
            <div style={{
              height: 340, position: 'relative', background: '#F9FAFB',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
            }}>
              <div style={{
                width: 200, height: 300, background: '#FEFDF5',
                border: '1px solid #E5E7EB', boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                padding: 14, position: 'relative',
                fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 8,
              }}>
                <div style={{ textAlign: 'center', borderBottom: '1px solid #ccc', paddingBottom: 6, marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 11 }}>FAISAL ISLAMIC BANK</div>
                  <div style={{ color: '#666' }}>Transfer receipt</div>
                </div>
                {['Date · 2026-04-19', 'Time · 14:22', 'Ref  · BRT-2026-00842', 'From · M. OSMAN', 'To   · BARTAL ECOM', 'Acct · 0012-345-678-9000', '', 'Amount', '228,000.00 SDG', '', '✓ COMPLETED'].map((r, i) => (
                  <div key={i} style={{ color: r.startsWith('✓') ? BARTAL.success : '#333', marginTop: 3, fontWeight: r.startsWith('✓') ? 700 : 400 }}>{r}</div>
                ))}
              </div>
            </div>
            {/* actions */}
            <div style={{ padding: '14px 16px', borderTop: `1px solid ${line}`, display: 'flex', gap: 10 }}>
              <button style={{
                flex: 1, background: BARTAL.success, color: '#fff', border: 'none',
                padding: '11px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <CheckIcon color="#fff" size={14}/>
                Confirm payment · SMS customer
              </button>
              <button style={{
                background: '#fff', color: BARTAL.danger, border: `1px solid ${BARTAL.danger}`,
                padding: '11px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700,
              }}>Reject</button>
            </div>
          </div>

          {/* Order summary side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 12, color: muted, marginBottom: 8, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Order summary
              </div>
              {[
                ['Customer', 'Mohammed Osman'],
                ['Phone', '+249 912 345 678'],
                ['Zone', 'Omdurman · 1-2 days'],
                ['Items', '2 products'],
                ['Subtotal', '227,000 SDG'],
                ['Delivery', '800 SDG'],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 12 }}>
                  <span style={{ color: muted }}>{k}</span>
                  <span style={{ color: text, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
              <div style={{ height: 1, background: line, margin: '8px 0' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700 }}>
                <span style={{ color: text }}>Total</span>
                <span style={{ color: BARTAL.amber }}>227,800 SDG</span>
              </div>
            </div>

            <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 12, color: muted, marginBottom: 10, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Status history
              </div>
              {[
                { s: 'PENDING', t: '14:08', done: true },
                { s: 'AWAITING_PAYMENT', t: '14:09', done: true },
                { s: 'RECEIPT_UPLOADED', t: '14:22', done: true, now: true },
                { s: 'PAYMENT_CONFIRMED', t: '—', done: false },
                { s: 'SHIPPED', t: '—', done: false },
              ].map((st, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: 5,
                    background: st.done ? (st.now ? BARTAL.amber : BARTAL.success) : line,
                    boxShadow: st.now ? `0 0 0 4px ${BARTAL.amberTint}` : 'none',
                  }}/>
                  <div style={{ flex: 1, fontSize: 11,
                                color: st.done ? text : muted, fontWeight: st.now ? 700 : 500,
                                fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                    {st.s}
                  </div>
                  <div style={{ fontSize: 11, color: muted }}>{st.t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WebOverview, AdminOverview });
