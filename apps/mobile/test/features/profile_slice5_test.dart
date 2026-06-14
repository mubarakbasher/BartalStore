import 'package:bartal_mobile/core/models/notification_item.dart';
import 'package:bartal_mobile/core/models/user.dart';
import 'package:bartal_mobile/core/providers.dart';
import 'package:bartal_mobile/core/storage/app_prefs.dart';
import 'package:bartal_mobile/features/notifications/application/notifications_controller.dart';
import 'package:bartal_mobile/features/settings/application/settings_controller.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<ProviderContainer> _container() async {
  SharedPreferences.setMockInitialValues({});
  final prefs = await AppPrefs.load();
  final container = ProviderContainer(overrides: [appPrefsProvider.overrideWithValue(prefs)]);
  return container;
}

NotificationItem _notif(String id, {bool read = false}) => NotificationItem(
      id: id,
      type: AppNotificationType.shipped,
      title: 'Order shipped',
      body: 'BRT-2026-00006',
      createdAt: DateTime(2026, 6, 13, 12),
      read: read,
    );

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('User.fromJson (Slice 5 fields)', () {
    test('parses gender/DOB/created_at/email_verified and derives initials', () {
      final u = User.fromJson({
        'id': 'u1',
        'phone': '+249912000001',
        'name': 'Mohammed Osman',
        'email': 'm@example.sd',
        'role': 'CUSTOMER',
        'language': 'AR',
        'is_verified': true,
        'email_verified': true,
        'loyalty_points': 120,
        'date_of_birth': '1992-03-15T00:00:00.000Z',
        'gender': 'MALE',
        'national_id_status': 'VERIFIED',
        'created_at': '2024-01-10T00:00:00.000Z',
        'orders_count': 8,
        'lifetime_spend': 64000,
      });
      expect(u.initials, 'MO');
      expect(u.gender, 'MALE');
      expect(u.emailVerified, isTrue);
      expect(u.dateOfBirth, DateTime.parse('1992-03-15T00:00:00.000Z'));
      expect(u.createdAt!.year, 2024);
      expect(u.ordersCount, 8);
    });

    test('tolerates missing optional fields', () {
      final u = User.fromJson({
        'id': 'u1',
        'phone': '+249912000001',
        'name': 'Sara',
        'email': null,
        'role': 'CUSTOMER',
        'language': 'EN',
        'is_verified': false,
        'loyalty_points': 0,
      });
      expect(u.initials, 'S');
      expect(u.gender, isNull);
      expect(u.dateOfBirth, isNull);
      expect(u.createdAt, isNull);
    });
  });

  group('NotificationsController + store', () {
    test('add → unread count, markAllRead, and persistence', () async {
      final container = await _container();
      addTearDown(container.dispose);
      final notifier = container.read(notificationsControllerProvider.notifier);

      expect(container.read(notificationsControllerProvider), isEmpty);
      await notifier.add(_notif('1'));
      await notifier.add(_notif('2'));
      expect(container.read(notificationsControllerProvider), hasLength(2));
      expect(container.read(unreadNotificationsProvider), 2);

      await notifier.markRead('1');
      expect(container.read(unreadNotificationsProvider), 1);
      await notifier.markAllRead();
      expect(container.read(unreadNotificationsProvider), 0);
    });

    test('survives a reload from prefs', () async {
      SharedPreferences.setMockInitialValues({});
      final prefs = await AppPrefs.load();
      final c1 = ProviderContainer(overrides: [appPrefsProvider.overrideWithValue(prefs)]);
      await c1.read(notificationsControllerProvider.notifier).add(_notif('1'));
      c1.dispose();

      final c2 = ProviderContainer(overrides: [appPrefsProvider.overrideWithValue(prefs)]);
      addTearDown(c2.dispose);
      expect(c2.read(notificationsControllerProvider), hasLength(1));
    });
  });

  group('Settings notification prefs', () {
    test('defaults match the design and persist on change', () async {
      final container = await _container();
      addTearDown(container.dispose);
      final settings = container.read(settingsControllerProvider);
      expect(settings.notif(NotifPref.orderUpdates), isTrue);
      expect(settings.notif(NotifPref.whatsappAlerts), isTrue);
      expect(settings.notif(NotifPref.offers), isFalse);
      expect(settings.notif(NotifPref.recommendations), isFalse);

      await container.read(settingsControllerProvider.notifier).setNotifPref(NotifPref.offers, true);
      expect(container.read(settingsControllerProvider).notif(NotifPref.offers), isTrue);
      final prefs = container.read(appPrefsProvider);
      expect(prefs.getBool(NotifPref.offers.key, defaultValue: false), isTrue);
    });
  });
}
