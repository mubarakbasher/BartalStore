/// Notification kind — drives the row icon + accent color. Slice 6b's FCM
/// handler maps incoming `data.type` payloads onto these.
enum AppNotificationType {
  receiptApproved('receipt_approved'),
  shipped('shipped'),
  delivered('delivered'),
  priceDrop('price_drop'),
  promo('promo'),
  generic('generic');

  const AppNotificationType(this.wire);
  final String wire;

  static AppNotificationType fromWire(String? value) => AppNotificationType.values
      .firstWhere((t) => t.wire == value, orElse: () => AppNotificationType.generic);
}

/// One entry in the local notifications inbox (no backend inbox endpoint —
/// PRD §2 / notifications module is outbound only). Persisted on-device;
/// Slice 6b feeds new items from FCM. `title`/`body` are pre-localized at
/// write time (the FCM payload carries the locale-appropriate strings).
class NotificationItem {
  const NotificationItem({
    required this.id,
    required this.type,
    required this.title,
    required this.body,
    required this.createdAt,
    this.orderNumber,
    this.read = false,
  });

  factory NotificationItem.fromJson(Map<String, dynamic> json) => NotificationItem(
        id: json['id'] as String,
        type: AppNotificationType.fromWire(json['type'] as String?),
        title: json['title'] as String? ?? '',
        body: json['body'] as String? ?? '',
        orderNumber: json['order_number'] as String?,
        createdAt: DateTime.tryParse(json['created_at'] as String? ?? '') ??
            DateTime.fromMillisecondsSinceEpoch(0),
        read: json['read'] as bool? ?? false,
      );

  final String id;
  final AppNotificationType type;
  final String title;
  final String body;
  final String? orderNumber;
  final DateTime createdAt;
  final bool read;

  Map<String, dynamic> toJson() => {
        'id': id,
        'type': type.wire,
        'title': title,
        'body': body,
        if (orderNumber != null) 'order_number': orderNumber,
        'created_at': createdAt.toIso8601String(),
        'read': read,
      };

  NotificationItem copyWith({bool? read}) => NotificationItem(
        id: id,
        type: type,
        title: title,
        body: body,
        orderNumber: orderNumber,
        createdAt: createdAt,
        read: read ?? this.read,
      );
}
