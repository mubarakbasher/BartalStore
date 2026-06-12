import 'package:flutter/material.dart';
import 'package:path_drawing/path_drawing.dart';

import '../design/theme.dart';
import '../design/tokens.dart';
import '../l10n/gen/l10n.dart';
import 'app_button.dart';

enum ErrorScreenKind { error, offline }

/// Full-screen error / offline state — port of
/// `system-kit.jsx MobileErrorScreen`: 120px rounded glyph box (mono `500`
/// or struck WiFi icon), uppercase tag, 22/700 title, retry CTA.
class ErrorState extends StatelessWidget {
  const ErrorState({super.key, required this.kind, required this.onRetry});

  final ErrorScreenKind kind;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isError = kind == ErrorScreenKind.error;
    final accent = isError ? bartal.danger : bartal.navy;

    return Center(
      child: Padding(
        padding: const EdgeInsetsDirectional.symmetric(horizontal: 36),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: bartal.isDark ? bartal.raised : bartal.surface,
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: accent, width: 2),
                boxShadow: [
                  BoxShadow(
                    color: accent.withValues(alpha: 0.13),
                    blurRadius: 40,
                    offset: const Offset(0, 14),
                  ),
                ],
              ),
              child: isError
                  ? Center(
                      child: Text(
                        '500',
                        style: TextStyle(
                          fontFamily: 'JetBrainsMono',
                          fontSize: 40,
                          fontWeight: FontWeight.w700,
                          letterSpacing: -1,
                          color: accent,
                        ),
                      ),
                    )
                  : CustomPaint(
                      size: const Size(60, 60),
                      painter: _OfflineGlyphPainter(color: accent),
                    ),
            ),
            const SizedBox(height: 28),
            Text(
              (isError ? l10n.errorServerTag : l10n.errorOfflineTag).toUpperCase(),
              style: TextStyle(
                fontSize: 10,
                letterSpacing: 2,
                fontWeight: FontWeight.w700,
                color: accent,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              isError ? l10n.errorServerTitle : l10n.errorOfflineTitle,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700, color: bartal.text),
            ),
            const SizedBox(height: 10),
            ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 280),
              child: Text(
                isError ? l10n.errorServerBody : l10n.errorOfflineBody,
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 13, height: 1.6, color: bartal.textMute),
              ),
            ),
            const SizedBox(height: 28),
            AppButton(
              label: l10n.errorTryAgain,
              onPressed: onRetry,
              leading: const Text('↻', style: TextStyle(color: Colors.white, fontSize: 14)),
            ),
          ],
        ),
      ),
    );
  }
}

/// WiFi-with-strikethrough glyph from the offline variant (60×60 viewBox).
class _OfflineGlyphPainter extends CustomPainter {
  _OfflineGlyphPainter({required this.color});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    Paint stroke(double width, Color c, [double opacity = 1]) => Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = width
      ..strokeCap = StrokeCap.round
      ..color = c.withValues(alpha: opacity);

    canvas.drawPath(parseSvgPathData('M30 44 L30 44.01'), stroke(4, color));
    canvas.drawPath(
      parseSvgPathData('M18 34 C23 30 37 30 42 34'),
      stroke(3, color),
    );
    canvas.drawPath(
      parseSvgPathData('M10 24 C16 18 44 18 50 24'),
      stroke(3, color, 0.5),
    );
    canvas.drawPath(
      parseSvgPathData('M8 12 L52 52'),
      stroke(4, BartalColors.danger),
    );
  }

  @override
  bool shouldRepaint(_OfflineGlyphPainter oldDelegate) => color != oldDelegate.color;
}
