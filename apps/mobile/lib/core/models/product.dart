import '../utils/money.dart';

/// Product wire shape — raw Prisma row with `images` + `category` includes
/// (GET /products, /products/search, /products/:id). Money fields arrive as
/// JSON strings (Prisma Decimal) — parsed via [Money].
class Product {
  const Product({
    required this.id,
    required this.slug,
    required this.nameAr,
    required this.nameEn,
    required this.descriptionAr,
    required this.descriptionEn,
    required this.price,
    required this.comparePrice,
    required this.stock,
    required this.lowStockThreshold,
    required this.isFeatured,
    required this.images,
    required this.category,
    this.sku,
  });

  factory Product.fromJson(Map<String, dynamic> json) => Product(
        id: json['id'] as String,
        slug: json['slug'] as String,
        nameAr: json['name_ar'] as String,
        nameEn: json['name_en'] as String,
        descriptionAr: json['description_ar'] as String? ?? '',
        descriptionEn: json['description_en'] as String? ?? '',
        price: Money.parse(json['price']),
        comparePrice: Money.tryParse(json['compare_price']),
        stock: json['stock'] as int? ?? 0,
        lowStockThreshold: json['low_stock_threshold'] as int? ?? 5,
        isFeatured: json['is_featured'] as bool? ?? false,
        sku: json['sku'] as String?,
        images: [
          for (final image in (json['images'] as List? ?? const []))
            ProductImage.fromJson(image as Map<String, dynamic>),
        ],
        category: json['category'] is Map<String, dynamic>
            ? CategoryRef.fromJson(json['category'] as Map<String, dynamic>)
            : null,
      );

  final String id;
  final String slug;
  final String nameAr;
  final String nameEn;
  final String descriptionAr;
  final String descriptionEn;
  final Money price;
  final Money? comparePrice;
  final int stock;
  final int lowStockThreshold;
  final bool isFeatured;
  final String? sku;
  final List<ProductImage> images;
  final CategoryRef? category;

  String name({required bool arabic}) => arabic ? nameAr : nameEn;
  String description({required bool arabic}) => arabic ? descriptionAr : descriptionEn;
  bool get inStock => stock > 0;
  bool get lowStock => stock > 0 && stock <= lowStockThreshold;
  bool get onSale => comparePrice != null;
  String? get primaryImageUrl => images.isEmpty ? null : images.first.url;
}

class ProductImage {
  const ProductImage({required this.url, this.altAr, this.altEn});

  factory ProductImage.fromJson(Map<String, dynamic> json) => ProductImage(
        url: json['url'] as String,
        altAr: json['alt_ar'] as String?,
        altEn: json['alt_en'] as String?,
      );

  final String url;
  final String? altAr;
  final String? altEn;
}

/// Embedded `category` select on product rows.
class CategoryRef {
  const CategoryRef({
    required this.id,
    required this.slug,
    required this.nameAr,
    required this.nameEn,
  });

  factory CategoryRef.fromJson(Map<String, dynamic> json) => CategoryRef(
        id: json['id'] as String,
        slug: json['slug'] as String,
        nameAr: json['name_ar'] as String,
        nameEn: json['name_en'] as String,
      );

  final String id;
  final String slug;
  final String nameAr;
  final String nameEn;

  String name({required bool arabic}) => arabic ? nameAr : nameEn;
}
