import '../utils/money.dart';

/// `CartView` wire shape (GET /cart + all cart mutations). Money fields are
/// JSON numbers here (the cart service pre-maps Decimal → number), but
/// [Money.parse] accepts both num and string.
class CartView {
  const CartView({
    required this.items,
    required this.totalQuantity,
    required this.subtotal,
    required this.deliveryPreview,
    required this.total,
    required this.requiresAddress,
  });

  factory CartView.fromJson(Map<String, dynamic> json) => CartView(
        items: [
          for (final item in (json['items'] as List? ?? const []))
            CartLine.fromJson(item as Map<String, dynamic>),
        ],
        totalQuantity: json['total_quantity'] as int? ?? 0,
        subtotal: Money.parse(json['subtotal'] ?? 0),
        deliveryPreview: json['delivery_preview'] is Map<String, dynamic>
            ? DeliveryPreview.fromJson(json['delivery_preview'] as Map<String, dynamic>)
            : null,
        total: Money.parse(json['total'] ?? 0),
        requiresAddress: json['requires_address'] as bool? ?? false,
      );

  final List<CartLine> items;
  final int totalQuantity;
  final Money subtotal;
  final DeliveryPreview? deliveryPreview;
  final Money total;
  final bool requiresAddress;

  bool get isEmpty => items.isEmpty;

  static final empty = CartView(
    items: const [],
    totalQuantity: 0,
    subtotal: Money.zero,
    deliveryPreview: null,
    total: Money.zero,
    requiresAddress: true,
  );
}

class CartLine {
  const CartLine({
    required this.productId,
    required this.slug,
    required this.nameAr,
    required this.nameEn,
    required this.unitPrice,
    required this.imageUrl,
    required this.quantity,
    required this.stock,
    required this.isActive,
  });

  factory CartLine.fromJson(Map<String, dynamic> json) => CartLine(
        productId: json['product_id'] as String,
        slug: json['slug'] as String? ?? '',
        nameAr: json['name_ar'] as String? ?? '',
        nameEn: json['name_en'] as String? ?? '',
        unitPrice: Money.parse(json['unit_price'] ?? 0),
        imageUrl: json['image_url'] as String?,
        quantity: json['quantity'] as int? ?? 1,
        stock: json['stock'] as int? ?? 0,
        isActive: json['is_active'] as bool? ?? true,
      );

  /// Local-mirror serialization (prefs JSON) — keeps the same field names as
  /// the wire shape so a CartLine round-trips identically.
  Map<String, dynamic> toJson() => {
        'product_id': productId,
        'slug': slug,
        'name_ar': nameAr,
        'name_en': nameEn,
        'unit_price': unitPrice.toString(),
        'image_url': imageUrl,
        'quantity': quantity,
        'stock': stock,
        'is_active': isActive,
      };

  final String productId;
  final String slug;
  final String nameAr;
  final String nameEn;
  final Money unitPrice;
  final String? imageUrl;
  final int quantity;
  final int stock;
  final bool isActive;

  Money get lineTotal => unitPrice * quantity;
  String name({required bool arabic}) => arabic ? nameAr : nameEn;

  CartLine copyWith({int? quantity}) => CartLine(
        productId: productId,
        slug: slug,
        nameAr: nameAr,
        nameEn: nameEn,
        unitPrice: unitPrice,
        imageUrl: imageUrl,
        quantity: quantity ?? this.quantity,
        stock: stock,
        isActive: isActive,
      );
}

/// `delivery_preview` — only present when the user has a default address.
class DeliveryPreview {
  const DeliveryPreview({
    required this.zone,
    required this.fee,
    required this.freeDelivery,
    required this.threshold,
    required this.etaMin,
    required this.etaMax,
  });

  factory DeliveryPreview.fromJson(Map<String, dynamic> json) {
    final eta = json['eta_days'] as Map<String, dynamic>? ?? const {};
    return DeliveryPreview(
      zone: json['zone'] as String? ?? '',
      fee: Money.parse(json['fee'] ?? 0),
      freeDelivery: json['free_delivery'] as bool? ?? false,
      threshold: Money.tryParse(json['threshold']),
      etaMin: eta['min'] as int? ?? 0,
      etaMax: eta['max'] as int? ?? 0,
    );
  }

  final String zone;
  final Money fee;
  final bool freeDelivery;
  final Money? threshold;
  final int etaMin;
  final int etaMax;
}
