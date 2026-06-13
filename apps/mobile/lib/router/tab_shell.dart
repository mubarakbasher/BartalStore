import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../design/icons.dart';
import '../design/theme.dart';
import '../features/cart/application/cart_controller.dart';
import '../l10n/gen/l10n.dart';
import '../widgets/badges.dart';
import '../widgets/offline_banner.dart';

/// 5-tab shell — port of `mobile-v1.jsx V1TabBar`: surface bar with top
/// hairline, 22px stroke icons, 10px labels (700 when active), amber active
/// state, red count badge on the cart tab. The offline banner mounts above
/// the page content (PRD §7.1.3).
class TabShell extends ConsumerWidget {
  const TabShell({super.key, required this.navigationShell});

  final StatefulNavigationShell navigationShell;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final cartCount = ref.watch(cartCountProvider);

    final items = [
      (icon: BartalIcons.home, label: l10n.navHome, badge: 0),
      (icon: BartalIcons.grid, label: l10n.navShop, badge: 0),
      (icon: BartalIcons.bag, label: l10n.navCart, badge: cartCount),
      (icon: BartalIcons.package, label: l10n.navOrders, badge: 0),
      (icon: BartalIcons.user, label: l10n.navProfile, badge: 0),
    ];

    return Scaffold(
      body: Column(
        children: [
          const OfflineBanner(),
          Expanded(child: navigationShell),
        ],
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: bartal.surface,
          border: Border(top: BorderSide(color: bartal.line)),
        ),
        child: SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsetsDirectional.fromSTEB(4, 8, 4, 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                for (var i = 0; i < items.length; i++)
                  _TabItem(
                    icon: items[i].icon,
                    label: items[i].label,
                    badge: items[i].badge,
                    active: navigationShell.currentIndex == i,
                    onTap: () => navigationShell.goBranch(
                      i,
                      initialLocation: i == navigationShell.currentIndex,
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _TabItem extends StatelessWidget {
  const _TabItem({
    required this.icon,
    required this.label,
    required this.badge,
    required this.active,
    required this.onTap,
  });

  final BartalIconSpec icon;
  final String label;
  final int badge;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    final color = active ? bartal.amber : bartal.textMute;

    return Semantics(
      button: true,
      selected: active,
      label: label,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: ConstrainedBox(
          // ui-ux-pro-max: ≥48dp touch target per tab.
          constraints: const BoxConstraints(minWidth: 56, minHeight: 48),
          child: Padding(
            padding: const EdgeInsetsDirectional.symmetric(horizontal: 8, vertical: 6),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Stack(
                  clipBehavior: Clip.none,
                  children: [
                    BartalIcon(icon, color: color, size: 22),
                    if (badge > 0)
                      PositionedDirectional(
                        top: -4,
                        end: -6,
                        child: CountBadge(count: badge),
                      ),
                  ],
                ),
                const SizedBox(height: 3),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 10,
                    height: 1.3,
                    fontWeight: active ? FontWeight.w700 : FontWeight.w500,
                    color: color,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
