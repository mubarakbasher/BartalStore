// admin-pages.jsx — Full admin dashboard: multiple pages
// Each page = one focused screen showing real working states.
// Shell (sidebar + topbar) is shared; content swaps based on `page` prop.

// ═══════════════════════════════════════════════════════════════
// SHARED SHELL
// ═══════════════════════════════════════════════════════════════
function AdminShell({ page, setPage, dark, children, title, subtitle, actions }) {
  const bg = dark ? BARTAL.d_bg : '#F5F6F8';
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';

  const NAV = [
    { k: 'dashboard',  lbl: 'Dashboard',      icon: GridIcon },
    { k: 'orders',     lbl: 'Orders',         icon: PackageIcon, badge: 12, children: [
        { k: 'orderDetail', lbl: 'Order detail' },
    ]},
    { k: 'receipts',   lbl: 'Receipts',       icon: CameraIcon, badge: 3, urgent: true },
    { k: 'refunds',    lbl: 'Refunds',        icon: PackageIcon, badge: 4 },
    { k: 'products',   lbl: 'Products',       icon: BagIcon, children: [
        { k: 'productForm', lbl: 'Edit product' },
    ]},
    { k: 'categories', lbl: 'Categories',     icon: GridIcon },
    { k: 'promos',     lbl: 'Promo codes',    icon: BagIcon },
    { k: 'banners',    lbl: 'Banners CMS',    icon: GridIcon },
    { k: 'customers',  lbl: 'Customers',      icon: UserIcon, children: [
        { k: 'customerDetail', lbl: 'Customer detail' },
    ]},
    { k: 'zones',      lbl: 'Delivery zones', icon: TruckIcon },
    { k: 'shipping',   lbl: 'Shipping labels',icon: TruckIcon },
    { k: 'inventory',  lbl: 'Inventory log',  icon: PackageIcon },
    { k: 'abandoned',  lbl: 'Abandoned carts',icon: BagIcon, badge: 7, urgent: true },
    { k: 'analytics',  lbl: 'Analytics',      icon: ChartIcon },
    { k: 'staff',      lbl: 'Staff & audit',  icon: UserIcon },
    { k: 'reviews',    lbl: 'Reviews',        icon: StarIcon, badge: 4 },
    { k: 'templates',  lbl: 'Message templates', icon: CameraIcon },
    { k: 'settings',   lbl: 'Settings',       icon: SettingsIcon },
    { k: 'login',      lbl: 'Sign in page',   icon: UserIcon, hint: 'preview' },
  ];

  return (
    <div dir="ltr" style={{
      width: '100%', height: '100%', background: bg, overflow: 'hidden',
      display: 'flex', fontFamily: "'Poppins', system-ui",
    }}>
      {/* Sidebar */}
      <div style={{
        width: 220, background: BARTAL.navyInk, color: '#fff',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
      }}>
        <div style={{ padding: '20px 16px 10px' }}>
          <BartalLogo color="#fff" accent={BARTAL.amber} size={22} lang="en"/>
        </div>
        <div style={{
          fontSize: 10, color: 'rgba(255,255,255,0.4)',
          letterSpacing: 1.5, textTransform: 'uppercase',
          padding: '14px 16px 6px', fontWeight: 600,
        }}>
          Admin
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 10px' }}>
          {NAV.map(it => {
            const on = page === it.k;
            return (
              <div key={it.k} onClick={() => setPage(it.k)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 10px', borderRadius: 8,
                background: on ? BARTAL.amber : 'transparent',
                fontSize: 13, color: on ? '#fff' : 'rgba(255,255,255,0.75)',
                fontWeight: on ? 700 : 500, cursor: 'pointer',
              }}>
                <it.icon color={on ? '#fff' : 'rgba(255,255,255,0.65)'} size={16}/>
                <span style={{ flex: 1 }}>{it.lbl}</span>
                {it.badge && (
                  <div style={{
                    background: on ? '#fff' : (it.urgent ? BARTAL.danger : BARTAL.amber),
                    color: on ? BARTAL.amber : '#fff',
                    minWidth: 18, height: 18, borderRadius: 9, padding: '0 6px',
                    fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{it.badge}</div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1 }}/>
        <div style={{
          padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 16, background: BARTAL.amber,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 12,
          }}>FA</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Fatima A.</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Operations</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{
          background: surface, borderBottom: `1px solid ${line}`,
          padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: text, lineHeight: 1.2 }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>{subtitle}</div>}
          </div>
          {actions}
          <div style={{
            background: dark ? BARTAL.d_raised : '#F3F4F6', borderRadius: 8,
            padding: '7px 12px', display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 12, color: muted, width: 220,
          }}>
            <SearchIcon color={muted} size={14}/>
            Search orders, products…
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 1. DASHBOARD  — KPIs + recent activity
// ═══════════════════════════════════════════════════════════════
function AdminDashboard({ dark }) {
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';
  const subtle = dark ? BARTAL.d_raised : '#F9FAFB';

  const KPIS = [
    { lbl: 'Revenue today',    val: '1,284,500', unit: 'SDG', delta: '+12.4%', up: true,  hue: BARTAL.amber },
    { lbl: 'Orders today',     val: '47',        unit: '',    delta: '+8',     up: true,  hue: BARTAL.navy },
    { lbl: 'Pending receipts', val: '3',         unit: '',    delta: '2 urgent', up: false, hue: BARTAL.danger, urgent: true },
    { lbl: 'Avg order value',  val: '27,330',    unit: 'SDG', delta: '-1.2%',  up: false, hue: BARTAL.info },
  ];

  // fake 14-day sparkline data
  const spark = [12, 18, 15, 22, 28, 25, 32, 30, 38, 35, 42, 40, 48, 52];
  const sparkMax = Math.max(...spark);

  const RECENT = [
    { id: 'BRT-00847', cust: 'Amira Elhassan',   amt: 95000,  st: 'pending',    zone: 'Khartoum 2' },
    { id: 'BRT-00846', cust: 'Yusuf Bashir',     amt: 182000, st: 'shipped',    zone: 'Bahri' },
    { id: 'BRT-00845', cust: 'Sara M. Ali',      amt: 41500,  st: 'confirmed',  zone: 'Omdurman' },
    { id: 'BRT-00844', cust: 'Omar Siddiq',      amt: 228000, st: 'receipt',    zone: 'Omdurman' },
    { id: 'BRT-00843', cust: 'Hanaa Mohammed',   amt: 67000,  st: 'delivered',  zone: 'Khartoum 1' },
    { id: 'BRT-00842', cust: 'Ibrahim Ahmed',    amt: 114000, st: 'shipped',    zone: 'Khartoum 3' },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
        {KPIS.map((k, i) => (
          <div key={i} style={{
            background: surface, border: `1px solid ${line}`, borderRadius: 12,
            padding: '16px 16px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, insetInlineStart: 0, width: 3, height: '100%',
              background: k.hue,
            }}/>
            <div style={{ fontSize: 11, color: muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {k.lbl}
            </div>
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: text, fontFamily: "'Poppins'" }}>
                {k.val}
              </div>
              {k.unit && <div style={{ fontSize: 12, color: muted, fontWeight: 600 }}>{k.unit}</div>}
            </div>
            <div style={{
              marginTop: 6, fontSize: 11, fontWeight: 600,
              color: k.urgent ? BARTAL.danger : (k.up ? BARTAL.success : muted),
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              {k.up ? '↑' : (k.urgent ? '●' : '↓')} {k.delta} {k.urgent ? '' : 'vs yesterday'}
            </div>
          </div>
        ))}
      </div>

      {/* Chart + status row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 18 }}>
        {/* Revenue chart */}
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: text }}>Revenue · last 14 days</div>
              <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>SDG, daily · 9,842,000 total</div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['7d', '14d', '30d', '90d'].map(r => (
                <div key={r} style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  background: r === '14d' ? BARTAL.amberTint : 'transparent',
                  color: r === '14d' ? BARTAL.amber : muted,
                  border: r === '14d' ? `1px solid ${BARTAL.amber}` : `1px solid transparent`,
                }}>{r}</div>
              ))}
            </div>
          </div>
          {/* SVG chart */}
          <svg viewBox="0 0 600 180" style={{ width: '100%', height: 180 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BARTAL.amber} stopOpacity="0.35"/>
                <stop offset="100%" stopColor={BARTAL.amber} stopOpacity="0"/>
              </linearGradient>
            </defs>
            {/* grid lines */}
            {[0.25, 0.5, 0.75, 1].map((r, i) => (
              <line key={i} x1="30" x2="590" y1={180 - 180*r + 5} y2={180 - 180*r + 5}
                    stroke={line} strokeDasharray="2 4"/>
            ))}
            {/* area + line */}
            {(() => {
              const pts = spark.map((v, i) => {
                const x = 30 + (i * 560 / (spark.length - 1));
                const y = 175 - (v / (sparkMax * 1.1)) * 150;
                return [x, y];
              });
              const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
              const area = path + ` L${pts[pts.length-1][0]},175 L${pts[0][0]},175 Z`;
              return (
                <g>
                  <path d={area} fill="url(#revGrad)"/>
                  <path d={path} fill="none" stroke={BARTAL.amber} strokeWidth="2.5" strokeLinejoin="round"/>
                  {pts.map((p, i) => (
                    <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 4 : 2}
                            fill={i === pts.length - 1 ? BARTAL.amber : '#fff'}
                            stroke={BARTAL.amber} strokeWidth="2"/>
                  ))}
                </g>
              );
            })()}
            {/* day labels */}
            {['Apr 6', 'Apr 9', 'Apr 12', 'Apr 15', 'Apr 18'].map((d, i) => (
              <text key={i} x={30 + i * 140} y={196}
                    fontSize="9" fill={muted} fontFamily="Poppins">{d}</text>
            ))}
          </svg>
        </div>

        {/* Order status pipeline */}
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 14 }}>Order pipeline</div>
          {[
            { s: 'Pending payment',    n: 4,  color: BARTAL.info },
            { s: 'Receipt uploaded',   n: 3,  color: BARTAL.amber, urgent: true },
            { s: 'Payment confirmed',  n: 12, color: BARTAL.success },
            { s: 'Packed',             n: 8,  color: BARTAL.navy },
            { s: 'Out for delivery',   n: 15, color: BARTAL.navyDeep },
            { s: 'Delivered today',    n: 23, color: muted },
          ].map((row, i) => {
            const pct = Math.min(100, (row.n / 25) * 100);
            return (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: text, fontWeight: 500 }}>
                    {row.urgent && <span style={{ color: BARTAL.danger, marginInlineEnd: 5 }}>●</span>}
                    {row.s}
                  </span>
                  <span style={{ color: text, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{row.n}</span>
                </div>
                <div style={{ height: 4, background: dark ? BARTAL.d_raised : '#F3F4F6', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: row.color, borderRadius: 2 }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent orders + top products */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: text }}>Recent orders</div>
            <div style={{ fontSize: 12, color: BARTAL.amber, fontWeight: 600 }}>View all →</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: subtle }}>
                {['Order', 'Customer', 'Zone', 'Amount', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '9px 18px', fontSize: 10,
                                        color: muted, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT.map(r => (
                <tr key={r.id} style={{ borderTop: `1px solid ${line}` }}>
                  <td style={{ padding: '11px 18px', fontFamily: "'JetBrains Mono', monospace", color: text, fontWeight: 500 }}>{r.id}</td>
                  <td style={{ padding: '11px 18px', color: text }}>{r.cust}</td>
                  <td style={{ padding: '11px 18px', color: muted }}>{r.zone}</td>
                  <td style={{ padding: '11px 18px', color: text, fontWeight: 600 }}>
                    {r.amt.toLocaleString()} <span style={{ fontSize: 10, color: muted, fontWeight: 500 }}>SDG</span>
                  </td>
                  <td style={{ padding: '11px 18px' }}><StatusPill st={r.st}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top products */}
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 12 }}>Top sellers · this week</div>
          {CATALOG.slice(0, 4).map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', gap: 10, alignItems: 'center',
              padding: '8px 0', borderTop: i === 0 ? 'none' : `1px solid ${line}`,
            }}>
              <div style={{ width: 36, fontSize: 18, fontWeight: 700, color: muted, textAlign: 'center', fontFamily: "'Poppins'" }}>
                #{i + 1}
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                <ProductPlaceholder label={p.name_en} hue={p.hue}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: text, fontWeight: 600,
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.name_en}
                </div>
                <div style={{ fontSize: 10, color: muted }}>{28 - i * 4} sold · {((28 - i * 4) * p.price).toLocaleString()} SDG</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 2. ORDERS  — list + filters
// ═══════════════════════════════════════════════════════════════
function AdminOrders({ dark }) {
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';
  const subtle = dark ? BARTAL.d_raised : '#F9FAFB';

  const ORDERS = [
    { id: 'BRT-00847', cust: 'Amira Elhassan',  phone: '+249 912 345 678', zone: 'Khartoum 2', items: 3, amt: 95000,  st: 'pending',   date: '19 Apr · 14:48' },
    { id: 'BRT-00846', cust: 'Yusuf Bashir',    phone: '+249 922 888 120', zone: 'Bahri',       items: 1, amt: 182000, st: 'shipped',   date: '19 Apr · 14:12' },
    { id: 'BRT-00845', cust: 'Sara M. Ali',     phone: '+249 918 456 789', zone: 'Omdurman',    items: 2, amt: 41500,  st: 'confirmed', date: '19 Apr · 13:55' },
    { id: 'BRT-00844', cust: 'Omar Siddiq',     phone: '+249 915 778 001', zone: 'Omdurman',    items: 2, amt: 228000, st: 'receipt',   date: '19 Apr · 13:22', urgent: true },
    { id: 'BRT-00843', cust: 'Hanaa Mohammed',  phone: '+249 919 222 555', zone: 'Khartoum 1',  items: 4, amt: 67000,  st: 'delivered', date: '19 Apr · 12:10' },
    { id: 'BRT-00842', cust: 'Ibrahim Ahmed',   phone: '+249 910 111 333', zone: 'Khartoum 3',  items: 2, amt: 114000, st: 'shipped',   date: '19 Apr · 11:45' },
    { id: 'BRT-00841', cust: 'Nada Khalid',     phone: '+249 927 888 111', zone: 'Omdurman',    items: 1, amt: 59900,  st: 'receipt',   date: '19 Apr · 10:30', urgent: true },
    { id: 'BRT-00840', cust: 'Mohammed Tayeb',  phone: '+249 912 999 444', zone: 'Bahri',       items: 3, amt: 147500, st: 'cancelled', date: '19 Apr · 09:08' },
    { id: 'BRT-00839', cust: 'Rania Osman',     phone: '+249 918 111 222', zone: 'Khartoum 2',  items: 2, amt: 82000,  st: 'delivered', date: '18 Apr · 18:42' },
    { id: 'BRT-00838', cust: 'Khalid Ahmed',    phone: '+249 910 555 777', zone: 'Omdurman',    items: 1, amt: 35000,  st: 'confirmed', date: '18 Apr · 17:30' },
  ];

  const TABS = [
    { k: 'all', lbl: 'All',               n: 112 },
    { k: 'receipt', lbl: 'Needs review',  n: 3, urgent: true },
    { k: 'pending', lbl: 'Pending',       n: 4 },
    { k: 'confirmed', lbl: 'Confirmed',   n: 12 },
    { k: 'shipped', lbl: 'Shipped',       n: 15 },
    { k: 'delivered', lbl: 'Delivered',   n: 76 },
    { k: 'cancelled', lbl: 'Cancelled',   n: 2 },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 16,
        borderBottom: `1px solid ${line}`, paddingBottom: 0,
      }}>
        {TABS.map((t, i) => (
          <div key={t.k} style={{
            padding: '10px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            color: i === 0 ? text : muted,
            borderBottom: i === 0 ? `2px solid ${BARTAL.amber}` : '2px solid transparent',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {t.lbl}
            <span style={{
              fontSize: 10, padding: '1px 7px', borderRadius: 10,
              background: t.urgent ? BARTAL.danger : (i === 0 ? BARTAL.amberTint : (dark ? BARTAL.d_raised : '#F3F4F6')),
              color: t.urgent ? '#fff' : (i === 0 ? BARTAL.amber : muted),
              fontWeight: 700,
            }}>{t.n}</span>
          </div>
        ))}
        <div style={{ flex: 1 }}/>
        <div style={{ display: 'flex', gap: 8, paddingBottom: 8 }}>
          <div style={{
            padding: '6px 10px', border: `1px solid ${line}`, borderRadius: 7,
            fontSize: 11, color: muted, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <FilterIcon color={muted} size={12}/>
            Zone: all
          </div>
          <div style={{
            padding: '6px 10px', border: `1px solid ${line}`, borderRadius: 7,
            fontSize: 11, color: muted, fontWeight: 500,
          }}>
            Date: today ▾
          </div>
          <div style={{
            padding: '6px 12px', background: BARTAL.navy, color: '#fff',
            borderRadius: 7, fontSize: 11, fontWeight: 600,
          }}>Export CSV</div>
        </div>
      </div>

      {/* Orders table */}
      <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: subtle }}>
              {['', 'Order', 'Customer', 'Zone', 'Items', 'Amount', 'Status', 'Placed', ''].map((h, i) => (
                <th key={i} style={{
                  textAlign: i === 5 ? 'right' : 'left',
                  padding: '10px 14px', fontSize: 10,
                  color: muted, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ORDERS.map(r => (
              <tr key={r.id} style={{
                borderTop: `1px solid ${line}`,
                background: r.urgent ? (dark ? 'rgba(198,40,40,0.08)' : '#FEF6F6') : 'transparent',
              }}>
                <td style={{ padding: '12px 14px', width: 30 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${line}` }}/>
                </td>
                <td style={{ padding: '12px 14px', fontFamily: "'JetBrains Mono', monospace",
                              color: text, fontWeight: 500 }}>
                  {r.urgent && <span style={{ color: BARTAL.danger, marginInlineEnd: 5 }}>●</span>}
                  {r.id}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ color: text, fontWeight: 500 }}>{r.cust}</div>
                  <div style={{ color: muted, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>{r.phone}</div>
                </td>
                <td style={{ padding: '12px 14px', color: muted }}>
                  <TruckIcon color={muted} size={12}/> <span style={{ marginInlineStart: 5 }}>{r.zone}</span>
                </td>
                <td style={{ padding: '12px 14px', color: text }}>{r.items}</td>
                <td style={{ padding: '12px 14px', color: text, fontWeight: 700, textAlign: 'right' }}>
                  {r.amt.toLocaleString()} <span style={{ fontSize: 10, color: muted, fontWeight: 500 }}>SDG</span>
                </td>
                <td style={{ padding: '12px 14px' }}><StatusPill st={r.st}/></td>
                <td style={{ padding: '12px 14px', color: muted, fontSize: 11 }}>{r.date}</td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ color: muted, fontSize: 16, lineHeight: 1, cursor: 'pointer' }}>⋯</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{
          padding: '12px 18px', borderTop: `1px solid ${line}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 11, color: muted,
        }}>
          <div>Showing 10 of 112 orders</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['‹', '1', '2', '3', '…', '12', '›'].map((p, i) => (
              <div key={i} style={{
                minWidth: 26, padding: '5px 8px', borderRadius: 6, textAlign: 'center',
                background: p === '1' ? BARTAL.navy : 'transparent',
                color: p === '1' ? '#fff' : text, fontWeight: 600,
                border: p === '1' ? 'none' : `1px solid ${line}`,
              }}>{p}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 3. PRODUCTS  — catalog with inline controls
// ═══════════════════════════════════════════════════════════════
function AdminProducts({ dark }) {
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';
  const subtle = dark ? BARTAL.d_raised : '#F9FAFB';

  // extend catalog w/ stock info
  const products = CATALOG.map((p, i) => ({
    ...p,
    sku: `BRT-${String(1001 + i).padStart(4, '0')}`,
    stock: [42, 8, 0, 120, 27, 15][i] ?? 20,
    sold: [156, 89, 203, 312, 45, 78][i] ?? 50,
    active: [true, true, false, true, true, true][i] ?? true,
  }));

  return (
    <div style={{ padding: 24 }}>
      {/* Tabs + actions */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 16,
        borderBottom: `1px solid ${line}`, alignItems: 'flex-end',
      }}>
        {[
          { lbl: 'All products',  n: 324, on: true },
          { lbl: 'Active',        n: 298 },
          { lbl: 'Out of stock',  n: 14, urgent: true },
          { lbl: 'Drafts',        n: 12 },
        ].map((t, i) => (
          <div key={i} style={{
            padding: '10px 14px', fontSize: 12, fontWeight: 600,
            color: t.on ? text : muted,
            borderBottom: t.on ? `2px solid ${BARTAL.amber}` : '2px solid transparent',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {t.lbl}
            <span style={{
              fontSize: 10, padding: '1px 7px', borderRadius: 10,
              background: t.urgent ? BARTAL.danger : (t.on ? BARTAL.amberTint : (dark ? BARTAL.d_raised : '#F3F4F6')),
              color: t.urgent ? '#fff' : (t.on ? BARTAL.amber : muted),
              fontWeight: 700,
            }}>{t.n}</span>
          </div>
        ))}
        <div style={{ flex: 1 }}/>
        <div style={{ display: 'flex', gap: 8, paddingBottom: 8 }}>
          <div style={{
            padding: '7px 12px', border: `1px solid ${line}`, borderRadius: 7,
            fontSize: 12, color: text, fontWeight: 500, background: surface,
          }}>Import CSV</div>
          <div style={{
            padding: '7px 14px', background: BARTAL.amber, color: '#fff',
            borderRadius: 7, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
          }}>+ New product</div>
        </div>
      </div>

      {/* Products table */}
      <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: subtle }}>
              {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Sold', 'Status', ''].map(h => (
                <th key={h} style={{
                  textAlign: 'left', padding: '10px 14px', fontSize: 10,
                  color: muted, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const lowStock = p.stock > 0 && p.stock <= 10;
              const outOfStock = p.stock === 0;
              return (
                <tr key={p.id} style={{ borderTop: `1px solid ${line}` }}>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                        <ProductPlaceholder label={p.name_en} hue={p.hue}/>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ color: text, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>
                          {p.name_en}
                        </div>
                        <div style={{ color: muted, fontSize: 10, fontFamily: "'Cairo'" }}>{p.name_ar}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', color: muted, fontFamily: "'JetBrains Mono', monospace" }}>{p.sku}</td>
                  <td style={{ padding: '10px 14px', color: text, textTransform: 'capitalize' }}>{p.cat}</td>
                  <td style={{ padding: '10px 14px', color: text, fontWeight: 600 }}>
                    {p.price.toLocaleString()} <span style={{ fontSize: 10, color: muted, fontWeight: 500 }}>SDG</span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      color: outOfStock ? BARTAL.danger : (lowStock ? BARTAL.amber : text),
                      fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                    }}>{p.stock}</span>
                    {lowStock && <span style={{ color: BARTAL.amber, fontSize: 10, marginInlineStart: 6 }}>low</span>}
                  </td>
                  <td style={{ padding: '10px 14px', color: muted }}>{p.sold}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '3px 8px', borderRadius: 12,
                      background: p.active ? (dark ? 'rgba(46,125,50,0.15)' : '#E8F5E9') : (dark ? BARTAL.d_raised : '#F3F4F6'),
                      color: p.active ? BARTAL.success : muted,
                      fontSize: 11, fontWeight: 600,
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: 3, background: p.active ? BARTAL.success : muted }}/>
                      {p.active ? 'Active' : 'Draft'}
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', color: muted, fontSize: 16, lineHeight: 1 }}>⋯</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 4. CUSTOMERS
// ═══════════════════════════════════════════════════════════════
function AdminCustomers({ dark }) {
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';
  const subtle = dark ? BARTAL.d_raised : '#F9FAFB';

  const CUSTS = [
    { name: 'Amira Elhassan',   phone: '+249 912 345 678', zone: 'Khartoum 2', orders: 14, spent: 1450000, joined: 'Feb 2025', tier: 'gold' },
    { name: 'Yusuf Bashir',     phone: '+249 922 888 120', zone: 'Bahri',      orders: 9,  spent: 820000,  joined: 'Mar 2025', tier: 'silver' },
    { name: 'Sara M. Ali',      phone: '+249 918 456 789', zone: 'Omdurman',   orders: 22, spent: 2100000, joined: 'Jan 2025', tier: 'gold' },
    { name: 'Omar Siddiq',      phone: '+249 915 778 001', zone: 'Omdurman',   orders: 6,  spent: 510000,  joined: 'Apr 2025', tier: 'silver' },
    { name: 'Hanaa Mohammed',   phone: '+249 919 222 555', zone: 'Khartoum 1', orders: 3,  spent: 180000,  joined: 'Apr 2026', tier: 'new' },
    { name: 'Ibrahim Ahmed',    phone: '+249 910 111 333', zone: 'Khartoum 3', orders: 11, spent: 940000,  joined: 'Feb 2025', tier: 'silver' },
    { name: 'Nada Khalid',      phone: '+249 927 888 111', zone: 'Omdurman',   orders: 1,  spent: 59900,   joined: 'Apr 2026', tier: 'new' },
    { name: 'Mohammed Tayeb',   phone: '+249 912 999 444', zone: 'Bahri',      orders: 18, spent: 1820000, joined: 'Dec 2024', tier: 'gold' },
  ];

  const tierColor = { gold: BARTAL.amber, silver: '#9AA0A6', new: BARTAL.info };

  return (
    <div style={{ padding: 24 }}>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
        {[
          { lbl: 'Total customers',     val: '2,847', sub: '+142 this month' },
          { lbl: 'Repeat rate',         val: '34%',   sub: '+4pt vs last month' },
          { lbl: 'Avg lifetime value',  val: '487k',  sub: 'SDG per customer' },
          { lbl: 'Churn (90 days)',     val: '8.2%',  sub: '-1.1pt' },
        ].map((k, i) => (
          <div key={i} style={{
            background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: '14px 16px',
          }}>
            <div style={{ fontSize: 11, color: muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{k.lbl}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: text, marginTop: 4 }}>{k.val}</div>
            <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Customers table */}
      <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${line}`,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: text }}>All customers</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['All', 'Gold', 'Silver', 'New'].map((t, i) => (
              <div key={t} style={{
                padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                background: i === 0 ? BARTAL.navy : 'transparent',
                color: i === 0 ? '#fff' : muted,
                border: i === 0 ? 'none' : `1px solid ${line}`,
              }}>{t}</div>
            ))}
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: subtle }}>
              {['Customer', 'Phone', 'Zone', 'Orders', 'Spent', 'Joined', 'Tier'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 10,
                                      color: muted, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CUSTS.map((c, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${line}` }}>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 16,
                      background: tierColor[c.tier], color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700,
                    }}>
                      {c.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div style={{ color: text, fontWeight: 500 }}>{c.name}</div>
                  </div>
                </td>
                <td style={{ padding: '12px 14px', color: muted, fontFamily: "'JetBrains Mono', monospace" }}>{c.phone}</td>
                <td style={{ padding: '12px 14px', color: text }}>{c.zone}</td>
                <td style={{ padding: '12px 14px', color: text, fontWeight: 600 }}>{c.orders}</td>
                <td style={{ padding: '12px 14px', color: text, fontWeight: 600 }}>
                  {c.spent.toLocaleString()} <span style={{ fontSize: 10, color: muted, fontWeight: 500 }}>SDG</span>
                </td>
                <td style={{ padding: '12px 14px', color: muted }}>{c.joined}</td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '3px 9px', borderRadius: 12,
                    background: c.tier === 'gold' ? BARTAL.amberTint
                              : c.tier === 'silver' ? (dark ? BARTAL.d_raised : '#F3F4F6')
                              : (dark ? 'rgba(58,109,176,0.15)' : '#E3F2FD'),
                    color: tierColor[c.tier],
                    fontSize: 11, fontWeight: 700, textTransform: 'capitalize',
                  }}>{c.tier}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 5. DELIVERY ZONES  — Khartoum map + pricing
// ═══════════════════════════════════════════════════════════════
function AdminZones({ dark }) {
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';

  const ZONES = [
    { name: 'Khartoum Centre',  code: 'KRT-01', fee: 600,  eta: 'Same day',  active: true,  orders: 42 },
    { name: 'Khartoum North',   code: 'KRT-02', fee: 800,  eta: 'Same day',  active: true,  orders: 28 },
    { name: 'Khartoum South',   code: 'KRT-03', fee: 900,  eta: '1 day',     active: true,  orders: 18 },
    { name: 'Omdurman',         code: 'OMD-01', fee: 800,  eta: '1–2 days',  active: true,  orders: 35 },
    { name: 'Bahri',            code: 'BHR-01', fee: 1000, eta: '1–2 days',  active: true,  orders: 24 },
    { name: 'Soba',             code: 'SOB-01', fee: 1500, eta: '2 days',    active: true,  orders: 7 },
    { name: 'Wadi Seidna',      code: 'WAD-01', fee: 2500, eta: '3 days',    active: false, orders: 0 },
  ];

  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 18 }}>
      {/* Map + zones */}
      <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: text }}>Greater Khartoum zones</div>
            <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>Confluence of the Blue &amp; White Nile</div>
          </div>
          <div style={{ fontSize: 11, color: muted }}>6 active · 1 paused</div>
        </div>
        {/* Stylized map */}
        <div style={{ position: 'relative', height: 380, background: dark ? '#0B1930' : '#F2F6FB' }}>
          <svg viewBox="0 0 400 380" style={{ width: '100%', height: '100%' }}>
            {/* Rivers — White Nile (from south) + Blue Nile (from east) meeting at confluence */}
            <defs>
              <linearGradient id="nile" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6BAED6" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#3A6DB0" stopOpacity="0.9"/>
              </linearGradient>
            </defs>
            {/* White Nile: comes up from bottom-center, curves right */}
            <path d="M150 380 Q160 280 180 220 Q195 180 220 175" stroke="url(#nile)" strokeWidth="16" fill="none" strokeLinecap="round" opacity="0.7"/>
            {/* Blue Nile: comes from right, curves left to meet */}
            <path d="M400 120 Q320 140 260 160 Q235 170 220 175" stroke="url(#nile)" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.7"/>
            {/* Main Nile: goes north after confluence */}
            <path d="M220 175 Q210 130 195 80 Q185 40 175 0" stroke="url(#nile)" strokeWidth="18" fill="none" strokeLinecap="round" opacity="0.75"/>

            {/* Zone pills */}
            {[
              { x: 250, y: 260, n: 'Khartoum\nCentre',  c: BARTAL.amber, on: true,  r: 34 },
              { x: 310, y: 210, n: 'Khartoum\nNorth',   c: BARTAL.navy,  on: true,  r: 30 },
              { x: 300, y: 310, n: 'Khartoum\nSouth',   c: BARTAL.navy,  on: true,  r: 26 },
              { x: 140, y: 180, n: 'Omdurman',          c: BARTAL.navyDeep, on: true, r: 34 },
              { x: 200, y: 90,  n: 'Bahri',             c: BARTAL.amberSoft, on: true, r: 30 },
              { x: 340, y: 340, n: 'Soba',              c: BARTAL.info,  on: true, r: 20 },
              { x: 80,  y: 70,  n: 'Wadi\nSeidna',      c: muted,        on: false, r: 18 },
            ].map((z, i) => (
              <g key={i}>
                <circle cx={z.x} cy={z.y} r={z.r + 8} fill={z.c} opacity={z.on ? 0.15 : 0.08}/>
                <circle cx={z.x} cy={z.y} r={z.r} fill={z.c} opacity={z.on ? 0.85 : 0.3}
                        stroke="#fff" strokeWidth="2"/>
                {z.n.split('\n').map((line, li) => (
                  <text key={li} x={z.x} y={z.y + li * 10 - (z.n.split('\n').length - 1) * 5 + 3}
                        textAnchor="middle" fill="#fff" fontSize="9" fontFamily="Poppins" fontWeight="600">
                    {line}
                  </text>
                ))}
              </g>
            ))}

            {/* Confluence label */}
            <text x="220" y="170" textAnchor="middle" fill={dark ? '#9FB1CE' : '#6B7280'}
                  fontSize="8" fontFamily="Poppins" fontStyle="italic">al-Mogran</text>
          </svg>
        </div>
      </div>

      {/* Zone table */}
      <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${line}`,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: text }}>Pricing &amp; ETA</div>
          <div style={{
            padding: '5px 10px', background: BARTAL.amber, color: '#fff',
            borderRadius: 7, fontSize: 11, fontWeight: 600,
          }}>+ Add zone</div>
        </div>
        {ZONES.map((z, i) => (
          <div key={i} style={{
            padding: '14px 18px', borderTop: i === 0 ? 'none' : `1px solid ${line}`,
            display: 'flex', alignItems: 'center', gap: 12,
            opacity: z.active ? 1 : 0.5,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: text, fontWeight: 600 }}>{z.name}</div>
              <div style={{ fontSize: 10, color: muted, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                {z.code} · {z.eta} · {z.orders} orders this week
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: text }}>
                {z.fee.toLocaleString()} <span style={{ fontSize: 10, color: muted, fontWeight: 500 }}>SDG</span>
              </div>
            </div>
            {/* toggle */}
            <div style={{
              width: 34, height: 18, borderRadius: 9,
              background: z.active ? BARTAL.success : (dark ? BARTAL.d_line : '#D1D5DB'),
              position: 'relative', cursor: 'pointer',
            }}>
              <div style={{
                position: 'absolute', top: 2, insetInlineStart: z.active ? 18 : 2,
                width: 14, height: 14, borderRadius: 7, background: '#fff',
                transition: 'inset-inline-start 0.2s',
              }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 6. ANALYTICS
// ═══════════════════════════════════════════════════════════════
function AdminAnalytics({ dark }) {
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';

  // 30-day revenue series
  const rev = [28, 32, 25, 38, 42, 35, 48, 52, 45, 55, 60, 48, 62, 58, 65, 70, 62, 68, 72, 65, 75, 80, 72, 78, 82, 75, 85, 92, 88, 95];
  const revMax = Math.max(...rev);

  return (
    <div style={{ padding: 24 }}>
      {/* Top KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
        {[
          { lbl: 'Revenue (30d)',       val: '18.4M',   unit: 'SDG', delta: '+24%' },
          { lbl: 'Orders (30d)',        val: '892',     unit: '',    delta: '+18%' },
          { lbl: 'Conversion rate',     val: '3.8%',    unit: '',    delta: '+0.4pt' },
          { lbl: 'Receipt approval',    val: '94%',     unit: '',    delta: 'avg 12 min' },
        ].map((k, i) => (
          <div key={i} style={{
            background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: '14px 16px',
          }}>
            <div style={{ fontSize: 11, color: muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{k.lbl}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 4 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: text }}>{k.val}</div>
              {k.unit && <div style={{ fontSize: 11, color: muted }}>{k.unit}</div>}
            </div>
            <div style={{ fontSize: 11, color: BARTAL.success, marginTop: 2, fontWeight: 600 }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 18, marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: text }}>Revenue · Orders · Receipts</div>
            <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>30-day overlay</div>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            {[
              { lbl: 'Revenue (SDG)', c: BARTAL.amber },
              { lbl: 'Orders',        c: BARTAL.navy },
              { lbl: 'Receipts approved', c: BARTAL.success },
            ].map(l => (
              <div key={l.lbl} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: muted }}>
                <div style={{ width: 12, height: 3, background: l.c, borderRadius: 2 }}/>
                {l.lbl}
              </div>
            ))}
          </div>
        </div>
        {/* bar chart */}
        <svg viewBox="0 0 900 220" style={{ width: '100%', height: 220 }}>
          {[0.25, 0.5, 0.75, 1].map((r, i) => (
            <line key={i} x1="30" x2="890" y1={220 - 200*r + 5} y2={220 - 200*r + 5}
                  stroke={line} strokeDasharray="2 4"/>
          ))}
          {rev.map((v, i) => {
            const x = 30 + i * 28.5;
            const h = (v / (revMax * 1.1)) * 200;
            return (
              <g key={i}>
                <rect x={x} y={215 - h} width="18" height={h} fill={BARTAL.amber} opacity={0.85} rx="2"/>
                <rect x={x + 5} y={215 - h * 0.6} width="8" height={h * 0.6} fill={BARTAL.navy} rx="1"/>
              </g>
            );
          })}
          {['Mar 20', 'Mar 27', 'Apr 3', 'Apr 10', 'Apr 17'].map((d, i) => (
            <text key={i} x={30 + i * 213} y={232} fontSize="9" fill={muted} fontFamily="Poppins">{d}</text>
          ))}
        </svg>
      </div>

      {/* 3-up: top products, category split, hour heatmap */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 14 }}>
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 12 }}>Top products · 30d</div>
          {CATALOG.slice(0, 5).map((p, i) => {
            const pct = [92, 76, 64, 48, 35][i];
            return (
              <div key={p.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: text, fontWeight: 500,
                                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>{p.name_en}</span>
                  <span style={{ color: muted, fontFamily: "'JetBrains Mono', monospace" }}>{Math.floor(pct * 3.4)}</span>
                </div>
                <div style={{ height: 6, background: dark ? BARTAL.d_raised : '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: BARTAL.amber, borderRadius: 3 }}/>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 12 }}>Revenue by category</div>
          {/* Donut */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              {(() => {
                const data = [
                  { lbl: 'Fragrance',   pct: 42, c: BARTAL.amber },
                  { lbl: 'Electronics', pct: 35, c: BARTAL.navy },
                  { lbl: 'Beauty',      pct: 15, c: BARTAL.amberSoft },
                  { lbl: 'Other',       pct: 8,  c: muted },
                ];
                let offset = -90;
                const R = 42, CX = 60, CY = 60, C = 2 * Math.PI * R;
                return data.map((d, i) => {
                  const dash = (d.pct / 100) * C;
                  const rot = offset;
                  offset += (d.pct / 100) * 360;
                  return (
                    <circle key={i} cx={CX} cy={CY} r={R} fill="none"
                            stroke={d.c} strokeWidth="16"
                            strokeDasharray={`${dash} ${C - dash}`}
                            transform={`rotate(${rot} ${CX} ${CY})`}/>
                  );
                });
              })()}
              <text x="60" y="58" textAnchor="middle" fontSize="18" fontWeight="700" fill={text} fontFamily="Poppins">18M</text>
              <text x="60" y="72" textAnchor="middle" fontSize="8" fill={muted} fontFamily="Poppins">SDG · 30d</text>
            </svg>
            <div style={{ flex: 1 }}>
              {[
                { lbl: 'Fragrance',   pct: 42, c: BARTAL.amber },
                { lbl: 'Electronics', pct: 35, c: BARTAL.navy },
                { lbl: 'Beauty',      pct: 15, c: BARTAL.amberSoft },
                { lbl: 'Other',       pct: 8,  c: muted },
              ].map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 0', fontSize: 11 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: d.c }}/>
                  <span style={{ flex: 1, color: text }}>{d.lbl}</span>
                  <span style={{ color: muted, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 12 }}>Orders by hour · last 7d</div>
          {/* heatmap: 7 rows (days) × 24 cols (hours) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, di) => (
              <div key={d} style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <div style={{ width: 22, fontSize: 9, color: muted, fontFamily: "'JetBrains Mono', monospace" }}>{d}</div>
                <div style={{ display: 'flex', gap: 2, flex: 1 }}>
                  {Array.from({ length: 24 }, (_, h) => {
                    // peak at 14-19, lower on Fri night
                    const base = Math.sin((h - 3) / 24 * Math.PI * 1.2) * 0.6 + 0.4;
                    const jitter = ((di * 17 + h * 31) % 11) / 30;
                    const v = Math.max(0, Math.min(1, base + jitter - 0.15));
                    return (
                      <div key={h} style={{
                        flex: 1, height: 14, borderRadius: 2,
                        background: `rgba(212, 134, 11, ${v})`,
                      }}/>
                    );
                  })}
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 2, marginTop: 4, paddingInlineStart: 24 }}>
              {['0', '', '', '6', '', '', '12', '', '', '18', '', '23'].map((h, i) => (
                <div key={i} style={{ flex: 1, fontSize: 8, color: muted, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>{h}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
function StatusPill({ st }) {
  const CFG = {
    pending:   { lbl: 'Pending payment',  bg: '#FEF3C7', fg: '#B45309' },
    receipt:   { lbl: 'Receipt uploaded', bg: '#FEE2E2', fg: '#B91C1C' },
    confirmed: { lbl: 'Confirmed',        bg: '#DBEAFE', fg: '#1E40AF' },
    shipped:   { lbl: 'Shipped',          bg: '#E0E7FF', fg: '#3730A3' },
    delivered: { lbl: 'Delivered',        bg: '#DCFCE7', fg: '#166534' },
    cancelled: { lbl: 'Cancelled',        bg: '#F3F4F6', fg: '#6B7280' },
  };
  const c = CFG[st] || CFG.pending;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 12,
      background: c.bg, color: c.fg,
      fontSize: 11, fontWeight: 600,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: 3, background: c.fg }}/>
      {c.lbl}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXTRA ICONS
// ═══════════════════════════════════════════════════════════════
function ChartIcon({ color = '#000', size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 21h18M6 17v-6M11 17V7M16 17v-9M21 17v-4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>;
}
function SettingsIcon({ color = '#000', size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8"/>
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>;
}
function FilterIcon({ color = '#000', size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>;
}

Object.assign(window, {
  AdminShell, AdminDashboard, AdminOrders, AdminProducts,
  AdminCustomers, AdminZones, AdminAnalytics,
  StatusPill, ChartIcon, SettingsIcon, FilterIcon,
});
