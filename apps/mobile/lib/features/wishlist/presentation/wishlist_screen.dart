import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/connectivity/connectivity_provider.dart';
import '../../../core/models/wishlist_item.dart';
import '../../../core/utils/money.dart';
import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../design/tokens.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/empty_state.dart';
import '../../../widgets/error_screen.dart';
import '../../../widgets/price_tag.dart';
import '../../../widgets/product_image.dart';
import '../../../widgets/screen_header.dart';
import '../../../widgets/skeletons.dart';
import '../application/wishlist_controller.dart';

/// Saved items — port of mobile-extras.jsx::WishlistScreen. Cards with
/// price-drop / out-of-stock badges, remove + add-to-cart actions. The screen
/// is auth-gated by the router. Add-to-cart routes to the cart for now
/// (mutations land in Slice 3).
class WishlistScreen extends ConsumerWidget {
  const WishlistScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final wishlist = ref.watch(wishlistControllerProvider);

    return Scaffold(
      backgroundColor: bartal.bg,
      body: Column(
        children: [
          ScreenHeader(title: l10n.wishlistTitle),
          Expanded(
            child: wishlist.when(
              loading: () => const ListSkeleton(),
              error: (error, _) => ErrorState(
                kind: ref.read(isOnlineProvider) ? ErrorScreenKind.error : ErrorScreenKind.offline,
                onRetry: () => ref.invalidate(wishlistControllerProvider),
              ),
              data: (items) {
                if (items.isEmpty) {
                  return EmptyState(
                    kind: EmptyStateKind.wishlist,
                    onCta: () => context.go('/home'),
                  );
                }
                return ListView(
                  padding: const EdgeInsetsDirectional.only(bottom: 30),
                  children: [
                    Padding(
                      padding: const EdgeInsetsDirectional.fromSTEB(16, 0, 16, 8),
                      child: Text(
                        l10n.wishlistSavedCount(localizedDigits('${items.length}', arabic: isAr)),
                        style: context.bartalType.small,
                      ),
                    ),
                    for (final item in items)
                      Padding(
                        padding: const EdgeInsetsDirectional.fromSTEB(16, 0, 16, 10),
                        child: _WishlistCard(item: item),
                      ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _WishlistCard extends ConsumerWidget {
  const _WishlistCard({required this.item});

  final WishlistItem item;

  Future<void> _remove(BuildContext context, WidgetRef ref) async {
    final l10n = L10n.of(context);
    try {
      await ref.read(wishlistControllerProvider.notifier).toggle(item.productId);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(l10n.wishlistRemoved)));
      }
    } catch (_) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(l10n.actionFailed)));
      }
    }
  }

  bool get _priceDropped =>
      item.comparePrice != null && item.price < item.comparePrice!;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final arabic = Localizations.localeOf(context).languageCode == 'ar';

    return GestureDetector(
      onTap: () => context.push('/product/${item.slug}'),
      child: Container(
        padding: const EdgeInsetsDirectional.all(12),
        decoration: BoxDecoration(
          color: bartal.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: bartal.line),
        ),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: SizedBox(
                width: 76,
                height: 76,
                child: ProductThumb(
                  productId: item.productId,
                  imageUrl: item.imageUrl,
                  label: item.nameEn,
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.name(arabic: arabic),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: context.bartalType.label.copyWith(fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 4),
                  PriceTag(amount: item.price, compare: item.comparePrice, size: 13),
                  if (_priceDropped)
                    Padding(
                      padding: const EdgeInsetsDirectional.only(top: 6),
                      child: _Pill(
                        label: '✦ ${l10n.wishlistPriceDropped}',
                        color: bartal.danger,
                      ),
                    ),
                  if (item.outOfStock)
                    Padding(
                      padding: const EdgeInsetsDirectional.only(top: 6),
                      child: _Pill(label: l10n.productsOutOfStock, color: bartal.textMute),
                    ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Column(
              children: [
                _ActionButton(
                  filled: true,
                  // Add to cart lands in Slice 3 — routes to cart for now.
                  onTap: () => context.go('/cart'),
                  child: const BartalIcon(BartalIcons.bag, color: Colors.white, size: 14),
                ),
                const SizedBox(height: 6),
                _ActionButton(
                  filled: false,
                  onTap: () => _remove(context, ref),
                  child: const BartalIcon(BartalIcons.heart, color: BartalColors.amber, size: 14),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _Pill extends StatelessWidget {
  const _Pill({required this.label, required this.color});

  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsetsDirectional.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.13),
        borderRadius: BorderRadius.circular(100),
      ),
      child: Text(
        label,
        style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: color),
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  const _ActionButton({required this.child, required this.onTap, required this.filled});

  final Widget child;
  final VoidCallback onTap;
  final bool filled;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Semantics(
      button: true,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(10),
        child: Container(
          width: 40,
          height: 40,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: filled ? bartal.amber : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
            border: filled ? null : Border.all(color: bartal.line),
          ),
          child: child,
        ),
      ),
    );
  }
}
