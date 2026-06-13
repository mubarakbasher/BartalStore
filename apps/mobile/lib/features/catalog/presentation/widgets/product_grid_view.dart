import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/models/product.dart';
import '../../../../widgets/product_card.dart';
import '../../application/catalog_providers.dart';

/// Scrollable 2-column product grid with infinite scroll + a trailing
/// loading row. Shared by category listings and search results.
class ProductGridView extends StatelessWidget {
  const ProductGridView({
    super.key,
    required this.state,
    required this.onLoadMore,
    this.padding = const EdgeInsetsDirectional.all(16),
    this.header,
  });

  final PagedProducts state;
  final VoidCallback onLoadMore;
  final EdgeInsetsGeometry padding;

  /// Optional sliver rendered above the grid (e.g. search meta + chips).
  final Widget? header;

  @override
  Widget build(BuildContext context) {
    return NotificationListener<ScrollNotification>(
      onNotification: (notification) {
        if (notification.metrics.pixels >= notification.metrics.maxScrollExtent - 400) {
          if (state.hasMore && !state.loadingMore) onLoadMore();
        }
        return false;
      },
      child: CustomScrollView(
        slivers: [
          ?header,
          SliverPadding(
            padding: padding,
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 10,
                crossAxisSpacing: 10,
                childAspectRatio: 0.70,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, i) {
                  final Product p = state.items[i];
                  return ProductGridCard(
                    product: p,
                    onTap: () => context.push('/product/${p.slug}'),
                  );
                },
                childCount: state.items.length,
              ),
            ),
          ),
          if (state.loadingMore)
            const SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Center(child: CircularProgressIndicator()),
              ),
            ),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),
        ],
      ),
    );
  }
}
