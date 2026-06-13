import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/models/order.dart';
import '../../../core/utils/money.dart';
import '../../../design/icons.dart';
import '../../../design/motif.dart';
import '../../../design/theme.dart';
import '../../../design/tokens.dart';
import '../../../l10n/gen/l10n.dart';
import '../../orders/application/orders_controller.dart';
import '../data/banks.dart';
import 'widgets/checkout_chrome.dart';

/// Order confirmation — port of secondary-screens.jsx::ConfirmScreen. Motif
/// hero + success + order number; bank-transfer instructions (selected bank,
/// amount, reference = order number) for bank orders, or a cash-on-delivery
/// note for COD. The receipt-upload box is deferred to Slice 4 (its buttons are
/// disabled). "View order" → orders; "Continue shopping" → home.
class ConfirmScreen extends ConsumerWidget {
  const ConfirmScreen({super.key, required this.orderId, required this.bankId});

  final String orderId;
  final String bankId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bartal = context.bartal;
    final order = ref.watch(orderDetailProvider(orderId));

    return Scaffold(
      backgroundColor: bartal.bg,
      body: SafeArea(
        child: order.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, _) => Center(child: Text('$error')),
          data: (data) => _ConfirmBody(order: data, bankId: bankId),
        ),
      ),
    );
  }
}

class _ConfirmBody extends StatelessWidget {
  const _ConfirmBody({required this.order, required this.bankId});

  final OrderView order;
  final String bankId;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final isBank = order.paymentMethod == PaymentMethod.bankTransfer;
    final bank = bartalBanks.firstWhere((b) => b.id == bankId, orElse: () => bartalBanks.first);
    final amountText = '${fmtSDG(order.total, arabic: isAr)} ${isAr ? 'ج.س' : 'SDG'}';

    return ListView(
      padding: const EdgeInsetsDirectional.fromSTEB(16, 8, 16, 24),
      children: [
        // Motif hero card with success + order number.
        ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: Container(
            decoration: BoxDecoration(
              color: bartal.isDark ? bartal.raised : bartal.surface,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: bartal.line),
            ),
            child: MotifBackground(
              child: Padding(
                padding: const EdgeInsetsDirectional.fromSTEB(16, 24, 16, 20),
                child: Column(
                  children: [
                    Container(
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(color: bartal.success, shape: BoxShape.circle),
                      child: const BartalIcon(BartalIcons.check, color: Colors.white, size: 32),
                    ),
                    const SizedBox(height: 12),
                    Text(l10n.confirmTitle, textAlign: TextAlign.center, style: context.bartalType.h1),
                    const SizedBox(height: 8),
                    Text(l10n.confirmOrderNumber, style: context.bartalType.small),
                    const SizedBox(height: 2),
                    Text(
                      order.orderNumber,
                      style: const TextStyle(
                        fontFamily: 'JetBrainsMono',
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
        const SizedBox(height: 16),
        if (isBank)
          ..._bankInstructions(context, l10n, bartal, bank, amountText, order.orderNumber)
        else
          _codNote(context, l10n, bartal),
        const SizedBox(height: 20),
        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: () => context.go('/orders'),
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: bartal.navy),
                  padding: const EdgeInsetsDirectional.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: Text(l10n.confirmViewOrder,
                    style: TextStyle(color: bartal.isDark ? bartal.text : bartal.navy, fontWeight: FontWeight.w600)),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: FilledButton(
                onPressed: () => context.go('/home'),
                style: FilledButton.styleFrom(
                  backgroundColor: bartal.navy,
                  padding: const EdgeInsetsDirectional.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: Text(l10n.confirmContinueShopping,
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
              ),
            ),
          ],
        ),
      ],
    );
  }

  List<Widget> _bankInstructions(BuildContext context, L10n l10n, BartalTheme bartal, BankInfo bank,
      String amountText, String reference) {
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    return [
      CheckoutSection(
        title: l10n.confirmBankInstructions,
        child: Container(
          padding: const EdgeInsetsDirectional.all(14),
          decoration: BoxDecoration(
            color: bartal.surface,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: bartal.line),
          ),
          child: Column(
            children: [
              InfoRow(label: l10n.paymentBankTransfer, value: bank.name(arabic: isAr)),
              InfoRow(label: l10n.bankAccountName, value: isAr ? bankAccountHolderAr : bankAccountHolderEn),
              InfoRow(label: l10n.bankAccountNumber, value: bank.account, copyText: bank.account, mono: true),
              InfoRow(label: l10n.confirmAmount, value: amountText, copyText: amountText, valueColor: bartal.amber),
              InfoRow(label: l10n.bankReference, value: reference, copyText: reference, mono: true, last: true),
            ],
          ),
        ),
      ),
      // Receipt upload — deferred to Slice 4; box shown disabled.
      Padding(
        padding: const EdgeInsetsDirectional.symmetric(horizontal: 16),
        child: Container(
          padding: const EdgeInsetsDirectional.symmetric(horizontal: 16, vertical: 20),
          decoration: BoxDecoration(
            color: bartal.amberTint,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: bartal.amber, width: 1.5),
          ),
          child: Column(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(color: bartal.amber, shape: BoxShape.circle),
                child: const BartalIcon(BartalIcons.camera, color: Colors.white, size: 26),
              ),
              const SizedBox(height: 10),
              Text(l10n.confirmUploadTitle,
                  style: context.bartalType.label.copyWith(fontWeight: FontWeight.w700, color: BartalColors.navyInk)),
              const SizedBox(height: 4),
              Text(l10n.confirmReceiptLater,
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 13, height: 1.5, color: bartal.textMute)),
            ],
          ),
        ),
      ),
    ];
  }

  Widget _codNote(BuildContext context, L10n l10n, BartalTheme bartal) {
    return CheckoutSection(
      title: l10n.confirmCodTitle,
      child: Container(
        padding: const EdgeInsetsDirectional.all(16),
        decoration: BoxDecoration(
          color: bartal.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: bartal.line),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: bartal.success.withValues(alpha: 0.13),
                shape: BoxShape.circle,
              ),
              alignment: Alignment.center,
              child: BartalIcon(BartalIcons.truck, color: bartal.success, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(l10n.confirmCodBody, style: context.bartalType.body.copyWith(height: 1.5)),
            ),
          ],
        ),
      ),
    );
  }
}
