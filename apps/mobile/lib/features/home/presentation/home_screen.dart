import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/connectivity/connectivity_provider.dart';
import '../../../core/models/category.dart';
import '../../../core/models/product.dart';
import '../../../core/providers.dart';
import '../../../design/icons.dart';
import '../../../design/logo.dart';
import '../../../design/motif.dart';
import '../../../design/theme.dart';
import '../../../design/tokens.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/badges.dart';
import '../../../widgets/error_screen.dart';
import '../../../widgets/price_tag.dart';
import '../../../widgets/product_card.dart';
import '../../../widgets/product_image.dart';
import '../../../widgets/skeletons.dart';
import '../../catalog/application/catalog_providers.dart';

/// Marketplace Classic home — full port of mobile-v1.jsx::V1Home: navy motif
/// header (logo, cart/bell, search field, delivery chip), categories grid,
/// featured carousel, and the new-arrivals grid. The tab bar is provided by
/// the shell.
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final home = ref.watch(homeDataProvider);

    return Scaffold(
      backgroundColor: context.bartal.bg,
      body: home.when(
        loading: () => const SafeArea(child: HomeSkeleton()),
        error: (error, _) {
          final online = ref.read(isOnlineProvider);
          return SafeArea(
            child: ErrorState(
              kind: online ? ErrorScreenKind.error : ErrorScreenKind.offline,
              onRetry: () => ref.invalidate(homeDataProvider),
            ),
          );
        },
        data: (data) => RefreshIndicator(
          onRefresh: () async => ref.invalidate(homeDataProvider),
          child: CustomScrollView(
            slivers: [
              const SliverToBoxAdapter(child: _HomeHeader()),
              if (data.categories.isNotEmpty)
                SliverToBoxAdapter(child: _CategoriesRow(categories: data.categories)),
              if (data.featured.isNotEmpty)
                SliverToBoxAdapter(child: _FeaturedCarousel(products: data.featured)),
              SliverToBoxAdapter(child: _NewArrivalsHeader()),
              _NewArrivalsGrid(products: data.newArrivals),
              const SliverToBoxAdapter(child: SizedBox(height: 16)),
            ],
          ),
        ),
      ),
    );
  }
}

class _HomeHeader extends ConsumerWidget {
  const _HomeHeader();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final cartCount = ref.watch(cartCountProvider);

    return Container(
      color: bartal.headerBg,
      child: MotifBackground(
        color: BartalColors.amberSoft,
        opacity: 0.1,
        spec: MotifTileSpec.header,
        child: SafeArea(
          bottom: false,
          child: Padding(
            padding: const EdgeInsetsDirectional.fromSTEB(16, 16, 16, 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  children: [
                    BartalLogo(arabic: isAr, color: Colors.white, accent: BartalColors.amberSoft, size: 26),
                    const Spacer(),
                    _HeaderIconButton(
                      onTap: () {},
                      child: Stack(
                        clipBehavior: Clip.none,
                        children: [
                          const BartalIcon(BartalIcons.bag, color: Colors.white, size: 18),
                          if (cartCount > 0)
                            PositionedDirectional(
                              top: -6,
                              end: -8,
                              child: CountBadge(count: cartCount, color: BartalColors.amber),
                            ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 10),
                    _HeaderIconButton(
                      onTap: () => context.push('/notifications'),
                      filled: false,
                      child: const BartalIcon(BartalIcons.bell, color: Colors.white, size: 20),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                // Search is a button (opens the search screen), per design.
                GestureDetector(
                  onTap: () => context.push('/search'),
                  child: Container(
                    height: 42,
                    padding: const EdgeInsetsDirectional.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.95),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        const BartalIcon(BartalIcons.search, color: BartalColors.textMute, size: 18),
                        const SizedBox(width: 10),
                        Text(
                          l10n.searchPlaceholder,
                          style: const TextStyle(fontSize: 15, color: BartalColors.textMute),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    const BartalIcon(BartalIcons.pin, color: BartalColors.amberSoft, size: 14),
                    const SizedBox(width: 6),
                    Text(
                      '${l10n.deliveryTo}: ',
                      style: TextStyle(fontSize: 13, color: Colors.white.withValues(alpha: 0.9)),
                    ),
                    Text(
                      l10n.deliveryZoneA,
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Colors.white),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      l10n.homeDeliveryEta('0', '1'),
                      style: TextStyle(fontSize: 13, color: Colors.white.withValues(alpha: 0.7)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _HeaderIconButton extends StatelessWidget {
  const _HeaderIconButton({required this.child, required this.onTap, this.filled = true});

  final Widget child;
  final VoidCallback onTap;
  final bool filled;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          width: 40,
          height: 40,
          alignment: Alignment.center,
          decoration: filled
              ? BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                )
              : null,
          child: child,
        ),
      ),
    );
  }
}

class _SectionHeading extends StatelessWidget {
  const _SectionHeading({required this.title, this.onSeeAll});

  final String title;
  final VoidCallback? onSeeAll;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Text(title, style: context.bartalType.h3),
        if (onSeeAll != null)
          GestureDetector(
            onTap: onSeeAll,
            child: Text(
              l10n.commonSeeAll,
              style: TextStyle(fontSize: 13, color: bartal.amber, fontWeight: FontWeight.w500),
            ),
          ),
      ],
    );
  }
}

class _CategoriesRow extends StatelessWidget {
  const _CategoriesRow({required this.categories});

  final List<Category> categories;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final arabic = Localizations.localeOf(context).languageCode == 'ar';
    final shown = categories.take(4).toList();

    return Padding(
      padding: const EdgeInsetsDirectional.fromSTEB(16, 16, 16, 4),
      child: Column(
        children: [
          _SectionHeading(
            title: l10n.navCategories,
            onSeeAll: () => context.go('/categories'),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              for (var i = 0; i < shown.length; i++) ...[
                if (i > 0) const SizedBox(width: 10),
                Expanded(
                  child: GestureDetector(
                    onTap: () => context.go('/categories/${shown[i].slug}'),
                    child: Container(
                      padding: const EdgeInsetsDirectional.fromSTEB(6, 10, 6, 10),
                      decoration: BoxDecoration(
                        color: bartal.surface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: bartal.line),
                      ),
                      child: Column(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(10),
                            child: SizedBox(
                              height: 44,
                              width: double.infinity,
                              child: ProductThumb(
                                productId: shown[i].id,
                                imageUrl: shown[i].imageUrl,
                              ),
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            shown[i].name(arabic: arabic),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: bartal.text,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }
}

class _FeaturedCarousel extends StatelessWidget {
  const _FeaturedCarousel({required this.products});

  final List<Product> products;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final arabic = Localizations.localeOf(context).languageCode == 'ar';

    return Padding(
      padding: const EdgeInsetsDirectional.only(top: 18, bottom: 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsetsDirectional.symmetric(horizontal: 16),
            child: _SectionHeading(title: l10n.productsFeatured),
          ),
          const SizedBox(height: 10),
          SizedBox(
            height: 250,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsetsDirectional.symmetric(horizontal: 16),
              itemCount: products.length,
              clipBehavior: Clip.none,
              separatorBuilder: (_, _) => const SizedBox(width: 12),
              itemBuilder: (context, i) {
                final p = products[i];
                return GestureDetector(
                  onTap: () => context.push('/product/${p.slug}'),
                  child: Container(
                    width: 160,
                    decoration: BoxDecoration(
                      color: bartal.surface,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: bartal.line),
                    ),
                    clipBehavior: Clip.antiAlias,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SizedBox(
                          height: 140,
                          child: Stack(
                            children: [
                              Positioned.fill(
                                child: ProductThumb(
                                  productId: p.id,
                                  imageUrl: p.primaryImageUrl,
                                  label: p.nameEn,
                                ),
                              ),
                              if (p.onSale)
                                PositionedDirectional(
                                  top: 8,
                                  start: 8,
                                  child: SaleBadge(label: l10n.productsSale),
                                ),
                            ],
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsetsDirectional.fromSTEB(10, 10, 10, 12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              if (p.category != null)
                                Text(
                                  p.category!.name(arabic: arabic).toUpperCase(),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: context.bartalType.micro,
                                ),
                              const SizedBox(height: 2),
                              SizedBox(
                                height: 36,
                                child: Text(
                                  p.name(arabic: arabic),
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: context.bartalType.label
                                      .copyWith(fontWeight: FontWeight.w600),
                                ),
                              ),
                              const SizedBox(height: 6),
                              PriceTag(amount: p.price, compare: p.comparePrice, size: 14),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _NewArrivalsHeader extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsetsDirectional.fromSTEB(16, 14, 16, 10),
      child: _SectionHeading(title: L10n.of(context).productsNewArrivals),
    );
  }
}

class _NewArrivalsGrid extends StatelessWidget {
  const _NewArrivalsGrid({required this.products});

  final List<Product> products;

  @override
  Widget build(BuildContext context) {
    return SliverPadding(
      padding: const EdgeInsetsDirectional.symmetric(horizontal: 16),
      sliver: SliverGrid(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          mainAxisSpacing: 10,
          crossAxisSpacing: 10,
          childAspectRatio: 0.70,
        ),
        delegate: SliverChildBuilderDelegate(
          (context, i) {
            final p = products[i];
            return ProductGridCard(
              product: p,
              onTap: () => context.push('/product/${p.slug}'),
            );
          },
          childCount: products.length,
        ),
      ),
    );
  }
}
