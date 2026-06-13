import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/envelope.dart';
import '../../../core/connectivity/connectivity_provider.dart';
import '../../../core/models/cart.dart';
import '../../../core/models/product.dart';
import '../../../core/providers.dart';
import '../../../core/utils/money.dart';
import '../../auth/application/auth_controller.dart';
import '../data/cart_api.dart';
import '../data/local_cart_store.dart';

final cartApiProvider = Provider<CartApi>((ref) => CartApi(ref.watch(apiClientProvider)));

final localCartStoreProvider = Provider<LocalCartStore>(
  (ref) => LocalCartStore(ref.watch(appPrefsProvider)),
);

/// Current client cart. Subtotal/total are recomputed locally with [Money];
/// `deliveryPreview` comes from the server (needs a default address).
@immutable
class CartState {
  const CartState({required this.lines, this.deliveryPreview, this.requiresAddress = true});

  final List<CartLine> lines;
  final DeliveryPreview? deliveryPreview;
  final bool requiresAddress;

  bool get isEmpty => lines.isEmpty;
  int get totalQuantity => lines.fold(0, (sum, l) => sum + l.quantity);
  Money get subtotal => lines.fold(Money.zero, (sum, l) => sum + l.lineTotal);
  Money get total =>
      deliveryPreview != null ? subtotal + deliveryPreview!.fee : subtotal;

  CartState copyWith({List<CartLine>? lines, DeliveryPreview? deliveryPreview, bool? requiresAddress}) {
    return CartState(
      lines: lines ?? this.lines,
      deliveryPreview: deliveryPreview ?? this.deliveryPreview,
      requiresAddress: requiresAddress ?? this.requiresAddress,
    );
  }

  static const empty = CartState(lines: []);
}

/// Server-synced cart with optimistic local updates and offline resilience.
///
/// The local store mirror is the canonical desired state; for authed users it
/// syncs to the server after each mutation. On a network failure the optimistic
/// state is kept and marked dirty; on reconnect/login it reconciles by pushing
/// the whole local state (clear + re-add) — inherently coalesced, no op-queue
/// thrash. Guests operate purely locally; `mergeGuestCart` pushes a guest cart
/// to the server at login.
class CartController extends AsyncNotifier<CartState> {
  CartApi get _api => ref.read(cartApiProvider);
  LocalCartStore get _store => ref.read(localCartStoreProvider);

  bool get _authed => ref.read(authControllerProvider.notifier).isAuthenticated;

  @override
  Future<CartState> build() async {
    // Reconcile when connectivity returns while we have pending local changes.
    ref.listen(isOnlineProvider, (prev, online) {
      if (online == true && prev != true && _authed && _store.dirty) {
        _reconcile();
      }
    });

    // Watch auth so the cart rebuilds when the session resolves (bootstrap)
    // or changes (login/logout) — not just once during the loading phase.
    final auth = await ref.watch(authControllerProvider.future);
    final local = _store.load();
    if (auth is! Authenticated) {
      return CartState(lines: local); // guest: local only
    }
    try {
      // A non-empty local cart at login time is a guest cart to merge; a dirty
      // flag means pending offline changes. Either way, push local → server.
      if (local.isNotEmpty || _store.dirty) {
        return await _pushLocalThenFetch(local);
      }
      final view = await _api.get();
      await _store.save(view.items);
      await _store.setDirty(false);
      return _fromView(view);
    } catch (error) {
      if (toApiException(error).isNetwork) {
        return CartState(lines: local); // offline: show last-known cart
      }
      rethrow;
    }
  }

  CartState _fromView(CartView view) => CartState(
        lines: view.items,
        deliveryPreview: view.deliveryPreview,
        requiresAddress: view.requiresAddress,
      );

  Future<CartState> _pushLocalThenFetch(List<CartLine> lines) async {
    await _api.clear();
    for (final line in lines) {
      await _api.addItem(line.productId, line.quantity);
    }
    final view = await _api.get();
    await _store.save(view.items);
    await _store.setDirty(false);
    return _fromView(view);
  }

  Future<void> _reconcile() async {
    final current = state.valueOrNull ?? CartState.empty;
    try {
      final reconciled = await _pushLocalThenFetch(current.lines);
      state = AsyncData(reconciled);
    } catch (_) {
      // Stay dirty; next reconnect retries.
    }
  }

  /// Optimistically apply [next] lines, persist, then sync to the server.
  /// Network failures keep the optimistic state (dirty); 4xx errors roll back
  /// and rethrow so the UI can surface (e.g. OUT_OF_STOCK).
  Future<void> _mutate({
    required List<CartLine> next,
    required Future<CartView> Function() serverCall,
  }) async {
    final previous = state.valueOrNull ?? CartState.empty;
    state = AsyncData(previous.copyWith(lines: next));
    await _store.save(next);

    if (!_authed) return; // guest: local only

    final online = ref.read(isOnlineProvider);
    if (!online) {
      await _store.setDirty(true);
      return;
    }
    try {
      final view = await serverCall();
      await _store.save(view.items);
      await _store.setDirty(false);
      state = AsyncData(_fromView(view));
    } catch (error) {
      final api = toApiException(error);
      if (api.isNetwork) {
        await _store.setDirty(true);
        return; // keep optimistic
      }
      state = AsyncData(previous); // roll back
      await _store.save(previous.lines);
      rethrow;
    }
  }

  Future<void> addProduct(Product product, {int quantity = 1}) => addLine(
        productId: product.id,
        slug: product.slug,
        nameAr: product.nameAr,
        nameEn: product.nameEn,
        unitPrice: product.price,
        imageUrl: product.primaryImageUrl,
        stock: product.stock,
        quantity: quantity,
      );

  /// Add from raw fields (e.g. a wishlist item that isn't a full Product).
  Future<void> addLine({
    required String productId,
    required String slug,
    required String nameAr,
    required String nameEn,
    required Money unitPrice,
    required String? imageUrl,
    required int stock,
    int quantity = 1,
  }) {
    final lines = [...(state.valueOrNull ?? CartState.empty).lines];
    final index = lines.indexWhere((l) => l.productId == productId);
    final newQty = (index >= 0 ? lines[index].quantity : 0) + quantity;
    final line = CartLine(
      productId: productId,
      slug: slug,
      nameAr: nameAr,
      nameEn: nameEn,
      unitPrice: unitPrice,
      imageUrl: imageUrl,
      quantity: newQty,
      stock: stock,
      isActive: true,
    );
    if (index >= 0) {
      lines[index] = line;
    } else {
      lines.add(line);
    }
    return _mutate(next: lines, serverCall: () => _api.addItem(productId, quantity));
  }

  Future<void> setQuantity(String productId, int quantity) {
    if (quantity < 1) return removeItem(productId);
    final lines = [
      for (final l in (state.valueOrNull ?? CartState.empty).lines)
        l.productId == productId ? l.copyWith(quantity: quantity) : l,
    ];
    return _mutate(next: lines, serverCall: () => _api.setQuantity(productId, quantity));
  }

  Future<void> removeItem(String productId) {
    final lines = [
      for (final l in (state.valueOrNull ?? CartState.empty).lines)
        if (l.productId != productId) l,
    ];
    return _mutate(next: lines, serverCall: () => _api.removeItem(productId));
  }

  /// Called after a successful order (the server clears its cart) or by the
  /// user. Clears local + server.
  Future<void> clear() async {
    state = const AsyncData(CartState.empty);
    await _store.clear();
    if (_authed && ref.read(isOnlineProvider)) {
      try {
        await _api.clear();
      } catch (_) {/* server may already be empty (post-order) */}
    }
  }
}

final cartControllerProvider =
    AsyncNotifierProvider<CartController, CartState>(CartController.new);

/// Live cart line count for the tab-bar badge.
final cartCountProvider = Provider<int>(
  (ref) => ref.watch(cartControllerProvider).valueOrNull?.totalQuantity ?? 0,
);
