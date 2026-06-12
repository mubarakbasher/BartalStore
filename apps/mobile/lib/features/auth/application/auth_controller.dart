import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/envelope.dart';
import '../../../core/models/user.dart';
import '../../../core/providers.dart';
import '../data/auth_api.dart';

sealed class AuthState {
  const AuthState();
}

class AuthGuest extends AuthState {
  const AuthGuest();
}

class Authenticated extends AuthState {
  const Authenticated(this.user);

  /// Null when a stored session exists but the profile hasn't loaded yet
  /// (e.g. offline boot) — still authenticated for routing purposes.
  final User? user;
}

final authApiProvider = Provider<AuthApi>(
  (ref) => AuthApi(ref.watch(apiClientProvider)),
);

class AuthController extends AsyncNotifier<AuthState> {
  AuthApi get _api => ref.read(authApiProvider);

  @override
  Future<AuthState> build() async {
    // Refresh-failure → guest, from anywhere in the app.
    ref.watch(sessionExpirySignalProvider).onExpired = () {
      state = const AsyncData(AuthGuest());
    };

    final tokens = ref.watch(tokenStorageProvider);
    if (!tokens.hasSession) return const AuthGuest();
    try {
      return Authenticated(await _api.me());
    } catch (error) {
      final apiError = toApiException(error);
      if (apiError.isNetwork) {
        // Offline boot with a stored session: stay signed in, profile loads
        // on the next successful call (PRD §7.1.3 offline resilience).
        return const Authenticated(null);
      }
      // Session rejected server-side — interceptor already cleared tokens.
      return const AuthGuest();
    }
  }

  bool get isAuthenticated => state.valueOrNull is Authenticated;
  User? get user => switch (state.valueOrNull) {
        Authenticated(:final user) => user,
        _ => null,
      };

  Future<void> login({required String phone, required String password}) async {
    final session = await _api.login(phone: phone, password: password);
    await _storeSession(session);
  }

  /// → userId; flow continues on the OTP screen.
  Future<String> register({
    required String phone,
    required String name,
    required String password,
    String? email,
  }) {
    return _api.register(phone: phone, name: name, password: password, email: email);
  }

  Future<void> verifyOtp({
    required String phone,
    required String code,
    required OtpPurpose purpose,
  }) async {
    final session = await _api.verifyOtp(phone: phone, code: code, purpose: purpose);
    await _storeSession(session);
  }

  Future<void> resendOtp({required String phone, required OtpPurpose purpose}) {
    return _api.resendOtp(phone: phone, purpose: purpose);
  }

  Future<void> forgotPassword({required String phone}) => _api.forgotPassword(phone: phone);

  Future<void> resetPassword({
    required String phone,
    required String code,
    required String newPassword,
  }) {
    return _api.resetPassword(phone: phone, code: code, newPassword: newPassword);
  }

  Future<void> logout() async {
    try {
      await _api.logout();
    } catch (error) {
      // Best-effort server revoke; local logout always proceeds.
      debugPrint('logout: server revoke failed: $error');
    }
    await ref.read(tokenStorageProvider).clear();
    state = const AsyncData(AuthGuest());
  }

  /// Re-fetch the profile (e.g. after the offline-boot null-user state).
  Future<void> refreshProfile() async {
    if (!isAuthenticated) return;
    try {
      state = AsyncData(Authenticated(await _api.me()));
    } catch (_) {
      // Keep the current state; transient failures must not log out.
    }
  }

  Future<void> _storeSession(AuthSession session) async {
    await ref.read(tokenStorageProvider).save(
          accessToken: session.tokens.accessToken,
          refreshToken: session.tokens.refreshToken,
        );
    state = AsyncData(Authenticated(session.user));
  }
}

final authControllerProvider =
    AsyncNotifierProvider<AuthController, AuthState>(AuthController.new);
