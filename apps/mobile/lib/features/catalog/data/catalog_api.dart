import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart' show immutable;

import '../../../core/api/api_client.dart';
import '../../../core/api/endpoints.dart';
import '../../../core/api/envelope.dart';
import '../../../core/models/category.dart';
import '../../../core/models/product.dart';
import '../../../core/models/review.dart';

enum ProductSort { newest, priceAsc, priceDesc, popular }

extension on ProductSort {
  String get wire => switch (this) {
        ProductSort.newest => 'newest',
        ProductSort.priceAsc => 'price_asc',
        ProductSort.priceDesc => 'price_desc',
        ProductSort.popular => 'popular',
      };
}

/// Catalog list query. `q` switches to the search endpoint; `sort == null`
/// uses the API default (featured first, then newest) — that default IS the
/// home "featured" rail.
@immutable
class ProductsQuery {
  const ProductsQuery({
    this.q,
    this.category,
    this.sort,
    this.minPrice,
    this.maxPrice,
    this.inStock = false,
    this.limit = 20,
  });

  final String? q;

  /// Category slug.
  final String? category;
  final ProductSort? sort;
  final int? minPrice;
  final int? maxPrice;
  final bool inStock;
  final int limit;

  ProductsQuery copyWith({
    String? q,
    String? category,
    ProductSort? sort,
    int? minPrice,
    int? maxPrice,
    bool? inStock,
    int? limit,
    bool clearSort = false,
    bool clearPrices = false,
    bool clearCategory = false,
  }) {
    return ProductsQuery(
      q: q ?? this.q,
      category: clearCategory ? null : (category ?? this.category),
      sort: clearSort ? null : (sort ?? this.sort),
      minPrice: clearPrices ? null : (minPrice ?? this.minPrice),
      maxPrice: clearPrices ? null : (maxPrice ?? this.maxPrice),
      inStock: inStock ?? this.inStock,
      limit: limit ?? this.limit,
    );
  }

  @override
  bool operator ==(Object other) =>
      other is ProductsQuery &&
      other.q == q &&
      other.category == category &&
      other.sort == sort &&
      other.minPrice == minPrice &&
      other.maxPrice == maxPrice &&
      other.inStock == inStock &&
      other.limit == limit;

  @override
  int get hashCode => Object.hash(q, category, sort, minPrice, maxPrice, inStock, limit);
}

/// Public catalog endpoints — products, categories, reviews.
class CatalogApi {
  CatalogApi(this._dio);

  final Dio _dio;

  Future<Paginated<Product>> products(ProductsQuery query, {int page = 1}) async {
    final q = query.q?.trim();
    final isSearch = q != null && q.isNotEmpty;
    final response = await _dio.get<dynamic>(
      isSearch ? Endpoints.productsSearch : Endpoints.products,
      queryParameters: {
        'page': page,
        'limit': query.limit,
        if (isSearch) 'q': q,
        if (!isSearch && query.category != null) 'category': query.category,
        if (!isSearch && query.sort != null) 'sort': query.sort!.wire,
        if (!isSearch && query.minPrice != null) 'min_price': query.minPrice,
        if (!isSearch && query.maxPrice != null) 'max_price': query.maxPrice,
        if (!isSearch && query.inStock) 'in_stock': true,
      },
      options: publicRequest(),
    );
    return parsePaginated(response, Product.fromJson);
  }

  Future<Product> productDetail(String idOrSlug) async {
    final response = await _dio.get<dynamic>(
      Endpoints.product(idOrSlug),
      options: publicRequest(),
    );
    return parseEnvelope(
      response,
      (data) => Product.fromJson(data as Map<String, dynamic>),
    );
  }

  Future<List<Category>> categories() async {
    final response = await _dio.get<dynamic>(
      Endpoints.categories,
      options: publicRequest(),
    );
    return parseEnvelope(response, (data) {
      return [
        for (final node in data as List) Category.fromJson(node as Map<String, dynamic>),
      ];
    });
  }

  Future<Paginated<Product>> categoryProducts(String categoryId, {int page = 1, int limit = 20}) async {
    final response = await _dio.get<dynamic>(
      Endpoints.categoryProducts(categoryId),
      queryParameters: {'page': page, 'limit': limit},
      options: publicRequest(),
    );
    return parsePaginated(response, Product.fromJson);
  }

  Future<ReviewsPage> reviews(
    String productId, {
    int page = 1,
    String sort = 'newest',
  }) async {
    final response = await _dio.get<dynamic>(
      Endpoints.productReviews(productId),
      queryParameters: {'page': page, 'sort': sort},
      options: publicRequest(),
    );
    return parseEnvelope(
      response,
      (data) => ReviewsPage.fromJson(data as Map<String, dynamic>),
    );
  }
}
