import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app.dart';
import 'core/notifications/fcm_push_service.dart';
import 'core/providers.dart';
import 'core/storage/app_prefs.dart';
import 'core/storage/token_storage.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Load persisted state before the first frame so locale/theme/session
  // never flash defaults.
  final prefs = await AppPrefs.load();
  final tokens = TokenStorage();
  await tokens.load();

  runApp(
    ProviderScope(
      overrides: [
        appPrefsProvider.overrideWithValue(prefs),
        tokenStorageProvider.overrideWithValue(tokens),
        // Real FCM in production; tests/integration keep the Noop default.
        pushServiceProvider.overrideWithValue(FcmPushService()),
      ],
      child: const BartalApp(),
    ),
  );
}
