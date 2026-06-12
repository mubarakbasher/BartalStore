import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'design/theme.dart';
import 'features/settings/application/settings_controller.dart';
import 'l10n/gen/l10n.dart';
import 'router/app_router.dart';

/// App root: locale + theme resolve from settings (AR default), and the
/// per-locale font family (Cairo/Poppins) is baked into the theme.
class BartalApp extends ConsumerWidget {
  const BartalApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsControllerProvider);
    final router = ref.watch(appRouterProvider);
    final arabic = settings.arabic;

    return MaterialApp.router(
      title: arabic ? 'بَرتال' : 'Bartal',
      debugShowCheckedModeBanner: false,
      routerConfig: router,
      locale: settings.locale,
      supportedLocales: L10n.supportedLocales,
      localizationsDelegates: L10n.localizationsDelegates,
      themeMode: settings.themeMode,
      theme: buildBartalTheme(brightness: Brightness.light, arabic: arabic),
      darkTheme: buildBartalTheme(brightness: Brightness.dark, arabic: arabic),
    );
  }
}
