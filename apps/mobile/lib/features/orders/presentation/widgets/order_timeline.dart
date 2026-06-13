import 'package:flutter/material.dart';

import '../../../../core/utils/money.dart';
import '../../../../design/icons.dart';
import '../../../../design/theme.dart';

enum TimelineState { done, active, pending }

class OrderTimelineStep {
  const OrderTimelineStep({required this.label, this.time, required this.state});

  final String label;
  final String? time;
  final TimelineState state;
}

/// Vertical done/active/pending step list — port of the timeline blocks in
/// receipt-flow.jsx (ReceiptSubmittedScreen + TrackingScreen). Shared so both
/// the order-detail/tracking timeline and the receipt-submitted preview render
/// identically.
class OrderTimeline extends StatelessWidget {
  const OrderTimeline({super.key, required this.steps});

  final List<OrderTimelineStep> steps;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Column(
      children: [
        for (var i = 0; i < steps.length; i++)
          _Row(step: steps[i], isLast: i == steps.length - 1, bartal: bartal),
      ],
    );
  }
}

class _Row extends StatelessWidget {
  const _Row({required this.step, required this.isLast, required this.bartal});

  final OrderTimelineStep step;
  final bool isLast;
  final BartalTheme bartal;

  @override
  Widget build(BuildContext context) {
    final done = step.state == TimelineState.done;
    final active = step.state == TimelineState.active;
    final dotColor = done
        ? bartal.success
        : active
            ? bartal.amber
            : (bartal.isDark ? bartal.raised : bartal.line);
    final connectorColor = done ? bartal.success : (bartal.isDark ? bartal.raised : bartal.line);

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            children: [
              Container(
                width: 22,
                height: 22,
                decoration: BoxDecoration(
                  color: dotColor,
                  shape: BoxShape.circle,
                  boxShadow: active
                      ? [BoxShadow(color: bartal.amber.withValues(alpha: 0.30), spreadRadius: 5)]
                      : null,
                ),
                child: done
                    ? const Center(child: BartalIcon(BartalIcons.check, color: Colors.white, size: 12))
                    : active
                        ? Center(
                            child: Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                            ),
                          )
                        : null,
              ),
              if (!isLast)
                Expanded(
                  child: Container(width: 2, margin: const EdgeInsetsDirectional.only(top: 2), color: connectorColor),
                ),
            ],
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Padding(
              padding: EdgeInsetsDirectional.only(bottom: isLast ? 0 : 16, top: 1),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Text(
                      step.label,
                      style: context.bartalType.label.copyWith(
                        fontWeight: active ? FontWeight.w700 : FontWeight.w500,
                        color: step.state == TimelineState.pending ? bartal.textMute : bartal.text,
                      ),
                    ),
                  ),
                  if (step.time != null) ...[
                    const SizedBox(width: 8),
                    Text(step.time!, style: context.bartalType.micro),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Compact "d/m · HH:mm" event label, locale-aware digits (no intl locale data
/// needed). Same-day events drop the date.
String orderEventTimeLabel(DateTime dt, {required bool arabic, DateTime? now}) {
  final local = dt.toLocal();
  final today = (now ?? DateTime.now()).toLocal();
  String two(int v) => v.toString().padLeft(2, '0');
  final time = '${two(local.hour)}:${two(local.minute)}';
  final sameDay = local.year == today.year && local.month == today.month && local.day == today.day;
  final raw = sameDay ? time : '${local.day}/${local.month} · $time';
  return localizedDigits(raw, arabic: arabic);
}
