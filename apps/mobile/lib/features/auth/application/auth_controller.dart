import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/envelope.dart';
import '../../../core/models/user.dart';
import '../../../core/providers.dart';
import '../../cart/application/cart_controller.dart';
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

  /// Bumped on logout to invalidate an in-flight token registration that
  /// resumes after the session ends (see [registerCurrentToken]).
  int _authEpoch = 0;

  /// The most recent in-flight [registerCurrentToken]; [logout] awaits it so
  /// the unregister PUT is the backend's last fcm-token write.
  Future<void>? _tokenRegistration;

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
    // Invalidate any in-flight token registration and let it settle, then
    // unregister while the session is still valid — so the null write is the
    // backend's last fcm-token update and a logged-out device can't be left
    // subscribed to the previous user's pushes.
    _authEpoch++;
    await _tokenRegistration;
    await syncFcmToken(null);
    try {
      await _api.logout();
    } catch (error) {
      // Best-effort server revoke; local logout always proceeds.
      debugPrint('logout: server revoke failed: $error');
    }
    await ref.read(tokenStorageProvider).clear();
    state = const AsyncData(AuthGuest());
    // Drop the previous user's cart so a logged-out device starts clean.
    await ref.read(cartControllerProvider.notifier).clear();
  }

  /// Register (`token`) or unregister (`null`) the device's FCM token with the
  /// backend. Best-effort: token sync must never block or fail auth.
  Future<void> syncFcmToken(String? token) async {
    try {
      await _api.updateFcmToken(token);
    } catch (error) {
      debugPrint('fcm token sync failed: $error');
    }
  }

  /// Read the current device token from the push service and register it.
  /// No-op when push is unavailable (token null). Called after login and on
  /// app start once the session is known.
  Future<void> registerCurrentToken() async {
    if (!isAuthenticated) return;
    final epoch = _authEpoch;
    try {
      final token = await ref.read(pushServiceProvider).getToken();
      // A logout during the (possibly slow, 2G) token fetch invalidates this —
      // don't re-register a token the logout just removed.
      if (token == null || epoch != _authEpoch || !isAuthenticated) return;
      await syncFcmToken(token);
    } catch (error) {
      debugPrint('fcm token read failed: $error');
    }
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

  /// Update the profile (`PUT /users/me`) and reflect it in the session.
  /// Throws [ApiException] (e.g. EMAIL_EXISTS) for the caller to surface.
  Future<void> updateProfile({
    String? name,
    String? email,
    String? language,
    DateTime? dateOfBirth,
    bool clearDateOfBirth = false,
    String? gender,
  }) async {
    final updated = await _api.updateProfile(
      name: name,
      email: email,
      language: language,
      dateOfBirth: dateOfBirth,
      clearDateOfBirth: clearDateOfBirth,
      gender: gender,
    );
    state = AsyncData(Authenticated(updated));
  }

  /// Change the password. The server revokes all refresh tokens, so the caller
  /// must follow a success with [logout] + a re-login prompt. Throws
  /// [ApiException] (e.g. INVALID_CURRENT_PASSWORD) on failure.
  Future<void> changePassword({required String currentPassword, required String newPassword}) {
    return _api.changePassword(currentPassword: currentPassword, newPassword: newPassword);
  }

  Future<void> _storeSession(AuthSession session) async {
    await ref.read(tokenStorageProvider).save(
          accessToken: session.tokens.accessToken,
          refreshToken: session.tokens.refreshToken,
        );
    state = AsyncData(Authenticated(session.user));
    // The cart controller watches auth and merges any guest cart into the
    // server cart on this transition (see CartController.build).
    // Push the FCM token for this device (best-effort, non-blocking); logout
    // awaits this handle so register/unregister can't race out of order.
    _tokenRegistration = registerCurrentToken();
  }
}

final authControllerProvider =
    AsyncNotifierProvider<AuthController, AuthState>(AuthController.new);
