// admin-extras.jsx — Product Form, Category Manager, Store Settings, Admin Login
// All use the same navy sidebar + white card pattern from admin-pages.jsx

// ═══════════════════════════════════════════════════════════════
// SHARED: Card, Field, Toggle
// ═══════════════════════════════════════════════════════════════
function AdmCard({ title, sub, dark, action, children, padded = true }) {
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';
  return (
    <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 10, overflow: 'hidden' }}>
      {(title || action) && (
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${line}`,
                      display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            {title && <div style={{ fontSize: 14, fontWeight: 700, color: text }}>{title}</div>}
            {sub && <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{sub}</div>}
          </div>
          {action}
        </div>
      )}
      <div style={{ padding: padded ? 18 : 0 }}>{children}</div>
    </div>
  );
}

function AdmField({ label, hint, required, children, dark, half }) {
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  return (
    <div style={{ gridColumn: half ? 'span 1' : '1 / -1' }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: muted,
        letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 5,
      }}>
        {label}
        {required && <span style={{ color: BARTAL.danger, marginLeft: 3 }}>*</span>}
      </div>
      {children}
      {hint && <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function AdmInput({ value, placeholder, mono, dark, prefix, suffix }) {
  const surface = dark ? BARTAL.d_raised : '#fff';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const text = dark ? BARTAL.d_text : '#111827';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  return (
    <div style={{
      background: surface, border: `1px solid ${line}`, borderRadius: 8,
      padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {prefix && <span style={{ fontSize: 13, color: muted }}>{prefix}</span>}
      <input defaultValue={value} placeholder={placeholder}
             style={{
               flex: 1, background: 'transparent', border: 'none', outline: 'none',
               fontSize: 13, color: text, fontFamily: mono ? "'JetBrains Mono', monospace" : 'inherit',
             }}/>
      {suffix && <span style={{ fontSize: 12, color: muted }}>{suffix}</span>}
    </div>
  );
}

function AdmTextarea({ value, placeholder, rows = 3, dark }) {
  const surface = dark ? BARTAL.d_raised : '#fff';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const text = dark ? BARTAL.d_text : '#111827';
  return (
    <textarea defaultValue={value} placeholder={placeholder} rows={rows}
              style={{
                width: '100%', background: surface, border: `1px solid ${line}`,
                borderRadius: 8, padding: '9px 12px', fontSize: 13, color: text,
                fontFamily: 'inherit', resize: 'vertical', outline: 'none',
              }}/>
  );
}

function AdmToggleRow({ title, sub, on, dark }) {
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0',
                  borderBottom: `1px solid ${line}` }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{
        width: 38, height: 22, borderRadius: 100, padding: 2,
        background: on ? BARTAL.amber : line,
        display: 'flex', justifyContent: on ? 'flex-end' : 'flex-start', alignItems: 'center',
      }}>
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff' }}/>
      </div>
    </div>
  );
}

function AdmBtn({ children, primary, danger, dark, icon, onClick }) {
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const text = dark ? BARTAL.d_text : '#111827';
  const bg = primary ? BARTAL.navy : (danger ? 'transparent' : (dark ? BARTAL.d_raised : '#fff'));
  const fg = primary ? '#fff' : (danger ? BARTAL.danger : text);
  const border = danger ? `1px solid ${BARTAL.danger}40` : (primary ? 'none' : `1px solid ${line}`);
  return (
    <button onClick={onClick} style={{
      background: bg, color: fg, border, borderRadius: 8,
      padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
      fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>{icon}{children}</button>
  );
}

// ═══════════════════════════════════════════════════════════════
// 1. PRODUCT FORM — new/edit a product
// ═══════════════════════════════════════════════════════════════
function AdminProductForm({ dark }) {
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const surface = dark ? BARTAL.d_raised : '#fff';

  const variants = [
    { sku: 'AUR-50-AMB', attr: '50ml · Amber',   price: 45000, stock: 12, on: true },
    { sku: 'AUR-50-OUD', attr: '50ml · Oud',     price: 52000, stock: 8,  on: true },
    { sku: 'AUR-100-AMB',attr: '100ml · Amber',  price: 78000, stock: 3,  on: true },
    { sku: 'AUR-100-OUD',attr: '100ml · Oud',    price: 85000, stock: 0,  on: false },
  ];

  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
      {/* LEFT column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Basic info */}
        <AdmCard title="Product details" dark={dark}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <AdmField label="Name (English)" required dark={dark}>
              <AdmInput value="Ajmal Aurora Eau de Parfum" dark={dark}/>
            </AdmField>
            <AdmField label="الاسم (العربية)" required dark={dark}>
              <AdmInput value="عطر أجمل أورورا" dark={dark}/>
            </AdmField>
            <AdmField label="URL slug" dark={dark} hint="bartal.sd/p/ajmal-aurora">
              <AdmInput value="ajmal-aurora" mono dark={dark}/>
            </AdmField>
            <AdmField label="SKU root" dark={dark}>
              <AdmInput value="AUR" mono dark={dark}/>
            </AdmField>
            <AdmField label="Description (English)" dark={dark}>
              <AdmTextarea rows="3" value="Warm amber opening with heart of jasmine and Arabian oud. Hand-blended in Khartoum." dark={dark}/>
            </AdmField>
            <AdmField label="الوصف (العربية)" dark={dark}>
              <AdmTextarea rows="3" value="افتتاحية عنبر دافئ مع قلب من الياسمين والعود العربي. مصنوع يدوياً في الخرطوم." dark={dark}/>
            </AdmField>
          </div>
        </AdmCard>

        {/* Media */}
        <AdmCard title="Media"
                 sub="First image is the cover. Drag to reorder."
                 dark={dark}
                 action={<AdmBtn dark={dark}>+ Upload</AdmBtn>}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                aspectRatio: '1', borderRadius: 8,
                background: `linear-gradient(135deg, ${['#D4860B', '#1B3A6B', '#B8860B', '#8B4513'][i % 4]}20, ${['#D4860B', '#1B3A6B', '#B8860B', '#8B4513'][i % 4]}40)`,
                border: i === 0 ? `2px solid ${BARTAL.amber}` : `1px solid ${line}`,
                position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, color: muted, fontWeight: 600,
              }}>
                IMG {i + 1}
                {i === 0 && (
                  <div style={{
                    position: 'absolute', top: 6, left: 6,
                    background: BARTAL.amber, color: '#fff',
                    fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 100,
                  }}>COVER</div>
                )}
                <div style={{
                  position: 'absolute', top: 6, right: 6,
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)', color: BARTAL.danger,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                }}>×</div>
              </div>
            ))}
            <div style={{
              aspectRatio: '1', borderRadius: 8, border: `1.5px dashed ${line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: muted, fontSize: 11, fontWeight: 600, cursor: 'pointer',
              gridColumn: 'span 2',
            }}>+ Add images</div>
          </div>
        </AdmCard>

        {/* Variants */}
        <AdmCard title="Variants" sub="Size × Fragrance combinations. Manage stock & pricing per variant." dark={dark}
                 action={<AdmBtn dark={dark}>+ Variant</AdmBtn>}
                 padded={false}>
          <div style={{ padding: '10px 18px', background: dark ? BARTAL.d_bg : '#F9FAFB',
                        borderBottom: `1px solid ${line}`, display: 'grid',
                        gridTemplateColumns: '1fr 1.5fr 1fr 90px 60px 40px', gap: 10,
                        fontSize: 10, fontWeight: 700, color: muted, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            <div>SKU</div><div>Attributes</div><div>Price (SDG)</div><div>Stock</div><div>Active</div><div/>
          </div>
          {variants.map((v, i) => (
            <div key={v.sku} style={{
              padding: '12px 18px', display: 'grid',
              gridTemplateColumns: '1fr 1.5fr 1fr 90px 60px 40px', gap: 10,
              alignItems: 'center', fontSize: 13, color: text,
              borderBottom: i < variants.length - 1 ? `1px solid ${line}` : 'none',
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{v.sku}</div>
              <div>{v.attr}</div>
              <div style={{ fontWeight: 700 }}>{v.price.toLocaleString()}</div>
              <div>
                <span style={{
                  padding: '2px 8px', borderRadius: 100, fontSize: 11, fontWeight: 700,
                  background: v.stock === 0 ? BARTAL.danger + '15' : (v.stock < 5 ? BARTAL.amber + '20' : BARTAL.success + '15'),
                  color: v.stock === 0 ? BARTAL.danger : (v.stock < 5 ? BARTAL.amber : BARTAL.success),
                }}>{v.stock}</span>
              </div>
              <div>
                <div style={{
                  width: 32, height: 18, borderRadius: 100, padding: 2,
                  background: v.on ? BARTAL.amber : line,
                  display: 'flex', justifyContent: v.on ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff' }}/>
                </div>
              </div>
              <div style={{ color: muted, cursor: 'pointer' }}>⋯</div>
            </div>
          ))}
        </AdmCard>

        {/* SEO */}
        <AdmCard title="SEO & social" sub="How this product appears on Google and when shared." dark={dark}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
            <AdmField label="Meta title" dark={dark} hint="50-60 chars ideal">
              <AdmInput value="Ajmal Aurora — Sudanese Oud Fragrance | Bartal" dark={dark}/>
            </AdmField>
            <AdmField label="Meta description" dark={dark} hint="150-160 chars ideal">
              <AdmTextarea rows="2" value="Warm amber and Arabian oud, hand-blended in Khartoum. Free delivery in Zone A/B. Bank transfer accepted." dark={dark}/>
            </AdmField>
            {/* SERP preview */}
            <div style={{ background: dark ? BARTAL.d_bg : '#F9FAFB',
                          border: `1px solid ${line}`, borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 10, color: muted, marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 700 }}>
                SERP preview
              </div>
              <div style={{ fontSize: 13, color: '#5F6368', marginBottom: 3 }}>bartal.sd › p › ajmal-aurora</div>
              <div style={{ fontSize: 16, color: '#1A0DAB', fontWeight: 500, marginBottom: 4, lineHeight: 1.3 }}>
                Ajmal Aurora — Sudanese Oud Fragrance | Bartal
              </div>
              <div style={{ fontSize: 13, color: '#4D5156', lineHeight: 1.5 }}>
                Warm amber and Arabian oud, hand-blended in Khartoum. Free delivery in Zone A/B...
              </div>
            </div>
          </div>
        </AdmCard>
      </div>

      {/* RIGHT rail */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AdmCard title="Status" dark={dark}>
          <div style={{ display: 'grid', gap: 8 }}>
            {[
              { k: 'draft',     l: 'Draft',     sub: 'Hidden' },
              { k: 'active',    l: 'Active',    sub: 'Live on bartal.sd', on: true },
              { k: 'archived',  l: 'Archived',  sub: 'Hidden from catalog' },
            ].map(s => (
              <div key={s.k} style={{
                padding: 12, borderRadius: 8,
                background: s.on ? BARTAL.amberTint : (dark ? BARTAL.d_bg : '#F9FAFB'),
                border: `1px solid ${s.on ? BARTAL.amber : line}`,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: `2px solid ${s.on ? BARTAL.amber : line}`,
                  background: s.on ? BARTAL.amber : 'transparent',
                }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: s.on ? BARTAL.amber : text }}>{s.l}</div>
                  <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </AdmCard>

        <AdmCard title="Pricing" dark={dark}>
          <div style={{ display: 'grid', gap: 12 }}>
            <AdmField label="Base price" dark={dark}>
              <AdmInput value="45,000" prefix="SDG" mono dark={dark}/>
            </AdmField>
            <AdmField label="Compare at" dark={dark} hint="Shown struck through">
              <AdmInput value="55,000" prefix="SDG" mono dark={dark}/>
            </AdmField>
            <AdmField label="Cost per item" dark={dark} hint="Internal only — for margin">
              <AdmInput value="22,000" prefix="SDG" mono dark={dark}/>
            </AdmField>
            <div style={{ padding: 10, background: BARTAL.success + '10', borderRadius: 8,
                          fontSize: 12, color: BARTAL.success, fontWeight: 600 }}>
              Margin: 51.1% · 23,000 SDG / unit
            </div>
          </div>
        </AdmCard>

        <AdmCard title="Organization" dark={dark}>
          <div style={{ display: 'grid', gap: 12 }}>
            <AdmField label="Category" dark={dark}>
              <AdmInput value="Beauty › Fragrance" dark={dark}/>
            </AdmField>
            <AdmField label="Brand" dark={dark}>
              <AdmInput value="Ajmal" dark={dark}/>
            </AdmField>
            <AdmField label="Tags" dark={dark}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['oud', 'unisex', 'gift', 'bestseller'].map(t => (
                  <span key={t} style={{
                    background: dark ? BARTAL.d_raised : '#F3F4F6',
                    padding: '4px 10px', borderRadius: 100, fontSize: 11, color: text,
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>{t} <span style={{ color: muted, cursor: 'pointer' }}>×</span></span>
                ))}
                <span style={{
                  border: `1px dashed ${line}`, padding: '4px 10px',
                  borderRadius: 100, fontSize: 11, color: muted, cursor: 'pointer',
                }}>+ Tag</span>
              </div>
            </AdmField>
          </div>
        </AdmCard>

        <AdmCard title="Shipping" dark={dark}>
          <AdmToggleRow title="Physical product" sub="Requires shipping" on={true} dark={dark}/>
          <AdmToggleRow title="Fragile" sub="Extra packaging fee" on={true} dark={dark}/>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
            <AdmField label="Weight" dark={dark}>
              <AdmInput value="0.35" suffix="kg" mono dark={dark}/>
            </AdmField>
            <AdmField label="HS code" dark={dark}>
              <AdmInput value="3303.00" mono dark={dark}/>
            </AdmField>
          </div>
        </AdmCard>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 2. CATEGORY MANAGER — tree with drag-to-reorder
// ═══════════════════════════════════════════════════════════════
function AdminCategories({ dark }) {
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const surface = dark ? BARTAL.d_surface : '#fff';

  const tree = [
    { id: 'elec', name: 'Electronics', ar: 'إلكترونيات', count: 128, icon: '◉', on: true,
      children: [
        { id: 'phones', name: 'Phones & tablets', ar: 'هواتف وأجهزة لوحية', count: 54, on: true },
        { id: 'audio',  name: 'Audio',            ar: 'صوتيات',            count: 32, on: true },
        { id: 'laptops',name: 'Laptops',          ar: 'حواسيب محمولة',     count: 24, on: true },
        { id: 'access', name: 'Accessories',      ar: 'إكسسوارات',         count: 18, on: true },
      ] },
    { id: 'beauty', name: 'Beauty & fragrance', ar: 'الجمال والعطور', count: 96, icon: '✦', on: true,
      children: [
        { id: 'frag',   name: 'Fragrance',  ar: 'عطور',      count: 38, on: true },
        { id: 'skin',   name: 'Skincare',   ar: 'عناية البشرة', count: 31, on: true },
        { id: 'hair',   name: 'Haircare',   ar: 'العناية بالشعر', count: 15, on: true },
        { id: 'makeup', name: 'Makeup',     ar: 'مكياج',     count: 12, on: false },
      ] },
    { id: 'home', name: 'Home & kitchen', ar: 'المنزل والمطبخ', count: 64, icon: '⌂', on: true,
      children: [
        { id: 'cook',   name: 'Cookware',   ar: 'أواني الطبخ', count: 22, on: true },
        { id: 'decor',  name: 'Decor',      ar: 'ديكور',      count: 18, on: true },
        { id: 'textile',name: 'Textiles',   ar: 'منسوجات',    count: 24, on: true },
      ] },
    { id: 'fashion', name: 'Fashion', ar: 'الأزياء', count: 36, icon: '✧', on: false, children: [] },
  ];

  const [selected, setSelected] = React.useState('frag');
  const flatten = (arr) => arr.flatMap(x => [x, ...(x.children || [])]);
  const sel = flatten(tree).find(x => x.id === selected) || tree[0];

  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>
      {/* Tree */}
      <AdmCard title="Category tree" sub={`${tree.length} top-level · ${tree.reduce((s, t) => s + (t.children?.length || 0), 0)} subcategories`}
               dark={dark}
               action={<AdmBtn primary dark={dark}>+ New category</AdmBtn>}
               padded={false}>
        <div>
          {tree.map((cat, ci) => (
            <div key={cat.id}>
              <div onClick={() => setSelected(cat.id)} style={{
                padding: '12px 18px', display: 'grid',
                gridTemplateColumns: '20px 28px 1fr 60px 80px 40px 40px', gap: 10,
                alignItems: 'center', cursor: 'pointer',
                background: selected === cat.id ? BARTAL.amberTint : 'transparent',
                borderLeft: selected === cat.id ? `3px solid ${BARTAL.amber}` : '3px solid transparent',
                borderBottom: `1px solid ${line}`,
              }}>
                <div style={{ color: muted, cursor: 'grab', fontSize: 14 }}>⋮⋮</div>
                <div style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: BARTAL.amberTint, color: BARTAL.amber,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 700,
                }}>{cat.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: selected === cat.id ? BARTAL.amber : text }}>
                    {cat.name} <span style={{ color: muted, fontWeight: 500, fontSize: 11, fontFamily: "'Cairo'" }}>· {cat.ar}</span>
                  </div>
                  <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>{cat.children?.length || 0} subcategories</div>
                </div>
                <div style={{ fontSize: 12, color: text, fontWeight: 600, textAlign: 'center' }}>{cat.count}</div>
                <div>
                  <span style={{
                    padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                    background: cat.on ? BARTAL.success + '15' : line,
                    color: cat.on ? BARTAL.success : muted,
                  }}>{cat.on ? 'LIVE' : 'HIDDEN'}</span>
                </div>
                <div style={{ color: muted, fontSize: 14, textAlign: 'center' }}>✎</div>
                <div style={{ color: muted, fontSize: 14, textAlign: 'center' }}>▾</div>
              </div>

              {cat.children?.map(child => (
                <div key={child.id} onClick={() => setSelected(child.id)} style={{
                  padding: '10px 18px 10px 58px', display: 'grid',
                  gridTemplateColumns: '20px 1fr 60px 80px 40px 40px', gap: 10,
                  alignItems: 'center', cursor: 'pointer',
                  background: selected === child.id ? BARTAL.amberTint : (dark ? BARTAL.d_bg : '#FAFBFC'),
                  borderLeft: selected === child.id ? `3px solid ${BARTAL.amber}` : '3px solid transparent',
                  borderBottom: `1px solid ${line}`,
                }}>
                  <div style={{ color: muted, fontSize: 12 }}>└</div>
                  <div>
                    <div style={{ fontSize: 13, color: selected === child.id ? BARTAL.amber : text, fontWeight: 600 }}>
                      {child.name} <span style={{ color: muted, fontWeight: 400, fontSize: 11, fontFamily: "'Cairo'" }}>· {child.ar}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: text, textAlign: 'center' }}>{child.count}</div>
                  <div>
                    <span style={{
                      padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                      background: child.on ? BARTAL.success + '15' : line,
                      color: child.on ? BARTAL.success : muted,
                    }}>{child.on ? 'LIVE' : 'HIDDEN'}</span>
                  </div>
                  <div style={{ color: muted, fontSize: 12, textAlign: 'center' }}>✎</div>
                  <div style={{ color: muted, fontSize: 14, textAlign: 'center' }}>⋯</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </AdmCard>

      {/* Detail */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AdmCard title="Edit category" dark={dark}>
          <div style={{
            padding: 14, background: BARTAL.amberTint, border: `1px solid ${BARTAL.amber}40`,
            borderRadius: 8, marginBottom: 14, display: 'flex', gap: 10, alignItems: 'center',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 8,
              background: BARTAL.amber, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>{sel.icon || '✦'}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: text }}>{sel.name}</div>
              <div style={{ fontSize: 11, color: BARTAL.amber, marginTop: 1, fontWeight: 600 }}>
                {sel.count} products · /c/{sel.id}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <AdmField label="Name (English)" dark={dark}>
              <AdmInput value={sel.name} dark={dark}/>
            </AdmField>
            <AdmField label="الاسم (العربية)" dark={dark}>
              <AdmInput value={sel.ar} dark={dark}/>
            </AdmField>
            <AdmField label="URL slug" dark={dark}>
              <AdmInput value={sel.id} mono dark={dark}/>
            </AdmField>
            <AdmField label="Icon" dark={dark}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['✦', '◉', '⌂', '✧', '◈', '⊛', '❖', '✺'].map(g => (
                  <div key={g} style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: (sel.icon || '✦') === g ? BARTAL.amberTint : (dark ? BARTAL.d_raised : '#F3F4F6'),
                    border: (sel.icon || '✦') === g ? `2px solid ${BARTAL.amber}` : `1px solid ${line}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, color: (sel.icon || '✦') === g ? BARTAL.amber : text,
                    cursor: 'pointer',
                  }}>{g}</div>
                ))}
              </div>
            </AdmField>
            <AdmField label="Parent category" dark={dark}>
              <AdmInput value="— (top level)" dark={dark}/>
            </AdmField>
          </div>
        </AdmCard>

        <AdmCard title="Display settings" dark={dark}>
          <AdmToggleRow title="Show in navigation" sub="Appear in top menu" on={true} dark={dark}/>
          <AdmToggleRow title="Show on homepage" sub="Category grid tile" on={sel.id === 'frag'} dark={dark}/>
          <AdmToggleRow title="Live" sub="Products visible to customers" on={sel.on} dark={dark}/>
        </AdmCard>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 3. STORE SETTINGS — bank accounts, localization, policies, checkout
// ═══════════════════════════════════════════════════════════════
function AdminSettings({ dark }) {
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const text = dark ? BARTAL.d_text : '#111827';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const surface = dark ? BARTAL.d_surface : '#fff';

  const [tab, setTab] = React.useState('general');
  const tabs = [
    { k: 'general',  l: 'General' },
    { k: 'banking',  l: 'Banking & receipts' },
    { k: 'checkout', l: 'Checkout' },
    { k: 'tax',      l: 'Tax' },
    { k: 'locale',   l: 'Languages' },
    { k: 'team',     l: 'Team & permissions' },
    { k: 'legal',    l: 'Legal pages' },
    { k: 'integr',   l: 'Integrations' },
  ];

  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16 }}>
      {/* Left tabs */}
      <div style={{
        background: surface, border: `1px solid ${line}`, borderRadius: 10,
        overflow: 'hidden', alignSelf: 'start',
      }}>
        {tabs.map((t, i) => (
          <div key={t.k} onClick={() => setTab(t.k)} style={{
            padding: '11px 16px', fontSize: 13,
            fontWeight: tab === t.k ? 700 : 500,
            color: tab === t.k ? BARTAL.amber : text,
            background: tab === t.k ? BARTAL.amberTint : 'transparent',
            borderLeft: tab === t.k ? `3px solid ${BARTAL.amber}` : '3px solid transparent',
            borderBottom: i < tabs.length - 1 ? `1px solid ${line}` : 'none',
            cursor: 'pointer',
          }}>{t.l}</div>
        ))}
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {tab === 'general' && (
          <>
            <AdmCard title="Store profile" dark={dark}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <AdmField label="Store name" dark={dark}>
                  <AdmInput value="Bartal · برتال" dark={dark}/>
                </AdmField>
                <AdmField label="Legal name" dark={dark}>
                  <AdmInput value="Bartal Digital Trading Ltd." dark={dark}/>
                </AdmField>
                <AdmField label="Contact email" dark={dark}>
                  <AdmInput value="hello@bartal.sd" dark={dark}/>
                </AdmField>
                <AdmField label="Support phone" dark={dark}>
                  <AdmInput value="+249 183 456 789" mono dark={dark}/>
                </AdmField>
                <AdmField label="WhatsApp Business" dark={dark}>
                  <AdmInput value="+249 91 777 4455" mono dark={dark}/>
                </AdmField>
                <AdmField label="Country" dark={dark}>
                  <AdmInput value="Sudan (SD)" dark={dark}/>
                </AdmField>
                <AdmField label="Primary currency" dark={dark}>
                  <AdmInput value="SDG — Sudanese Pound" dark={dark}/>
                </AdmField>
                <AdmField label="Timezone" dark={dark}>
                  <AdmInput value="Africa/Khartoum (UTC+2)" dark={dark}/>
                </AdmField>
              </div>
            </AdmCard>
            <AdmCard title="Business address" dark={dark}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <AdmField label="Street" dark={dark} hint="Shown on invoices">
                  <AdmInput value="Amarat, Street 15, Building 4" dark={dark}/>
                </AdmField>
                <AdmField label="City" dark={dark}>
                  <AdmInput value="Khartoum" dark={dark}/>
                </AdmField>
                <AdmField label="State" dark={dark}>
                  <AdmInput value="Khartoum State" dark={dark}/>
                </AdmField>
                <AdmField label="Postal code" dark={dark}>
                  <AdmInput value="11111" mono dark={dark}/>
                </AdmField>
              </div>
            </AdmCard>
          </>
        )}

        {tab === 'banking' && (
          <>
            <AdmCard title="Receiving bank accounts"
                     sub="Customers transfer to one of these accounts and upload proof. Order at top = default shown at checkout."
                     dark={dark}
                     action={<AdmBtn primary dark={dark}>+ Add account</AdmBtn>}
                     padded={false}>
              {[
                { bank: 'Faisal Islamic Bank', branch: 'Khartoum Main',  acct: '0012 3456 7890 1234',
                  name: 'Bartal Trading Ltd', iban: 'SD55 0042 0012 3456 7890 1234', on: true, default: true },
                { bank: 'Bank of Khartoum',    branch: 'Amarat branch',  acct: '0055 9876 5432 1000',
                  name: 'Bartal Trading Ltd', iban: 'SD23 0007 0055 9876 5432 1000', on: true },
                { bank: 'Omdurman National Bank', branch: 'Souq Shaabi', acct: '0099 1122 3344 5566',
                  name: 'Bartal Trading Ltd', iban: 'SD91 0015 0099 1122 3344 5566', on: false },
              ].map((b, i) => (
                <div key={i} style={{
                  padding: 16, borderBottom: `1px solid ${line}`,
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 100px 70px', gap: 12, alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: text }}>{b.bank}</div>
                    <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{b.branch}</div>
                    {b.default && (
                      <span style={{
                        display: 'inline-block', marginTop: 6,
                        padding: '2px 8px', borderRadius: 100,
                        background: BARTAL.amberTint, color: BARTAL.amber,
                        fontSize: 10, fontWeight: 700,
                      }}>● DEFAULT</span>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: muted, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase' }}>Account #</div>
                    <div style={{ fontSize: 13, color: text, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{b.acct}</div>
                    <div style={{ fontSize: 11, color: muted, marginTop: 3 }}>{b.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: muted, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase' }}>IBAN</div>
                    <div style={{ fontSize: 12, color: text, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{b.iban}</div>
                  </div>
                  <div>
                    <span style={{
                      padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700,
                      background: b.on ? BARTAL.success + '15' : line,
                      color: b.on ? BARTAL.success : muted,
                    }}>{b.on ? 'ACTIVE' : 'INACTIVE'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <div style={{ color: muted, cursor: 'pointer', fontSize: 14 }}>✎</div>
                    <div style={{ color: muted, cursor: 'pointer', fontSize: 14 }}>⋯</div>
                  </div>
                </div>
              ))}
            </AdmCard>
            <AdmCard title="Receipt review settings" dark={dark}>
              <AdmToggleRow title="Auto-flag receipts > 500,000 SDG" sub="Requires manager approval" on={true} dark={dark}/>
              <AdmToggleRow title="Require clear receipt image" sub="AI blur/clarity check before human review" on={true} dark={dark}/>
              <AdmToggleRow title="Auto-decline duplicate receipt numbers" sub="Reject if same ref within 24h" on={true} dark={dark}/>
              <AdmToggleRow title="WhatsApp notification to customer on review" sub="On approve AND reject" on={true} dark={dark}/>
              <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <AdmField label="Review SLA target" dark={dark} hint="Shown to customer as promise">
                  <AdmInput value="15" suffix="minutes" mono dark={dark}/>
                </AdmField>
                <AdmField label="Auto-cancel if receipt unpaid" dark={dark}>
                  <AdmInput value="24" suffix="hours" mono dark={dark}/>
                </AdmField>
              </div>
            </AdmCard>
          </>
        )}

        {tab === 'checkout' && (
          <>
            <AdmCard title="Checkout behavior" dark={dark}>
              <AdmToggleRow title="Guest checkout" sub="Allow orders without signup" on={false} dark={dark}/>
              <AdmToggleRow title="Require phone verification (OTP)" sub="SMS or WhatsApp before first order" on={true} dark={dark}/>
              <AdmToggleRow title="Require email" sub="For order updates and receipts" on={false} dark={dark}/>
              <AdmToggleRow title="Save cards / accounts" sub="Tokenize for returning customers" on={true} dark={dark}/>
              <AdmToggleRow title="Show abandoned cart recovery" sub="WhatsApp nudge after 2h" on={true} dark={dark}/>
            </AdmCard>
            <AdmCard title="Payment methods" sub="Order determines display priority at checkout" dark={dark}>
              {[
                { k: 'bank',  l: 'Bank transfer',  sub: 'Faisal, BOK, ONB — receipt upload', on: true, order: 1 },
                { k: 'cash',  l: 'Cash on delivery', sub: 'Zone A/B only · +500 SDG fee', on: true, order: 2 },
                { k: 'mbok',  l: 'mBOK wallet',     sub: 'Coming Q3 2026',                    on: false, order: 3 },
                { k: 'visa',  l: 'Visa / Mastercard', sub: 'Not available in Sudan',          on: false, order: 4 },
              ].map(m => (
                <div key={m.k} style={{
                  padding: '12px 0', borderBottom: `1px solid ${line}`,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{ color: muted, fontSize: 14, cursor: 'grab' }}>⋮⋮</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: text }}>{m.l}</div>
                    <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{m.sub}</div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    padding: '3px 10px', borderRadius: 100,
                    background: m.on ? BARTAL.success + '15' : line,
                    color: m.on ? BARTAL.success : muted,
                  }}>{m.on ? 'ENABLED' : 'DISABLED'}</span>
                  <div style={{
                    width: 32, height: 18, borderRadius: 100, padding: 2,
                    background: m.on ? BARTAL.amber : line,
                    display: 'flex', justifyContent: m.on ? 'flex-end' : 'flex-start',
                  }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff' }}/>
                  </div>
                </div>
              ))}
            </AdmCard>
          </>
        )}

        {tab === 'tax' && (
          <AdmCard title="Tax (VAT)" sub="Sudan VAT configuration" dark={dark}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <AdmField label="Standard VAT rate" dark={dark}>
                <AdmInput value="17" suffix="%" mono dark={dark}/>
              </AdmField>
              <AdmField label="Display prices" dark={dark}>
                <AdmInput value="Including VAT" dark={dark}/>
              </AdmField>
              <AdmField label="Tax registration #" dark={dark}>
                <AdmInput value="SD-VAT-2024-08976" mono dark={dark}/>
              </AdmField>
              <AdmField label="Tax reporting period" dark={dark}>
                <AdmInput value="Monthly" dark={dark}/>
              </AdmField>
            </div>
            <div style={{ marginTop: 14 }}>
              <AdmToggleRow title="Charge VAT on shipping" on={true} dark={dark}/>
              <AdmToggleRow title="Include VAT number on invoices" on={true} dark={dark}/>
              <AdmToggleRow title="VAT-exempt categories (books, medical)" on={false} dark={dark}/>
            </div>
          </AdmCard>
        )}

        {tab === 'locale' && (
          <AdmCard title="Languages & localization" dark={dark}>
            <div style={{ display: 'grid', gap: 10, marginBottom: 14 }}>
              {[
                { code: 'ar', name: 'العربية (Arabic)', dir: 'RTL', on: true,  primary: true,
                  progress: 100 },
                { code: 'en', name: 'English',          dir: 'LTR', on: true,
                  progress: 100 },
                { code: 'fr', name: 'Français',         dir: 'LTR', on: false,
                  progress: 34 },
              ].map(l => (
                <div key={l.code} style={{
                  padding: 14, border: `1px solid ${line}`, borderRadius: 10,
                  background: l.primary ? BARTAL.amberTint : 'transparent',
                  display: 'grid', gridTemplateColumns: '60px 1fr 90px 60px 50px', gap: 14, alignItems: 'center',
                }}>
                  <div style={{
                    fontSize: 14, fontWeight: 800, color: l.primary ? BARTAL.amber : text,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>{l.code.toUpperCase()}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: text }}>
                      {l.name}
                      {l.primary && <span style={{ fontSize: 10, color: BARTAL.amber, marginLeft: 8, fontWeight: 700 }}>● PRIMARY</span>}
                    </div>
                    <div style={{ fontSize: 11, color: muted, marginTop: 3 }}>Direction: {l.dir}</div>
                  </div>
                  <div>
                    <div style={{
                      height: 6, borderRadius: 3, background: line, overflow: 'hidden', marginBottom: 4,
                    }}>
                      <div style={{ width: `${l.progress}%`, height: '100%',
                                    background: l.progress === 100 ? BARTAL.success : BARTAL.amber }}/>
                    </div>
                    <div style={{ fontSize: 10, color: muted, fontWeight: 600 }}>{l.progress}% translated</div>
                  </div>
                  <span style={{
                    padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                    background: l.on ? BARTAL.success + '15' : line,
                    color: l.on ? BARTAL.success : muted, textAlign: 'center',
                  }}>{l.on ? 'LIVE' : 'DRAFT'}</span>
                  <div style={{ color: muted, fontSize: 14, textAlign: 'center', cursor: 'pointer' }}>⋯</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <AdmBtn dark={dark}>+ Add language</AdmBtn>
              <AdmBtn dark={dark}>Import translations</AdmBtn>
            </div>
          </AdmCard>
        )}

        {tab === 'team' && (
          <AdmCard title="Team members" sub="4 active · 2 invited"
                   dark={dark}
                   action={<AdmBtn primary dark={dark}>+ Invite member</AdmBtn>}
                   padded={false}>
            {[
              { name: 'Fatima Ahmed',  email: 'fatima@bartal.sd',  role: 'Operations',      last: 'Active now',   you: true },
              { name: 'Khalid Osman',  email: 'khalid@bartal.sd',  role: 'Owner',           last: '2h ago' },
              { name: 'Amira Hassan',  email: 'amira@bartal.sd',   role: 'Customer support', last: '15m ago' },
              { name: 'Yasir Abdelrahman', email: 'yasir@bartal.sd', role: 'Warehouse',     last: 'Yesterday' },
              { name: 'Noura El-Tahir', email: 'noura@bartal.sd',  role: 'Finance',         last: 'Invited',      invited: true },
            ].map((m, i) => (
              <div key={i} style={{
                padding: 14, display: 'grid',
                gridTemplateColumns: '40px 1fr 140px 100px 40px', gap: 12, alignItems: 'center',
                borderBottom: `1px solid ${line}`,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: BARTAL.navy, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                }}>{m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: text }}>
                    {m.name} {m.you && <span style={{ fontSize: 10, color: BARTAL.amber, fontWeight: 700, marginLeft: 4 }}>(you)</span>}
                  </div>
                  <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{m.email}</div>
                </div>
                <div>
                  <span style={{
                    padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700,
                    background: m.role === 'Owner' ? BARTAL.amber : (dark ? BARTAL.d_raised : '#F3F4F6'),
                    color: m.role === 'Owner' ? '#fff' : text,
                  }}>{m.role}</span>
                </div>
                <div style={{ fontSize: 11, color: m.invited ? BARTAL.amber : muted, fontWeight: m.invited ? 700 : 500 }}>
                  {m.last}
                </div>
                <div style={{ color: muted, fontSize: 14, textAlign: 'center', cursor: 'pointer' }}>⋯</div>
              </div>
            ))}
          </AdmCard>
        )}

        {tab === 'legal' && (
          <AdmCard title="Legal pages" sub="Linked from footer on bartal.sd" dark={dark} padded={false}>
            {[
              { k: 'terms',   l: 'Terms of service',   updated: '12 Jan 2026', status: 'PUBLISHED' },
              { k: 'privacy', l: 'Privacy policy',     updated: '12 Jan 2026', status: 'PUBLISHED' },
              { k: 'refund',  l: 'Refund policy',      updated: '8 Feb 2026',  status: 'PUBLISHED' },
              { k: 'ship',    l: 'Shipping policy',    updated: '8 Feb 2026',  status: 'PUBLISHED' },
              { k: 'about',   l: 'About Bartal',       updated: '4 Mar 2026',  status: 'DRAFT' },
              { k: 'contact', l: 'Contact',            updated: '—',           status: 'DRAFT' },
            ].map((p, i) => (
              <div key={p.k} style={{
                padding: 14, display: 'grid',
                gridTemplateColumns: '1fr 150px 90px 60px', gap: 12, alignItems: 'center',
                borderBottom: i < 5 ? `1px solid ${line}` : 'none',
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: text }}>{p.l}</div>
                  <div style={{ fontSize: 11, color: muted, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                    bartal.sd/{p.k}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: muted }}>Updated: {p.updated}</div>
                <span style={{
                  padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                  background: p.status === 'PUBLISHED' ? BARTAL.success + '15' : BARTAL.amber + '20',
                  color: p.status === 'PUBLISHED' ? BARTAL.success : BARTAL.amber, textAlign: 'center',
                }}>{p.status}</span>
                <div style={{ color: BARTAL.amber, fontSize: 12, fontWeight: 700, textAlign: 'right', cursor: 'pointer' }}>
                  Edit ›
                </div>
              </div>
            ))}
          </AdmCard>
        )}

        {tab === 'integr' && (
          <AdmCard title="Integrations" dark={dark} padded={false}>
            {[
              { k: 'wa',  l: 'WhatsApp Business API',    sub: 'Order updates, receipt nudges, support',  on: true,  status: 'Connected · 2,148 msgs this month' },
              { k: 'sms', l: 'Sudani / MTN SMS gateway', sub: 'OTP verification, delivery alerts',       on: true,  status: 'Connected · Credit: 14,500 SDG' },
              { k: 'eml', l: 'SendGrid (Email)',         sub: 'Receipts, invoices, marketing',           on: true,  status: 'Connected · 45.2k sent' },
              { k: 'ga',  l: 'Google Analytics 4',       sub: 'Traffic and conversion tracking',         on: true,  status: 'Connected · Property G-XXXXX' },
              { k: 'meta',l: 'Meta Pixel',               sub: 'Facebook/Instagram ads tracking',         on: false, status: 'Not connected' },
              { k: 'slk', l: 'Slack',                    sub: 'Internal alerts — new orders, low stock', on: true,  status: '#orders · #stock' },
              { k: 'api', l: 'Public API',               sub: 'For custom integrations',                 on: true,  status: '3 API keys · 1 webhook' },
            ].map((it, i) => (
              <div key={it.k} style={{
                padding: 14, display: 'grid',
                gridTemplateColumns: '40px 1fr 220px 60px 80px', gap: 12, alignItems: 'center',
                borderBottom: i < 6 ? `1px solid ${line}` : 'none',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: it.on ? BARTAL.amber : (dark ? BARTAL.d_raised : '#F3F4F6'),
                  color: it.on ? '#fff' : muted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 14,
                }}>{it.l[0]}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: text }}>{it.l}</div>
                  <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{it.sub}</div>
                </div>
                <div style={{ fontSize: 11, color: it.on ? BARTAL.success : muted, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" }}>
                  {it.on && '● '}{it.status}
                </div>
                <div style={{
                  width: 32, height: 18, borderRadius: 100, padding: 2,
                  background: it.on ? BARTAL.amber : line,
                  display: 'flex', justifyContent: it.on ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff' }}/>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: BARTAL.amber, cursor: 'pointer', textAlign: 'right' }}>
                  {it.on ? 'Configure' : 'Connect'}
                </div>
              </div>
            ))}
          </AdmCard>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 4. ADMIN LOGIN — separate auth page (not inside AdminShell)
// ═══════════════════════════════════════════════════════════════
function AdminLogin({ dark }) {
  const text = dark ? BARTAL.d_text : '#111827';
  const muted = dark ? BARTAL.d_textMute : '#6B7280';
  const line = dark ? BARTAL.d_line : '#E6E8EC';
  const bg = dark ? BARTAL.d_bg : '#F5F6F8';
  const surface = dark ? BARTAL.d_surface : '#fff';

  return (
    <div dir="ltr" style={{
      width: '100%', height: '100%', background: bg, overflow: 'hidden',
      fontFamily: "'Poppins'", display: 'grid', gridTemplateColumns: '1fr 480px',
    }}>
      {/* Left — brand panel with motif */}
      <div style={{
        background: `linear-gradient(160deg, ${BARTAL.navy} 0%, ${BARTAL.navyInk} 100%)`,
        color: '#fff', position: 'relative', overflow: 'hidden',
        padding: '40px 50px', display: 'flex', flexDirection: 'column',
      }}>
        {/* Motif background */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>
          <defs>
            <pattern id="adm-motif" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <g stroke={BARTAL.amber} strokeWidth="1" fill="none">
                <path d="M40 8 L48 32 L72 24 L60 48 L72 72 L48 64 L40 88 L32 64 L8 72 L20 48 L8 24 L32 32 Z"/>
                <circle cx="40" cy="48" r="4"/>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#adm-motif)"/>
        </svg>

        {/* Logo */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
          <BartalLogo color="#fff" accent={BARTAL.amber} size={28} lang="en"/>
          <span style={{
            padding: '3px 10px', borderRadius: 100,
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            fontSize: 10, fontWeight: 700, letterSpacing: 0.8,
          }}>ADMIN</span>
        </div>

        {/* Copy */}
        <div style={{ position: 'relative', flex: 1, maxWidth: 440 }}>
          <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.15, marginBottom: 16 }}>
            Run the souq.<br/>From anywhere.
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 40 }}>
            Review bank-transfer receipts, manage catalog, and track orders across Khartoum, Omdurman and Bahri — all from one dashboard.
          </div>

          {/* Stats bar */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14,
            padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.15)',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
          }}>
            {[
              { v: '2,847', l: 'Active customers' },
              { v: '112',   l: 'Orders today' },
              { v: '~8min', l: 'Receipt review' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 22, fontWeight: 800, color: BARTAL.amber, fontFamily: "'Poppins'" }}>{s.v}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'relative', fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'flex', gap: 16 }}>
          <span>© 2026 Bartal · برتال</span>
          <span>·</span>
          <span>v2.4.1</span>
          <span>·</span>
          <span>Made in Sudan 🇸🇩</span>
        </div>
      </div>

      {/* Right — form */}
      <div style={{
        background: surface, padding: '60px 56px', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', borderLeft: `1px solid ${line}`,
      }}>
        <div style={{ fontSize: 10, color: BARTAL.amber, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
          Staff sign in
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: text, marginBottom: 8 }}>
          Welcome back
        </div>
        <div style={{ fontSize: 13, color: muted, lineHeight: 1.6, marginBottom: 28 }}>
          Sign in to manage the Bartal store. Customer accounts live at <span style={{ color: BARTAL.navy, fontWeight: 600 }}>bartal.sd/login</span>.
        </div>

        {/* Form fields */}
        <div style={{ display: 'grid', gap: 14 }}>
          <AdmField label="Work email" dark={dark}>
            <AdmInput value="fatima@bartal.sd" dark={dark}/>
          </AdmField>
          <AdmField label="Password" dark={dark}>
            <AdmInput value="••••••••••••" mono dark={dark} suffix={<span style={{ fontSize: 11, color: BARTAL.amber, fontWeight: 700, cursor: 'pointer' }}>SHOW</span>}/>
          </AdmField>

          {/* 2FA reminder */}
          <div style={{
            padding: 12, background: BARTAL.amberTint, border: `1px solid ${BARTAL.amber}40`,
            borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: BARTAL.amber, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, flexShrink: 0,
            }}>◆</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: BARTAL.amber }}>2FA required</div>
              <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>Code will be sent via Authy after password check</div>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: text, cursor: 'pointer', marginTop: 4 }}>
            <input type="checkbox" defaultChecked style={{ accentColor: BARTAL.amber, width: 16, height: 16 }}/>
            Trust this device for 30 days
          </label>

          <button style={{
            background: BARTAL.navy, color: '#fff', border: 'none', borderRadius: 8,
            padding: '14px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'inherit', marginTop: 8,
          }}>Continue to 2FA →</button>

          <div style={{ textAlign: 'center', fontSize: 12, color: muted, marginTop: 8 }}>
            <a style={{ color: BARTAL.amber, fontWeight: 600, textDecoration: 'none' }}>Forgot password?</a>
            <span style={{ margin: '0 10px' }}>·</span>
            <a style={{ color: BARTAL.amber, fontWeight: 600, textDecoration: 'none' }}>Contact owner</a>
          </div>
        </div>

        {/* Security strip */}
        <div style={{
          marginTop: 40, padding: '14px 0', borderTop: `1px solid ${line}`,
          display: 'flex', gap: 18, fontSize: 11, color: muted,
        }}>
          <span>🔒 Secured with TLS 1.3</span>
          <span>·</span>
          <span>SOC 2 compliant</span>
          <span>·</span>
          <span>Activity logged</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  AdmCard, AdmField, AdmInput, AdmTextarea, AdmToggleRow, AdmBtn,
  AdminProductForm, AdminCategories, AdminSettings, AdminLogin,
});
