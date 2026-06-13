import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/api/envelope.dart';
import '../../../core/utils/phone_validator.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/app_button.dart';
import '../application/auth_controller.dart';
import 'widgets/auth_atoms.dart';

/// Phone + password sign-in — port of auth-screens.jsx::LoginScreen.
class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key, this.from});

  final String? from;

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _phone = TextEditingController();
  final _password = TextEditingController();
  String? _phoneError;
  String? _passwordError;
  bool _submitting = false;

  @override
  void dispose() {
    _phone.dispose();
    _password.dispose();
    super.dispose();
  }

  String _continuePath() {
    final from = widget.from;
    return (from != null && from.isNotEmpty) ? from : '/home';
  }

  Future<void> _submit() async {
    final l10n = L10n.of(context);
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final normalized = normalizeSudanPhone(_phone.text);
    setState(() {
      _phoneError = normalized == null ? l10n.authInvalidPhone : null;
      _passwordError = _password.text.length < 8 ? l10n.authPasswordTooShort : null;
    });
    if (normalized == null || _password.text.length < 8) return;

    setState(() => _submitting = true);
    try {
      await ref.read(authControllerProvider.notifier).login(
            phone: normalized,
            password: _password.text,
          );
      if (mounted) context.go(_continuePath());
    } catch (error) {
      if (!mounted) return;
      final message = toApiException(error).localized(arabic: isAr);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
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
          const SizedBox(height: 16),
          AuthEyebrow(l10n.loginEyebrow),
          const SizedBox(height: 10),
          Text(
            l10n.loginTitle,
            style: TextStyle(fontSize: 26, height: 1.2, fontWeight: FontWeight.w700, color: bartal.text),
          ),
          const SizedBox(height: 28),
          FieldLabel(l10n.authPhone),
          PhoneAuthField(
            controller: _phone,
            errorText: _phoneError,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: 14),
          FieldLabel(l10n.authPassword),
          PasswordAuthField(
            controller: _password,
            errorText: _passwordError,
            autofillHints: const [AutofillHints.password],
            textInputAction: TextInputAction.done,
            onSubmitted: (_) => _submit(),
          ),
          const SizedBox(height: 12),
          Align(
            alignment: AlignmentDirectional.centerEnd,
            child: GestureDetector(
              onTap: () => context.push('/forgot-password'),
              child: Text(
                l10n.authForgotPassword,
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: bartal.amber),
              ),
            ),
          ),
          const SizedBox(height: 22),
          AppButton(
            label: l10n.authSignIn,
            expand: true,
            size: AppButtonSize.large,
            loading: _submitting,
            onPressed: _submit,
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(child: Divider(color: bartal.line)),
              Padding(
                padding: const EdgeInsetsDirectional.symmetric(horizontal: 12),
                child: Text(l10n.commonOr, style: TextStyle(fontSize: 11, color: bartal.textMute)),
              ),
              Expanded(child: Divider(color: bartal.line)),
            ],
          ),
          const SizedBox(height: 16),
          // WhatsApp OTP: no API channel yet (Phase 1 is SMS-only) — rendered
          // per design but disabled. See sharedChangeRequest in tasks.md.
          Opacity(
            opacity: 0.5,
            child: Container(
              height: 50,
              decoration: BoxDecoration(
                color: bartal.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: bartal.line),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const WhatsappGlyph(),
                  const SizedBox(width: 10),
                  Text(
                    l10n.loginWhatsappOtp,
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: bartal.text),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          Center(
            child: Text.rich(
              TextSpan(
                text: l10n.loginNoAccount,
                style: TextStyle(fontSize: 13, color: bartal.textMute),
                children: [
                  WidgetSpan(
                    alignment: PlaceholderAlignment.middle,
                    child: GestureDetector(
                      onTap: () {
                        final from = widget.from;
                        final path = (from != null && from.isNotEmpty)
                            ? Uri(path: '/signup', queryParameters: {'from': from}).toString()
                            : '/signup';
                        context.push(path);
                      },
                      child: Text(
                        l10n.loginSignUpLink,
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
