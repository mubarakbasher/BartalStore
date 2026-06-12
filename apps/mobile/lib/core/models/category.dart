/// Category tree node (GET /categories).
class Category {
  const Category({
    required this.id,
    required this.slug,
    required this.nameAr,
    required this.nameEn,
    required this.imageUrl,
    required this.children,
  });

  factory Category.fromJson(Map<String, dynamic> json) => Category(
        id: json['id'] as String,
        slug: json['slug'] as String,
        nameAr: json['name_ar'] as String,
        nameEn: json['name_en'] as String,
        imageUrl: json['image_url'] as String?,
        children: [
          for (final child in (json['children'] as List? ?? const []))
            Category.fromJson(child as Map<String, dynamic>),
        ],
      );

  final String id;
  final String slug;
  final String nameAr;
  final String nameEn;
  final String? imageUrl;
  final List<Category> children;

  String name({required bool arabic}) => arabic ? nameAr : nameEn;
}
