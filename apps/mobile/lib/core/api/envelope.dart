import 'package:dio/dio.dart';

import 'api_exception.dart';

/// Pagination meta from the API envelope (`{ data, meta }`).
class Meta {
  const Meta({
    required this.page,
    required this.limit,
    required this.total,
    required this.totalPages,
  });

  factory Meta.fromJson(Map<String, dynamic> json) => Meta(
        page: json['page'] as int,
        limit: json['limit'] as int,
        total: json['total'] as int,
        totalPages: json['totalPages'] as int,
      );

  final int page;
  final int limit;
  final int total;
  final int totalPages;

  bool get hasMore => page < totalPages;
}

class Paginated<T> {
  const Paginated({required this.items, required this.meta});

  final List<T> items;
  final Meta meta;
}

/// Unwraps the global response envelope:
/// `{ success: true, data }` → `map(data)`;
/// `{ success: false, error: {...} }` → throws [ApiException].
T parseEnvelope<T>(Response<dynamic> response, T Function(dynamic data) map) {
  final body = response.data;
  if (body is! Map<String, dynamic>) throw ApiException.malformed();
  if (body['success'] == true) {
    return map(body['data']);
  }
  throw apiExceptionFromBody(body, response.statusCode ?? 0);
}

/// Unwraps paginated envelopes: `{ success: true, data: [...], meta }`.
Paginated<T> parsePaginated<T>(
  Response<dynamic> response,
  T Function(Map<String, dynamic> item) itemMap,
) {
  final body = response.data;
  if (body is! Map<String, dynamic>) throw ApiException.malformed();
  if (body['success'] != true) {
    throw apiExceptionFromBody(body, response.statusCode ?? 0);
  }
  final data = body['data'];
  final meta = body['meta'];
  if (data is! List || meta is! Map<String, dynamic>) {
    throw ApiException.malformed();
  }
  return Paginated(
    items: [for (final item in data) itemMap(item as Map<String, dynamic>)],
    meta: Meta.fromJson(meta),
  );
}

/// Builds an [ApiException] from an error envelope body (also used by the
/// auth interceptor, which sees error bodies via [DioException.response]).
ApiException apiExceptionFromBody(Object? body, int fallbackStatus) {
  if (body is Map<String, dynamic>) {
    final error = body['error'];
    if (error is Map<String, dynamic>) {
      return ApiException(
        code: (error['code'] as String?) ?? 'INTERNAL_ERROR',
        messageEn: (error['message_en'] as String?) ?? 'Something went wrong. Please try again.',
        messageAr: (error['message_ar'] as String?) ?? 'حدث خطأ ما. الرجاء المحاولة مرة أخرى.',
        status: (error['status'] as int?) ?? fallbackStatus,
        details: error['details'] as Map<String, dynamic>?,
      );
    }
  }
  return ApiException.malformed();
}

/// Maps any thrown object from a dio call into [ApiException].
ApiException toApiException(Object error) {
  if (error is ApiException) return error;
  if (error is DioException) {
    final inner = error.error;
    if (inner is ApiException) return inner;
    final response = error.response;
    if (response != null) {
      return apiExceptionFromBody(response.data, response.statusCode ?? 0);
    }
    return ApiException.network();
  }
  return ApiException.malformed();
}
