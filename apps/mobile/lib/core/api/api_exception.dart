/// Bilingual API error — mirrors the backend envelope
/// `{ success: false, error: { code, message_en, message_ar, status } }`.
class ApiException implements Exception {
  const ApiException({
    required this.code,
    required this.messageEn,
    required this.messageAr,
    required this.status,
    this.details,
  });

  final String code;
  final String messageEn;
  final String messageAr;
  final int status;
  final Map<String, dynamic>? details;

  /// Transport-level failure (timeout, socket, DNS). Status 0 means the
  /// request never produced an HTTP response.
  factory ApiException.network() => const ApiException(
        code: 'NETWORK_ERROR',
        messageEn: 'No internet connection. Please try again.',
        messageAr: 'لا يوجد اتصال بالإنترنت. الرجاء المحاولة مرة أخرى.',
        status: 0,
      );

  /// Refresh rotation failed — the session is gone and the user is logged out.
  factory ApiException.sessionExpired() => const ApiException(
        code: 'SESSION_EXPIRED',
        messageEn: 'Please log in to continue.',
        messageAr: 'الرجاء تسجيل الدخول للمتابعة.',
        status: 401,
      );

  /// The response body didn't match the envelope contract.
  factory ApiException.malformed() => const ApiException(
        code: 'MALFORMED_RESPONSE',
        messageEn: 'Something went wrong. Please try again.',
        messageAr: 'حدث خطأ ما. الرجاء المحاولة مرة أخرى.',
        status: 0,
      );

  bool get isNetwork => code == 'NETWORK_ERROR';
  bool get isSessionExpired => code == 'SESSION_EXPIRED';

  String localized({required bool arabic}) => arabic ? messageAr : messageEn;

  @override
  String toString() => 'ApiException($code, $status): $messageEn';
}
