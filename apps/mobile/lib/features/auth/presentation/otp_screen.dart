import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/api/envelope.dart';
import '../../../core/utils/money.dart';
import '../../../core/utils/phone_validator.dart';
import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../design/tokens.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/app_button.dart';
import '../application/auth_controller.dart';
import '../data/auth_api.dart';
import 'widgets/auth_atoms.dart';

/// 6-digit OTP verification (step 2 of 3) — port of
/// auth-screens.jsx::OtpScreen. A single hidden field drives six styled
/// boxes; the boxes row is always LTR. Resend unlocks after a 60s countdown.
class OtpScreen extends ConsumerStatefulWidget {
  const OtpScreen({super.key, required this.phone, required this.purpose, this.from});

  final String phone;
  final OtpPurpose purpose;
  final String? from;

  @override
  ConsumerState<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends ConsumerState<OtpScreen> {
  final _controller = TextEditingController();
  final _focus = FocusNode();
  Timer? _timer;
  int _secondsLeft = 60;
  bool _submitting = false;
  bool _resending = false;

  static const _length = 6;

  @override
  void initState() {
    super.initState();
    _startCountdown();
    WidgetsBinding.instance.addPostFrameCallback((_) => _focus.requestFocus());
  }

  @override
  void dispose() {
    _timer?.cancel();
    _controller.dispose();
    _focus.dispose();
    super.dispose();
  }

  void _startCountdown() {
    _timer?.cancel();
    setState(() => _secondsLeft = 60);
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsLeft <= 1) {
        timer.cancel();
        setState(() => _secondsLeft = 0);
      } else {
        setState(() => _secondsLeft--);
      }
    });
  }

  String get _code => _controller.text;

  Future<void> _verify() async {
    if (_code.length < _length) return;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    setState(() => _submitting = true);
    try {
      await ref.read(authControllerProvider.notifier).verifyOtp(
            phone: widget.phone,
            code: _code,
            purpose: widget.purpose,
          );
      if (!mounted) return;
      if (widget.purpose == OtpPurpose.passwordReset) {
        context.go(Uri(path: '/reset-password', queryParameters: {
          'phone': widget.phone,
          'code': _code,
        }).toString());
      } else {
        final from = widget.from;
        context.go((from != null && from.isNotEmpty) ? from : '/home');
      }
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(toApiException(error).localized(arabic: isAr))),
      );
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  Future<void> _resend() async {
    if (_secondsLeft > 0 || _resending) return;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    setState(() => _resending = true);
    try {
      await ref.read(authControllerProvider.notifier).resendOtp(
            phone: widget.phone,
            purpose: widget.purpose,
          );
      if (mounted) _startCountdown();
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(toApiException(error).localized(arabic: isAr))),
      );
    } finally {
      if (mounted) setState(() => _resending = false);
    }
  }

  String _formatCountdown(bool isAr) {
    final mm = (_secondsLeft ~/ 60).toString().padLeft(2, '0');
    final ss = (_secondsLeft % 60).toString().padLeft(2, '0');
    return localizedDigits('$mm:$ss', arabic: isAr);
  }

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';

    return AuthScaffold(
      header: const StepHeader(current: 2, total: 3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const SizedBox(height: 8),
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(color: bartal.amberTint, borderRadius: BorderRadius.circular(36)),
            alignment: Alignment.center,
            child: const BartalIcon(BartalIcons.bell, color: BartalColors.amber, size: 32),
          ),
          const SizedBox(height: 20),
          Text(
            l10n.otpHeading,
            style: TextStyle(fontSize: 24, height: 1.2, fontWeight: FontWeight.w700, color: bartal.text),
          ),
          const SizedBox(height: 8),
          Text.rich(
            TextSpan(
              text: l10n.authOtpSubtitle(''),
              style: TextStyle(fontSize: 13, height: 1.5, color: bartal.textMute),
              children: [
                TextSpan(
                  text: maskSudanPhone(widget.phone),
                  style: TextStyle(
                    color: bartal.text,
                    fontWeight: FontWeight.w600,
                    fontFamily: 'JetBrainsMono',
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          _OtpBoxes(
            controller: _controller,
            focus: _focus,
            length: _length,
            onChanged: (value) {
              setState(() {});
              if (value.length == _length) _verify();
            },
          ),
          const SizedBox(height: 18),
          if (_secondsLeft > 0) ...[
            _InfoTile(
              leading: _CountdownChip(text: _formatCountdown(isAr)),
              title: l10n.otpResendCountdown(_formatCountdown(isAr)),
            ),
            const SizedBox(height: 10),
          ],
          GestureDetector(
            onTap: _resend,
            child: Opacity(
              opacity: _secondsLeft > 0 ? 0.5 : 1,
              child: _InfoTile(
                leading: const WhatsappGlyph(size: 28),
                title: l10n.otpNotReceived,
                subtitle: _secondsLeft > 0 ? l10n.otpTryWhatsapp : l10n.authOtpResend,
                trailing: const BartalIcon(BartalIcons.arrow, color: BartalColors.amber, size: 14),
              ),
            ),
          ),
          const SizedBox(height: 28),
          AppButton(
            label: l10n.otpVerify,
            expand: true,
            size: AppButtonSize.large,
            loading: _submitting,
            onPressed: _code.length == _length ? _verify : null,
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsetsDirectional.symmetric(horizontal: 12, vertical: 10),
            decoration: BoxDecoration(
              color: bartal.isDark ? bartal.raised : BartalColors.sand,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              children: [
                const Text('🔒', style: TextStyle(fontSize: 13)),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    l10n.otpSecureNote,
                    style: TextStyle(fontSize: 10, color: bartal.textMute),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Six styled boxes driven by one hidden text field; the row is forced LTR
/// so the code reads left-to-right even in an Arabic layout (per design).
class _OtpBoxes extends StatelessWidget {
  const _OtpBoxes({
    required this.controller,
    required this.focus,
    required this.length,
    required this.onChanged,
  });

  final TextEditingController controller;
  final FocusNode focus;
  final int length;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    final code = controller.text;

    return Stack(
      children: [
        Opacity(
          opacity: 0,
          child: TextField(
            controller: controller,
            focusNode: focus,
            keyboardType: TextInputType.number,
            autofillHints: const [AutofillHints.oneTimeCode],
            maxLength: length,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
            onChanged: onChanged,
            decoration: const InputDecoration(counterText: ''),
          ),
        ),
        GestureDetector(
          onTap: focus.requestFocus,
          child: Directionality(
            textDirection: TextDirection.ltr,
            child: Row(
              children: [
                for (var i = 0; i < length; i++) ...[
                  if (i > 0) const SizedBox(width: 8),
                  Expanded(
                    child: AspectRatio(
                      aspectRatio: 1 / 1.15,
                      child: _OtpBox(
                        value: i < code.length ? code[i] : '',
                        active: i == code.length,
                        filled: i < code.length,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _OtpBox extends StatelessWidget {
  const _OtpBox({required this.value, required this.active, required this.filled});

  final String value;
  final bool active;
  final bool filled;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    final borderColor = active
        ? bartal.amber
        : (filled ? (bartal.isDark ? bartal.line : bartal.navy) : bartal.line);
    return AnimatedContainer(
      duration: const Duration(milliseconds: 150),
      decoration: BoxDecoration(
        color: bartal.surface,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: borderColor, width: 1.5),
        boxShadow: active
            ? [BoxShadow(color: bartal.amberTint, spreadRadius: 3)]
            : null,
      ),
      alignment: Alignment.center,
      child: Text(
        value,
        style: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.w700,
          fontFamily: 'JetBrainsMono',
          color: bartal.text,
        ),
      ),
    );
  }
}

class _CountdownChip extends StatelessWidget {
  const _CountdownChip({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Container(
      width: 28,
      height: 28,
      decoration: BoxDecoration(color: bartal.amberTint, shape: BoxShape.circle),
      alignment: Alignment.center,
      child: Text(
        text.length > 2 ? text.substring(text.length - 2) : text,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          fontFamily: 'JetBrainsMono',
          color: bartal.amber,
        ),
      ),
    );
  }
}

class _InfoTile extends StatelessWidget {
  const _InfoTile({required this.leading, required this.title, this.subtitle, this.trailing});

  final Widget leading;
  final String title;
  final String? subtitle;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Container(
      padding: const EdgeInsetsDirectional.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: bartal.surface,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: bartal.line),
      ),
      child: Row(
        children: [
          leading,
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: bartal.text),
                ),
                if (subtitle != null) ...[
                  const SizedBox(height: 1),
                  Text(subtitle!, style: TextStyle(fontSize: 11, color: bartal.textMute)),
                ],
              ],
            ),
          ),
          ?trailing,
        ],
      ),
    );
  }
}
