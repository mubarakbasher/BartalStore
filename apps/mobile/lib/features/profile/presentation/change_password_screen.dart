import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/api/envelope.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/screen_header.dart';
import '../../auth/application/auth_controller.dart';
import '../../auth/presentation/widgets/auth_atoms.dart';

/// Change password — port of mobile-extras.jsx::ChangePasswordScreen. On success
/// the server revokes all refresh tokens, so we confirm + force a re-login.
class ChangePasswordScreen extends ConsumerStatefulWidget {
  const ChangePasswordScreen({super.key});

  @override
  ConsumerState<ChangePasswordScreen> createState() => _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends ConsumerState<ChangePasswordScreen> {
  final _current = TextEditingController();
  final _new = TextEditingController();
  final _confirm = TextEditingController();
  bool _submitting = false;
  String? _currentError;
  String? _newError;
  String? _confirmError;

  @override
  void dispose() {
    _current.dispose();
    _new.dispose();
    _confirm.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final l10n = L10n.of(context);
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final newPw = _new.text;
    final valid8 = newPw.length >= 8 && RegExp(r'\d').hasMatch(newPw);
    setState(() {
      _currentError = _current.text.isEmpty ? l10n.commonRequired2 : null;
      _newError = valid8 ? null : l10n.authPasswordTooShort;
      _confirmError = _confirm.text == newPw ? null : l10n.changePwMismatch;
    });
    if (_currentError != null || _newError != null || _confirmError != null) return;

    setState(() => _submitting = true);
    try {
      await ref.read(authControllerProvider.notifier).changePassword(
            currentPassword: _current.text,
            newPassword: newPw,
          );
      if (!mounted) return;
      await showDialog<void>(
        context: context,
        barrierDismissible: false,
        builder: (dialogContext) => AlertDialog(
          backgroundColor: dialogContext.bartal.surface,
          title: Text(l10n.changePwSuccessTitle, style: dialogContext.bartalType.h3),
          content: Text(l10n.changePwSuccessBody, style: dialogContext.bartalType.body),
          actions: [
            FilledButton(
              onPressed: () => Navigator.of(dialogContext).pop(),
              child: Text(l10n.authSignIn),
            ),
          ],
        ),
      );
      // Tokens are revoked server-side — log out; the router redirects to welcome.
      await ref.read(authControllerProvider.notifier).logout();
    } catch (error) {
      if (mounted) {
        setState(() => _submitting = false);
        final api = toApiException(error);
        if (api.code == 'INVALID_CURRENT_PASSWORD') {
          setState(() => _currentError = api.localized(arabic: isAr));
        } else {
          ScaffoldMessenger.of(context)
              .showSnackBar(SnackBar(content: Text(api.localized(arabic: isAr))));
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;

    return Scaffold(
      backgroundColor: bartal.bg,
      body: Column(
        children: [
          ScreenHeader(title: l10n.changePwTitle),
          Expanded(
            child: ListView(
              padding: const EdgeInsetsDirectional.fromSTEB(16, 4, 16, 24),
              children: [
                Padding(
                  padding: const EdgeInsetsDirectional.only(bottom: 16),
                  child: Text(l10n.changePwIntro, style: context.bartalType.body.copyWith(color: bartal.textMute)),
                ),
                FieldLabel(l10n.changePwCurrent),
                PasswordAuthField(
                  controller: _current,
                  errorText: _currentError,
                  onChanged: (_) {
                    if (_currentError != null) setState(() => _currentError = null);
                  },
                ),
                const SizedBox(height: 14),
                FieldLabel(l10n.changePwNew),
                PasswordAuthField(
                  controller: _new,
                  errorText: _newError,
                  onChanged: (_) => setState(() => _newError = null),
                ),
                const SizedBox(height: 8),
                PasswordStrengthMeter(password: _new.text),
                const SizedBox(height: 14),
                FieldLabel(l10n.changePwConfirm),
                PasswordAuthField(
                  controller: _confirm,
                  errorText: _confirmError,
                  onChanged: (_) {
                    if (_confirmError != null) setState(() => _confirmError = null);
                  },
                ),
                const SizedBox(height: 14),
                Align(
                  alignment: AlignmentDirectional.centerStart,
                  child: GestureDetector(
                    onTap: () => context.push('/forgot-password'),
                    child: Text(l10n.changePwForgot,
                        style: TextStyle(color: bartal.amber, fontWeight: FontWeight.w700, fontSize: 13)),
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
                  onPressed: _submitting ? null : _submit,
                  child: _submitting
                      ? const SizedBox(
                          width: 20, height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                      : Text(l10n.changePwSubmit,
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
