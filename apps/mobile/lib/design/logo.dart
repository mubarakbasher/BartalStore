import 'package:flutter/material.dart';
import 'package:path_drawing/path_drawing.dart';

import 'tokens.dart';

/// Bartal logo mark — port of `tokens.jsx LogoMark`: 8-pointed star with an
/// amber centre (doorway/portal metaphor, برتال = portal). 32-unit viewBox.
/// Never recolor outside the navy/amber pair (CLAUDE.md §5 rule 4).
class LogoMark extends StatelessWidget {
  const LogoMark({
    super.key,
    this.color = BartalColors.navy,
    this.accent = BartalColors.amber,
    this.size = 28,
  });

  final Color color;
  final Color accent;
  final double size;

  @override
  Widget build(BuildContext context) {
    return RepaintBoundary(
      child: CustomPaint(
        size: Size.square(size),
        painter: _LogoMarkPainter(color: color, accent: accent),
      ),
    );
  }
}

class _LogoMarkPainter extends CustomPainter {
  _LogoMarkPainter({required this.color, required this.accent});

  final Color color;
  final Color accent;

  static final Path _star = parseSvgPathData(
    'M16 2 L20 12 L30 12 L22 18 L26 28 L16 22 L6 28 L10 18 L2 12 L12 12 Z',
  );

  @override
  void paint(Canvas canvas, Size size) {
    final scale = size.width / 32;
    canvas.save();
    canvas.scale(scale);
    canvas.drawPath(_star, Paint()..color = color);
    canvas.drawCircle(const Offset(16, 17), 3.2, Paint()..color = accent);
    canvas.restore();
  }

  @override
  bool shouldRepaint(_LogoMarkPainter oldDelegate) =>
      color != oldDelegate.color || accent != oldDelegate.accent;
}

/// Wordmark lockup — `tokens.jsx BartalLogo`: mark + برتال/bartal at 0.85×size,
/// weight 700, Cairo (AR) / Poppins (EN). `compact` renders the mark only.
class BartalLogo extends StatelessWidget {
  const BartalLogo({
    super.key,
    this.color = BartalColors.navy,
    this.accent = BartalColors.amber,
    this.size = 28,
    required this.arabic,
    this.compact = false,
  });

  final Color color;
  final Color accent;
  final double size;
  final bool arabic;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final mark = LogoMark(color: color, accent: accent, size: size);
    if (compact) return mark;
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        mark,
        const SizedBox(width: 10),
        Text(
          arabic ? 'برتال' : 'bartal',
          style: TextStyle(
            fontFamily: arabic ? 'Cairo' : 'Poppins',
            fontWeight: FontWeight.w700,
            fontSize: size * 0.85,
            color: color,
            letterSpacing: arabic ? 0 : -0.5,
            height: 1,
          ),
        ),
      ],
    );
  }
}
