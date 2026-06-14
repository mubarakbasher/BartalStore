import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/api/envelope.dart';
import '../../../core/utils/money.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/screen_header.dart';
import '../../auth/application/auth_controller.dart';
import '../../auth/presentation/widgets/auth_atoms.dart';

/// Edit profile — port of mobile-extras.jsx::EditProfileScreen. Name + email +
/// optional DOB/gender → `PUT /users/me` (phone is read-only). `name` is one
/// field server-side, so the design's first/last collapse into "Full name".
/// "Change photo" is omitted (no customer avatar-upload endpoint).
class EditProfileScreen extends ConsumerStatefulWidget {
  const EditProfileScreen({super.key});

  @override
  ConsumerState<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends ConsumerState<EditProfileScreen> {
  late final TextEditingController _name;
  late final TextEditingController _email;
  DateTime? _dob;
  String? _gender;
  bool _saving = false;
  String? _emailError;

  @override
  void initState() {
    super.initState();
    final user = ref.read(authControllerProvider.notifier).user;
    _name = TextEditingController(text: user?.name ?? '');
    _email = TextEditingController(text: user?.email ?? '');
    _dob = user?.dateOfBirth;
    _gender = user?.gender;
  }

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    super.dispose();
  }

  Future<void> _pickDob() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _dob ?? DateTime(now.year - 25),
      firstDate: DateTime(1920),
      lastDate: now,
    );
    if (picked != null) setState(() => _dob = picked);
  }

  Future<void> _save() async {
    final l10n = L10n.of(context);
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final messenger = ScaffoldMessenger.of(context);
    final email = _email.text.trim();
    final emailValid = email.isEmpty || RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(email);
    setState(() => _emailError = emailValid ? null : l10n.editProfileEmailInvalid);
    if (!emailValid || _name.text.trim().length < 2) return;

    setState(() => _saving = true);
    try {
      await ref.read(authControllerProvider.notifier).updateProfile(
            name: _name.text.trim(),
            email: email.isEmpty ? null : email,
            dateOfBirth: _dob,
            gender: _gender,
          );
      if (!mounted) return;
      messenger.showSnackBar(SnackBar(content: Text(l10n.editProfileSaved)));
      // updateProfile changes the auth state, which refreshes the router and
      // swallows a plain pop(); go() to the profile tab navigates definitively.
      context.go('/profile');
      return;
    } catch (error) {
      if (mounted) {
        setState(() => _saving = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(toApiException(error).localized(arabic: isAr))),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final user = ref.watch(authControllerProvider.notifier).user;

    return Scaffold(
      backgroundColor: bartal.bg,
      body: Column(
        children: [
          ScreenHeader(title: l10n.profilePersonalInfo),
          Expanded(
            child: ListView(
              padding: const EdgeInsetsDirectional.fromSTEB(16, 8, 16, 24),
              children: [
                Center(
                  child: Container(
                    width: 86,
                    height: 86,
                    decoration: BoxDecoration(color: bartal.amber, shape: BoxShape.circle),
                    alignment: Alignment.center,
                    child: Text(
                      user?.initials ?? '?',
                      style: const TextStyle(
                          fontFamily: 'Poppins', color: Colors.white, fontSize: 30, fontWeight: FontWeight.w800),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                _LabeledField(label: l10n.editProfileName, child: AuthField(controller: _name, keyboardType: TextInputType.name)),
                _LabeledField(
                  label: l10n.authPhone,
                  hint: l10n.editProfilePhoneVerified,
                  child: AuthField(
                    controller: TextEditingController(text: user?.phone ?? ''),
                    mono: true,
                    enabled: false,
                  ),
                ),
                _LabeledField(
                  label: l10n.editProfileEmail,
                  child: AuthField(
                    controller: _email,
                    keyboardType: TextInputType.emailAddress,
                    errorText: _emailError,
                  ),
                ),
                _LabeledField(
                  label: l10n.editProfileDob,
                  child: _PickerField(
                    text: _dob != null
                        ? localizedDigits(
                            '${_dob!.year}-${_dob!.month.toString().padLeft(2, '0')}-${_dob!.day.toString().padLeft(2, '0')}',
                            arabic: isAr)
                        : l10n.editProfileDobHint,
                    placeholder: _dob == null,
                    onTap: _pickDob,
                  ),
                ),
                _LabeledField(
                  label: l10n.editProfileGender,
                  child: Row(
                    children: [
                      for (final g in [
                        ('MALE', l10n.genderMale),
                        ('FEMALE', l10n.genderFemale),
                        ('OTHER', l10n.genderOther),
                      ]) ...[
                        if (g.$1 != 'MALE') const SizedBox(width: 8),
                        Expanded(
                          child: _GenderChip(
                            label: g.$2,
                            selected: _gender == g.$1,
                            onTap: () => setState(() => _gender = _gender == g.$1 ? null : g.$1),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),
          SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsetsDirectional.fromSTEB(16, 12, 16, 14),
              child: SizedBox(
                width: double.infinity,
                child: FilledButton(
                  style: FilledButton.styleFrom(
                    backgroundColor: bartal.navy,
                    padding: const EdgeInsetsDirectional.symmetric(vertical: 15),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: _saving ? null : _save,
                  child: _saving
                      ? const SizedBox(
                          width: 20, height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                      : Text(l10n.editProfileSave,
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _LabeledField extends StatelessWidget {
  const _LabeledField({required this.label, required this.child, this.hint});

  final String label;
  final Widget child;
  final String? hint;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Padding(
      padding: const EdgeInsetsDirectional.only(bottom: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          FieldLabel(label),
          child,
          if (hint != null)
            Padding(
              padding: const EdgeInsetsDirectional.only(top: 4, start: 2),
              child: Text(hint!, style: TextStyle(fontSize: 11, color: bartal.success)),
            ),
        ],
      ),
    );
  }
}

class _PickerField extends StatelessWidget {
  const _PickerField({required this.text, required this.placeholder, required this.onTap});

  final String text;
  final bool placeholder;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        height: 52,
        padding: const EdgeInsetsDirectional.symmetric(horizontal: 14),
        alignment: AlignmentDirectional.centerStart,
        decoration: BoxDecoration(
          color: bartal.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: bartal.line),
        ),
        child: Text(
          text,
          style: TextStyle(fontSize: 16, color: placeholder ? bartal.textMute : bartal.text),
        ),
      ),
    );
  }
}

class _GenderChip extends StatelessWidget {
  const _GenderChip({required this.label, required this.selected, required this.onTap});

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 48,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: selected ? bartal.amberTint : bartal.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: selected ? bartal.amber : bartal.line, width: selected ? 2 : 1),
        ),
        child: Text(label,
            style: TextStyle(
                fontWeight: FontWeight.w700, color: selected ? bartal.amber : bartal.text)),
      ),
    );
  }
}
