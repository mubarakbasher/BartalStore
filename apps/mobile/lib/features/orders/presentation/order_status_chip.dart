import 'package:flutter/material.dart';

import '../../../core/models/order.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';

String orderStatusLabel(OrderStatus status, L10n l10n) => switch (status) {
      OrderStatus.pending => l10n.orderStatusPending,
      OrderStatus.awaitingPayment => l10n.orderStatusAwaitingPayment,
      OrderStatus.receiptUploaded => l10n.orderStatusReceiptUploaded,
      OrderStatus.paymentConfirmed => l10n.orderStatusPaymentConfirmed,
      OrderStatus.paymentRejected => l10n.orderStatusPaymentRejected,
      OrderStatus.processing => l10n.orderStatusProcessing,
      OrderStatus.shipped => l10n.orderStatusShipped,
      OrderStatus.delivered => l10n.orderStatusDelivered,
      OrderStatus.cancelled => l10n.orderStatusCancelled,
      OrderStatus.refunded => l10n.orderStatusRefunded,
    };

Color orderStatusColor(OrderStatus status, BartalTheme bartal) => switch (status) {
      OrderStatus.delivered || OrderStatus.paymentConfirmed => bartal.success,
      OrderStatus.cancelled || OrderStatus.paymentRejected => bartal.danger,
      OrderStatus.shipped => bartal.info,
      OrderStatus.processing || OrderStatus.receiptUploaded => bartal.amber,
      _ => bartal.textMute,
    };

/// Pill showing the order's status in its semantic color.
class OrderStatusChip extends StatelessWidget {
  const OrderStatusChip({super.key, required this.status});

  final OrderStatus status;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final color = orderStatusColor(status, bartal);
    return Container(
      padding: const EdgeInsetsDirectional.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.13),
        borderRadius: BorderRadius.circular(100),
      ),
      child: Text(
        orderStatusLabel(status, l10n),
        style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: color),
      ),
    );
  }
}
