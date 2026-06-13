import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/utils/money.dart';
import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../cart/application/cart_controller.dart';
import '../application/checkout_controller.dart';
import '../data/banks.dart';
import 'widgets/checkout_chrome.dart';

/// Checkout step 2B — port of checkout-flow.jsx::CheckoutBankScreen. The 3
/// banks are hardcoded (no API endpoint — see data/banks.dart). The amount is
/// the cart total; the order-number reference appears on the confirm screen
/// after placing the order.
class CheckoutBankScreen extends ConsumerWidget {
  const CheckoutBankScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final arabic = Localizations.localeOf(context).languageCode == 'ar';
    final selectedBankId = ref.watch(checkoutControllerProvider.select((s) => s.bankId));
    final notifier = ref.read(checkoutControllerProvider.notifier);
    final total = ref.watch(cartControllerProvider).valueOrNull?.total ?? Money.zero;
    final amountText = '${fmtSDG(total, arabic: arabic)} ${arabic ? 'ج.س' : 'SDG'}';

    return CheckoutScaffold(
      title: l10n.cartCheckout,
      step: 1,
      actionLabel: l10n.bankContinueToReview,
      onAction: () => context.push('/checkout/review'),
      children: [
        Container(
          margin: const EdgeInsetsDirectional.fromSTEB(16, 0, 16, 14),
          padding: const EdgeInsetsDirectional.all(14),
          decoration: BoxDecoration(
            color: bartal.amberTint,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: bartal.amber.withValues(alpha: 0.4)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(l10n.bankChooseTitle,
                  style: context.bartalType.label.copyWith(fontWeight: FontWeight.w700)),
              const SizedBox(height: 4),
              Text(l10n.bankChooseBody,
                  style: context.bartalType.small.copyWith(color: bartal.text, height: 1.5)),
            ],
          ),
        ),
        CheckoutSection(
          title: l10n.bankStepTitle,
          child: Column(
            children: [
              for (final bank in bartalBanks)
                Padding(
                  padding: const EdgeInsetsDirectional.only(bottom: 10),
                  child: _BankCard(
                    bank: bank,
                    selected: bank.id == selectedBankId,
                    amountText: amountText,
                    onTap: () => notifier.selectBank(bank.id),
                  ),
                ),
            ],
          ),
        ),
        CheckoutSection(
          title: l10n.bankImportantNote,
          child: Container(
            padding: const EdgeInsetsDirectional.all(14),
            decoration: BoxDecoration(
              color: bartal.surface,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: bartal.line),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _NoteLine(l10n.bankNote1),
                _NoteLine(l10n.bankNote2),
                _NoteLine(l10n.bankNote3),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _BankCard extends StatelessWidget {
  const _BankCard({
    required this.bank,
    required this.selected,
    required this.amountText,
    required this.onTap,
  });

  final BankInfo bank;
  final bool selected;
  final String amountText;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final arabic = Localizations.localeOf(context).languageCode == 'ar';

    return SelectableCard(
      selected: selected,
      onTap: onTap,
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: bartal.isDark ? bartal.raised : bartal.bg,
                  borderRadius: BorderRadius.circular(10),
                ),
                alignment: Alignment.center,
                child: BartalIcon(BartalIcons.bag, color: bartal.navy, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(bank.name(arabic: arabic),
                        style: context.bartalType.label.copyWith(fontWeight: FontWeight.w700)),
                    const SizedBox(height: 2),
                    Text(bank.account,
                        style: context.bartalType.small.copyWith(fontFamily: 'JetBrainsMono')),
                  ],
                ),
              ),
              RadioDot(selected: selected),
            ],
          ),
          if (selected) ...[
            const SizedBox(height: 10),
            Container(height: 1, color: bartal.line),
            InfoRow(
              label: l10n.bankAccountName,
              value: arabic ? bankAccountHolderAr : bankAccountHolderEn,
            ),
            InfoRow(label: l10n.bankAccountNumber, value: bank.account, copyText: bank.account, mono: true),
            InfoRow(label: l10n.bankSwift, value: bank.swift, copyText: bank.swift, mono: true),
            InfoRow(
              label: l10n.bankAmount,
              value: amountText,
              copyText: amountText,
              valueColor: bartal.amber,
              last: true,
            ),
          ],
        ],
      ),
    );
  }
}

class _NoteLine extends StatelessWidget {
  const _NoteLine(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Padding(
      padding: const EdgeInsetsDirectional.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsetsDirectional.only(top: 6, end: 8),
            child: Container(
              width: 4,
              height: 4,
              decoration: BoxDecoration(color: bartal.amber, shape: BoxShape.circle),
            ),
          ),
          Expanded(
            child: Text(text, style: context.bartalType.small.copyWith(height: 1.6)),
          ),
        ],
      ),
    );
  }
}
