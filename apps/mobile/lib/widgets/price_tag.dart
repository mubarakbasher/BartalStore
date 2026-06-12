import 'package:flutter/material.dart';

import '../core/utils/money.dart';
import '../design/theme.dart';

/// SDG price — port of `tokens.jsx PriceTag`: amount + unit at 0.65×size and
/// 70% opacity, optional struck-through compare price. AR renders Arabic-Indic
/// numerals with the `ج.س` unit; EN renders western digits with `SDG`.
class PriceTag extends StatelessWidget {
  const PriceTag({
    super.key,
    required this.amount,
    this.compare,
    this.size = 16,
    this.color,
    this.strong = true,
  });

  final Money amount;
  final Money? compare;
  final double size;
  final Color? color;
  final bool strong;

  @override
  Widget build(BuildContext context) {
    final arabic = Localizations.localeOf(context).languageCode == 'ar';
    final bartal = context.bartal;
    final effectiveColor = color ?? bartal.priceColor;
    final family = arabic ? 'Cairo' : 'Poppins';

    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.baseline,
      textBaseline: TextBaseline.alphabetic,
      children: [
        Text(
          fmtSDG(amount, arabic: arabic),
          style: TextStyle(
            fontFamily: family,
            fontSize: size,
            fontWeight: strong ? FontWeight.w700 : FontWeight.w500,
            color: effectiveColor,
          ),
        ),
        const SizedBox(width: 4),
        Text(
          arabic ? 'ج.س' : 'SDG',
          style: TextStyle(
            fontFamily: family,
            fontSize: size * 0.65,
            fontWeight: FontWeight.w500,
            color: effectiveColor.withValues(alpha: 0.7),
          ),
        ),
        if (compare != null)
          Padding(
            padding: const EdgeInsetsDirectional.only(start: 6),
            child: Text(
              fmtSDG(compare!, arabic: arabic),
              style: TextStyle(
                fontFamily: family,
                fontSize: size * 0.75,
                fontWeight: FontWeight.w400,
                color: effectiveColor.withValues(alpha: 0.5),
                decoration: TextDecoration.lineThrough,
                decorationColor: effectiveColor.withValues(alpha: 0.5),
              ),
            ),
          ),
      ],
    );
  }
}
