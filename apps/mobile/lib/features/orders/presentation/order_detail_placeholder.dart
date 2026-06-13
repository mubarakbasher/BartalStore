import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/utils/money.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/price_tag.dart';
import '../../../widgets/screen_header.dart';
import '../application/orders_controller.dart';
import 'order_status_chip.dart';

/// Compact order summary — full order detail (status timeline, receipt upload,
/// tracking, cancel, write-review) lands in Slice 4. For now this shows the
/// order number, status, items, address, and totals from GET /orders/:id so
/// tapping an order (or "View order" on confirm) lands somewhere real.
class OrderDetailPlaceholder extends ConsumerWidget {
  const OrderDetailPlaceholder({super.key, required this.orderId});

  final String orderId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final arabic = Localizations.localeOf(context).languageCode == 'ar';
    final order = ref.watch(orderDetailProvider(orderId));

    return Scaffold(
      backgroundColor: bartal.bg,
      body: Column(
        children: [
          const ScreenHeader(title: ''),
          Expanded(
            child: order.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (error, _) => Center(child: Text('$error')),
              data: (data) => ListView(
                padding: const EdgeInsetsDirectional.fromSTEB(16, 0, 16, 24),
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        data.orderNumber,
                        style: const TextStyle(
                            fontFamily: 'JetBrainsMono', fontSize: 16, fontWeight: FontWeight.w700),
                      ),
                      OrderStatusChip(status: data.status),
                    ],
                  ),
                  const SizedBox(height: 16),
                  for (final item in data.items)
                    Padding(
                      padding: const EdgeInsetsDirectional.only(bottom: 8),
                      child: Row(
                        children: [
                          Expanded(
                            child: Text(
                              '${item.name(arabic: arabic)} × ${localizedDigits('${item.quantity}', arabic: arabic)}',
                              style: context.bartalType.body,
                            ),
                          ),
                          PriceTag(amount: item.totalPrice, size: 13),
                        ],
                      ),
                    ),
                  const Divider(height: 24),
                  if (data.address != null) ...[
                    Text(data.address!.fullName,
                        style: context.bartalType.label.copyWith(fontWeight: FontWeight.w600)),
                    Text(data.address!.streetLine, style: context.bartalType.small),
                    Text('◉ ${data.address!.landmark}',
                        style: context.bartalType.small.copyWith(color: bartal.amber)),
                    const Divider(height: 24),
                  ],
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(l10n.cartTotal,
                          style: context.bartalType.body.copyWith(fontWeight: FontWeight.w700)),
                      PriceTag(amount: data.total, size: 18, color: bartal.amber),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
