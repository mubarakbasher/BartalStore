import 'package:flutter/material.dart';

import 'tokens.dart';
import 'typography.dart';

/// Semantic palette carried as a [ThemeExtension] so every screen reads
/// `context.bartal.<token>` instead of guessing Material slots.
/// One instance per brightness; accent colors are shared across modes
/// (per tokens.jsx — only surfaces/text/lines swap in dark mode).
@immutable
class BartalTheme extends ThemeExtension<BartalTheme> {
  const BartalTheme({
    required this.isDark,
    required this.bg,
    required this.surface,
    required this.raised,
    required this.line,
    required this.text,
    required this.textMute,
    required this.headerBg,
  });

  final bool isDark;

  /// Screen background — sand (light) / d_bg (dark).
  final Color bg;

  /// Card/sheet background — white (light) / d_surface (dark).
  final Color surface;

  /// Raised surface — paper (light) / d_raised (dark).
  final Color raised;
  final Color line;
  final Color text;
  final Color textMute;

  /// Navy header band — navy (light) / navyInk (dark), per V1Home.
  final Color headerBg;

  // Accents (mode-invariant).
  Color get navy => BartalColors.navy;
  Color get navyDeep => BartalColors.navyDeep;
  Color get navyInk => BartalColors.navyInk;
  Color get amber => BartalColors.amber;
  Color get amberSoft => BartalColors.amberSoft;
  Color get amberTint => BartalColors.amberTint;
  Color get amberHover => BartalColors.amberHover;
  Color get amberActive => BartalColors.amberActive;
  Color get success => BartalColors.success;
  Color get danger => BartalColors.danger;
  Color get info => BartalColors.info;

  /// Price text color — navyInk (light) / d_text (dark), per PriceTag usage.
  Color get priceColor => isDark ? BartalColors.dText : BartalColors.navyInk;

  static const light = BartalTheme(
    isDark: false,
    bg: BartalColors.sand,
    surface: BartalColors.surface,
    raised: BartalColors.paper,
    line: BartalColors.line,
    text: BartalColors.text,
    textMute: BartalColors.textMute,
    headerBg: BartalColors.navy,
  );

  static const dark = BartalTheme(
    isDark: true,
    bg: BartalColors.dBg,
    surface: BartalColors.dSurface,
    raised: BartalColors.dRaised,
    line: BartalColors.dLine,
    text: BartalColors.dText,
    textMute: BartalColors.dTextMute,
    headerBg: BartalColors.navyInk,
  );

  @override
  BartalTheme copyWith({
    bool? isDark,
    Color? bg,
    Color? surface,
    Color? raised,
    Color? line,
    Color? text,
    Color? textMute,
    Color? headerBg,
  }) {
    return BartalTheme(
      isDark: isDark ?? this.isDark,
      bg: bg ?? this.bg,
      surface: surface ?? this.surface,
      raised: raised ?? this.raised,
      line: line ?? this.line,
      text: text ?? this.text,
      textMute: textMute ?? this.textMute,
      headerBg: headerBg ?? this.headerBg,
    );
  }

  @override
  BartalTheme lerp(BartalTheme? other, double t) {
    if (other == null) return this;
    return BartalTheme(
      isDark: t < 0.5 ? isDark : other.isDark,
      bg: Color.lerp(bg, other.bg, t)!,
      surface: Color.lerp(surface, other.surface, t)!,
      raised: Color.lerp(raised, other.raised, t)!,
      line: Color.lerp(line, other.line, t)!,
      text: Color.lerp(text, other.text, t)!,
      textMute: Color.lerp(textMute, other.textMute, t)!,
      headerBg: Color.lerp(headerBg, other.headerBg, t)!,
    );
  }
}

/// Builds the full [ThemeData] for one (brightness, locale) pair.
/// Font family resolves at build time: Cairo for AR, Poppins otherwise.
ThemeData buildBartalTheme({required Brightness brightness, required bool arabic}) {
  final bartal = brightness == Brightness.dark ? BartalTheme.dark : BartalTheme.light;
  final type = BartalType.resolve(arabic: arabic, palette: bartal);
  final fontFamily = arabic ? 'Cairo' : 'Poppins';

  return ThemeData(
    useMaterial3: true,
    brightness: brightness,
    fontFamily: fontFamily,
    scaffoldBackgroundColor: bartal.bg,
    colorScheme: ColorScheme.fromSeed(
      seedColor: BartalColors.navy,
      brightness: brightness,
      primary: BartalColors.navy,
      secondary: BartalColors.amber,
      error: BartalColors.danger,
      surface: bartal.surface,
    ),
    dividerColor: bartal.line,
    splashFactory: InkRipple.splashFactory,
    textTheme: TextTheme(
      displaySmall: type.display,
      headlineMedium: type.h1,
      headlineSmall: type.h2,
      titleMedium: type.h3,
      bodyMedium: type.body,
      bodySmall: type.small,
      labelLarge: type.label,
      labelSmall: type.micro,
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: bartal.bg,
      foregroundColor: bartal.text,
      elevation: 0,
      centerTitle: false,
    ),
    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: bartal.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadiusDirectional.vertical(top: Radius.circular(BartalRadii.r16)),
      ),
    ),
    extensions: [bartal, type],
  );
}

extension BartalContext on BuildContext {
  BartalTheme get bartal => Theme.of(this).extension<BartalTheme>()!;
  BartalType get bartalType => Theme.of(this).extension<BartalType>()!;
}
