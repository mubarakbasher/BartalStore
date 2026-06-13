import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/api/envelope.dart';
import '../../../core/utils/money.dart';
import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../design/tokens.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/app_button.dart';
import '../application/auth_controller.dart';
import 'widgets/auth_atoms.dart';

/// New-password step (3 of 3) — port of auth-gaps.jsx::ResetPasswordScreen.
/// Strength meter + live requirement checklist; saves and returns to login.
class ResetPasswordScreen extends ConsumerStatefulWidget {
  const ResetPasswordScreen({super.key, required this.phone, required this.code});

  final String phone;
  final String code;

  @override
  ConsumerState<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends ConsumerState<ResetPasswordScreen> {
  final _password = TextEditingController();
  final _confirm = TextEditingController();
  String? _confirmError;
  bool _submitting = false;

  @override
  void dispose() {
    _password.dispose();
    _confirm.dispose();
    super.dispose();
  }

  bool get _ruleLength => _password.text.length >= 8;
  bool get _ruleCase =>
      RegExp(r'[a-z]').hasMatch(_password.text) && RegExp(r'[A-Z]').hasMatch(_password.text);
  bool get _ruleNumber => RegExp(r'\d').hasMatch(_password.text);
  bool get _ruleSymbol => RegExp(r'[!@#$%^&*(),.?":{}|<>_\-]').hasMatch(_password.text);
  bool get _meetsMinimum => _ruleLength && _ruleCase && _ruleNumber;

  Future<void> _submit() async {
    final l10n = L10n.of(context);
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    setState(() {
      _confirmError = _password.text != _confirm.text ? l10n.authPasswordsMismatch : null;
    });
    if (!_meetsMinimum) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(l10n.authPasswordTooShort)));
      return;
    }
    if (_confirmError != null) return;

    setState(() => _submitting = true);
    try {
      await ref.read(authControllerProvider.notifier).resetPassword(
            phone: widget.phone,
            code: widget.code,
            newPassword: _password.text,
          );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(l10n.resetSuccess)));
      context.go('/login');
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const SizedBox(height: 4),
          StepProgress(total: 3, current: 3),
          const SizedBox(height: 24),
          AuthEyebrow(l10n.authStepOf(
            localizedDigits('3', arabic: Localizations.localeOf(context).languageCode == 'ar'),
            localizedDigits('3', arabic: Localizations.localeOf(context).languageCode == 'ar'),
          )),
          const SizedBox(height: 10),
          Text(
            l10n.resetTitle,
            style: TextStyle(fontSize: 24, height: 1.25, fontWeight: FontWeight.w700, color: bartal.text),
          ),
          const SizedBox(height: 10),
          Text(
            l10n.resetBody,
            style: TextStyle(fontSize: 13, height: 1.6, color: bartal.textMute),
          ),
          const SizedBox(height: 22),
          FieldLabel(l10n.authNewPassword),
          PasswordAuthField(
            controller: _password,
            autofillHints: const [AutofillHints.newPassword],
            onChanged: (_) => setState(() {}),
          ),
          const SizedBox(height: 10),
          PasswordStrengthMeter(password: _password.text),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsetsDirectional.all(12),
            decoration: BoxDecoration(
              color: bartal.isDark ? bartal.raised : BartalColors.sand,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: bartal.line),
            ),
            child: Column(
              children: [
                _Rule(ok: _ruleLength, text: l10n.pwRuleLength),
                _Rule(ok: _ruleCase, text: l10n.pwRuleCase),
                _Rule(ok: _ruleNumber, text: l10n.pwRuleNumber),
                _Rule(ok: _ruleSymbol, text: l10n.pwRuleSymbol),
              ],
            ),
          ),
          const SizedBox(height: 18),
          FieldLabel(l10n.authConfirmPassword),
          PasswordAuthField(
            controller: _confirm,
            errorText: _confirmError,
            onChanged: (_) => setState(() {}),
            onSubmitted: (_) => _submit(),
          ),
          const SizedBox(height: 22),
          AppButton(
            label: l10n.resetSave,
            expand: true,
            size: AppButtonSize.large,
            loading: _submitting,
            onPressed: _submit,
          ),
        ],
      ),
    );
  }
}

class _Rule extends StatelessWidget {
  const _Rule({required this.ok, required this.text});

  final bool ok;
  final String text;

  static const _green = Color(0xFF0F7A3F);

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Padding(
      padding: const EdgeInsetsDirectional.only(bottom: 4),
      child: Row(
        children: [
          Container(
            width: 14,
            height: 14,
            decoration: BoxDecoration(
              color: ok ? _green : Colors.transparent,
              shape: BoxShape.circle,
              border: Border.all(color: ok ? _green : bartal.line, width: 1.5),
            ),
            child: ok ? const BartalIcon(BartalIcons.check, color: Colors.white, size: 8) : null,
          ),
          const SizedBox(width: 8),
          Text(
            text,
            style: TextStyle(fontSize: 11, color: ok ? _green : bartal.textMute),
          ),
        ],
      ),
    );
  }
}
