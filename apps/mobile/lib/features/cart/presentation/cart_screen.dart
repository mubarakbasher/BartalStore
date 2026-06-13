import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/models/cart.dart';
import '../../../core/utils/money.dart';
import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../design/tokens.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/empty_state.dart';
import '../../../widgets/price_tag.dart';
import '../../../widgets/product_image.dart';
import '../../../widgets/screen_header.dart';
import '../../auth/application/auth_controller.dart';
import '../application/cart_controller.dart';

/// Cart — port of secondary-screens.jsx::CartScreen: line items with qty
/// adjusters, a summary box, and a sticky checkout bar. Backed by the
/// offline-resilient cart controller (guest + server).
class CartScreen extends ConsumerWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final cart = ref.watch(cartControllerProvider);

    return Scaffold(
      backgroundColor: bartal.bg,
      body: SafeArea(
        child: cart.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, _) => Center(child: Text('$error')),
          data: (state) {
            if (state.isEmpty) {
              return EmptyState(kind: EmptyStateKind.cart, onCta: () => context.go('/home'));
            }
            return Column(
              children: [
                ScreenHeader(title: l10n.cartTitle, onBack: () => context.go('/home')),
                Expanded(
                  child: ListView(
                    padding: const EdgeInsetsDirectional.fromSTEB(16, 10, 16, 16),
                    children: [
                      for (final line in state.lines)
                        Padding(
                          padding: const EdgeInsetsDirectional.only(bottom: 12),
                          child: _CartItem(line: line),
                        ),
                      const SizedBox(height: 4),
                      _SummaryBox(state: state),
                    ],
                  ),
                ),
                _CheckoutBar(state: state),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _CartItem extends ConsumerWidget {
  const _CartItem({required this.line});

  final CartLine line;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bartal = context.bartal;
    final arabic = Localizations.localeOf(context).languageCode == 'ar';
    final notifier = ref.read(cartControllerProvider.notifier);

    return Container(
      padding: const EdgeInsetsDirectional.all(10),
      decoration: BoxDecoration(
        color: bartal.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: bartal.line),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: SizedBox(
              width: 72,
              height: 72,
              child: ProductThumb(productId: line.productId, imageUrl: line.imageUrl, label: line.nameEn),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  line.name(arabic: arabic),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: context.bartalType.label.copyWith(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    PriceTag(amount: line.lineTotal, size: 14, color: bartal.amber),
                    _QtyAdjuster(
                      quantity: line.quantity,
                      stock: line.stock,
                      onChanged: (q) => notifier.setQuantity(line.productId, q),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _QtyAdjuster extends StatelessWidget {
  const _QtyAdjuster({required this.quantity, required this.stock, required this.onChanged});

  final int quantity;
  final int stock;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    final arabic = Localizations.localeOf(context).languageCode == 'ar';
    final canIncrement = quantity < stock;
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        _QtyButton(
          icon: '−',
          onTap: () => onChanged(quantity - 1),
          background: bartal.isDark ? bartal.raised : BartalColors.sand,
        ),
        Container(
          constraints: const BoxConstraints(minWidth: 28),
          alignment: Alignment.center,
          child: Text(
            localizedDigits('$quantity', arabic: arabic),
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
          ),
        ),
        _QtyButton(
          icon: '+',
          onTap: canIncrement ? () => onChanged(quantity + 1) : null,
          background: bartal.isDark ? bartal.raised : BartalColors.sand,
        ),
      ],
    );
  }
}

class _QtyButton extends StatelessWidget {
  const _QtyButton({required this.icon, required this.onTap, required this.background});

  final String icon;
  final VoidCallback? onTap;
  final Color background;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Opacity(
      opacity: onTap == null ? 0.4 : 1,
      child: Material(
        color: background,
        borderRadius: BorderRadius.circular(8),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(8),
          child: SizedBox(
            width: 30,
            height: 30,
            child: Center(
              child: Text(
                icon,
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: bartal.text, height: 1),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _SummaryBox extends StatelessWidget {
  const _SummaryBox({required this.state});

  final CartState state;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final preview = state.deliveryPreview;

    return Container(
      padding: const EdgeInsetsDirectional.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: bartal.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: bartal.line),
      ),
      child: Column(
        children: [
          _SummaryRow(label: l10n.cartSubtotal, value: PriceTag(amount: state.subtotal, size: 14, strong: false)),
          if (preview != null)
            _SummaryRow(
              label: l10n.cartDeliveryFee,
              value: preview.freeDelivery
                  ? Text(l10n.deliveryFreeDelivery,
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: bartal.success))
                  : PriceTag(amount: preview.fee, size: 14, strong: false),
            ),
          Container(height: 1, margin: const EdgeInsetsDirectional.symmetric(vertical: 10), color: bartal.line),
          _SummaryRow(
            label: l10n.cartTotal,
            bold: true,
            value: PriceTag(amount: state.total, size: 18, color: bartal.amber),
          ),
        ],
      ),
    );
  }
}

class _SummaryRow extends StatelessWidget {
  const _SummaryRow({required this.label, required this.value, this.bold = false});

  final String label;
  final Widget value;
  final bool bold;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Padding(
      padding: const EdgeInsetsDirectional.symmetric(vertical: 6),
      child: Row(
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
      ),
    );
  }
}

class _CheckoutBar extends ConsumerWidget {
  const _CheckoutBar({required this.state});

  final CartState state;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;

    void onCheckout() {
      final authed = ref.read(authControllerProvider.notifier).isAuthenticated;
      if (!authed) {
        context.push(Uri(path: '/welcome', queryParameters: {'from': '/checkout/address'}).toString());
      } else {
        context.push('/checkout/address');
      }
    }

    return Container(
      decoration: BoxDecoration(
        color: bartal.surface,
        border: Border(top: BorderSide(color: bartal.line)),
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsetsDirectional.fromSTEB(16, 14, 16, 14),
          child: Material(
            color: bartal.navy,
            borderRadius: BorderRadius.circular(14),
            child: InkWell(
              onTap: onCheckout,
              borderRadius: BorderRadius.circular(14),
              child: Container(
                height: 52,
                alignment: Alignment.center,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      l10n.cartCheckout,
                      style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(width: 8),
                    PriceTag(amount: state.total, size: 14, color: Colors.white),
                    const SizedBox(width: 8),
                    const BartalIcon(BartalIcons.arrow, color: Colors.white, size: 16),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
