import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/screen_header.dart';
import '../application/order_detail_controller.dart';
import 'widgets/order_timeline.dart';

/// Success acknowledgement after a receipt upload — port of
/// receipt-flow.jsx::ReceiptSubmittedScreen. Checkmark hero + a 4-step preview
/// (the just-happened upload), then Track order / Continue shopping.
class ReceiptSubmittedScreen extends ConsumerWidget {
  const ReceiptSubmittedScreen({super.key, required this.orderId});

  final String orderId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final order = ref.watch(orderDetailProvider(orderId)).valueOrNull;

    final placedAt = order?.createdAt;
    final uploadedAt = order?.receiptUploadedAt;

    final steps = <OrderTimelineStep>[
      OrderTimelineStep(
        label: l10n.receiptStepOrderPlaced,
        time: placedAt != null ? orderEventTimeLabel(placedAt, arabic: isAr) : null,
        state: TimelineState.done,
      ),
      OrderTimelineStep(
        label: l10n.uploadSubmitted,
        time: uploadedAt != null ? orderEventTimeLabel(uploadedAt, arabic: isAr) : null,
        state: TimelineState.active,
      ),
      OrderTimelineStep(label: l10n.receiptStepUnderReview, state: TimelineState.pending),
      OrderTimelineStep(label: l10n.receiptStepConfirmed, state: TimelineState.pending),
    ];

    return Scaffold(
      backgroundColor: bartal.bg,
      body: Column(
        children: [
          const ScreenHeader(title: ''),
          Expanded(
            child: ListView(
              padding: const EdgeInsetsDirectional.fromSTEB(24, 12, 24, 12),
              children: [
                const SizedBox(height: 12),
                Center(
                  child: Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        begin: AlignmentDirectional.topStart,
                        end: AlignmentDirectional.bottomEnd,
                        colors: [bartal.amber, const Color(0xFFF59E0B)],
                      ),
                      boxShadow: [
                        BoxShadow(color: bartal.amber.withValues(alpha: 0.31), blurRadius: 30, offset: const Offset(0, 10)),
                      ],
                    ),
                    child: const Center(child: BartalIcon(BartalIcons.check, color: Colors.white, size: 48)),
                  ),
                ),
                const SizedBox(height: 24),
                Text(l10n.receiptSubmittedTitle,
                    textAlign: TextAlign.center,
                    style: context.bartalType.h1),
                const SizedBox(height: 8),
                Text(l10n.receiptSubmittedBody,
                    textAlign: TextAlign.center,
                    style: context.bartalType.body.copyWith(color: bartal.textMute, height: 1.6)),
                const SizedBox(height: 28),
                Container(
                  padding: const EdgeInsetsDirectional.all(16),
                  decoration: BoxDecoration(
                    color: bartal.surface,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: bartal.line),
                  ),
                  child: OrderTimeline(steps: steps),
                ),
              ],
            ),
          ),
          SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsetsDirectional.fromSTEB(16, 10, 16, 16),
              child: Column(
                children: [
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      style: FilledButton.styleFrom(
                        backgroundColor: bartal.navy,
                        padding: const EdgeInsetsDirectional.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: () => context.pushReplacement('/orders/$orderId/track'),
                      child: Text(l10n.orderTrackCta,
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
                    ),
                  ),
                  const SizedBox(height: 10),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(color: bartal.line),
                        padding: const EdgeInsetsDirectional.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: () => context.go('/home'),
                      child: Text(l10n.cartContinueShopping,
                          style: TextStyle(color: bartal.text, fontWeight: FontWeight.w600)),
                    ),
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
