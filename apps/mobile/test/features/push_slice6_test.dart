import 'dart:convert';

import 'package:bartal_mobile/core/models/notification_item.dart';
import 'package:bartal_mobile/core/notifications/push_messages.dart';
import 'package:bartal_mobile/core/providers.dart';
import 'package:bartal_mobile/core/storage/app_prefs.dart';
import 'package:bartal_mobile/features/auth/data/auth_api.dart';
import 'package:bartal_mobile/features/notifications/application/notifications_controller.dart';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Captures requests and replies with an empty success envelope.
class _CapturingAdapter implements HttpClientAdapter {
  final List<RequestOptions> requests = [];

  @override
  void close({bool force = false}) {}

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<List<int>>? requestStream,
    Future<void>? cancelFuture,
  ) async {
    requests.add(options);
    return ResponseBody.fromString(
      '{"success":true,"data":null}',
      200,
      headers: {
        'content-type': ['application/json'],
      },
    );
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('deepLinkFor', () {
    test('order payload → order detail route', () {
      expect(deepLinkFor({'order_id': 'order_abc'}), '/orders/order_abc');
      expect(deepLinkFor({'orderId': 'order_xyz'}), '/orders/order_xyz');
    });

    test('no order → inbox', () {
      expect(deepLinkFor({}), '/notifications');
      expect(deepLinkFor({'order_id': ''}), '/notifications');
      expect(deepLinkFor({'type': 'promo'}), '/notifications');
    });
  });

  group('notificationItemFrom', () {
    test('maps a full push payload', () {
      final now = DateTime(2026, 6, 14, 9);
      final item = notificationItemFrom({
        'message_id': 'm1',
        'type': 'shipped',
        'title': 'تم الشحن',
        'body': 'BRT-2026-00006',
        'order_number': 'BRT-2026-00006',
      }, now: now);

      expect(item.id, 'm1');
      expect(item.type, AppNotificationType.shipped);
      expect(item.title, 'تم الشحن');
      expect(item.body, 'BRT-2026-00006');
      expect(item.orderNumber, 'BRT-2026-00006');
      expect(item.createdAt, now);
    });

    test('falls back to a timestamp id and generic type', () {
      final now = DateTime(2026, 6, 14, 9);
      final item = notificationItemFrom({'title': 'Hi'}, now: now);
      expect(item.id, now.microsecondsSinceEpoch.toString());
      expect(item.type, AppNotificationType.generic);
    });
  });

  group('AuthApi.updateFcmToken', () {
    late _CapturingAdapter adapter;
    late AuthApi api;

    setUp(() {
      adapter = _CapturingAdapter();
      final dio = Dio(BaseOptions(baseUrl: 'http://test.local'))..httpClientAdapter = adapter;
      api = AuthApi(dio);
    });

    test('registers a token', () async {
      await api.updateFcmToken('device-token-123');
      final req = adapter.requests.single;
      expect(req.method, 'PUT');
      expect(req.path, '/users/me/fcm-token');
      expect(req.data, {'fcm_token': 'device-token-123'});
    });

    test('unregisters with null', () async {
      await api.updateFcmToken(null);
      expect(adapter.requests.single.data, {'fcm_token': null});
    });
  });

  group('NotificationsController.add', () {
    test('de-dupes by id and prepends newest', () async {
      SharedPreferences.setMockInitialValues({});
      final prefs = await AppPrefs.load();
      final container = ProviderContainer(
        overrides: [appPrefsProvider.overrideWithValue(prefs)],
      );
      addTearDown(container.dispose);

      final notifier = container.read(notificationsControllerProvider.notifier);
      final item = notificationItemFrom({'message_id': 'dup', 'title': 'A'}, now: DateTime(2026, 6, 14));
      await notifier.add(item);
      await notifier.add(item); // same id — ignored

      expect(container.read(notificationsControllerProvider).length, 1);

      // Persisted exactly once.
      final raw = prefs.getString('bartal_notifications');
      expect((jsonDecode(raw!) as List).length, 1);
    });
  });
}
