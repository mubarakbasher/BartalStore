import 'package:flutter/material.dart';

import '../design/theme.dart';
import '../design/tokens.dart';

/// Shimmer bar — port of the design's skeleton `Bar` (1.6s ease-in-out
/// gradient sweep between shimmer/shimmerLight).
class SkeletonBar extends StatelessWidget {
  const SkeletonBar({
    super.key,
    this.width = double.infinity,
    this.height = 12,
    this.radius = 6,
  });

  final double width;
  final double height;
  final double radius;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    final shimmer = bartal.isDark ? BartalColors.dRaised : const Color(0xFFECE6D8);
    final shimmerLight = bartal.isDark ? const Color(0xFF2A4872) : const Color(0xFFF5F0E4);
    return _Shimmer(
      base: shimmer,
      highlight: shimmerLight,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: shimmer,
          borderRadius: BorderRadius.circular(radius),
        ),
      ),
    );
  }
}

class _Shimmer extends StatefulWidget {
  const _Shimmer({required this.base, required this.highlight, required this.child});

  final Color base;
  final Color highlight;
  final Widget child;

  @override
  State<_Shimmer> createState() => _ShimmerState();
}

class _ShimmerState extends State<_Shimmer> with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1600),
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Respect reduced motion: keep skeletons static when animations are off.
    final reduceMotion = MediaQuery.maybeOf(context)?.disableAnimations ?? false;
    if (reduceMotion) {
      _controller.stop();
    } else if (!_controller.isAnimating) {
      _controller.repeat();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        final t = _controller.value;
        // AlignmentDirectional gradients need the ambient TextDirection to
        // resolve start/end; without it createShader throws during paint.
        final textDirection = Directionality.of(context);
        return ShaderMask(
          blendMode: BlendMode.srcATop,
          shaderCallback: (bounds) {
            return LinearGradient(
              begin: AlignmentDirectional.centerStart,
              end: AlignmentDirectional.centerEnd,
              colors: [widget.base, widget.highlight, widget.base],
              stops: const [0.25, 0.5, 0.75],
              transform: _SlideGradientTransform(percent: (t * 4) - 2),
            ).createShader(bounds, textDirection: textDirection);
          },
          child: child,
        );
      },
      child: widget.child,
    );
  }
}

class _SlideGradientTransform extends GradientTransform {
  const _SlideGradientTransform({required this.percent});

  final double percent;

  @override
  Matrix4? transform(Rect bounds, {TextDirection? textDirection}) =>
      Matrix4.translationValues(bounds.width * percent, 0, 0);
}

/// Home skeleton — search bar, category chips, hero, heading, 2-col grid
/// (per `system-kit.jsx MobileSkeletonScreen kind='home'`).
class HomeSkeleton extends StatelessWidget {
  const HomeSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      physics: const NeverScrollableScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsetsDirectional.fromSTEB(18, 14, 18, 10),
            child: SkeletonBar(height: 42, radius: 12),
          ),
          Padding(
            padding: const EdgeInsetsDirectional.fromSTEB(18, 6, 18, 14),
            child: Row(
              children: [
                for (final w in const [64.0, 78.0, 58.0, 90.0])
                  Padding(
                    padding: const EdgeInsetsDirectional.only(end: 8),
                    child: SkeletonBar(width: w, height: 32, radius: 16),
                  ),
              ],
            ),
          ),
          const Padding(
            padding: EdgeInsetsDirectional.fromSTEB(18, 0, 18, 14),
            child: SkeletonBar(height: 140, radius: 14),
          ),
          const Padding(
            padding: EdgeInsetsDirectional.fromSTEB(18, 4, 18, 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                SkeletonBar(width: 110, height: 18),
                SkeletonBar(width: 48),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsetsDirectional.symmetric(horizontal: 18),
            child: GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 0.8,
              children: [
                for (var i = 0; i < 4; i++)
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(child: SkeletonBar(height: 130, radius: 10)),
                      SizedBox(height: 6),
                      SkeletonBar(width: 110, height: 10),
                      SizedBox(height: 6),
                      SkeletonBar(width: 70, height: 10),
                      SizedBox(height: 6),
                      SkeletonBar(width: 56, height: 14),
                    ],
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Product-detail skeleton (`kind='pdp'`).
class DetailSkeleton extends StatelessWidget {
  const DetailSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      physics: const NeverScrollableScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsetsDirectional.fromSTEB(18, 14, 18, 14),
            child: SkeletonBar(width: 36, height: 36, radius: 18),
          ),
          const Padding(
            padding: EdgeInsetsDirectional.fromSTEB(18, 0, 18, 14),
            child: SkeletonBar(height: 280, radius: 14),
          ),
          Padding(
            padding: const EdgeInsetsDirectional.fromSTEB(18, 0, 18, 16),
            child: Row(
              children: [
                for (var i = 0; i < 4; i++)
                  const Padding(
                    padding: EdgeInsetsDirectional.only(end: 8),
                    child: SkeletonBar(width: 56, height: 56, radius: 8),
                  ),
              ],
            ),
          ),
          const Padding(
            padding: EdgeInsetsDirectional.symmetric(horizontal: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SkeletonBar(width: 160),
                SizedBox(height: 10),
                SkeletonBar(width: 280, height: 22),
                SizedBox(height: 10),
                SkeletonBar(width: 200, height: 22),
                SizedBox(height: 10),
                SkeletonBar(width: 110, height: 28),
                SizedBox(height: 18),
                SkeletonBar(),
                SizedBox(height: 10),
                SkeletonBar(width: 300),
                SizedBox(height: 10),
                SkeletonBar(width: 220),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// List skeleton for search results / category products (2-col grid only).
class ListSkeleton extends StatelessWidget {
  const ListSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      physics: const NeverScrollableScrollPhysics(),
      padding: const EdgeInsetsDirectional.all(16),
      mainAxisSpacing: 10,
      crossAxisSpacing: 10,
      childAspectRatio: 0.72,
      children: [
        for (var i = 0; i < 6; i++)
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(child: SkeletonBar(radius: 10)),
              SizedBox(height: 6),
              SkeletonBar(width: 110, height: 10),
              SizedBox(height: 6),
              SkeletonBar(width: 56, height: 14),
            ],
          ),
      ],
    );
  }
}
