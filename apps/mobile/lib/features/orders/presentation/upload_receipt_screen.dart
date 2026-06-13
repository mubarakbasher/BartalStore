import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

import '../../../core/api/envelope.dart';
import '../../../core/models/order.dart';
import '../../../core/utils/money.dart';
import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/screen_header.dart';
import '../../checkout/data/banks.dart';
import '../../checkout/presentation/widgets/checkout_chrome.dart';
import '../application/order_detail_controller.dart';
import '../application/receipt_picker.dart';
import '../data/receipt_storage_api.dart';

/// Bank-transfer receipt capture — port of receipt-flow.jsx::UploadReceiptScreen.
/// Shows the real amount + reference, primary bank details (copy), then a
/// camera/gallery picker. On submit: storage upload → attach → ReceiptSubmitted.
class UploadReceiptScreen extends ConsumerStatefulWidget {
  const UploadReceiptScreen({super.key, required this.orderId});

  final String orderId;

  @override
  ConsumerState<UploadReceiptScreen> createState() => _UploadReceiptScreenState();
}

class _UploadReceiptScreenState extends ConsumerState<UploadReceiptScreen> {
  ReceiptImage? _image;
  bool _submitting = false;

  Future<void> _pick(ImageSource source) async {
    try {
      final image = await ref.read(receiptPickerProvider).pick(source);
      if (image != null && mounted) setState(() => _image = image);
    } catch (error) {
      if (mounted) _toast(L10n.of(context).errorsGeneric);
    }
  }

  Future<void> _submit() async {
    final image = _image;
    if (image == null || _submitting) return;
    setState(() => _submitting = true);
    final arabic = Localizations.localeOf(context).languageCode == 'ar';
    try {
      await ref.read(orderDetailProvider(widget.orderId).notifier).submitReceipt(image);
      // Keep _submitting true on success — we're navigating away.
      if (mounted) context.pushReplacement('/orders/${widget.orderId}/receipt/done');
    } catch (error) {
      if (mounted) {
        setState(() => _submitting = false);
        _toast(toApiException(error).localized(arabic: arabic));
      }
    }
  }

  void _toast(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final async = ref.watch(orderDetailProvider(widget.orderId));

    return Scaffold(
      backgroundColor: bartal.bg,
      body: Column(
        children: [
          ScreenHeader(title: l10n.uploadReceiptTitle),
          Expanded(
            child: async.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (error, _) => Center(child: Text('$error')),
              data: (order) => _body(order),
            ),
          ),
        ],
      ),
    );
  }

  Widget _body(OrderView order) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final bank = bartalBanks.first;
    final unit = isAr ? 'ج.س' : 'SDG';

    return Column(
      children: [
        Expanded(
          child: ListView(
            padding: const EdgeInsetsDirectional.only(bottom: 16),
            children: [
              // Amount card.
              CheckoutSection(
                title: l10n.uploadAmountTitle,
                child: Container(
                  padding: const EdgeInsetsDirectional.all(18),
                  decoration: BoxDecoration(
                    color: bartal.navy,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Column(
                    children: [
                      Text(l10n.cartTotal.toUpperCase(),
                          style: TextStyle(
                              color: bartal.amberSoft,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 1.5)),
                      const SizedBox(height: 6),
                      Text('${fmtSDG(order.total, arabic: isAr)} $unit',
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 28,
                              fontWeight: FontWeight.w700,
                              fontFamily: isAr ? 'Cairo' : 'Poppins')),
                      const SizedBox(height: 10),
                      Container(
                        padding: const EdgeInsetsDirectional.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(100),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(l10n.uploadRefShort,
                                style: TextStyle(
                                    color: bartal.amberSoft,
                                    fontSize: 11,
                                    fontFamily: 'JetBrainsMono',
                                    fontWeight: FontWeight.w700)),
                            const SizedBox(width: 6),
                            Text(order.orderNumber,
                                style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 11,
                                    fontFamily: 'JetBrainsMono',
                                    fontWeight: FontWeight.w700)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              // Bank details.
              CheckoutSection(
                title: l10n.uploadTransferTo,
                child: Container(
                  padding: const EdgeInsetsDirectional.symmetric(horizontal: 14),
                  decoration: BoxDecoration(
                    color: bartal.surface,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: bartal.line),
                  ),
                  child: Column(
                    children: [
                      InfoRow(label: l10n.uploadBankLabel, value: bank.name(arabic: isAr)),
                      InfoRow(label: l10n.bankAccountName, value: isAr ? bankAccountHolderAr : bankAccountHolderEn),
                      InfoRow(label: l10n.bankAccountNumber, value: bank.account, copyText: bank.account, mono: true),
                      InfoRow(label: l10n.bankReference, value: order.orderNumber, copyText: order.orderNumber, mono: true, last: true),
                    ],
                  ),
                ),
              ),
              // Photo zone.
              CheckoutSection(
                title: l10n.uploadReceiptPhoto,
                child: Column(
                  children: [
                    _PhotoZone(image: _image, onCamera: () => _pick(ImageSource.camera), onGallery: () => _pick(ImageSource.gallery)),
                    const SizedBox(height: 12),
                    _Tip(text: l10n.uploadTip1),
                    _Tip(text: l10n.uploadTip2(order.orderNumber)),
                    _Tip(text: l10n.uploadTip3),
                  ],
                ),
              ),
            ],
          ),
        ),
        // Sticky submit (amber, per design).
        Container(
          decoration: BoxDecoration(
            color: bartal.surface,
            border: Border(top: BorderSide(color: bartal.line)),
          ),
          child: SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsetsDirectional.fromSTEB(16, 12, 16, 12),
              child: Opacity(
                opacity: _image == null ? 0.5 : 1,
                child: Material(
                  color: bartal.amber,
                  borderRadius: BorderRadius.circular(14),
                  child: InkWell(
                    onTap: (_image == null || _submitting) ? null : _submit,
                    borderRadius: BorderRadius.circular(14),
                    child: Container(
                      height: 52,
                      alignment: Alignment.center,
                      child: _submitting
                          ? const SizedBox(
                              width: 20, height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                          : Text(l10n.uploadSubmit,
                              style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w700)),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _PhotoZone extends StatelessWidget {
  const _PhotoZone({required this.image, required this.onCamera, required this.onGallery});

  final ReceiptImage? image;
  final VoidCallback onCamera;
  final VoidCallback onGallery;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;

    if (image != null) {
      return Container(
        padding: const EdgeInsetsDirectional.all(12),
        decoration: BoxDecoration(
          color: bartal.amberTint,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: bartal.amber, width: 1.5),
        ),
        child: Column(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Image.memory(image!.bytes, height: 200, width: double.infinity, fit: BoxFit.cover),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TextButton.icon(
                  onPressed: onCamera,
                  icon: BartalIcon(BartalIcons.camera, color: bartal.amber, size: 16),
                  label: Text(l10n.uploadCamera, style: TextStyle(color: bartal.amber, fontWeight: FontWeight.w600)),
                ),
                const SizedBox(width: 8),
                TextButton(
                  onPressed: onGallery,
                  child: Text(l10n.uploadGallery, style: TextStyle(color: bartal.navy, fontWeight: FontWeight.w600)),
                ),
              ],
            ),
          ],
        ),
      );
    }

    return Container(
      padding: const EdgeInsetsDirectional.fromSTEB(16, 30, 16, 30),
      decoration: BoxDecoration(
        color: bartal.amberTint,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: bartal.amber, width: 1.5),
      ),
      child: Column(
        children: [
          Container(
            width: 54,
            height: 54,
            decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
            alignment: Alignment.center,
            child: BartalIcon(BartalIcons.camera, color: bartal.amber, size: 24),
          ),
          const SizedBox(height: 12),
          Text(l10n.uploadTakePhoto,
              textAlign: TextAlign.center,
              style: context.bartalType.label.copyWith(fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          Padding(
            padding: const EdgeInsetsDirectional.symmetric(horizontal: 12),
            child: Text(l10n.uploadPhotoHint, textAlign: TextAlign.center, style: context.bartalType.small),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _ZoneButton(
                  filled: true,
                  icon: BartalIcons.camera,
                  label: l10n.uploadCamera,
                  onTap: onCamera,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _ZoneButton(
                  filled: false,
                  label: l10n.uploadGallery,
                  onTap: onGallery,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ZoneButton extends StatelessWidget {
  const _ZoneButton({required this.filled, this.icon, required this.label, required this.onTap});

  final bool filled;
  final BartalIconSpec? icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    final fg = filled ? Colors.white : bartal.navy;
    return Material(
      color: filled ? bartal.amber : Colors.white,
      borderRadius: BorderRadius.circular(10),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(10),
        child: Container(
          height: 44,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
            border: filled ? null : Border.all(color: bartal.amber),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null) ...[
                BartalIcon(icon!, color: fg, size: 14),
                const SizedBox(width: 6),
              ],
              Text(label, style: TextStyle(color: fg, fontWeight: FontWeight.w700, fontSize: 13)),
            ],
          ),
        ),
      ),
    );
  }
}

class _Tip extends StatelessWidget {
  const _Tip({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Padding(
      padding: const EdgeInsetsDirectional.symmetric(vertical: 6, horizontal: 2),
      child: Row(
        children: [
          Container(
            width: 18,
            height: 18,
            decoration: BoxDecoration(color: bartal.success, shape: BoxShape.circle),
            alignment: Alignment.center,
            child: const BartalIcon(BartalIcons.check, color: Colors.white, size: 11),
          ),
          const SizedBox(width: 8),
          Expanded(child: Text(text, style: context.bartalType.small)),
        ],
      ),
    );
  }
}
