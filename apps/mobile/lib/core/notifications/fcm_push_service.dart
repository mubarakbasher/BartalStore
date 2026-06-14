import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';

import '../../features/notifications/data/notifications_store.dart';
import '../storage/app_prefs.dart';
import 'push_messages.dart';
import 'push_service.dart';

/// Flattens a [RemoteMessage] into the app's push map. Data fields win over the
/// notification block (the backend localizes title/body in `data`); the message
/// id is carried for de-duplication.
Map<String, dynamic> mergeMessage(RemoteMessage message) {
  final data = <String, dynamic>{...message.data};
  data['message_id'] ??= message.messageId;
  data['title'] ??= message.notification?.title ?? '';
  data['body'] ??= message.notification?.body ?? '';
  return data;
}

/// Background isolate handler — runs without Riverpod, so it persists the
/// message straight to the same prefs-backed inbox the UI reads. Registered via
/// [FirebaseMessaging.onBackgroundMessage]; must be a top-level function.
@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  try {
    await Firebase.initializeApp();
    final prefs = await AppPrefs.load();
    // Re-read from disk so this isolate sees the foreground's latest inbox
    // before its read-modify-write (reduces the cross-isolate clobber window).
    await prefs.reload();
    final store = NotificationsStore(prefs);
    final item = notificationItemFrom(mergeMessage(message));
    final existing = store.load();
    if (existing.any((n) => n.id == item.id)) return;
    await store.save([item, ...existing]);
  } catch (error) {
    debugPrint('fcm background handler failed: $error');
  }
}

/// Firebase Cloud Messaging implementation of [PushService]. If init fails
/// (e.g. missing google-services.json on a build, or no Play services), every
/// member degrades to the no-op behavior so the app still runs.
class FcmPushService implements PushService {
  FirebaseMessaging? _messaging;
  bool _available = false;

  @override
  Future<void> init() async {
    try {
      await Firebase.initializeApp();
      _messaging = FirebaseMessaging.instance;
      FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);
      await _messaging!.requestPermission();
      // iOS: also surface foreground notifications in the system tray.
      await _messaging!.setForegroundNotificationPresentationOptions(
        alert: true,
        badge: true,
        sound: true,
      );
      _available = true;
    } catch (error) {
      debugPrint('FCM unavailable: $error');
      _available = false;
    }
  }

  @override
  Future<String?> getToken() async {
    if (!_available) return null;
    return _messaging!.getToken();
  }

  @override
  Stream<Map<String, dynamic>> get onMessage =>
      _available ? FirebaseMessaging.onMessage.map(mergeMessage) : const Stream.empty();

  @override
  Stream<Map<String, dynamic>> get onNotificationTap => _available
      ? FirebaseMessaging.onMessageOpenedApp.map(mergeMessage)
      : const Stream.empty();

  @override
  Future<Map<String, dynamic>?> getInitialMessage() async {
    if (!_available) return null;
    final message = await _messaging!.getInitialMessage();
    return message == null ? null : mergeMessage(message);
  }

  @override
  Stream<String> get onTokenRefresh =>
      _available ? _messaging!.onTokenRefresh : const Stream.empty();
}
