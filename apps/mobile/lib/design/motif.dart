import 'package:flutter/material.dart';
import 'package:path_drawing/path_drawing.dart';

import 'tokens.dart';

/// Sudanese geometric motif — port of `tokens.jsx MotifBg` (64px tile:
/// 8-point star + rotated inner square) and the V1Home header tile
/// (`mobile-v1.jsx` "v1hdr", 48px star in amberSoft).
///
/// Per CLAUDE.md §5 the motif is a BACKDROP only: splash, onboarding,
/// order-confirmation, profile hero, tracking hero — never on listing pages.
class MotifTileSpec {
  const MotifTileSpec({
    required this.tileSize,
    required this.pathData,
    required this.strokeWidth,
  });

  final double tileSize;
  final List<String> pathData;
  final double strokeWidth;

  /// tokens.jsx `MotifBg` — 64-unit tile.
  static const standard = MotifTileSpec(
    tileSize: 64,
    pathData: [
      'M32 6 L38 19 L51 13 L45 26 L58 32 L45 38 L51 51 L38 45 L32 58 L26 45 L13 51 L19 38 L6 32 L19 26 L13 13 L26 19 Z',
      'M32 19 L45 32 L32 45 L19 32 Z',
    ],
    strokeWidth: 1,
  );

  /// mobile-v1.jsx `v1hdr` — 48-unit tile used on the home header band.
  static const header = MotifTileSpec(
    tileSize: 48,
    pathData: [
      'M24 4 L29 15 L40 14 L32 22 L37 32 L24 28 L11 32 L16 22 L8 14 L19 15 Z',
    ],
    strokeWidth: 0.8,
  );

  /// tokens.jsx `MotifTile` — 80-unit tile (star + square + corner crosses).
  static const large = MotifTileSpec(
    tileSize: 80,
    pathData: [
      'M40 8 L48 24 L64 16 L56 32 L72 40 L56 48 L64 64 L48 56 L40 72 L32 56 L16 64 L24 48 L8 40 L24 32 L16 16 L32 24 Z',
      'M40 24 L56 40 L40 56 L24 40 Z',
      'M0 0 L8 8 M80 0 L72 8 M0 80 L8 72 M80 80 L72 72',
    ],
    strokeWidth: 1,
  );
}

class MotifPainter extends CustomPainter {
  MotifPainter({
    required this.color,
    required this.opacity,
    this.spec = MotifTileSpec.standard,
  }) : _paths = spec.pathData.map(parseSvgPathData).toList();

  final Color color;
  final double opacity;
  final MotifTileSpec spec;
  final List<Path> _paths;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = spec.strokeWidth
      ..color = color.withValues(alpha: opacity);

    final tile = spec.tileSize;
    final cols = (size.width / tile).ceil();
    final rows = (size.height / tile).ceil();
    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        canvas.save();
        canvas.translate(col * tile, row * tile);
        for (final path in _paths) {
          canvas.drawPath(path, paint);
        }
        canvas.restore();
      }
    }
  }

  @override
  bool shouldRepaint(MotifPainter oldDelegate) =>
      color != oldDelegate.color || opacity != oldDelegate.opacity || spec != oldDelegate.spec;
}

/// Drop-in equivalent of the design's `<MotifBg>` wrapper: tiles the motif
/// behind [child] at low opacity.
class MotifBackground extends StatelessWidget {
  const MotifBackground({
    super.key,
    this.color = BartalColors.navy,
    this.opacity = 0.06,
    this.spec = MotifTileSpec.standard,
    required this.child,
  });

  final Color color;
  final double opacity;
  final MotifTileSpec spec;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: RepaintBoundary(
            child: CustomPaint(
              painter: MotifPainter(color: color, opacity: opacity, spec: spec),
            ),
          ),
        ),
        child,
      ],
    );
  }
}
