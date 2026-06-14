import 'package:bartal_mobile/app.dart';
import 'package:bartal_mobile/core/providers.dart';
import 'package:bartal_mobile/core/storage/app_prefs.dart';
import 'package:bartal_mobile/core/storage/token_storage.dart';
import 'package:bartal_mobile/features/home/presentation/home_screen.dart';
import 'package:bartal_mobile/features/product/presentation/product_detail_screen.dart';
import 'package:bartal_mobile/widgets/product_card.dart';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_secure_storage_platform_interface/flutter_secure_storage_platform_interface.dart'
    show FlutterSecureStoragePlatform;
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Hermetic full-app smoke: boots [BartalApp] against a scripted API (no
/// backend), verifies the authenticated cold-start lands on home with real
/// product cards, and that tapping one navigates to the product detail screen.
/// Exercises the bootstrap → router → API client → home/PDP path end to end.
void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('cold-start (authed) → home renders products → tap → PDP', (tester) async {
    SharedPreferences.setMockInitialValues({'bartal_onboarding_seen': true});
    final prefs = await AppPrefs.load();

    FlutterSecureStoragePlatform.instance = _MemorySecureStorage();
    final tokens = TokenStorage(const FlutterSecureStorage());
    await tokens.save(accessToken: 'test-access', refreshToken: 'test-refresh');

    final dio = Dio(BaseOptions(baseUrl: 'http://test.local/api'))
      ..httpClientAdapter = _ScriptedApiAdapter();

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          appPrefsProvider.overrideWithValue(prefs),
          tokenStorageProvider.overrideWithValue(tokens),
          apiClientProvider.overrideWithValue(dio),
        ],
        child: const BartalApp(),
      ),
    );
    // Pump until home data resolves (cards appear). We can't use
    // pumpAndSettle(): the loading skeleton's shimmer animates forever.
    await _pumpUntil(tester, () => find.byType(ProductGridCard).evaluate().isNotEmpty);

    // Cold-start resolved past splash to the home tab, with real product cards.
    expect(find.byType(HomeScreen), findsOneWidget);
    expect(find.byType(ProductGridCard), findsWidgets);

    // Browse: tap the first new-arrivals card → product detail.
    await tester.tap(find.byType(ProductGridCard).first);
    await _pumpUntil(tester, () => find.byType(ProductDetailScreen).evaluate().isNotEmpty);

    expect(find.byType(ProductDetailScreen), findsOneWidget);
    // Home is covered (offstage) by the pushed PDP.
    expect(find.byType(HomeScreen), findsNothing);
  });
}

/// Pump frames until [condition] holds (max ~6s). Used in place of
/// pumpAndSettle(), which never returns while the shimmer skeleton animates.
Future<void> _pumpUntil(WidgetTester tester, bool Function() condition) async {
  for (var i = 0; i < 60; i++) {
    if (condition()) return;
    await tester.pump(const Duration(milliseconds: 100));
  }
}

/// In-memory secure storage so [TokenStorage] runs without device state.
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

/// Serves the customer endpoints on the cold-start → browse path, all as
/// success envelopes. Matches on the relative request path.
class _ScriptedApiAdapter implements HttpClientAdapter {
  @override
  void close({bool force = false}) {}

  static const _product =
      '{"id":"prod_1","slug":"test-product","name_ar":"منتج تجريبي","name_en":"Test Product",'
      '"description_ar":"وصف تجريبي","description_en":"A test product.","price":"15000",'
      '"compare_price":null,"stock":10,"low_stock_threshold":5,"is_featured":true,"sku":"SKU-1",'
      '"images":[{"url":"https://example.com/p.webp","alt_ar":"","alt_en":""}],'
      '"category":{"id":"cat_1","slug":"electronics","name_ar":"إلكترونيات","name_en":"Electronics"}}';

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<List<int>>? requestStream,
    Future<void>? cancelFuture,
  ) async {
    final path = options.path;
    final body = switch (path) {
      '/users/me' =>
        '{"success":true,"data":{"id":"u1","phone":"+249912000001","name":"Test User",'
            '"email":null,"role":"CUSTOMER","language":"AR","is_verified":true,"loyalty_points":0}}',
      '/categories' =>
        '{"success":true,"data":[{"id":"cat_1","slug":"electronics","name_ar":"إلكترونيات",'
            '"name_en":"Electronics","image_url":null,"children":[]}]}',
      '/products' =>
        '{"success":true,"data":[$_product],"meta":{"page":1,"limit":20,"total":1,"totalPages":1}}',
      '/cart' =>
        '{"success":true,"data":{"items":[],"total_quantity":0,"subtotal":0,'
            '"delivery_preview":null,"total":0,"requires_address":true}}',
      _ when path.startsWith('/products/') && path.endsWith('/reviews') =>
        '{"success":true,"data":{"items":[],"meta":{"page":1,"limit":10,"total":0,"totalPages":0},'
            '"summary":{"average":0,"count":0,"breakdown":{}}}}',
      _ when path.startsWith('/products/') => '{"success":true,"data":$_product}',
      _ => '{"success":true,"data":{"ok":true}}',
    };
    return ResponseBody.fromString(
      body,
      200,
      headers: {
        'content-type': ['application/json; charset=utf-8'],
      },
    );
  }
}
