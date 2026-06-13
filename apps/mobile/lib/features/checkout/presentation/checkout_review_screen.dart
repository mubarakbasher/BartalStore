import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/api/envelope.dart';
import '../../../core/models/address.dart';
import '../../../core/models/cart.dart';
import '../../../core/models/order.dart';
import '../../../core/utils/money.dart';
import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/price_tag.dart';
import '../../../widgets/product_image.dart';
import '../../address/application/addresses_controller.dart';
import '../../cart/application/cart_controller.dart';
import '../../delivery/application/delivery_providers.dart';
import '../application/checkout_controller.dart';
import 'widgets/checkout_chrome.dart';

/// Checkout step 3 — port of checkout-flow.jsx::CheckoutReviewScreen. Recaps
/// the address + payment, lists items, computes totals from the cart subtotal
/// plus the selected address's zone delivery fee, and places the order.
class CheckoutReviewScreen extends ConsumerStatefulWidget {
  const CheckoutReviewScreen({super.key});

  @override
  ConsumerState<CheckoutReviewScreen> createState() => _CheckoutReviewScreenState();
}

class _CheckoutReviewScreenState extends ConsumerState<CheckoutReviewScreen> {
  bool _submitting = false;

  Future<void> _placeOrder() async {
    final l10n = L10n.of(context);
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    setState(() => _submitting = true);
    try {
      // Capture the bank before placeOrder resets the checkout state.
      final bankId = ref.read(checkoutControllerProvider).bankId;
      final order = await ref.read(checkoutControllerProvider.notifier).placeOrder();
      if (mounted) {
        context.go(Uri(path: '/order-confirm/${order.id}', queryParameters: {'bank': bankId}).toString());
      }
    } catch (error) {
      if (!mounted) return;
      final message = error is StateError ? l10n.actionFailed : toApiException(error).localized(arabic: isAr);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final checkout = ref.watch(checkoutControllerProvider);
    final cart = ref.watch(cartControllerProvider).valueOrNull ?? CartState.empty;
    final addresses = ref.watch(addressesControllerProvider).valueOrNull ?? const [];
    final address = addresses.where((a) => a.id == checkout.addressId).firstOrNull;

    final feeAsync = address == null
        ? null
        : ref.watch(deliveryFeeProvider(
            (zone: address.zone, total: cart.subtotal.value.toDouble().round())));
    final fee = feeAsync?.valueOrNull?.fee ?? Money.zero;
    final freeDelivery = feeAsync?.valueOrNull?.freeDelivery ?? false;
    final total = cart.subtotal + fee;

    return CheckoutScaffold(
      title: l10n.cartCheckout,
      step: 2,
      actionLabel: l10n.reviewPlaceOrder,
      actionEnabled: address != null && !cart.isEmpty,
      actionLoading: _submitting,
      onAction: _placeOrder,
      children: [
        if (address != null)
          CheckoutSection(
            title: l10n.checkoutAddressTitle,
            trailing: _EditLink(onTap: () => context.go('/checkout/address')),
            child: _RecapCard(child: _AddressRecap(address: address)),
          ),
        CheckoutSection(
          title: l10n.reviewPaymentTitle,
          trailing: _EditLink(onTap: () => context.go('/checkout/payment')),
          child: _RecapCard(child: _PaymentRecap(method: checkout.paymentMethod, bankName: checkout.bank.name(arabic: Localizations.localeOf(context).languageCode == 'ar'))),
        ),
        CheckoutSection(
          title: l10n.reviewItemsTitle,
          child: _RecapCard(
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                for (var i = 0; i < cart.lines.length; i++)
                  _ItemRow(line: cart.lines[i], last: i == cart.lines.length - 1),
              ],
            ),
          ),
        ),
        CheckoutSection(
          title: l10n.reviewTotalsTitle,
          child: _RecapCard(
            child: Column(
              children: [
                _TotalRow(label: l10n.cartSubtotal, value: PriceTag(amount: cart.subtotal, size: 14, strong: false)),
                const SizedBox(height: 8),
                _TotalRow(
                  label: l10n.cartDeliveryFee,
                  value: freeDelivery
                      ? Text(l10n.deliveryFreeDelivery,
                          style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: bartal.success))
                      : PriceTag(amount: fee, size: 14, strong: false),
                ),
                Container(height: 1, margin: const EdgeInsetsDirectional.symmetric(vertical: 10), color: bartal.line),
                _TotalRow(
                  label: l10n.cartTotal,
                  bold: true,
                  value: PriceTag(amount: total, size: 20, color: bartal.amber),
                ),
              ],
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsetsDirectional.fromSTEB(16, 0, 16, 8),
          child: Text(
            l10n.reviewTerms,
            textAlign: TextAlign.center,
            style: context.bartalType.small.copyWith(height: 1.5),
          ),
        ),
      ],
    );
  }
}

class _EditLink extends StatelessWidget {
  const _EditLink({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return GestureDetector(
      onTap: onTap,
      child: Text(
        L10n.of(context).checkoutEdit,
        style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: bartal.amber),
      ),
    );
  }
}

class _RecapCard extends StatelessWidget {
  const _RecapCard({required this.child, this.padding = const EdgeInsetsDirectional.all(14)});

  final Widget child;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: bartal.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: bartal.line),
      ),
      child: child,
    );
  }
}

class _AddressRecap extends StatelessWidget {
  const _AddressRecap({required this.address});

  final Address address;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(address.fullName, style: context.bartalType.label.copyWith(fontWeight: FontWeight.w600)),
        Text(address.phone, style: context.bartalType.small.copyWith(fontFamily: 'JetBrainsMono')),
        const SizedBox(height: 6),
        Text(address.streetLine, style: context.bartalType.body),
        const SizedBox(height: 4),
        Text('◉ ${address.landmark}',
            style: context.bartalType.small.copyWith(color: bartal.amber)),
      ],
    );
  }
}

class _PaymentRecap extends StatelessWidget {
  const _PaymentRecap({required this.method, required this.bankName});

  final PaymentMethod method;
  final String bankName;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isBank = method == PaymentMethod.bankTransfer;
    return Row(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: bartal.isDark ? bartal.raised : bartal.bg,
            borderRadius: BorderRadius.circular(10),
          ),
          alignment: Alignment.center,
          child: BartalIcon(isBank ? BartalIcons.bag : BartalIcons.truck, color: bartal.navy, size: 20),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(isBank ? l10n.paymentBankTransfer : l10n.paymentCod,
                  style: context.bartalType.label.copyWith(fontWeight: FontWeight.w700)),
              const SizedBox(height: 2),
              Text(isBank ? bankName : l10n.paymentCodSub, style: context.bartalType.small),
            ],
          ),
        ),
      ],
    );
  }
}

class _ItemRow extends StatelessWidget {
  const _ItemRow({required this.line, required this.last});

  final CartLine line;
  final bool last;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    final l10n = L10n.of(context);
    final arabic = Localizations.localeOf(context).languageCode == 'ar';
    return Container(
      padding: const EdgeInsetsDirectional.all(12),
      decoration: BoxDecoration(
        border: last ? null : Border(bottom: BorderSide(color: bartal.line)),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: SizedBox(
              width: 48,
              height: 48,
              child: ProductThumb(productId: line.productId, imageUrl: line.imageUrl, label: line.nameEn),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(line.name(arabic: arabic),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: context.bartalType.label.copyWith(fontWeight: FontWeight.w600)),
                const SizedBox(height: 2),
                Text(
                  l10n.reviewQtyEach(
                    localizedDigits('${line.quantity}', arabic: arabic),
                    '${fmtSDG(line.unitPrice, arabic: arabic)} ${arabic ? 'ج.س' : 'SDG'}',
                  ),
                  style: context.bartalType.small,
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          PriceTag(amount: line.lineTotal, size: 14),
        ],
      ),
    );
  }
}

class _TotalRow extends StatelessWidget {
  const _TotalRow({required this.label, required this.value, this.bold = false});

  final String label;
  final Widget value;
  final bool bold;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: context.bartalType.body.copyWith(
            color: bold ? bartal.text : bartal.textMute,
            fontWeight: bold ? FontWeight.w700 : FontWeight.w400,
          ),
        ),
        value,
      ],
    );
  }
}
