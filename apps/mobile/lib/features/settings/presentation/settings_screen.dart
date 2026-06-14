import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/screen_header.dart';
import '../application/settings_controller.dart';

/// Settings — port of profile-flow.jsx::SettingsScreen (full fidelity). Language
/// + dark-mode are live; the 4 notification toggles persist locally (consumed by
/// Slice 6b's FCM). Rows the backend can't support (active sessions, my-data,
/// sign-out-all, text size, currency/numerals) render as inert placeholders.
class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final settings = ref.watch(settingsControllerProvider);
    final notifier = ref.read(settingsControllerProvider.notifier);
    final isAr = settings.arabic;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: bartal.bg,
      body: Column(
        children: [
          ScreenHeader(title: l10n.navSettings),
          Expanded(
            child: ListView(
              padding: const EdgeInsetsDirectional.only(bottom: 24),
              children: [
                _Section(title: l10n.settingsSectionLanguage, children: [
                  _Row(
                    title: l10n.settingsLanguage,
                    sub: isAr ? l10n.settingsLanguageArabic : l10n.settingsLanguageEnglish,
                    trailing: const _Chevron(),
                    onTap: () => _pickLanguage(context, ref, isAr),
                  ),
                  _Row(title: l10n.settingsCurrency, sub: l10n.settingsCurrencyValue, inert: true),
                  _Row(
                    title: l10n.settingsNumerals,
                    sub: isAr ? l10n.settingsNumeralsArabic : l10n.settingsNumeralsWestern,
                    inert: true,
                    last: true,
                  ),
                ]),
                _Section(title: l10n.settingsSectionAppearance, children: [
                  _Row(
                    title: l10n.settingsDarkMode,
                    sub: isDark ? l10n.settingsOn : l10n.settingsOff,
                    trailing: _Toggle(
                      on: isDark,
                      onChanged: (v) => notifier.setThemeMode(v ? ThemeMode.dark : ThemeMode.light),
                    ),
                  ),
                  _Row(title: l10n.settingsTextSize, sub: l10n.settingsTextSizeValue, inert: true, last: true),
                ]),
                _Section(title: l10n.settingsSectionNotifications, children: [
                  _Row(
                    title: l10n.settingsNotifOrders,
                    sub: l10n.settingsNotifOrdersSub,
                    trailing: _Toggle(
                      on: settings.notif(NotifPref.orderUpdates),
                      onChanged: (v) => notifier.setNotifPref(NotifPref.orderUpdates, v),
                    ),
                  ),
                  _Row(
                    title: l10n.settingsNotifWhatsapp,
                    sub: l10n.settingsNotifWhatsappSub,
                    trailing: _Toggle(
                      on: settings.notif(NotifPref.whatsappAlerts),
                      onChanged: (v) => notifier.setNotifPref(NotifPref.whatsappAlerts, v),
                    ),
                  ),
                  _Row(
                    title: l10n.settingsNotifOffers,
                    sub: l10n.settingsNotifOffersSub,
                    trailing: _Toggle(
                      on: settings.notif(NotifPref.offers),
                      onChanged: (v) => notifier.setNotifPref(NotifPref.offers, v),
                    ),
                  ),
                  _Row(
                    title: l10n.settingsNotifRecommendations,
                    trailing: _Toggle(
                      on: settings.notif(NotifPref.recommendations),
                      onChanged: (v) => notifier.setNotifPref(NotifPref.recommendations, v),
                    ),
                    last: true,
                  ),
                ]),
                _Section(title: l10n.settingsSectionPrivacy, children: [
                  _Row(title: l10n.settingsMyData, sub: l10n.settingsMyDataSub, inert: true),
                  _Row(title: l10n.settingsActiveSessions, inert: true),
                  _Row(title: l10n.settingsSignOutAll, inert: true, last: true),
                ]),
                _Section(title: l10n.settingsSectionAbout, children: [
                  _Row(title: l10n.settingsVersion, sub: '0.1.0 · build 1', inert: true),
                  _Row(title: l10n.settingsTerms, trailing: const _Chevron(), inert: true),
                  _Row(title: l10n.settingsPrivacyPolicy, trailing: const _Chevron(), inert: true, last: true),
                ]),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _pickLanguage(BuildContext context, WidgetRef ref, bool isAr) async {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    await showModalBottomSheet<void>(
      context: context,
      backgroundColor: bartal.surface,
      builder: (sheetContext) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            for (final opt in [('ar', l10n.settingsLanguageArabic), ('en', l10n.settingsLanguageEnglish)])
              ListTile(
                title: Text(opt.$2),
                trailing: (isAr ? 'ar' : 'en') == opt.$1
                    ? Icon(Icons.check_rounded, color: bartal.amber)
                    : null,
                onTap: () {
                  ref.read(settingsControllerProvider.notifier).setLocale(Locale(opt.$1));
                  Navigator.of(sheetContext).pop();
                },
              ),
          ],
        ),
      ),
    );
  }
}

class _Section extends StatelessWidget {
  const _Section({required this.title, required this.children});

  final String title;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Padding(
      padding: const EdgeInsetsDirectional.fromSTEB(16, 8, 16, 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsetsDirectional.only(bottom: 8, top: 4),
            child: Text(title, style: context.bartalType.micro),
          ),
          Container(
            decoration: BoxDecoration(
              color: bartal.surface,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: bartal.line),
            ),
            child: Column(children: children),
          ),
        ],
      ),
    );
  }
}

class _Row extends StatelessWidget {
  const _Row({
    required this.title,
    this.sub,
    this.trailing,
    this.onTap,
    this.inert = false,
    this.last = false,
  });

  final String title;
  final String? sub;
  final Widget? trailing;
  final VoidCallback? onTap;
  final bool inert;
  final bool last;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final body = Opacity(
      opacity: inert ? 0.5 : 1,
      child: Container(
        padding: const EdgeInsetsDirectional.symmetric(horizontal: 14, vertical: 14),
        decoration: BoxDecoration(
          border: last ? null : Border(bottom: BorderSide(color: bartal.line)),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: context.bartalType.label.copyWith(fontWeight: FontWeight.w600)),
                  if (sub != null) ...[
                    const SizedBox(height: 2),
                    Text(sub!, style: context.bartalType.small),
                  ],
                ],
              ),
            ),
            if (inert)
              Container(
                padding: const EdgeInsetsDirectional.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: bartal.isDark ? bartal.raised : bartal.bg,
                  borderRadius: BorderRadius.circular(100),
                ),
                child: Text(l10n.settingsComingSoon, style: context.bartalType.micro),
              )
            else
              ?trailing,
          ],
        ),
      ),
    );
    if (inert || onTap == null) return body;
    return InkWell(onTap: onTap, child: body);
  }
}

class _Chevron extends StatelessWidget {
  const _Chevron();

  @override
  Widget build(BuildContext context) {
    final isAr = Directionality.of(context) == TextDirection.rtl;
    return Icon(isAr ? Icons.chevron_left_rounded : Icons.chevron_right_rounded,
        color: context.bartal.textMute, size: 22);
  }
}

class _Toggle extends StatelessWidget {
  const _Toggle({required this.on, required this.onChanged});

  final bool on;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return GestureDetector(
      onTap: () => onChanged(!on),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        width: 44,
        height: 26,
        padding: const EdgeInsetsDirectional.all(3),
        decoration: BoxDecoration(
          color: on ? bartal.amber : bartal.line,
          borderRadius: BorderRadius.circular(100),
        ),
        child: Align(
          alignment: on ? AlignmentDirectional.centerEnd : AlignmentDirectional.centerStart,
          child: Container(
            width: 20,
            height: 20,
            decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
          ),
        ),
      ),
    );
  }
}
