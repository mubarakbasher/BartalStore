/// Push abstraction — FCM lands in Slice 6b (needs a Firebase project +
/// google-services.json, which don't exist yet). Until then the app binds
/// [NoopPushService] and builds without any Firebase dependency.
abstract interface class PushService {
  Future<void> init();

  /// Current device token, or null when push is unavailable.
  Future<String?> getToken();

  /// Foreground message stream: `{title, body, data}` maps.
  Stream<Map<String, dynamic>> get onMessage;

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
  Stream<String> get onTokenRefresh => const Stream.empty();
}
