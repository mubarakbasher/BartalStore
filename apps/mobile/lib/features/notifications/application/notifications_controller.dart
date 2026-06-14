import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/models/notification_item.dart';
import '../data/notifications_store.dart';

/// Local notifications inbox (newest first). Empty until Slice 6b's FCM handler
/// calls [add]; `markRead`/`markAllRead` work locally now.
class NotificationsController extends Notifier<List<NotificationItem>> {
  NotificationsStore get _store => ref.read(notificationsStoreProvider);

  @override
  List<NotificationItem> build() => _store.load();

  Future<void> add(NotificationItem item) async {
    state = [item, ...state];
    await _store.save(state);
  }

  Future<void> markRead(String id) async {
    state = [for (final n in state) n.id == id ? n.copyWith(read: true) : n];
    await _store.save(state);
  }

  Future<void> markAllRead() async {
    if (state.every((n) => n.read)) return;
    state = [for (final n in state) n.copyWith(read: true)];
    await _store.save(state);
  }

  Future<void> clear() async {
    state = const [];
    await _store.save(state);
  }
}

final notificationsControllerProvider =
    NotifierProvider<NotificationsController, List<NotificationItem>>(
  NotificationsController.new,
);

/// Live unread count for the bell badge.
final unreadNotificationsProvider = Provider<int>(
  (ref) => ref.watch(notificationsControllerProvider).where((n) => !n.read).length,
);
