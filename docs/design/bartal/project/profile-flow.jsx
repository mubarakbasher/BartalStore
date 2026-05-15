// profile-flow.jsx — Profile + Addresses + Settings for mobile, plus Web account subpages.
// Uses tokens, typeStyle, PriceTag, Section, ScreenHeader (secondary-screens), icons from mobile-v1.

// ═══════════════════════════════════════════════════════════════
// MOBILE · PROFILE SCREEN (account tab landing)
// ═══════════════════════════════════════════════════════════════
function ProfileScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const menuSections = [
    {
      title: isAr ? 'طلباتي ومدفوعاتي' : 'Orders & payments',
      items: [
        { k: 'orders',    ar: 'طلباتي',           en: 'My orders',         nav: 'orders' },
        { k: 'receipts',  ar: 'الإيصالات',        en: 'Receipts',          sub: isAr ? '١ قيد المراجعة' : '1 under review' },
        { k: 'wallet',    ar: 'الرصيد',           en: 'Store credit',      sub: '5,000 SDG' },
      ],
    },
    {
      title: isAr ? 'الحساب' : 'Account',
      items: [
        { k: 'addresses', ar: 'عناويني',          en: 'My addresses',      nav: 'addresses',  sub: isAr ? '٢ محفوظة' : '2 saved' },
        { k: 'personal',  ar: 'المعلومات الشخصية', en: 'Personal info',    sub: isAr ? 'تعديل الاسم والهاتف' : 'Name, phone, email' },
        { k: 'security',  ar: 'الأمان',           en: 'Security',          sub: isAr ? 'كلمة المرور، جلسات' : 'Password, sessions' },
      ],
    },
    {
      title: isAr ? 'التفضيلات' : 'Preferences',
      items: [
        { k: 'settings',  ar: 'الإعدادات',        en: 'Settings',          nav: 'settings', sub: isAr ? 'اللغة، الإشعارات، المظهر' : 'Language, notifications, theme' },
        { k: 'wishlist',  ar: 'المفضلة',          en: 'Wishlist',          sub: isAr ? '٨ منتجات' : '8 items' },
      ],
    },
    {
      title: isAr ? 'الدعم' : 'Support',
      items: [
        { k: 'help',      ar: 'مركز المساعدة',    en: 'Help center' },
        { k: 'whatsapp',  ar: 'تواصل عبر واتساب',  en: 'WhatsApp support',  accent: true },
        { k: 'about',     ar: 'عن برتال',          en: 'About Bartal' },
      ],
    },
  ];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 90 }}>
      <ScreenHeader title={t('profile', lang)} onBack={onBack} lang={lang} dark={dark}/>

      {/* Profile card with motif */}
      <div style={{ padding: '4px 16px 16px' }}>
        <div style={{
          position: 'relative', background: BARTAL.navy, borderRadius: 18, overflow: 'hidden',
          padding: '20px 18px',
        }}>
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>
            <defs>
              <pattern id="prof-motif" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
                <g stroke={BARTAL.amber} strokeWidth="1" fill="none">
                  <path d="M24 4 L29 19 L44 16 L36 29 L44 42 L29 40 L24 54 L19 40 L4 42 L12 29 L4 16 L19 19 Z"/>
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#prof-motif)"/>
          </svg>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: BARTAL.amber, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 800, fontFamily: "'Poppins'",
              border: `3px solid ${BARTAL.amberTint}`,
            }}>MO</div>
            <div style={{ flex: 1, color: '#fff' }}>
              <div style={{ ...typeStyle(lang, 'h2'), color: '#fff', marginBottom: 2 }}>
                Mohammed Osman
              </div>
              <div style={{ ...typeStyle(lang, 'small'), color: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
                +249 91 234 5678
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                  background: BARTAL.amber, color: '#fff', letterSpacing: 0.3,
                }}>{isAr ? 'موثّق' : 'Verified'}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                  background: 'rgba(255,255,255,0.15)', color: '#fff',
                }}>{isAr ? 'عضو منذ ٢٠٢٤' : 'Member since 2024'}</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                        gap: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 12, overflow: 'hidden',
                        marginTop: 16 }}>
            {[
              { v: '12', l: isAr ? 'طلب' : 'Orders' },
              { v: '8',  l: isAr ? 'مفضلة' : 'Wishlist' },
              { v: '4.9', l: isAr ? 'تقييم' : 'Rating' },
            ].map((s, i) => (
              <div key={i} style={{ background: BARTAL.navy, padding: '10px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: BARTAL.amber, fontFamily: "'Poppins'" }}>{s.v}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu sections */}
      {menuSections.map((sec, si) => (
        <div key={si} style={{ padding: '0 16px 16px' }}>
          <div style={{ ...typeStyle(lang, 'micro'), color: muted, padding: '4px 4px 8px' }}>
            {sec.title}
          </div>
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, overflow: 'hidden' }}>
            {sec.items.map((it, i) => (
              <div key={it.k}
                   onClick={() => it.nav && onNav && onNav(it.nav)}
                   style={{
                     display: 'flex', alignItems: 'center', gap: 12,
                     padding: '14px 14px',
                     borderBottom: i < sec.items.length - 1 ? `1px solid ${line}` : 'none',
                     cursor: it.nav ? 'pointer' : 'default',
                   }}>
                <div style={{ flex: 1 }}>
                  <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 600,
                                color: it.accent ? BARTAL.success : text }}>
                    {isAr ? it.ar : it.en}
                  </div>
                  {it.sub && (
                    <div style={{ ...typeStyle(lang, 'small'), color: muted, marginTop: 2 }}>
                      {it.sub}
                    </div>
                  )}
                </div>
                <span style={{ color: muted, fontSize: 16, lineHeight: 1 }}>
                  {isAr ? '‹' : '›'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Logout */}
      <div style={{ padding: '0 16px 16px' }}>
        <button style={{
          width: '100%', background: 'transparent', color: BARTAL.danger,
          border: `1px solid ${line}`, borderRadius: 14, padding: '14px',
          ...typeStyle(lang, 'label'), color: BARTAL.danger, fontWeight: 700, cursor: 'pointer',
        }}>
          {isAr ? 'تسجيل الخروج' : 'Sign out'}
        </button>
        <div style={{ textAlign: 'center', ...typeStyle(lang, 'micro'), color: muted, marginTop: 10 }}>
          Bartal v1.2.4 · {isAr ? 'صنع في السودان ❤' : 'Made in Sudan ❤'}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOBILE · ADDRESSES LIST
// ═══════════════════════════════════════════════════════════════
function AddressesScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const addresses = [
    { id: 'home', label: isAr ? 'المنزل' : 'Home',
      name: 'Mohammed Osman', phone: '+249 91 234 5678',
      line1: isAr ? 'الرياض، بلوك ٣٢، منزل ١٤' : 'Al-Riyadh, block 32, house 14',
      city: isAr ? 'الخرطوم' : 'Khartoum', zone: 'Zone B',
      landmark: isAr ? 'بجانب مسجد النور' : 'Next to Al-Nur Mosque',
      isDefault: true },
    { id: 'work', label: isAr ? 'العمل' : 'Work',
      name: 'Mohammed Osman', phone: '+249 91 234 5678',
      line1: isAr ? 'العمارات، شارع ٦١، مبنى برج النيل' : 'Amarat, Street 61, Nile Tower',
      city: isAr ? 'الخرطوم' : 'Khartoum', zone: 'Zone A',
      landmark: isAr ? 'مقابل صيدلية الشفاء' : 'Opposite Al-Shifa Pharmacy' },
  ];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 100 }}>
      <ScreenHeader title={isAr ? 'عناويني' : 'My addresses'} onBack={onBack} lang={lang} dark={dark}/>

      <div style={{ padding: '4px 16px 14px' }}>
        <div style={{ ...typeStyle(lang, 'small'), color: muted, lineHeight: 1.5 }}>
          {isAr
            ? `${addresses.length} عناوين محفوظة. يمكنك تعيين عنوان افتراضي للتسليم السريع.`
            : `${addresses.length} saved addresses. Set a default for faster checkout.`}
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {addresses.map(a => (
          <div key={a.id} style={{
            background: surface, border: a.isDefault ? `2px solid ${BARTAL.amber}` : `1px solid ${line}`,
            borderRadius: 14, padding: 14, position: 'relative',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{
                padding: '3px 10px', borderRadius: 100,
                background: a.isDefault ? BARTAL.amberTint : (dark ? BARTAL.d_raised : BARTAL.sand),
                color: a.isDefault ? BARTAL.amber : muted,
                fontSize: 11, fontWeight: 700, letterSpacing: 0.2,
              }}>{a.label}</div>
              {a.isDefault && (
                <span style={{ ...typeStyle(lang, 'micro'), color: BARTAL.amber, fontWeight: 700, letterSpacing: 0, textTransform: 'none' }}>
                  ● {isAr ? 'افتراضي' : 'Default'}
                </span>
              )}
              <span style={{
                marginInlineStart: 'auto', ...typeStyle(lang, 'micro'), color: muted,
                padding: '2px 8px', background: dark ? BARTAL.d_raised : BARTAL.sand, borderRadius: 100, letterSpacing: 0, textTransform: 'none',
              }}>{a.zone}</span>
            </div>

            <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700 }}>{a.name}</div>
            <div style={{ ...typeStyle(lang, 'small'), color: muted, marginTop: 2, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
              {a.phone}
            </div>
            <div style={{ ...typeStyle(lang, 'body', dark), marginTop: 6, lineHeight: 1.5 }}>
              {a.line1}<br/>
              <span style={{ color: muted }}>{a.city}</span>
            </div>
            <div style={{
              marginTop: 8, padding: '7px 10px', background: dark ? BARTAL.d_raised : BARTAL.sand,
              borderRadius: 10, ...typeStyle(lang, 'small'), color: BARTAL.amber, fontWeight: 600,
            }}>
              ◉ {a.landmark}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {!a.isDefault && (
                <button style={{
                  flex: 1, background: 'transparent', color: BARTAL.navy,
                  border: `1px solid ${line}`, borderRadius: 10, padding: '9px',
                  ...typeStyle(lang, 'small'), color: BARTAL.navy, fontWeight: 700, cursor: 'pointer',
                }}>
                  {isAr ? 'تعيين كافتراضي' : 'Set default'}
                </button>
              )}
              <button style={{
                flex: 1, background: 'transparent', color: BARTAL.navy,
                border: `1px solid ${line}`, borderRadius: 10, padding: '9px',
                ...typeStyle(lang, 'small'), color: BARTAL.navy, fontWeight: 700, cursor: 'pointer',
              }}>
                {isAr ? 'تعديل' : 'Edit'}
              </button>
              <button style={{
                background: 'transparent', color: BARTAL.danger,
                border: `1px solid ${BARTAL.danger}30`, borderRadius: 10, padding: '9px 14px',
                ...typeStyle(lang, 'small'), color: BARTAL.danger, fontWeight: 700, cursor: 'pointer',
              }}>
                {isAr ? 'حذف' : 'Delete'}
              </button>
            </div>
          </div>
        ))}

        <button onClick={() => onNav && onNav('addAddress')} style={{
          background: 'transparent', border: `1.5px dashed ${line}`, borderRadius: 14,
          padding: '18px', ...typeStyle(lang, 'label'), color: BARTAL.navy, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
          marginTop: 4,
        }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
          {isAr ? 'إضافة عنوان جديد' : 'Add new address'}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOBILE · ADD / EDIT ADDRESS
// ═══════════════════════════════════════════════════════════════
function AddAddressScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const fieldWrap = {
    background: surface, border: `1px solid ${line}`,
    borderRadius: 12, padding: '10px 12px', marginBottom: 10,
  };
  const lbl = { ...typeStyle(lang, 'micro'), color: muted, marginBottom: 3 };
  const inp = {
    width: '100%', background: 'transparent', border: 'none', outline: 'none',
    ...typeStyle(lang, 'body', dark), padding: 0,
  };

  const labels = [isAr ? 'المنزل' : 'Home', isAr ? 'العمل' : 'Work', isAr ? 'آخر' : 'Other'];
  const zones = [
    { k: 'A', ar: 'الخرطوم وسط', en: 'Khartoum Central', fee: 500,  d: isAr ? '٠-١ يوم' : '0-1 day' },
    { k: 'B', ar: 'أم درمان', en: 'Omdurman',              fee: 800,  d: isAr ? '١-٢ يوم' : '1-2 days', on: true },
    { k: 'C', ar: 'الخرطوم بحري', en: 'Khartoum North',    fee: 800,  d: isAr ? '١-٢ يوم' : '1-2 days' },
    { k: 'D', ar: 'ولايات أخرى', en: 'Other states',       fee: 1000, d: isAr ? '٣-٥ أيام' : '3-5 days' },
  ];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 110 }}>
      <ScreenHeader title={isAr ? 'عنوان جديد' : 'New address'} onBack={onBack} lang={lang} dark={dark}/>

      <Section lang={lang} dark={dark} title={isAr ? 'التسمية' : 'Label'}>
        <div style={{ display: 'flex', gap: 8 }}>
          {labels.map((l, i) => (
            <div key={i} style={{
              flex: 1, padding: '11px 10px', borderRadius: 12, textAlign: 'center',
              background: i === 0 ? BARTAL.amberTint : surface,
              border: i === 0 ? `2px solid ${BARTAL.amber}` : `1px solid ${line}`,
              ...typeStyle(lang, 'label', dark), fontWeight: 700,
              color: i === 0 ? BARTAL.amber : text, cursor: 'pointer',
            }}>{l}</div>
          ))}
        </div>
      </Section>

      <Section lang={lang} dark={dark} title={isAr ? 'جهة الاتصال' : 'Contact'}>
        <div style={fieldWrap}>
          <div style={lbl}>{isAr ? 'الاسم الكامل' : 'Full name'}</div>
          <input style={inp} defaultValue="Mohammed Osman"/>
        </div>
        <div style={fieldWrap}>
          <div style={lbl}>{isAr ? 'رقم الهاتف' : 'Phone number'}</div>
          <input style={{...inp, fontFamily: "'JetBrains Mono', ui-monospace, monospace"}} defaultValue="+249 91 234 5678"/>
        </div>
      </Section>

      <Section lang={lang} dark={dark} title={isAr ? 'منطقة التوصيل' : 'Delivery zone'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {zones.map(z => (
            <div key={z.k} style={{
              padding: 12, borderRadius: 12,
              background: z.on ? BARTAL.amberTint : surface,
              border: z.on ? `2px solid ${BARTAL.amber}` : `1px solid ${line}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ ...typeStyle(lang, 'label', dark), fontWeight: 700 }}>
                  {isAr ? 'المنطقة' : 'Zone'} {z.k}
                </span>
                <PriceTag amount={z.fee} lang={lang} size={12}/>
              </div>
              <div style={{ ...typeStyle(lang, 'small'), color: muted, marginBottom: 2 }}>{isAr ? z.ar : z.en}</div>
              <div style={{ ...typeStyle(lang, 'micro'), color: muted, letterSpacing: 0, textTransform: 'none' }}>{z.d}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section lang={lang} dark={dark} title={isAr ? 'العنوان التفصيلي' : 'Street address'}>
        <div style={fieldWrap}>
          <div style={lbl}>{isAr ? 'الحي / الشارع / رقم المنزل' : 'District / street / house #'}</div>
          <input style={inp} placeholder={isAr ? 'مثال: الرياض، بلوك ٣٢، منزل ١٤' : 'e.g. Al-Riyadh, block 32, house 14'}/>
        </div>
        <div style={fieldWrap}>
          <div style={lbl}>{isAr ? 'المدينة' : 'City'}</div>
          <input style={inp} defaultValue={isAr ? 'الخرطوم' : 'Khartoum'}/>
        </div>
      </Section>

      <Section lang={lang} dark={dark} title={
        <span>
          {isAr ? 'علامة مميزة' : 'Landmark'} <span style={{ color: BARTAL.danger }}>*</span>
        </span>
      }>
        <div style={{ ...fieldWrap, background: BARTAL.amberTint, border: `1px solid ${BARTAL.amber}40` }}>
          <div style={{...lbl, color: BARTAL.amber}}>
            {isAr ? 'ساعد السائق على إيجاد عنوانك بسرعة' : 'Help the driver find your address faster'}
          </div>
          <input style={inp} placeholder={isAr ? 'مثال: بجانب مسجد النور' : 'e.g. Next to Al-Nur Mosque'}/>
        </div>
      </Section>

      <Section lang={lang} dark={dark} title={isAr ? 'ملاحظات للسائق' : 'Notes for driver'}>
        <div style={fieldWrap}>
          <textarea rows="2" style={{...inp, resize: 'none'}} placeholder={isAr ? 'اختياري — اتصل عند الوصول، الطابق الثاني...' : 'Optional — call on arrival, 2nd floor...'}/>
        </div>
      </Section>

      <div style={{ padding: '0 16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                         padding: '10px 0', ...typeStyle(lang, 'body', dark) }}>
          <input type="checkbox" defaultChecked style={{ accentColor: BARTAL.amber, width: 18, height: 18 }}/>
          <span>{isAr ? 'تعيين كعنوان افتراضي' : 'Set as default address'}</span>
        </label>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: surface, borderTop: `1px solid ${line}`,
        padding: '14px 16px 18px',
      }}>
        <button onClick={() => onNav && onNav('addresses')} style={{
          width: '100%', background: BARTAL.navy, color: '#fff', border: 'none',
          borderRadius: 14, padding: '16px', ...typeStyle(lang, 'label'), color: '#fff', fontWeight: 700,
        }}>
          {isAr ? 'حفظ العنوان' : 'Save address'}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOBILE · SETTINGS
// ═══════════════════════════════════════════════════════════════
function SettingsScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : BARTAL.surface;
  const bg = dark ? BARTAL.d_bg : BARTAL.sand;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const Row = ({ icon, title, sub, right, last, onClick }) => (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px',
      borderBottom: last ? 'none' : `1px solid ${line}`,
      cursor: onClick ? 'pointer' : 'default',
    }}>
      {icon && (
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: dark ? BARTAL.d_raised : BARTAL.sand,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{icon}</div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...typeStyle(lang, 'label', dark), fontWeight: 600 }}>{title}</div>
        {sub && <div style={{ ...typeStyle(lang, 'small'), color: muted, marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );

  const Toggle = ({ on }) => (
    <div style={{
      width: 40, height: 24, borderRadius: 100, padding: 2,
      background: on ? BARTAL.amber : line,
      display: 'flex', alignItems: 'center', justifyContent: on ? 'flex-end' : 'flex-start',
      transition: 'all 0.2s',
    }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff' }}/>
    </div>
  );

  const Chevron = () => <span style={{ color: muted, fontSize: 16, lineHeight: 1 }}>{isAr ? '‹' : '›'}</span>;

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} style={{ width: '100%', height: '100%', background: bg, overflow: 'auto', paddingBottom: 40 }}>
      <ScreenHeader title={isAr ? 'الإعدادات' : 'Settings'} onBack={onBack} lang={lang} dark={dark}/>

      <Section lang={lang} dark={dark} title={isAr ? 'اللغة والمنطقة' : 'Language & region'}>
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, overflow: 'hidden' }}>
          <Row title={isAr ? 'اللغة' : 'Language'}
               sub={isAr ? 'العربية (الحالية)' : 'English (current)'}
               right={<Chevron/>}/>
          <Row title={isAr ? 'العملة' : 'Currency'}
               sub={isAr ? 'الجنيه السوداني (ج.س)' : 'Sudanese Pound (SDG)'}
               right={<Chevron/>}/>
          <Row title={isAr ? 'الأرقام' : 'Numerals'}
               sub={isAr ? 'غربية (123)' : 'Western (123)'}
               right={<Chevron/>} last/>
        </div>
      </Section>

      <Section lang={lang} dark={dark} title={isAr ? 'المظهر' : 'Appearance'}>
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, overflow: 'hidden' }}>
          <Row title={isAr ? 'الوضع الداكن' : 'Dark mode'}
               sub={dark ? (isAr ? 'مفعّل' : 'On') : (isAr ? 'مطفأ' : 'Off')}
               right={<Toggle on={dark}/>}/>
          <Row title={isAr ? 'حجم الخط' : 'Text size'}
               sub={isAr ? 'متوسط' : 'Medium'}
               right={<Chevron/>} last/>
        </div>
      </Section>

      <Section lang={lang} dark={dark} title={isAr ? 'الإشعارات' : 'Notifications'}>
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, overflow: 'hidden' }}>
          <Row title={isAr ? 'تحديثات الطلبات' : 'Order updates'}
               sub={isAr ? 'SMS + إشعارات التطبيق' : 'SMS + push notifications'}
               right={<Toggle on={true}/>}/>
          <Row title={isAr ? 'تنبيهات واتساب' : 'WhatsApp alerts'}
               sub={isAr ? 'تأكيد الإيصال والتوصيل' : 'Receipt & delivery confirmations'}
               right={<Toggle on={true}/>}/>
          <Row title={isAr ? 'العروض والتخفيضات' : 'Offers & promotions'}
               sub={isAr ? 'بريد إلكتروني فقط' : 'Email only'}
               right={<Toggle on={false}/>}/>
          <Row title={isAr ? 'توصيات المنتجات' : 'Product recommendations'}
               right={<Toggle on={false}/>} last/>
        </div>
      </Section>

      <Section lang={lang} dark={dark} title={isAr ? 'الخصوصية' : 'Privacy'}>
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, overflow: 'hidden' }}>
          <Row title={isAr ? 'بياناتي' : 'My data'}
               sub={isAr ? 'تنزيل أو حذف' : 'Download or delete'}
               right={<Chevron/>}/>
          <Row title={isAr ? 'الجلسات النشطة' : 'Active sessions'}
               sub={isAr ? '٢ أجهزة' : '2 devices'}
               right={<Chevron/>}/>
          <Row title={isAr ? 'تسجيل الخروج من كل الأجهزة' : 'Sign out all devices'}
               right={<Chevron/>} last/>
        </div>
      </Section>

      <Section lang={lang} dark={dark} title={isAr ? 'عن التطبيق' : 'About'}>
        <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 14, overflow: 'hidden' }}>
          <Row title={isAr ? 'الإصدار' : 'Version'} sub="1.2.4 · build 2026.4.19"/>
          <Row title={isAr ? 'شروط الاستخدام' : 'Terms of service'} right={<Chevron/>}/>
          <Row title={isAr ? 'سياسة الخصوصية' : 'Privacy policy'} right={<Chevron/>} last/>
        </div>
      </Section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WEB · ACCOUNT SUBPAGES (Profile, Addresses, Security)
// Each renders its own full-width page with a shared sidebar.
// ═══════════════════════════════════════════════════════════════
function WebAccountLayout({ lang, dark, active, children }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const nav = [
    { k: 'dashboard', ar: 'لوحة الحساب',    en: 'Dashboard' },
    { k: 'profile',   ar: 'المعلومات الشخصية', en: 'Personal info' },
    { k: 'addresses', ar: 'العناوين',        en: 'Addresses' },
    { k: 'orders',    ar: 'الطلبات',         en: 'Orders' },
    { k: 'security',  ar: 'الأمان',          en: 'Security' },
    { k: 'prefs',     ar: 'التفضيلات',       en: 'Preferences' },
  ];

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'auto',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
    }}>
      <WebHeader lang={lang} dark={dark}/>

      <div style={{ padding: '24px', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ ...typeStyle('en', 'micro'), color: muted, marginBottom: 4 }}>
          {isAr ? 'الرئيسية' : 'Home'} / <span style={{ color: BARTAL.amber }}>{isAr ? 'حسابي' : 'Account'}</span>
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: text, marginBottom: 18 }}>
          {isAr ? 'إدارة الحساب' : 'Account management'}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>
          {/* Sidebar */}
          <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'hidden', alignSelf: 'start' }}>
            <div style={{ padding: 16, borderBottom: `1px solid ${line}`,
                          display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: BARTAL.amber, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 800,
              }}>MO</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Mohammed Osman
                </div>
                <div style={{ fontSize: 11, color: muted, fontFamily: "'JetBrains Mono', monospace", marginTop: 1 }}>
                  +249 91 234 5678
                </div>
              </div>
            </div>
            {nav.map((n, i) => (
              <div key={n.k} style={{
                padding: '11px 16px',
                borderBottom: i < nav.length - 1 ? `1px solid ${line}` : 'none',
                background: n.k === active ? BARTAL.amberTint : 'transparent',
                color: n.k === active ? BARTAL.amber : text,
                fontSize: 13, fontWeight: n.k === active ? 700 : 500, cursor: 'pointer',
                borderInlineStart: n.k === active ? `3px solid ${BARTAL.amber}` : '3px solid transparent',
              }}>{isAr ? n.ar : n.en}</div>
            ))}
          </div>

          {/* Content */}
          <div>{children}</div>
        </div>
      </div>

      <WebFooter lang={lang} dark={dark}/>
    </div>
  );
}

function WebAccountProfile({ lang, dark }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const fieldWrap = {
    background: surface, border: `1px solid ${line}`, borderRadius: 10,
    padding: '11px 14px',
  };
  const lbl = { fontSize: 11, fontWeight: 700, color: muted, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 4 };
  const val = { fontSize: 14, color: text, fontWeight: 500 };

  return (
    <WebAccountLayout lang={lang} dark={dark} active="profile">
      <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: 18, borderBottom: `1px solid ${line}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: text, flex: 1 }}>
            {isAr ? 'المعلومات الشخصية' : 'Personal information'}
          </div>
          <button style={{
            background: BARTAL.amber, color: '#fff', border: 'none', borderRadius: 8,
            padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'inherit',
          }}>{isAr ? 'تعديل' : 'Edit'}</button>
        </div>

        <div style={{ padding: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            [isAr ? 'الاسم الأول' : 'First name',   'Mohammed'],
            [isAr ? 'الاسم الأخير' : 'Last name',   'Osman Ahmed'],
            [isAr ? 'الهاتف' : 'Phone',            '+249 91 234 5678', true],
            [isAr ? 'البريد الإلكتروني' : 'Email', 'm.osman@example.sd'],
            [isAr ? 'تاريخ الميلاد' : 'Date of birth', '15 Mar 1992'],
            [isAr ? 'النوع' : 'Gender',             isAr ? 'ذكر' : 'Male'],
          ].map(([k, v, mono], i) => (
            <div key={i} style={fieldWrap}>
              <div style={lbl}>{k}</div>
              <div style={{...val, fontFamily: mono ? "'JetBrains Mono', monospace" : 'inherit'}}>{v}</div>
            </div>
          ))}
        </div>

        {/* Verification */}
        <div style={{ padding: 18, borderTop: `1px solid ${line}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { k: isAr ? 'رقم الهاتف' : 'Phone verified',  on: true, via: 'SMS' },
            { k: isAr ? 'البريد الإلكتروني' : 'Email verified', on: true, via: '2024' },
            { k: isAr ? 'الهوية الوطنية' : 'National ID', on: false, via: isAr ? 'مطلوب للمبالغ > 500K' : 'Required for > 500K' },
          ].map((v, i) => (
            <div key={i} style={{...fieldWrap, display: 'flex', alignItems: 'center', gap: 10}}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: v.on ? BARTAL.success : (dark ? BARTAL.d_raised : BARTAL.sand),
                color: v.on ? '#fff' : muted,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
              }}>{v.on ? '✓' : '!'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{v.k}</div>
                <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>{v.via}</div>
              </div>
              {!v.on && (
                <span style={{ fontSize: 11, color: BARTAL.amber, fontWeight: 700, cursor: 'pointer' }}>
                  {isAr ? 'تحقق' : 'Verify'}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Delete account */}
      <div style={{ marginTop: 14, padding: 18, background: surface, border: `1px solid ${BARTAL.danger}30`,
                    borderRadius: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: BARTAL.danger, marginBottom: 4 }}>
          {isAr ? 'حذف الحساب' : 'Delete account'}
        </div>
        <div style={{ fontSize: 12, color: muted, lineHeight: 1.55, marginBottom: 10 }}>
          {isAr
            ? 'بمجرد حذف حسابك، لا يمكنك استرداده. سيتم حذف جميع البيانات بعد ٣٠ يوماً.'
            : 'Once deleted, your account cannot be recovered. All data is erased after 30 days.'}
        </div>
        <button style={{
          background: 'transparent', color: BARTAL.danger, border: `1px solid ${BARTAL.danger}`,
          borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'inherit',
        }}>{isAr ? 'طلب حذف الحساب' : 'Request account deletion'}</button>
      </div>
    </WebAccountLayout>
  );
}

function WebAccountAddresses({ lang, dark }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const addresses = [
    { id: 'home', label: isAr ? 'المنزل' : 'Home',
      name: 'Mohammed Osman', phone: '+249 91 234 5678',
      line1: isAr ? 'الرياض، بلوك ٣٢، منزل ١٤' : 'Al-Riyadh, block 32, house 14',
      city: isAr ? 'الخرطوم' : 'Khartoum', zone: 'Zone B',
      landmark: isAr ? 'بجانب مسجد النور' : 'Next to Al-Nur Mosque',
      isDefault: true },
    { id: 'work', label: isAr ? 'العمل' : 'Work',
      name: 'Mohammed Osman', phone: '+249 91 234 5678',
      line1: isAr ? 'العمارات، شارع ٦١، برج النيل' : 'Amarat, Street 61, Nile Tower',
      city: isAr ? 'الخرطوم' : 'Khartoum', zone: 'Zone A',
      landmark: isAr ? 'مقابل صيدلية الشفاء' : 'Opposite Al-Shifa Pharmacy' },
    { id: 'parents', label: isAr ? 'منزل الوالدين' : 'Parents\' home',
      name: 'Osman Ahmed', phone: '+249 92 876 5432',
      line1: isAr ? 'بحري، الشعبية، بلوك ١٤' : 'Bahri, Shabiyya, block 14',
      city: isAr ? 'الخرطوم بحري' : 'Khartoum North', zone: 'Zone C',
      landmark: isAr ? 'خلف مدرسة الخرطوم بحري الثانوية' : 'Behind Bahri Secondary School' },
  ];

  return (
    <WebAccountLayout lang={lang} dark={dark} active="addresses">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: text }}>
            {isAr ? 'العناوين المحفوظة' : 'Saved addresses'}
          </div>
          <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>
            {isAr ? `${addresses.length} عناوين · عنوان افتراضي واحد` : `${addresses.length} addresses · 1 default`}
          </div>
        </div>
        <button style={{
          background: BARTAL.navy, color: '#fff', border: 'none', borderRadius: 8,
          padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
          {isAr ? 'إضافة عنوان' : 'Add address'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {addresses.map(a => (
          <div key={a.id} style={{
            background: surface, border: a.isDefault ? `2px solid ${BARTAL.amber}` : `1px solid ${line}`,
            borderRadius: 12, padding: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  padding: '3px 10px', borderRadius: 100,
                  background: a.isDefault ? BARTAL.amberTint : (dark ? BARTAL.d_raised : BARTAL.sand),
                  color: a.isDefault ? BARTAL.amber : muted,
                  fontSize: 11, fontWeight: 700,
                }}>{a.label}</div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                  background: dark ? BARTAL.d_raised : BARTAL.sand, color: muted,
                }}>{a.zone}</span>
                {a.isDefault && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: BARTAL.amber }}>
                    ● {isAr ? 'افتراضي' : 'DEFAULT'}
                  </span>
                )}
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: text }}>{a.name}</div>
            <div style={{ fontSize: 11, color: muted, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
              {a.phone}
            </div>
            <div style={{ fontSize: 13, color: text, marginTop: 8, lineHeight: 1.55 }}>
              {a.line1}<br/>
              <span style={{ color: muted }}>{a.city}</span>
            </div>
            <div style={{
              marginTop: 8, padding: '7px 10px', background: dark ? BARTAL.d_raised : BARTAL.sand,
              borderRadius: 8, fontSize: 12, color: BARTAL.amber, fontWeight: 600,
            }}>
              ◉ {a.landmark}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {!a.isDefault && (
                <button style={{
                  flex: 1, background: 'transparent', color: BARTAL.navy,
                  border: `1px solid ${line}`, borderRadius: 8, padding: 8,
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}>{isAr ? 'تعيين افتراضي' : 'Set default'}</button>
              )}
              <button style={{
                flex: 1, background: 'transparent', color: BARTAL.navy,
                border: `1px solid ${line}`, borderRadius: 8, padding: 8,
                fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>{isAr ? 'تعديل' : 'Edit'}</button>
              <button style={{
                background: 'transparent', color: BARTAL.danger,
                border: `1px solid ${BARTAL.danger}30`, borderRadius: 8, padding: '8px 12px',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>×</button>
            </div>
          </div>
        ))}
      </div>
    </WebAccountLayout>
  );
}

function WebAccountSecurity({ lang, dark }) {
  const isAr = lang === 'ar';
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;

  const sessions = [
    { device: 'iPhone 14 · iOS 17.4', loc: isAr ? 'الخرطوم، السودان' : 'Khartoum, Sudan', when: isAr ? 'نشط الآن' : 'Active now', current: true },
    { device: 'Chrome · macOS',       loc: isAr ? 'الخرطوم، السودان' : 'Khartoum, Sudan', when: isAr ? 'منذ ساعتين' : '2 hours ago' },
    { device: 'Samsung A34 · Android 14', loc: isAr ? 'بورتسودان، السودان' : 'Port Sudan, Sudan', when: isAr ? 'منذ ٣ أيام' : '3 days ago' },
  ];

  const Card = ({ title, children }) => (
    <div style={{ background: surface, border: `1px solid ${line}`, borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
      <div style={{ padding: 18, borderBottom: `1px solid ${line}`, fontSize: 15, fontWeight: 700, color: text }}>
        {title}
      </div>
      {children}
    </div>
  );

  return (
    <WebAccountLayout lang={lang} dark={dark} active="security">
      <Card title={isAr ? 'كلمة المرور' : 'Password'}>
        <div style={{ padding: 18 }}>
          <div style={{ fontSize: 13, color: muted, marginBottom: 14, lineHeight: 1.55 }}>
            {isAr
              ? 'آخر تغيير: ٨ يناير ٢٠٢٦. استخدم كلمة مرور قوية فريدة لم تستخدمها في مكان آخر.'
              : 'Last changed: 8 Jan 2026. Use a strong, unique password you don\'t use elsewhere.'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            {[
              [isAr ? 'كلمة المرور الحالية' : 'Current password', '••••••••'],
              [isAr ? 'كلمة المرور الجديدة' : 'New password', ''],
              [isAr ? 'تأكيد الكلمة الجديدة' : 'Confirm new password', ''],
            ].map(([k, v], i) => (
              <div key={i} style={{
                background: dark ? BARTAL.d_raised : BARTAL.sand, border: `1px solid ${line}`,
                borderRadius: 10, padding: '10px 14px',
                gridColumn: i === 0 ? '1 / -1' : 'auto',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: muted, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
                <input type="password" defaultValue={v} placeholder="••••••••"
                       style={{
                         width: '100%', background: 'transparent', border: 'none', outline: 'none',
                         fontSize: 14, color: text, padding: 0, fontFamily: "'JetBrains Mono', monospace",
                       }}/>
              </div>
            ))}
          </div>
          <button style={{
            background: BARTAL.navy, color: '#fff', border: 'none', borderRadius: 8,
            padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>{isAr ? 'تحديث كلمة المرور' : 'Update password'}</button>
        </div>
      </Card>

      <Card title={isAr ? 'المصادقة الثنائية' : 'Two-factor authentication'}>
        <div style={{ padding: 18 }}>
          {[
            { k: isAr ? 'رمز SMS عند الدخول' : 'SMS code on login', on: true,  sub: isAr ? '+249 91 234 5678' : 'To +249 91 234 5678' },
            { k: isAr ? 'تطبيق المصادقة (Authy)' : 'Authenticator app (Authy)', on: false, sub: isAr ? 'موصى به للأمان الأقصى' : 'Recommended for highest security' },
            { k: isAr ? 'واتساب للتنبيهات الأمنية' : 'WhatsApp for security alerts', on: true, sub: isAr ? 'إشعار فوري عند محاولة تسجيل دخول' : 'Instant alert on login attempts' },
          ].map((r, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 0', borderBottom: i < 2 ? `1px solid ${line}` : 'none',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{r.k}</div>
                <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>{r.sub}</div>
              </div>
              <div style={{
                padding: '4px 10px', borderRadius: 100,
                background: r.on ? BARTAL.success + '15' : (dark ? BARTAL.d_raised : BARTAL.sand),
                color: r.on ? BARTAL.success : muted,
                fontSize: 11, fontWeight: 700,
              }}>{r.on ? (isAr ? 'مفعّل' : 'Enabled') : (isAr ? 'مطفأ' : 'Off')}</div>
              <button style={{
                background: 'transparent', color: BARTAL.amber, border: 'none',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>{r.on ? (isAr ? 'إدارة' : 'Manage') : (isAr ? 'تفعيل' : 'Enable')}</button>
            </div>
          ))}
        </div>
      </Card>

      <Card title={isAr ? 'الجلسات النشطة' : 'Active sessions'}>
        {sessions.map((s, i) => (
          <div key={i} style={{
            padding: '14px 18px', borderBottom: i < sessions.length - 1 ? `1px solid ${line}` : 'none',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: dark ? BARTAL.d_raised : BARTAL.sand,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 800, color: BARTAL.navy,
            }}>{s.device.startsWith('iPhone') || s.device.startsWith('Samsung') ? '◫' : '▭'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: text }}>{s.device}</span>
                {s.current && (
                  <span style={{
                    padding: '2px 8px', borderRadius: 100,
                    background: BARTAL.success + '20', color: BARTAL.success,
                    fontSize: 10, fontWeight: 700,
                  }}>{isAr ? 'الجلسة الحالية' : 'THIS DEVICE'}</span>
                )}
              </div>
              <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>
                {s.loc} · {s.when}
              </div>
            </div>
            {!s.current && (
              <button style={{
                background: 'transparent', color: BARTAL.danger,
                border: `1px solid ${BARTAL.danger}30`, borderRadius: 8, padding: '6px 12px',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>{isAr ? 'تسجيل الخروج' : 'Sign out'}</button>
            )}
          </div>
        ))}
      </Card>
    </WebAccountLayout>
  );
}

Object.assign(window, {
  ProfileScreen, AddressesScreen, AddAddressScreen, SettingsScreen,
  WebAccountLayout, WebAccountProfile, WebAccountAddresses, WebAccountSecurity,
});
