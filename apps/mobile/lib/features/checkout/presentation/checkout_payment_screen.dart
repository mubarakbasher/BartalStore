import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/models/order.dart';
import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../application/checkout_controller.dart';
import 'widgets/checkout_chrome.dart';

/// Checkout step 2 — port of checkout-flow.jsx::CheckoutPaymentScreen.
/// Bank transfer (recommended) + COD are both real (the API accepts both);
/// mobile-wallet is disabled "soon". The promo input is omitted (no
/// apply-promo endpoint — discount is always 0). COD has no surcharge: the API
/// charges only the zone delivery fee, so the design's "+fee" is not applied.
class CheckoutPaymentScreen extends ConsumerWidget {
  const CheckoutPaymentScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final method = ref.watch(checkoutControllerProvider.select((s) => s.paymentMethod));
    final notifier = ref.read(checkoutControllerProvider.notifier);

    return CheckoutScaffold(
      title: l10n.cartCheckout,
      step: 1,
      actionLabel: l10n.paymentContinue,
      onAction: () => context.push(
        method == PaymentMethod.bankTransfer ? '/checkout/bank' : '/checkout/review',
      ),
      children: [
        CheckoutSection(
          title: l10n.paymentMethodTitle,
          child: Column(
            children: [
              _PayOption(
                icon: BartalIcons.bag,
                title: l10n.paymentBankTransfer,
                subtitle: l10n.paymentBankSub,
                badge: l10n.paymentRecommended,
                selected: method == PaymentMethod.bankTransfer,
                onTap: () => notifier.selectPayment(PaymentMethod.bankTransfer),
              ),
              const SizedBox(height: 10),
              _PayOption(
                icon: BartalIcons.truck,
                title: l10n.paymentCod,
                subtitle: l10n.paymentCodSub,
                selected: method == PaymentMethod.cashOnDelivery,
                onTap: () => notifier.selectPayment(PaymentMethod.cashOnDelivery),
              ),
              const SizedBox(height: 10),
              _PayOption(
                icon: BartalIcons.user,
                title: l10n.paymentWallet,
                subtitle: l10n.paymentWalletSub,
                badge: l10n.paymentSoon,
                badgeMuted: true,
                disabled: true,
                selected: false,
                onTap: () {},
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _PayOption extends StatelessWidget {
  const _PayOption({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.selected,
    required this.onTap,
    this.badge,
    this.badgeMuted = false,
    this.disabled = false,
  });

  final BartalIconSpec icon;
  final String title;
  final String subtitle;
  final bool selected;
  final VoidCallback onTap;
  final String? badge;
  final bool badgeMuted;
  final bool disabled;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return SelectableCard(
      selected: selected,
      disabled: disabled,
      onTap: onTap,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: bartal.isDark ? bartal.raised : bartal.bg,
              borderRadius: BorderRadius.circular(10),
            ),
            alignment: Alignment.center,
            child: BartalIcon(icon, color: bartal.navy, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        title,
                        style: context.bartalType.label.copyWith(fontWeight: FontWeight.w700),
                      ),
                    ),
                    if (badge != null) ...[
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsetsDirectional.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: badgeMuted
                              ? (bartal.isDark ? bartal.raised : bartal.bg)
                              : bartal.amberTint,
                          borderRadius: BorderRadius.circular(100),
                        ),
                        child: Text(
                          badge!,
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: badgeMuted ? bartal.textMute : bartal.amber,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 3),
                Text(subtitle, style: context.bartalType.small),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Padding(
            padding: const EdgeInsetsDirectional.only(top: 10),
            child: RadioDot(selected: selected),
          ),
        ],
      ),
    );
  }
}
