import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/api/envelope.dart';
import '../../../core/utils/phone_validator.dart';
import '../../../design/theme.dart';
import '../../../design/tokens.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/app_button.dart';
import '../application/auth_controller.dart';
import 'widgets/auth_atoms.dart';

/// Password-recovery entry — port of auth-gaps.jsx::ForgotPasswordScreen.
/// Hero key, phone input, channel selector (SMS active; WhatsApp rendered
/// disabled — Phase 1 is SMS-only), then send-reset-code.
class ForgotPasswordScreen extends ConsumerStatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  ConsumerState<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends ConsumerState<ForgotPasswordScreen> {
  final _phone = TextEditingController();
  String? _phoneError;
  bool _submitting = false;

  @override
  void dispose() {
    _phone.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final l10n = L10n.of(context);
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final normalized = normalizeSudanPhone(_phone.text);
    setState(() => _phoneError = normalized == null ? l10n.authInvalidPhone : null);
    if (normalized == null) return;

    setState(() => _submitting = true);
    try {
      await ref.read(authControllerProvider.notifier).forgotPassword(phone: normalized);
      if (!mounted) return;
      context.push(Uri(path: '/otp', queryParameters: {
        'phone': normalized,
        'purpose': 'reset',
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Align(
            alignment: AlignmentDirectional.centerStart,
            child: Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                color: bartal.amberTint,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: bartal.amber),
              ),
              alignment: Alignment.center,
              child: const Text('🔑', style: TextStyle(fontSize: 32)),
            ),
          ),
          const SizedBox(height: 22),
          AuthEyebrow(l10n.forgotEyebrow),
          const SizedBox(height: 10),
          Text(
            l10n.forgotTitle,
            style: TextStyle(fontSize: 24, height: 1.25, fontWeight: FontWeight.w700, color: bartal.text),
          ),
          const SizedBox(height: 10),
          Text(
            l10n.forgotBody,
            style: TextStyle(fontSize: 13, height: 1.6, color: bartal.textMute),
          ),
          const SizedBox(height: 26),
          FieldLabel(l10n.authPhone),
          PhoneAuthField(
            controller: _phone,
            errorText: _phoneError,
            textInputAction: TextInputAction.done,
            onSubmitted: (_) => _submit(),
          ),
          const SizedBox(height: 16),
          FieldLabel(l10n.forgotChooseMethod),
          _ChannelOption(
            glyph: const WhatsappGlyph(size: 36),
            title: l10n.channelWhatsapp,
            hint: '+249 91 234 ••••',
            selected: false,
            disabled: true,
          ),
          const SizedBox(height: 8),
          _ChannelOption(
            glyph: const _SmsGlyph(),
            title: l10n.channelSms,
            hint: '+249 91 234 ••••',
            selected: true,
          ),
          const SizedBox(height: 22),
          AppButton(
            label: l10n.forgotSendCode,
            expand: true,
            size: AppButtonSize.large,
            loading: _submitting,
            onPressed: _submit,
          ),
          const SizedBox(height: 14),
          Center(
            child: Text.rich(
              TextSpan(
                text: l10n.forgotRemembered,
                style: TextStyle(fontSize: 12, color: bartal.textMute),
                children: [
                  WidgetSpan(
                    alignment: PlaceholderAlignment.middle,
                    child: GestureDetector(
                      onTap: () => context.go('/login'),
                      child: Text(
                        l10n.forgotBackToSignIn,
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: bartal.amber),
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

class _ChannelOption extends StatelessWidget {
  const _ChannelOption({
    required this.glyph,
    required this.title,
    required this.hint,
    required this.selected,
    this.disabled = false,
  });

  final Widget glyph;
  final String title;
  final String hint;
  final bool selected;
  final bool disabled;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Opacity(
      opacity: disabled ? 0.5 : 1,
      child: Container(
        padding: const EdgeInsetsDirectional.all(14),
        decoration: BoxDecoration(
          color: bartal.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: selected ? bartal.amber : bartal.line, width: 1.5),
        ),
        child: Row(
          children: [
            glyph,
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: bartal.text)),
                  const SizedBox(height: 2),
                  Text(hint,
                      style: TextStyle(
                          fontSize: 11, color: bartal.textMute, fontFamily: 'JetBrainsMono')),
                ],
              ),
            ),
            Container(
              width: 20,
              height: 20,
              decoration: BoxDecoration(
                color: selected ? bartal.amber : Colors.transparent,
                shape: BoxShape.circle,
                border: Border.all(color: selected ? bartal.amber : bartal.line, width: 2),
              ),
              child: selected
                  ? Center(
                      child: Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                      ),
                    )
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}

class _SmsGlyph extends StatelessWidget {
  const _SmsGlyph();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 36,
      height: 36,
      decoration: const BoxDecoration(color: BartalColors.navy, shape: BoxShape.circle),
      alignment: Alignment.center,
      child: const Text('✉', style: TextStyle(color: Colors.white, fontSize: 15)),
    );
  }
}
