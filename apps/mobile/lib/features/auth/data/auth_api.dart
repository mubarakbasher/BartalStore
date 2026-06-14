import 'package:dio/dio.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/endpoints.dart';
import '../../../core/api/envelope.dart';
import '../../../core/models/user.dart';

enum OtpPurpose { register, login, passwordReset }

extension on OtpPurpose {
  String get wire => switch (this) {
        OtpPurpose.register => 'REGISTER',
        OtpPurpose.login => 'LOGIN',
        OtpPurpose.passwordReset => 'PASSWORD_RESET',
      };
}

typedef AuthSession = ({User user, AuthTokens tokens});

/// Auth endpoints (apps/api auth module). All public except logout.
class AuthApi {
  AuthApi(this._dio);

  final Dio _dio;

  /// → `{ userId, expiresAt }`; OTP is sent via SMS (logged to the API
  /// console in dev).
  Future<String> register({
    required String phone,
    required String name,
    required String password,
    String? email,
  }) async {
    final response = await _dio.post<dynamic>(
      Endpoints.register,
      data: {
        'phone': phone,
        'name': name,
        'password': password,
        if (email != null && email.isNotEmpty) 'email': email,
      },
      options: publicRequest(),
    );
    return parseEnvelope(response, (data) => (data as Map<String, dynamic>)['userId'] as String);
  }

  Future<AuthSession> verifyOtp({
    required String phone,
    required String code,
    required OtpPurpose purpose,
  }) async {
    final response = await _dio.post<dynamic>(
      Endpoints.verifyOtp,
      data: {'phone': phone, 'code': code, 'purpose': purpose.wire},
      options: publicRequest(),
    );
    return parseEnvelope(response, _session);
  }

  Future<void> resendOtp({required String phone, required OtpPurpose purpose}) async {
    final response = await _dio.post<dynamic>(
      Endpoints.resendOtp,
      data: {'phone': phone, 'purpose': purpose.wire},
      options: publicRequest(),
    );
    parseEnvelope(response, (_) => null);
  }

  Future<AuthSession> login({required String phone, required String password}) async {
    final response = await _dio.post<dynamic>(
      Endpoints.login,
      data: {'phone': phone, 'password': password},
      options: publicRequest(),
    );
    return parseEnvelope(response, _session);
  }

  Future<void> logout() async {
    final response = await _dio.post<dynamic>(Endpoints.logout);
    parseEnvelope(response, (_) => null);
  }

  Future<void> forgotPassword({required String phone}) async {
    final response = await _dio.post<dynamic>(
      Endpoints.forgotPassword,
      data: {'phone': phone},
      options: publicRequest(),
    );
    parseEnvelope(response, (_) => null);
  }

  Future<void> resetPassword({
    required String phone,
    required String code,
    required String newPassword,
  }) async {
    final response = await _dio.post<dynamic>(
      Endpoints.resetPassword,
      data: {'phone': phone, 'code': code, 'newPassword': newPassword},
      options: publicRequest(),
    );
    parseEnvelope(response, (_) => null);
  }

  /// `GET /users/me` — bearer.
  Future<User> me() async {
    final response = await _dio.get<dynamic>(Endpoints.me);
    return parseEnvelope(response, (data) => User.fromJson(data as Map<String, dynamic>));
  }

  /// `PUT /users/me` — partial update (phone is not updatable). Pass only the
  /// changed fields; `clearDateOfBirth` sends `date_of_birth: null`.
  /// Errors: `EMAIL_EXISTS` (409).
  Future<User> updateProfile({
    String? name,
    String? email,
    String? language,
    DateTime? dateOfBirth,
    bool clearDateOfBirth = false,
    String? gender,
  }) async {
    final data = <String, dynamic>{};
    if (name != null) data['name'] = name;
    if (email != null) data['email'] = email;
    if (language != null) data['language'] = language;
    if (clearDateOfBirth) {
      data['date_of_birth'] = null;
    } else if (dateOfBirth != null) {
      data['date_of_birth'] = dateOfBirth.toIso8601String();
    }
    if (gender != null) data['gender'] = gender;
    final response = await _dio.put<dynamic>(Endpoints.me, data: data);
    return parseEnvelope(response, (data) => User.fromJson(data as Map<String, dynamic>));
  }

  /// `POST /users/me/change-password`. Revokes all refresh tokens server-side
  /// (the caller must re-login). Errors: `INVALID_CURRENT_PASSWORD` (401).
  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    final response = await _dio.post<dynamic>(
      Endpoints.changePassword,
      data: {'currentPassword': currentPassword, 'newPassword': newPassword},
    );
    parseEnvelope(response, (_) => null);
  }

  /// `PUT /users/me/fcm-token` — register (`token`) or unregister (`null`) the
  /// device's FCM token (DTO: `{ fcm_token: string|null }`, max 4096).
  Future<void> updateFcmToken(String? token) async {
    final response = await _dio.put<dynamic>(
      Endpoints.fcmToken,
      data: {'fcm_token': token},
    );
    parseEnvelope(response, (_) => null);
  }

  static AuthSession _session(dynamic data) {
    final map = data as Map<String, dynamic>;
    return (
      user: User.fromJson(map['user'] as Map<String, dynamic>),
      tokens: AuthTokens.fromJson(map),
    );
  }
}
