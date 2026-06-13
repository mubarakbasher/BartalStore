import 'package:flutter/material.dart';

import '../../../design/icons.dart';
import '../../../design/logo.dart';
import '../../../design/motif.dart';
import '../../../design/tokens.dart';
import '../../../l10n/gen/l10n.dart';

/// Brand splash — port of auth-gaps.jsx::SplashScreen. Navy-ink field with a
/// dense amber motif, a 112px amber logo plate with a white check badge,
/// wordmark + subtitle, and a bottom loader + version line. The router
/// redirects away from /splash once auth bootstrap resolves, so this just
/// renders the brand moment.
class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    return Scaffold(
      backgroundColor: BartalColors.navyInk,
      body: MotifBackground(
        color: BartalColors.amberSoft,
        opacity: 0.3,
        spec: MotifTileSpec.large,
        child: Stack(
          children: [
            Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Stack(
                    clipBehavior: Clip.none,
                    children: [
                      Container(
                        width: 112,
                        height: 112,
                        decoration: BoxDecoration(
                          color: BartalColors.amber,
                          borderRadius: BorderRadius.circular(28),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFFD97706).withValues(alpha: 0.45),
                              blurRadius: 60,
                              offset: const Offset(0, 24),
                            ),
                          ],
                        ),
                        alignment: Alignment.center,
                        child: const LogoMark(
                          color: Colors.white,
                          accent: BartalColors.navyInk,
                          size: 64,
                        ),
                      ),
                      PositionedDirectional(
                        top: -6,
                        end: -6,
                        child: Container(
                          width: 30,
                          height: 30,
                          decoration: const BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(color: Color(0x33000000), blurRadius: 12, offset: Offset(0, 4)),
                            ],
                          ),
                          alignment: Alignment.center,
                          child: const BartalIcon(BartalIcons.check, color: BartalColors.amber, size: 15),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 22),
                  Text(
                    isAr ? 'برتال' : 'bartal',
                    style: TextStyle(
                      fontSize: 54,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                      height: 1,
                      letterSpacing: isAr ? 0 : -1.5,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    l10n.splashSubtitle.toUpperCase(),
                    style: const TextStyle(
                      fontSize: 11,
                      letterSpacing: 3,
                      fontWeight: FontWeight.w600,
                      color: BartalColors.amberSoft,
                    ),
                  ),
                ],
              ),
            ),
            PositionedDirectional(
              start: 0,
              end: 0,
              bottom: 60,
              child: Column(
                children: [
                  Container(
                    width: 44,
                    height: 3,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(2),
                    ),
                    alignment: AlignmentDirectional.centerStart,
                    child: FractionallySizedBox(
                      widthFactor: 0.6,
                      child: Container(
                        decoration: BoxDecoration(
                          color: BartalColors.amber,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    'v0.1.0 · ${l10n.splashInitializing}',
                    style: TextStyle(
                      fontSize: 10,
                      fontFamily: 'JetBrainsMono',
                      color: Colors.white.withValues(alpha: 0.45),
                    ),
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
