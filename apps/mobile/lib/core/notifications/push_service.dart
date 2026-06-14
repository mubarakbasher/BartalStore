/// Push abstraction. Production binds `FcmPushService` (Slice 6b — needs a
/// Firebase project + google-services.json); tests and the integration harness
/// bind [NoopPushService], so the whole suite runs without any Firebase plugin.
abstract interface class PushService {
  Future<void> init();

  /// Current device token, or null when push is unavailable.
  Future<String?> getToken();

  /// Foreground messages, each a flat `{type,title,body,order_id,…}` map
  /// (see `push_messages.dart` for the payload contract).
  Stream<Map<String, dynamic>> get onMessage;

  /// A notification the user tapped while the app was backgrounded.
  Stream<Map<String, dynamic>> get onNotificationTap;

  /// The notification that cold-launched the app from a terminated state
  /// (consumed once), or null.
  Future<Map<String, dynamic>?> getInitialMessage();

  Stream<String> get onTokenRefresh;
}

class NoopPushService implements PushService {
  const NoopPushService();

  @override
  Future<void> init() async {}

  @override
  Future<String?> getToken() async => null;

  @override
  Stream<Map<String, dynamic>> get onMessage => const Stream.empty();

  @override
  Stream<Map<String, dynamic>> get onNotificationTap => const Stream.empty();

  @override
  Future<Map<String, dynamic>?> getInitialMessage() async => null;

  @override
  Stream<String> get onTokenRefresh => const Stream.empty();
}
