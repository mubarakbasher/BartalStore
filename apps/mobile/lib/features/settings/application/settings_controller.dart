import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/providers.dart';

@immutable
class SettingsState {
  const SettingsState({
    required this.locale,
    required this.themeMode,
    required this.onboardingSeen,
  });

  /// AR is the product default (CLAUDE.md §4).
  final Locale locale;
  final ThemeMode themeMode;
  final bool onboardingSeen;

  bool get arabic => locale.languageCode == 'ar';

  SettingsState copyWith({Locale? locale, ThemeMode? themeMode, bool? onboardingSeen}) {
    return SettingsState(
      locale: locale ?? this.locale,
      themeMode: themeMode ?? this.themeMode,
      onboardingSeen: onboardingSeen ?? this.onboardingSeen,
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

  Future<void> completeOnboarding() async {
    state = state.copyWith(onboardingSeen: true);
    await ref.read(appPrefsProvider).setOnboardingSeen();
  }
}

final settingsControllerProvider =
    NotifierProvider<SettingsController, SettingsState>(SettingsController.new);
