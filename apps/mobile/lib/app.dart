import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/notifications/push_controller.dart';
import 'design/theme.dart';
import 'features/auth/application/auth_controller.dart';
import 'features/notifications/application/notifications_controller.dart';
import 'features/settings/application/settings_controller.dart';
import 'l10n/gen/l10n.dart';
import 'router/app_router.dart';

/// App root: locale + theme resolve from settings (AR default), and the
/// per-locale font family (Cairo/Poppins) is baked into the theme. Also boots
/// the push pipeline and replays any notification that cold-launched the app.
class BartalApp extends ConsumerStatefulWidget {
  const BartalApp({super.key});

  @override
  ConsumerState<BartalApp> createState() => _BartalAppState();
}

class _BartalAppState extends ConsumerState<BartalApp> with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    // Start FCM after the first frame so the tree (and router) exist.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(pushControllerProvider).init();
      _consumePendingDeepLink();
    });
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState lifecycle) {
    // Surface notifications the FCM background isolate persisted while we were
    // backgrounded (they don't reach this isolate's prefs cache otherwise).
    if (lifecycle == AppLifecycleState.resumed) {
      ref.read(notificationsControllerProvider.notifier).reloadFromStore();
    }
  }

  /// Navigate to a deep link captured before the tree was ready, but only once
  /// the session has resolved past splash — otherwise the splash redirect drops
  /// the target. Guests routing to a protected link are sent through /welcome
  /// (which resumes via `?from=`).
  void _consumePendingDeepLink() {
    final link = ref.read(pendingDeepLinkProvider);
    if (link == null) return;
    final auth = ref.read(authControllerProvider);
    if (auth.isLoading || !auth.hasValue) return;
    ref.read(pendingDeepLinkProvider.notifier).state = null;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(appRouterProvider).go(link);
    });
  }

  @override
  Widget build(BuildContext context) {
    final settings = ref.watch(settingsControllerProvider);
    final router = ref.watch(appRouterProvider);
    final arabic = settings.arabic;

    // Re-try the pending deep link when the session resolves or a new link
    // arrives while the app is already running.
    ref.listen(authControllerProvider, (_, _) => _consumePendingDeepLink());
    ref.listen(pendingDeepLinkProvider, (_, _) => _consumePendingDeepLink());

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
