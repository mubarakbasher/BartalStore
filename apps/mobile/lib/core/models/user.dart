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
    this.emailVerified = false,
    this.dateOfBirth,
    this.gender,
    this.nationalIdStatus,
    this.createdAt,
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
        emailVerified: json['email_verified'] as bool? ?? false,
        dateOfBirth: DateTime.tryParse(json['date_of_birth'] as String? ?? ''),
        gender: json['gender'] as String?,
        nationalIdStatus: json['national_id_status'] as String?,
        createdAt: DateTime.tryParse(json['created_at'] as String? ?? ''),
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
  final bool emailVerified;
  final DateTime? dateOfBirth;

  /// `MALE` | `FEMALE` | `OTHER` (wire enum), or null.
  final String? gender;
  final String? nationalIdStatus;
  final DateTime? createdAt;

  /// Present only on `GET /users/me` (computed aggregates).
  final int? ordersCount;
  final num? lifetimeSpend;

  /// Up-to-two initials for the avatar (e.g. "MO" for "Mohammed Osman").
  String get initials {
    final parts = name.trim().split(RegExp(r'\s+')).where((p) => p.isNotEmpty).toList();
    if (parts.isEmpty) return '?';
    final letters = parts.map((p) => p[0]).take(2).join();
    return letters.toUpperCase();
  }
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
