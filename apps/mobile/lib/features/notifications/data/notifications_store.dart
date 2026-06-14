import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/models/notification_item.dart';
import '../../../core/providers.dart';
import '../../../core/storage/app_prefs.dart';

/// On-device notifications inbox, persisted as a JSON list in [AppPrefs].
/// The backend has no inbox endpoint; Slice 6b's FCM handler calls [add].
class NotificationsStore {
  NotificationsStore(this._prefs);

  static const _key = 'bartal_notifications';
  static const _maxItems = 100;

  final AppPrefs _prefs;

  List<NotificationItem> load() {
    final raw = _prefs.getString(_key);
    if (raw == null || raw.isEmpty) return const [];
    try {
      final list = jsonDecode(raw) as List;
      final items = [
        for (final e in list) NotificationItem.fromJson(e as Map<String, dynamic>),
      ]..sort((a, b) => b.createdAt.compareTo(a.createdAt));
      return items;
    } catch (_) {
      return const [];
    }
  }

  Future<void> save(List<NotificationItem> items) {
    final trimmed = items.length > _maxItems ? items.sublist(0, _maxItems) : items;
    return _prefs.setString(_key, jsonEncode([for (final i in trimmed) i.toJson()]));
  }
}

final notificationsStoreProvider = Provider<NotificationsStore>(
  (ref) => NotificationsStore(ref.watch(appPrefsProvider)),
);
