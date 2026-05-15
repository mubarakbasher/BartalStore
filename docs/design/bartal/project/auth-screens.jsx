// auth-screens.jsx — Login, Sign up, OTP screens
// Mobile, AR/EN, wrapped in the shared mobile frame styles.

// ═══════════════════════════════════════════════════════════════
// WELCOME / LAUNCH  — splash with brand + CTA
// ═══════════════════════════════════════════════════════════════
function WelcomeScreen({ lang, dark, onNav }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const text = dark ? BARTAL.d_text : BARTAL.navyInk;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'hidden',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
      display: 'flex', flexDirection: 'column', position: 'relative',
    }}>
      {/* Motif hero */}
      <div style={{
        height: '55%', background: BARTAL.navyInk,
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.25 }}>
          <defs>
            <pattern id="welc-motif" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <g stroke={BARTAL.amberSoft} strokeWidth="0.9" fill="none">
                <path d="M40 6 L48 22 L64 16 L58 32 L74 40 L58 48 L64 64 L48 58 L40 74 L32 58 L16 64 L22 48 L6 40 L22 32 L16 16 L32 22 Z"/>
                <path d="M40 22 L58 40 L40 58 L22 40 Z"/>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#welc-motif)"/>
        </svg>
        {/* Centered logo */}
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <LogoMark color="#fff" accent={BARTAL.amber} size={68}/>
          <div style={{
            fontFamily: isAr ? "'Cairo'" : "'Poppins'",
            fontSize: 42, fontWeight: 700, color: '#fff', marginTop: 14, letterSpacing: isAr ? 0 : -1,
          }}>
            {isAr ? 'برتال' : 'bartal'}
          </div>
          <div style={{
            fontSize: 12, color: BARTAL.amberSoft, letterSpacing: 2,
            marginTop: 4, textTransform: 'uppercase', fontWeight: 600,
          }}>
            {isAr ? 'كل ما تحتاجه · السودان' : 'Everything you need · Sudan'}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{
        flex: 1, padding: '28px 24px 36px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: text, lineHeight: 1.25, marginBottom: 8 }}>
            {isAr ? 'بوابتك للتسوق الذكي.' : 'Your portal for smart shopping.'}
          </div>
          <div style={{ fontSize: 13, color: muted, lineHeight: 1.6 }}>
            {isAr
              ? 'آلاف المنتجات، توصيل سريع عبر الخرطوم، دفع بأي بنك سوداني.'
              : 'Thousands of products, fast delivery across Khartoum, pay via any Sudanese bank.'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => onNav('signup')} style={{
            background: BARTAL.amber, color: '#fff', border: 'none',
            padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700,
            fontFamily: 'inherit',
          }}>
            {isAr ? 'إنشاء حساب جديد' : 'Create new account'}
          </button>
          <button onClick={() => onNav('login')} style={{
            background: 'transparent', color: text,
            border: `1.5px solid ${dark ? BARTAL.d_line : BARTAL.line}`,
            padding: '13px', borderRadius: 12, fontSize: 15, fontWeight: 600,
            fontFamily: 'inherit',
          }}>
            {isAr ? 'تسجيل الدخول' : 'Sign in'}
          </button>
          <div style={{ textAlign: 'center', marginTop: 6, fontSize: 11, color: muted }}>
            {isAr ? 'بالمتابعة، أنت توافق على ' : 'By continuing you agree to our '}
            <span style={{ color: BARTAL.amber, fontWeight: 600 }}>
              {isAr ? 'الشروط والخصوصية' : 'Terms & Privacy'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════════
function LoginScreen({ lang, dark, onNav, onBack }) {
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
      {/* Top bar */}
      <div style={{
        padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 18, border: `1px solid ${line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ChevronIcon color={text} flipped={isAr} size={18}/>
        </div>
      </div>

      <div style={{ flex: 1, padding: '12px 24px 24px', overflow: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: BARTAL.amber, letterSpacing: 2,
                        textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>
            {isAr ? 'مرحبا بعودتك' : 'Welcome back'}
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: text, lineHeight: 1.2 }}>
            {isAr ? 'سجل دخولك إلى برتال.' : 'Sign in to bartal.'}
          </div>
        </div>

        {/* Phone field */}
        <div style={{ marginBottom: 14 }}>
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
              fontSize: 14, color: text, fontWeight: 600,
              fontFamily: 'ui-monospace, monospace',
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

        {/* Password field */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: muted, marginBottom: 6, fontWeight: 600 }}>
            {isAr ? 'كلمة المرور' : 'Password'}
          </div>
          <div style={{
            display: 'flex', background: surface, border: `1px solid ${line}`,
            borderRadius: 12, overflow: 'hidden', height: 52, alignItems: 'center',
            padding: '0 14px',
          }}>
            <div style={{ flex: 1, fontSize: 16, color: text, letterSpacing: 4 }}>
              ••••••••
            </div>
            <div style={{ fontSize: 11, color: BARTAL.amber, fontWeight: 600 }}>
              {isAr ? 'إظهار' : 'Show'}
            </div>
          </div>
        </div>

        <div style={{ textAlign: isAr ? 'left' : 'right', marginBottom: 22 }}>
          <span style={{ fontSize: 12, color: BARTAL.amber, fontWeight: 600 }}>
            {isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
          </span>
        </div>

        <button onClick={() => onNav('otp')} style={{
          width: '100%', background: BARTAL.amber, color: '#fff', border: 'none',
          padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700,
          fontFamily: 'inherit', marginBottom: 20,
        }}>
          {isAr ? 'تسجيل الدخول' : 'Sign in'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: line }}/>
          <div style={{ fontSize: 11, color: muted }}>
            {isAr ? 'أو' : 'or'}
          </div>
          <div style={{ flex: 1, height: 1, background: line }}/>
        </div>

        {/* WhatsApp OTP option */}
        <button style={{
          width: '100%', background: surface, color: text, border: `1px solid ${line}`,
          padding: '13px', borderRadius: 12, fontSize: 14, fontWeight: 600,
          fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: 11, background: '#25D366',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 11, fontWeight: 700,
          }}>W</div>
          {isAr ? 'استلام رمز عبر واتساب' : 'Get code via WhatsApp'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: muted }}>
          {isAr ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
          <span onClick={() => onNav('signup')} style={{ color: BARTAL.amber, fontWeight: 700 }}>
            {isAr ? 'سجّل الآن' : 'Sign up'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SIGN UP
// ═══════════════════════════════════════════════════════════════
function SignupScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const text = dark ? BARTAL.d_text : BARTAL.navyInk;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;

  const field = (label, value, opts = {}) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, color: muted, marginBottom: 6, fontWeight: 600 }}>{label}</div>
      <div style={{
        background: surface, border: `1px solid ${opts.focused ? BARTAL.amber : line}`,
        borderWidth: opts.focused ? 1.5 : 1,
        borderRadius: 12, height: 48, display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 14px',
      }}>
        {opts.prefix && (
          <div style={{ fontSize: 13, color: text, fontWeight: 600, fontFamily: 'ui-monospace, monospace',
                        borderInlineEnd: `1px solid ${line}`, paddingInlineEnd: 10, marginInlineEnd: 2 }}>
            {opts.prefix}
          </div>
        )}
        <div style={{ flex: 1, fontSize: 15, color: value ? text : muted,
                      fontFamily: opts.mono ? 'ui-monospace, monospace' : 'inherit',
                      letterSpacing: opts.mono ? 0.5 : 0 }}>
          {value || opts.placeholder}
        </div>
        {opts.trailing}
      </div>
    </div>
  );

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'hidden',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 18, border: `1px solid ${line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ChevronIcon color={text} flipped={isAr} size={18}/>
        </div>
        <div style={{ flex: 1 }}>
          {/* Step indicator */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
            <div style={{ flex: 1, height: 3, background: BARTAL.amber, borderRadius: 2 }}/>
            <div style={{ flex: 1, height: 3, background: line, borderRadius: 2 }}/>
            <div style={{ flex: 1, height: 3, background: line, borderRadius: 2 }}/>
          </div>
          <div style={{ fontSize: 11, color: muted }}>
            {isAr ? 'الخطوة ١ من ٣' : 'Step 1 of 3'}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '10px 24px 24px', overflow: 'auto' }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: text, lineHeight: 1.2, marginBottom: 6 }}>
            {isAr ? 'أنشئ حسابك.' : 'Create your account.'}
          </div>
          <div style={{ fontSize: 13, color: muted, lineHeight: 1.5 }}>
            {isAr ? 'سنرسل رمز تحقق إلى رقم هاتفك' : "We'll send a verification code to your phone"}
          </div>
        </div>

        {field(
          isAr ? 'الاسم الكامل' : 'Full name',
          isAr ? 'محمد عثمان علي' : 'Mohammed Osman Ali',
        )}
        {field(
          isAr ? 'رقم الهاتف' : 'Phone number',
          '91 234 5678',
          { prefix: '🇸🇩 +249', mono: true, focused: true }
        )}
        {field(
          isAr ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)',
          'm.osman@gmail.com',
        )}
        {field(
          isAr ? 'كلمة المرور' : 'Password',
          '••••••••',
          { trailing: (
            <div style={{ fontSize: 11, color: BARTAL.amber, fontWeight: 600 }}>
              {isAr ? 'إظهار' : 'Show'}
            </div>
          )}
        )}

        {/* Password strength */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
            <div style={{ flex: 1, height: 3, background: BARTAL.success, borderRadius: 2 }}/>
            <div style={{ flex: 1, height: 3, background: BARTAL.success, borderRadius: 2 }}/>
            <div style={{ flex: 1, height: 3, background: BARTAL.amber, borderRadius: 2 }}/>
            <div style={{ flex: 1, height: 3, background: line, borderRadius: 2 }}/>
          </div>
          <div style={{ fontSize: 11, color: muted }}>
            {isAr ? 'قوة جيدة · أضف رمزاً خاصاً للأفضل' : 'Good · add a symbol for best'}
          </div>
        </div>

        {/* Terms checkbox */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{
            width: 20, height: 20, borderRadius: 5, background: BARTAL.amber, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
          }}>
            <CheckIcon color="#fff" size={12}/>
          </div>
          <div style={{ fontSize: 12, color: text, lineHeight: 1.6 }}>
            {isAr
              ? 'أوافق على الشروط والأحكام وسياسة الخصوصية الخاصة ببرتال.'
              : 'I agree to bartal Terms of Service and Privacy Policy.'}
          </div>
        </div>

        <button onClick={() => onNav('otp')} style={{
          width: '100%', background: BARTAL.amber, color: '#fff', border: 'none',
          padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700,
          fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {isAr ? 'إرسال رمز التحقق' : 'Send verification code'}
          <ArrowIcon color="#fff" flipped={isAr} size={14}/>
        </button>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: muted }}>
          {isAr ? 'لديك حساب؟ ' : 'Have an account? '}
          <span onClick={() => onNav('login')} style={{ color: BARTAL.amber, fontWeight: 700 }}>
            {isAr ? 'سجّل الدخول' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// OTP VERIFICATION
// ═══════════════════════════════════════════════════════════════
function OtpScreen({ lang, dark, onNav, onBack }) {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const bg = dark ? BARTAL.d_bg : BARTAL.paper;
  const surface = dark ? BARTAL.d_surface : '#fff';
  const line = dark ? BARTAL.d_line : BARTAL.line;
  const text = dark ? BARTAL.d_text : BARTAL.navyInk;
  const muted = dark ? BARTAL.d_textMute : BARTAL.textMute;

  // Show 4 filled, 2 empty with cursor on 5th
  const digits = ['4', '8', '2', '6', '', ''];

  return (
    <div dir={dir} style={{
      width: '100%', height: '100%', background: bg, overflow: 'hidden',
      fontFamily: isAr ? "'Cairo'" : "'Poppins'",
      display: 'flex', flexDirection: 'column', position: 'relative',
    }}>
      {/* Top bar */}
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 18, border: `1px solid ${line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ChevronIcon color={text} flipped={isAr} size={18}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
            <div style={{ flex: 1, height: 3, background: BARTAL.success, borderRadius: 2 }}/>
            <div style={{ flex: 1, height: 3, background: BARTAL.amber, borderRadius: 2 }}/>
            <div style={{ flex: 1, height: 3, background: line, borderRadius: 2 }}/>
          </div>
          <div style={{ fontSize: 11, color: muted }}>
            {isAr ? 'الخطوة ٢ من ٣' : 'Step 2 of 3'}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '16px 24px', display: 'flex', flexDirection: 'column' }}>
        {/* Icon */}
        <div style={{
          width: 72, height: 72, borderRadius: 36, background: BARTAL.amberTint,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '8px 0 20px', position: 'relative',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <rect x="6" y="3" width="12" height="18" rx="2" stroke={BARTAL.amber} strokeWidth="1.8"/>
            <circle cx="12" cy="17.5" r="1.2" fill={BARTAL.amber}/>
            <path d="M10 7h4" stroke={BARTAL.amber} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <div style={{
            position: 'absolute', top: -4, insetInlineEnd: -4,
            width: 22, height: 22, borderRadius: 11, background: BARTAL.amber,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `3px solid ${bg}`,
          }}>
            <CheckIcon color="#fff" size={11}/>
          </div>
        </div>

        <div style={{ fontSize: 24, fontWeight: 700, color: text, lineHeight: 1.2, marginBottom: 8 }}>
          {isAr ? 'أدخل رمز التحقق.' : 'Enter verification code.'}
        </div>
        <div style={{ fontSize: 13, color: muted, lineHeight: 1.5, marginBottom: 24 }}>
          {isAr ? 'أرسلنا رمزاً من ٦ أرقام إلى ' : "We sent a 6-digit code to "}
          <span style={{ color: text, fontWeight: 600, fontFamily: 'ui-monospace, monospace' }}>
            +249 91 234 5678
          </span>
        </div>

        {/* OTP boxes */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, direction: 'ltr' }}>
          {digits.map((d, i) => {
            const filled = d !== '';
            const active = i === 4;
            return (
              <div key={i} style={{
                flex: 1, aspectRatio: '1 / 1.15', borderRadius: 10,
                background: surface,
                border: `1.5px solid ${active ? BARTAL.amber : (filled ? (dark ? BARTAL.d_line : BARTAL.navy) : line)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 700, color: text,
                fontFamily: 'ui-monospace, monospace',
                boxShadow: active ? `0 0 0 3px ${BARTAL.amberTint}` : 'none',
                position: 'relative',
              }}>
                {d}
                {active && (
                  <div style={{
                    width: 2, height: 24, background: BARTAL.amber,
                    animation: 'blink 1s infinite',
                  }}/>
                )}
              </div>
            );
          })}
        </div>

        {/* Resend timer */}
        <div style={{
          background: surface, border: `1px solid ${line}`, borderRadius: 10,
          padding: '12px 14px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 14, background: BARTAL.amberTint,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: BARTAL.amber,
            fontFamily: 'ui-monospace, monospace',
          }}>
            42
          </div>
          <div style={{ flex: 1, fontSize: 12, color: muted }}>
            {isAr
              ? 'يمكنك طلب رمز جديد خلال ٠٠:٤٢'
              : 'You can request a new code in 00:42'}
          </div>
        </div>

        {/* Try different method */}
        <div style={{
          background: surface, border: `1px solid ${line}`, borderRadius: 10,
          padding: '12px 14px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 14, background: '#25D36620',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#25D366', fontSize: 12, fontWeight: 700,
          }}>W</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: text, fontWeight: 600 }}>
              {isAr ? 'لم يصلك؟' : 'Not received?'}
            </div>
            <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>
              {isAr ? 'جرّب عبر واتساب' : 'Try via WhatsApp'}
            </div>
          </div>
          <ArrowIcon color={BARTAL.amber} flipped={isAr} size={14}/>
        </div>

        <div style={{ flex: 1 }}/>

        <button onClick={() => onNav('home')} style={{
          width: '100%', background: BARTAL.amber, color: '#fff', border: 'none',
          padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700,
          fontFamily: 'inherit',
        }}>
          {isAr ? 'تحقق ومتابعة' : 'Verify & continue'}
        </button>

        {/* Simulated keypad hint */}
        <div style={{
          marginTop: 12, padding: '10px 12px',
          background: dark ? BARTAL.d_raised : BARTAL.sand,
          borderRadius: 10, fontSize: 10, color: muted,
          display: 'flex', alignItems: 'center', gap: 8, direction: 'ltr',
        }}>
          <div style={{ fontSize: 13 }}>🔒</div>
          <span>
            {isAr
              ? 'رمز آمن · سينتهي خلال ٥ دقائق'
              : 'Secure code · expires in 5 minutes'}
          </span>
        </div>
      </div>

      <style>{`@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Chevron icon (back arrow)
// ═══════════════════════════════════════════════════════════════
function ChevronIcon({ color = '#000', flipped, size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}>
    <path d="M15 6l-6 6 6 6" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}

Object.assign(window, { WelcomeScreen, LoginScreen, SignupScreen, OtpScreen });
