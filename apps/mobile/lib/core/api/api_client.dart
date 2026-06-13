import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

import '../storage/token_storage.dart';
import 'auth_interceptor.dart';
import 'endpoints.dart';

/// Builds the app's single [Dio]. Timeouts are generous for 2G/3G —
/// the product targets exactly those networks (CLAUDE.md §2).
Dio buildApiClient({
  required TokenStorage tokens,
  required void Function() onSessionExpired,
  String? baseUrl,
}) {
  final options = BaseOptions(
    // The Nest app sets a global 'api' prefix (apps/api/src/main.ts).
    baseUrl: '${baseUrl ?? apiBaseUrl}/api',
    connectTimeout: const Duration(seconds: 15),
    receiveTimeout: const Duration(seconds: 20),
    // Let the envelope layer convert error bodies — don't throw on 4xx/5xx
    // for parsing, but DO let dio mark them as errors for the interceptor.
  );

  final dio = Dio(options);
  final refreshDio = Dio(options);

  dio.interceptors.add(
    AuthInterceptor(
      tokens: tokens,
      refreshDio: refreshDio,
      onSessionExpired: onSessionExpired,
    ),
  );
  if (kDebugMode) {
    dio.interceptors.add(LogInterceptor());
  }
  return dio;
}

/// Convenience for public (unauthenticated) requests.
Options publicRequest() => Options(extra: {kPublicRequest: true});
