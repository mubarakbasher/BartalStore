import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/models/order.dart';
import '../../../core/utils/money.dart';
import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/empty_state.dart';
import '../../../widgets/price_tag.dart';
import '../../../widgets/product_image.dart';
import '../../../widgets/skeletons.dart';
import '../application/orders_controller.dart';
import 'order_status_chip.dart';

enum _OrderFilter { all, processing, shipping, completed }

/// Orders list — port of secondary-screens.jsx::OrdersScreen. Paged GET
/// /orders with status filter chips. Order cards route to `/orders/:id`
/// (order detail + receipt upload land in Slice 4).
class OrdersScreen extends ConsumerStatefulWidget {
  const OrdersScreen({super.key});

  @override
  ConsumerState<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends ConsumerState<OrdersScreen> {
  final _scroll = ScrollController();
  _OrderFilter _filter = _OrderFilter.all;

  @override
  void initState() {
    super.initState();
    _scroll.addListener(() {
      if (_scroll.position.pixels >= _scroll.position.maxScrollExtent - 400) {
        ref.read(ordersControllerProvider.notifier).fetchNextPage();
      }
    });
  }

  @override
  void dispose() {
    _scroll.dispose();
    super.dispose();
  }

  bool _matches(OrderStatus status) => switch (_filter) {
        _OrderFilter.all => true,
        _OrderFilter.processing => status == OrderStatus.pending ||
            status == OrderStatus.awaitingPayment ||
            status == OrderStatus.receiptUploaded ||
            status == OrderStatus.paymentConfirmed ||
            status == OrderStatus.processing,
        _OrderFilter.shipping => status == OrderStatus.shipped,
        _OrderFilter.completed =>
          status == OrderStatus.delivered || status == OrderStatus.cancelled || status == OrderStatus.refunded,
      };

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final orders = ref.watch(ordersControllerProvider);

    return Scaffold(
      backgroundColor: bartal.bg,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsetsDirectional.fromSTEB(16, 16, 16, 10),
              child: Text(l10n.navOrders, style: context.bartalType.h1),
            ),
            _FilterChips(active: _filter, onChanged: (f) => setState(() => _filter = f)),
            Expanded(
              child: orders.when(
                loading: () => const ListSkeleton(),
                error: (error, _) => Center(child: Text('$error')),
                data: (page) {
                  final visible = page.orders.where((o) => _matches(o.status)).toList();
                  if (page.orders.isEmpty) {
                    return EmptyState(kind: EmptyStateKind.orders, onCta: () => context.go('/home'));
                  }
                  return RefreshIndicator(
                    onRefresh: () async => ref.invalidate(ordersControllerProvider),
                    child: ListView(
                      controller: _scroll,
                      padding: const EdgeInsetsDirectional.fromSTEB(16, 4, 16, 24),
                      children: [
                        if (visible.isEmpty)
                          Padding(
                            padding: const EdgeInsetsDirectional.only(top: 40),
                            child: Center(child: Text(l10n.productsNoResults, style: context.bartalType.small)),
                          ),
                        for (final order in visible)
                          Padding(
                            padding: const EdgeInsetsDirectional.only(bottom: 10),
                            child: _OrderCard(order: order),
                          ),
                        if (page.loadingMore)
                          const Padding(
                            padding: EdgeInsetsDirectional.all(16),
                            child: Center(child: CircularProgressIndicator()),
                          ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FilterChips extends StatelessWidget {
  const _FilterChips({required this.active, required this.onChanged});

  final _OrderFilter active;
  final ValueChanged<_OrderFilter> onChanged;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final entries = [
      (_OrderFilter.all, l10n.ordersFilterAll),
      (_OrderFilter.processing, l10n.ordersFilterProcessing),
      (_OrderFilter.shipping, l10n.ordersFilterShipping),
      (_OrderFilter.completed, l10n.ordersFilterCompleted),
    ];
    return SizedBox(
      height: 40,
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsetsDirectional.symmetric(horizontal: 16),
        children: [
          for (final (filter, label) in entries)
            Padding(
              padding: const EdgeInsetsDirectional.only(end: 8),
              child: GestureDetector(
                onTap: () => onChanged(filter),
                child: Container(
                  padding: const EdgeInsetsDirectional.symmetric(horizontal: 14, vertical: 7),
                  decoration: BoxDecoration(
                    color: filter == active ? bartal.navy : bartal.surface,
                    borderRadius: BorderRadius.circular(100),
                    border: Border.all(color: filter == active ? bartal.navy : bartal.line),
                  ),
                  child: Text(
                    label,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: filter == active ? Colors.white : bartal.text,
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _OrderCard extends StatelessWidget {
  const _OrderCard({required this.order});

  final OrderView order;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final arabic = Localizations.localeOf(context).languageCode == 'ar';

    return Material(
      color: bartal.surface,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: () => context.push('/orders/${order.id}'),
        borderRadius: BorderRadius.circular(14),
        child: Container(
          padding: const EdgeInsetsDirectional.all(12),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: bartal.line),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    order.orderNumber,
                    style: const TextStyle(fontFamily: 'JetBrainsMono', fontSize: 12, fontWeight: FontWeight.w700),
                  ),
                  OrderStatusChip(status: order.status),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: SizedBox(
                      width: 52,
                      height: 52,
                      child: ProductThumb(
                        productId: order.items.isNotEmpty ? order.items.first.productId : order.id,
                        imageUrl: order.primaryImageUrl,
                        label: order.items.isNotEmpty ? order.items.first.nameEn : '',
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (order.items.isNotEmpty)
                          Text(
                            order.items.first.name(arabic: arabic),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: context.bartalType.label.copyWith(fontWeight: FontWeight.w600),
                          ),
                        const SizedBox(height: 2),
                        Text(
                          l10n.ordersItemCount(localizedDigits('${order.itemCount}', arabic: arabic)),
                          style: context.bartalType.small,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  PriceTag(amount: order.total, size: 14, color: bartal.amber),
                  const SizedBox(width: 4),
                  BartalIcon(BartalIcons.arrow, color: bartal.textMute, size: 14),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
