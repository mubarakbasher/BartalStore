import 'package:flutter/material.dart';

import '../design/icons.dart';
import '../design/theme.dart';

/// Secondary-screen header — port of the design's `ScreenHeader`:
/// 36px circular bordered back button + 16px/700 title.
/// The chevron flips automatically under RTL.
class ScreenHeader extends StatelessWidget implements PreferredSizeWidget {
  const ScreenHeader({super.key, required this.title, this.onBack, this.trailing});

  final String title;
  final VoidCallback? onBack;
  final Widget? trailing;

  @override
  Size get preferredSize => const Size.fromHeight(64);

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return SafeArea(
      bottom: false,
      child: Padding(
        padding: const EdgeInsetsDirectional.fromSTEB(18, 14, 18, 14),
        child: Row(
          children: [
            BackCircleButton(onBack: onBack),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                title,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: bartal.text,
                ),
              ),
            ),
            ?trailing,
          ],
        ),
      ),
    );
  }
}

/// 36px circular bordered back affordance used across secondary screens.
class BackCircleButton extends StatelessWidget {
  const BackCircleButton({super.key, this.onBack});

  final VoidCallback? onBack;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Semantics(
      button: true,
      label: MaterialLocalizations.of(context).backButtonTooltip,
      child: Material(
        color: Colors.transparent,
        shape: CircleBorder(side: BorderSide(color: bartal.line)),
        child: InkWell(
          customBorder: const CircleBorder(),
          onTap: onBack ?? () => Navigator.of(context).maybePop(),
          child: SizedBox(
            // Visual is 36px per the design; the InkWell hit target is padded
            // to 44 via the parent row spacing remaining comfortable.
            width: 44,
            height: 44,
            child: Center(
              child: BartalIcon(BartalIcons.back, color: bartal.text, size: 18),
            ),
          ),
        ),
      ),
    );
  }
}
