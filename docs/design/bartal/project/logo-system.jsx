// logo-system.jsx — Bartal logo system
// Spec: navy #1B3A6B primary, amber #D4860B (dot only),
// Cairo Bold for برتال, Poppins SemiBold for Bartal,
// icon must work on navy background (white strokes).

const BTL = {
  navy:    '#1B3A6B',
  navyDeep:'#122647',
  navyInk: '#0B1930',
  gold:    '#D4860B',
  goldSoft:'#E9A53A',
  paper:   '#FBFAF7',
  sand:    '#F4EFE3',
  cream:   '#EDE5D2',
  ink:     '#1A1A1A',
  mute:    '#6B6356',
  line:    '#E6DECC',
};

// ── THE MARK ─────────────────────────────────────────────
// 8-point star (portal/doorway — برتال = portal/gateway)
// inscribed within a notched circular keyline. Two-tone:
//  - On light bg: navy strokes/fills, gold dot.
//  - On navy bg: white strokes/fills, gold dot.
//
// `fg` is the structural color (navy on light, white on navy).
// `accent` is the dot only (always gold).
function BartalMark({ size = 96, fg = BTL.navy, accent = BTL.gold, mode = 'solid' }) {
  // mode: 'solid' (filled star), 'line' (outlined), 'crest' (star inside notched ring)
  const s = size;
  const sw = Math.max(1.2, s * 0.022);
  if (mode === 'line') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" style={{ display: 'block' }}>
        <g fill="none" stroke={fg} strokeWidth={sw} strokeLinejoin="miter">
          <path d="M50 6 L62 38 L94 50 L62 62 L50 94 L38 62 L6 50 L38 38 Z"/>
          <path d="M50 22 L60 40 L78 50 L60 60 L50 78 L40 60 L22 50 L40 40 Z"/>
        </g>
        <circle cx="50" cy="50" r={s * 0.06} fill={accent}/>
      </svg>
    );
  }
  if (mode === 'crest') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" style={{ display: 'block' }}>
        {/* notched outer ring */}
        <g fill="none" stroke={fg} strokeWidth={sw}>
          <circle cx="50" cy="50" r="46"/>
          <circle cx="50" cy="50" r="42"/>
        </g>
        {/* 8 notch ticks */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          const x1 = 50 + Math.cos(a) * 42;
          const y1 = 50 + Math.sin(a) * 42;
          const x2 = 50 + Math.cos(a) * 46;
          const y2 = 50 + Math.sin(a) * 46;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={fg} strokeWidth={sw}/>;
        })}
        <path d="M50 14 L60 40 L86 50 L60 60 L50 86 L40 60 L14 50 L40 40 Z" fill={fg}/>
        <circle cx="50" cy="50" r={s * 0.07} fill={accent}/>
      </svg>
    );
  }
  // solid (default): filled 8-point star + smaller inner square + gold dot
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <path d="M50 4 L62 38 L96 50 L62 62 L50 96 L38 62 L4 50 L38 38 Z" fill={fg}/>
      <path d="M50 28 L58 42 L72 50 L58 58 L50 72 L42 58 L28 50 L42 42 Z" fill={accent} opacity="0.0"/>
      <circle cx="50" cy="50" r={s * 0.075} fill={accent}/>
    </svg>
  );
}

// Bilingual lockup. AR sits LEADING (right of mark on RTL stack).
// Per spec: the gold dot lives in the wordmark — placed as the
// punctuation accent above ت / over the "i-position" between letters.
function BartalLockup({
  size = 64,         // mark size; type scales relative
  fg = BTL.navy,
  accent = BTL.gold,
  layout = 'horizontal',  // 'horizontal' | 'stacked' | 'arabic-only' | 'latin-only'
  mode = 'solid',
  showBoth = true,
}) {
  const arSize = size * 0.78;
  const enSize = size * 0.62;

  const Latin = (
    <div style={{
      fontFamily: "'Poppins', system-ui",
      fontWeight: 600,
      fontSize: enSize,
      letterSpacing: -0.5,
      color: fg,
      lineHeight: 1,
      display: 'inline-flex',
      alignItems: 'baseline',
    }}>
      Barta<span style={{ position: 'relative', display: 'inline-block' }}>
        l
        <span style={{
          position: 'absolute',
          top: -enSize * 0.08,
          right: -enSize * 0.12,
          width: enSize * 0.18,
          height: enSize * 0.18,
          borderRadius: '50%',
          background: accent,
        }}/>
      </span>
    </div>
  );

  const Arabic = (
    <div style={{
      fontFamily: "'Cairo', system-ui",
      fontWeight: 700,
      fontSize: arSize,
      color: fg,
      lineHeight: 1,
      direction: 'rtl',
      position: 'relative',
      display: 'inline-block',
    }}>
      برتال
      {/* gold dot — placed over the ت teeth as the diacritic accent */}
      <span style={{
        position: 'absolute',
        top: -arSize * 0.05,
        right: arSize * 0.55,
        width: arSize * 0.14,
        height: arSize * 0.14,
        borderRadius: '50%',
        background: accent,
      }}/>
    </div>
  );

  if (layout === 'arabic-only') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.32 }}>
        <BartalMark size={size} fg={fg} accent={accent} mode={mode}/>
        {Arabic}
      </div>
    );
  }
  if (layout === 'latin-only') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.28 }}>
        <BartalMark size={size} fg={fg} accent={accent} mode={mode}/>
        {Latin}
      </div>
    );
  }
  if (layout === 'stacked') {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.18 }}>
        <BartalMark size={size} fg={fg} accent={accent} mode={mode}/>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.06 }}>
          {Arabic}
          <div style={{
            width: size * 1.4, height: 1, background: fg, opacity: 0.25,
          }}/>
          {Latin}
        </div>
      </div>
    );
  }
  // horizontal: mark · arabic · divider · latin
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.32 }}>
      <BartalMark size={size} fg={fg} accent={accent} mode={mode}/>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.28 }}>
        {Arabic}
        {showBoth && (
          <>
            <div style={{
              width: 1, height: arSize * 0.7, background: fg, opacity: 0.28,
            }}/>
            {Latin}
          </>
        )}
      </div>
    </div>
  );
}

// ── BACKGROUND MOTIF (used in some deliverables) ──────────
function StarPattern({ color = BTL.navy, opacity = 0.06, size = 64 }) {
  const id = `bp-${color.replace('#','')}-${Math.floor(opacity*100)}-${size}`;
  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <defs>
        <pattern id={id} x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
          <g stroke={color} strokeWidth="1" fill="none" opacity={opacity}>
            <path d={`M${size/2} ${size*0.08} L${size*0.6} ${size*0.4} L${size*0.92} ${size/2} L${size*0.6} ${size*0.6} L${size/2} ${size*0.92} L${size*0.4} ${size*0.6} L${size*0.08} ${size/2} L${size*0.4} ${size*0.4} Z`}/>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`}/>
    </svg>
  );
}

// ── DELIVERABLE FRAMES ────────────────────────────────────
// Each is a labelled card: header with index + title + caption,
// then the artwork on its proper background.

function Frame({ index, title, caption, bg = BTL.paper, dark = false, children, height = 460, wide = false }) {
  return (
    <div style={{
      gridColumn: wide ? 'span 2' : 'auto',
      background: '#fff',
      borderRadius: 18,
      border: `1px solid ${BTL.line}`,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 1px 0 rgba(11,25,48,0.04), 0 12px 30px rgba(11,25,48,0.06)',
    }}>
      {/* Header strip */}
      <div style={{
        padding: '14px 18px',
        borderBottom: `1px solid ${BTL.line}`,
        display: 'flex', alignItems: 'baseline', gap: 12,
        background: '#fff',
      }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, fontWeight: 700, color: BTL.gold,
          letterSpacing: 1.2,
        }}>
          {String(index).padStart(2, '0')} / 06
        </div>
        <div style={{
          fontFamily: "'Poppins'", fontSize: 13, fontWeight: 600, color: BTL.navyInk,
        }}>
          {title}
        </div>
        <div style={{ flex: 1 }}/>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, color: BTL.mute, letterSpacing: 0.4,
        }}>
          {caption}
        </div>
      </div>
      {/* Artwork */}
      <div style={{
        position: 'relative',
        background: bg,
        height,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}

// 01 — Primary lockup on cream/sand (light bg)
function PrimaryLockup() {
  return (
    <Frame index={1} title="Primary lockup" caption="navy on cream · horizontal" bg={BTL.sand}>
      <StarPattern color={BTL.navy} opacity={0.05} size={72}/>
      <div style={{ position: 'relative' }}>
        <BartalLockup size={84} layout="horizontal" fg={BTL.navy} accent={BTL.gold}/>
        <div style={{
          marginTop: 22, textAlign: 'center',
          fontFamily: "'Poppins'", fontSize: 11, fontWeight: 500,
          color: BTL.mute, letterSpacing: 1.5, textTransform: 'uppercase',
        }}>
          بوابتك للتسوق · Your gateway to shopping
        </div>
      </div>
    </Frame>
  );
}

// 02 — On navy (white strokes + gold dot)
function NavyLockup() {
  return (
    <Frame index={2} title="On navy background" caption="white + gold · primary surface" bg={BTL.navy}>
      <StarPattern color="#fff" opacity={0.06} size={72}/>
      <div style={{ position: 'relative' }}>
        <BartalLockup size={84} layout="horizontal" fg="#fff" accent={BTL.gold}/>
        <div style={{
          marginTop: 22, textAlign: 'center',
          fontFamily: "'Poppins'", fontSize: 11, fontWeight: 500,
          color: 'rgba(255,255,255,0.55)', letterSpacing: 1.5, textTransform: 'uppercase',
        }}>
          بوابتك للتسوق · Your gateway to shopping
        </div>
      </div>
    </Frame>
  );
}

// 03 — App icon set
function AppIcon() {
  const Icon = ({ size, radius }) => (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: `linear-gradient(135deg, ${BTL.navy} 0%, ${BTL.navyDeep} 100%)`,
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 8px 22px rgba(11,25,48,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.12 }}>
        <StarPattern color="#fff" opacity={1} size={48}/>
      </div>
      <BartalMark size={size * 0.62} fg="#fff" accent={BTL.gold} mode="solid"/>
    </div>
  );
  return (
    <Frame index={3} title="App icon" caption="iOS · Android · favicon" bg={BTL.cream} height={460}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28 }}>
        <div style={{ textAlign: 'center' }}>
          <Icon size={160} radius={36}/>
          <div style={{ marginTop: 12, fontFamily: "'JetBrains Mono'", fontSize: 10, color: BTL.mute }}>iOS · 1024</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Icon size={120} radius="50%"/>
          <div style={{ marginTop: 12, fontFamily: "'JetBrains Mono'", fontSize: 10, color: BTL.mute }}>Android · adaptive</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Icon size={80} radius={18}/>
          <div style={{ marginTop: 12, fontFamily: "'JetBrains Mono'", fontSize: 10, color: BTL.mute }}>App Store · 512</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Icon size={48} radius={10}/>
          <div style={{ marginTop: 12, fontFamily: "'JetBrains Mono'", fontSize: 10, color: BTL.mute }}>Favicon · 48</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Icon size={28} radius={6}/>
          <div style={{ marginTop: 12, fontFamily: "'JetBrains Mono'", fontSize: 10, color: BTL.mute }}>Tab · 28</div>
        </div>
      </div>
    </Frame>
  );
}

// 04 — Business card (front + back, slight perspective)
function BusinessCard() {
  const cardW = 340, cardH = 198;
  return (
    <Frame index={4} title="Business card" caption="85 × 55 mm · front + back" bg={BTL.cream} height={460} wide>
      <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
        {/* Back (navy, brand-forward) */}
        <div style={{
          width: cardW, height: cardH, borderRadius: 6,
          background: BTL.navy, position: 'relative', overflow: 'hidden',
          boxShadow: '0 18px 36px rgba(11,25,48,0.28), 0 2px 0 rgba(11,25,48,0.6)',
          transform: 'rotate(-3deg)',
        }}>
          <StarPattern color="#fff" opacity={0.07} size={56}/>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BartalLockup size={44} layout="stacked" fg="#fff" accent={BTL.gold}/>
          </div>
          {/* gold corner accent */}
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 0, height: 0,
            borderStyle: 'solid', borderWidth: '0 0 26px 26px',
            borderColor: `transparent transparent ${BTL.gold} transparent`,
          }}/>
        </div>
        {/* Front (paper, contact info) */}
        <div style={{
          width: cardW, height: cardH, borderRadius: 6,
          background: BTL.paper, position: 'relative', overflow: 'hidden',
          boxShadow: '0 18px 36px rgba(11,25,48,0.18), 0 2px 0 rgba(11,25,48,0.06)',
          transform: 'rotate(2deg)',
          padding: '20px 22px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          border: `1px solid ${BTL.line}`,
        }}>
          <BartalLockup size={28} layout="horizontal" fg={BTL.navy} accent={BTL.gold}/>
          <div>
            <div style={{
              fontFamily: "'Poppins'", fontWeight: 600, fontSize: 13, color: BTL.navyInk,
            }}>Mohammed Osman</div>
            <div style={{
              fontFamily: "'Cairo'", fontWeight: 600, fontSize: 12, color: BTL.navy,
              marginTop: 1,
            }}>محمد عثمان · المدير العام</div>
            <div style={{
              fontFamily: "'JetBrains Mono'", fontSize: 10, color: BTL.mute,
              marginTop: 10, lineHeight: 1.7,
            }}>
              +249 91 234 5678<br/>
              hello@bartal.sd · bartal.sd
            </div>
          </div>
          <div style={{
            position: 'absolute', bottom: 18, right: 22,
            width: 6, height: 6, borderRadius: '50%', background: BTL.gold,
          }}/>
        </div>
      </div>
    </Frame>
  );
}

// 05 — Storefront signage mockup
function Signage() {
  return (
    <Frame index={5} title="Storefront sign" caption="illuminated panel · night view" bg="#0A1322" height={460} wide>
      {/* sky/wall */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 100%, ${BTL.navyInk} 0%, #050B16 80%)`,
      }}/>
      {/* faux building */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '38%',
        background: 'linear-gradient(180deg, #0F1B30 0%, #0A1322 100%)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}/>
      {/* sign panel */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '78%', maxWidth: 620,
        padding: '38px 44px',
        background: BTL.navy,
        borderRadius: 4,
        boxShadow: `0 0 60px rgba(212,134,11,0.18), 0 0 120px rgba(27,58,107,0.5), inset 0 0 0 1px rgba(255,255,255,0.08)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <StarPattern color="#fff" opacity={0.08} size={48}/>
        {/* glow */}
        <div style={{
          position: 'absolute', inset: -2, borderRadius: 6,
          boxShadow: `0 0 0 2px ${BTL.gold}33`,
          pointerEvents: 'none',
        }}/>
        <BartalLockup size={62} layout="horizontal" fg="#fff" accent={BTL.gold}/>
        {/* mounting brackets */}
        <div style={{ position: 'absolute', left: 14, top: -10, width: 6, height: 6, borderRadius: '50%', background: '#3A4A66' }}/>
        <div style={{ position: 'absolute', right: 14, top: -10, width: 6, height: 6, borderRadius: '50%', background: '#3A4A66' }}/>
        <div style={{ position: 'absolute', left: 14, bottom: -10, width: 6, height: 6, borderRadius: '50%', background: '#3A4A66' }}/>
        <div style={{ position: 'absolute', right: 14, bottom: -10, width: 6, height: 6, borderRadius: '50%', background: '#3A4A66' }}/>
      </div>
      {/* address strip */}
      <div style={{
        position: 'absolute', bottom: 22, left: 0, right: 0, textAlign: 'center',
        fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: 1.4,
        color: 'rgba(255,255,255,0.4)',
      }}>
        BARTAL HQ · KHARTOUM · شارع النيل
      </div>
    </Frame>
  );
}

// 06 — Construction / monochrome / clearspace reference sheet
function ConstructionSheet() {
  return (
    <Frame index={6} title="Construction & mono" caption="clearspace · grid · single-tone" bg="#fff" height={460}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 40, padding: '0 18px' }}>
        {/* Construction grid */}
        <div style={{ position: 'relative', width: 200, height: 200 }}>
          {/* grid */}
          <svg width="200" height="200" viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0 }}>
            <g stroke={BTL.gold} strokeWidth="0.3" fill="none" opacity="0.5" strokeDasharray="1 1">
              {/* clearspace box */}
              <rect x="2" y="2" width="96" height="96" stroke={BTL.gold} strokeDasharray="2 2"/>
              {/* x marks */}
              <line x1="50" y1="0" x2="50" y2="100"/>
              <line x1="0" y1="50" x2="100" y2="50"/>
              <line x1="0" y1="0" x2="100" y2="100"/>
              <line x1="100" y1="0" x2="0" y2="100"/>
              <circle cx="50" cy="50" r="46"/>
              <circle cx="50" cy="50" r="32"/>
              <circle cx="50" cy="50" r="20"/>
            </g>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BartalMark size={180} fg={BTL.navy} accent={BTL.gold}/>
          </div>
          {/* X measure */}
          <div style={{
            position: 'absolute', top: -18, left: 0, right: 0, textAlign: 'center',
            fontFamily: "'JetBrains Mono'", fontSize: 9, color: BTL.mute,
          }}>↔ 8X clearspace</div>
        </div>
        {/* Mono variants */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
          <div style={{
            padding: '14px 16px', background: BTL.paper, borderRadius: 6,
            border: `1px solid ${BTL.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <BartalLockup size={28} layout="horizontal" fg={BTL.ink} accent={BTL.ink}/>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: BTL.mute }}>1c · BLACK</div>
          </div>
          <div style={{
            padding: '14px 16px', background: '#000', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <BartalLockup size={28} layout="horizontal" fg="#fff" accent="#fff"/>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>1c · WHITE</div>
          </div>
          <div style={{
            padding: '14px 16px', background: BTL.gold, borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <BartalLockup size={28} layout="horizontal" fg={BTL.navy} accent={BTL.navy}/>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: BTL.navyDeep }}>OVERPRINT · GOLD</div>
          </div>
          <div style={{
            padding: '14px 16px', background: BTL.paper, borderRadius: 6,
            border: `1px dashed ${BTL.line}`,
          }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: BTL.mute, letterSpacing: 1, marginBottom: 8 }}>MIN SIZES</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
              <BartalLockup size={36} layout="horizontal" fg={BTL.navy} accent={BTL.gold}/>
              <BartalLockup size={22} layout="horizontal" fg={BTL.navy} accent={BTL.gold}/>
              <BartalMark size={18} fg={BTL.navy} accent={BTL.gold}/>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

Object.assign(window, {
  BTL, BartalMark, BartalLockup, StarPattern,
  Frame, PrimaryLockup, NavyLockup, AppIcon,
  BusinessCard, Signage, ConstructionSheet,
});
