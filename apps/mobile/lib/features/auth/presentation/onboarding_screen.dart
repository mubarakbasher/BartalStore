import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../design/icons.dart';
import '../../../design/logo.dart';
import '../../../design/motif.dart';
import '../../../design/theme.dart';
import '../../../design/tokens.dart';
import '../../../l10n/gen/l10n.dart';
import '../../settings/application/settings_controller.dart';

/// 3-slide value-prop carousel — port of auth-gaps.jsx::OnboardingScreen.
/// Each slide has a tall motif hero (navy / amber / green), an eyebrow,
/// title, body, animated dots, and a Next / Start CTA. Skip and the final
/// CTA both mark onboarding complete and move to /welcome.
class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

enum _Illo { shop, pay, track }

class _Slide {
  const _Slide(this.eyebrow, this.title, this.body, this.illo, this.heroColor);
  final String eyebrow;
  final String title;
  final String body;
  final _Illo illo;
  final Color heroColor;
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final _controller = PageController();
  int _index = 0;

  static const _green = Color(0xFF0F7A3F);

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _finish() async {
    await ref.read(settingsControllerProvider.notifier).completeOnboarding();
    if (mounted) context.go('/welcome');
  }

  void _next(int total) {
    if (_index >= total - 1) {
      _finish();
    } else {
      _controller.nextPage(
        duration: const Duration(milliseconds: 280),
        curve: Curves.easeOut,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';

    final slides = [
      _Slide(l10n.onboarding1Eyebrow, l10n.onboarding1Title, l10n.onboarding1Body,
          _Illo.shop, BartalColors.navyInk),
      _Slide(l10n.onboarding2Eyebrow, l10n.onboarding2Title, l10n.onboarding2Body,
          _Illo.pay, BartalColors.amber),
      _Slide(l10n.onboarding3Eyebrow, l10n.onboarding3Title, l10n.onboarding3Body,
          _Illo.track, _green),
    ];
    final isLast = _index == slides.length - 1;

    return Scaffold(
      backgroundColor: bartal.bg,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsetsDirectional.fromSTEB(22, 16, 22, 0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const LogoMark(color: BartalColors.amber, accent: BartalColors.navyInk, size: 22),
                      const SizedBox(width: 8),
                      Text(
                        isAr ? 'برتال' : 'bartal',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: bartal.text),
                      ),
                    ],
                  ),
                  TextButton(
                    onPressed: _finish,
                    child: Text(
                      l10n.onboardingSkip,
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: bartal.textMute),
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: PageView.builder(
                controller: _controller,
                onPageChanged: (i) => setState(() => _index = i),
                itemCount: slides.length,
                itemBuilder: (context, i) => _SlideView(slide: slides[i]),
              ),
            ),
            Padding(
              padding: const EdgeInsetsDirectional.fromSTEB(26, 22, 26, 34),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    children: [
                      for (var i = 0; i < slides.length; i++) ...[
                        if (i > 0) const SizedBox(width: 8),
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 180),
                          height: 5,
                          width: i == _index ? 28 : 8,
                          decoration: BoxDecoration(
                            color: i == _index ? bartal.amber : bartal.line,
                            borderRadius: BorderRadius.circular(3),
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 18),
                  _OnboardingCta(
                    label: isLast ? l10n.onboardingStart : l10n.commonNext,
                    onPressed: () => _next(slides.length),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OnboardingCta extends StatelessWidget {
  const _OnboardingCta({required this.label, required this.onPressed});

  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: BartalColors.amber,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          height: 52,
          alignment: Alignment.center,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                label,
                style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w700),
              ),
              const SizedBox(width: 8),
              const BartalIcon(BartalIcons.arrow, color: Colors.white, size: 16),
            ],
          ),
        ),
      ),
    );
  }
}

class _SlideView extends StatelessWidget {
  const _SlideView({required this.slide});

  final _Slide slide;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 360,
            margin: const EdgeInsetsDirectional.fromSTEB(22, 8, 22, 0),
            decoration: BoxDecoration(
              color: slide.heroColor,
              borderRadius: BorderRadius.circular(24),
            ),
            clipBehavior: Clip.antiAlias,
            child: MotifBackground(
              color: slide.illo == _Illo.pay ? Colors.white : BartalColors.amberSoft,
              opacity: slide.illo == _Illo.pay ? 0.3 : 0.22,
              child: _OnboardingIllustration(illo: slide.illo),
            ),
          ),
          Padding(
            padding: const EdgeInsetsDirectional.fromSTEB(26, 28, 26, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  slide.eyebrow.toUpperCase(),
                  style: TextStyle(
                    fontSize: 11,
                    letterSpacing: 2,
                    fontWeight: FontWeight.w700,
                    color: bartal.amber,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  slide.title,
                  style: TextStyle(
                    fontSize: 24,
                    height: 1.25,
                    fontWeight: FontWeight.w700,
                    color: bartal.text,
                  ),
                ),
                const SizedBox(height: 12),
                ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 320),
                  child: Text(
                    slide.body,
                    style: TextStyle(fontSize: 14, height: 1.55, color: bartal.textMute),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Per-slide hero illustration. Faithful to the design's compositions
/// (perspective product grid, receipt mock, glass tracking timeline).
class _OnboardingIllustration extends StatelessWidget {
  const _OnboardingIllustration({required this.illo});

  final _Illo illo;

  static const _green = Color(0xFF0F7A3F);

  @override
  Widget build(BuildContext context) {
    return switch (illo) {
      _Illo.shop => _shop(),
      _Illo.pay => _pay(context),
      _Illo.track => _track(context),
    };
  }

  Widget _shop() {
    const tiles = [
      (Color(0xFFD4860B), '🌹'),
      (Color(0xFFD4A574), '📱'),
      (Color(0xFFF2B544), '👗'),
      (Color(0xFF8B3A3A), '👜'),
      (Color(0xFF0F7A3F), '🕌'),
      (Color(0xFFD4860B), '🏺'),
    ];
    return Center(
      child: FractionallySizedBox(
        widthFactor: 0.8,
        child: Transform(
          alignment: Alignment.center,
          transform: Matrix4.identity()
            ..setEntry(3, 2, 0.001)
            ..rotateX(0.2),
          child: GridView.count(
            crossAxisCount: 3,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 14,
            crossAxisSpacing: 14,
            children: [
              for (final (color, emoji) in tiles)
                Container(
                  decoration: BoxDecoration(
                    color: color,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: const [
                      BoxShadow(color: Color(0x4D000000), blurRadius: 24, offset: Offset(0, 8)),
                    ],
                  ),
                  alignment: Alignment.center,
                  child: Text(emoji, style: const TextStyle(fontSize: 30)),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _pay(BuildContext context) {
    return Center(
      child: Transform.rotate(
        angle: -0.07,
        child: Container(
          width: 200,
          padding: const EdgeInsetsDirectional.symmetric(horizontal: 16, vertical: 18),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
            boxShadow: const [
              BoxShadow(color: Color(0x40000000), blurRadius: 50, offset: Offset(0, 20)),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'FAROO BANK · إيصال',
                style: TextStyle(fontFamily: 'JetBrainsMono', fontSize: 10, color: BartalColors.textMute),
              ),
              const Divider(height: 14, color: BartalColors.line),
              _receiptRow('AMOUNT', 'SDG 8,500', bold: true),
              _receiptRow('REF', 'BRT-001847'),
              _receiptRow('DATE', '19/04/26'),
              const Divider(height: 16, color: BartalColors.line),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  BartalIcon(BartalIcons.check, color: _green, size: 12),
                  SizedBox(width: 6),
                  Text(
                    'VERIFIED',
                    style: TextStyle(
                      fontFamily: 'JetBrainsMono',
                      fontSize: 10,
                      color: _green,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _receiptRow(String label, String value, {bool bold = false}) {
    return Padding(
      padding: const EdgeInsetsDirectional.only(bottom: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: const TextStyle(fontFamily: 'JetBrainsMono', fontSize: 9, color: BartalColors.text)),
          Text(value,
              style: TextStyle(
                fontFamily: 'JetBrainsMono',
                fontSize: 9,
                color: BartalColors.text,
                fontWeight: bold ? FontWeight.w700 : FontWeight.w400,
              )),
        ],
      ),
    );
  }

  Widget _track(BuildContext context) {
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final steps = [
      (isAr ? 'تأكيد الطلب' : 'Order placed', true, false),
      (isAr ? 'الإيصال موثق' : 'Receipt verified', true, false),
      (isAr ? 'جاري التجهيز' : 'Preparing', true, true),
      (isAr ? 'في الطريق' : 'Out for delivery', false, false),
      (isAr ? 'تم التسليم' : 'Delivered', false, false),
    ];
    return Center(
      child: Container(
        constraints: const BoxConstraints(maxWidth: 260),
        margin: const EdgeInsetsDirectional.symmetric(horizontal: 32),
        padding: const EdgeInsetsDirectional.all(18),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withValues(alpha: 0.25)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            for (var i = 0; i < steps.length; i++)
              _trackStep(steps[i].$1, steps[i].$2, steps[i].$3, i < steps.length - 1, isAr),
          ],
        ),
      ),
    );
  }

  Widget _trackStep(String label, bool on, bool now, bool hasNext, bool isAr) {
    return Padding(
      padding: EdgeInsetsDirectional.only(bottom: hasNext ? 10 : 0),
      child: Row(
        children: [
          SizedBox(
            width: 18,
            child: Column(
              children: [
                Container(
                  width: 18,
                  height: 18,
                  decoration: BoxDecoration(
                    color: on ? Colors.white : Colors.transparent,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: on ? Colors.white : Colors.white.withValues(alpha: 0.5),
                      width: 2,
                    ),
                    boxShadow: now
                        ? [BoxShadow(color: Colors.white.withValues(alpha: 0.3), spreadRadius: 4)]
                        : null,
                  ),
                  alignment: Alignment.center,
                  child: on && !now
                      ? const BartalIcon(BartalIcons.check, color: _green, size: 10)
                      : (now
                          ? Container(
                              width: 6,
                              height: 6,
                              decoration: const BoxDecoration(color: _green, shape: BoxShape.circle),
                            )
                          : null),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              label,
              style: TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: now ? FontWeight.w700 : FontWeight.w500,
              ),
            ),
          ),
          if (now)
            Container(
              padding: const EdgeInsetsDirectional.symmetric(horizontal: 7, vertical: 2),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(10)),
              child: Text(
                isAr ? 'الآن' : 'NOW',
                style: const TextStyle(fontSize: 9, color: _green, fontWeight: FontWeight.w700),
              ),
            ),
        ],
      ),
    );
  }
}
