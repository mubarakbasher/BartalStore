import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../design/tokens.dart';

/// Striped product placeholder — port of `tokens.jsx ProductPlaceholder`:
/// 45°-rotated stripes (12-unit period, palette[0]/palette[1]) with a
/// centered uppercase JetBrains Mono 10px label in palette[2].
class ProductPlaceholder extends StatelessWidget {
  const ProductPlaceholder({super.key, this.label = '', this.hue = 'warm'});

  final String label;
  final String hue;

  @override
  Widget build(BuildContext context) {
    final palette = placeholderPalettes[hue] ?? placeholderPalettes['warm']!;
    return RepaintBoundary(
      child: CustomPaint(
        painter: _StripePainter(palette: palette),
        child: label.isEmpty
            ? const SizedBox.expand()
            : Center(
                child: Padding(
                  padding: const EdgeInsetsDirectional.all(8),
                  child: Text(
                    label.toUpperCase(),
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontFamily: 'JetBrainsMono',
                      fontSize: 10,
                      fontWeight: FontWeight.w500,
                      letterSpacing: 1,
                      color: palette[2],
                    ),
                  ),
                ),
              ),
      ),
    );
  }
}

class _StripePainter extends CustomPainter {
  _StripePainter({required this.palette});

  final List<Color> palette;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawRect(Offset.zero & size, Paint()..color = palette[0]);
    canvas.save();
    canvas.clipRect(Offset.zero & size);
    // Rotate 45° around the center, then paint alternating 6-unit stripes
    // wide enough to cover the rotated bounds.
    final diagonal = math.sqrt(size.width * size.width + size.height * size.height);
    canvas.translate(size.width / 2, size.height / 2);
    canvas.rotate(math.pi / 4);
    final stripePaint = Paint()..color = palette[1];
    for (var x = -diagonal; x < diagonal; x += 12) {
      canvas.drawRect(
        Rect.fromLTWH(x + 6, -diagonal, 6, diagonal * 2),
        stripePaint,
      );
    }
    canvas.restore();
  }

  @override
  bool shouldRepaint(_StripePainter oldDelegate) => palette != oldDelegate.palette;
}
