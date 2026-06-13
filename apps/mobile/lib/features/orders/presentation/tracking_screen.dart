import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/models/order.dart';
import '../../../core/utils/whatsapp.dart';
import '../../../design/icons.dart';
import '../../../design/motif.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/screen_header.dart';
import '../../checkout/presentation/widgets/checkout_chrome.dart';
import '../application/order_detail_controller.dart';
import 'order_status_chip.dart';
import 'widgets/order_timeline.dart';

/// Order tracking — adapted from receipt-flow.jsx::TrackingScreen. Keeps the
/// navy+motif hero and the progress timeline, but drives both from real data:
/// the headline from the current status and the timeline from the order's real
/// status_history. The design's fabricated courier/GPS/ETA is replaced with a
/// real WhatsApp support card (no invented delivery data — PRD §2 trust).
class TrackingScreen extends ConsumerWidget {
  const TrackingScreen({super.key, required this.orderId});

  final String orderId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final async = ref.watch(orderDetailProvider(orderId));

    return Scaffold(
      backgroundColor: bartal.bg,
      body: Column(
        children: [
          ScreenHeader(title: l10n.trackingTitle),
          Expanded(
            child: async.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (error, _) => Center(child: Text('$error')),
              data: (order) => _body(context, order),
            ),
          ),
        ],
      ),
    );
  }

  Widget _body(BuildContext context, OrderView order) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';

    final headline = switch (order.status) {
      OrderStatus.shipped => l10n.trackingOnTheWay,
      OrderStatus.processing => l10n.trackingPreparing,
      OrderStatus.paymentConfirmed => l10n.trackingConfirmedHeadline,
      OrderStatus.delivered => l10n.trackingDeliveredHeadline,
      _ => orderStatusLabel(order.status, l10n),
    };

    final steps = _buildTimeline(order, l10n, isAr);

    return ListView(
      padding: const EdgeInsetsDirectional.only(bottom: 24),
      children: [
        // Hero (navy + motif).
        Padding(
          padding: const EdgeInsetsDirectional.fromSTEB(16, 10, 16, 0),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: AlignmentDirectional.topStart,
                  end: AlignmentDirectional.bottomEnd,
                  colors: [bartal.navy, bartal.navyInk],
                ),
              ),
              child: MotifBackground(
                color: bartal.amberSoft,
                opacity: 0.15,
                spec: MotifTileSpec.header,
                child: Padding(
                  padding: const EdgeInsetsDirectional.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(l10n.trackingStatusLabel,
                          style: TextStyle(
                              color: bartal.amberSoft,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 1.5)),
                      const SizedBox(height: 4),
                      Text(headline,
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 22,
                              height: 1.2,
                              fontWeight: FontWeight.w700,
                              fontFamily: isAr ? 'Cairo' : 'Poppins')),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
        // WhatsApp support card (replaces the design's courier card).
        CheckoutSection(
          title: l10n.orderHelpTitle,
          child: _SupportCard(order: order),
        ),
        // Progress timeline (real status_history).
        CheckoutSection(
          title: l10n.trackingProgressTitle,
          child: Container(
            padding: const EdgeInsetsDirectional.all(16),
            decoration: BoxDecoration(
              color: bartal.surface,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: bartal.line),
            ),
            child: OrderTimeline(steps: steps),
          ),
        ),
        // Order reference.
        Padding(
          padding: const EdgeInsetsDirectional.symmetric(horizontal: 16),
          child: Container(
            padding: const EdgeInsetsDirectional.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: bartal.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: bartal.line),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(l10n.trackingOrderLabel, style: context.bartalType.small),
                Text(order.orderNumber,
                    style: TextStyle(
                        fontFamily: 'JetBrainsMono',
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: bartal.text)),
              ],
            ),
          ),
        ),
      ],
    );
  }

  List<OrderTimelineStep> _buildTimeline(OrderView order, L10n l10n, bool isAr) {
    final events = order.statusHistory;
    final steps = <OrderTimelineStep>[];
    if (events.isEmpty) {
      steps.add(OrderTimelineStep(
        label: orderStatusLabel(order.status, l10n),
        time: orderEventTimeLabel(order.createdAt, arabic: isAr),
        state: TimelineState.active,
      ));
    } else {
      for (var i = 0; i < events.length; i++) {
        steps.add(OrderTimelineStep(
          label: orderStatusLabel(events[i].status, l10n),
          time: orderEventTimeLabel(events[i].createdAt, arabic: isAr),
          state: i == events.length - 1 ? TimelineState.active : TimelineState.done,
        ));
      }
    }
    const terminal = {OrderStatus.delivered, OrderStatus.cancelled, OrderStatus.refunded};
    if (!terminal.contains(order.status)) {
      steps.add(OrderTimelineStep(
        label: orderStatusLabel(OrderStatus.delivered, l10n),
        state: TimelineState.pending,
      ));
    }
    return steps;
  }
}

class _SupportCard extends StatelessWidget {
  const _SupportCard({required this.order});

  final OrderView order;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    const whatsappGreen = Color(0xFF25D366);

    return Material(
      color: bartal.surface,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: () => launchWhatsApp(text: order.orderNumber),
        borderRadius: BorderRadius.circular(14),
        child: Container(
          padding: const EdgeInsetsDirectional.all(14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: bartal.line),
          ),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: const BoxDecoration(color: whatsappGreen, shape: BoxShape.circle),
                alignment: Alignment.center,
                child: const Text('W',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 16)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(l10n.orderContactWhatsapp,
                        style: context.bartalType.label.copyWith(fontWeight: FontWeight.w700)),
                    const SizedBox(height: 2),
                    Text(l10n.trackingSupportBody, style: context.bartalType.micro),
                  ],
                ),
              ),
              BartalIcon(BartalIcons.arrow, color: bartal.textMute, size: 16),
            ],
          ),
        ),
      ),
    );
  }
}
