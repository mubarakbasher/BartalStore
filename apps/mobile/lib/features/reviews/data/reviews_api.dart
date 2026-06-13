import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/endpoints.dart';
import '../../../core/api/envelope.dart';
import '../../../core/providers.dart';

/// Authenticated review authoring. Unlike the public `CatalogApi.reviews()`
/// (GET, verified-only), `POST /products/:id/reviews` requires a JWT and is
/// gated to verified purchases server-side (NOT_A_BUYER / REVIEW_ALREADY_EXISTS).
class ReviewsApi {
  ReviewsApi(this._dio);

  final Dio _dio;

  Future<void> create(String productId, {required int rating, String? comment}) async {
    final trimmed = comment?.trim();
    final response = await _dio.post<dynamic>(
      Endpoints.productReviews(productId),
      data: {
        'rating': rating,
        if (trimmed != null && trimmed.isNotEmpty) 'comment': trimmed,
      },
    );
    return parseEnvelope(response, (_) {});
  }
}

final reviewsApiProvider = Provider<ReviewsApi>(
  (ref) => ReviewsApi(ref.watch(apiClientProvider)),
);
