import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/models/notification_item.dart';
import '../../../core/providers.dart';
import '../data/notifications_store.dart';

/// Local notifications inbox (newest first). Empty until Slice 6b's FCM handler
/// calls [add]; `markRead`/`markAllRead` work locally now.
class NotificationsController extends Notifier<List<NotificationItem>> {
  NotificationsStore get _store => ref.read(notificationsStoreProvider);

  @override
  List<NotificationItem> build() => _store.load();

  Future<void> add(NotificationItem item) async {
    // Ignore a message we already hold (a foreground add can race the
    // background handler for the same FCM message id).
    if (state.any((n) => n.id == item.id)) return;
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

  /// Re-read the inbox from disk. Call when the app returns to the foreground so
  /// notifications the FCM background isolate persisted while the app was
  /// backgrounded surface in the list + unread badge (otherwise they'd only
  /// appear after a cold restart).
  Future<void> reloadFromStore() async {
    await ref.read(appPrefsProvider).reload();
    state = _store.load();
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
