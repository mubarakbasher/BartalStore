import 'package:flutter/material.dart';
import 'package:path_drawing/path_drawing.dart';

/// Stroke icon set — 1:1 port of the SVG icons in `mobile-v1.jsx`
/// (24-unit viewBox, stroke width 1.8 unless the source says otherwise).
/// One icon family, one stroke language — do not mix in Material icons
/// on customer-facing surfaces.
@immutable
class BartalIconSpec {
  const BartalIconSpec({
    required this.paths,
    this.strokeWidth = 1.8,
    this.filled = false,
    this.flipInRtl = false,
    this.defaultSize = 22,
  });

  /// SVG path-data strings (24-unit viewBox).
  final List<String> paths;
  final double strokeWidth;

  /// Filled (StarIcon) instead of stroked.
  final bool filled;

  /// Directional icons (back/arrow) mirror under RTL, like the design's
  /// `scaleX(-1)`.
  final bool flipInRtl;
  final double defaultSize;
}

abstract final class BartalIcons {
  static const home = BartalIconSpec(paths: [
    'M3 12l9-8 9 8v8a2 2 0 01-2 2h-4v-6h-6v6H5a2 2 0 01-2-2v-8z',
  ]);
  static const grid = BartalIconSpec(paths: [
    'M4.5 3h4A1.5 1.5 0 0110 4.5v4A1.5 1.5 0 018.5 10h-4A1.5 1.5 0 013 8.5v-4A1.5 1.5 0 014.5 3z',
    'M15.5 3h4A1.5 1.5 0 0121 4.5v4a1.5 1.5 0 01-1.5 1.5h-4A1.5 1.5 0 0114 8.5v-4A1.5 1.5 0 0115.5 3z',
    'M4.5 14h4A1.5 1.5 0 0110 15.5v4A1.5 1.5 0 018.5 21h-4A1.5 1.5 0 013 19.5v-4A1.5 1.5 0 014.5 14z',
    'M15.5 14h4a1.5 1.5 0 011.5 1.5v4a1.5 1.5 0 01-1.5 1.5h-4a1.5 1.5 0 01-1.5-1.5v-4a1.5 1.5 0 011.5-1.5z',
  ]);
  static const bag = BartalIconSpec(paths: [
    'M5 8h14l-1 12H6L5 8z',
    'M9 8V6a3 3 0 016 0v2',
  ]);
  static const package = BartalIconSpec(paths: [
    'M3 7l9-4 9 4v10l-9 4-9-4V7z',
    'M3 7l9 4 9-4M12 11v10',
  ]);
  static const user = BartalIconSpec(paths: [
    'M16 8a4 4 0 11-8 0 4 4 0 018 0z',
    'M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8',
  ]);
  static const search = BartalIconSpec(defaultSize: 18, paths: [
    'M18 11a7 7 0 11-14 0 7 7 0 0114 0z',
    'M21 21l-4.3-4.3',
  ]);
  static const pin = BartalIconSpec(defaultSize: 14, paths: [
    'M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z',
    'M14.5 9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
  ]);
  static const star = BartalIconSpec(filled: true, defaultSize: 14, paths: [
    'M12 2l3.1 6.3 7 1-5 4.9 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5-4.9 7-1L12 2z',
  ]);
  static const truck = BartalIconSpec(defaultSize: 16, paths: [
    'M2 7a1 1 0 011-1h12a1 1 0 011 1v9a1 1 0 01-1 1H3a1 1 0 01-1-1V7z',
    'M15 10h4l3 4v3h-7v-7z',
    'M8 18a2 2 0 11-4 0 2 2 0 014 0z',
    'M20 18a2 2 0 11-4 0 2 2 0 014 0z',
  ]);
  static const heart = BartalIconSpec(defaultSize: 18, paths: [
    'M12 21s-7-4.5-9-10a5 5 0 019-3 5 5 0 019 3c-2 5.5-9 10-9 10z',
  ]);
  static const share = BartalIconSpec(defaultSize: 18, paths: [
    'M21 5a3 3 0 11-6 0 3 3 0 016 0z',
    'M9 12a3 3 0 11-6 0 3 3 0 016 0z',
    'M21 19a3 3 0 11-6 0 3 3 0 016 0z',
    'M8.6 10.6l6.8-4.2M8.6 13.4l6.8 4.2',
  ]);
  static const back = BartalIconSpec(
    strokeWidth: 2.2,
    flipInRtl: true,
    defaultSize: 18,
    paths: ['M15 6l-6 6 6 6'],
  );
  static const arrow = BartalIconSpec(
    strokeWidth: 2.2,
    flipInRtl: true,
    defaultSize: 16,
    paths: ['M5 12h14M13 6l6 6-6 6'],
  );
  static const bell = BartalIconSpec(defaultSize: 20, paths: [
    'M18 16H6l1.5-2V10a4.5 4.5 0 019 0v4l1.5 2z',
    'M10 19a2 2 0 004 0',
  ]);
  static const check = BartalIconSpec(strokeWidth: 2.6, defaultSize: 14, paths: [
    'M5 13l4 4L19 7',
  ]);
  static const camera = BartalIconSpec(defaultSize: 20, paths: [
    'M3 8h3l2-3h8l2 3h3v12H3V8z',
    'M16 13a4 4 0 11-8 0 4 4 0 018 0z',
  ]);
}

class BartalIcon extends StatelessWidget {
  const BartalIcon(this.spec, {super.key, required this.color, this.size});

  final BartalIconSpec spec;
  final Color color;
  final double? size;

  @override
  Widget build(BuildContext context) {
    final dimension = size ?? spec.defaultSize;
    final rtl = Directionality.of(context) == TextDirection.rtl;
    Widget icon = CustomPaint(
      size: Size.square(dimension),
      painter: _IconPainter(spec: spec, color: color),
    );
    if (spec.flipInRtl && rtl) {
      icon = Transform.flip(flipX: true, child: icon);
    }
    return icon;
  }
}

class _IconPainter extends CustomPainter {
  _IconPainter({required this.spec, required this.color});

  final BartalIconSpec spec;
  final Color color;

  static final Map<BartalIconSpec, List<Path>> _cache = {};

  @override
  void paint(Canvas canvas, Size size) {
    final paths = _cache.putIfAbsent(
      spec,
      () => spec.paths.map(parseSvgPathData).toList(),
    );
    final paint = Paint()..color = color;
    if (spec.filled) {
      paint.style = PaintingStyle.fill;
    } else {
      paint
        ..style = PaintingStyle.stroke
        ..strokeWidth = spec.strokeWidth
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round;
    }
    final scale = size.width / 24;
    canvas.save();
    canvas.scale(scale);
    for (final path in paths) {
      canvas.drawPath(path, paint);
    }
    canvas.restore();
  }

  @override
  bool shouldRepaint(_IconPainter oldDelegate) =>
      spec != oldDelegate.spec || color != oldDelegate.color;
}
