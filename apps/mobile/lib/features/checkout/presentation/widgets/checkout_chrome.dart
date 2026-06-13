import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../../design/theme.dart';
import '../../../../l10n/gen/l10n.dart';
import '../../../../widgets/screen_header.dart';

/// 3-step progress bar — port of checkout-flow.jsx::CheckoutStepper.
/// `current` is 0-based (0 = Address, 1 = Payment, 2 = Review).
class CheckoutStepper extends StatelessWidget {
  const CheckoutStepper({super.key, required this.current});

  final int current;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final labels = [l10n.stepAddress, l10n.stepPayment, l10n.stepReview];

    return Padding(
      padding: const EdgeInsetsDirectional.fromSTEB(16, 8, 16, 14),
      child: Row(
        children: [
          for (var i = 0; i < 3; i++) ...[
            if (i > 0) const SizedBox(width: 6),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Container(
                    height: 4,
                    decoration: BoxDecoration(
                      color: i <= current ? bartal.amber : bartal.line,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    labels[i].toUpperCase(),
                    style: TextStyle(
                      fontSize: 11,
                      letterSpacing: 0.5,
                      fontWeight: i <= current ? FontWeight.w700 : FontWeight.w500,
                      color: i <= current ? bartal.navy : bartal.textMute,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// A checkout-step scaffold: header (back) + stepper + scrollable body +
/// sticky bottom action bar.
class CheckoutScaffold extends StatelessWidget {
  const CheckoutScaffold({
    super.key,
    required this.title,
    required this.step,
    required this.children,
    required this.actionLabel,
    required this.onAction,
    this.actionEnabled = true,
    this.actionLoading = false,
  });

  final String title;
  final int step;
  final List<Widget> children;
  final String actionLabel;
  final VoidCallback? onAction;
  final bool actionEnabled;
  final bool actionLoading;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Scaffold(
      backgroundColor: bartal.bg,
      body: Column(
        children: [
          ScreenHeader(title: title),
          CheckoutStepper(current: step),
          Expanded(
            child: ListView(
              padding: const EdgeInsetsDirectional.only(bottom: 16),
              children: children,
            ),
          ),
          StickyAction(
            label: actionLabel,
            onTap: actionEnabled ? onAction : null,
            loading: actionLoading,
          ),
        ],
      ),
    );
  }
}

/// Sticky bottom navy action button — port of checkout-flow.jsx::StickyAction.
class StickyAction extends StatelessWidget {
  const StickyAction({super.key, required this.label, required this.onTap, this.loading = false});

  final String label;
  final VoidCallback? onTap;
  final bool loading;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    final disabled = onTap == null || loading;
    return Container(
      decoration: BoxDecoration(
        color: bartal.surface,
        border: Border(top: BorderSide(color: bartal.line)),
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsetsDirectional.fromSTEB(16, 14, 16, 14),
          child: Opacity(
            opacity: disabled && !loading ? 0.5 : 1,
            child: Material(
              color: bartal.navy,
              borderRadius: BorderRadius.circular(14),
              child: InkWell(
                onTap: disabled ? null : onTap,
                borderRadius: BorderRadius.circular(14),
                child: Container(
                  height: 52,
                  alignment: Alignment.center,
                  child: loading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : Text(
                          label,
                          style: const TextStyle(
                              color: Colors.white, fontSize: 15, fontWeight: FontWeight.w700),
                        ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Section title (micro, muted, uppercase) — port of the JSX `Section` helper.
class CheckoutSection extends StatelessWidget {
  const CheckoutSection({super.key, required this.title, required this.child, this.trailing});

  final String title;
  final Widget child;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsetsDirectional.fromSTEB(16, 8, 16, 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsetsDirectional.only(bottom: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(title, style: context.bartalType.micro),
                ?trailing,
              ],
            ),
          ),
          child,
        ],
      ),
    );
  }
}

/// Label + value row with an optional copy button — port of the JSX `InfoRow`.
class InfoRow extends StatelessWidget {
  const InfoRow({
    super.key,
    required this.label,
    required this.value,
    this.copyText,
    this.mono = false,
    this.last = false,
    this.valueColor,
  });

  final String label;
  final String value;
  final String? copyText;
  final bool mono;
  final bool last;
  final Color? valueColor;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Container(
      padding: const EdgeInsetsDirectional.symmetric(vertical: 11),
      decoration: BoxDecoration(
        border: last ? null : Border(bottom: BorderSide(color: bartal.line)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Flexible(child: Text(label, style: context.bartalType.small)),
          const SizedBox(width: 12),
          Flexible(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Flexible(
                  child: Text(
                    value,
                    textAlign: TextAlign.end,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontFamily: mono ? 'JetBrainsMono' : null,
                      fontSize: mono ? 12 : 14,
                      fontWeight: FontWeight.w700,
                      color: valueColor ?? bartal.text,
                    ),
                  ),
                ),
                if (copyText != null) ...[
                  const SizedBox(width: 8),
                  CopyButton(text: copyText!),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// 26px copy-to-clipboard button (Clipboard + snackbar).
class CopyButton extends StatelessWidget {
  const CopyButton({super.key, required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    final l10n = L10n.of(context);
    return Semantics(
      button: true,
      child: Material(
        color: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(7),
          side: BorderSide(color: bartal.line),
        ),
        child: InkWell(
          onTap: () async {
            await Clipboard.setData(ClipboardData(text: text));
            if (context.mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(l10n.commonCopied), duration: const Duration(seconds: 1)),
              );
            }
          },
          borderRadius: BorderRadius.circular(7),
          child: SizedBox(
            width: 30,
            height: 30,
            child: Icon(Icons.copy_rounded, size: 14, color: bartal.amber),
          ),
        ),
      ),
    );
  }
}

/// Selectable option card (payment methods, banks) — amber-bordered when on.
class SelectableCard extends StatelessWidget {
  const SelectableCard({
    super.key,
    required this.selected,
    required this.onTap,
    required this.child,
    this.disabled = false,
  });

  final bool selected;
  final VoidCallback onTap;
  final Widget child;
  final bool disabled;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Opacity(
      opacity: disabled ? 0.55 : 1,
      child: Material(
        color: bartal.surface,
        borderRadius: BorderRadius.circular(14),
        child: InkWell(
          onTap: disabled ? null : onTap,
          borderRadius: BorderRadius.circular(14),
          child: Container(
            padding: const EdgeInsetsDirectional.all(14),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: selected ? bartal.amber : bartal.line,
                width: selected ? 2 : 1,
              ),
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}

/// Amber radio dot used in selectable cards.
class RadioDot extends StatelessWidget {
  const RadioDot({super.key, required this.selected});

  final bool selected;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Container(
      width: 20,
      height: 20,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: selected ? bartal.amber : bartal.line, width: 2),
      ),
      child: selected
          ? Center(
              child: Container(
                width: 10,
                height: 10,
                decoration: BoxDecoration(color: bartal.amber, shape: BoxShape.circle),
              ),
            )
          : null,
    );
  }
}
