import 'package:flutter/material.dart';

import 'theme.dart';

/// The nine named type styles from `tokens.jsx typeStyle`, resolved per
/// (locale, brightness) and carried as a [ThemeExtension].
///
/// `small` and `micro` default to the muted color, matching the design.
/// `micro` is rendered uppercase in the design (EN only — apply
/// `.toUpperCase()` to the string; Flutter has no textTransform).
@immutable
class BartalType extends ThemeExtension<BartalType> {
  const BartalType({
    required this.display,
    required this.h1,
    required this.h2,
    required this.h3,
    required this.body,
    required this.small,
    required this.micro,
    required this.label,
    required this.mono,
  });

  final TextStyle display;
  final TextStyle h1;
  final TextStyle h2;
  final TextStyle h3;
  final TextStyle body;
  final TextStyle small;
  final TextStyle micro;
  final TextStyle label;
  final TextStyle mono;

  factory BartalType.resolve({required bool arabic, required BartalTheme palette}) {
    final fam = arabic ? 'Cairo' : 'Poppins';
    final color = palette.text;
    final muted = palette.textMute;
    TextStyle s({
      required double size,
      required FontWeight weight,
      double? height,
      Color? c,
      double? spacing,
      String? family,
    }) {
      return TextStyle(
        fontFamily: family ?? fam,
        fontWeight: weight,
        fontSize: size,
        height: height,
        color: c ?? color,
        letterSpacing: spacing,
      );
    }

    return BartalType(
      display: s(
        size: 32,
        weight: FontWeight.w700,
        height: 1.15,
        spacing: arabic ? 0 : -0.5,
      ),
      h1: s(size: 24, weight: FontWeight.w700, height: 1.2),
      h2: s(size: 20, weight: FontWeight.w600, height: 1.3),
      h3: s(size: 17, weight: FontWeight.w600, height: 1.35),
      body: s(size: 15, weight: FontWeight.w400, height: 1.5),
      small: s(size: 13, weight: FontWeight.w400, height: 1.45, c: muted),
      micro: s(size: 11, weight: FontWeight.w500, height: 1.3, c: muted, spacing: 0.5),
      label: s(size: 14, weight: FontWeight.w500, height: 1.3),
      mono: s(size: 12, weight: FontWeight.w500, family: 'JetBrainsMono'),
    );
  }

  @override
  BartalType copyWith({
    TextStyle? display,
    TextStyle? h1,
    TextStyle? h2,
    TextStyle? h3,
    TextStyle? body,
    TextStyle? small,
    TextStyle? micro,
    TextStyle? label,
    TextStyle? mono,
  }) {
    return BartalType(
      display: display ?? this.display,
      h1: h1 ?? this.h1,
      h2: h2 ?? this.h2,
      h3: h3 ?? this.h3,
      body: body ?? this.body,
      small: small ?? this.small,
      micro: micro ?? this.micro,
      label: label ?? this.label,
      mono: mono ?? this.mono,
    );
  }

  @override
  BartalType lerp(BartalType? other, double t) {
    if (other == null) return this;
    return BartalType(
      display: TextStyle.lerp(display, other.display, t)!,
      h1: TextStyle.lerp(h1, other.h1, t)!,
      h2: TextStyle.lerp(h2, other.h2, t)!,
      h3: TextStyle.lerp(h3, other.h3, t)!,
      body: TextStyle.lerp(body, other.body, t)!,
      small: TextStyle.lerp(small, other.small, t)!,
      micro: TextStyle.lerp(micro, other.micro, t)!,
      label: TextStyle.lerp(label, other.label, t)!,
      mono: TextStyle.lerp(mono, other.mono, t)!,
    );
  }
}
