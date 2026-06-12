import 'package:flutter/material.dart';

import '../design/theme.dart';
import '../design/tokens.dart';

enum AppButtonVariant {
  /// Amber filled — system-kit CTAs (empty states, error retry, auth).
  primary,

  /// Navy filled — V1Detail "Buy now" style commerce CTA.
  navy,

  /// 1.5px navy outline, transparent fill — V1Detail "Add to cart".
  outline,
}

enum AppButtonSize {
  /// 13px vertical padding — system-kit CTA (13px 32px).
  medium,

  /// 14px vertical padding — sticky commerce bars (14px 18px).
  large,
}

/// The design's three button treatments, with press feedback and a loading
/// state (button disables and shows a spinner during async work).
class AppButton extends StatelessWidget {
  const AppButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.variant = AppButtonVariant.primary,
    this.size = AppButtonSize.medium,
    this.loading = false,
    this.expand = false,
    this.trailing,
    this.leading,
  });

  final String label;
  final VoidCallback? onPressed;
  final AppButtonVariant variant;
  final AppButtonSize size;
  final bool loading;
  final bool expand;
  final Widget? trailing;
  final Widget? leading;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    final type = context.bartalType;

    final (Color background, Color foreground, BorderSide side, List<BoxShadow>? shadow) =
        switch (variant) {
      AppButtonVariant.primary => (
          bartal.amber,
          Colors.white,
          BorderSide.none,
          null,
        ),
      AppButtonVariant.navy => (
          bartal.navy,
          Colors.white,
          BorderSide.none,
          [
            BoxShadow(
              color: BartalColors.navy.withValues(alpha: 0.2),
              blurRadius: 14,
              offset: const Offset(0, 4),
            ),
          ],
        ),
      AppButtonVariant.outline => (
          Colors.transparent,
          bartal.isDark ? bartal.text : bartal.navy,
          BorderSide(color: bartal.navy, width: 1.5),
          null,
        ),
    };

    final padding = switch (size) {
      AppButtonSize.medium =>
        const EdgeInsetsDirectional.symmetric(vertical: 13, horizontal: 32),
      AppButtonSize.large =>
        const EdgeInsetsDirectional.symmetric(vertical: 14, horizontal: 18),
    };

    final disabled = onPressed == null || loading;

    final child = Row(
      mainAxisSize: expand ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (loading) ...[
          SizedBox(
            width: 16,
            height: 16,
            child: CircularProgressIndicator(strokeWidth: 2, color: foreground),
          ),
          const SizedBox(width: 8),
        ] else if (leading != null) ...[
          leading!,
          const SizedBox(width: 8),
        ],
        Flexible(
          child: Text(
            label,
            overflow: TextOverflow.ellipsis,
            style: type.label.copyWith(
              color: foreground,
              fontWeight:
                  variant == AppButtonVariant.outline ? FontWeight.w600 : FontWeight.w700,
            ),
          ),
        ),
        if (trailing != null) ...[
          const SizedBox(width: 8),
          trailing!,
        ],
      ],
    );

    return Semantics(
      button: true,
      enabled: !disabled,
      label: label,
      child: AnimatedOpacity(
        duration: const Duration(milliseconds: 150),
        opacity: disabled && !loading ? 0.5 : 1,
        child: DecoratedBox(
          decoration: BoxDecoration(
            boxShadow: disabled ? null : shadow,
            borderRadius: BorderRadius.circular(BartalRadii.r12),
          ),
          child: Material(
            color: background,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(BartalRadii.r12),
              side: side,
            ),
            child: InkWell(
              onTap: disabled ? null : onPressed,
              borderRadius: BorderRadius.circular(BartalRadii.r12),
              child: ConstrainedBox(
                // ui-ux-pro-max: ≥48dp touch target.
                constraints: const BoxConstraints(minHeight: 48),
                child: Padding(padding: padding, child: child),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
