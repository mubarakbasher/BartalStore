import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../core/api/envelope.dart';
import '../../../core/connectivity/connectivity_provider.dart';
import '../../../core/models/product.dart';
import '../../../core/utils/money.dart';
import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../design/tokens.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/app_button.dart';
import '../../../widgets/badges.dart';
import '../../../widgets/error_screen.dart';
import '../../../widgets/price_tag.dart';
import '../../../widgets/product_image.dart';
import '../../../widgets/skeletons.dart';
import '../../auth/application/auth_controller.dart';
import '../../cart/application/cart_controller.dart';
import '../../catalog/application/catalog_providers.dart';
import '../../wishlist/application/wishlist_controller.dart';

/// Product detail — full port of mobile-v1.jsx::V1Detail: image hero with
/// overlay controls, body sheet (breadcrumb, title, price + stock, rating,
/// description), and a sticky add-to-cart bar.
class ProductDetailScreen extends ConsumerWidget {
  const ProductDetailScreen({super.key, required this.idOrSlug});

  final String idOrSlug;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final detail = ref.watch(productDetailProvider(idOrSlug));

    return Scaffold(
      backgroundColor: context.bartal.bg,
      body: detail.when(
        loading: () => SafeArea(
          child: Stack(
            children: [
              const DetailSkeleton(),
              PositionedDirectional(
                top: 12,
                start: 12,
                child: _CircleButton(
                  onTap: () => context.pop(),
                  child: const BartalIcon(BartalIcons.back, color: BartalColors.navy, size: 18),
                ),
              ),
            ],
          ),
        ),
        error: (error, _) {
          final online = ref.read(isOnlineProvider);
          return SafeArea(
            child: ErrorState(
              kind: online ? ErrorScreenKind.error : ErrorScreenKind.offline,
              onRetry: () => ref.invalidate(productDetailProvider(idOrSlug)),
            ),
          );
        },
        data: (product) => _DetailBody(product: product),
      ),
    );
  }
}

class _DetailBody extends ConsumerWidget {
  const _DetailBody({required this.product});

  final Product product;

  Future<void> _shareWhatsapp(BuildContext context, bool arabic) async {
    final name = product.name(arabic: arabic);
    final url = 'https://bartal.sd/p/${product.slug}';
    final uri = Uri.parse('https://wa.me/?text=${Uri.encodeComponent('$name\n$url')}');
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  Future<void> _toggleWishlist(BuildContext context, WidgetRef ref) async {
    final l10n = L10n.of(context);
    final auth = ref.read(authControllerProvider.notifier);
    if (!auth.isAuthenticated) {
      context.push(Uri(path: '/welcome', queryParameters: {
        'from': '/product/${product.slug}',
      }).toString());
      return;
    }
    try {
      await ref.read(wishlistControllerProvider.notifier).toggle(product.id);
    } catch (_) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(l10n.actionFailed)));
      }
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final arabic = Localizations.localeOf(context).languageCode == 'ar';
    final inWishlist = ref.watch(wishlistIdsProvider).contains(product.id);
    final reviews = ref.watch(reviewsProvider(product.id));

    return Stack(
      children: [
        CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: _ImageHero(
                product: product,
                inWishlist: inWishlist,
                onBack: () => context.pop(),
                onShare: () => _shareWhatsapp(context, arabic),
                onWishlist: () => _toggleWishlist(context, ref),
              ),
            ),
            SliverToBoxAdapter(
              child: Transform.translate(
                offset: const Offset(0, -14),
                child: Container(
                  decoration: BoxDecoration(
                    color: bartal.bg,
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                  ),
                  padding: const EdgeInsetsDirectional.fromSTEB(16, 18, 16, 110),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (product.category != null)
                        Text(
                          product.category!.name(arabic: arabic).toUpperCase(),
                          style: context.bartalType.micro.copyWith(color: bartal.amber),
                        ),
                      const SizedBox(height: 4),
                      Text(product.name(arabic: arabic), style: context.bartalType.h1),
                      if (product.description(arabic: arabic).isNotEmpty) ...[
                        const SizedBox(height: 6),
                        Text(
                          product.description(arabic: arabic),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: context.bartalType.small,
                        ),
                      ],
                      const SizedBox(height: 14),
                      Row(
                        children: [
                          PriceTag(amount: product.price, compare: product.comparePrice, size: 24),
                          const SizedBox(width: 10),
                          _StockChip(product: product),
                        ],
                      ),
                      const SizedBox(height: 14),
                      _RatingRow(
                        product: product,
                        averageRating: reviews.valueOrNull?.summary.averageRating,
                        reviewCount: reviews.valueOrNull?.summary.count,
                      ),
                      const SizedBox(height: 18),
                      Text(l10n.productsDescription, style: context.bartalType.label),
                      const SizedBox(height: 8),
                      Text(
                        product.description(arabic: arabic).isEmpty
                            ? product.name(arabic: arabic)
                            : product.description(arabic: arabic),
                        style: context.bartalType.body.copyWith(color: bartal.textMute, height: 1.6),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
        Positioned(
          left: 0,
          right: 0,
          bottom: 0,
          child: _StickyBar(product: product),
        ),
      ],
    );
  }
}

class _ImageHero extends StatelessWidget {
  const _ImageHero({
    required this.product,
    required this.inWishlist,
    required this.onBack,
    required this.onShare,
    required this.onWishlist,
  });

  final Product product;
  final bool inWishlist;
  final VoidCallback onBack;
  final VoidCallback onShare;
  final VoidCallback onWishlist;

  @override
  Widget build(BuildContext context) {
    final images = product.images.isEmpty ? [null] : product.images.map((e) => e.url).toList();
    return SizedBox(
      height: 340,
      child: Stack(
        children: [
          Positioned.fill(
            child: _HeroGallery(productId: product.id, label: product.nameEn, imageUrls: images),
          ),
          PositionedDirectional(
            top: 12,
            start: 12,
            child: SafeArea(
              child: _CircleButton(
                onTap: onBack,
                child: const BartalIcon(BartalIcons.back, color: BartalColors.navy, size: 18),
              ),
            ),
          ),
          PositionedDirectional(
            top: 12,
            end: 12,
            child: SafeArea(
              child: Row(
                children: [
                  _CircleButton(
                    onTap: onWishlist,
                    child: BartalIcon(
                      BartalIcons.heart,
                      color: inWishlist ? BartalColors.danger : BartalColors.navy,
                      size: 18,
                    ),
                  ),
                  const SizedBox(width: 8),
                  _CircleButton(
                    onTap: onShare,
                    child: const BartalIcon(BartalIcons.share, color: BartalColors.navy, size: 18),
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

class _HeroGallery extends StatefulWidget {
  const _HeroGallery({required this.productId, required this.label, required this.imageUrls});

  final String productId;
  final String label;
  final List<String?> imageUrls;

  @override
  State<_HeroGallery> createState() => _HeroGalleryState();
}

class _HeroGalleryState extends State<_HeroGallery> {
  final _controller = PageController();
  int _page = 0;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.imageUrls.length <= 1) {
      return ProductThumb(
        productId: widget.productId,
        imageUrl: widget.imageUrls.first,
        label: widget.label,
      );
    }
    return Stack(
      children: [
        PageView.builder(
          controller: _controller,
          itemCount: widget.imageUrls.length,
          onPageChanged: (i) => setState(() => _page = i),
          itemBuilder: (_, i) => ProductThumb(
            productId: widget.productId,
            imageUrl: widget.imageUrls[i],
            label: widget.label,
          ),
        ),
        PositionedDirectional(
          bottom: 14,
          start: 0,
          end: 0,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              for (var i = 0; i < widget.imageUrls.length; i++) ...[
                if (i > 0) const SizedBox(width: 6),
                AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  width: i == _page ? 20 : 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: i == _page ? BartalColors.amber : Colors.white.withValues(alpha: 0.6),
                    borderRadius: BorderRadius.circular(3),
                  ),
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }
}

class _CircleButton extends StatelessWidget {
  const _CircleButton({required this.child, required this.onTap});

  final Widget child;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      child: Material(
        color: Colors.white.withValues(alpha: 0.92),
        shape: const CircleBorder(),
        elevation: 2,
        child: InkWell(
          onTap: onTap,
          customBorder: const CircleBorder(),
          child: SizedBox(width: 40, height: 40, child: Center(child: child)),
        ),
      ),
    );
  }
}

class _StockChip extends StatelessWidget {
  const _StockChip({required this.product});

  final Product product;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final arabic = Localizations.localeOf(context).languageCode == 'ar';
    if (!product.inStock) {
      return Container(
        padding: const EdgeInsetsDirectional.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: context.bartal.textMute.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(6),
        ),
        child: Text(
          l10n.productsOutOfStock,
          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: context.bartal.textMute),
        ),
      );
    }
    final label = product.lowStock
        ? l10n.productsLowStock(product.stock)
        : '${l10n.productsInStock} · ${localizedDigits('${product.stock}', arabic: arabic)}';
    return StockBadge(label: label);
  }
}

class _RatingRow extends StatelessWidget {
  const _RatingRow({required this.product, this.averageRating, this.reviewCount});

  final Product product;
  final double? averageRating;
  final int? reviewCount;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final arabic = Localizations.localeOf(context).languageCode == 'ar';
    final hasReviews = (reviewCount ?? 0) > 0;

    return Container(
      padding: const EdgeInsetsDirectional.symmetric(vertical: 12),
      decoration: BoxDecoration(
        border: Border(
          top: BorderSide(color: bartal.line),
          bottom: BorderSide(color: bartal.line),
        ),
      ),
      child: Row(
        children: [
          if (hasReviews) ...[
            GestureDetector(
              onTap: () => context.push('/product/${product.slug}/reviews'),
              child: Row(
                children: [
                  const BartalIcon(BartalIcons.star, color: BartalColors.amber, size: 16),
                  const SizedBox(width: 4),
                  Text(
                    localizedDigits(averageRating!.toStringAsFixed(1), arabic: arabic),
                    style: context.bartalType.label.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    l10n.pdpRatingCount(localizedDigits('$reviewCount', arabic: arabic)),
                    style: context.bartalType.small,
                  ),
                ],
              ),
            ),
            Container(
              width: 1,
              height: 20,
              margin: const EdgeInsetsDirectional.symmetric(horizontal: 12),
              color: bartal.line,
            ),
          ],
          const BartalIcon(BartalIcons.truck, color: BartalColors.navy, size: 16),
          const SizedBox(width: 6),
          Text(
            l10n.deliveryEtaDays(
              localizedDigits('0', arabic: arabic),
              localizedDigits('1', arabic: arabic),
            ),
            style: context.bartalType.small.copyWith(color: bartal.text),
          ),
        ],
      ),
    );
  }
}

class _StickyBar extends ConsumerWidget {
  const _StickyBar({required this.product});

  final Product product;

  Future<void> _addToCart(BuildContext context, WidgetRef ref) async {
    final l10n = L10n.of(context);
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    try {
      await ref.read(cartControllerProvider.notifier).addProduct(product);
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(l10n.cartItemAdded),
          action: SnackBarAction(label: l10n.cartViewCart, onPressed: () => context.go('/cart')),
        ),
      );
    } catch (error) {
      if (!context.mounted) return;
      final message = toApiException(error).code == 'OUT_OF_STOCK'
          ? l10n.cartOutOfStock
          : toApiException(error).localized(arabic: isAr);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final enabled = product.inStock;

    return Container(
      decoration: BoxDecoration(
        color: bartal.surface,
        border: Border(top: BorderSide(color: bartal.line)),
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsetsDirectional.fromSTEB(16, 12, 16, 12),
          child: Row(
            children: [
              AppButton(
                label: l10n.productsAddToCart,
                variant: AppButtonVariant.outline,
                size: AppButtonSize.large,
                onPressed: enabled ? () => _addToCart(context, ref) : null,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: AppButton(
                  label: l10n.productsBuyNow,
                  variant: AppButtonVariant.navy,
                  size: AppButtonSize.large,
                  expand: true,
                  trailing: const BartalIcon(BartalIcons.arrow, color: Colors.white, size: 16),
                  onPressed: enabled
                      ? () async {
                          await ref.read(cartControllerProvider.notifier).addProduct(product);
                          if (context.mounted) context.go('/cart');
                        }
                      : null,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
