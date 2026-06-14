import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/api/envelope.dart';
import '../../../core/models/address.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/empty_state.dart';
import '../../../widgets/error_screen.dart';
import '../../../widgets/screen_header.dart';
import '../application/addresses_controller.dart';

/// Saved-addresses management — port of profile-flow.jsx::AddressesScreen.
/// Cards with set-default / edit / delete; a dashed "add new" CTA. (Add itself
/// shipped in Slice 3 as AddAddressScreen.)
class AddressesScreen extends ConsumerWidget {
  const AddressesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final async = ref.watch(addressesControllerProvider);

    return Scaffold(
      backgroundColor: bartal.bg,
      body: Column(
        children: [
          ScreenHeader(title: l10n.addressesTitle),
          Expanded(
            child: async.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (_, _) => ErrorState(
                kind: ErrorScreenKind.error,
                onRetry: () => ref.invalidate(addressesControllerProvider),
              ),
              data: (addresses) => addresses.isEmpty
                  ? EmptyState(
                      kind: EmptyStateKind.addresses,
                      onCta: () => context.push('/addresses/new'),
                    )
                  : ListView(
                      padding: const EdgeInsetsDirectional.fromSTEB(16, 4, 16, 24),
                      children: [
                        Padding(
                          padding: const EdgeInsetsDirectional.only(bottom: 14),
                          child: Text(l10n.addressesIntro, style: context.bartalType.small),
                        ),
                        for (final a in addresses) ...[
                          _AddressCard(address: a),
                          const SizedBox(height: 10),
                        ],
                        _AddNewCard(onTap: () => context.push('/addresses/new')),
                      ],
                    ),
            ),
          ),
        ],
      ),
    );
  }
}

class _AddressCard extends ConsumerWidget {
  const _AddressCard({required this.address});

  final Address address;

  String _labelText(L10n l10n) => switch (address.label) {
        'home' => l10n.labelHome,
        'work' => l10n.labelWork,
        'other' => l10n.labelOther,
        _ => address.label,
      };

  Future<void> _confirmDelete(BuildContext context, WidgetRef ref) async {
    final l10n = L10n.of(context);
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final ok = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        backgroundColor: dialogContext.bartal.surface,
        title: Text(l10n.addressDeleteConfirmTitle, style: dialogContext.bartalType.h3),
        content: Text(l10n.addressDeleteConfirmBody, style: dialogContext.bartalType.body),
        actions: [
          TextButton(onPressed: () => Navigator.of(dialogContext).pop(false), child: Text(l10n.commonCancel)),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: dialogContext.bartal.danger),
            onPressed: () => Navigator.of(dialogContext).pop(true),
            child: Text(l10n.commonDelete),
          ),
        ],
      ),
    );
    if (ok != true || !context.mounted) return;
    try {
      await ref.read(addressesControllerProvider.notifier).delete(address.id);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(l10n.addressDeleted)));
      }
    } catch (error) {
      if (context.mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(toApiException(error).localized(arabic: isAr))));
      }
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;

    return Container(
      padding: const EdgeInsetsDirectional.all(14),
      decoration: BoxDecoration(
        color: bartal.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: address.isDefault ? bartal.amber : bartal.line,
          width: address.isDefault ? 2 : 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsetsDirectional.symmetric(horizontal: 10, vertical: 3),
                decoration: BoxDecoration(
                  color: address.isDefault ? bartal.amberTint : (bartal.isDark ? bartal.raised : bartal.bg),
                  borderRadius: BorderRadius.circular(100),
                ),
                child: Text(_labelText(l10n),
                    style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: address.isDefault ? bartal.amber : bartal.textMute)),
              ),
              if (address.isDefault) ...[
                const SizedBox(width: 8),
                Text('● ${l10n.addressDefault}',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: bartal.amber)),
              ],
              const Spacer(),
              Container(
                padding: const EdgeInsetsDirectional.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: bartal.isDark ? bartal.raised : bartal.bg,
                  borderRadius: BorderRadius.circular(100),
                ),
                child: Text('Zone ${address.zone.wire.split('_').last}', style: context.bartalType.micro),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(address.fullName, style: context.bartalType.label.copyWith(fontWeight: FontWeight.w700)),
          const SizedBox(height: 2),
          Text(address.phone,
              style: TextStyle(fontFamily: 'JetBrainsMono', fontSize: 13, color: bartal.textMute)),
          const SizedBox(height: 6),
          Text(address.streetLine, style: context.bartalType.body.copyWith(height: 1.5)),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsetsDirectional.symmetric(horizontal: 10, vertical: 7),
            decoration: BoxDecoration(
              color: bartal.isDark ? bartal.raised : bartal.bg,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text('◉ ${address.landmark}',
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: bartal.amber)),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              if (!address.isDefault)
                Expanded(
                  child: _CardAction(
                    label: l10n.addressSetDefaultAction,
                    onTap: () => ref.read(addressesControllerProvider.notifier).setDefault(address.id),
                  ),
                ),
              if (!address.isDefault) const SizedBox(width: 8),
              Expanded(
                child: _CardAction(
                  label: l10n.commonEdit,
                  onTap: () => context.push('/addresses/${address.id}/edit', extra: address),
                ),
              ),
              const SizedBox(width: 8),
              _CardAction(
                label: l10n.commonDelete,
                danger: true,
                onTap: () => _confirmDelete(context, ref),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _CardAction extends StatelessWidget {
  const _CardAction({required this.label, required this.onTap, this.danger = false});

  final String label;
  final VoidCallback onTap;
  final bool danger;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    final color = danger ? bartal.danger : bartal.navy;
    return Material(
      color: Colors.transparent,
      borderRadius: BorderRadius.circular(10),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: EdgeInsetsDirectional.symmetric(horizontal: danger ? 14 : 9, vertical: 9),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: danger ? bartal.danger.withValues(alpha: 0.3) : bartal.line),
          ),
          child: Text(label,
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: color)),
        ),
      ),
    );
  }
}

class _AddNewCard extends StatelessWidget {
  const _AddNewCard({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsetsDirectional.all(18),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: bartal.line, width: 1.5),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('+ ', style: TextStyle(fontSize: 18, color: bartal.navy, fontWeight: FontWeight.w700)),
            Text(l10n.checkoutAddNewAddress,
                style: TextStyle(fontWeight: FontWeight.w700, color: bartal.navy)),
          ],
        ),
      ),
    );
  }
}
