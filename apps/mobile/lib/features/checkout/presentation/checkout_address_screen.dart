import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/models/address.dart';
import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../address/application/addresses_controller.dart';
import '../application/checkout_controller.dart';
import 'widgets/checkout_chrome.dart';

/// Checkout step 1 — port of checkout-flow.jsx::CheckoutAddressScreen. Lists
/// saved addresses (select one) and an add-new button. The address's own zone
/// drives delivery (the design's separate zone grid is redundant with the
/// address zone, so it's shown as a read-only delivery summary on later steps).
class CheckoutAddressScreen extends ConsumerWidget {
  const CheckoutAddressScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final addresses = ref.watch(addressesControllerProvider);
    final selectedId = ref.watch(checkoutControllerProvider.select((s) => s.addressId));

    Future<void> addAddress() async {
      final created = await context.push<Address>('/addresses/new');
      if (created != null) {
        ref.read(checkoutControllerProvider.notifier).selectAddress(created.id);
      }
    }

    return addresses.when(
      loading: () => Scaffold(
        backgroundColor: bartal.bg,
        body: const Center(child: CircularProgressIndicator()),
      ),
      error: (error, _) => Scaffold(
        backgroundColor: bartal.bg,
        body: Center(child: Text('$error')),
      ),
      data: (list) {
        // Auto-select the default (or first) address once.
        if (selectedId == null && list.isNotEmpty) {
          final preferred = list.firstWhere((a) => a.isDefault, orElse: () => list.first);
          WidgetsBinding.instance.addPostFrameCallback((_) {
            ref.read(checkoutControllerProvider.notifier).selectAddress(preferred.id);
          });
        }
        final effectiveId = selectedId ?? (list.isNotEmpty ? list.first.id : null);

        return CheckoutScaffold(
          title: l10n.cartCheckout,
          step: 0,
          actionLabel: l10n.checkoutContinueToPayment,
          actionEnabled: effectiveId != null,
          onAction: () => context.push('/checkout/payment'),
          children: [
            CheckoutSection(
              title: l10n.checkoutAddressTitle,
              child: Column(
                children: [
                  if (list.isEmpty)
                    Padding(
                      padding: const EdgeInsetsDirectional.only(bottom: 12),
                      child: Text(l10n.checkoutNoAddresses, style: context.bartalType.small),
                    ),
                  for (final address in list)
                    Padding(
                      padding: const EdgeInsetsDirectional.only(bottom: 10),
                      child: _AddressCard(
                        address: address,
                        selected: address.id == effectiveId,
                        onTap: () =>
                            ref.read(checkoutControllerProvider.notifier).selectAddress(address.id),
                      ),
                    ),
                  _AddAddressButton(onTap: addAddress),
                ],
              ),
            ),
          ],
        );
      },
    );
  }
}

class _AddressCard extends StatelessWidget {
  const _AddressCard({required this.address, required this.selected, required this.onTap});

  final Address address;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    return Material(
      color: bartal.surface,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          padding: const EdgeInsetsDirectional.all(14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: selected ? bartal.amber : bartal.line, width: selected ? 2 : 1),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsetsDirectional.symmetric(horizontal: 10, vertical: 3),
                    decoration: BoxDecoration(
                      color: selected ? bartal.amberTint : (bartal.isDark ? bartal.raised : bartal.bg),
                      borderRadius: BorderRadius.circular(100),
                    ),
                    child: Text(
                      address.label,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: selected ? bartal.amber : bartal.textMute,
                      ),
                    ),
                  ),
                  if (selected) ...[
                    const SizedBox(width: 8),
                    Text(
                      '● ${l10n.checkoutSelected}',
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: bartal.amber),
                    ),
                  ],
                ],
              ),
              const SizedBox(height: 6),
              Text(address.fullName, style: context.bartalType.label.copyWith(fontWeight: FontWeight.w600)),
              Text(address.phone,
                  style: context.bartalType.small.copyWith(fontFamily: 'JetBrainsMono')),
              const SizedBox(height: 8),
              Text(address.streetLine, style: context.bartalType.body),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsetsDirectional.symmetric(horizontal: 10, vertical: 8),
                decoration: BoxDecoration(
                  color: bartal.isDark ? bartal.raised : bartal.bg,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: [
                    BartalIcon(BartalIcons.pin, color: bartal.amber, size: 14),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(address.landmark,
                          maxLines: 1, overflow: TextOverflow.ellipsis, style: context.bartalType.small),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _AddAddressButton extends StatelessWidget {
  const _AddAddressButton({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: DottedBorderBox(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.add, size: 18, color: bartal.navy),
            const SizedBox(width: 6),
            Text(
              l10n.checkoutAddNewAddress,
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: bartal.navy),
            ),
          ],
        ),
      ),
    );
  }
}

/// Dashed-border container (CustomPaint) for the add-new affordance.
class DottedBorderBox extends StatelessWidget {
  const DottedBorderBox({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return CustomPaint(
      painter: _DashedRectPainter(color: bartal.line),
      child: Container(
        padding: const EdgeInsetsDirectional.symmetric(vertical: 14, horizontal: 14),
        alignment: Alignment.center,
        child: child,
      ),
    );
  }
}

class _DashedRectPainter extends CustomPainter {
  _DashedRectPainter({required this.color});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;
    final rrect = RRect.fromRectAndRadius(Offset.zero & size, const Radius.circular(14));
    final path = Path()..addRRect(rrect);
    const dash = 6.0, gap = 4.0;
    for (final metric in path.computeMetrics()) {
      var distance = 0.0;
      while (distance < metric.length) {
        canvas.drawPath(metric.extractPath(distance, distance + dash), paint);
        distance += dash + gap;
      }
    }
  }

  @override
  bool shouldRepaint(_DashedRectPainter oldDelegate) => color != oldDelegate.color;
}
