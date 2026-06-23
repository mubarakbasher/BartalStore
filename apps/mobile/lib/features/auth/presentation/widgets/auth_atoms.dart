import 'package:flutter/material.dart';

import '../../../../core/utils/money.dart';
import '../../../../design/theme.dart';
import '../../../../design/tokens.dart';
import '../../../../l10n/gen/l10n.dart';
import '../../../../widgets/screen_header.dart';

/// Shared auth-flow building blocks ported from auth-screens.jsx / auth-gaps.jsx.
/// Field heights, radii (12), amber focus border, and copy match the design.

/// Scrollable auth page with the design's 36px circular back affordance.
class AuthScaffold extends StatelessWidget {
  const AuthScaffold({super.key, this.header, required this.child});

  /// Optional widget rendered in the top bar after the back button
  /// (e.g. the signup step indicator).
  final Widget? header;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: context.bartal.bg,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsetsDirectional.fromSTEB(18, 14, 18, 0),
              child: Row(
                children: [
                  const BackCircleButton(),
                  if (header != null) ...[
                    const SizedBox(width: 12),
                    Expanded(child: header!),
                  ],
                ],
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsetsDirectional.fromSTEB(24, 12, 24, 24),
                child: child,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Small amber uppercase eyebrow above a title (Login/Forgot headers).
class AuthEyebrow extends StatelessWidget {
  const AuthEyebrow(this.text, {super.key});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text.toUpperCase(),
      style: TextStyle(
        fontSize: 11,
        letterSpacing: 2,
        fontWeight: FontWeight.w700,
        color: context.bartal.amber,
      ),
    );
  }
}

/// Field label (12px / 600, muted).
class FieldLabel extends StatelessWidget {
  const FieldLabel(this.text, {super.key});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsetsDirectional.only(bottom: 6),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: context.bartal.textMute,
        ),
      ),
    );
  }
}

/// Bordered text field matching the design's 48/52px input shells.
/// Amber 1.5px border when focused, line border otherwise.
class AuthField extends StatefulWidget {
  const AuthField({
    super.key,
    required this.controller,
    this.hint,
    this.keyboardType,
    this.autofillHints,
    this.errorText,
    this.prefix,
    this.trailing,
    this.obscure = false,
    this.mono = false,
    this.height = 52,
    this.onChanged,
    this.textInputAction,
    this.onSubmitted,
    this.autofocus = false,
    this.enabled = true,
  });

  final TextEditingController controller;
  final String? hint;
  final TextInputType? keyboardType;
  final List<String>? autofillHints;
  final String? errorText;
  final Widget? prefix;
  final Widget? trailing;
  final bool obscure;
  final bool mono;
  final double height;
  final ValueChanged<String>? onChanged;
  final TextInputAction? textInputAction;
  final ValueChanged<String>? onSubmitted;
  final bool autofocus;
  final bool enabled;

  @override
  State<AuthField> createState() => _AuthFieldState();
}

class _AuthFieldState extends State<AuthField> {
  final _focus = FocusNode();

  @override
  void initState() {
    super.initState();
    _focus.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _focus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    final hasError = widget.errorText != null;
    final borderColor = hasError
        ? bartal.danger
        : (_focus.hasFocus ? bartal.amber : bartal.line);
    final borderWidth = (_focus.hasFocus || hasError) ? 1.5 : 1.0;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          height: widget.height,
          decoration: BoxDecoration(
            color: bartal.surface,
            borderRadius: BorderRadius.circular(BartalRadii.r12),
            border: Border.all(color: borderColor, width: borderWidth),
          ),
          child: Row(
            children: [
              if (widget.prefix != null) widget.prefix!,
              Expanded(
                child: TextField(
                  controller: widget.controller,
                  focusNode: _focus,
                  enabled: widget.enabled,
                  obscureText: widget.obscure,
                  keyboardType: widget.keyboardType,
                  autofillHints: widget.autofillHints,
                  textInputAction: widget.textInputAction,
                  autofocus: widget.autofocus,
                  onChanged: widget.onChanged,
                  onSubmitted: widget.onSubmitted,
                  style: TextStyle(
                    fontSize: 16,
                    fontFamily: widget.mono ? 'JetBrainsMono' : null,
                    letterSpacing: widget.mono ? 1 : 0,
                    color: bartal.text,
                  ),
                  decoration: InputDecoration(
                    isCollapsed: true,
                    border: InputBorder.none,
                    hintText: widget.hint,
                    hintStyle: TextStyle(color: bartal.textMute, fontSize: 15),
                    contentPadding:
                        const EdgeInsetsDirectional.symmetric(horizontal: 14),
                  ),
                ),
              ),
              if (widget.trailing != null)
                Padding(
                  padding: const EdgeInsetsDirectional.only(end: 14),
                  child: widget.trailing!,
                ),
            ],
          ),
        ),
        if (hasError)
          Padding(
            padding: const EdgeInsetsDirectional.only(top: 6, start: 2),
            child: Text(
              widget.errorText!,
              style: TextStyle(fontSize: 12, color: bartal.danger),
            ),
          ),
      ],
    );
  }
}

/// Phone field with the 🇸🇩 +249 prefix block (mono input).
class PhoneAuthField extends StatelessWidget {
  const PhoneAuthField({
    super.key,
    required this.controller,
    this.errorText,
    this.onSubmitted,
    this.textInputAction,
  });

  final TextEditingController controller;
  final String? errorText;
  final ValueChanged<String>? onSubmitted;
  final TextInputAction? textInputAction;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return AuthField(
      controller: controller,
      mono: true,
      hint: '91 234 5678',
      keyboardType: TextInputType.phone,
      autofillHints: const [AutofillHints.telephoneNumber],
      errorText: errorText,
      textInputAction: textInputAction,
      onSubmitted: onSubmitted,
      prefix: Container(
        padding: const EdgeInsetsDirectional.symmetric(horizontal: 14),
        margin: const EdgeInsetsDirectional.only(end: 2),
        decoration: BoxDecoration(
          border: BorderDirectional(end: BorderSide(color: bartal.line)),
        ),
        child: Center(
          child: Text(
            '🇸🇩 +249',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              fontFamily: 'JetBrainsMono',
              color: bartal.text,
            ),
          ),
        ),
      ),
    );
  }
}

/// Password field with Show/Hide toggle.
class PasswordAuthField extends StatefulWidget {
  const PasswordAuthField({
    super.key,
    required this.controller,
    this.errorText,
    this.hint,
    this.autofillHints,
    this.onChanged,
    this.onSubmitted,
    this.textInputAction,
  });

  final TextEditingController controller;
  final String? errorText;
  final String? hint;
  final List<String>? autofillHints;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final TextInputAction? textInputAction;

  @override
  State<PasswordAuthField> createState() => _PasswordAuthFieldState();
}

class _PasswordAuthFieldState extends State<PasswordAuthField> {
  bool _obscure = true;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    return AuthField(
      controller: widget.controller,
      obscure: _obscure,
      hint: widget.hint,
      keyboardType: TextInputType.visiblePassword,
      autofillHints: widget.autofillHints,
      errorText: widget.errorText,
      onChanged: widget.onChanged,
      onSubmitted: widget.onSubmitted,
      textInputAction: widget.textInputAction,
      trailing: Semantics(
        button: true,
        label: 'Toggle password visibility',
        child: GestureDetector(
          onTap: () => setState(() => _obscure = !_obscure),
          // Expand the hit area to ≥44×44 without changing the label's look.
          child: ConstrainedBox(
            constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
            child: Center(
              child: Text(
                _obscure ? l10n.commonShow : l10n.commonHide,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: context.bartal.amber,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Segmented step indicator (signup/otp/reset use 3 segments).
class StepProgress extends StatelessWidget {
  const StepProgress({super.key, required this.total, required this.current});

  /// 1-based index of the active step.
  final int total;
  final int current;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Row(
      children: [
        for (var i = 0; i < total; i++) ...[
          if (i > 0) const SizedBox(width: 4),
          Expanded(
            child: Container(
              height: 3,
              decoration: BoxDecoration(
                color: i < current
                    ? (i < current - 1 ? bartal.success : bartal.amber)
                    : bartal.line,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
        ],
      ],
    );
  }
}

/// Step indicator + "Step N of M" caption (signup/otp/reset top bars).
class StepHeader extends StatelessWidget {
  const StepHeader({super.key, required this.current, required this.total});

  final int current;
  final int total;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    String d(int n) => localizedDigits('$n', arabic: isAr);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        StepProgress(total: total, current: current),
        const SizedBox(height: 4),
        Text(
          l10n.authStepOf(d(current), d(total)),
          style: TextStyle(fontSize: 11, color: context.bartal.textMute),
        ),
      ],
    );
  }
}

/// 4-bar password strength meter with a label, per the design.
class PasswordStrength {
  const PasswordStrength(this.level, this.label);

  /// 0..4
  final int level;
  final String label;

  static PasswordStrength of(String password, L10n l10n) {
    var score = 0;
    if (password.length >= 8) score++;
    if (RegExp(r'[a-z]').hasMatch(password) && RegExp(r'[A-Z]').hasMatch(password)) {
      score++;
    }
    if (RegExp(r'\d').hasMatch(password)) score++;
    if (RegExp(r'[!@#$%^&*(),.?":{}|<>_\-]').hasMatch(password)) score++;
    final label = switch (score) {
      0 || 1 => l10n.pwStrengthWeak,
      2 => l10n.pwStrengthFair,
      3 => l10n.pwStrengthGood,
      _ => l10n.pwStrengthStrong,
    };
    return PasswordStrength(score, label);
  }

  Color color(BartalTheme bartal) => switch (level) {
        0 || 1 => bartal.danger,
        2 => bartal.amber,
        _ => bartal.success,
      };
}

class PasswordStrengthMeter extends StatelessWidget {
  const PasswordStrengthMeter({super.key, required this.password});

  final String password;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final strength = PasswordStrength.of(password, l10n);
    final color = strength.color(bartal);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          children: [
            for (var i = 0; i < 4; i++) ...[
              if (i > 0) const SizedBox(width: 4),
              Expanded(
                child: Container(
                  height: 3,
                  decoration: BoxDecoration(
                    color: i < strength.level ? color : bartal.line,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
            ],
          ],
        ),
        if (password.isNotEmpty)
          Padding(
            padding: const EdgeInsetsDirectional.only(top: 6),
            child: Text(
              l10n.pwStrengthLabel(strength.label),
              style: TextStyle(fontSize: 11, color: color, fontWeight: FontWeight.w600),
            ),
          ),
      ],
    );
  }
}

/// Small "W" WhatsApp glyph used in auth (brand green #25D366 from the design).
class WhatsappGlyph extends StatelessWidget {
  const WhatsappGlyph({super.key, this.size = 22, this.background = const Color(0xFF25D366)});

  final double size;
  final Color background;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(color: background, shape: BoxShape.circle),
      alignment: Alignment.center,
      child: Text(
        'W',
        style: TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.w700,
          fontSize: size * 0.5,
        ),
      ),
    );
  }
}
