import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/connectivity/connectivity_provider.dart';
import '../../../design/theme.dart';
import '../../../widgets/empty_state.dart';
import '../../../widgets/error_screen.dart';
import '../../../widgets/screen_header.dart';
import '../../../widgets/skeletons.dart';
import '../application/catalog_providers.dart';
import '../data/catalog_api.dart';
import 'widgets/product_grid_view.dart';

/// Products within one category — 2-column grid reusing the home card
/// anatomy, with infinite scroll. The title resolves from the category tree.
class CategoryProductsScreen extends ConsumerWidget {
  const CategoryProductsScreen({super.key, required this.slug});

  final String slug;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bartal = context.bartal;
    final arabic = Localizations.localeOf(context).languageCode == 'ar';
    final query = ProductsQuery(category: slug);
    final products = ref.watch(productsListProvider(query));

    // Resolve a friendly title from the (cached) category tree.
    final title = ref.watch(categoriesProvider).maybeWhen(
          data: (cats) {
            for (final cat in cats) {
              if (cat.slug == slug) return cat.name(arabic: arabic);
              for (final sub in cat.children) {
                if (sub.slug == slug) return sub.name(arabic: arabic);
              }
            }
            return slug;
          },
          orElse: () => slug,
        );

    return Scaffold(
      backgroundColor: bartal.bg,
      body: Column(
        children: [
          ScreenHeader(title: title),
          Expanded(
            child: products.when(
              loading: () => const ListSkeleton(),
              error: (error, _) => ErrorState(
                kind: ref.read(isOnlineProvider) ? ErrorScreenKind.error : ErrorScreenKind.offline,
                onRetry: () => ref.invalidate(productsListProvider(query)),
              ),
              data: (state) {
                if (state.items.isEmpty) {
                  return EmptyState(
                    kind: EmptyStateKind.search,
                    onCta: () => context.go('/categories'),
                  );
                }
                return ProductGridView(
                  state: state,
                  onLoadMore: () =>
                      ref.read(productsListProvider(query).notifier).fetchNextPage(),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
