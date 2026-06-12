import 'package:flutter/material.dart';
import 'package:path_drawing/path_drawing.dart';

import '../design/theme.dart';
import '../design/tokens.dart';
import '../l10n/gen/l10n.dart';
import 'app_button.dart';

enum EmptyStateKind { cart, orders, search, addresses, wishlist, notifications }

/// Centered empty state — port of `system-kit.jsx MobileEmptyState`:
/// illustration, 20/700 title, 13 muted body (max 280), amber CTA.
/// Wishlist/notifications reuse the closest designed variant's illustration
/// (cart/package) with their own copy — no new visuals invented.
class EmptyState extends StatelessWidget {
  const EmptyState({super.key, required this.kind, this.onCta});

  final EmptyStateKind kind;
  final VoidCallback? onCta;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;

    final (String title, String body, String cta, _IlloKind illo) = switch (kind) {
      EmptyStateKind.cart =>
        (l10n.emptyCartTitle, l10n.emptyCartBody, l10n.emptyCartCta, _IlloKind.cart),
      EmptyStateKind.orders =>
        (l10n.emptyOrdersTitle, l10n.emptyOrdersBody, l10n.emptyOrdersCta, _IlloKind.package),
      EmptyStateKind.search =>
        (l10n.emptySearchTitle, l10n.emptySearchBody, l10n.emptySearchCta, _IlloKind.search),
      EmptyStateKind.addresses => (
          l10n.emptyAddressesTitle,
          l10n.emptyAddressesBody,
          l10n.emptyAddressesCta,
          _IlloKind.pin
        ),
      EmptyStateKind.wishlist =>
        (l10n.wishlistEmpty, l10n.emptyCartBody, l10n.emptyCartCta, _IlloKind.cart),
      EmptyStateKind.notifications =>
        (l10n.navNotifications, l10n.emptyOrdersBody, l10n.emptyOrdersCta, _IlloKind.package),
    };

    return Center(
      child: Padding(
        padding: const EdgeInsetsDirectional.symmetric(horizontal: 36),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CustomPaint(
              size: const Size(148, 132),
              painter: _EmptyIlloPainter(kind: illo, dark: bartal.isDark),
            ),
            const SizedBox(height: 22),
            Text(
              title,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: bartal.text),
            ),
            const SizedBox(height: 10),
            ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 280),
              child: Text(
                body,
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 13, height: 1.6, color: bartal.textMute),
              ),
            ),
            const SizedBox(height: 28),
            if (onCta != null) AppButton(label: cta, onPressed: onCta),
          ],
        ),
      ),
    );
  }
}

enum _IlloKind { cart, package, search, pin }

/// Port of `system-kit.jsx EmptyIllustration` — 148×132 viewBox, neutral
/// fill/stroke per brightness, amber accents.
class _EmptyIlloPainter extends CustomPainter {
  _EmptyIlloPainter({required this.kind, required this.dark});

  final _IlloKind kind;
  final bool dark;

  @override
  void paint(Canvas canvas, Size size) {
    final stroke = dark ? BartalColors.dLine : const Color(0xFFE5DFD4);
    final fill = dark ? BartalColors.dRaised : const Color(0xFFFAF7F0);
    const amber = BartalColors.amber;

    Paint strokePaint([double width = 1.5]) => Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = width
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..color = stroke;
    final fillPaint = Paint()..color = fill;
    Paint amberStroke(double width) => Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = width
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..color = amber;
    final amberFill = Paint()..color = amber;

    switch (kind) {
      case _IlloKind.cart:
        final body = RRect.fromRectAndRadius(
          const Rect.fromLTWH(28, 42, 92, 70),
          const Radius.circular(6),
        );
        canvas.drawRRect(body, fillPaint);
        canvas.drawRRect(body, strokePaint());
        canvas.drawPath(
          parseSvgPathData('M20 28 L32 28 L42 82 L118 82'),
          amberStroke(2.5),
        );
        canvas.drawCircle(const Offset(54, 108), 8, amberFill);
        canvas.drawCircle(const Offset(104, 108), 8, amberFill);
        canvas.drawPath(parseSvgPathData('M56 52 L88 52 M56 64 L76 64'), strokePaint(2));
        // Floating star motif at (110, 20), 40% opacity.
        canvas.save();
        canvas.translate(110, 20);
        canvas.drawPath(
          parseSvgPathData('M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z'),
          Paint()..color = amber.withValues(alpha: 0.4),
        );
        canvas.restore();
      case _IlloKind.package:
        final box = parseSvgPathData('M74 14 L124 36 L124 92 L74 114 L24 92 L24 36 Z');
        canvas.drawPath(box, fillPaint);
        canvas.drawPath(box, strokePaint());
        canvas.drawPath(parseSvgPathData('M24 36 L74 58 L124 36'), strokePaint());
        canvas.drawPath(parseSvgPathData('M74 58 L74 114'), strokePaint());
        canvas.drawPath(parseSvgPathData('M49 25 L99 47'), amberStroke(2.5));
        canvas.drawCircle(const Offset(74, 70), 4, amberFill);
      case _IlloKind.search:
        canvas.drawCircle(const Offset(62, 58), 30, fillPaint);
        canvas.drawCircle(const Offset(62, 58), 30, strokePaint());
        canvas.drawPath(parseSvgPathData('M84 80 L110 106'), amberStroke(4));
        canvas.drawPath(
          parseSvgPathData('M50 58 L74 58 M62 46 L62 70'),
          strokePaint(2),
        );
      case _IlloKind.pin:
        final pin = parseSvgPathData(
          'M74 18 C55 18 40 33 40 52 C40 76 74 112 74 112 C74 112 108 76 108 52 C108 33 93 18 74 18 Z',
        );
        canvas.drawPath(pin, fillPaint);
        canvas.drawPath(pin, strokePaint());
        canvas.drawCircle(const Offset(74, 52), 12, amberFill);
        final dashed = strokePaint(2);
        for (var x = 30.0; x < 118; x += 8) {
          canvas.drawLine(Offset(x, 118), Offset(x + 4, 118), dashed);
        }
    }
  }

  @override
  bool shouldRepaint(_EmptyIlloPainter oldDelegate) =>
      kind != oldDelegate.kind || dark != oldDelegate.dark;
}
