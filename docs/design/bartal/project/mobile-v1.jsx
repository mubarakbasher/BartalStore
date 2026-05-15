// mobile-v1.jsx — Variation 1: "Marketplace Classic"
// Grid-dense, high-affordance. Home = categories + featured grid + carousel.
// Detail = image hero, sticky Add to Cart bar. Most conventional.

function MobileV1({ lang = 'en', dark = false, screen = 'home', onNav, onBack }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const text = dark ? BARTAL.d_text : BARTAL.text;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {screen === 'home' && <V1Home {...{ lang, dark, onNav }} />}
      {screen === 'detail' && <V1Detail {...{ lang, dark, onNav, onBack }} />}
    </div>
  );
}

function V1Home({ lang, dark, onNav }) {
  const isAr = lang === 'ar';
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Header band with motif */}
      <div style={{
        background: dark ? BARTAL.navyInk : BARTAL.navy,
        padding: '20px 16px 20px',
        position: 'relative', overflow: 'hidden',
      }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
          <defs>
            <pattern id="v1hdr" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
              <g stroke={BARTAL.amberSoft} strokeWidth="0.8" fill="none">
                <path d="M24 4 L29 15 L40 14 L32 22 L37 32 L24 28 L11 32 L16 22 L8 14 L19 15 Z"/>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#v1hdr)"/>
        </svg>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <BartalLogo color="#fff" accent={BARTAL.amberSoft} size={26} lang={lang}/>
          <div style={{ display: 'flex', gap: 10 }}>
            <IconBadge count={2} dark/>
            <BellIcon color="#fff"/>
          </div>
        </div>
        {/* search */}
        <div style={{
          position: 'relative',
          background: 'rgba(255,255,255,0.95)', borderRadius: 12,
          padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <SearchIcon color={BARTAL.textMute} size={18}/>
          <span style={{ ...typeStyle(lang, 'body'), color: BARTAL.textMute, flex: 1 }}>{t('search', lang)}</span>
        </div>
        {/* delivery chip */}
        <div style={{
          marginTop: 12, display: 'flex', alignItems: 'center', gap: 6,
          ...typeStyle(lang, 'small'), color: '#fff', opacity: 0.9,
        }}>
          <PinIcon color={BARTAL.amberSoft} size={14}/>
          <span>{t('deliveryTo', lang)}:</span>
          <span style={{ fontWeight: 600, opacity: 1 }}>{t('zoneA', lang)}</span>
          <span style={{ opacity: 0.7, marginInlineStart: 4 }}>{isAr ? '· 0-1 يوم' : '· 0-1 days'}</span>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '16px 16px 4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div style={{ ...typeStyle(lang, 'h3', dark) }}>{t('categories', lang)}</div>
          <div style={{ ...typeStyle(lang, 'small'), color: BARTAL.amber }}>{t('seeAll', lang)}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { ar: 'هواتف', en: 'Phones', hue: 'navy' },
            { ar: 'عطور', en: 'Fragrance', hue: 'amber' },
            { ar: 'سماعات', en: 'Audio', hue: 'night' },
            { ar: 'بخور', en: 'Incense', hue: 'rose' },
          ].map((c, i) => (
            <div key={i} style={{
              background: surface, borderRadius: 12, padding: '10px 6px',
              textAlign: 'center', border: `1px solid ${line}`,
            }}>
              <div style={{ height: 44, borderRadius: 10, overflow: 'hidden', marginBottom: 6 }}>
                <ProductPlaceholder label="" hue={c.hue}/>
              </div>
              <div style={{ ...typeStyle(lang, 'small'), color: dark ? BARTAL.d_text : BARTAL.text, fontWeight: 600 }}>{c[lang]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured carousel */}
      <div style={{ padding: '18px 0 4px' }}>
        <div style={{ padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div style={{ ...typeStyle(lang, 'h3', dark) }}>{t('featured', lang)}</div>
          <div style={{ ...typeStyle(lang, 'small'), color: BARTAL.amber }}>{t('seeAll', lang)}</div>
        </div>
        <div style={{
          display: 'flex', gap: 12, overflowX: 'auto', padding: '0 16px 4px',
          scrollbarWidth: 'none',
        }}>
          {CATALOG.slice(0, 4).map(p => (
            <div key={p.id} onClick={() => onNav && onNav('detail', p.id)} style={{
              minWidth: 160, width: 160, background: surface,
              borderRadius: 14, border: `1px solid ${line}`, overflow: 'hidden',
              cursor: 'pointer',
            }}>
              <div style={{ height: 140, position: 'relative' }}>
                <ProductPlaceholder label={p.name_en} hue={p.hue}/>
                {p.compare && (
                  <div style={{
                    position: 'absolute', top: 8, insetInlineStart: 8,
                    background: BARTAL.amber, color: '#fff',
                    padding: '3px 8px', borderRadius: 6,
                    ...typeStyle(lang, 'micro'), color: '#fff',
                  }}>
                    {isAr ? 'خصم' : 'Sale'}
                  </div>
                )}
              </div>
              <div style={{ padding: '10px 10px 12px' }}>
                <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginBottom: 2 }}>{p.brand}</div>
                <div style={{
                  ...typeStyle(lang, 'label', dark), fontWeight: 600,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  overflow: 'hidden', minHeight: 36,
                }}>{isAr ? p.name_ar : p.name_en}</div>
                <div style={{ marginTop: 6 }}>
                  <PriceTag amount={p.price} lang={lang} size={14} color={dark ? BARTAL.d_text : BARTAL.navyInk} compare={p.compare}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New arrivals grid */}
      <div style={{ padding: '14px 16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div style={{ ...typeStyle(lang, 'h3', dark) }}>{t('newArrivals', lang)}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {CATALOG.map(p => (
            <div key={p.id} onClick={() => onNav && onNav('detail', p.id)} style={{
              background: surface, borderRadius: 12, border: `1px solid ${line}`,
              overflow: 'hidden', cursor: 'pointer',
            }}>
              <div style={{ height: 120 }}><ProductPlaceholder label={p.name_en} hue={p.hue}/></div>
              <div style={{ padding: '8px 10px 10px' }}>
                <div style={{ ...typeStyle(lang, 'small', dark), fontWeight: 600, minHeight: 34,
                               display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {isAr ? p.name_ar : p.name_en}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
                  <StarIcon size={11} color={BARTAL.amber}/>
                  <span style={{ ...typeStyle(lang, 'micro'), color: muted, textTransform: 'none', letterSpacing: 0 }}>
                    {p.rating} · {p.reviews}
                  </span>
                </div>
                <div style={{ marginTop: 6 }}>
                  <PriceTag amount={p.price} lang={lang} size={13} color={dark ? BARTAL.d_text : BARTAL.navyInk}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <V1TabBar active="home" lang={lang} dark={dark} onNav={onNav}/>
    </div>
  );
}

function V1Detail({ lang, dark, onNav, onBack }) {
  const p = CATALOG[0]; // headphones
  const isAr = lang === 'ar';
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'auto', paddingBottom: 92 }}>
      {/* Image hero */}
      <div style={{ height: 340, position: 'relative' }}>
        <ProductPlaceholder label={p.name_en} hue={p.hue}/>
        {/* back + actions */}
        <div style={{
          position: 'absolute', top: 12, insetInlineStart: 12, insetInlineEnd: 12,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <CircleBtn onClick={onBack}><BackIcon flipped={isAr}/></CircleBtn>
          <div style={{ display: 'flex', gap: 8 }}>
            <CircleBtn><HeartIcon/></CircleBtn>
            <CircleBtn><ShareIcon/></CircleBtn>
          </div>
        </div>
        {/* image dots */}
        <div style={{
          position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 6,
        }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: i === 0 ? 20 : 6, height: 6, borderRadius: 3,
              background: i === 0 ? BARTAL.amber : 'rgba(255,255,255,0.6)',
            }}/>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ background: bg, marginTop: -14, borderRadius: '16px 16px 0 0', padding: '18px 16px 20px', position: 'relative' }}>
        <div style={{ ...typeStyle(lang, 'micro'), color: BARTAL.amber, marginBottom: 4 }}>
          {p.brand} · {isAr ? 'إلكترونيات' : 'Electronics'}
        </div>
        <div style={{ ...typeStyle(lang, 'h1', dark), marginBottom: 6 }}>
          {isAr ? p.name_ar : p.name_en}
        </div>
        <div style={{ ...typeStyle(lang, 'small'), color: muted, marginBottom: 12 }}>
          {isAr ? p.tagline_ar : p.tagline_en}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <PriceTag amount={p.price} lang={lang} size={24} color={dark ? BARTAL.d_text : BARTAL.navyInk} compare={p.compare}/>
          <div style={{
            ...typeStyle(lang, 'micro'), color: BARTAL.success,
            background: dark ? 'rgba(46,125,50,0.18)' : '#E8F5E9',
            padding: '4px 8px', borderRadius: 6,
          }}>
            {t('inStock', lang)} · {p.stock}
          </div>
        </div>

        {/* rating row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <StarIcon color={BARTAL.amber} size={16}/>
            <span style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700 }}>{p.rating}</span>
            <span style={{ ...typeStyle(lang, 'small'), color: muted }}>({p.reviews} {t('reviews', lang)})</span>
          </div>
          <div style={{ width: 1, height: 20, background: line }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <TruckIcon color={BARTAL.navy} size={16}/>
            <span style={{ ...typeStyle(lang, 'small'), color: dark ? BARTAL.d_text : BARTAL.text }}>
              {isAr ? '0-1 يوم' : '0-1 days'}
            </span>
          </div>
        </div>

        {/* color/variant */}
        <div style={{ marginTop: 16 }}>
          <div style={{ ...typeStyle(lang, 'label', dark), marginBottom: 8 }}>{isAr ? 'اللون' : 'Color'}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[BARTAL.navyInk, BARTAL.amber, '#C5C8CC'].map((c, i) => (
              <div key={i} style={{
                width: 36, height: 36, borderRadius: '50%', background: c,
                border: i === 0 ? `2px solid ${BARTAL.amber}` : `1px solid ${line}`,
                boxShadow: i === 0 ? `0 0 0 2px ${surface}` : 'none',
              }}/>
            ))}
          </div>
        </div>

        {/* description */}
        <div style={{ marginTop: 18 }}>
          <div style={{ ...typeStyle(lang, 'label', dark), marginBottom: 8 }}>{t('description', lang)}</div>
          <div style={{ ...typeStyle(lang, 'body', dark), color: muted, lineHeight: 1.6 }}>
            {isAr
              ? 'سماعات لاسلكية مع تقنية عزل الضوضاء النشط، بطارية تدوم حتى 40 ساعة، ومناسبة للسفر والاستخدام اليومي. جودة صوت استوديو ومعزز الباس الديناميكي.'
              : 'Premium wireless headphones with active noise cancellation, up to 40 hours of battery life. Studio-grade sound with dynamic bass boost — built for travel and daily use.'}
          </div>
        </div>
      </div>

      {/* Sticky add-to-cart bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: surface, borderTop: `1px solid ${line}`,
        padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <button style={{
          background: 'transparent', border: `1.5px solid ${BARTAL.navy}`,
          color: dark ? BARTAL.d_text : BARTAL.navy, borderRadius: 12, padding: '12px 18px',
          ...typeStyle(lang, 'label'), fontWeight: 600,
        }}>{t('addToCart', lang)}</button>
        <button onClick={() => onNav && onNav('cart')} style={{
          flex: 1, background: BARTAL.navy, color: '#fff',
          border: 'none', borderRadius: 12, padding: '14px 18px',
          ...typeStyle(lang, 'label'), color: '#fff', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: `0 4px 14px ${BARTAL.navy}33`,
        }}>
          {t('buyNow', lang)}
          <ArrowIcon color="#fff" flipped={isAr}/>
        </button>
      </div>
    </div>
  );
}

// ─── V1 Tab bar ──────────────────────────────────────────
function V1TabBar({ active, lang, dark, onNav }) {
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const items = [
    { k: 'home', label: t('home', lang), icon: HomeIcon },
    { k: 'shop', label: t('shop', lang), icon: GridIcon },
    { k: 'cart', label: t('cart', lang), icon: BagIcon, badge: 2 },
    { k: 'orders', label: t('orders', lang), icon: PackageIcon },
    { k: 'profile', label: t('profile', lang), icon: UserIcon },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, background: surface,
      borderTop: `1px solid ${line}`, padding: '8px 4px 12px',
      display: 'flex', justifyContent: 'space-around',
    }}>
      {items.map(it => {
        const on = it.k === active;
        return (
          <div key={it.k} onClick={() => onNav && onNav(it.k)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '6px 8px', cursor: 'pointer', position: 'relative', minWidth: 56,
          }}>
            <div style={{ position: 'relative' }}>
              <it.icon color={on ? BARTAL.amber : muted} size={22}/>
              {it.badge && (
                <div style={{
                  position: 'absolute', top: -4, insetInlineEnd: -6,
                  background: BARTAL.danger, color: '#fff',
                  minWidth: 16, height: 16, borderRadius: 8,
                  fontSize: 10, fontWeight: 700, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                }}>{it.badge}</div>
              )}
            </div>
            <div style={{
              ...typeStyle(lang, 'micro'),
              color: on ? BARTAL.amber : muted,
              textTransform: 'none', letterSpacing: 0, fontSize: 10, fontWeight: on ? 700 : 500,
            }}>{it.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── icon helpers used across variations ─────────────────
function IconBadge({ count, dark }) {
  return (
    <div style={{ position: 'relative', width: 36, height: 36, borderRadius: 12,
                  background: 'rgba(255,255,255,0.15)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center' }}>
      <BagIcon color="#fff" size={18}/>
      {count > 0 && (
        <div style={{
          position: 'absolute', top: 4, insetInlineEnd: 4,
          background: BARTAL.amber, color: '#fff',
          width: 14, height: 14, borderRadius: 7,
          fontSize: 9, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{count}</div>
      )}
    </div>
  );
}

function CircleBtn({ children, onClick }) {
  return (
    <div onClick={onClick} style={{
      width: 40, height: 40, borderRadius: '50%',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)', cursor: 'pointer',
    }}>{children}</div>
  );
}

// ─── SVG icons ───────────────────────────────────────────
const sw = 1.8;
function HomeIcon({ color = '#000', size = 22 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M3 12l9-8 9 8v8a2 2 0 01-2 2h-4v-6h-6v6H5a2 2 0 01-2-2v-8z" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function GridIcon({ color = '#000', size = 22 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth={sw}/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth={sw}/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth={sw}/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth={sw}/></svg>;
}
function BagIcon({ color = '#000', size = 22 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M5 8h14l-1 12H6L5 8z" stroke={color} strokeWidth={sw} strokeLinejoin="round"/><path d="M9 8V6a3 3 0 016 0v2" stroke={color} strokeWidth={sw} strokeLinecap="round"/></svg>;
}
function PackageIcon({ color = '#000', size = 22 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" stroke={color} strokeWidth={sw} strokeLinejoin="round"/><path d="M3 7l9 4 9-4M12 11v10" stroke={color} strokeWidth={sw} strokeLinejoin="round"/></svg>;
}
function UserIcon({ color = '#000', size = 22 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={color} strokeWidth={sw}/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={color} strokeWidth={sw} strokeLinecap="round"/></svg>;
}
function SearchIcon({ color = '#000', size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={color} strokeWidth={sw}/><path d="M21 21l-4.3-4.3" stroke={color} strokeWidth={sw} strokeLinecap="round"/></svg>;
}
function PinIcon({ color = '#000', size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" stroke={color} strokeWidth={sw}/><circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth={sw}/></svg>;
}
function StarIcon({ color = '#000', size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2l3.1 6.3 7 1-5 4.9 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5-4.9 7-1L12 2z"/></svg>;
}
function TruckIcon({ color = '#000', size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="1" y="6" width="14" height="11" rx="1" stroke={color} strokeWidth={sw}/><path d="M15 10h4l3 4v3h-7v-7z" stroke={color} strokeWidth={sw} strokeLinejoin="round"/><circle cx="6" cy="18" r="2" stroke={color} strokeWidth={sw}/><circle cx="18" cy="18" r="2" stroke={color} strokeWidth={sw}/></svg>;
}
function HeartIcon({ color = BARTAL.danger, size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.5-9-10a5 5 0 019-3 5 5 0 019 3c-2 5.5-9 10-9 10z" stroke={color} strokeWidth={sw} strokeLinejoin="round"/></svg>;
}
function ShareIcon({ color = '#1A1A1A', size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="3" stroke={color} strokeWidth={sw}/><circle cx="6" cy="12" r="3" stroke={color} strokeWidth={sw}/><circle cx="18" cy="19" r="3" stroke={color} strokeWidth={sw}/><path d="M8.6 10.6l6.8-4.2M8.6 13.4l6.8 4.2" stroke={color} strokeWidth={sw}/></svg>;
}
function BackIcon({ flipped, color = '#1A1A1A', size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}><path d="M15 6l-6 6 6 6" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function ArrowIcon({ color = '#000', flipped, size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}><path d="M5 12h14M13 6l6 6-6 6" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function BellIcon({ color = '#000', size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M18 16H6l1.5-2V10a4.5 4.5 0 019 0v4l1.5 2z" stroke={color} strokeWidth={sw} strokeLinejoin="round"/><path d="M10 19a2 2 0 004 0" stroke={color} strokeWidth={sw} strokeLinecap="round"/></svg>;
}
function CheckIcon({ color = '#fff', size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function CameraIcon({ color = '#000', size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M3 8h3l2-3h8l2 3h3v12H3V8z" stroke={color} strokeWidth={sw} strokeLinejoin="round"/><circle cx="12" cy="13" r="4" stroke={color} strokeWidth={sw}/></svg>;
}

Object.assign(window, {
  MobileV1, V1Home, V1Detail, V1TabBar,
  HomeIcon, GridIcon, BagIcon, PackageIcon, UserIcon, SearchIcon, PinIcon,
  StarIcon, TruckIcon, HeartIcon, ShareIcon, BackIcon, ArrowIcon, BellIcon,
  CheckIcon, CameraIcon, CircleBtn, IconBadge,
});
