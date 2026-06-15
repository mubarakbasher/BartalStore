import 'package:bartal_mobile/app.dart';
import 'package:bartal_mobile/core/connectivity/connectivity_provider.dart';
import 'package:bartal_mobile/core/providers.dart';
import 'package:bartal_mobile/core/storage/app_prefs.dart';
import 'package:bartal_mobile/core/storage/token_storage.dart';
import 'package:dio/dio.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_secure_storage_platform_interface/flutter_secure_storage_platform_interface.dart'
    show FlutterSecureStoragePlatform;
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Shared hermetic test harness — extracted from the proven pattern in
/// `integration_test/app_flow_test.dart` so the critical-flow widget tests
/// (login / add-to-cart / place-order) boot the real [BartalApp] against a
/// scripted API with no backend and no Firebase.

/// Pump frames until [condition] holds (max ~8s). Stand-in for `pumpAndSettle`,
/// which never returns while the loading-skeleton shimmer animates.
Future<void> pumpUntil(
  WidgetTester tester,
  bool Function() condition, {
  int maxFrames = 80,
}) async {
  for (var i = 0; i < maxFrames; i++) {
    if (condition()) return;
    await tester.pump(const Duration(milliseconds: 100));
  }
}

/// A tall, generously-wide surface for the flow tests. It's wider than a real
/// device on purpose: `flutter test` doesn't load the Cairo/Poppins fonts, so
/// text is measured with a fixed-width fallback that inflates Arabic strings —
/// a narrow surface then trips spurious horizontal-overflow errors on rows that
/// fit fine on-device. The extra width absorbs that artifact so the tests
/// assert behaviour, not pixel layout. Reset at teardown.
void usePhoneSurface(WidgetTester tester) {
  tester.view.physicalSize = const Size(1080, 2400);
  tester.view.devicePixelRatio = 1.0;
  addTearDown(() {
    tester.view.resetPhysicalSize();
    tester.view.resetDevicePixelRatio();
  });
}

/// Seeded prefs with the onboarding flag set, so the router skips onboarding.
Future<AppPrefs> seededPrefs({
  bool onboarded = true,
  Map<String, Object> extra = const {},
}) async {
  SharedPreferences.setMockInitialValues({
    'bartal_onboarding_seen': onboarded,
    ...extra,
  });
  return AppPrefs.load();
}

TokenStorage _freshTokenStorage() {
  FlutterSecureStoragePlatform.instance = MemorySecureStorage();
  return TokenStorage(const FlutterSecureStorage());
}

/// In-memory token storage pre-seeded with a session (authenticated boot).
Future<TokenStorage> authedTokens() async {
  final tokens = _freshTokenStorage();
  await tokens.save(accessToken: 'test-access', refreshToken: 'test-refresh');
  return tokens;
}

/// In-memory token storage with no session (guest boot).
Future<TokenStorage> guestTokens() async => _freshTokenStorage();

/// A [Dio] wired to a scripted adapter. The base URL is irrelevant — the
/// adapter matches on the relative request path.
Dio scriptedDio(HttpClientAdapter adapter) =>
    Dio(BaseOptions(baseUrl: 'http://test.local/api'))..httpClientAdapter = adapter;

/// Standard overrides for a hermetic boot: seeded prefs, in-memory tokens, a
/// scripted Dio, and a deterministic online connectivity (the real provider
/// hits a `connectivity_plus` platform channel that doesn't exist under
/// `flutter test`).
List<Override> harnessOverrides({
  required AppPrefs prefs,
  required TokenStorage tokens,
  required Dio dio,
}) =>
    [
      appPrefsProvider.overrideWithValue(prefs),
      tokenStorageProvider.overrideWithValue(tokens),
      apiClientProvider.overrideWithValue(dio),
      connectivityProvider.overrideWith((ref) => Stream.value(true)),
    ];

/// Boots [BartalApp] under a fresh [ProviderContainer] (disposed at teardown)
/// and returns the container so a test can read or seed providers directly
/// (e.g. `container.read(appRouterProvider).go(...)`).
Future<ProviderContainer> pumpBartalApp(
  WidgetTester tester, {
  required List<Override> overrides,
}) async {
  usePhoneSurface(tester);
  final container = ProviderContainer(overrides: overrides);
  addTearDown(container.dispose);
  await tester.pumpWidget(
    UncontrolledProviderScope(
      container: container,
      child: const BartalApp(),
    ),
  );
  return container;
}

/// In-memory secure storage so [TokenStorage] runs without device state.
class MemorySecureStorage extends FlutterSecureStoragePlatform {
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

/// A stateful scripted API: serves the customer endpoints the critical flows
/// touch (auth, catalog, cart, addresses, delivery, orders) as success
/// envelopes, and persists cart/order writes across requests within a test so
/// add-to-cart and place-order behave end to end. No backend, no Firebase.
///
/// Seed [initialCartQty] > 0 to boot with a non-empty cart (place-order needs
/// one); the default 0 starts empty (add-to-cart drives it 0 → 1).
class StatefulScriptedAdapter implements HttpClientAdapter {
  StatefulScriptedAdapter({int initialCartQty = 0}) : _cartQty = initialCartQty;

  int _cartQty;

  @override
  void close({bool force = false}) {}

  static const _productJson =
      '{"id":"prod_1","slug":"test-product","name_ar":"منتج تجريبي","name_en":"Test Product",'
      '"description_ar":"وصف تجريبي","description_en":"A test product.","price":"15000",'
      '"compare_price":null,"stock":10,"low_stock_threshold":5,"is_featured":true,"sku":"SKU-1",'
      '"images":[{"url":"https://example.com/p.webp","alt_ar":"","alt_en":""}],'
      '"category":{"id":"cat_1","slug":"electronics","name_ar":"إلكترونيات","name_en":"Electronics"}}';

  static const _userJson =
      '{"id":"u1","phone":"+249912000001","name":"Test User","email":null,"role":"CUSTOMER",'
      '"language":"AR","is_verified":true,"loyalty_points":0}';

  static const _addressJson =
      '{"id":"addr_1","label":"Home","full_name":"Test User","phone":"+249912000001",'
      '"secondary_phone":null,"district":"الخرطوم","street":"شارع 1","landmark":"بجوار المسجد",'
      '"delivery_notes":null,"zone":"ZONE_A","is_default":true}';

  static const _orderJson =
      '{"id":"order_1","order_number":"BRT-2026-09999","status":"AWAITING_PAYMENT",'
      '"payment_method":"BANK_TRANSFER","payment_status":"UNPAID","subtotal":15000,'
      '"delivery_fee":2000,"discount":0,"total":17000,"receipt_url":null,"cancellation_reason":null,'
      '"items":[{"product_id":"prod_1","product_name_ar":"منتج تجريبي","product_name_en":"Test Product",'
      '"product_image":null,"quantity":1,"unit_price":15000,"total_price":15000}],'
      '"status_history":[{"status":"AWAITING_PAYMENT","note":null,"created_at":"2026-06-15T10:00:00.000Z"}],'
      '"address":null,"created_at":"2026-06-15T10:00:00.000Z"}';

  String _cartView() {
    final qty = _cartQty;
    final items = qty > 0
        ? '[{"product_id":"prod_1","slug":"test-product","name_ar":"منتج تجريبي",'
            '"name_en":"Test Product","unit_price":15000,"image_url":null,"quantity":$qty,'
            '"stock":10,"is_active":true}]'
        : '[]';
    final subtotal = qty * 15000;
    return '{"success":true,"data":{"items":$items,"total_quantity":$qty,"subtotal":$subtotal,'
        '"delivery_preview":null,"total":$subtotal,"requires_address":true}}';
  }

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<List<int>>? requestStream,
    Future<void>? cancelFuture,
  ) async {
    final body = _route(options.method.toUpperCase(), options.path);
    return ResponseBody.fromString(
      body,
      200,
      headers: {
        'content-type': ['application/json; charset=utf-8'],
      },
    );
  }

  String _route(String method, String path) {
    // Cart (stateful)
    if (path == '/cart' && method == 'GET') return _cartView();
    if (path == '/cart' && method == 'DELETE') {
      _cartQty = 0;
      return _cartView();
    }
    if (path == '/cart/items' && method == 'POST') {
      _cartQty += 1;
      return _cartView();
    }

    // Orders (stateful — POST clears the cart, like the real server)
    if (path == '/orders' && method == 'POST') {
      _cartQty = 0;
      return '{"success":true,"data":$_orderJson}';
    }
    if (path.startsWith('/orders/') && method == 'GET') {
      return '{"success":true,"data":$_orderJson}';
    }

    // Auth + user
    if (path == '/auth/login' && method == 'POST') {
      return '{"success":true,"data":{"user":$_userJson,'
          '"accessToken":"test-access","refreshToken":"test-refresh"}}';
    }
    if (path == '/users/me' && method == 'GET') return '{"success":true,"data":$_userJson}';
    if (path == '/users/me/addresses' && method == 'GET') {
      return '{"success":true,"data":[$_addressJson]}';
    }

    // Catalog (public)
    if (path == '/categories') {
      return '{"success":true,"data":[{"id":"cat_1","slug":"electronics",'
          '"name_ar":"إلكترونيات","name_en":"Electronics","image_url":null,"children":[]}]}';
    }
    if (path == '/products') {
      return '{"success":true,"data":[$_productJson],'
          '"meta":{"page":1,"limit":20,"total":1,"totalPages":1}}';
    }
    if (path.startsWith('/products/') && path.endsWith('/reviews')) {
      return '{"success":true,"data":{"items":[],"meta":{"page":1,"limit":10,"total":0,'
          '"totalPages":0},"summary":{"average":0,"count":0,"breakdown":{}}}}';
    }
    if (path.startsWith('/products/')) return '{"success":true,"data":$_productJson}';

    // Wishlist (auth) — empty for the test user
    if (path == '/wishlist') return '{"success":true,"data":[]}';

    // Delivery (public)
    if (path == '/delivery/fee') {
      return '{"success":true,"data":{"fee_sdg":2000,"free_delivery":false,'
          '"threshold_sdg":null,"estimated_days_min":0,"estimated_days_max":1}}';
    }
    if (path == '/delivery/zones') return '{"success":true,"data":[]}';

    // Anything else (e.g. the best-effort fcm-token PUT) — benign success.
    return '{"success":true,"data":{"ok":true}}';
  }
}
