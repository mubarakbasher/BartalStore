// mobile-v3.jsx — Variation 3: "Souq Kiosk"
// Bazaar-inspired: warm sand bg, amber dominant, arched cards (mihrab-style),
// horizontal story rail, numeric badges Eastern-Arabic by default.
// Detail = arched image frame, tabs (Description / Specs / Reviews).

function MobileV3({ lang = 'en', dark = false, screen = 'home', onNav, onBack }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {screen === 'home' && <V3Home {...{ lang, dark, onNav }} />}
      {screen === 'detail' && <V3Detail {...{ lang, dark, onNav, onBack }} />}
    </div>
  );
}

function V3Home({ lang, dark, onNav }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  return (
    <div style={{ height: '100%', overflow: 'auto', paddingBottom: 92 }}>
      {/* Top bar — warm */}
      <div style={{ padding: '18px 16px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          background: BARTAL.amber, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 16,
        }}>م</div>
        <div style={{ flex: 1 }}>
          <div style={{ ...typeStyle(lang, 'micro'), color: muted }}>
            {isAr ? 'مرحباً،' : 'As-salaam,'}
          </div>
          <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700 }}>
            {isAr ? 'محمد عثمان' : 'Mohammed Osman'}
          </div>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 12, background: surface,
          border: `1px solid ${line}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <BellIcon color={dark ? BARTAL.d_text : BARTAL.navy} size={18}/>
          <div style={{ position: 'absolute', top: 8, insetInlineEnd: 8,
            width: 8, height: 8, borderRadius: 4, background: BARTAL.amber, border: `1.5px solid ${surface}` }}/>
        </div>
      </div>

      {/* Search — amber-ringed */}
      <div style={{ padding: '6px 16px 10px' }}>
        <div style={{
          position: 'relative',
          background: surface, borderRadius: 100,
          border: `1.5px solid ${BARTAL.amber}`,
          padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <SearchIcon color={BARTAL.amber} size={18}/>
          <span style={{ ...typeStyle(lang, 'body'), color: muted, flex: 1 }}>{t('search', lang)}</span>
          <div style={{ width: 1, height: 18, background: line }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: dark ? BARTAL.d_text : BARTAL.navy }}>
            <FilterIcon color="currentColor" size={16}/>
          </div>
        </div>
      </div>

      {/* Offers rail — arched story cards */}
      <div style={{ padding: '10px 0 6px' }}>
        <div style={{ padding: '0 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ ...typeStyle(lang, 'h3', dark) }}>{isAr ? 'عروض اليوم' : "Today's offers"}</div>
          <div style={{ ...typeStyle(lang, 'small'), color: BARTAL.amber, fontWeight: 600 }}>{t('seeAll', lang)}</div>
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 16px 6px' }}>
          {CATALOG.slice(0, 5).map((p, i) => (
            <div key={p.id} onClick={() => onNav && onNav('detail', p.id)} style={{
              minWidth: 140, width: 140, cursor: 'pointer',
            }}>
              {/* arched/mihrab frame */}
              <div style={{
                height: 180, borderRadius: '70px 70px 14px 14px', overflow: 'hidden',
                border: `2px solid ${BARTAL.amber}`, padding: 3, background: surface,
                position: 'relative',
              }}>
                <div style={{ height: '100%', borderRadius: '65px 65px 11px 11px', overflow: 'hidden' }}>
                  <ProductPlaceholder label={p.name_en} hue={p.hue}/>
                </div>
                {p.compare && (
                  <div style={{
                    position: 'absolute', bottom: 8, insetInlineStart: 8,
                    background: BARTAL.navy, color: '#fff',
                    borderRadius: 8, padding: '3px 8px',
                    ...typeStyle(lang, 'micro'), color: '#fff',
                  }}>
                    -{Math.round((1 - p.price / p.compare) * 100)}%
                  </div>
                )}
              </div>
              <div style={{ padding: '10px 4px 4px' }}>
                <div style={{ ...typeStyle(lang, 'small', dark), fontWeight: 600, lineHeight: 1.3,
                               display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 34 }}>
                  {isAr ? p.name_ar : p.name_en}
                </div>
                <div style={{ marginTop: 4 }}>
                  <PriceTag amount={p.price} lang={lang} numerals={isAr ? 'arabic' : 'latin'} size={13}
                            color={BARTAL.amber}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Big motif banner */}
      <div style={{ padding: '10px 16px 14px' }}>
        <div style={{
          background: BARTAL.navyInk, borderRadius: 18, padding: '20px 18px',
          position: 'relative', overflow: 'hidden', color: '#fff',
        }}>
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
            <defs>
              <pattern id="v3bnr" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <g stroke={BARTAL.amberSoft} strokeWidth="1" fill="none">
                  <path d="M30 6 L36 22 L50 16 L44 30 L58 36 L44 42 L50 56 L36 50 L30 66 L24 50 L10 56 L16 42 L2 36 L16 30 L10 16 L24 22 Z"/>
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#v3bnr)"/>
          </svg>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ ...typeStyle(lang, 'micro'), color: BARTAL.amberSoft, marginBottom: 6 }}>
                {isAr ? 'توصيل مجاني' : 'Free delivery'}
              </div>
              <div style={{ fontFamily: isAr ? "'Cairo'" : "'Poppins'", fontSize: 20, fontWeight: 700, lineHeight: 1.2, marginBottom: 4 }}>
                {isAr ? 'على الطلبات فوق ٥٠٬٠٠٠ ج.س' : 'On orders over 50,000 SDG'}
              </div>
              <div style={{ ...typeStyle(lang, 'small'), color: 'rgba(255,255,255,0.7)' }}>
                {isAr ? 'في جميع مناطق الخرطوم' : 'Across all Khartoum zones'}
              </div>
            </div>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: BARTAL.amber, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <TruckIcon color="#fff" size={32}/>
            </div>
          </div>
        </div>
      </div>

      {/* Browse grid */}
      <div style={{ padding: '0 16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div style={{ ...typeStyle(lang, 'h3', dark) }}>{isAr ? 'الأكثر مبيعاً' : 'Best sellers'}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {CATALOG.slice(1, 5).map(p => (
            <div key={p.id} onClick={() => onNav && onNav('detail', p.id)} style={{
              background: surface, borderRadius: 16, padding: 8, cursor: 'pointer',
              border: `1px solid ${line}`,
            }}>
              <div style={{ height: 130, borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
                <ProductPlaceholder label={p.name_en} hue={p.hue}/>
              </div>
              <div style={{ padding: '0 4px 4px' }}>
                <div style={{ ...typeStyle(lang, 'small', dark), fontWeight: 600, minHeight: 34,
                              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {isAr ? p.name_ar : p.name_en}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                  <PriceTag amount={p.price} lang={lang} numerals={isAr ? 'arabic' : 'latin'} size={13}
                            color={BARTAL.amber}/>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', background: BARTAL.navy,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                    fontWeight: 700, fontSize: 16,
                  }}>+</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <V3TabBar active="home" lang={lang} dark={dark} onNav={onNav}/>
    </div>
  );
}

function V3Detail({ lang, dark, onNav, onBack }) {
  const p = CATALOG[2]; // smartphone
  const isAr = lang === 'ar';
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;
  const [tab, setTab] = React.useState(0);

  const specs = [
    { ar: 'الشاشة', en: 'Display', val_ar: '٦٫٥" أموليد', val_en: '6.5" AMOLED' },
    { ar: 'التخزين', en: 'Storage', val_ar: '١٢٨ جيجا', val_en: '128 GB' },
    { ar: 'البطارية', en: 'Battery', val_ar: '٥٠٠٠ مللي', val_en: '5000 mAh' },
    { ar: 'الكاميرا', en: 'Camera', val_ar: '٦٤ + ١٢', val_en: '64 + 12 MP' },
    { ar: 'الضمان', en: 'Warranty', val_ar: 'سنة واحدة', val_en: '1 year' },
  ];

  return (
    <div style={{ height: '100%', overflow: 'auto', paddingBottom: 96 }}>
      {/* Top row */}
      <div style={{ padding: '14px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 12, background: surface, border: `1px solid ${line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <BackIcon flipped={isAr} color={dark ? BARTAL.d_text : BARTAL.navy}/>
        </div>
        <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700 }}>
          {isAr ? 'التفاصيل' : 'Product details'}
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 12, background: surface, border: `1px solid ${line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <HeartIcon/>
        </div>
      </div>

      {/* Arched (mihrab) image frame */}
      <div style={{ padding: '18px 24px 14px' }}>
        <div style={{
          height: 320, borderRadius: '140px 140px 22px 22px', overflow: 'hidden',
          border: `3px solid ${BARTAL.amber}`, padding: 6, background: surface,
          position: 'relative',
        }}>
          <div style={{ height: '100%', borderRadius: '130px 130px 14px 14px', overflow: 'hidden' }}>
            <ProductPlaceholder label={p.name_en} hue={p.hue}/>
          </div>
          {/* corner motif */}
          <div style={{
            position: 'absolute', top: 8, insetInlineEnd: 8,
            width: 24, height: 24, borderRadius: '50%',
            background: BARTAL.amber, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LogoMark color="#fff" accent={BARTAL.navyInk} size={14}/>
          </div>
        </div>
        {/* thumb dots */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: i === 0 ? 24 : 8, height: 8, borderRadius: 4,
              background: i === 0 ? BARTAL.amber : line,
            }}/>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ ...typeStyle(lang, 'micro'), color: BARTAL.amber, marginBottom: 4 }}>
          {p.brand}
        </div>
        <div style={{ ...typeStyle(lang, 'h1', dark), marginBottom: 6 }}>
          {isAr ? p.name_ar : p.name_en}
        </div>
        {/* rating + stock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 1 }}>
            {[0,1,2,3,4].map(i => <StarIcon key={i} color={i < 4.5 ? BARTAL.amber : line} size={14}/>)}
          </div>
          <span style={{ ...typeStyle(lang, 'small'), color: muted }}>
            {isAr ? `${p.rating} · ${p.reviews} تقييماً` : `${p.rating} · ${p.reviews} reviews`}
          </span>
          <span style={{ ...typeStyle(lang, 'small'), color: BARTAL.success, marginInlineStart: 'auto', fontWeight: 600 }}>
            ● {isAr ? 'متوفر' : 'In stock'}
          </span>
        </div>

        {/* Price band */}
        <div style={{
          background: dark ? BARTAL.d_raised : '#fff',
          border: `1px solid ${line}`, borderRadius: 16, padding: '14px 16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
        }}>
          <div>
            <div style={{ ...typeStyle(lang, 'micro'), color: muted, marginBottom: 2 }}>{isAr ? 'السعر' : 'Price'}</div>
            <PriceTag amount={p.price} lang={lang} numerals={isAr ? 'arabic' : 'latin'}
                      size={22} color={dark ? BARTAL.d_text : BARTAL.navyInk} compare={p.compare}/>
          </div>
          <div style={{
            background: BARTAL.amberTint, color: BARTAL.amber,
            borderRadius: 100, padding: '6px 12px',
            ...typeStyle(lang, 'micro'), color: BARTAL.amber, fontWeight: 700,
          }}>
            -{Math.round((1 - p.price / p.compare) * 100)}%
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 18, borderBottom: `1px solid ${line}`, marginBottom: 14 }}>
          {[
            { ar: 'الوصف', en: 'Description' },
            { ar: 'المواصفات', en: 'Specs' },
            { ar: 'التقييمات', en: 'Reviews' },
          ].map((tb, i) => (
            <div key={i} onClick={() => setTab(i)} style={{
              paddingBottom: 10, cursor: 'pointer',
              borderBottom: tab === i ? `2px solid ${BARTAL.amber}` : '2px solid transparent',
              ...typeStyle(lang, 'label', dark),
              color: tab === i ? (dark ? BARTAL.d_text : BARTAL.navy) : muted,
              fontWeight: tab === i ? 700 : 500,
            }}>{tb[lang]}</div>
          ))}
        </div>

        {tab === 0 && (
          <div style={{ ...typeStyle(lang, 'body', dark), color: muted, lineHeight: 1.7 }}>
            {isAr
              ? 'هاتف ذكي بأداء عالٍ، شاشة أموليد نابضة بالألوان وبطارية تدوم طوال اليوم. مثالي للسفر والعمل والترفيه. يتضمن شاحناً سريعاً وسماعة داخل العلبة.'
              : 'A high-performance smartphone with a vibrant AMOLED display and all-day battery. Perfect for work, travel, and play. Includes fast charger and earphones in the box.'}
          </div>
        )}
        {tab === 1 && (
          <div>
            {specs.map((s, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '11px 0',
                borderBottom: i < specs.length - 1 ? `1px solid ${line}` : 'none',
              }}>
                <span style={{ ...typeStyle(lang, 'body'), color: muted }}>{s[lang]}</span>
                <span style={{ ...typeStyle(lang, 'body', dark), fontWeight: 600 }}>
                  {isAr ? s.val_ar : s.val_en}
                </span>
              </div>
            ))}
          </div>
        )}
        {tab === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { name_ar: 'أميرة م.', name_en: 'Amira M.', rating: 5,
                ar: 'جودة ممتازة والتوصيل كان سريعاً — خلال يومين فقط للخرطوم.',
                en: 'Excellent quality and delivery was fast — only two days to Khartoum.' },
              { name_ar: 'عبدالرحمن', name_en: 'Abdulrahman', rating: 4,
                ar: 'الهاتف جيد لكن البطارية أقل مما توقعت.',
                en: "Phone is good but battery is a bit less than I expected." },
            ].map((r, i) => (
              <div key={i} style={{ background: surface, border: `1px solid ${line}`,
                borderRadius: 14, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700 }}>
                    {isAr ? r.name_ar : r.name_en}
                  </div>
                  <div style={{ display: 'flex', gap: 1 }}>
                    {[0,1,2,3,4].map(j => <StarIcon key={j} color={j < r.rating ? BARTAL.amber : line} size={12}/>)}
                  </div>
                </div>
                <div style={{ ...typeStyle(lang, 'small'), color: muted, lineHeight: 1.6 }}>
                  {isAr ? r.ar : r.en}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky buy bar */}
      <div style={{
        position: 'absolute', bottom: 56, left: 0, right: 0,
        background: surface, borderTop: `1px solid ${line}`,
        padding: '12px 16px',
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <button style={{
          background: 'transparent', border: `1.5px solid ${BARTAL.amber}`,
          color: BARTAL.amber, borderRadius: 12, padding: '12px 16px',
          ...typeStyle(lang, 'label'), color: BARTAL.amber, fontWeight: 700,
        }}>
          {t('addToCart', lang)}
        </button>
        <button onClick={() => onNav && onNav('cart')} style={{
          flex: 1, background: BARTAL.amber, color: '#fff', border: 'none',
          borderRadius: 12, padding: '13px 18px',
          ...typeStyle(lang, 'label'), color: '#fff', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: `0 6px 18px ${BARTAL.amber}66`,
        }}>
          {t('buyNow', lang)} · <PriceTag amount={p.price} lang={lang} numerals={isAr ? 'arabic' : 'latin'}
            size={14} color="#fff"/>
        </button>
      </div>
      <V3TabBar active="home" lang={lang} dark={dark} onNav={onNav}/>
    </div>
  );
}

function V3TabBar({ active, lang, dark, onNav }) {
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const items = [
    { k: 'home', label: t('home', lang), icon: HomeIcon },
    { k: 'shop', label: t('shop', lang), icon: GridIcon },
    { k: 'cart', label: t('cart', lang), icon: BagIcon, badge: 2 },
    { k: 'orders', label: t('orders', lang), icon: PackageIcon },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: surface, borderTop: `1px solid ${line}`,
      padding: '8px 4px 10px',
      display: 'flex', justifyContent: 'space-around',
    }}>
      {items.map(it => {
        const on = it.k === active;
        return (
          <div key={it.k} onClick={() => onNav && onNav(it.k)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '4px 10px', cursor: 'pointer',
            background: on ? BARTAL.amberTint : 'transparent',
            borderRadius: 12, minWidth: 68,
          }}>
            <div style={{ position: 'relative' }}>
              <it.icon color={on ? BARTAL.amber : muted} size={20}/>
              {it.badge && (
                <div style={{
                  position: 'absolute', top: -3, insetInlineEnd: -5,
                  background: BARTAL.navy, color: '#fff',
                  minWidth: 15, height: 15, borderRadius: 8,
                  fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px',
                }}>{it.badge}</div>
              )}
            </div>
            <div style={{
              ...typeStyle(lang, 'micro'),
              color: on ? BARTAL.amber : muted,
              textTransform: 'none', letterSpacing: 0, fontSize: 10,
              fontWeight: on ? 700 : 500,
            }}>{it.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function FilterIcon({ color = '#000', size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M4 6h16M7 12h10M10 18h4" stroke={color} strokeWidth={2} strokeLinecap="round"/></svg>;
}

Object.assign(window, { MobileV3, V3Home, V3Detail, V3TabBar, FilterIcon });
