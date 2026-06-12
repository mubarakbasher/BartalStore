import '../utils/money.dart';

/// `WishlistItemView` (GET /wishlist) — service pre-maps Decimal to number.
class WishlistItem {
  const WishlistItem({
    required this.id,
    required this.productId,
    required this.slug,
    required this.nameAr,
    required this.nameEn,
    required this.price,
    required this.comparePrice,
    required this.imageUrl,
    required this.stock,
    required this.isActive,
    required this.addedAt,
  });

  factory WishlistItem.fromJson(Map<String, dynamic> json) => WishlistItem(
        id: json['id'] as String,
        productId: json['product_id'] as String,
        slug: json['slug'] as String,
        nameAr: json['name_ar'] as String,
        nameEn: json['name_en'] as String,
        price: Money.parse(json['price']),
        comparePrice: Money.tryParse(json['compare_price']),
        imageUrl: json['image_url'] as String?,
        stock: json['stock'] as int? ?? 0,
        isActive: json['is_active'] as bool? ?? true,
        addedAt: DateTime.parse(json['added_at'] as String),
      );

  final String id;
  final String productId;
  final String slug;
  final String nameAr;
  final String nameEn;
  final Money price;
  final Money? comparePrice;
  final String? imageUrl;
  final int stock;
  final bool isActive;
  final DateTime addedAt;

  String name({required bool arabic}) => arabic ? nameAr : nameEn;
  bool get outOfStock => stock <= 0 || !isActive;
}
