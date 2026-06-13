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

enum PaymentStatus {
  unpaid('UNPAID'),
  paid('PAID'),
  refunded('REFUNDED');

  const PaymentStatus(this.wire);
  final String wire;

  static PaymentStatus fromWire(String? value) => PaymentStatus.values
      .firstWhere((s) => s.wire == value, orElse: () => PaymentStatus.unpaid);
}

/// Statuses a customer may cancel from (mirrors the API state machine —
/// `apps/api/.../helpers/state-machine.ts` `cancellableStatuses`).
const _cancellableStatuses = {
  OrderStatus.pending,
  OrderStatus.awaitingPayment,
  OrderStatus.receiptUploaded,
};

/// Statuses where a bank-transfer order accepts a (re-)uploaded receipt
/// (mirrors the storage/receipt guards on the API).
const _receiptUploadableStatuses = {
  OrderStatus.awaitingPayment,
  OrderStatus.paymentRejected,
};

/// `OrderView` wire shape (POST /orders, GET /orders/:id).
class OrderView {
  const OrderView({
    required this.id,
    required this.orderNumber,
    required this.status,
    required this.paymentMethod,
    required this.paymentStatus,
    required this.subtotal,
    required this.deliveryFee,
    required this.discount,
    required this.total,
    required this.items,
    required this.statusHistory,
    required this.address,
    required this.createdAt,
    required this.receiptUrl,
    required this.cancellationReason,
  });

  factory OrderView.fromJson(Map<String, dynamic> json) => OrderView(
        id: json['id'] as String,
        orderNumber: json['order_number'] as String? ?? '',
        status: OrderStatus.fromWire(json['status'] as String?),
        paymentMethod: PaymentMethod.fromWire(json['payment_method'] as String?),
        paymentStatus: PaymentStatus.fromWire(json['payment_status'] as String?),
        subtotal: Money.parse(json['subtotal'] ?? 0),
        deliveryFee: Money.parse(json['delivery_fee'] ?? 0),
        discount: Money.parse(json['discount'] ?? 0),
        total: Money.parse(json['total'] ?? 0),
        receiptUrl: json['receipt_url'] as String?,
        cancellationReason: json['cancellation_reason'] as String?,
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
  final PaymentStatus paymentStatus;
  final Money subtotal;
  final Money deliveryFee;
  final Money discount;
  final Money total;
  final String? receiptUrl;
  final String? cancellationReason;
  final List<OrderItem> items;
  final List<OrderStatusEvent> statusHistory;
  final OrderAddress? address;
  final DateTime createdAt;

  int get itemCount => items.fold(0, (sum, item) => sum + item.quantity);
  String? get primaryImageUrl => items.isEmpty ? null : items.first.image;

  bool get isBankTransfer => paymentMethod == PaymentMethod.bankTransfer;
  bool get hasDiscount => discount > Money.zero;

  /// The customer may cancel from PENDING / AWAITING_PAYMENT / RECEIPT_UPLOADED.
  bool get canCancel => _cancellableStatuses.contains(status);

  /// A bank-transfer order accepts a (re-)uploaded receipt only while
  /// AWAITING_PAYMENT or PAYMENT_REJECTED — the server enforces the same.
  bool get canUploadReceipt =>
      isBankTransfer && _receiptUploadableStatuses.contains(status);

  bool get isRejected => status == OrderStatus.paymentRejected;

  /// "Track order" makes sense once the order is moving through fulfilment.
  bool get isTrackable => const {
        OrderStatus.paymentConfirmed,
        OrderStatus.processing,
        OrderStatus.shipped,
        OrderStatus.delivered,
      }.contains(status);

  bool get isDelivered => status == OrderStatus.delivered;

  /// The note the verification team left when rejecting payment — the latest
  /// PAYMENT_REJECTED status-history event's note (the rejection reason).
  String? get rejectionNote {
    for (final event in statusHistory.reversed) {
      if (event.status == OrderStatus.paymentRejected && (event.note?.isNotEmpty ?? false)) {
        return event.note;
      }
    }
    return cancellationReason;
  }

  /// When the receipt was last uploaded — the latest RECEIPT_UPLOADED event.
  DateTime? get receiptUploadedAt {
    for (final event in statusHistory.reversed) {
      if (event.status == OrderStatus.receiptUploaded) return event.createdAt;
    }
    return null;
  }
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
