import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/models/order.dart';
import '../../../core/providers.dart';
import '../../cart/application/cart_controller.dart';
import '../data/banks.dart';
import '../data/orders_api.dart';

final ordersApiProvider = Provider<OrdersApi>((ref) => OrdersApi(ref.watch(apiClientProvider)));

/// Ephemeral checkout selections, threaded across the 4 steps.
@immutable
class CheckoutState {
  const CheckoutState({
    this.addressId,
    this.paymentMethod = PaymentMethod.bankTransfer,
    this.bankId = 'faisal',
    this.notes,
  });

  final String? addressId;
  final PaymentMethod paymentMethod;
  final String bankId;
  final String? notes;

  BankInfo get bank =>
      bartalBanks.firstWhere((b) => b.id == bankId, orElse: () => bartalBanks.first);

  CheckoutState copyWith({
    String? addressId,
    PaymentMethod? paymentMethod,
    String? bankId,
    String? notes,
  }) {
    return CheckoutState(
      addressId: addressId ?? this.addressId,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      bankId: bankId ?? this.bankId,
      notes: notes ?? this.notes,
    );
  }
}

class CheckoutController extends Notifier<CheckoutState> {
  @override
  CheckoutState build() => const CheckoutState();

  void selectAddress(String id) => state = state.copyWith(addressId: id);
  void selectPayment(PaymentMethod method) => state = state.copyWith(paymentMethod: method);
  void selectBank(String id) => state = state.copyWith(bankId: id);
  void setNotes(String? notes) => state = state.copyWith(notes: notes);
  void reset() => state = const CheckoutState();

  /// Places the order from the current cart + selections. Returns the new
  /// order. The server clears the cart, so we refresh the cart controller.
  Future<OrderView> placeOrder() async {
    final addressId = state.addressId;
    if (addressId == null) {
      throw StateError('No address selected');
    }
    final cart = ref.read(cartControllerProvider).valueOrNull;
    final lines = cart?.lines ?? const [];
    if (lines.isEmpty) {
      throw StateError('Cart is empty');
    }
    final order = await ref.read(ordersApiProvider).create(
          addressId: addressId,
          paymentMethod: state.paymentMethod,
          items: [for (final l in lines) (productId: l.productId, quantity: l.quantity)],
          notes: state.notes,
        );
    await ref.read(cartControllerProvider.notifier).clear();
    reset();
    return order;
  }
}

final checkoutControllerProvider =
    NotifierProvider<CheckoutController, CheckoutState>(CheckoutController.new);
