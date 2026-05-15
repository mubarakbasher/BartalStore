// logo-concepts.jsx — 4 symbol concepts rooted in Sudanese craft heritage
// Word origin: برتل (bartala) in classical Arabic = to give, gift, bestow.
// All concepts share: navy #1B3A6B + gold #D4860B, Cairo Bold + Poppins SemiBold,
// gold dot as the diacritic accent across both scripts.

const NAVY  = '#1B3A6B';
const GOLD  = '#D4860B';
const SAND  = '#F4EFE3';
const CREAM = '#EDE5D2';
const PAPER = '#FBFAF7';
const INK   = '#0B1930';
const LINE  = '#E6DECC';
const MUTE  = '#6B6356';

// ─────────────────────────────────────────────────────────────
// CONCEPT A — JIRTIG STAR
// 8-point star from Sudanese jirtig wedding adornments + traditional
// kilim geometry. The eight points = eight cardinal directions
// (north Sudan, south, Nile valley, etc.). Filled, monolithic.
// ─────────────────────────────────────────────────────────────
function MarkA({ size = 100, fg = NAVY, accent = GOLD }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={{ display: 'block' }}>
      {/* outer 8-point star */}
      <path d="M50 6 L58 36 L88 30 L70 54 L94 70 L64 70 L66 96 L50 76 L34 96 L36 70 L6 70 L30 54 L12 30 L42 36 Z"
            fill={fg}/>
      {/* inset inner star (negative space — gives it depth) */}
      <path d="M50 28 L54 42 L68 40 L60 52 L70 60 L58 60 L58 70 L50 62 L42 70 L42 60 L30 60 L40 52 L32 40 L46 42 Z"
            fill={SAND} opacity="0.0"/>
      {/* center medallion */}
      <circle cx="50" cy="50" r="10" fill={fg} stroke={accent} strokeWidth="2"/>
      <circle cx="50" cy="50" r="3.5" fill={accent}/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// CONCEPT B — NUBIAN ARCH (Mihrab/Doorway)
// A nubian doorway/arch — literal "portal" reading, also referencing
// the rounded mud-brick architecture of Suakin & Old Dongola.
// The arch frames a Meroitic pyramid silhouette with a gold sun-disc.
// ─────────────────────────────────────────────────────────────
function MarkB({ size = 100, fg = NAVY, accent = GOLD }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={{ display: 'block' }}>
      {/* keystone arch — outer */}
      <path d="M14 92 L14 50 Q14 14 50 14 Q86 14 86 50 L86 92 Z" fill={fg}/>
      {/* inner arch (negative space — the doorway) */}
      <path d="M26 92 L26 50 Q26 26 50 26 Q74 26 74 50 L74 92 Z" fill={SAND}/>
      {/* sun-disc inside */}
      <circle cx="50" cy="46" r="8" fill={accent}/>
      {/* pyramid silhouette grounded under the disc */}
      <path d="M36 92 L50 60 L64 92 Z" fill={fg}/>
      {/* threshold line */}
      <rect x="10" y="92" width="80" height="3" fill={fg}/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// CONCEPT C — CONFLUENCE (Two Niles)
// The Blue and White Nile meeting at Khartoum — two crescents flowing
// inward, joined at a gold center point. The mark is also a stylized
// "ب" (the first letter of برتال) when read as RTL.
// ─────────────────────────────────────────────────────────────
function MarkC({ size = 100, fg = NAVY, accent = GOLD }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={{ display: 'block' }}>
      {/* outer ring (frame) */}
      <circle cx="50" cy="50" r="46" fill="none" stroke={fg} strokeWidth="3"/>
      {/* upper crescent — Blue Nile */}
      <path d="M18 36 Q50 18 82 36 Q66 44 50 44 Q34 44 18 36 Z" fill={fg}/>
      {/* lower crescent — White Nile */}
      <path d="M18 64 Q34 56 50 56 Q66 56 82 64 Q50 82 18 64 Z" fill={fg}/>
      {/* confluence point */}
      <circle cx="50" cy="50" r="5" fill={accent}/>
      {/* small dot under — the dot of ب */}
      <circle cx="50" cy="74" r="2.4" fill={fg}/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// CONCEPT D — ACACIA SEAL
// Stylized acacia tree (gum arabic — Sudan's heritage export)
// inscribed in a hexagonal seal. Reads as a craft mark / merchant seal.
// The trunk extends to a gold horizon line.
// ─────────────────────────────────────────────────────────────
function MarkD({ size = 100, fg = NAVY, accent = GOLD }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={{ display: 'block' }}>
      {/* hexagonal seal */}
      <path d="M50 6 L88 28 L88 72 L50 94 L12 72 L12 28 Z"
            fill="none" stroke={fg} strokeWidth="3"/>
      {/* inner faint hex */}
      <path d="M50 14 L82 32 L82 68 L50 86 L18 68 L18 32 Z"
            fill="none" stroke={fg} strokeWidth="0.8" opacity="0.35"/>
      {/* acacia umbrella canopy — flat top, three layered tiers */}
      <ellipse cx="50" cy="38" rx="28" ry="6" fill={fg}/>
      <ellipse cx="50" cy="44" rx="22" ry="5" fill={fg}/>
      <ellipse cx="50" cy="50" rx="15" ry="4" fill={fg}/>
      {/* trunk */}
      <rect x="48" y="50" width="4" height="20" fill={fg}/>
      {/* roots/spread */}
      <path d="M40 70 L48 70 L48 64 M60 70 L52 70 L52 64" stroke={fg} strokeWidth="2" fill="none"/>
      {/* horizon — gold line */}
      <line x1="22" y1="74" x2="78" y2="74" stroke={accent} strokeWidth="2.5"/>
      {/* sun rising behind */}
      <circle cx="50" cy="74" r="3" fill={accent}/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// LOCKUPS — bilingual, mark on the LEFT, AR + EN stacked or inline.
// The gold dot is shared as a diacritic accent across both scripts.
// ─────────────────────────────────────────────────────────────
function ConceptLockup({ Mark, size = 78, fg = NAVY, accent = GOLD, layout = 'horizontal' }) {
  const arSize = size * 0.78;
  const enSize = size * 0.58;

  const Latin = (
    <div style={{
      fontFamily: "'Poppins', system-ui",
      fontWeight: 600,
      fontSize: enSize,
      letterSpacing: -0.4,
      color: fg,
      lineHeight: 1,
      display: 'inline-flex',
      alignItems: 'baseline',
    }}>
      Bartal
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
      {/* gold dot — placed as the dot of the ب */}
      <span style={{
        position: 'absolute',
        top: arSize * 0.62,
        right: arSize * 0.05,
        width: arSize * 0.13,
        height: arSize * 0.13,
        borderRadius: '50%',
        background: accent,
      }}/>
    </div>
  );

  if (layout === 'stacked') {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.22 }}>
        <Mark size={size} fg={fg} accent={accent}/>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.08 }}>
          {Arabic}
          <div style={{ width: size * 1.5, height: 1, background: fg, opacity: 0.22 }}/>
          {Latin}
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.32 }}>
      <Mark size={size} fg={fg} accent={accent}/>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.26 }}>
        {Arabic}
        <div style={{ width: 1, height: arSize * 0.7, background: fg, opacity: 0.25 }}/>
        {Latin}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CONCEPT CARD — frames a single concept with: title, etymology,
// mark in 3 sizes, lockup, applied to navy chip + light chip.
// ─────────────────────────────────────────────────────────────
function ConceptCard({ index, code, name, rootIdea, refText, Mark, selected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: '#fff',
        borderRadius: 18,
        border: `2px solid ${selected ? GOLD : LINE}`,
        boxShadow: selected
          ? `0 1px 0 rgba(11,25,48,0.04), 0 18px 40px rgba(212,134,11,0.18)`
          : '0 1px 0 rgba(11,25,48,0.04), 0 12px 30px rgba(11,25,48,0.06)',
        overflow: 'hidden',
        transition: 'all 0.25s',
        cursor: 'pointer',
      }}>
      {/* Header */}
      <div style={{ padding: '18px 22px 14px', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
          <div style={{
            fontFamily: "'JetBrains Mono'", fontSize: 10, fontWeight: 700, color: GOLD,
            letterSpacing: 1.4,
          }}>
            {code} · CONCEPT {index}
          </div>
          {selected && (
            <div style={{
              fontFamily: "'JetBrains Mono'", fontSize: 9, fontWeight: 700,
              padding: '2px 7px', borderRadius: 100,
              background: GOLD, color: '#fff', letterSpacing: 1,
            }}>SELECTED</div>
          )}
        </div>
        <div style={{
          fontFamily: "'Poppins'", fontSize: 20, fontWeight: 700, color: INK, marginBottom: 4, letterSpacing: -0.3,
        }}>{name}</div>
        <div style={{
          fontFamily: "'Poppins'", fontSize: 12.5, color: MUTE, lineHeight: 1.55,
        }}>{rootIdea}</div>
      </div>

      {/* Hero mark on cream */}
      <div style={{
        background: SAND, padding: '36px 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', minHeight: 200,
      }}>
        <Mark size={140} fg={NAVY} accent={GOLD}/>
      </div>

      {/* Lockup row — light + dark surfaces */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: LINE }}>
        <div style={{
          background: PAPER, padding: '20px 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100,
          overflow: 'hidden',
        }}>
          <ConceptLockup Mark={Mark} size={28} fg={NAVY} accent={GOLD}/>
        </div>
        <div style={{
          background: NAVY, padding: '20px 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100,
          overflow: 'hidden',
        }}>
          <ConceptLockup Mark={Mark} size={28} fg="#fff" accent={GOLD}/>
        </div>
      </div>

      {/* Scale row */}
      <div style={{
        padding: '16px 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderTop: `1px solid ${LINE}`, background: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
          <Mark size={48} fg={NAVY} accent={GOLD}/>
          <Mark size={28} fg={NAVY} accent={GOLD}/>
          <Mark size={18} fg={NAVY} accent={GOLD}/>
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono'", fontSize: 9, color: MUTE,
          letterSpacing: 1, textAlign: 'right', maxWidth: 180, lineHeight: 1.5,
        }}>
          {refText}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  NAVY, GOLD, SAND, CREAM, PAPER, INK, LINE, MUTE,
  MarkA, MarkB, MarkC, MarkD,
  ConceptLockup, ConceptCard,
});
