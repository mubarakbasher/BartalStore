import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/api/envelope.dart';
import '../../../core/utils/phone_validator.dart';
import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/app_button.dart';
import '../application/auth_controller.dart';
import 'widgets/auth_atoms.dart';

/// Account creation (step 1 of 3) — port of auth-screens.jsx::SignupScreen.
class SignupScreen extends ConsumerStatefulWidget {
  const SignupScreen({super.key, this.from});

  final String? from;

  @override
  ConsumerState<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends ConsumerState<SignupScreen> {
  final _name = TextEditingController();
  final _phone = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  String? _nameError;
  String? _phoneError;
  String? _passwordError;
  bool _agreed = true;
  bool _submitting = false;

  @override
  void dispose() {
    _name.dispose();
    _phone.dispose();
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final l10n = L10n.of(context);
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final normalized = normalizeSudanPhone(_phone.text);
    setState(() {
      _nameError = _name.text.trim().length < 2 ? l10n.errorsValidation : null;
      _phoneError = normalized == null ? l10n.authInvalidPhone : null;
      _passwordError = _password.text.length < 8 ? l10n.authPasswordTooShort : null;
    });
    if (_nameError != null || normalized == null || _passwordError != null || !_agreed) {
      if (!_agreed && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(l10n.signupTermsAgree)),
        );
      }
      return;
    }

    setState(() => _submitting = true);
    try {
      await ref.read(authControllerProvider.notifier).register(
            phone: normalized,
            name: _name.text.trim(),
            password: _password.text,
            email: _email.text.trim().isEmpty ? null : _email.text.trim(),
          );
      if (!mounted) return;
      final from = widget.from;
      context.push(Uri(path: '/otp', queryParameters: {
        'phone': normalized,
        'purpose': 'register',
        if (from != null && from.isNotEmpty) 'from': from,
      }).toString());
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

    return AuthScaffold(
      header: const StepHeader(current: 1, total: 3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const SizedBox(height: 10),
          Text(
            l10n.signupTitle,
            style: TextStyle(fontSize: 24, height: 1.2, fontWeight: FontWeight.w700, color: bartal.text),
          ),
          const SizedBox(height: 6),
          Text(
            l10n.signupSubtitle,
            style: TextStyle(fontSize: 13, height: 1.5, color: bartal.textMute),
          ),
          const SizedBox(height: 22),
          FieldLabel(l10n.authName),
          AuthField(
            controller: _name,
            height: 48,
            errorText: _nameError,
            keyboardType: TextInputType.name,
            autofillHints: const [AutofillHints.name],
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: 12),
          FieldLabel(l10n.authPhone),
          PhoneAuthField(controller: _phone, errorText: _phoneError, textInputAction: TextInputAction.next),
          const SizedBox(height: 12),
          FieldLabel(l10n.authEmail),
          AuthField(
            controller: _email,
            height: 48,
            keyboardType: TextInputType.emailAddress,
            autofillHints: const [AutofillHints.email],
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: 12),
          FieldLabel(l10n.authPassword),
          PasswordAuthField(
            controller: _password,
            errorText: _passwordError,
            autofillHints: const [AutofillHints.newPassword],
            onChanged: (_) => setState(() {}),
          ),
          const SizedBox(height: 10),
          PasswordStrengthMeter(password: _password.text),
          const SizedBox(height: 18),
          _TermsCheckbox(
            checked: _agreed,
            label: l10n.signupTermsAgree,
            onChanged: (v) => setState(() => _agreed = v),
          ),
          const SizedBox(height: 20),
          AppButton(
            label: l10n.signupSendCode,
            expand: true,
            size: AppButtonSize.large,
            loading: _submitting,
            trailing: const BartalIcon(BartalIcons.arrow, color: Colors.white, size: 14),
            onPressed: _submit,
          ),
          const SizedBox(height: 20),
          Center(
            child: Text.rich(
              TextSpan(
                text: l10n.signupHaveAccount,
                style: TextStyle(fontSize: 13, color: bartal.textMute),
                children: [
                  WidgetSpan(
                    alignment: PlaceholderAlignment.middle,
                    child: GestureDetector(
                      onTap: () => context.go('/login'),
                      child: Text(
                        l10n.authLogin,
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: bartal.amber),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _TermsCheckbox extends StatelessWidget {
  const _TermsCheckbox({required this.checked, required this.label, required this.onChanged});

  final bool checked;
  final String label;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return GestureDetector(
      onTap: () => onChanged(!checked),
      behavior: HitTestBehavior.opaque,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 20,
            height: 20,
            margin: const EdgeInsetsDirectional.only(top: 1),
            decoration: BoxDecoration(
              color: checked ? bartal.amber : Colors.transparent,
              borderRadius: BorderRadius.circular(5),
              border: Border.all(color: checked ? bartal.amber : bartal.line, width: 1.5),
            ),
            child: checked ? const BartalIcon(BartalIcons.check, color: Colors.white, size: 12) : null,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              label,
              style: TextStyle(fontSize: 12, height: 1.6, color: bartal.text),
            ),
          ),
        ],
      ),
    );
  }
}
