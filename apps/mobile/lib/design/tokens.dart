import 'dart:ui';

/// Bartal design tokens — mirrors `packages/shared/src/design/tokens.ts`
/// (which itself is translated from `docs/design/bartal/project/tokens.jsx`).
///
/// DO NOT invent colors, radii, or spacing here. Every value must trace back
/// to the design bundle. See CLAUDE.md §5.
abstract final class BartalColors {
  // Light palette
  static const navy = Color(0xFF1B3A6B);
  static const navyDeep = Color(0xFF122647);
  static const navyInk = Color(0xFF0B1930);
  static const amber = Color(0xFFD4860B);
  static const amberSoft = Color(0xFFF2B544);
  static const amberTint = Color(0xFFFDF4E2);
  // Derived interaction states (standardized in @bartal/shared, not in the
  // static design canvas — never hardcode these in screens).
  static const amberHover = Color(0xFFB57208);
  static const amberActive = Color(0xFF9A6206);
  static const sand = Color(0xFFF7F3EC);
  static const paper = Color(0xFFFBFAF7);
  static const surface = Color(0xFFFFFFFF);
  static const line = Color(0xFFE8E2D5);
  static const text = Color(0xFF1A1A1A);
  static const textMute = Color(0xFF6B6356);
  static const success = Color(0xFF2E7D32);
  static const danger = Color(0xFFC62828);
  static const info = Color(0xFF3A6DB0);

  // Dark palette
  static const dBg = Color(0xFF0B1930);
  static const dSurface = Color(0xFF132744);
  static const dRaised = Color(0xFF1B3358);
  static const dLine = Color(0xFF254270);
  static const dText = Color(0xFFF3EFE6);
  static const dTextMute = Color(0xFF9FB1CE);
}

/// Corner radii — the design uses 12 (standard), 16 (large), and full pills.
abstract final class BartalRadii {
  static const r12 = 12.0;
  static const r16 = 16.0;
  static const pill = 999.0;
}

/// Spacing on the 4px grid (CLAUDE.md §5 checklist).
abstract final class BartalSpacing {
  static const x1 = 4.0;
  static const x2 = 8.0;
  static const x3 = 12.0;
  static const x4 = 16.0;
  static const x5 = 20.0;
  static const x6 = 24.0;
  static const x8 = 32.0;
  static const x10 = 40.0;
  static const x12 = 48.0;
}

/// Striped product-placeholder hue ramps (tokens.jsx `ProductPlaceholder`).
/// [0] = light stripe, [1] = dark stripe, [2] = label color.
const Map<String, List<Color>> placeholderPalettes = {
  'warm': [Color(0xFFF2E3C4), Color(0xFFE8D3A8), Color(0xFFD4B982)],
  'navy': [Color(0xFFD7DDE8), Color(0xFFB7C4D8), Color(0xFF8FA3C2)],
  'amber': [Color(0xFFFBEACB), Color(0xFFF2D79E), Color(0xFFE5B867)],
  'rose': [Color(0xFFF0DAD2), Color(0xFFDDBCB0), Color(0xFFC5998C)],
  'green': [Color(0xFFD9E3D4), Color(0xFFBACBB0), Color(0xFF95AF87)],
  'night': [Color(0xFF1B3358), Color(0xFF254270), Color(0xFF0B1930)],
};

/// Deterministic hue for a product: stable across sessions so a given product
/// always renders the same placeholder ramp.
String placeholderHueFor(String productId) {
  const hues = ['warm', 'navy', 'amber', 'rose', 'green', 'night'];
  var hash = 0;
  for (final unit in productId.codeUnits) {
    hash = (hash * 31 + unit) & 0x7fffffff;
  }
  return hues[hash % hues.length];
}
