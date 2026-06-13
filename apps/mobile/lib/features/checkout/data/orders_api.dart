import 'package:dio/dio.dart';

import '../../../core/api/endpoints.dart';
import '../../../core/api/envelope.dart';
import '../../../core/models/order.dart';

/// Orders endpoints (auth-only).
class OrdersApi {
  OrdersApi(this._dio);

  final Dio _dio;

  /// Creates an order from the given items + address + payment method.
  /// Server clears the cart on success.
  Future<OrderView> create({
    required String addressId,
    required PaymentMethod paymentMethod,
    required List<({String productId, int quantity})> items,
    String? notes,
  }) async {
    final response = await _dio.post<dynamic>(
      Endpoints.orders,
      data: {
        'address_id': addressId,
        'payment_method': paymentMethod.wire,
        if (notes != null && notes.isNotEmpty) 'notes': notes,
        'items': [for (final i in items) {'product_id': i.productId, 'quantity': i.quantity}],
      },
    );
    return parseEnvelope(response, (data) => OrderView.fromJson(data as Map<String, dynamic>));
  }

  /// Unlike /products, GET /orders nests pagination inside `data`
  /// (`{items, page, limit, total, total_pages}`), so we map it by hand.
  Future<Paginated<OrderView>> list({int page = 1, int limit = 20}) async {
    final response = await _dio.get<dynamic>(
      Endpoints.orders,
      queryParameters: {'page': page, 'limit': limit},
    );
    return parseEnvelope(response, (data) {
      final map = data as Map<String, dynamic>;
      final items = [
        for (final o in (map['items'] as List? ?? const []))
          OrderView.fromJson(o as Map<String, dynamic>),
      ];
      return Paginated<OrderView>(
        items: items,
        meta: Meta(
          page: map['page'] as int? ?? 1,
          limit: map['limit'] as int? ?? limit,
          total: map['total'] as int? ?? items.length,
          totalPages: map['total_pages'] as int? ?? 1,
        ),
      );
    });
  }

  Future<OrderView> detail(String id) async {
    final response = await _dio.get<dynamic>(Endpoints.order(id));
    return parseEnvelope(response, (data) => OrderView.fromJson(data as Map<String, dynamic>));
  }
}
