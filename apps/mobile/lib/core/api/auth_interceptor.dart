import 'package:dio/dio.dart';

import '../storage/token_storage.dart';
import 'api_exception.dart';
import 'endpoints.dart';
import 'envelope.dart';

/// Marks a request as public — no bearer header, no refresh-on-401.
const kPublicRequest = 'bartal_public';

/// Bearer attach + refresh-rotation on 401.
///
/// Extends [QueuedInterceptor], which serializes error handling: while one
/// 401 is refreshing, subsequent failures queue behind it. A queued request
/// whose token is already stale simply retries with the freshly stored pair
/// instead of refreshing again (single-flight rotation — required because the
/// backend revokes a refresh token on first use).
class AuthInterceptor extends QueuedInterceptor {
  AuthInterceptor({
    required this.tokens,
    required Dio refreshDio,
    required this.onSessionExpired,
  }) : _refreshDio = refreshDio;

  final TokenStorage tokens;

  /// Bare client (no interceptors) for the refresh call itself.
  final Dio _refreshDio;

  /// Invoked exactly once per dead session — flips auth state to guest.
  final void Function() onSessionExpired;

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    if (options.extra[kPublicRequest] != true) {
      final access = tokens.accessToken;
      if (access != null) {
        options.headers['Authorization'] = 'Bearer $access';
      }
    }
    handler.next(options);
  }

  @override
  Future<void> onError(DioException err, ErrorInterceptorHandler handler) async {
    final response = err.response;
    final options = err.requestOptions;
    final isAuthRoute = options.path.startsWith('/auth/');
    final eligible = response?.statusCode == 401 &&
        options.extra[kPublicRequest] != true &&
        !isAuthRoute &&
        options.extra['bartal_retried'] != true;

    if (!eligible) {
      handler.next(err);
      return;
    }

    final failedAuth = options.headers['Authorization'];
    final currentAccess = tokens.accessToken;

    // Another queued request already rotated the pair — just retry.
    if (currentAccess != null && failedAuth != 'Bearer $currentAccess') {
      await _retry(options, handler, err);
      return;
    }

    final refresh = tokens.refreshToken;
    if (refresh == null) {
      _expire(handler, err);
      return;
    }

    try {
      final refreshResponse = await _refreshDio.post<dynamic>(
        Endpoints.refresh,
        data: {'refreshToken': refresh},
      );
      final pair = parseEnvelope(refreshResponse, (data) {
        final map = data as Map<String, dynamic>;
        return (
          access: map['accessToken'] as String,
          refresh: map['refreshToken'] as String,
        );
      });
      // Persist BEFORE retrying so concurrent queued requests see the
      // rotated pair (the old refresh token is now revoked server-side).
      await tokens.save(accessToken: pair.access, refreshToken: pair.refresh);
    } catch (_) {
      _expire(handler, err);
      return;
    }

    await _retry(options, handler, err);
  }

  Future<void> _retry(
    RequestOptions options,
    ErrorInterceptorHandler handler,
    DioException original,
  ) async {
    options.extra['bartal_retried'] = true;
    options.headers['Authorization'] = 'Bearer ${tokens.accessToken}';
    try {
      final response = await _refreshDio.fetch<dynamic>(options);
      handler.resolve(response);
    } on DioException catch (e) {
      handler.next(e);
    }
  }

  void _expire(ErrorInterceptorHandler handler, DioException original) {
    tokens.clear();
    onSessionExpired();
    handler.next(
      DioException(
        requestOptions: original.requestOptions,
        response: original.response,
        type: original.type,
        error: ApiException.sessionExpired(),
      ),
    );
  }
}
