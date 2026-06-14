import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/models/notification_item.dart';
import '../../../core/utils/money.dart';
import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/empty_state.dart';
import '../../../widgets/screen_header.dart';
import '../application/notifications_controller.dart';

/// Notifications inbox — port of mobile-extras.jsx::NotificationsScreen. Reads
/// the local on-device store (empty until Slice 6b's FCM feeds it); mark-read
/// and mark-all-read work locally.
class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final items = ref.watch(notificationsControllerProvider);
    final unread = items.where((n) => !n.read).length;

    return Scaffold(
      backgroundColor: bartal.bg,
      body: Column(
        children: [
          ScreenHeader(title: l10n.navNotifications),
          Expanded(
            child: items.isEmpty
                ? const EmptyState(kind: EmptyStateKind.notifications)
                : ListView(
                    padding: const EdgeInsetsDirectional.fromSTEB(16, 0, 16, 24),
                    children: [
                      Padding(
                        padding: const EdgeInsetsDirectional.symmetric(vertical: 10),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              l10n.notificationsUnread(localizedDigits('$unread', arabic: isAr)),
                              style: context.bartalType.small,
                            ),
                            if (unread > 0)
                              GestureDetector(
                                onTap: () =>
                                    ref.read(notificationsControllerProvider.notifier).markAllRead(),
                                child: Text(l10n.notificationsMarkAllRead,
                                    style: TextStyle(
                                        color: bartal.amber, fontSize: 13, fontWeight: FontWeight.w700)),
                              ),
                          ],
                        ),
                      ),
                      for (final n in items) ...[
                        _NotificationCard(
                          item: n,
                          onTap: () => ref.read(notificationsControllerProvider.notifier).markRead(n.id),
                        ),
                        const SizedBox(height: 8),
                      ],
                    ],
                  ),
          ),
        ],
      ),
    );
  }
}

class _NotificationCard extends StatelessWidget {
  const _NotificationCard({required this.item, required this.onTap});

  final NotificationItem item;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final unread = !item.read;

    return Material(
      color: bartal.surface,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          clipBehavior: Clip.antiAlias,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: bartal.line),
          ),
          child: IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Unread accent rail (the design's 3px start border).
                if (unread) Container(width: 3, color: bartal.amber),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsetsDirectional.all(12),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _TypeIcon(type: item.type),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(item.title,
                                  style: context.bartalType.label.copyWith(
                                      fontWeight: unread ? FontWeight.w700 : FontWeight.w600)),
                              if (item.body.isNotEmpty) ...[
                                const SizedBox(height: 2),
                                Text(item.body,
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                    style: context.bartalType.small),
                              ],
                              const SizedBox(height: 4),
                              Text(_relativeTime(item.createdAt, arabic: isAr),
                                  style: context.bartalType.micro),
                            ],
                          ),
                        ),
                        if (unread)
                          Container(
                            margin: const EdgeInsetsDirectional.only(top: 6, start: 6),
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(color: bartal.amber, shape: BoxShape.circle),
                          ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _TypeIcon extends StatelessWidget {
  const _TypeIcon({required this.type});

  final AppNotificationType type;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    final (Color color, Widget glyph) = switch (type) {
      AppNotificationType.receiptApproved || AppNotificationType.delivered => (
          bartal.success,
          const BartalIcon(BartalIcons.check, color: Colors.white, size: 18)
        ),
      AppNotificationType.shipped => (
          bartal.navy,
          const BartalIcon(BartalIcons.truck, color: Colors.white, size: 18)
        ),
      AppNotificationType.priceDrop => (
          bartal.amber,
          const Text('↓', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w800))
        ),
      AppNotificationType.promo => (
          bartal.amber,
          const Text('%', style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w800))
        ),
      AppNotificationType.generic => (
          bartal.navy,
          const BartalIcon(BartalIcons.bell, color: Colors.white, size: 18)
        ),
    };
    return Container(
      width: 36,
      height: 36,
      decoration: BoxDecoration(color: color, shape: BoxShape.circle),
      alignment: Alignment.center,
      child: glyph,
    );
  }
}

/// "Xm / Xh / yesterday / d-m" relative label (locale-aware digits, no intl
/// locale data needed).
String _relativeTime(DateTime dt, {required bool arabic, DateTime? now}) {
  final ref = (now ?? DateTime.now()).toLocal();
  final local = dt.toLocal();
  final diff = ref.difference(local);
  String d(String s) => localizedDigits(s, arabic: arabic);
  if (diff.inMinutes < 1) return arabic ? 'الآن' : 'now';
  if (diff.inMinutes < 60) return arabic ? 'منذ ${d('${diff.inMinutes}')} د' : '${diff.inMinutes}m ago';
  if (diff.inHours < 24) return arabic ? 'منذ ${d('${diff.inHours}')} س' : '${diff.inHours}h ago';
  if (diff.inDays == 1) return arabic ? 'أمس' : 'Yesterday';
  return d('${local.day}/${local.month}');
}
