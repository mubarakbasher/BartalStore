import 'package:bartal_mobile/core/api/api_exception.dart';
import 'package:bartal_mobile/core/api/auth_interceptor.dart';
import 'package:bartal_mobile/core/storage/token_storage.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_secure_storage_platform_interface/flutter_secure_storage_platform_interface.dart'
    show FlutterSecureStoragePlatform;
import 'package:flutter_test/flutter_test.dart';

/// In-memory secure storage so TokenStorage runs without platform channels.
class _MemorySecureStorage extends FlutterSecureStoragePlatform {
  final Map<String, String> _store = {};

  @override
  Future<bool> containsKey({required String key, required Map<String, String> options}) async =>
      _store.containsKey(key);

  @override
  Future<void> delete({required String key, required Map<String, String> options}) async =>
      _store.remove(key);

  @override
  Future<void> deleteAll({required Map<String, String> options}) async => _store.clear();

  @override
  Future<String?> read({required String key, required Map<String, String> options}) async =>
      _store[key];

  @override
  Future<Map<String, String>> readAll({required Map<String, String> options}) async =>
      Map.of(_store);

  @override
  Future<void> write({
    required String key,
    required String value,
    required Map<String, String> options,
  }) async =>
      _store[key] = value;
}

/// Scripted adapter: serves 401 for stale tokens, 200 for the fresh one,
/// and handles /auth/refresh according to the scenario.
class _ScriptedAdapter implements HttpClientAdapter {
  _ScriptedAdapter({required this.refreshSucceeds});

  final bool refreshSucceeds;
  int refreshCalls = 0;
  int dataCalls = 0;

  static const staleAccess = 'stale-access';
  static const freshAccess = 'fresh-access';
  static const staleRefresh = 'stale-refresh-token-12345678901234567890';
  static const freshRefresh = 'fresh-refresh-token-12345678901234567890';

  @override
  void close({bool force = false}) {}

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<List<int>>? requestStream,
    Future<void>? cancelFuture,
  ) async {
    if (options.path == '/auth/refresh') {
      refreshCalls++;
      if (!refreshSucceeds) {
        return ResponseBody.fromString(
          '{"success":false,"error":{"code":"UNAUTHORIZED","message_en":"Invalid refresh.","message_ar":"جلسة غير صالحة.","status":401}}',
          401,
          headers: {'content-type': ['application/json']},
        );
      }
      return ResponseBody.fromString(
        '{"success":true,"data":{"accessToken":"$freshAccess","refreshToken":"$freshRefresh","expiresIn":900}}',
        200,
        headers: {'content-type': ['application/json']},
      );
    }

    dataCalls++;
    final auth = options.headers['Authorization'];
    if (auth == 'Bearer $freshAccess') {
      return ResponseBody.fromString(
        '{"success":true,"data":{"ok":true}}',
        200,
        headers: {'content-type': ['application/json']},
      );
    }
    return ResponseBody.fromString(
      '{"success":false,"error":{"code":"UNAUTHORIZED","message_en":"Unauthorized.","message_ar":"غير مصرح.","status":401}}',
      401,
      headers: {'content-type': ['application/json']},
    );
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late TokenStorage tokens;
  late _ScriptedAdapter adapter;
  late Dio dio;
  var expired = 0;

  Future<void> setUpScenario({required bool refreshSucceeds}) async {
    FlutterSecureStoragePlatform.instance = _MemorySecureStorage();
    tokens = TokenStorage(const FlutterSecureStorage());
    await tokens.save(
      accessToken: _ScriptedAdapter.staleAccess,
      refreshToken: _ScriptedAdapter.staleRefresh,
    );

    adapter = _ScriptedAdapter(refreshSucceeds: refreshSucceeds);
    expired = 0;
    final options = BaseOptions(baseUrl: 'http://test.local');
    final refreshDio = Dio(options)..httpClientAdapter = adapter;
    dio = Dio(options)..httpClientAdapter = adapter;
    dio.interceptors.add(
      AuthInterceptor(
        tokens: tokens,
        refreshDio: refreshDio,
        onSessionExpired: () => expired++,
      ),
    );
  }

  test('401 → single refresh → rotated pair persisted → original retried', () async {
    await setUpScenario(refreshSucceeds: true);

    final response = await dio.get<dynamic>('/cart');

    expect(response.statusCode, 200);
    expect(adapter.refreshCalls, 1);
    expect(tokens.accessToken, _ScriptedAdapter.freshAccess);
    expect(tokens.refreshToken, _ScriptedAdapter.freshRefresh);
    expect(expired, 0);
  });

  test('concurrent 401s share one refresh (queued single-flight)', () async {
    await setUpScenario(refreshSucceeds: true);

    final results = await Future.wait([
      dio.get<dynamic>('/cart'),
      dio.get<dynamic>('/wishlist'),
      dio.get<dynamic>('/orders'),
    ]);

    expect(results.every((r) => r.statusCode == 200), isTrue);
    expect(adapter.refreshCalls, 1, reason: 'rotation must be single-flight');
    expect(expired, 0);
  });

  test('refresh failure → tokens cleared + session-expired fired once', () async {
    await setUpScenario(refreshSucceeds: false);

    await expectLater(
      dio.get<dynamic>('/cart'),
      throwsA(
        isA<DioException>().having(
          (e) => e.error,
          'error',
          isA<ApiException>().having((x) => x.isSessionExpired, 'isSessionExpired', isTrue),
        ),
      ),
    );
    expect(tokens.accessToken, isNull);
    expect(tokens.refreshToken, isNull);
    expect(expired, 1);
  });

  test('public requests carry no bearer and never refresh', () async {
    await setUpScenario(refreshSucceeds: true);

    // /products with the public flag: adapter returns 401 for non-fresh
    // tokens, so a public 401 should surface directly without rotation.
    await expectLater(
      dio.get<dynamic>(
        '/products',
        options: Options(extra: {kPublicRequest: true}),
      ),
      throwsA(isA<DioException>()),
    );
    expect(adapter.refreshCalls, 0);
    expect(tokens.accessToken, _ScriptedAdapter.staleAccess, reason: 'untouched');
  });
}
