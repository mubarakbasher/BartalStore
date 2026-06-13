import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/models/order.dart';
import '../../checkout/application/checkout_controller.dart' show ordersApiProvider;
import '../data/receipt_storage_api.dart';
import 'orders_controller.dart';

/// Single order detail with mutations (cancel, receipt upload). Replaces the
/// Slice-3 read-only `FutureProvider.family`; the confirm screen and the new
/// order-detail screen both watch it. Mutations update the cached order and
/// invalidate the orders list so the status chip there stays in sync.
class OrderDetailController extends FamilyAsyncNotifier<OrderView, String> {
  @override
  Future<OrderView> build(String orderId) {
    return ref.read(ordersApiProvider).detail(orderId);
  }

  Future<void> reload() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => ref.read(ordersApiProvider).detail(arg));
  }

  /// Cancel the order. Throws [ApiException] on a non-cancellable status (the
  /// caller surfaces it); on success the cached order flips to CANCELLED.
  Future<void> cancel({String? reason}) async {
    final updated = await ref.read(ordersApiProvider).cancel(arg, reason: reason);
    state = AsyncData(updated);
    ref.invalidate(ordersControllerProvider);
  }

  /// Two-step receipt upload: storage multipart → attach key to the order.
  /// Throws on failure; on success the order becomes RECEIPT_UPLOADED.
  Future<void> submitReceipt(ReceiptImage image) async {
    final key = await ref.read(receiptStorageApiProvider).upload(arg, image);
    final updated = await ref.read(ordersApiProvider).attachReceipt(arg, key);
    state = AsyncData(updated);
    ref.invalidate(ordersControllerProvider);
  }
}

final orderDetailProvider =
    AsyncNotifierProvider.family<OrderDetailController, OrderView, String>(
  OrderDetailController.new,
);
