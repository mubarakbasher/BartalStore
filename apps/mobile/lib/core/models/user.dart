/// `PublicUser` / `UserProfileView` wire shape (auth + GET /users/me).
/// snake_case field names follow the API (PRD §9).
class User {
  const User({
    required this.id,
    required this.phone,
    required this.name,
    required this.email,
    required this.role,
    required this.language,
    required this.isVerified,
    required this.loyaltyPoints,
    this.ordersCount,
    this.lifetimeSpend,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
        id: json['id'] as String,
        phone: json['phone'] as String,
        name: json['name'] as String,
        email: json['email'] as String?,
        role: json['role'] as String,
        language: json['language'] as String,
        isVerified: json['is_verified'] as bool? ?? false,
        loyaltyPoints: json['loyalty_points'] as int? ?? 0,
        ordersCount: json['orders_count'] as int?,
        lifetimeSpend: json['lifetime_spend'] as num?,
      );

  final String id;
  final String phone;
  final String name;
  final String? email;
  final String role;
  final String language;
  final bool isVerified;
  final int loyaltyPoints;

  /// Present only on `GET /users/me` (computed aggregates).
  final int? ordersCount;
  final num? lifetimeSpend;
}

/// Flat token payload from login / verify-otp / refresh.
class AuthTokens {
  const AuthTokens({required this.accessToken, required this.refreshToken});

  factory AuthTokens.fromJson(Map<String, dynamic> json) => AuthTokens(
        accessToken: json['accessToken'] as String,
        refreshToken: json['refreshToken'] as String,
      );

  final String accessToken;
  final String refreshToken;
}
