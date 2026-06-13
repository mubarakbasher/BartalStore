import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/api/envelope.dart';
import '../../../core/models/address.dart';
import '../../../core/models/delivery_zone.dart';
import '../../../core/utils/phone_validator.dart';
import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../design/tokens.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/app_button.dart';
import '../../../widgets/price_tag.dart';
import '../../../widgets/screen_header.dart';
import '../../delivery/application/delivery_providers.dart';
import '../application/addresses_controller.dart';
import '../data/address_api.dart';

/// Add-address form — port of profile-flow.jsx::AddAddressScreen. Landmark is
/// required and amber-highlighted (Sudan has no postal codes). On save it
/// creates the address and pops it back to the caller (the checkout address
/// step selects it). Pulled forward from Slice 5 because checkout needs it.
class AddAddressScreen extends ConsumerStatefulWidget {
  const AddAddressScreen({super.key});

  @override
  ConsumerState<AddAddressScreen> createState() => _AddAddressScreenState();
}

class _AddAddressScreenState extends ConsumerState<AddAddressScreen> {
  final _name = TextEditingController();
  final _phone = TextEditingController();
  final _district = TextEditingController();
  final _landmark = TextEditingController();
  final _notes = TextEditingController();

  String _label = 'home';
  DeliveryZone _zone = DeliveryZone.zoneA;
  bool _isDefault = true;
  bool _submitting = false;
  String? _nameError;
  String? _phoneError;
  String? _districtError;
  String? _landmarkError;

  @override
  void dispose() {
    _name.dispose();
    _phone.dispose();
    _district.dispose();
    _landmark.dispose();
    _notes.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    final l10n = L10n.of(context);
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final normalized = normalizeSudanPhone(_phone.text);
    setState(() {
      _nameError = _name.text.trim().length < 2 ? l10n.addressNameRequired : null;
      _phoneError = normalized == null ? l10n.authInvalidPhone : null;
      _districtError = _district.text.trim().length < 2 ? l10n.addressDistrictRequired : null;
      _landmarkError = _landmark.text.trim().length < 3 ? l10n.addressLandmarkRequired : null;
    });
    if (_nameError != null || normalized == null || _districtError != null || _landmarkError != null) {
      return;
    }

    setState(() => _submitting = true);
    try {
      final created = await ref.read(addressesControllerProvider.notifier).create(
            AddressInput(
              label: _label,
              fullName: _name.text.trim(),
              phone: normalized,
              district: _district.text.trim(),
              landmark: _landmark.text.trim(),
              deliveryNotes: _notes.text.trim().isEmpty ? null : _notes.text.trim(),
              zone: _zone,
              isDefault: _isDefault,
            ),
          );
      if (mounted) context.pop(created);
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(toApiException(error).localized(arabic: isAr))),
      );
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final zones = ref.watch(deliveryZonesProvider);

    return Scaffold(
      backgroundColor: bartal.bg,
      body: Column(
        children: [
          ScreenHeader(title: l10n.addressNewTitle),
          Expanded(
            child: ListView(
              padding: const EdgeInsetsDirectional.fromSTEB(16, 4, 16, 24),
              children: [
                _label2(l10n.addressLabelTitle),
                Row(
                  children: [
                    for (final entry in [
                      ('home', l10n.labelHome),
                      ('work', l10n.labelWork),
                      ('other', l10n.labelOther),
                    ]) ...[
                      if (entry.$1 != 'home') const SizedBox(width: 8),
                      Expanded(
                        child: _LabelChip(
                          label: entry.$2,
                          selected: _label == entry.$1,
                          onTap: () => setState(() => _label = entry.$1),
                        ),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 18),
                _label2(l10n.addressContactTitle),
                _FormField(
                  controller: _name,
                  label: l10n.addressFullName,
                  errorText: _nameError,
                  keyboardType: TextInputType.name,
                  autofill: const [AutofillHints.name],
                ),
                _FormField(
                  controller: _phone,
                  label: l10n.addressPhone,
                  errorText: _phoneError,
                  mono: true,
                  hint: '+249 …',
                  keyboardType: TextInputType.phone,
                  autofill: const [AutofillHints.telephoneNumber],
                ),
                const SizedBox(height: 8),
                _label2(l10n.checkoutDeliveryZone),
                zones.when(
                  loading: () => const Center(child: Padding(
                    padding: EdgeInsets.all(8), child: CircularProgressIndicator())),
                  error: (_, _) => const SizedBox.shrink(),
                  data: (list) => _ZoneGrid(
                    zones: list,
                    selected: _zone,
                    onSelect: (z) => setState(() => _zone = z),
                  ),
                ),
                const SizedBox(height: 18),
                _label2(l10n.addressStreetTitle),
                _FormField(
                  controller: _district,
                  label: l10n.addressDistrict,
                  hint: l10n.addressDistrictHint,
                  errorText: _districtError,
                ),
                const SizedBox(height: 8),
                // Landmark — required, amber-highlighted (Sudan: no postal codes).
                Row(
                  children: [
                    Text(l10n.addressLandmark, style: context.bartalType.micro),
                    Text(' *', style: TextStyle(color: bartal.danger, fontSize: 12)),
                  ],
                ),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsetsDirectional.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: bartal.amberTint,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: _landmarkError != null ? bartal.danger : bartal.amber.withValues(alpha: 0.4),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        l10n.addressLandmarkHelp,
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: bartal.amber),
                      ),
                      const SizedBox(height: 2),
                      TextField(
                        controller: _landmark,
                        onChanged: (_) {
                          if (_landmarkError != null) setState(() => _landmarkError = null);
                        },
                        style: TextStyle(fontSize: 15, color: BartalColors.navyInk),
                        decoration: InputDecoration(
                          isCollapsed: true,
                          border: InputBorder.none,
                          hintText: l10n.addressLandmarkHint,
                          hintStyle: TextStyle(color: bartal.textMute, fontSize: 14),
                          contentPadding: const EdgeInsetsDirectional.symmetric(vertical: 6),
                        ),
                      ),
                    ],
                  ),
                ),
                if (_landmarkError != null)
                  Padding(
                    padding: const EdgeInsetsDirectional.only(top: 6, start: 2),
                    child: Text(_landmarkError!, style: TextStyle(fontSize: 12, color: bartal.danger)),
                  ),
                const SizedBox(height: 14),
                _label2(l10n.addressNotesTitle),
                Container(
                  padding: const EdgeInsetsDirectional.symmetric(horizontal: 12, vertical: 10),
                  decoration: BoxDecoration(
                    color: bartal.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: bartal.line),
                  ),
                  child: TextField(
                    controller: _notes,
                    maxLines: 2,
                    style: TextStyle(fontSize: 15, color: bartal.text),
                    decoration: InputDecoration(
                      isCollapsed: true,
                      border: InputBorder.none,
                      hintText: l10n.addressNotesHint,
                      hintStyle: TextStyle(color: bartal.textMute, fontSize: 14),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                GestureDetector(
                  onTap: () => setState(() => _isDefault = !_isDefault),
                  behavior: HitTestBehavior.opaque,
                  child: Row(
                    children: [
                      Container(
                        width: 20,
                        height: 20,
                        decoration: BoxDecoration(
                          color: _isDefault ? bartal.amber : Colors.transparent,
                          borderRadius: BorderRadius.circular(5),
                          border: Border.all(color: _isDefault ? bartal.amber : bartal.line, width: 1.5),
                        ),
                        child: _isDefault
                            ? const BartalIcon(BartalIcons.check, color: Colors.white, size: 12)
                            : null,
                      ),
                      const SizedBox(width: 10),
                      Text(l10n.addressSetDefault, style: context.bartalType.body),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                AppButton(
                  label: l10n.addressSave,
                  variant: AppButtonVariant.navy,
                  size: AppButtonSize.large,
                  expand: true,
                  loading: _submitting,
                  onPressed: _save,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _label2(String text) => Padding(
        padding: const EdgeInsetsDirectional.only(bottom: 8),
        child: Text(text, style: context.bartalType.micro),
      );
}

class _LabelChip extends StatelessWidget {
  const _LabelChip({required this.label, required this.selected, required this.onTap});

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsetsDirectional.symmetric(vertical: 11),
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: selected ? bartal.amberTint : bartal.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: selected ? bartal.amber : bartal.line, width: selected ? 2 : 1),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: selected ? bartal.amber : bartal.text,
          ),
        ),
      ),
    );
  }
}

class _FormField extends StatelessWidget {
  const _FormField({
    required this.controller,
    required this.label,
    this.hint,
    this.errorText,
    this.mono = false,
    this.keyboardType,
    this.autofill,
  });

  final TextEditingController controller;
  final String label;
  final String? hint;
  final String? errorText;
  final bool mono;
  final TextInputType? keyboardType;
  final List<String>? autofill;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Padding(
      padding: const EdgeInsetsDirectional.only(bottom: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsetsDirectional.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: bartal.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: errorText != null ? bartal.danger : bartal.line),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: context.bartalType.micro),
                const SizedBox(height: 2),
                TextField(
                  controller: controller,
                  keyboardType: keyboardType,
                  autofillHints: autofill,
                  style: TextStyle(
                    fontSize: 15,
                    color: bartal.text,
                    fontFamily: mono ? 'JetBrainsMono' : null,
                  ),
                  decoration: InputDecoration(
                    isCollapsed: true,
                    border: InputBorder.none,
                    hintText: hint,
                    hintStyle: TextStyle(color: bartal.textMute, fontSize: 14),
                    contentPadding: const EdgeInsetsDirectional.symmetric(vertical: 4),
                  ),
                ),
              ],
            ),
          ),
          if (errorText != null)
            Padding(
              padding: const EdgeInsetsDirectional.only(top: 6, start: 2),
              child: Text(errorText!, style: TextStyle(fontSize: 12, color: bartal.danger)),
            ),
        ],
      ),
    );
  }
}

class _ZoneGrid extends StatelessWidget {
  const _ZoneGrid({required this.zones, required this.selected, required this.onSelect});

  final List<DeliveryZoneInfo> zones;
  final DeliveryZone selected;
  final ValueChanged<DeliveryZone> onSelect;

  @override
  Widget build(BuildContext context) {
    final arabic = Localizations.localeOf(context).languageCode == 'ar';
    final bartal = context.bartal;
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 8,
      crossAxisSpacing: 8,
      childAspectRatio: 2.5,
      children: [
        for (final z in zones)
          GestureDetector(
            onTap: () => onSelect(z.zone),
            child: Container(
              padding: const EdgeInsetsDirectional.all(12),
              decoration: BoxDecoration(
                color: z.zone == selected ? bartal.amberTint : bartal.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: z.zone == selected ? bartal.amber : bartal.line,
                  width: z.zone == selected ? 2 : 1,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    z.name(arabic: arabic),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: context.bartalType.label.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 2),
                  PriceTag(amount: z.feeSdg, size: 12, strong: false),
                ],
              ),
            ),
          ),
      ],
    );
  }
}
