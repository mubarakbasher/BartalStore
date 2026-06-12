/// API base URL. Android emulator reaches the host machine at 10.0.2.2;
/// override per device with `--dart-define=API_BASE_URL=...`
/// (or run `adb reverse tcp:3001 tcp:3001` and use localhost).
const apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://10.0.2.2:3001',
);

/// Route constants for the customer API surface.
abstract final class Endpoints {
  // Auth (all @Public)
  static const register = '/auth/register';
  static const verifyOtp = '/auth/verify-otp';
  static const resendOtp = '/auth/resend-otp';
  static const login = '/auth/login';
  static const refresh = '/auth/refresh';
  static const logout = '/auth/logout';
  static const forgotPassword = '/auth/forgot-password';
  static const resetPassword = '/auth/reset-password';

  // Users
  static const me = '/users/me';
  static const changePassword = '/users/me/change-password';
  static const fcmToken = '/users/me/fcm-token';
  static const addresses = '/users/me/addresses';

  // Catalog (public)
  static const products = '/products';
  static const productsSearch = '/products/search';
  static String product(String idOrSlug) => '/products/$idOrSlug';
  static String productReviews(String id) => '/products/$id/reviews';
  static const categories = '/categories';
  static String category(String id) => '/categories/$id';
  static String categoryProducts(String id) => '/categories/$id/products';

  // Cart (auth)
  static const cart = '/cart';
  static const cartItems = '/cart/items';
  static String cartItem(String productId) => '/cart/items/$productId';

  // Orders (auth)
  static const orders = '/orders';
  static String order(String id) => '/orders/$id';
  static String orderCancel(String id) => '/orders/$id/cancel';
  static String orderReceipt(String id) => '/orders/$id/receipt';

  // Wishlist (auth)
  static const wishlist = '/wishlist';
  static String wishlistItem(String productId) => '/wishlist/$productId';

  // Delivery (public)
  static const deliveryZones = '/delivery/zones';
  static const deliveryFee = '/delivery/fee';

  // Storage
  static const storageReceipts = '/storage/receipts';
}
