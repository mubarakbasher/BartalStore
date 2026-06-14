import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/providers.dart';

/// Local notification preferences (persisted; consumed by Slice 6b's FCM
/// topic subscriptions). Defaults mirror the design's initial toggle states.
enum NotifPref {
  orderUpdates('notif_order_updates', true),
  whatsappAlerts('notif_whatsapp', true),
  offers('notif_offers', false),
  recommendations('notif_recommendations', false);

  const NotifPref(this.key, this.defaultOn);
  final String key;
  final bool defaultOn;
}

@immutable
class SettingsState {
  const SettingsState({
    required this.locale,
    required this.themeMode,
    required this.onboardingSeen,
    required this.notifPrefs,
  });

  /// AR is the product default (CLAUDE.md §4).
  final Locale locale;
  final ThemeMode themeMode;
  final bool onboardingSeen;
  final Map<NotifPref, bool> notifPrefs;

  bool get arabic => locale.languageCode == 'ar';
  bool notif(NotifPref p) => notifPrefs[p] ?? p.defaultOn;

  SettingsState copyWith({
    Locale? locale,
    ThemeMode? themeMode,
    bool? onboardingSeen,
    Map<NotifPref, bool>? notifPrefs,
  }) {
    return SettingsState(
      locale: locale ?? this.locale,
      themeMode: themeMode ?? this.themeMode,
      onboardingSeen: onboardingSeen ?? this.onboardingSeen,
      notifPrefs: notifPrefs ?? this.notifPrefs,
    );
  }
}

class SettingsController extends Notifier<SettingsState> {
  @override
  SettingsState build() {
    final prefs = ref.watch(appPrefsProvider);
    return SettingsState(
      locale: prefs.locale,
      themeMode: prefs.themeMode,
      onboardingSeen: prefs.onboardingSeen,
      notifPrefs: {
        for (final p in NotifPref.values) p: prefs.getBool(p.key, defaultValue: p.defaultOn),
      },
    );
  }

  Future<void> setLocale(Locale locale) async {
    state = state.copyWith(locale: locale);
    await ref.read(appPrefsProvider).setLocale(locale);
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    state = state.copyWith(themeMode: mode);
    await ref.read(appPrefsProvider).setThemeMode(mode);
  }

  Future<void> setNotifPref(NotifPref pref, bool value) async {
    state = state.copyWith(notifPrefs: {...state.notifPrefs, pref: value});
    await ref.read(appPrefsProvider).setBool(pref.key, value);
  }

  Future<void> completeOnboarding() async {
    state = state.copyWith(onboardingSeen: true);
    await ref.read(appPrefsProvider).setOnboardingSeen();
  }
}

final settingsControllerProvider =
    NotifierProvider<SettingsController, SettingsState>(SettingsController.new);
