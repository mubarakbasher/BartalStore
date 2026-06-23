import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/api/envelope.dart';
import '../../../core/connectivity/connectivity_provider.dart';
import '../../../core/models/order.dart';
import '../../../core/utils/money.dart';
import '../../../core/utils/whatsapp.dart';
import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/error_screen.dart';
import '../../../widgets/price_tag.dart';
import '../../../widgets/product_image.dart';
import '../../../widgets/screen_header.dart';
import '../../checkout/data/banks.dart';
import '../../checkout/presentation/widgets/checkout_chrome.dart';
import '../application/order_detail_controller.dart';
import 'order_status_chip.dart';

/// Status-aware order detail — port of receipt-flow.jsx::OrderDetailScreen,
/// with the PAYMENT_REJECTED branch porting mobile-extras.jsx::ReceiptRejectedScreen.
/// The hero + primary CTA change with the order's status; items, delivery, and
/// payment summary always render below.
class OrderDetailScreen extends ConsumerWidget {
  const OrderDetailScreen({super.key, required this.orderId});

  final String orderId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final async = ref.watch(orderDetailProvider(orderId));

    return Scaffold(
      backgroundColor: bartal.bg,
      body: SafeArea(
        child: Column(
          children: [
            ScreenHeader(title: l10n.orderDetailTitle),
            Expanded(
              child: async.when(
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (error, _) {
                  final online = ref.read(isOnlineProvider);
                  return ErrorState(
                    kind: online ? ErrorScreenKind.error : ErrorScreenKind.offline,
                    onRetry: () => ref.read(orderDetailProvider(orderId).notifier).reload(),
                  );
                },
                data: (order) => _OrderDetailBody(order: order),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OrderDetailBody extends ConsumerWidget {
  const _OrderDetailBody({required this.order});

  final OrderView order;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';

    return ListView(
      padding: const EdgeInsetsDirectional.only(bottom: 28),
      children: [
        Padding(
          padding: const EdgeInsetsDirectional.fromSTEB(16, 10, 16, 0),
          child: _StatusHero(order: order),
        ),
        _ItemsSection(order: order),
        if (order.address != null) _DeliverySection(address: order.address!),
        _PaymentSection(order: order),
        _HelpCard(order: order),
        if (order.canCancel)
          Padding(
            padding: const EdgeInsetsDirectional.fromSTEB(16, 8, 16, 0),
            child: TextButton(
              onPressed: () => _confirmCancel(context, ref, order),
              child: Text(
                l10n.orderCancelCta,
                style: TextStyle(color: bartal.danger, fontWeight: FontWeight.w600),
              ),
            ),
          ),
        if (order.status == OrderStatus.cancelled && (order.cancellationReason?.isNotEmpty ?? false))
          Padding(
            padding: const EdgeInsetsDirectional.fromSTEB(16, 4, 16, 0),
            child: Text(
              order.cancellationReason!,
              textAlign: TextAlign.center,
              style: context.bartalType.small,
            ),
          ),
        Padding(
          padding: const EdgeInsetsDirectional.fromSTEB(16, 12, 16, 0),
          child: Text(
            localizedDigits('#${order.orderNumber}', arabic: isAr),
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontFamily: 'JetBrainsMono',
              fontSize: 11,
              color: Color(0x886B6356),
            ),
          ),
        ),
      ],
    );
  }
}

// ── Status hero ──────────────────────────────────────────────────────────

class _StatusHero extends StatelessWidget {
  const _StatusHero({required this.order});

  final OrderView order;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;

    final header = Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(l10n.confirmOrderNumber, style: context.bartalType.micro),
              const SizedBox(height: 2),
              Text(
                order.orderNumber,
                style: TextStyle(
                  fontFamily: 'JetBrainsMono',
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: bartal.text,
                ),
              ),
            ],
          ),
        ),
        OrderStatusChip(status: order.status),
      ],
    );

    if (order.isRejected) {
      return _HeroCard(
        bg: bartal.danger.withValues(alpha: 0.06),
        borderColor: bartal.danger.withValues(alpha: 0.25),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            header,
            const SizedBox(height: 14),
            Center(
              child: Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: bartal.danger.withValues(alpha: 0.08),
                  shape: BoxShape.circle,
                  border: Border.all(color: bartal.danger, width: 2),
                ),
                alignment: Alignment.center,
                child: Text('!',
                    style: TextStyle(color: bartal.danger, fontSize: 30, fontWeight: FontWeight.w800)),
              ),
            ),
            const SizedBox(height: 12),
            Text(l10n.orderRejectedTitle,
                textAlign: TextAlign.center,
                style: context.bartalType.h3.copyWith(fontWeight: FontWeight.w700)),
            const SizedBox(height: 6),
            Text(l10n.orderRejectedMessage,
                textAlign: TextAlign.center, style: context.bartalType.small),
            if (order.rejectionNote?.isNotEmpty ?? false) ...[
              const SizedBox(height: 12),
              Container(
                width: double.infinity,
                padding: const EdgeInsetsDirectional.all(12),
                decoration: BoxDecoration(
                  color: bartal.danger.withValues(alpha: 0.06),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: bartal.danger.withValues(alpha: 0.25)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(l10n.orderRejectedNoteTitle,
                        style: context.bartalType.micro.copyWith(
                            color: bartal.danger, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 6),
                    Text('«${order.rejectionNote!}»',
                        style: context.bartalType.small.copyWith(color: bartal.text, height: 1.6)),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 14),
            _HeroButton(
              label: l10n.orderReuploadReceiptCta,
              icon: BartalIcons.camera,
              color: bartal.amber,
              onTap: () => context.push('/orders/${order.id}/receipt'),
            ),
          ],
        ),
      );
    }

    if (order.canUploadReceipt) {
      // Bank transfer, AWAITING_PAYMENT.
      return _HeroCard(
        bg: bartal.amberTint,
        borderColor: bartal.amber.withValues(alpha: 0.25),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            header,
            const SizedBox(height: 10),
            Text(l10n.orderAwaitingReceiptMessage,
                style: context.bartalType.small.copyWith(color: bartal.text, height: 1.55)),
            const SizedBox(height: 12),
            _HeroButton(
              label: l10n.orderUploadReceiptCta,
              icon: BartalIcons.camera,
              color: bartal.amber,
              onTap: () => context.push('/orders/${order.id}/receipt'),
            ),
          ],
        ),
      );
    }

    if (order.status == OrderStatus.receiptUploaded) {
      return _HeroCard(
        bg: bartal.amberTint,
        borderColor: bartal.amber.withValues(alpha: 0.25),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            header,
            const SizedBox(height: 10),
            Text(l10n.orderUnderReviewMessage,
                style: context.bartalType.small.copyWith(color: bartal.text, height: 1.55)),
          ],
        ),
      );
    }

    if (order.isTrackable) {
      return _HeroCard(
        bg: bartal.surface,
        borderColor: bartal.line,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            header,
            const SizedBox(height: 12),
            _HeroButton(
              label: l10n.orderTrackCta,
              icon: BartalIcons.truck,
              color: bartal.navy,
              onTap: () => context.push('/orders/${order.id}/track'),
            ),
          ],
        ),
      );
    }

    // Pending COD (or any other non-actionable state): show context only.
    return _HeroCard(
      bg: bartal.surface,
      borderColor: bartal.line,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          header,
          if (!order.isBankTransfer && order.status == OrderStatus.pending) ...[
            const SizedBox(height: 10),
            Text(l10n.orderCodNote,
                style: context.bartalType.small.copyWith(color: bartal.text, height: 1.55)),
          ],
        ],
      ),
    );
  }
}

class _HeroCard extends StatelessWidget {
  const _HeroCard({required this.bg, required this.borderColor, required this.child});

  final Color bg;
  final Color borderColor;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsetsDirectional.all(16),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderColor),
      ),
      child: child,
    );
  }
}

class _HeroButton extends StatelessWidget {
  const _HeroButton({required this.label, required this.icon, required this.color, required this.onTap});

  final String label;
  final BartalIconSpec icon;
  final Color color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: Material(
        color: color,
        borderRadius: BorderRadius.circular(10),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(10),
          child: Container(
            height: 48,
            alignment: Alignment.center,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                BartalIcon(icon, color: Colors.white, size: 16),
                const SizedBox(width: 8),
                Text(label,
                    style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w700)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ── Sections ─────────────────────────────────────────────────────────────

class _ItemsSection extends StatelessWidget {
  const _ItemsSection({required this.order});

  final OrderView order;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';

    return CheckoutSection(
      title: l10n.orderItemsWithCount(localizedDigits('${order.items.length}', arabic: isAr)),
      child: Container(
        decoration: BoxDecoration(
          color: bartal.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: bartal.line),
        ),
        child: Column(
          children: [
            for (var i = 0; i < order.items.length; i++)
              _ItemRow(item: order.items[i], first: i == 0, showReview: order.isDelivered),
          ],
        ),
      ),
    );
  }
}

class _ItemRow extends StatelessWidget {
  const _ItemRow({required this.item, required this.first, required this.showReview});

  final OrderItem item;
  final bool first;
  final bool showReview;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';

    return Container(
      padding: const EdgeInsetsDirectional.all(12),
      decoration: BoxDecoration(
        border: first ? null : Border(top: BorderSide(color: bartal.line)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: SizedBox(
                  width: 56,
                  height: 56,
                  child: ProductThumb(
                    productId: item.productId,
                    imageUrl: item.image,
                    label: item.name(arabic: isAr),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.name(arabic: isAr),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: context.bartalType.label.copyWith(fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 3),
                    Text(l10n.orderItemQty(localizedDigits('${item.quantity}', arabic: isAr)),
                        style: context.bartalType.micro),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              PriceTag(amount: item.totalPrice, size: 13, color: bartal.text),
            ],
          ),
          if (showReview) ...[
            const SizedBox(height: 8),
            Align(
              alignment: AlignmentDirectional.centerStart,
              child: TextButton.icon(
                onPressed: () => context.push('/review/${item.productId}'),
                style: TextButton.styleFrom(
                  padding: const EdgeInsetsDirectional.symmetric(horizontal: 8, vertical: 4),
                  minimumSize: const Size(0, 36),
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                icon: BartalIcon(BartalIcons.star, color: bartal.amber, size: 16),
                label: Text(l10n.pdpWriteReview,
                    style: TextStyle(color: bartal.amber, fontWeight: FontWeight.w600, fontSize: 13)),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _DeliverySection extends StatelessWidget {
  const _DeliverySection({required this.address});

  final OrderAddress address;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;

    return CheckoutSection(
      title: l10n.orderDeliveryTo,
      child: Container(
        padding: const EdgeInsetsDirectional.all(14),
        decoration: BoxDecoration(
          color: bartal.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: bartal.line),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsetsDirectional.only(top: 2),
              child: BartalIcon(BartalIcons.pin, color: bartal.amber, size: 18),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(address.fullName,
                      style: context.bartalType.label.copyWith(fontWeight: FontWeight.w700)),
                  const SizedBox(height: 3),
                  Text(address.streetLine, style: context.bartalType.small.copyWith(height: 1.5)),
                  const SizedBox(height: 2),
                  Text('◉ ${address.landmark}',
                      style: context.bartalType.small.copyWith(color: bartal.amber)),
                  const SizedBox(height: 3),
                  Text(address.phone,
                      style: TextStyle(
                          fontFamily: 'JetBrainsMono', fontSize: 11, color: bartal.textMute)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PaymentSection extends StatelessWidget {
  const _PaymentSection({required this.order});

  final OrderView order;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final amountText = '${fmtSDG(order.total, arabic: isAr)} ${isAr ? 'ج.س' : 'SDG'}';
    final bank = bartalBanks.first;

    return CheckoutSection(
      title: l10n.orderPaymentSummary,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsetsDirectional.symmetric(horizontal: 14),
            decoration: BoxDecoration(
              color: bartal.surface,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: bartal.line),
            ),
            child: Column(
              children: [
                InfoRow(label: l10n.cartSubtotal, value: '${fmtSDG(order.subtotal, arabic: isAr)} ${isAr ? 'ج.س' : 'SDG'}'),
                InfoRow(label: l10n.cartDeliveryFee, value: '${fmtSDG(order.deliveryFee, arabic: isAr)} ${isAr ? 'ج.س' : 'SDG'}'),
                if (order.hasDiscount)
                  InfoRow(label: l10n.cartDiscount, value: '−${fmtSDG(order.discount, arabic: isAr)} ${isAr ? 'ج.س' : 'SDG'}'),
                InfoRow(label: l10n.cartTotal, value: amountText, valueColor: bartal.amber, last: true),
              ],
            ),
          ),
          if (order.isBankTransfer) ...[
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsetsDirectional.symmetric(horizontal: 12, vertical: 10),
              decoration: BoxDecoration(
                color: bartal.surface,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: bartal.line),
              ),
              child: Row(
                children: [
                  BartalIcon(BartalIcons.package, color: bartal.navy, size: 18),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('${l10n.paymentBankTransfer} · ${bank.name(arabic: isAr)}',
                            style: context.bartalType.small.copyWith(
                                color: bartal.text, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 2),
                        Text(l10n.orderBankRefLine(order.orderNumber),
                            style: context.bartalType.micro),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _HelpCard extends StatelessWidget {
  const _HelpCard({required this.order});

  final OrderView order;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    const whatsappGreen = Color(0xFF25D366);

    return Padding(
      padding: const EdgeInsetsDirectional.fromSTEB(16, 8, 16, 0),
      child: Material(
        color: whatsappGreen.withValues(alpha: 0.07),
        borderRadius: BorderRadius.circular(12),
        child: InkWell(
          onTap: () => launchWhatsApp(text: order.orderNumber),
          borderRadius: BorderRadius.circular(12),
          child: Container(
            padding: const EdgeInsetsDirectional.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: whatsappGreen.withValues(alpha: 0.3)),
            ),
            child: Row(
              children: [
                Container(
                  width: 30,
                  height: 30,
                  decoration: const BoxDecoration(color: whatsappGreen, shape: BoxShape.circle),
                  alignment: Alignment.center,
                  child: const Text('W',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 13)),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(l10n.orderHelpTitle,
                          style: context.bartalType.small.copyWith(
                              color: bartal.text, fontWeight: FontWeight.w600)),
                      const SizedBox(height: 2),
                      Text(l10n.orderHelpWhatsapp(bartalSupportPhoneDisplay),
                          style: context.bartalType.micro),
                    ],
                  ),
                ),
                BartalIcon(BartalIcons.arrow, color: bartal.textMute, size: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ── Cancel flow ──────────────────────────────────────────────────────────

Future<void> _confirmCancel(BuildContext context, WidgetRef ref, OrderView order) async {
  final l10n = L10n.of(context);
  final controller = TextEditingController();
  final confirmed = await showDialog<bool>(
    context: context,
    builder: (dialogContext) {
      final bartal = dialogContext.bartal;
      return AlertDialog(
        backgroundColor: bartal.surface,
        title: Text(l10n.orderCancelDialogTitle, style: dialogContext.bartalType.h3),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(l10n.orderCancelDialogBody, style: dialogContext.bartalType.small),
            const SizedBox(height: 12),
            TextField(
              controller: controller,
              maxLength: 300,
              minLines: 1,
              maxLines: 3,
              decoration: InputDecoration(
                hintText: l10n.orderCancelReasonHint,
                border: const OutlineInputBorder(),
                counterText: '',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(false),
            child: Text(l10n.orderCancelKeep),
          ),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: bartal.danger),
            onPressed: () => Navigator.of(dialogContext).pop(true),
            child: Text(l10n.orderCancelConfirm),
          ),
        ],
      );
    },
  );

  if (confirmed != true || !context.mounted) {
    controller.dispose();
    return;
  }

  final reason = controller.text.trim();
  controller.dispose();
  final arabic = Localizations.localeOf(context).languageCode == 'ar';
  try {
    await ref.read(orderDetailProvider(order.id).notifier).cancel(reason: reason.isEmpty ? null : reason);
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(l10n.orderCancelledToast)));
    }
  } catch (error) {
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(toApiException(error).localized(arabic: arabic))),
      );
    }
  }
}
