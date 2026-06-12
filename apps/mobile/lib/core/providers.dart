import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'api/api_client.dart';
import 'notifications/push_service.dart';
import 'storage/app_prefs.dart';
import 'storage/token_storage.dart';

/// Loaded in `main()` before `runApp` and provided via overrides.
final appPrefsProvider = Provider<AppPrefs>(
  (ref) => throw UnimplementedError('Overridden in main()'),
);

final tokenStorageProvider = Provider<TokenStorage>(
  (ref) => throw UnimplementedError('Overridden in main()'),
);

/// FCM lands in Slice 6b — Noop until a Firebase project exists.
final pushServiceProvider = Provider<PushService>((ref) => const NoopPushService());

/// Decouples the API client from the auth controller: the interceptor fires
/// this when refresh rotation fails; the auth controller subscribes in its
/// build and flips the session to guest.
class SessionExpirySignal {
  void Function()? onExpired;
  void fire() => onExpired?.call();
}

final sessionExpirySignalProvider = Provider<SessionExpirySignal>(
  (ref) => SessionExpirySignal(),
);

final apiClientProvider = Provider<Dio>((ref) {
  final tokens = ref.watch(tokenStorageProvider);
  final signal = ref.watch(sessionExpirySignalProvider);
  return buildApiClient(tokens: tokens, onSessionExpired: signal.fire);
});

/// Live cart line count for the tab-bar badge. Returns 0 until the cart
/// controller lands in Slice 3 (server cart + guest cart).
final cartCountProvider = Provider<int>((ref) => 0);
