import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../design/logo.dart';
import '../../../design/motif.dart';
import '../../../design/theme.dart';
import '../../../design/tokens.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/app_button.dart';

/// First-run entry — port of auth-screens.jsx::WelcomeScreen. Navy-ink motif
/// hero (~55%) with the brand lockup, then a bottom CTA panel: amber
/// "Create account" + outline "Sign in", plus a terms footer. Preserves the
/// optional `from` deep-link target so the post-auth flow can resume.
class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key, this.from});

  final String? from;

  String _withFrom(String path) {
    if (from == null || from!.isEmpty) return path;
    return Uri(path: path, queryParameters: {'from': from}).toString();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';

    return Scaffold(
      backgroundColor: bartal.bg,
      body: Column(
        children: [
          Expanded(
            flex: 55,
            child: Container(
              width: double.infinity,
              color: BartalColors.navyInk,
              child: MotifBackground(
                color: BartalColors.amberSoft,
                opacity: 0.25,
                spec: MotifTileSpec.large,
                child: Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const LogoMark(color: Colors.white, size: 68),
                      const SizedBox(height: 14),
                      Text(
                        isAr ? 'برتال' : 'bartal',
                        style: TextStyle(
                          fontSize: 42,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                          letterSpacing: isAr ? 0 : -1,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        l10n.welcomeBrandTagline.toUpperCase(),
                        style: const TextStyle(
                          fontSize: 12,
                          letterSpacing: 2,
                          fontWeight: FontWeight.w600,
                          color: BartalColors.amberSoft,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            flex: 45,
            child: SafeArea(
              top: false,
              child: Padding(
                padding: const EdgeInsetsDirectional.fromSTEB(24, 28, 24, 36),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          l10n.welcomeTitle,
                          style: TextStyle(
                            fontSize: 22,
                            height: 1.25,
                            fontWeight: FontWeight.w700,
                            color: bartal.text,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          l10n.welcomeBody,
                          style: TextStyle(fontSize: 13, height: 1.6, color: bartal.textMute),
                        ),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        AppButton(
                          label: l10n.welcomeCreateAccount,
                          expand: true,
                          size: AppButtonSize.large,
                          onPressed: () => context.push(_withFrom('/signup')),
                        ),
                        const SizedBox(height: 10),
                        AppButton(
                          label: l10n.welcomeSignIn,
                          variant: AppButtonVariant.outline,
                          expand: true,
                          size: AppButtonSize.large,
                          onPressed: () => context.push(_withFrom('/login')),
                        ),
                        const SizedBox(height: 12),
                        Center(
                          child: Text.rich(
                            TextSpan(
                              text: l10n.welcomeTermsPrefix,
                              style: TextStyle(fontSize: 11, color: bartal.textMute),
                              children: [
                                TextSpan(
                                  text: l10n.welcomeTermsLink,
                                  style: TextStyle(
                                    color: bartal.amber,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
