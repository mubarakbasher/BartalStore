import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../features/address/presentation/add_address_screen.dart';
import '../features/auth/application/auth_controller.dart';
import '../features/auth/data/auth_api.dart';
import '../features/auth/presentation/forgot_password_screen.dart';
import '../features/auth/presentation/login_screen.dart';
import '../features/auth/presentation/onboarding_screen.dart';
import '../features/auth/presentation/otp_screen.dart';
import '../features/auth/presentation/reset_password_screen.dart';
import '../features/auth/presentation/signup_screen.dart';
import '../features/auth/presentation/splash_screen.dart';
import '../features/auth/presentation/welcome_screen.dart';
import '../features/cart/presentation/cart_screen.dart';
import '../features/catalog/presentation/categories_screen.dart';
import '../features/catalog/presentation/category_products_screen.dart';
import '../features/catalog/presentation/search_screen.dart';
import '../features/checkout/presentation/checkout_address_screen.dart';
import '../features/checkout/presentation/checkout_bank_screen.dart';
import '../features/checkout/presentation/checkout_payment_screen.dart';
import '../features/checkout/presentation/checkout_review_screen.dart';
import '../features/checkout/presentation/confirm_screen.dart';
import '../features/home/presentation/home_screen.dart';
import '../features/orders/presentation/order_detail_screen.dart';
import '../features/orders/presentation/orders_screen.dart';
import '../features/orders/presentation/receipt_submitted_screen.dart';
import '../features/orders/presentation/tracking_screen.dart';
import '../features/orders/presentation/upload_receipt_screen.dart';
import '../features/product/presentation/product_detail_screen.dart';
import '../features/product/presentation/product_reviews_screen.dart';
import '../features/profile/presentation/profile_screen.dart';
import '../features/reviews/presentation/write_review_screen.dart';
import '../features/settings/application/settings_controller.dart';
import '../features/wishlist/presentation/wishlist_screen.dart';
import 'tab_shell.dart';

/// Routes that require an authenticated session. Guests are sent to
/// /welcome with `from` so the flow can resume after login.
const _protectedPrefixes = [
  '/wishlist',
  '/orders',
  '/profile',
  '/checkout',
  '/order-confirm',
  '/addresses',
  '/review',
];

/// Routes an authenticated user shouldn't see.
const _guestOnlyPaths = ['/welcome', '/login', '/signup'];

final appRouterProvider = Provider<GoRouter>((ref) {
  final refresh = ValueNotifier(0);
  ref.onDispose(refresh.dispose);
  // Re-run redirects whenever the session or onboarding flag changes.
  ref.listen(authControllerProvider, (_, _) => refresh.value++);
  ref.listen(
    settingsControllerProvider.select((s) => s.onboardingSeen),
    (_, _) => refresh.value++,
  );

  return GoRouter(
    initialLocation: '/splash',
    refreshListenable: refresh,
    debugLogDiagnostics: kDebugMode,
    redirect: (context, state) {
      final auth = ref.read(authControllerProvider);
      final settings = ref.read(settingsControllerProvider);
      final location = state.matchedLocation;

      // Hold on splash until the session bootstrap resolves.
      if (auth.isLoading || !auth.hasValue) {
        return location == '/splash' ? null : '/splash';
      }
      final authed = auth.valueOrNull is Authenticated;

      if (location == '/splash') {
        if (!settings.onboardingSeen) return '/onboarding';
        return authed ? '/home' : '/welcome';
      }
      if (location == '/onboarding' && settings.onboardingSeen) {
        return authed ? '/home' : '/welcome';
      }

      final isProtected = _protectedPrefixes.any(location.startsWith);
      if (!authed && isProtected) {
        return Uri(path: '/welcome', queryParameters: {'from': location}).toString();
      }
      if (authed && _guestOnlyPaths.contains(location)) {
        // Continue the interrupted deep link when present.
        final from = state.uri.queryParameters['from'];
        return (from != null && from.isNotEmpty) ? from : '/home';
      }
      return null;
    },
    routes: [
      GoRoute(path: '/splash', builder: (_, _) => const SplashScreen()),
      GoRoute(path: '/onboarding', builder: (_, _) => const OnboardingScreen()),
      GoRoute(
        path: '/welcome',
        builder: (_, state) => WelcomeScreen(from: state.uri.queryParameters['from']),
      ),
      GoRoute(
        path: '/login',
        builder: (_, state) => LoginScreen(from: state.uri.queryParameters['from']),
      ),
      GoRoute(
        path: '/signup',
        builder: (_, state) => SignupScreen(from: state.uri.queryParameters['from']),
      ),
      GoRoute(
        path: '/otp',
        builder: (_, state) {
          final params = state.uri.queryParameters;
          return OtpScreen(
            phone: params['phone'] ?? '',
            purpose: switch (params['purpose']) {
              'login' => OtpPurpose.login,
              'reset' => OtpPurpose.passwordReset,
              _ => OtpPurpose.register,
            },
            from: params['from'],
          );
        },
      ),
      GoRoute(path: '/forgot-password', builder: (_, _) => const ForgotPasswordScreen()),
      GoRoute(
        path: '/reset-password',
        builder: (_, state) {
          final params = state.uri.queryParameters;
          return ResetPasswordScreen(
            phone: params['phone'] ?? '',
            code: params['code'] ?? '',
          );
        },
      ),

      // 5-branch tab shell (V1TabBar).
      StatefulShellRoute.indexedStack(
        builder: (_, _, shell) => TabShell(navigationShell: shell),
        branches: [
          StatefulShellBranch(routes: [
            GoRoute(path: '/home', builder: (_, _) => const HomeScreen()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/categories',
              builder: (_, _) => const CategoriesScreen(),
              routes: [
                GoRoute(
                  path: ':slug',
                  builder: (_, state) =>
                      CategoryProductsScreen(slug: state.pathParameters['slug']!),
                ),
              ],
            ),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: '/cart', builder: (_, _) => const CartScreen()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: '/orders', builder: (_, _) => const OrdersScreen()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: '/profile', builder: (_, _) => const ProfileScreen()),
          ]),
        ],
      ),

      // Full-screen routes that cover the tab bar (they carry their own
      // sticky bars per the design).
      GoRoute(
        path: '/product/:idOrSlug',
        builder: (_, state) =>
            ProductDetailScreen(idOrSlug: state.pathParameters['idOrSlug']!),
        routes: [
          GoRoute(
            path: 'reviews',
            builder: (_, state) =>
                ProductReviewsScreen(productId: state.pathParameters['idOrSlug']!),
          ),
        ],
      ),
      GoRoute(
        path: '/search',
        builder: (_, state) => SearchScreen(initialQuery: state.uri.queryParameters['q']),
      ),
      GoRoute(path: '/wishlist', builder: (_, _) => const WishlistScreen()),

      // Checkout flow (each step carries the stepper chrome).
      GoRoute(path: '/checkout/address', builder: (_, _) => const CheckoutAddressScreen()),
      GoRoute(path: '/checkout/payment', builder: (_, _) => const CheckoutPaymentScreen()),
      GoRoute(path: '/checkout/bank', builder: (_, _) => const CheckoutBankScreen()),
      GoRoute(path: '/checkout/review', builder: (_, _) => const CheckoutReviewScreen()),
      GoRoute(
        path: '/order-confirm/:id',
        builder: (_, state) => ConfirmScreen(
          orderId: state.pathParameters['id']!,
          bankId: state.uri.queryParameters['bank'] ?? 'faisal',
        ),
      ),
      GoRoute(path: '/addresses/new', builder: (_, _) => const AddAddressScreen()),

      // Order detail + the receipt / tracking flow (Slice 4).
      GoRoute(
        path: '/orders/:id',
        builder: (_, state) => OrderDetailScreen(orderId: state.pathParameters['id']!),
        routes: [
          GoRoute(
            path: 'receipt',
            builder: (_, state) => UploadReceiptScreen(orderId: state.pathParameters['id']!),
            routes: [
              GoRoute(
                path: 'done',
                builder: (_, state) => ReceiptSubmittedScreen(orderId: state.pathParameters['id']!),
              ),
            ],
          ),
          GoRoute(
            path: 'track',
            builder: (_, state) => TrackingScreen(orderId: state.pathParameters['id']!),
          ),
        ],
      ),

      // Verified-purchase review authoring (auth-only — see _protectedPrefixes).
      GoRoute(
        path: '/review/:productId',
        builder: (_, state) => WriteReviewScreen(productId: state.pathParameters['productId']!),
      ),
    ],
  );
});
