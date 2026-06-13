import 'package:dio/dio.dart';

import '../../../core/api/endpoints.dart';
import '../../../core/api/envelope.dart';
import '../../../core/models/cart.dart';

/// Cart endpoints (auth-only, Redis-backed). All return the full [CartView].
class CartApi {
  CartApi(this._dio);

  final Dio _dio;

  Future<CartView> get() async {
    final response = await _dio.get<dynamic>(Endpoints.cart);
    return parseEnvelope(response, (data) => CartView.fromJson(data as Map<String, dynamic>));
  }

  Future<CartView> addItem(String productId, int quantity) async {
    final response = await _dio.post<dynamic>(
      Endpoints.cartItems,
      data: {'product_id': productId, 'quantity': quantity},
    );
    return parseEnvelope(response, (data) => CartView.fromJson(data as Map<String, dynamic>));
  }

  Future<CartView> setQuantity(String productId, int quantity) async {
    final response = await _dio.put<dynamic>(
      Endpoints.cartItem(productId),
      data: {'quantity': quantity},
    );
    return parseEnvelope(response, (data) => CartView.fromJson(data as Map<String, dynamic>));
  }

  Future<CartView> removeItem(String productId) async {
    final response = await _dio.delete<dynamic>(Endpoints.cartItem(productId));
    return parseEnvelope(response, (data) => CartView.fromJson(data as Map<String, dynamic>));
  }

  Future<CartView> clear() async {
    final response = await _dio.delete<dynamic>(Endpoints.cart);
    return parseEnvelope(response, (data) => CartView.fromJson(data as Map<String, dynamic>));
  }
}
