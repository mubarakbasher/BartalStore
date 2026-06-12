// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'l10n.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class L10nEn extends L10n {
  L10nEn([String locale = 'en']) : super(locale);

  @override
  String get appName => 'Bartal';

  @override
  String get tagline => 'Your gateway to shopping in Sudan';

  @override
  String get commonYes => 'Yes';

  @override
  String get commonNo => 'No';

  @override
  String get commonOk => 'OK';

  @override
  String get commonCancel => 'Cancel';

  @override
  String get commonConfirm => 'Confirm';

  @override
  String get commonSave => 'Save';

  @override
  String get commonDelete => 'Delete';

  @override
  String get commonEdit => 'Edit';

  @override
  String get commonBack => 'Back';

  @override
  String get commonNext => 'Next';

  @override
  String get commonSkip => 'Skip';

  @override
  String get commonRetry => 'Retry';

  @override
  String get commonLoading => 'Loading…';

  @override
  String get commonSearch => 'Search';

  @override
  String get commonOptional => 'Optional';

  @override
  String get commonRequired => 'Required';

  @override
  String get commonSeeAll => 'See all';

  @override
  String get navHome => 'Home';

  @override
  String get navShop => 'Shop';

  @override
  String get navCategories => 'Categories';

  @override
  String get navCart => 'Cart';

  @override
  String get navOrders => 'Orders';

  @override
  String get navProfile => 'Profile';

  @override
  String get navSettings => 'Settings';

  @override
  String get navWishlist => 'Wishlist';

  @override
  String get navNotifications => 'Notifications';

  @override
  String get authLogin => 'Log in';

  @override
  String get authLogout => 'Log out';

  @override
  String get authRegister => 'Create account';

  @override
  String get authPhone => 'Phone number';

  @override
  String get authPhonePlaceholder => '+249 XXX XXX XXX';

  @override
  String get authPassword => 'Password';

  @override
  String get authConfirmPassword => 'Confirm password';

  @override
  String get authName => 'Full name';

  @override
  String get authEmail => 'Email (optional)';

  @override
  String get authOtpTitle => 'Enter the code';

  @override
  String authOtpSubtitle(String phone) {
    return 'We sent a 6-digit code to $phone';
  }

  @override
  String get authOtpResend => 'Resend code';

  @override
  String authOtpResendIn(String seconds) {
    return 'You can resend in ${seconds}s';
  }

  @override
  String get authForgotPassword => 'Forgot password?';

  @override
  String get authResetPassword => 'Reset password';

  @override
  String get authInvalidPhone => 'Enter a valid Sudanese phone (+249)';

  @override
  String get authPasswordTooShort => 'Password must be at least 8 characters';

  @override
  String get authPasswordsMismatch => 'Passwords don\'t match';

  @override
  String get productsAddToCart => 'Add to cart';

  @override
  String get productsBuyNow => 'Buy now';

  @override
  String get productsInStock => 'In stock';

  @override
  String get productsOutOfStock => 'Out of stock';

  @override
  String productsLowStock(int count) {
    return 'Only $count left';
  }

  @override
  String get productsReviews => 'reviews';

  @override
  String get productsReviewsTitle => 'Reviews';

  @override
  String get productsRelated => 'You may also like';

  @override
  String get productsShare => 'Share';

  @override
  String get productsShareWhatsapp => 'Share on WhatsApp';

  @override
  String get productsNoResults => 'No products match your search.';

  @override
  String get productsDescription => 'Description';

  @override
  String get productsSpecs => 'Specifications';

  @override
  String get productsFeatured => 'Featured';

  @override
  String get productsNewArrivals => 'New arrivals';

  @override
  String get productsSale => 'Sale';

  @override
  String get productsColor => 'Color';

  @override
  String get productsVerifiedPurchase => 'Verified purchase';

  @override
  String get searchPlaceholder => 'Search anything';

  @override
  String get searchResults => 'Search results';

  @override
  String searchResultsCount(String count) {
    return '$count results';
  }

  @override
  String get searchFilters => 'Filters';

  @override
  String get searchSort => 'Sort';

  @override
  String get searchSortNewest => 'Newest';

  @override
  String get searchSortPriceAsc => 'Price: low to high';

  @override
  String get searchSortPriceDesc => 'Price: high to low';

  @override
  String get searchSortPopular => 'Most popular';

  @override
  String get searchFilterCategory => 'Category';

  @override
  String get searchFilterPrice => 'Price range';

  @override
  String get searchFilterInStock => 'In stock only';

  @override
  String get searchApplyFilters => 'Apply';

  @override
  String get searchClearFilters => 'Clear all';

  @override
  String get cartTitle => 'My cart';

  @override
  String get cartEmpty => 'Your cart is empty.';

  @override
  String get cartSubtotal => 'Subtotal';

  @override
  String get cartDeliveryFee => 'Delivery fee';

  @override
  String get cartDiscount => 'Discount';

  @override
  String get cartTotal => 'Total';

  @override
  String get cartCheckout => 'Checkout';

  @override
  String get cartPlaceOrder => 'Place order';

  @override
  String get cartContinueShopping => 'Continue shopping';

  @override
  String get deliveryTo => 'Deliver to';

  @override
  String get deliveryFreeDelivery => 'Free delivery';

  @override
  String get deliveryZoneA => 'Central Khartoum';

  @override
  String get deliveryZoneB => 'Omdurman';

  @override
  String get deliveryZoneC => 'Bahri (North)';

  @override
  String get deliveryZoneD => 'East Khartoum';

  @override
  String deliveryEtaDays(String min, String max) {
    return '$min-$max days';
  }

  @override
  String get wishlistTitle => 'Wishlist';

  @override
  String get wishlistEmpty => 'Nothing in your wishlist yet.';

  @override
  String get wishlistPriceDropped => 'Price dropped';

  @override
  String get emptyCartTitle => 'Your cart is empty';

  @override
  String get emptyCartBody =>
      'Discover great products — fragrance, electronics, fashion and more.';

  @override
  String get emptyCartCta => 'Browse products';

  @override
  String get emptyOrdersTitle => 'No orders yet';

  @override
  String get emptyOrdersBody =>
      'Your orders will appear here once you\'ve placed your first one.';

  @override
  String get emptyOrdersCta => 'Start shopping';

  @override
  String get emptySearchTitle => 'No results found';

  @override
  String get emptySearchBody =>
      'Try different keywords or browse our categories.';

  @override
  String get emptySearchCta => 'Browse categories';

  @override
  String get emptyAddressesTitle => 'No saved addresses';

  @override
  String get emptyAddressesBody =>
      'Add an address to speed up checkout next time.';

  @override
  String get emptyAddressesCta => 'Add address';

  @override
  String get errorServerTag => 'Server error';

  @override
  String get errorServerTitle => 'Something went wrong';

  @override
  String get errorServerBody =>
      'We\'re working on a fix. Try again in a moment.';

  @override
  String get errorOfflineTag => 'Offline';

  @override
  String get errorOfflineTitle => 'No internet connection';

  @override
  String get errorOfflineBody =>
      'Check your Wi-Fi or mobile data and try again.';

  @override
  String get errorOfflineBanner => 'You are offline';

  @override
  String get errorTryAgain => 'Try again';

  @override
  String get errorsNetwork => 'No internet connection. Please try again.';

  @override
  String get errorsGeneric => 'Something went wrong. Please try again.';

  @override
  String get errorsUnauthorized => 'Please log in to continue.';

  @override
  String get errorsNotFound => 'Not found.';

  @override
  String get errorsValidation => 'Please check the highlighted fields.';

  @override
  String get errorsRateLimited => 'Too many attempts. Please wait a moment.';
}
