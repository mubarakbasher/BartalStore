// web-auth.jsx — Web versions of Welcome / Login / Signup / OTP
// Split-screen layout: motif-rich brand panel + form panel. AR/EN, light/dark.

function WebAuthShell({ lang, dark, title, subtitle, children, footer }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const text = dark ? BARTAL.d_text : BARTAL.text;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'auto',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
      display: 'grid', gridTemplateColumns: '1fr 1.05fr',
    }}>
      {/* ─── Brand panel ─── */}
      <div style={{
        background: BARTAL.navyInk, color: '#fff',
        position: 'relative', overflow: 'hidden',
        padding: '40px 44px', display: 'flex', flexDirection: 'column',
      }}>
        {/* Motif */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
          <defs>
            <pattern id="web-auth-motif" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
              <g stroke={BARTAL.amberSoft} strokeWidth="0.9" fill="none">
                <path d="M45 6 L54 25 L73 18 L66 37 L84 45 L66 53 L73 72 L54 65 L45 84 L36 65 L17 72 L24 53 L6 45 L24 37 L17 18 L36 25 Z"/>
                <path d="M45 25 L66 45 L45 65 L24 45 Z"/>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#web-auth-motif)"/>
        </svg>

        {/* Top: logo */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoMark color="#fff" accent={BARTAL.amber} size={34}/>
          <div style={{
            fontFamily: isAr ? "'Cairo'" : "'Poppins'",
            fontSize: 22, fontWeight: 700, letterSpacing: isAr ? 0 : -0.5,
          }}>
            {isAr ? 'برتال' : 'bartal'}
          </div>
        </div>

        {/* Middle: hero */}
        <div style={{ position: 'relative', marginTop: 'auto', marginBottom: 'auto', maxWidth: 380 }}>
          <div style={{
            fontSize: 12, color: BARTAL.amberSoft, letterSpacing: 2.5,
            textTransform: 'uppercase', fontWeight: 700, marginBottom: 14,
          }}>
            {isAr ? 'التسوق السوداني · مبسّط' : 'Sudanese commerce · simplified'}
          </div>
          <div style={{
            fontSize: 36, fontWeight: 700, lineHeight: 1.15,
            letterSpacing: isAr ? 0 : -0.5, marginBottom: 18,
          }}>
            {isAr
              ? 'كل ما تحتاجه، يصل غداً إلى الخرطوم.'
              : 'Everything you need, delivered to Khartoum by tomorrow.'}
          </div>
          <div style={{ fontSize: 14, color: BARTAL.amberSoft, lineHeight: 1.6, opacity: 0.9 }}>
            {isAr
              ? 'ادفع بالتحويل البنكي. تتبّع طلبك عبر واتساب. إرجاع مجاني خلال ٧ أيام.'
              : 'Pay by bank transfer. Track your order via WhatsApp. Free 7-day returns.'}
          </div>

          {/* Trust row */}
          <div style={{ display: 'flex', gap: 24, marginTop: 28 }}>
            {[
              [TruckIcon, isAr ? 'توصيل ٢٤س' : '24h delivery'],
              [PackageIcon, isAr ? '١٢ ألف منتج' : '12k products'],
              [CameraIcon, isAr ? 'دفع آمن' : 'Secure pay'],
            ].map(([Ic, lbl], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#fff' }}>
                <Ic color={BARTAL.amber} size={16}/>
                {lbl}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: footer quote */}
        <div style={{ position: 'relative', fontSize: 11, color: BARTAL.amberSoft, opacity: 0.75, maxWidth: 340 }}>
          {isAr
            ? '"أفضل تجربة تسوق في السودان — سريعة، موثوقة، وبأسعار عادلة."'
            : '"Best shopping experience in Sudan — fast, reliable, fair prices."'}
          <div style={{ marginTop: 4, fontWeight: 600 }}>
            {isAr ? '— عائشة، الخرطوم ٢' : '— Aisha, Khartoum 2'}
          </div>
        </div>
      </div>

      {/* ─── Form panel ─── */}
      <div style={{
        padding: '40px 60px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative',
      }}>
        {/* Top bar: back to home + lang switch */}
        <div style={{
          position: 'absolute', top: 24, insetInlineStart: 60, insetInlineEnd: 60,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 12, color: muted,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>{isAr ? '←' : '←'}</span>
            <span>{isAr ? 'العودة للمتجر' : 'Back to store'}</span>
          </div>
          <div style={{
            padding: '4px 10px', borderRadius: 6, border: `1px solid ${line}`,
            fontSize: 11, fontWeight: 600, color: text,
          }}>
            {isAr ? 'EN' : 'العربية'}
          </div>
        </div>

        <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: text, lineHeight: 1.2 }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 13, color: muted, marginTop: 6, lineHeight: 1.6 }}>
              {subtitle}
            </div>
          )}
          <div style={{ marginTop: 24 }}>
            {children}
          </div>
          {footer && (
            <div style={{ marginTop: 20, fontSize: 12, color: muted, textAlign: 'center' }}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Reusable form atoms
// ═══════════════════════════════════════════════════════════════
function WebField({ label, value, placeholder, type = 'text', dark, hint, icon: Ic, rightSlot, error }) {
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const text = dark ? BARTAL.d_text : BARTAL.text;
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <div style={{ fontSize: 12, fontWeight: 600, color: text, marginBottom: 6, letterSpacing: 0.2 }}>
          {label}
        </div>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: surface, border: `1px solid ${error ? BARTAL.danger : line}`,
        borderRadius: 10, padding: '0 12px', height: 44,
      }}>
        {Ic && <Ic color={muted} size={16}/>}
        <div style={{
          flex: 1, fontSize: 13,
          color: value ? text : muted,
          fontFamily: type === 'phone' || type === 'code' ? "'JetBrains Mono', monospace" : 'inherit',
          letterSpacing: type === 'code' ? 3 : 0,
        }}>
          {value || placeholder}
        </div>
        {rightSlot}
      </div>
      {hint && !error && (
        <div style={{ fontSize: 11, color: muted, marginTop: 5 }}>{hint}</div>
      )}
      {error && (
        <div style={{ fontSize: 11, color: BARTAL.danger, marginTop: 5, fontWeight: 600 }}>{error}</div>
      )}
    </div>
  );
}

function WebPrimaryBtn({ children, color = BARTAL.amber }) {
  return (
    <button style={{
      width: '100%', background: color, color: '#fff', border: 'none',
      padding: '13px', borderRadius: 10, fontSize: 14, fontWeight: 700,
      fontFamily: 'inherit', cursor: 'pointer',
    }}>{children}</button>
  );
}

function WebDivider({ label, dark }) {
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
      <div style={{ flex: 1, height: 1, background: line }}/>
      <div style={{ fontSize: 11, color: muted, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: line }}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 1. WEB LOGIN
// ═══════════════════════════════════════════════════════════════
function WebLogin({ lang, dark }) {
  const isAr = lang === 'ar';
  const text = dark ? BARTAL.d_text : BARTAL.text;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;

  return (
    <WebAuthShell
      lang={lang} dark={dark}
      title={isAr ? 'تسجيل الدخول' : 'Sign in'}
      subtitle={isAr ? 'أدخل رقم هاتفك وكلمة المرور للمتابعة.' : 'Enter your phone and password to continue.'}
      footer={
        <>
          {isAr ? 'جديد في برتال؟ ' : 'New to Bartal? '}
          <span style={{ color: BARTAL.amber, fontWeight: 700 }}>
            {isAr ? 'أنشئ حساباً' : 'Create an account'}
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
      <WebField
        lang={lang} dark={dark}
        label={isAr ? 'كلمة المرور' : 'Password'}
        value="••••••••••"
        type="password"
        rightSlot={
          <span style={{ fontSize: 11, color: BARTAL.amber, fontWeight: 600 }}>
            {isAr ? 'عرض' : 'Show'}
          </span>
        }
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: text }}>
          <div style={{
            width: 16, height: 16, borderRadius: 4,
            background: BARTAL.amber, border: `1.5px solid ${BARTAL.amber}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CheckIcon color="#fff" size={10}/>
          </div>
          {isAr ? 'تذكرني لمدة ٣٠ يوماً' : 'Remember me for 30 days'}
        </div>
        <span style={{ fontSize: 12, color: BARTAL.amber, fontWeight: 600 }}>
          {isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
        </span>
      </div>

      <WebPrimaryBtn>{isAr ? 'تسجيل الدخول' : 'Sign in'}</WebPrimaryBtn>

      <WebDivider label={isAr ? 'أو' : 'or'} dark={dark}/>

      <button style={{
        width: '100%', background: 'transparent', color: text,
        border: `1px solid ${dark ? BARTAL.d_line : BARTAL.line}`,
        padding: '12px', borderRadius: 10, fontSize: 13, fontWeight: 600,
        fontFamily: 'inherit', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 11, background: '#25D366',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#fff',
        }}>W</div>
        {isAr ? 'تسجيل الدخول عبر واتساب (OTP)' : 'Continue with WhatsApp (OTP)'}
      </button>
    </WebAuthShell>
  );
}

// ═══════════════════════════════════════════════════════════════
// 2. WEB SIGN UP
// ═══════════════════════════════════════════════════════════════
function WebSignup({ lang, dark }) {
  const isAr = lang === 'ar';
  const text = dark ? BARTAL.d_text : BARTAL.text;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const line = dark ? BARTAL.d_line : BARTAL.line;

  return (
    <WebAuthShell
      lang={lang} dark={dark}
      title={isAr ? 'أنشئ حسابك' : 'Create your account'}
      subtitle={isAr ? 'انضم إلى ١٢٠٬٠٠٠+ عميل في السودان.' : 'Join 120,000+ customers across Sudan.'}
      footer={
        <>
          {isAr ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
          <span style={{ color: BARTAL.amber, fontWeight: 700 }}>
            {isAr ? 'سجّل دخولك' : 'Sign in'}
          </span>
        </>
      }
    >
      {/* Name row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <WebField
          lang={lang} dark={dark}
          label={isAr ? 'الاسم الأول' : 'First name'}
          value={isAr ? 'محمد' : 'Mohammed'}
        />
        <WebField
          lang={lang} dark={dark}
          label={isAr ? 'اسم العائلة' : 'Last name'}
          value={isAr ? 'عثمان' : 'Osman'}
        />
      </div>

      <WebField
        lang={lang} dark={dark}
        label={isAr ? 'رقم الهاتف' : 'Phone number'}
        value="+249 91 234 5678"
        type="phone"
        icon={UserIcon}
        hint={isAr ? 'سنرسل رمز تأكيد عبر واتساب' : "We'll send a verification code via WhatsApp"}
      />

      <WebField
        lang={lang} dark={dark}
        label={isAr ? 'البريد الإلكتروني' : 'Email'}
        value="mohammed.osman@gmail.com"
        type="email"
        icon={SearchIcon}
        hint={isAr ? 'اختياري · لإشعارات الطلب والإيصالات' : 'Optional · for order updates and receipts'}
      />

      <WebField
        lang={lang} dark={dark}
        label={isAr ? 'كلمة المرور' : 'Password'}
        value="••••••••••••"
        type="password"
      />

      {/* Strength meter */}
      <div style={{ marginTop: -6, marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
          {[BARTAL.success, BARTAL.success, BARTAL.success, line].map((c, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: c }}/>
          ))}
        </div>
        <div style={{ fontSize: 11, color: muted, display: 'flex', justifyContent: 'space-between' }}>
          <span>{isAr ? 'قوة كلمة المرور' : 'Password strength'}</span>
          <span style={{ color: BARTAL.success, fontWeight: 700 }}>
            {isAr ? 'قوية' : 'Strong'}
          </span>
        </div>
      </div>

      {/* City */}
      <WebField
        lang={lang} dark={dark}
        label={isAr ? 'المدينة' : 'City'}
        value={isAr ? 'الخرطوم' : 'Khartoum'}
        rightSlot={<span style={{ fontSize: 10, color: muted }}>▾</span>}
      />

      {/* Terms */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: muted, marginBottom: 18, lineHeight: 1.5 }}>
        <div style={{
          width: 16, height: 16, borderRadius: 4,
          background: BARTAL.amber, border: `1.5px solid ${BARTAL.amber}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
        }}>
          <CheckIcon color="#fff" size={10}/>
        </div>
        <div>
          {isAr ? 'أوافق على ' : 'I agree to the '}
          <span style={{ color: BARTAL.amber, fontWeight: 600 }}>{isAr ? 'شروط الاستخدام' : 'Terms of Service'}</span>
          {isAr ? ' و' : ' and '}
          <span style={{ color: BARTAL.amber, fontWeight: 600 }}>{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
        </div>
      </div>

      <WebPrimaryBtn>{isAr ? 'إنشاء الحساب' : 'Create account'}</WebPrimaryBtn>
    </WebAuthShell>
  );
}

// ═══════════════════════════════════════════════════════════════
// 3. WEB OTP
// ═══════════════════════════════════════════════════════════════
function WebOtp({ lang, dark }) {
  const isAr = lang === 'ar';
  const text = dark ? BARTAL.d_text : BARTAL.text;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const surface = dark ? BARTAL.d_surface : '#fff';

  const digits = ['4', '7', '2', '9', '', ''];

  return (
    <WebAuthShell
      lang={lang} dark={dark}
      title={isAr ? 'أدخل رمز التحقق' : 'Enter verification code'}
      subtitle={
        <>
          {isAr
            ? 'أرسلنا رمزاً مكوّناً من ٦ أرقام عبر واتساب إلى '
            : "We sent a 6-digit code via WhatsApp to "}
          <span style={{ color: text, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
            +249 91 234 •• 78
          </span>
        </>
      }
      footer={
        <>
          {isAr ? 'لم تستلم الرمز؟ ' : "Didn't get the code? "}
          <span style={{ color: BARTAL.amber, fontWeight: 700 }}>
            {isAr ? 'إرسال عبر SMS بدلاً من ذلك' : 'Send via SMS instead'}
          </span>
        </>
      }
    >
      {/* Digit boxes */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', marginBottom: 18 }}>
        {digits.map((d, i) => (
          <div key={i} style={{
            width: 54, height: 60, borderRadius: 10,
            background: surface, border: `1.5px solid ${i === 4 ? BARTAL.amber : line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, color: text,
            fontFamily: "'JetBrains Mono', monospace",
            boxShadow: i === 4 ? `0 0 0 3px ${BARTAL.amberTint}` : 'none',
            position: 'relative',
          }}>
            {d}
            {i === 4 && (
              <div style={{
                position: 'absolute', width: 2, height: 24, background: BARTAL.amber,
                animation: 'none',
              }}/>
            )}
          </div>
        ))}
      </div>

      {/* Timer / resend */}
      <div style={{
        background: dark ? BARTAL.d_surface : BARTAL.sand, border: `1px solid ${line}`,
        borderRadius: 10, padding: '12px 14px', marginBottom: 18,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ fontSize: 18 }}>⏱</div>
        <div style={{ flex: 1, fontSize: 12, color: text }}>
          {isAr ? 'انتهاء صلاحية الرمز خلال ' : 'Code expires in '}
          <span style={{ fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: BARTAL.amber }}>01:47</span>
        </div>
        <span style={{ fontSize: 12, color: muted, fontWeight: 500 }}>
          {isAr ? 'إعادة إرسال (٣٢ث)' : 'Resend (32s)'}
        </span>
      </div>

      <WebPrimaryBtn>{isAr ? 'تحقق ومتابعة' : 'Verify & continue'}</WebPrimaryBtn>

      <WebDivider label={isAr ? 'أو' : 'or'} dark={dark}/>

      {/* WhatsApp confirm */}
      <div style={{
        background: '#25D36612', border: '1px solid #25D36650',
        borderRadius: 10, padding: 14,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 17, background: '#25D366',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 700, color: '#fff', flexShrink: 0,
        }}>W</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: text }}>
            {isAr ? 'أو اضغط "تأكيد" في واتساب' : 'Or tap "Confirm" in WhatsApp'}
          </div>
          <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>
            {isAr ? 'سنؤكد دخولك تلقائياً' : "We'll sign you in automatically"}
          </div>
        </div>
      </div>
    </WebAuthShell>
  );
}

Object.assign(window, {
  WebAuthShell, WebLogin, WebSignup, WebOtp,
});
