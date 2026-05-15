// auth-gaps.jsx — Splash, Onboarding (mobile) + Forgot/Reset password (mobile + web)
// AR/EN, light/dark. Uses the existing BARTAL tokens + shared auth atoms.

// ═══════════════════════════════════════════════════════════════
// SPLASH — brand moment, motif-heavy, subtle loading indicator
// ═══════════════════════════════════════════════════════════════
function SplashScreen({ lang, dark, onNav }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: BARTAL.navyInk,
      overflow: 'hidden', position: 'relative',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Dense full-bleed motif */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
        <defs>
          <pattern id="splash-motif" x="0" y="0" width="96" height="96" patternUnits="userSpaceOnUse">
            <g stroke={BARTAL.amberSoft} strokeWidth="0.9" fill="none">
              <path d="M48 8 L58 28 L78 22 L72 42 L90 48 L72 54 L78 74 L58 68 L48 88 L38 68 L18 74 L24 54 L6 48 L24 42 L18 22 L38 28 Z"/>
              <path d="M48 26 L68 48 L48 70 L28 48 Z"/>
              <circle cx="48" cy="48" r="3" fill={BARTAL.amber} stroke="none"/>
            </g>
          </pattern>
          <radialGradient id="splash-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={BARTAL.amber} stopOpacity="0.4"/>
            <stop offset="100%" stopColor={BARTAL.amber} stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#splash-motif)"/>
        <rect width="100%" height="100%" fill="url(#splash-glow)"/>
      </svg>

      {/* Centered logo lockup */}
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{
          width: 112, height: 112, margin: '0 auto',
          borderRadius: 28, background: BARTAL.amber,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 24px 60px rgba(217,119,6,0.45)',
          position: 'relative',
        }}>
          <LogoMark color="#fff" accent={BARTAL.navyInk} size={64}/>
          {/* tick-mark corner */}
          <div style={{
            position: 'absolute', top: -6, [isAr ? 'left' : 'right']: -6,
            width: 30, height: 30, borderRadius: 15, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}>
            <CheckIcon color={BARTAL.amber} size={15}/>
          </div>
        </div>
        <div style={{
          fontSize: 54, fontWeight: 700, color: '#fff',
          marginTop: 22, letterSpacing: isAr ? 0 : -1.5, lineHeight: 1,
        }}>
          {isAr ? 'برتال' : 'bartal'}
        </div>
        <div style={{
          fontSize: 11, color: BARTAL.amberSoft,
          marginTop: 10, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600,
        }}>
          {isAr ? 'سوق السودان الرقمي' : "Sudan's digital souq"}
        </div>
      </div>

      {/* bottom: loader + version */}
      <div style={{
        position: 'absolute', bottom: 60, left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 44, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.15)', overflow: 'hidden',
        }}>
          <div style={{ width: '60%', height: '100%', background: BARTAL.amber, borderRadius: 2 }}/>
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontFamily: "'JetBrains Mono'" }}>
          v1.4.2 · {isAr ? 'جاري التهيئة' : 'initializing'}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ONBOARDING — 3-slide carousel with value props
// ═══════════════════════════════════════════════════════════════
function OnboardingScreen({ lang, dark, onNav, slideIndex = 0 }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const text = dark ? BARTAL.d_text : BARTAL.navyInk;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;

  const slides = [
    {
      eyebrow_ar: 'شراء',  eyebrow_en: 'Shop',
      title_ar: 'كل ما تحتاجه من سوق السودان، في مكان واحد.',
      title_en: 'Everything Sudan sells — in one place.',
      body_ar: 'عطور، إلكترونيات، أزياء، منزل. من متاجر معروفة وبائعين موثوقين.',
      body_en: 'Fragrance, electronics, fashion, home. From trusted sellers across the country.',
      illo: 'shop',
    },
    {
      eyebrow_ar: 'ادفع',  eyebrow_en: 'Pay',
      title_ar: 'حوّل بنكياً أو بكاش. بدون بطاقات.',
      title_en: 'Pay by bank transfer or cash. No cards needed.',
      body_ar: 'فارو، بنك الخرطوم، EBS — أو ادفع عند الاستلام. صوّر الإيصال لتأكيد الطلب.',
      body_en: 'Faroo, Bank of Khartoum, EBS — or cash on delivery. Upload your receipt to confirm.',
      illo: 'pay',
    },
    {
      eyebrow_ar: 'استلم',  eyebrow_en: 'Track',
      title_ar: 'توصيل لكل ولاية. تابع طلبك لحظة بلحظة.',
      title_en: 'Delivery to every state. Track your order in real time.',
      body_ar: 'الخرطوم · أم درمان · بحري · بورتسودان · عطبرة · ومدن أخرى. تحديثات واتساب.',
      body_en: 'Khartoum, Omdurman, Bahri, Port Sudan, Atbara, and more. WhatsApp updates at every step.',
      illo: 'track',
    },
  ];
  const slide = slides[slideIndex] || slides[0];
  const isLast = slideIndex === slides.length - 1;

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'hidden',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar — skip */}
      <div style={{
        padding: '16px 22px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LogoMark color={BARTAL.amber} accent={BARTAL.navyInk} size={22}/>
          <div style={{ fontSize: 15, fontWeight: 700, color: text }}>
            {isAr ? 'برتال' : 'bartal'}
          </div>
        </div>
        <div onClick={() => onNav && onNav('welcome')} style={{
          fontSize: 13, color: muted, fontWeight: 600, cursor: 'pointer',
        }}>
          {isAr ? 'تخطي' : 'Skip'}
        </div>
      </div>

      {/* Illustration — tall hero panel */}
      <div style={{
        flex: '0 0 auto', height: 360, margin: '8px 22px 0', borderRadius: 24,
        background: slide.illo === 'shop' ? BARTAL.navyInk : (slide.illo === 'pay' ? BARTAL.amber : '#0F7A3F'),
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Motif bg */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: slide.illo === 'pay' ? 0.3 : 0.22 }}>
          <defs>
            <pattern id={`onb-motif-${slideIndex}`} x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
              <g stroke={slide.illo === 'pay' ? '#fff' : BARTAL.amberSoft} strokeWidth="0.8" fill="none">
                <path d="M35 5 L42 20 L57 15 L52 30 L65 35 L52 40 L57 55 L42 50 L35 65 L28 50 L13 55 L18 40 L5 35 L18 30 L13 15 L28 20 Z"/>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#onb-motif-${slideIndex})`}/>
        </svg>

        {/* Scene-specific illo */}
        <OnboardingIllo kind={slide.illo} isAr={isAr}/>
      </div>

      {/* Text block */}
      <div style={{ padding: '28px 26px 0', flex: 1 }}>
        <div style={{
          fontSize: 11, color: BARTAL.amber, letterSpacing: 2,
          textTransform: 'uppercase', fontWeight: 700, marginBottom: 10,
        }}>
          {isAr ? slide.eyebrow_ar : slide.eyebrow_en}
        </div>
        <div style={{
          fontSize: 24, fontWeight: 700, color: text, lineHeight: 1.25,
          marginBottom: 12, textWrap: 'balance',
        }}>
          {isAr ? slide.title_ar : slide.title_en}
        </div>
        <div style={{
          fontSize: 14, color: muted, lineHeight: 1.55, maxWidth: 320,
        }}>
          {isAr ? slide.body_ar : slide.body_en}
        </div>
      </div>

      {/* Bottom: dots + CTA */}
      <div style={{ padding: '22px 26px 34px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {slides.map((_, i) => (
            <div key={i} style={{
              height: 5, borderRadius: 3, transition: 'all 180ms',
              width: i === slideIndex ? 28 : 8,
              background: i === slideIndex ? BARTAL.amber : (dark ? BARTAL.d_line : '#E5DFD4'),
            }}/>
          ))}
        </div>

        <button onClick={() => onNav && onNav(isLast ? 'welcome' : 'onboarding', slideIndex + 1)} style={{
          width: '100%', background: BARTAL.amber, color: '#fff', border: 'none',
          padding: '15px', borderRadius: 14, fontSize: 15, fontWeight: 700,
          fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {isLast ? (isAr ? 'ابدأ التسوق' : 'Start shopping') : (isAr ? 'التالي' : 'Next')}
          <span style={{ fontSize: 18, transform: isAr ? 'scaleX(-1)' : 'none' }}>→</span>
        </button>
      </div>
    </div>
  );
}

// Onboarding illustration variants — drawn in SVG placeholder style
function OnboardingIllo({ kind, isAr }) {
  if (kind === 'shop') {
    return (
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* floating product cards in a grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
          width: '80%', transform: 'perspective(800px) rotateX(12deg)',
        }}>
          {[
            { c: BARTAL.amber,    emoji: '🌹' },
            { c: '#D4A574',       emoji: '📱' },
            { c: BARTAL.amberSoft,emoji: '👗' },
            { c: '#8B3A3A',       emoji: '👜' },
            { c: '#0F7A3F',       emoji: '🕌' },
            { c: BARTAL.amber,    emoji: '🏺' },
          ].map((it, i) => (
            <div key={i} style={{
              aspectRatio: '1', borderRadius: 12, background: it.c,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, opacity: 0.9 + (i % 2) * 0.1,
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}>
              {it.emoji}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (kind === 'pay') {
    return (
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28,
      }}>
        {/* Stylized receipt */}
        <div style={{
          width: 200, background: '#fff', borderRadius: 10, padding: '18px 16px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
          fontFamily: "'JetBrains Mono'",
          transform: 'rotate(-4deg)',
          position: 'relative',
        }}>
          <div style={{ fontSize: 10, color: BARTAL.textMute, marginBottom: 6, textAlign: 'center' }}>
            FAROO BANK · إيصال
          </div>
          <div style={{ height: 1, background: BARTAL.line, margin: '6px 0' }}/>
          <div style={{ fontSize: 9, color: BARTAL.text, display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span>AMOUNT</span><span style={{ fontWeight: 700 }}>SDG 8,500</span>
          </div>
          <div style={{ fontSize: 9, color: BARTAL.text, display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span>REF</span><span>BRT-001847</span>
          </div>
          <div style={{ fontSize: 9, color: BARTAL.text, display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>DATE</span><span>19/04/26</span>
          </div>
          <div style={{ height: 1, background: BARTAL.line, margin: '8px 0' }}/>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 10, color: '#0F7A3F', fontWeight: 700,
          }}>
            <CheckIcon color="#0F7A3F" size={12}/> VERIFIED
          </div>
          {/* torn edge */}
          <div style={{
            position: 'absolute', bottom: -5, left: 0, right: 0, height: 8,
            backgroundImage: 'radial-gradient(circle at 5px 5px, transparent 4px, #fff 4px)',
            backgroundSize: '10px 10px', backgroundPosition: '0 -5px',
          }}/>
        </div>
        {/* Camera icon badge */}
        <div style={{
          position: 'absolute', bottom: 40, [isAr ? 'left' : 'right']: 50,
          width: 62, height: 62, borderRadius: 31, background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          transform: 'rotate(10deg)',
        }}>
          <CameraIcon color={BARTAL.amber} size={28}/>
        </div>
      </div>
    );
  }
  // track
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32,
    }}>
      <div style={{
        width: '100%', maxWidth: 260,
        background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
        borderRadius: 16, padding: 18,
        border: '1px solid rgba(255,255,255,0.25)',
      }}>
        {[
          { l_ar: 'تأكيد الطلب',     l_en: 'Order placed',    on: true, now: false },
          { l_ar: 'الإيصال موثق',    l_en: 'Receipt verified',on: true, now: false },
          { l_ar: 'جاري التجهيز',    l_en: 'Preparing',       on: true, now: true  },
          { l_ar: 'في الطريق',       l_en: 'Out for delivery',on: false,now: false },
          { l_ar: 'تم التسليم',      l_en: 'Delivered',       on: false,now: false },
        ].map((s, i, arr) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: i < arr.length - 1 ? 10 : 0 }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 18, height: 18, borderRadius: 9,
                background: s.on ? '#fff' : 'transparent',
                border: `2px solid ${s.on ? '#fff' : 'rgba(255,255,255,0.5)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: s.now ? '0 0 0 4px rgba(255,255,255,0.3)' : 'none',
              }}>
                {s.on && !s.now && <CheckIcon color="#0F7A3F" size={10}/>}
                {s.now && <div style={{ width: 6, height: 6, borderRadius: 3, background: '#0F7A3F' }}/>}
              </div>
              {i < arr.length - 1 && (
                <div style={{
                  position: 'absolute', top: 18, [isAr ? 'right' : 'left']: 7, width: 2, height: 16,
                  background: s.on ? '#fff' : 'rgba(255,255,255,0.3)',
                }}/>
              )}
            </div>
            <div style={{ color: '#fff', fontSize: 12, fontWeight: s.now ? 700 : 500, flex: 1 }}>
              {isAr ? s.l_ar : s.l_en}
            </div>
            {s.now && (
              <div style={{
                fontSize: 9, padding: '2px 7px', borderRadius: 10,
                background: '#fff', color: '#0F7A3F', fontWeight: 700,
              }}>
                {isAr ? 'الآن' : 'NOW'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FORGOT PASSWORD (mobile)
// ═══════════════════════════════════════════════════════════════
function ForgotPasswordScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const text = dark ? BARTAL.d_text : BARTAL.navyInk;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'hidden',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 18, border: `1px solid ${line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ChevronIcon color={text} flipped={isAr} size={18}/>
        </div>
      </div>

      <div style={{ flex: 1, padding: '12px 24px 24px', overflow: 'auto' }}>
        {/* Hero icon */}
        <div style={{
          width: 72, height: 72, borderRadius: 20, background: BARTAL.amberTint,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 22, border: `1px solid ${BARTAL.amber}`,
        }}>
          <div style={{ fontSize: 32 }}>🔑</div>
        </div>

        <div style={{ fontSize: 11, color: BARTAL.amber, letterSpacing: 2,
                      textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>
          {isAr ? 'استعادة الحساب' : 'Account recovery'}
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: text, lineHeight: 1.25, marginBottom: 10 }}>
          {isAr ? 'نسيت كلمة المرور؟' : 'Forgot your password?'}
        </div>
        <div style={{ fontSize: 13, color: muted, lineHeight: 1.6, marginBottom: 26 }}>
          {isAr
            ? 'أدخل رقم هاتفك، وسنرسل رمزاً عبر واتساب لإعادة تعيين كلمة المرور.'
            : 'Enter your phone number and we\u2019ll send a code via WhatsApp to reset your password.'}
        </div>

        {/* Phone input */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: muted, marginBottom: 6, fontWeight: 600 }}>
            {isAr ? 'رقم الهاتف' : 'Phone number'}
          </div>
          <div style={{
            display: 'flex', background: surface, border: `1.5px solid ${BARTAL.amber}`,
            borderRadius: 12, overflow: 'hidden', height: 52,
          }}>
            <div style={{
              padding: '0 14px', display: 'flex', alignItems: 'center', gap: 6,
              borderInlineEnd: `1px solid ${line}`,
              fontSize: 14, color: text, fontWeight: 600, fontFamily: 'ui-monospace, monospace',
            }}>
              🇸🇩 +249
            </div>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', padding: '0 14px',
              fontSize: 16, color: text, fontWeight: 500,
              fontFamily: 'ui-monospace, monospace', letterSpacing: 1,
            }}>
              91 234 5678
              <div style={{
                width: 2, height: 20, background: BARTAL.amber,
                marginInlineStart: 3, animation: 'blink 1s infinite',
              }}/>
            </div>
          </div>
        </div>

        {/* Recovery channel */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 12, color: muted, marginBottom: 8, fontWeight: 600 }}>
            {isAr ? 'اختر طريقة الاستلام' : 'Choose delivery method'}
          </div>
          {[
            { k: 'wa',  l_ar: 'واتساب', l_en: 'WhatsApp', hint: '+249 91 234 •••• · Preferred', hint_ar: '+249 91 234 •••• · مفضّل', icon: 'W', color: '#25D366', on: true },
            { k: 'sms', l_ar: 'رسالة SMS', l_en: 'SMS text',  hint: '+249 91 234 ••••', hint_ar: '+249 91 234 ••••', icon: '✉', color: BARTAL.navy, on: false },
          ].map(c => (
            <div key={c.k} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: 14, marginBottom: 8,
              background: surface, border: `1.5px solid ${c.on ? BARTAL.amber : line}`,
              borderRadius: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 18, background: c.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 15, fontWeight: 700,
              }}>{c.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: text }}>
                  {isAr ? c.l_ar : c.l_en}
                </div>
                <div style={{ fontSize: 11, color: muted, marginTop: 2, fontFamily: 'ui-monospace, monospace' }}>
                  {isAr ? c.hint_ar : c.hint}
                </div>
              </div>
              <div style={{
                width: 20, height: 20, borderRadius: 10,
                border: `2px solid ${c.on ? BARTAL.amber : line}`,
                background: c.on ? BARTAL.amber : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {c.on && <div style={{ width: 8, height: 8, borderRadius: 4, background: '#fff' }}/>}
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => onNav && onNav('otp')} style={{
          width: '100%', background: BARTAL.amber, color: '#fff', border: 'none',
          padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700,
          fontFamily: 'inherit', marginBottom: 14,
        }}>
          {isAr ? 'أرسل رمز التحقق' : 'Send reset code'}
        </button>

        <div style={{ textAlign: 'center', fontSize: 12, color: muted }}>
          {isAr ? 'تذكّرت كلمة المرور؟ ' : 'Remembered your password? '}
          <span onClick={() => onNav && onNav('login')} style={{ color: BARTAL.amber, fontWeight: 700 }}>
            {isAr ? 'عد لتسجيل الدخول' : 'Back to sign in'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// RESET PASSWORD (mobile) — after OTP, set new password
// ═══════════════════════════════════════════════════════════════
function ResetPasswordScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const text = dark ? BARTAL.d_text : BARTAL.navyInk;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;

  const Rule = ({ ok, ar, en }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: ok ? '#0F7A3F' : muted, marginBottom: 4 }}>
      <div style={{
        width: 14, height: 14, borderRadius: 7,
        background: ok ? '#0F7A3F' : 'transparent', border: `1.5px solid ${ok ? '#0F7A3F' : line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {ok && <CheckIcon color="#fff" size={8}/>}
      </div>
      {isAr ? ar : en}
    </div>
  );

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'hidden',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 18, border: `1px solid ${line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ChevronIcon color={text} flipped={isAr} size={18}/>
        </div>
      </div>

      <div style={{ flex: 1, padding: '12px 24px 24px', overflow: 'auto' }}>
        {/* Progress pills */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 26 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#0F7A3F' }}/>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#0F7A3F' }}/>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: BARTAL.amber }}/>
        </div>

        <div style={{ fontSize: 11, color: BARTAL.amber, letterSpacing: 2,
                      textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>
          {isAr ? 'الخطوة ٣ من ٣' : 'Step 3 of 3'}
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: text, lineHeight: 1.25, marginBottom: 10 }}>
          {isAr ? 'أنشئ كلمة مرور جديدة' : 'Create a new password'}
        </div>
        <div style={{ fontSize: 13, color: muted, lineHeight: 1.6, marginBottom: 22 }}>
          {isAr
            ? 'يجب أن تختلف عن كلمات المرور السابقة المستخدمة في حسابك.'
            : 'Must differ from any previous password used on this account.'}
        </div>

        {/* New password */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: muted, marginBottom: 6, fontWeight: 600 }}>
            {isAr ? 'كلمة المرور الجديدة' : 'New password'}
          </div>
          <div style={{
            display: 'flex', background: surface, border: `1.5px solid ${BARTAL.amber}`,
            borderRadius: 12, overflow: 'hidden', height: 52, alignItems: 'center',
            padding: '0 14px',
          }}>
            <div style={{ flex: 1, fontSize: 16, color: text, letterSpacing: 4 }}>
              ••••••••••
            </div>
            <div style={{ fontSize: 11, color: BARTAL.amber, fontWeight: 600 }}>
              {isAr ? 'إظهار' : 'Show'}
            </div>
          </div>
        </div>

        {/* Strength meter */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i < 3 ? '#0F7A3F' : (dark ? BARTAL.d_line : '#E5DFD4'),
            }}/>
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#0F7A3F', fontWeight: 600, marginBottom: 16 }}>
          {isAr ? 'قوة كلمة المرور: قوية' : 'Password strength: Strong'}
        </div>

        {/* Requirements */}
        <div style={{
          padding: 12, background: dark ? BARTAL.d_raised : BARTAL.sand,
          borderRadius: 10, marginBottom: 18, border: `1px solid ${line}`,
        }}>
          <Rule ok={true}  ar="٨ أحرف على الأقل"     en="At least 8 characters"/>
          <Rule ok={true}  ar="حرف كبير وحرف صغير"   en="Upper and lower case letter"/>
          <Rule ok={true}  ar="رقم واحد على الأقل"    en="At least one number"/>
          <Rule ok={false} ar="رمز خاص (!@#$)"       en="Special character (!@#$)"/>
        </div>

        {/* Confirm */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 12, color: muted, marginBottom: 6, fontWeight: 600 }}>
            {isAr ? 'تأكيد كلمة المرور' : 'Confirm password'}
          </div>
          <div style={{
            display: 'flex', background: surface, border: `1px solid ${line}`,
            borderRadius: 12, overflow: 'hidden', height: 52, alignItems: 'center',
            padding: '0 14px',
          }}>
            <div style={{ flex: 1, fontSize: 16, color: text, letterSpacing: 4 }}>
              ••••••••••
            </div>
            <CheckIcon color="#0F7A3F" size={18}/>
          </div>
        </div>

        <button onClick={() => onNav && onNav('home')} style={{
          width: '100%', background: BARTAL.amber, color: '#fff', border: 'none',
          padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700,
          fontFamily: 'inherit',
        }}>
          {isAr ? 'حفظ كلمة المرور والدخول' : 'Save password & sign in'}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WEB — FORGOT PASSWORD
// ═══════════════════════════════════════════════════════════════
function WebForgot({ lang, dark }) {
  const isAr = lang === 'ar';
  const text = dark ? BARTAL.d_text : BARTAL.text;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const surface = dark ? BARTAL.d_surface : '#fff';

  return (
    <WebAuthShell
      lang={lang} dark={dark}
      title={isAr ? 'نسيت كلمة المرور' : 'Forgot password'}
      subtitle={isAr
        ? 'أدخل رقم هاتفك، وسنرسل رمزاً لإعادة تعيين كلمة المرور.'
        : 'Enter your phone number and we\u2019ll send a reset code via WhatsApp or SMS.'}
      footer={
        <>
          {isAr ? 'تذكّرت كلمة المرور؟ ' : 'Remembered your password? '}
          <span style={{ color: BARTAL.amber, fontWeight: 700 }}>
            {isAr ? 'عد لتسجيل الدخول' : 'Back to sign in'}
          </span>
        </>
      }
    >
      <WebField
        lang={lang} dark={dark}
        label={isAr ? 'رقم الهاتف' : 'Phone number'}
        value="+249 91 234 5678"
        type="phone"
        icon={UserIcon}
      />

      {/* Channel picker */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 12, color: muted, marginBottom: 8, fontWeight: 600 }}>
          {isAr ? 'اختر طريقة الاستلام' : 'Delivery method'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { k: 'wa',  l_ar: 'واتساب', l_en: 'WhatsApp', icon: 'W', color: '#25D366', on: true },
            { k: 'sms', l_ar: 'رسالة SMS', l_en: 'SMS',   icon: '✉', color: BARTAL.navy, on: false },
          ].map(c => (
            <div key={c.k} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px',
              background: surface, border: `1.5px solid ${c.on ? BARTAL.amber : line}`,
              borderRadius: 10, cursor: 'pointer',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 14, background: c.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 13, fontWeight: 700,
              }}>{c.icon}</div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: text }}>
                {isAr ? c.l_ar : c.l_en}
              </div>
              <div style={{
                width: 18, height: 18, borderRadius: 9,
                border: `2px solid ${c.on ? BARTAL.amber : line}`,
                background: c.on ? BARTAL.amber : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {c.on && <div style={{ width: 7, height: 7, borderRadius: 4, background: '#fff' }}/>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <WebPrimaryBtn>{isAr ? 'أرسل رمز التحقق' : 'Send reset code'}</WebPrimaryBtn>

      {/* Support callout */}
      <div style={{
        marginTop: 18, padding: 14, borderRadius: 10,
        background: dark ? BARTAL.d_raised : BARTAL.sand,
        border: `1px solid ${line}`, display: 'flex', gap: 11, alignItems: 'flex-start',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 14, background: BARTAL.amberTint,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <div style={{ color: BARTAL.amber, fontSize: 14, fontWeight: 700 }}>?</div>
        </div>
        <div style={{ fontSize: 12, color: muted, lineHeight: 1.55 }}>
          {isAr
            ? <>لا تستلم الرمز؟ تواصل مع الدعم عبر واتساب <span style={{ color: BARTAL.amber, fontWeight: 700 }}>+249 91 000 0000</span> من ٩ صباحاً حتى ٩ مساءً.</>
            : <>Not receiving the code? Contact support on WhatsApp <span style={{ color: BARTAL.amber, fontWeight: 700 }}>+249 91 000 0000</span> · 9 AM – 9 PM daily.</>}
        </div>
      </div>
    </WebAuthShell>
  );
}

// ═══════════════════════════════════════════════════════════════
// WEB — RESET PASSWORD
// ═══════════════════════════════════════════════════════════════
function WebReset({ lang, dark }) {
  const isAr = lang === 'ar';
  const text = dark ? BARTAL.d_text : BARTAL.text;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const line = dark ? BARTAL.d_line : BARTAL.line;

  const Rule = ({ ok, ar, en }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: ok ? '#0F7A3F' : muted, marginBottom: 5 }}>
      <div style={{
        width: 14, height: 14, borderRadius: 7,
        background: ok ? '#0F7A3F' : 'transparent', border: `1.5px solid ${ok ? '#0F7A3F' : line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {ok && <CheckIcon color="#fff" size={8}/>}
      </div>
      {isAr ? ar : en}
    </div>
  );

  return (
    <WebAuthShell
      lang={lang} dark={dark}
      title={isAr ? 'كلمة مرور جديدة' : 'Set a new password'}
      subtitle={isAr
        ? 'تم التحقق من الرمز بنجاح. أنشئ كلمة مرور جديدة لحسابك.'
        : 'Code verified. Create a new password for your account.'}
      footer={null}
    >
      {/* Progress */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#0F7A3F' }}/>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#0F7A3F' }}/>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: BARTAL.amber }}/>
      </div>

      <WebField
        lang={lang} dark={dark}
        label={isAr ? 'كلمة المرور الجديدة' : 'New password'}
        value="••••••••••"
        type="password"
        rightSlot={
          <span style={{ fontSize: 11, color: BARTAL.amber, fontWeight: 600 }}>
            {isAr ? 'عرض' : 'Show'}
          </span>
        }
      />

      {/* Strength */}
      <div style={{ display: 'flex', gap: 4, marginTop: -8, marginBottom: 8 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i < 3 ? '#0F7A3F' : (dark ? BARTAL.d_line : '#E5DFD4'),
          }}/>
        ))}
      </div>
      <div style={{ fontSize: 11, color: '#0F7A3F', fontWeight: 600, marginBottom: 14 }}>
        {isAr ? 'قوة: قوية' : 'Strength: Strong'}
      </div>

      {/* Rules */}
      <div style={{
        padding: 12, background: dark ? BARTAL.d_raised : BARTAL.sand,
        borderRadius: 10, marginBottom: 16, border: `1px solid ${line}`,
      }}>
        <Rule ok={true}  ar="٨ أحرف على الأقل"     en="At least 8 characters"/>
        <Rule ok={true}  ar="حرف كبير وحرف صغير"   en="Upper and lower case letter"/>
        <Rule ok={true}  ar="رقم واحد على الأقل"    en="At least one number"/>
        <Rule ok={false} ar="رمز خاص (!@#$)"       en="Special character (!@#$)"/>
      </div>

      <WebField
        lang={lang} dark={dark}
        label={isAr ? 'تأكيد كلمة المرور' : 'Confirm password'}
        value="••••••••••"
        type="password"
        rightSlot={<CheckIcon color="#0F7A3F" size={16}/>}
      />

      <WebPrimaryBtn>{isAr ? 'حفظ كلمة المرور والدخول' : 'Save password & sign in'}</WebPrimaryBtn>
    </WebAuthShell>
  );
}

Object.assign(window, {
  SplashScreen, OnboardingScreen, OnboardingIllo,
  ForgotPasswordScreen, ResetPasswordScreen,
  WebForgot, WebReset,
});
