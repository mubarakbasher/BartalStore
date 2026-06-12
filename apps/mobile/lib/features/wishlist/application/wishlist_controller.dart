import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/endpoints.dart';
import '../../../core/api/envelope.dart';
import '../../../core/models/wishlist_item.dart';
import '../../../core/providers.dart';
import '../../auth/application/auth_controller.dart';

class WishlistApi {
  WishlistApi(this._dio);

  final Dio _dio;

  Future<List<WishlistItem>> list() async {
    final response = await _dio.get<dynamic>(Endpoints.wishlist);
    return parseEnvelope(response, (data) {
      return [
        for (final item in data as List) WishlistItem.fromJson(item as Map<String, dynamic>),
      ];
    });
  }

  Future<void> add(String productId) async {
    final response = await _dio.post<dynamic>(Endpoints.wishlistItem(productId));
    parseEnvelope(response, (_) => null);
  }

  Future<void> remove(String productId) async {
    final response = await _dio.delete<dynamic>(Endpoints.wishlistItem(productId));
    parseEnvelope(response, (_) => null);
  }
}

final wishlistApiProvider = Provider<WishlistApi>(
  (ref) => WishlistApi(ref.watch(apiClientProvider)),
);

/// Server wishlist with optimistic toggle + rollback. Guests get an empty
/// list — the router gates the wishlist screen behind auth, and the PDP
/// heart redirects guests to /welcome.
class WishlistController extends AsyncNotifier<List<WishlistItem>> {
  @override
  Future<List<WishlistItem>> build() async {
    final auth = await ref.watch(authControllerProvider.future);
    if (auth is! Authenticated) return const [];
    return ref.read(wishlistApiProvider).list();
  }

  bool contains(String productId) =>
      state.valueOrNull?.any((item) => item.productId == productId) ?? false;

  /// Optimistic toggle: flips locally first, rolls back on failure.
  /// Returns the new membership state.
  Future<bool> toggle(String productId) async {
    final current = state.valueOrNull ?? const <WishlistItem>[];
    final isMember = current.any((item) => item.productId == productId);
    final api = ref.read(wishlistApiProvider);

    if (isMember) {
      state = AsyncData([
        for (final item in current)
          if (item.productId != productId) item,
      ]);
      try {
        await api.remove(productId);
      } catch (_) {
        state = AsyncData(current); // rollback
        rethrow;
      }
      return false;
    }

    try {
      await api.add(productId);
      // Server view carries the joined product fields — refetch for truth.
      state = AsyncData(await api.list());
    } catch (_) {
      state = AsyncData(current);
      rethrow;
    }
    return true;
  }
}

final wishlistControllerProvider =
    AsyncNotifierProvider<WishlistController, List<WishlistItem>>(WishlistController.new);

/// Fast membership lookup for PDP/card hearts.
final wishlistIdsProvider = Provider<Set<String>>((ref) {
  final items = ref.watch(wishlistControllerProvider).valueOrNull ?? const [];
  return {for (final item in items) item.productId};
});
