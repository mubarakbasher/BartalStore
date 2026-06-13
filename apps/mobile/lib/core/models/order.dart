import '../utils/money.dart';
import 'address.dart';

/// Order status (PRD §11.3 state machine). Mirrors the API OrderStatus enum.
enum OrderStatus {
  pending('PENDING'),
  awaitingPayment('AWAITING_PAYMENT'),
  receiptUploaded('RECEIPT_UPLOADED'),
  paymentConfirmed('PAYMENT_CONFIRMED'),
  paymentRejected('PAYMENT_REJECTED'),
  processing('PROCESSING'),
  shipped('SHIPPED'),
  delivered('DELIVERED'),
  cancelled('CANCELLED'),
  refunded('REFUNDED');

  const OrderStatus(this.wire);
  final String wire;

  static OrderStatus fromWire(String? value) =>
      OrderStatus.values.firstWhere((s) => s.wire == value, orElse: () => OrderStatus.pending);
}

enum PaymentMethod {
  bankTransfer('BANK_TRANSFER'),
  cashOnDelivery('CASH_ON_DELIVERY');

  const PaymentMethod(this.wire);
  final String wire;

  static PaymentMethod fromWire(String? value) => PaymentMethod.values
      .firstWhere((m) => m.wire == value, orElse: () => PaymentMethod.bankTransfer);
}

/// `OrderView` wire shape (POST /orders, GET /orders/:id).
class OrderView {
  const OrderView({
    required this.id,
    required this.orderNumber,
    required this.status,
    required this.paymentMethod,
    required this.subtotal,
    required this.deliveryFee,
    required this.discount,
    required this.total,
    required this.items,
    required this.statusHistory,
    required this.address,
    required this.createdAt,
    required this.receiptUrl,
  });

  factory OrderView.fromJson(Map<String, dynamic> json) => OrderView(
        id: json['id'] as String,
        orderNumber: json['order_number'] as String? ?? '',
        status: OrderStatus.fromWire(json['status'] as String?),
        paymentMethod: PaymentMethod.fromWire(json['payment_method'] as String?),
        subtotal: Money.parse(json['subtotal'] ?? 0),
        deliveryFee: Money.parse(json['delivery_fee'] ?? 0),
        discount: Money.parse(json['discount'] ?? 0),
        total: Money.parse(json['total'] ?? 0),
        receiptUrl: json['receipt_url'] as String?,
        items: [
          for (final item in (json['items'] as List? ?? const []))
            OrderItem.fromJson(item as Map<String, dynamic>),
        ],
        statusHistory: [
          for (final event in (json['status_history'] as List? ?? const []))
            OrderStatusEvent.fromJson(event as Map<String, dynamic>),
        ],
        address: json['address'] is Map<String, dynamic>
            ? OrderAddress.fromJson(json['address'] as Map<String, dynamic>)
            : null,
        createdAt: DateTime.tryParse(json['created_at'] as String? ?? '') ?? DateTime.fromMillisecondsSinceEpoch(0),
      );

  final String id;
  final String orderNumber;
  final OrderStatus status;
  final PaymentMethod paymentMethod;
  final Money subtotal;
  final Money deliveryFee;
  final Money discount;
  final Money total;
  final String? receiptUrl;
  final List<OrderItem> items;
  final List<OrderStatusEvent> statusHistory;
  final OrderAddress? address;
  final DateTime createdAt;

  int get itemCount => items.fold(0, (sum, item) => sum + item.quantity);
  String? get primaryImageUrl => items.isEmpty ? null : items.first.image;
}

class OrderItem {
  const OrderItem({
    required this.productId,
    required this.nameAr,
    required this.nameEn,
    required this.image,
    required this.quantity,
    required this.unitPrice,
    required this.totalPrice,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) => OrderItem(
        productId: json['product_id'] as String? ?? '',
        nameAr: json['product_name_ar'] as String? ?? '',
        nameEn: json['product_name_en'] as String? ?? '',
        image: json['product_image'] as String?,
        quantity: json['quantity'] as int? ?? 1,
        unitPrice: Money.parse(json['unit_price'] ?? 0),
        totalPrice: Money.parse(json['total_price'] ?? 0),
      );

  final String productId;
  final String nameAr;
  final String nameEn;
  final String? image;
  final int quantity;
  final Money unitPrice;
  final Money totalPrice;

  String name({required bool arabic}) => arabic ? nameAr : nameEn;
}

class OrderStatusEvent {
  const OrderStatusEvent({required this.status, required this.note, required this.createdAt});

  factory OrderStatusEvent.fromJson(Map<String, dynamic> json) => OrderStatusEvent(
        status: OrderStatus.fromWire(json['status'] as String?),
        note: json['note'] as String?,
        createdAt: DateTime.tryParse(json['created_at'] as String? ?? '') ??
            DateTime.fromMillisecondsSinceEpoch(0),
      );

  final OrderStatus status;
  final String? note;
  final DateTime createdAt;
}

/// Order's embedded address snapshot.
class OrderAddress {
  const OrderAddress({
    required this.label,
    required this.fullName,
    required this.phone,
    required this.district,
    required this.street,
    required this.landmark,
    required this.zone,
  });

  factory OrderAddress.fromJson(Map<String, dynamic> json) => OrderAddress(
        label: json['label'] as String? ?? '',
        fullName: json['full_name'] as String? ?? '',
        phone: json['phone'] as String? ?? '',
        district: json['district'] as String? ?? '',
        street: json['street'] as String?,
        landmark: json['landmark'] as String? ?? '',
        zone: DeliveryZone.fromWire(json['zone'] as String?),
      );

  final String label;
  final String fullName;
  final String phone;
  final String district;
  final String? street;
  final String landmark;
  final DeliveryZone zone;

  String get streetLine {
    final parts = [if (street != null && street!.isNotEmpty) street!, district];
    return parts.join(' · ');
  }
}
