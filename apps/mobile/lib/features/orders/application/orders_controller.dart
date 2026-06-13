import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/models/order.dart';
import '../../auth/application/auth_controller.dart';
import '../../checkout/application/checkout_controller.dart';

/// Paged orders list (auth-only).
@immutable
class OrdersPage {
  const OrdersPage({
    required this.orders,
    required this.page,
    required this.totalPages,
    this.loadingMore = false,
  });

  final List<OrderView> orders;
  final int page;
  final int totalPages;
  final bool loadingMore;

  bool get hasMore => page < totalPages;

  OrdersPage copyWith({List<OrderView>? orders, int? page, int? totalPages, bool? loadingMore}) {
    return OrdersPage(
      orders: orders ?? this.orders,
      page: page ?? this.page,
      totalPages: totalPages ?? this.totalPages,
      loadingMore: loadingMore ?? this.loadingMore,
    );
  }
}

class OrdersController extends AsyncNotifier<OrdersPage> {
  @override
  Future<OrdersPage> build() async {
    final auth = await ref.watch(authControllerProvider.future);
    if (auth is! Authenticated) {
      return const OrdersPage(orders: [], page: 1, totalPages: 1);
    }
    final result = await ref.read(ordersApiProvider).list();
    return OrdersPage(
      orders: result.items,
      page: result.meta.page,
      totalPages: result.meta.totalPages,
    );
  }

  Future<void> fetchNextPage() async {
    final current = state.valueOrNull;
    if (current == null || !current.hasMore || current.loadingMore) return;
    state = AsyncData(current.copyWith(loadingMore: true));
    try {
      final next = await ref.read(ordersApiProvider).list(page: current.page + 1);
      state = AsyncData(current.copyWith(
        orders: [...current.orders, ...next.items],
        page: next.meta.page,
        totalPages: next.meta.totalPages,
        loadingMore: false,
      ));
    } catch (_) {
      state = AsyncData(current.copyWith(loadingMore: false));
    }
  }
}

final ordersControllerProvider =
    AsyncNotifierProvider<OrdersController, OrdersPage>(OrdersController.new);
