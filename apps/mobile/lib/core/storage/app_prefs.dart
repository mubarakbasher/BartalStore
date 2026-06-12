import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Non-sensitive persisted settings (locale, theme, onboarding flag) plus
/// small JSON blobs (guest cart, notifications inbox in later slices).
class AppPrefs {
  AppPrefs(this._prefs);

  static const _localeKey = 'bartal_locale';
  static const _themeKey = 'bartal_theme';
  static const _onboardingKey = 'bartal_onboarding_seen';

  final SharedPreferences _prefs;

  static Future<AppPrefs> load() async => AppPrefs(await SharedPreferences.getInstance());

  /// AR is the default locale (CLAUDE.md §4 i18n).
  Locale get locale => Locale(_prefs.getString(_localeKey) ?? 'ar');
  Future<void> setLocale(Locale value) => _prefs.setString(_localeKey, value.languageCode);

  ThemeMode get themeMode => switch (_prefs.getString(_themeKey)) {
        'dark' => ThemeMode.dark,
        'light' => ThemeMode.light,
        _ => ThemeMode.system,
      };
  Future<void> setThemeMode(ThemeMode value) => _prefs.setString(_themeKey, value.name);

  bool get onboardingSeen => _prefs.getBool(_onboardingKey) ?? false;
  Future<void> setOnboardingSeen() => _prefs.setBool(_onboardingKey, true);

  String? getString(String key) => _prefs.getString(key);
  Future<void> setString(String key, String value) => _prefs.setString(key, value);
  Future<void> remove(String key) async {
    await _prefs.remove(key);
  }
}
