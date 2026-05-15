// mobile-v2.jsx — Variation 2: "Editorial Bazaar"
// Content-led, bigger type, full-bleed hero, no tab bar (FAB-led).
// Detail = image parallax + pull-up sheet. More premium feel.

function MobileV2({ lang = 'en', dark = false, screen = 'home', onNav, onBack }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {screen === 'home' && <V2Home {...{ lang, dark, onNav }} />}
      {screen === 'detail' && <V2Detail {...{ lang, dark, onNav, onBack }} />}
    </div>
  );
}

function V2Home({ lang, dark, onNav }) {
  const isAr = lang === 'ar';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  return (
    <div style={{ height: '100%', overflow: 'auto', paddingBottom: 100 }}>
      {/* Editorial masthead */}
      <div style={{ padding: '20px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <BartalLogo color={dark ? BARTAL.d_text : BARTAL.navy} accent={BARTAL.amber} size={26} lang={lang}/>
        <div style={{ display: 'flex', gap: 10 }}>
          <IconCircle dark={dark}><SearchIcon color={dark ? BARTAL.d_text : BARTAL.text}/></IconCircle>
          <IconCircle dark={dark}><BagIcon color={dark ? BARTAL.d_text : BARTAL.text} size={18}/></IconCircle>
        </div>
      </div>

      {/* Editorial hero */}
      <div style={{ padding: '16px 20px 10px' }}>
        <div style={{ ...typeStyle(lang, 'micro'), color: BARTAL.amber, marginBottom: 8 }}>
          {isAr ? '· مختارات هذا الأسبوع ·' : '· This week at bartal ·'}
        </div>
        <div style={{
          ...typeStyle(lang, 'display', dark),
          fontSize: 36, lineHeight: 1.1,
          fontWeight: 700, marginBottom: 10,
          textWrap: 'pretty',
        }}>
          {isAr
            ? 'روائح شرقية تُحكى بالخرطوم.'
            : 'Oriental scents, delivered across Khartoum.'}
        </div>
        <div style={{ ...typeStyle(lang, 'body'), color: muted, maxWidth: 320, marginBottom: 14 }}>
          {isAr
            ? 'عود، بخور، ودهون فاخرة من أفضل الدور. شحن خلال 24 ساعة.'
            : 'Oud, bakhoor, and attars from the finest houses. Delivered within 24h.'}
        </div>
      </div>

      {/* Featured full-bleed card */}
      <div style={{ padding: '0 20px 16px' }}>
        <div onClick={() => onNav && onNav('detail', 'p2')} style={{
          position: 'relative', borderRadius: 20, overflow: 'hidden',
          height: 380, cursor: 'pointer', background: BARTAL.amberTint,
        }}>
          <ProductPlaceholder label="Royal oud · 3ml" hue="amber"/>
          {/* overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 40%, rgba(11,25,48,0.85) 100%)',
          }}/>
          {/* motif */}
          <div style={{ position: 'absolute', top: 16, insetInlineEnd: 16, opacity: 0.5 }}>
            <LogoMark color="#fff" accent={BARTAL.amberSoft} size={28}/>
          </div>
          {/* content */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, color: '#fff' }}>
            <div style={{ ...typeStyle(lang, 'micro'), color: BARTAL.amberSoft, marginBottom: 6 }}>
              Ajmal · {isAr ? 'عطور' : 'Fragrance'}
            </div>
            <div style={{
              fontFamily: isAr ? "'Cairo'" : "'Poppins'",
              fontSize: 28, fontWeight: 700, lineHeight: 1.15,
              marginBottom: 4, color: '#fff',
            }}>
              {isAr ? 'دهن العود الملكي' : 'Royal Oud perfume oil'}
            </div>
            <div style={{ ...typeStyle(lang, 'small'), color: 'rgba(255,255,255,0.75)', marginBottom: 14 }}>
              {isAr ? '3 مل · عود كمبودي فاخر' : '3ml · Cambodian oud, gift-boxed'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <PriceTag amount={42000} lang={lang} size={22} color="#fff"/>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: BARTAL.amber, borderRadius: 100,
                padding: '10px 16px', ...typeStyle(lang, 'label'), color: '#fff', fontWeight: 700,
              }}>
                {isAr ? 'اكتشف' : 'Discover'}
                <ArrowIcon color="#fff" flipped={isAr} size={14}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div style={{ padding: '4px 20px 16px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {[
          { ar: 'الكل', en: 'All', on: true },
          { ar: 'عطور', en: 'Fragrance' },
          { ar: 'هواتف', en: 'Phones' },
          { ar: 'سماعات', en: 'Audio' },
          { ar: 'ساعات', en: 'Watches' },
          { ar: 'بخور', en: 'Incense' },
        ].map((c, i) => (
          <div key={i} style={{
            padding: '8px 16px', borderRadius: 100,
            background: c.on ? (dark ? BARTAL.d_text : BARTAL.navyInk) : 'transparent',
            border: c.on ? 'none' : `1px solid ${line}`,
            color: c.on ? (dark ? BARTAL.d_bg : '#fff') : (dark ? BARTAL.d_text : BARTAL.text),
            ...typeStyle(lang, 'small'), fontWeight: 600, whiteSpace: 'nowrap',
          }}>{c[lang]}</div>
        ))}
      </div>

      {/* Editorial product list — mixed sizes */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <div style={{ ...typeStyle(lang, 'h2', dark) }}>{t('newArrivals', lang)}</div>
          <div style={{ ...typeStyle(lang, 'small'), color: BARTAL.amber }}>{t('seeAll', lang)}</div>
        </div>

        {/* Mixed grid: first wide, then 2-col */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {CATALOG.slice(1).map((p, i) => (
            <div key={p.id}
                 onClick={() => onNav && onNav('detail', p.id)}
                 style={{
                   gridColumn: i === 0 ? 'span 2' : 'auto',
                   cursor: 'pointer',
                 }}>
              <div style={{
                height: i === 0 ? 180 : 150,
                borderRadius: 16, overflow: 'hidden', marginBottom: 8,
                position: 'relative',
              }}>
                <ProductPlaceholder label={p.name_en} hue={p.hue}/>
              </div>
              <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginBottom: 2 }}>
                {p.brand}
              </div>
              <div style={{
                ...typeStyle(lang, 'label', dark), fontWeight: 600,
                display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {isAr ? p.name_ar : p.name_en}
              </div>
              <div style={{ marginTop: 4 }}>
                <PriceTag amount={p.price} lang={lang} size={14} color={dark ? BARTAL.d_text : BARTAL.navyInk}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating pill nav */}
      <V2FloatingNav lang={lang} dark={dark} active="home" onNav={onNav}/>
    </div>
  );
}

function V2Detail({ lang, dark, onNav, onBack }) {
  const p = CATALOG[1]; // oud oil
  const isAr = lang === 'ar';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  return (
    <div style={{ height: '100%', overflow: 'auto', position: 'relative', paddingBottom: 100 }}>
      {/* Full-bleed imagery */}
      <div style={{ height: 480, background: BARTAL.amberTint, position: 'relative', overflow: 'hidden' }}>
        <ProductPlaceholder label={p.name_en} hue={p.hue}/>
        {/* motif corners */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.2, pointerEvents: 'none' }}>
          <defs>
            <pattern id="v2det" x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
              <g stroke="#fff" strokeWidth="1" fill="none">
                <path d="M36 6 L44 22 L58 16 L52 30 L66 36 L52 42 L58 56 L44 50 L36 66 L28 50 L14 56 L20 42 L6 36 L20 30 L14 16 L28 22 Z"/>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#v2det)"/>
        </svg>
        {/* top bar */}
        <div style={{
          position: 'absolute', top: 12, insetInlineStart: 16, insetInlineEnd: 16,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <CircleBtn onClick={onBack}><BackIcon flipped={isAr}/></CircleBtn>
          <CircleBtn><HeartIcon/></CircleBtn>
        </div>
        {/* thumbs */}
        <div style={{
          position: 'absolute', bottom: 18, insetInlineStart: 16,
          display: 'flex', gap: 8,
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 48, height: 48, borderRadius: 10,
              border: i === 0 ? `2px solid #fff` : '2px solid rgba(255,255,255,0.4)',
              overflow: 'hidden',
            }}>
              <ProductPlaceholder label="" hue={i === 0 ? p.hue : (i === 1 ? 'warm' : 'rose')}/>
            </div>
          ))}
        </div>
      </div>

      {/* Pull-up sheet */}
      <div style={{
        background: bg, marginTop: -26, borderRadius: '26px 26px 0 0',
        padding: '22px 20px', position: 'relative',
      }}>
        <div style={{
          width: 40, height: 4, borderRadius: 2, background: line,
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
        }}/>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 4 }}>
          <div style={{ flex: 1 }}>
            <div style={{ ...typeStyle(lang, 'micro'), color: BARTAL.amber, marginBottom: 4 }}>
              {p.brand} · {isAr ? 'عطور' : 'Fragrance'}
            </div>
            <div style={{ ...typeStyle(lang, 'h1', dark), marginBottom: 4 }}>
              {isAr ? p.name_ar : p.name_en}
            </div>
            <div style={{ ...typeStyle(lang, 'small'), color: muted }}>
              {isAr ? p.tagline_ar : p.tagline_en}
            </div>
          </div>
          <PriceTag amount={p.price} lang={lang} size={22} color={dark ? BARTAL.d_text : BARTAL.navyInk}/>
        </div>

        {/* stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10,
          marginTop: 16, padding: '12px 0', borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}`,
        }}>
          <Stat icon={<StarIcon color={BARTAL.amber} size={16}/>} label={isAr ? 'تقييم' : 'Rating'} value={`${p.rating} / 5`} lang={lang} dark={dark}/>
          <Stat icon={<TruckIcon color={BARTAL.navy} size={16}/>} label={isAr ? 'توصيل' : 'Delivery'} value={isAr ? '24 ساعة' : '24h'} lang={lang} dark={dark}/>
          <Stat icon={<CheckIcon color={BARTAL.success} size={14}/>} label={isAr ? 'مخزون' : 'Stock'} value={`${p.stock}+`} lang={lang} dark={dark}/>
        </div>

        {/* Size variant pills */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ ...typeStyle(lang, 'label', dark) }}>{isAr ? 'الحجم' : 'Size'}</div>
            <div style={{ ...typeStyle(lang, 'small'), color: BARTAL.amber }}>{isAr ? 'دليل الأحجام' : 'Size guide'}</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['3ml', '6ml', '12ml'].map((s, i) => (
              <div key={s} style={{
                flex: 1, padding: '14px 10px', borderRadius: 14, textAlign: 'center',
                border: i === 0 ? `2px solid ${BARTAL.navy}` : `1px solid ${line}`,
                background: i === 0 ? (dark ? BARTAL.d_raised : BARTAL.amberTint) : 'transparent',
              }}>
                <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700 }}>{s}</div>
                <div style={{ ...typeStyle(lang, 'small'), color: muted, marginTop: 2 }}>
                  <PriceTag amount={[42000, 78000, 140000][i]} lang={lang} size={11}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div style={{ marginTop: 20 }}>
          <div style={{ ...typeStyle(lang, 'label', dark), marginBottom: 10 }}>{t('description', lang)}</div>
          <div style={{ ...typeStyle(lang, 'body', dark), color: muted, lineHeight: 1.7 }}>
            {isAr
              ? 'دهن عود كمبودي فاخر مستخلص من أجود أنواع الخشب العطري. رائحة دافئة تجمع بين العود الحلو والمسك الأبيض، تدوم أكثر من 12 ساعة. علبة هدية فخمة.'
              : 'Premium Cambodian oud oil distilled from the finest agarwood. A warm, complex blend of sweet oud and white musk lasting over 12 hours. Presented in a luxury gift box.'}
          </div>
        </div>
      </div>

      {/* Sticky buy bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: surface, borderTop: `1px solid ${line}`,
        padding: '14px 20px',
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          border: `1px solid ${line}`, borderRadius: 100, padding: '6px 8px',
        }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: dark ? BARTAL.d_raised : BARTAL.sand,
                       display: 'flex', alignItems: 'center', justifyContent: 'center', ...typeStyle(lang, 'label', dark) }}>−</div>
          <div style={{ ...typeStyle(lang, 'label', dark), minWidth: 22, textAlign: 'center', fontWeight: 700 }}>1</div>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: BARTAL.amber, color: '#fff',
                       display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>+</div>
        </div>
        <button onClick={() => onNav && onNav('cart')} style={{
          flex: 1, background: BARTAL.navy, color: '#fff', border: 'none',
          borderRadius: 14, padding: '14px', fontWeight: 700,
          ...typeStyle(lang, 'label'), color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <BagIcon color="#fff" size={18}/>
          {t('addToCart', lang)}
        </button>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, lang, dark }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
        {icon}
        <div style={{ ...typeStyle(lang, 'micro'), color: dark ? BARTAL.d_textMute : BARTAL.textMute }}>{label}</div>
      </div>
      <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function V2FloatingNav({ active, lang, dark, onNav }) {
  const items = [
    { k: 'home', icon: HomeIcon },
    { k: 'shop', icon: GridIcon },
    { k: 'cart', icon: BagIcon, badge: 2 },
    { k: 'profile', icon: UserIcon },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
      background: dark ? 'rgba(19,39,68,0.94)' : 'rgba(27,58,107,0.96)',
      backdropFilter: 'blur(12px)',
      padding: '8px', borderRadius: 100,
      display: 'flex', gap: 4, alignItems: 'center',
      boxShadow: '0 12px 32px rgba(11,25,48,0.28)',
    }}>
      {items.map(it => {
        const on = it.k === active;
        return (
          <div key={it.k} onClick={() => onNav && onNav(it.k)} style={{
            position: 'relative', width: 48, height: 48, borderRadius: '50%',
            background: on ? BARTAL.amber : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <it.icon color="#fff" size={20}/>
            {it.badge && (
              <div style={{
                position: 'absolute', top: 4, insetInlineEnd: 4,
                background: BARTAL.amber, width: 8, height: 8, borderRadius: 4,
                border: '1.5px solid #fff',
              }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

function IconCircle({ children, dark }) {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: '50%',
      background: dark ? BARTAL.d_raised : BARTAL.sand,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{children}</div>
  );
}

Object.assign(window, { MobileV2, V2Home, V2Detail, V2FloatingNav, IconCircle, Stat });
