import '../models/notification_item.dart';

// Pure mapping helpers for push payloads — Firebase-free so they unit-test
// without a device. A push message reaches the app as a flat
// `Map<String, dynamic>` (the FCM `data` map, merged with the notification's
// title/body + message id by `FcmPushService.mergeMessage`).
//
// Payload contract (what the backend sends in `data`):
// - `type`         → one of AppNotificationType wire values (`shipped`, …)
// - `title`,`body` → pre-localized strings (the server picks AR/EN)
// - `order_id`     → the routable order id (cuid) — used for deep linking
// - `order_number` → the human `BRT-YYYY-NNNNN` label — used for display
// - `message_id`   → a stable id for de-duplication

/// Route a tapped notification to its in-app destination. Order notifications
/// open the order detail; everything else falls back to the inbox.
String deepLinkFor(Map<String, dynamic> data) {
  final orderId = (data['order_id'] ?? data['orderId'])?.toString();
  if (orderId != null && orderId.isNotEmpty) return '/orders/$orderId';
  return '/notifications';
}

/// Build an inbox entry from a push payload. `id` falls back to the FCM
/// message id, then to a timestamp so every entry is distinct.
NotificationItem notificationItemFrom(Map<String, dynamic> data, {DateTime? now}) {
  final stamp = now ?? DateTime.now();
  return NotificationItem(
    id: (data['message_id'] ?? data['messageId'])?.toString() ??
        stamp.microsecondsSinceEpoch.toString(),
    type: AppNotificationType.fromWire(data['type']?.toString()),
    title: (data['title'] ?? '').toString(),
    body: (data['body'] ?? '').toString(),
    orderNumber: data['order_number']?.toString(),
    createdAt: stamp,
  );
}
