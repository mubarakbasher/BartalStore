import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/models/user.dart';
import '../../../core/utils/money.dart';
import '../../../core/utils/whatsapp.dart';
import '../../../design/icons.dart';
import '../../../design/motif.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../auth/application/auth_controller.dart';
import '../../wishlist/application/wishlist_controller.dart';

/// Profile dashboard — port of profile-flow.jsx::ProfileScreen. Navy+motif hero
/// (avatar/name/phone/verified/member-since), 3-stat grid, menu sections routed
/// to the real account screens, danger logout, footer.
class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final user = switch (ref.watch(authControllerProvider).valueOrNull) {
      Authenticated(:final user) => user,
      _ => null,
    };
    final wishlistCount = ref.watch(wishlistControllerProvider).valueOrNull?.length ?? 0;

    return Scaffold(
      backgroundColor: bartal.bg,
      body: ListView(
        padding: EdgeInsetsDirectional.only(top: MediaQuery.paddingOf(context).top + 12, bottom: 24),
        children: [
          if (user != null) _Hero(user: user),
          if (user != null)
            _StatsGrid(
              orders: user.ordersCount ?? 0,
              wishlist: wishlistCount,
              points: user.loyaltyPoints,
            ),
          const SizedBox(height: 8),
          _Section(title: l10n.profileSectionAccount, children: [
            _MenuRow(
              icon: BartalIcons.package,
              title: l10n.profileMyOrders,
              onTap: () => context.go('/orders'),
            ),
            _MenuRow(
              icon: BartalIcons.pin,
              title: l10n.profileMyAddresses,
              onTap: () => context.push('/addresses'),
            ),
            _MenuRow(
              icon: BartalIcons.user,
              title: l10n.profilePersonalInfo,
              sub: l10n.profilePersonalInfoSub,
              onTap: () => context.push('/profile/edit'),
            ),
            _MenuRow(
              icon: BartalIcons.check,
              title: l10n.profileSecurity,
              sub: l10n.profileSecuritySub,
              last: true,
              onTap: () => context.push('/profile/change-password'),
            ),
          ]),
          _Section(title: l10n.profileSectionPreferences, children: [
            _MenuRow(
              icon: BartalIcons.grid,
              title: l10n.navSettings,
              sub: l10n.profileSettingsSub,
              onTap: () => context.push('/settings'),
            ),
            _MenuRow(
              icon: BartalIcons.bell,
              title: l10n.navNotifications,
              onTap: () => context.push('/notifications'),
            ),
            _MenuRow(
              icon: BartalIcons.heart,
              title: l10n.profileWishlist,
              sub: l10n.profileWishlistSub(localizedDigits('$wishlistCount', arabic: isAr)),
              last: true,
              onTap: () => context.push('/wishlist'),
            ),
          ]),
          _Section(title: l10n.profileSectionSupport, children: [
            _MenuRow(
              icon: BartalIcons.search,
              title: l10n.profileHelpCenter,
              onTap: () => context.push('/help'),
            ),
            _MenuRow(
              icon: BartalIcons.share,
              title: l10n.profileWhatsappSupport,
              accent: const Color(0xFF25D366),
              last: true,
              onTap: () => launchWhatsApp(),
            ),
          ]),
          const SizedBox(height: 8),
          Padding(
            padding: const EdgeInsetsDirectional.symmetric(horizontal: 16),
            child: OutlinedButton(
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: bartal.line),
                padding: const EdgeInsetsDirectional.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              onPressed: () => ref.read(authControllerProvider.notifier).logout(),
              child: Text(l10n.authLogout,
                  style: TextStyle(color: bartal.danger, fontWeight: FontWeight.w700)),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            '${l10n.profileVersionLine('0.1.0')} · ${l10n.profileFooter}',
            textAlign: TextAlign.center,
            style: context.bartalType.micro,
          ),
        ],
      ),
    );
  }
}

class _Hero extends StatelessWidget {
  const _Hero({required this.user});

  final User user;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final year = user.createdAt != null
        ? localizedDigits('${user.createdAt!.year}', arabic: isAr)
        : null;

    return Padding(
      padding: const EdgeInsetsDirectional.fromSTEB(16, 0, 16, 0),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(18),
        child: Container(
          decoration: BoxDecoration(color: bartal.navy, borderRadius: BorderRadius.circular(18)),
          child: MotifBackground(
            color: bartal.amber,
            opacity: 0.08,
            child: Padding(
              padding: const EdgeInsetsDirectional.fromSTEB(18, 20, 18, 20),
              child: Row(
                children: [
                  Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      color: bartal.amber,
                      shape: BoxShape.circle,
                      border: Border.all(color: bartal.amberTint, width: 3),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      user.initials,
                      style: const TextStyle(
                          fontFamily: 'Poppins', color: Colors.white, fontWeight: FontWeight.w800, fontSize: 22),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(user.name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w700)),
                        const SizedBox(height: 2),
                        Text(user.phone,
                            style: TextStyle(
                                color: Colors.white.withValues(alpha: 0.7),
                                fontFamily: 'JetBrainsMono',
                                fontSize: 13)),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 6,
                          runSpacing: 6,
                          children: [
                            if (user.isVerified)
                              _Badge(text: l10n.profileVerified, background: bartal.amber),
                            if (year != null)
                              _Badge(
                                text: l10n.profileMemberSince(year),
                                background: Colors.white.withValues(alpha: 0.15),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  const _Badge({required this.text, required this.background});

  final String text;
  final Color background;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsetsDirectional.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(color: background, borderRadius: BorderRadius.circular(100)),
      child: Text(text,
          style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w700)),
    );
  }
}

class _StatsGrid extends StatelessWidget {
  const _StatsGrid({required this.orders, required this.wishlist, required this.points});

  final int orders;
  final int wishlist;
  final int points;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    String d(int v) => localizedDigits('$v', arabic: isAr);

    return Padding(
      padding: const EdgeInsetsDirectional.fromSTEB(16, 12, 16, 0),
      child: Container(
        decoration: BoxDecoration(
          color: bartal.isDark ? bartal.surface : bartal.navy.withValues(alpha: 0.06),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Expanded(child: _Cell(value: d(orders), label: l10n.profileStatOrders)),
            _Divider(color: bartal.line),
            Expanded(child: _Cell(value: d(wishlist), label: l10n.profileStatWishlist)),
            _Divider(color: bartal.line),
            Expanded(child: _Cell(value: d(points), label: l10n.profileStatPoints)),
          ],
        ),
      ),
    );
  }
}

class _Divider extends StatelessWidget {
  const _Divider({required this.color});

  final Color color;

  @override
  Widget build(BuildContext context) => Container(width: 1, height: 32, color: color);
}

class _Cell extends StatelessWidget {
  const _Cell({required this.value, required this.label});

  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Padding(
      padding: const EdgeInsetsDirectional.symmetric(vertical: 12, horizontal: 8),
      child: Column(
        children: [
          Text(value,
              style: TextStyle(color: bartal.amber, fontSize: 20, fontWeight: FontWeight.w800)),
          const SizedBox(height: 2),
          Text(label, style: context.bartalType.micro),
        ],
      ),
    );
  }
}

class _Section extends StatelessWidget {
  const _Section({required this.title, required this.children});

  final String title;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Padding(
      padding: const EdgeInsetsDirectional.fromSTEB(16, 8, 16, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsetsDirectional.fromSTEB(4, 8, 4, 8),
            child: Text(title, style: context.bartalType.micro),
          ),
          Container(
            decoration: BoxDecoration(
              color: bartal.surface,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: bartal.line),
            ),
            child: Column(children: children),
          ),
        ],
      ),
    );
  }
}

class _MenuRow extends StatelessWidget {
  const _MenuRow({
    required this.icon,
    required this.title,
    this.sub,
    this.accent,
    this.last = false,
    required this.onTap,
  });

  final BartalIconSpec icon;
  final String title;
  final String? sub;
  final Color? accent;
  final bool last;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    final titleColor = accent ?? bartal.text;
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsetsDirectional.symmetric(horizontal: 14, vertical: 14),
        decoration: BoxDecoration(
          border: last ? null : Border(bottom: BorderSide(color: bartal.line)),
        ),
        child: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: bartal.isDark ? bartal.raised : bartal.bg,
                borderRadius: BorderRadius.circular(10),
              ),
              alignment: Alignment.center,
              child: BartalIcon(icon, color: accent ?? bartal.navy, size: 18),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: context.bartalType.label.copyWith(
                          fontWeight: FontWeight.w600, color: titleColor)),
                  if (sub != null) ...[
                    const SizedBox(height: 2),
                    Text(sub!, style: context.bartalType.small),
                  ],
                ],
              ),
            ),
            BartalIcon(BartalIcons.arrow, color: bartal.textMute, size: 16),
          ],
        ),
      ),
    );
  }
}
