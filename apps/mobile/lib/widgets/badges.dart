import 'package:flutter/material.dart';

import '../design/theme.dart';

/// Red count badge — V1TabBar cart badge (min 16px, radius 8, 10px/700).
class CountBadge extends StatelessWidget {
  const CountBadge({super.key, required this.count, this.color});

  final int count;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    if (count <= 0) return const SizedBox.shrink();
    final bartal = context.bartal;
    return Container(
      constraints: const BoxConstraints(minWidth: 16),
      height: 16,
      padding: const EdgeInsetsDirectional.symmetric(horizontal: 4),
      decoration: BoxDecoration(
        color: color ?? bartal.danger,
        borderRadius: BorderRadius.circular(8),
      ),
      alignment: Alignment.center,
      child: Text(
        '$count',
        style: const TextStyle(
          color: Colors.white,
          fontSize: 10,
          fontWeight: FontWeight.w700,
          height: 1,
        ),
      ),
    );
  }
}

/// Amber "Sale" chip overlaid on product imagery (V1Home featured cards).
class SaleBadge extends StatelessWidget {
  const SaleBadge({super.key, required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Container(
      padding: const EdgeInsetsDirectional.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: bartal.amber,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        label,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 11,
          fontWeight: FontWeight.w500,
          letterSpacing: 0.5,
          height: 1.3,
        ),
      ),
    );
  }
}

/// Green stock chip — V1Detail `In stock · 12`.
class StockBadge extends StatelessWidget {
  const StockBadge({super.key, required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Container(
      padding: const EdgeInsetsDirectional.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: bartal.isDark
            ? bartal.success.withValues(alpha: 0.18)
            : const Color(0xFFE8F5E9),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: bartal.success,
          fontSize: 11,
          fontWeight: FontWeight.w500,
          letterSpacing: 0.5,
          height: 1.3,
        ),
      ),
    );
  }
}
