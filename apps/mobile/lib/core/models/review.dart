/// Review wire shapes (GET /products/:id/reviews — `ReviewView`,
/// `ReviewSummary`, `PaginatedReviews` per reviews.service.ts).
class Review {
  const Review({
    required this.id,
    required this.userName,
    required this.rating,
    required this.comment,
    required this.isVerifiedPurchase,
    required this.createdAt,
  });

  factory Review.fromJson(Map<String, dynamic> json) {
    final user = json['user'] as Map<String, dynamic>? ?? const {};
    return Review(
      id: json['id'] as String,
      userName: user['name'] as String? ?? '',
      rating: json['rating'] as int,
      comment: json['comment'] as String?,
      isVerifiedPurchase: json['is_verified_purchase'] as bool? ?? false,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  final String id;
  final String userName;
  final int rating;
  final String? comment;
  final bool isVerifiedPurchase;
  final DateTime createdAt;
}

class ReviewSummary {
  const ReviewSummary({
    required this.count,
    required this.averageRating,
    required this.distribution,
  });

  factory ReviewSummary.fromJson(Map<String, dynamic> json) {
    final raw = json['distribution'] as Map<String, dynamic>? ?? const {};
    return ReviewSummary(
      count: json['count'] as int? ?? 0,
      averageRating: (json['average_rating'] as num?)?.toDouble(),
      distribution: {
        for (var star = 1; star <= 5; star++) star: (raw['$star'] as int?) ?? 0,
      },
    );
  }

  final int count;
  final double? averageRating;

  /// star (1..5) → count
  final Map<int, int> distribution;

  /// Share of total for a star bucket, 0..1.
  double share(int star) => count == 0 ? 0 : (distribution[star] ?? 0) / count;
}

class ReviewsPage {
  const ReviewsPage({
    required this.items,
    required this.page,
    required this.totalPages,
    required this.summary,
  });

  factory ReviewsPage.fromJson(Map<String, dynamic> json) => ReviewsPage(
        items: [
          for (final item in (json['items'] as List? ?? const []))
            Review.fromJson(item as Map<String, dynamic>),
        ],
        page: json['page'] as int? ?? 1,
        totalPages: json['total_pages'] as int? ?? 1,
        summary: ReviewSummary.fromJson(
          json['summary'] as Map<String, dynamic>? ?? const {},
        ),
      );

  final List<Review> items;
  final int page;
  final int totalPages;
  final ReviewSummary summary;

  bool get hasMore => page < totalPages;
}
