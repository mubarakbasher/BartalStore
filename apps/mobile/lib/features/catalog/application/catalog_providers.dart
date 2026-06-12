import 'package:flutter/foundation.dart' show immutable;
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/models/category.dart';
import '../../../core/models/product.dart';
import '../../../core/models/review.dart';
import '../../../core/providers.dart';
import '../data/catalog_api.dart';

final catalogApiProvider = Provider<CatalogApi>(
  (ref) => CatalogApi(ref.watch(apiClientProvider)),
);

final categoriesProvider = FutureProvider<List<Category>>(
  (ref) => ref.watch(catalogApiProvider).categories(),
);

final productDetailProvider = FutureProvider.family<Product, String>(
  (ref, idOrSlug) => ref.watch(catalogApiProvider).productDetail(idOrSlug),
);

/// Home rails: featured = API default sort (is_featured first); new arrivals
/// = newest. One provider so the home screen has a single async gate.
typedef HomeData = ({List<Category> categories, List<Product> featured, List<Product> newArrivals});

final homeDataProvider = FutureProvider<HomeData>((ref) async {
  final api = ref.watch(catalogApiProvider);
  // Fire concurrently, await typed.
  final categoriesFuture = api.categories();
  final featuredFuture = api.products(const ProductsQuery(limit: 4));
  final arrivalsFuture = api.products(const ProductsQuery(sort: ProductSort.newest, limit: 6));
  return (
    categories: await categoriesFuture,
    featured: (await featuredFuture).items,
    newArrivals: (await arrivalsFuture).items,
  );
});

/// Infinite-scroll page state shared by search results / category products.
@immutable
class PagedProducts {
  const PagedProducts({
    required this.items,
    required this.page,
    required this.totalPages,
    required this.total,
    this.loadingMore = false,
  });

  final List<Product> items;
  final int page;
  final int totalPages;
  final int total;
  final bool loadingMore;

  bool get hasMore => page < totalPages;

  PagedProducts copyWith({
    List<Product>? items,
    int? page,
    int? totalPages,
    int? total,
    bool? loadingMore,
  }) {
    return PagedProducts(
      items: items ?? this.items,
      page: page ?? this.page,
      totalPages: totalPages ?? this.totalPages,
      total: total ?? this.total,
      loadingMore: loadingMore ?? this.loadingMore,
    );
  }
}

class ProductsListController
    extends AutoDisposeFamilyAsyncNotifier<PagedProducts, ProductsQuery> {
  @override
  Future<PagedProducts> build(ProductsQuery arg) async {
    final result = await ref.watch(catalogApiProvider).products(arg);
    return PagedProducts(
      items: result.items,
      page: result.meta.page,
      totalPages: result.meta.totalPages,
      total: result.meta.total,
    );
  }

  Future<void> fetchNextPage() async {
    final current = state.valueOrNull;
    if (current == null || !current.hasMore || current.loadingMore) return;
    state = AsyncData(current.copyWith(loadingMore: true));
    try {
      final next = await ref
          .read(catalogApiProvider)
          .products(arg, page: current.page + 1);
      state = AsyncData(
        current.copyWith(
          items: [...current.items, ...next.items],
          page: next.meta.page,
          totalPages: next.meta.totalPages,
          total: next.meta.total,
          loadingMore: false,
        ),
      );
    } catch (_) {
      // Keep what we have; the next scroll retries.
      state = AsyncData(current.copyWith(loadingMore: false));
    }
  }
}

final productsListProvider = AsyncNotifierProvider.autoDispose
    .family<ProductsListController, PagedProducts, ProductsQuery>(
  ProductsListController.new,
);

/// PDP reviews — first page eagerly; the reviews screen pages further itself.
final reviewsProvider = FutureProvider.family<ReviewsPage, String>(
  (ref, productId) => ref.watch(catalogApiProvider).reviews(productId),
);
