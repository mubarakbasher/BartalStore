import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/auth/application/auth_controller.dart';
import '../../features/notifications/application/notifications_controller.dart';
import '../../router/app_router.dart';
import '../providers.dart';
import 'push_messages.dart';
import 'push_service.dart';

/// A deep-link captured before the widget tree was ready (terminated-state
/// launch). [BartalApp] consumes it once the session has resolved past splash.
final pendingDeepLinkProvider = StateProvider<String?>((ref) => null);

/// Owns the live push wiring: foreground messages → the local inbox, taps →
/// navigation, and FCM-token sync on refresh. Bound to the app lifetime
/// ([BartalApp] reads it once and calls [init]); its stream subscriptions are
/// cancelled when the container is disposed.
final pushControllerProvider = Provider<PushController>((ref) {
  final controller = PushController(ref);
  ref.onDispose(controller.dispose);
  return controller;
});

class PushController {
  PushController(this._ref);

  final Ref _ref;
  final _subs = <StreamSubscription<dynamic>>[];
  bool _started = false;

  PushService get _push => _ref.read(pushServiceProvider);

  /// Idempotent. Inits the push service, then subscribes to its streams.
  /// Any failure (e.g. missing Firebase config) degrades to a no-op so the
  /// app still runs.
  Future<void> init() async {
    if (_started) return;
    _started = true;
    try {
      await _push.init();
    } catch (error) {
      debugPrint('push init failed: $error');
      return;
    }

    _subs.add(_push.onMessage.listen(_onForeground));
    _subs.add(_push.onNotificationTap.listen(_onTap));
    _subs.add(_push.onTokenRefresh.listen(_onTokenRefresh));

    // A notification that cold-launched the app: stash it; the tree isn't
    // ready and the splash redirect would swallow an immediate navigation.
    try {
      final initial = await _push.getInitialMessage();
      if (initial != null) {
        _ref.read(pendingDeepLinkProvider.notifier).state = deepLinkFor(initial);
      }
    } catch (error) {
      debugPrint('push initial-message failed: $error');
    }

    // Register the current token if the user is already signed in.
    await _ref.read(authControllerProvider.notifier).registerCurrentToken();
  }

  void _onForeground(Map<String, dynamic> data) {
    _ref.read(notificationsControllerProvider.notifier).add(notificationItemFrom(data));
  }

  void _onTap(Map<String, dynamic> data) {
    // The item was already persisted (foreground add, or the background
    // handler); here we only route to it.
    _ref.read(appRouterProvider).go(deepLinkFor(data));
  }

  void _onTokenRefresh(String token) {
    // Only register against a live session — the endpoint is auth-only, so a
    // refresh while logged out would just fire a guaranteed-401 round-trip
    // (the next login re-registers the current token anyway).
    final auth = _ref.read(authControllerProvider.notifier);
    if (!auth.isAuthenticated) return;
    auth.syncFcmToken(token);
  }

  void dispose() {
    for (final s in _subs) {
      s.cancel();
    }
    _subs.clear();
  }
}
