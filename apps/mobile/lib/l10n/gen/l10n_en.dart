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

  @override
  String get commonShow => 'Show';

  @override
  String get commonHide => 'Hide';

  @override
  String get commonOr => 'or';

  @override
  String get commonContinue => 'Continue';

  @override
  String get splashSubtitle => 'Sudan\'s digital souq';

  @override
  String get splashInitializing => 'initializing';

  @override
  String get onboardingSkip => 'Skip';

  @override
  String get onboardingStart => 'Start shopping';

  @override
  String get onboarding1Eyebrow => 'Shop';

  @override
  String get onboarding1Title => 'Everything Sudan sells — in one place.';

  @override
  String get onboarding1Body =>
      'Fragrance, electronics, fashion, home. From trusted sellers across the country.';

  @override
  String get onboarding2Eyebrow => 'Pay';

  @override
  String get onboarding2Title =>
      'Pay by bank transfer or cash. No cards needed.';

  @override
  String get onboarding2Body =>
      'Faroo, Bank of Khartoum, EBS — or cash on delivery. Upload your receipt to confirm.';

  @override
  String get onboarding3Eyebrow => 'Track';

  @override
  String get onboarding3Title =>
      'Delivery to every state. Track your order in real time.';

  @override
  String get onboarding3Body =>
      'Khartoum, Omdurman, Bahri, Port Sudan, Atbara, and more. WhatsApp updates at every step.';

  @override
  String get welcomeBrandTagline => 'Everything you need · Sudan';

  @override
  String get welcomeTitle => 'Your portal for smart shopping.';

  @override
  String get welcomeBody =>
      'Thousands of products, fast delivery across Khartoum, pay via any Sudanese bank.';

  @override
  String get welcomeCreateAccount => 'Create new account';

  @override
  String get welcomeSignIn => 'Sign in';

  @override
  String get welcomeTermsPrefix => 'By continuing you agree to our ';

  @override
  String get welcomeTermsLink => 'Terms & Privacy';

  @override
  String get loginEyebrow => 'Welcome back';

  @override
  String get loginTitle => 'Sign in to bartal.';

  @override
  String get loginWhatsappOtp => 'Get code via WhatsApp';

  @override
  String get loginNoAccount => 'Don\'t have an account? ';

  @override
  String get loginSignUpLink => 'Sign up';

  @override
  String authStepOf(String current, String total) {
    return 'Step $current of $total';
  }

  @override
  String get authSignIn => 'Sign in';

  @override
  String get authNewPassword => 'New password';

  @override
  String get authPhonePrefix => '+249';

  @override
  String get signupTitle => 'Create your account.';

  @override
  String get signupSubtitle => 'We\'ll send a verification code to your phone';

  @override
  String get signupTermsAgree =>
      'I agree to bartal Terms of Service and Privacy Policy.';

  @override
  String get signupSendCode => 'Send verification code';

  @override
  String get signupHaveAccount => 'Have an account? ';

  @override
  String get pwStrengthWeak => 'Weak';

  @override
  String get pwStrengthFair => 'Fair';

  @override
  String get pwStrengthGood => 'Good';

  @override
  String get pwStrengthStrong => 'Strong';

  @override
  String pwStrengthLabel(String value) {
    return 'Password strength: $value';
  }

  @override
  String get pwRuleLength => 'At least 8 characters';

  @override
  String get pwRuleCase => 'Upper and lower case letter';

  @override
  String get pwRuleNumber => 'At least one number';

  @override
  String get pwRuleSymbol => 'Special character (!@#\$)';

  @override
  String get otpHeading => 'Enter verification code.';

  @override
  String otpResendCountdown(String time) {
    return 'You can request a new code in $time';
  }

  @override
  String get otpNotReceived => 'Not received?';

  @override
  String get otpTryWhatsapp => 'Try via WhatsApp';

  @override
  String get otpVerify => 'Verify & continue';

  @override
  String get otpSecureNote => 'Secure code · expires in 5 minutes';

  @override
  String get forgotEyebrow => 'Account recovery';

  @override
  String get forgotTitle => 'Forgot your password?';

  @override
  String get forgotBody =>
      'Enter your phone number and we\'ll send a code to reset your password.';

  @override
  String get forgotChooseMethod => 'Choose delivery method';

  @override
  String get channelWhatsapp => 'WhatsApp';

  @override
  String get channelSms => 'SMS text';

  @override
  String get forgotSendCode => 'Send reset code';

  @override
  String get forgotRemembered => 'Remembered your password? ';

  @override
  String get forgotBackToSignIn => 'Back to sign in';

  @override
  String get resetTitle => 'Create a new password';

  @override
  String get resetBody =>
      'Must differ from any previous password used on this account.';

  @override
  String get resetSave => 'Save password & sign in';

  @override
  String get resetSuccess => 'Password updated. Sign in now.';

  @override
  String homeDeliveryEta(String min, String max) {
    return '· $min-$max days';
  }

  @override
  String pdpReviewsWithCount(String count) {
    return 'Reviews ($count)';
  }

  @override
  String pdpRatingCount(String count) {
    return '($count reviews)';
  }

  @override
  String get pdpWriteReview => 'Write a review';

  @override
  String get pdpNoReviews => 'No reviews yet';

  @override
  String get pdpNoReviewsBody =>
      'Be the first to review this product after it\'s delivered.';

  @override
  String reviewCount(String count) {
    return '$count reviews';
  }

  @override
  String get reviewVerified => 'Verified';

  @override
  String get reviewFilterAll => 'All';

  @override
  String get reviewSortNewest => 'Newest first';

  @override
  String get reviewSortHighest => 'Highest rated';

  @override
  String get reviewSortLowest => 'Lowest rated';

  @override
  String get categoriesSearchHint => 'Search in categories…';

  @override
  String get categoriesSubcategories => 'Subcategories';

  @override
  String categoriesShopName(String name) {
    return 'Shop $name';
  }

  @override
  String get filtersTitle => 'Filters';

  @override
  String get filtersResetCleared => 'Filters cleared';

  @override
  String wishlistSavedCount(String count) {
    return '$count saved items';
  }

  @override
  String get wishlistRemoved => 'Removed from wishlist';

  @override
  String get actionFailed => 'Couldn\'t complete the action. Please try again.';

  @override
  String get commonCopied => 'Copied';

  @override
  String get commonRequired2 => 'This field is required';

  @override
  String get cartItemAdded => 'Added to cart';

  @override
  String get cartViewCart => 'View cart';

  @override
  String get cartOutOfStock => 'Not enough stock available';

  @override
  String get stepAddress => 'Address';

  @override
  String get stepPayment => 'Payment';

  @override
  String get stepReview => 'Review';

  @override
  String get checkoutAddressTitle => 'Delivery address';

  @override
  String get checkoutNoAddresses => 'Add a delivery address to continue';

  @override
  String get checkoutAddNewAddress => 'Add new address';

  @override
  String get checkoutSelected => 'Selected';

  @override
  String get checkoutEdit => 'Edit';

  @override
  String get checkoutDeliveryZone => 'Delivery zone';

  @override
  String get checkoutContinueToPayment => 'Continue to payment';

  @override
  String get paymentMethodTitle => 'Payment method';

  @override
  String get paymentBankTransfer => 'Bank transfer';

  @override
  String get paymentBankSub =>
      'Transfer from any Sudanese bank · Upload receipt after';

  @override
  String get paymentRecommended => 'Recommended';

  @override
  String get paymentCod => 'Cash on delivery';

  @override
  String get paymentCodSub => 'Pay cash when your order is delivered';

  @override
  String get paymentWallet => 'Mobile wallet';

  @override
  String get paymentWalletSub => 'Bankak · Fawry · Zain Cash';

  @override
  String get paymentSoon => 'Soon';

  @override
  String get paymentContinue => 'Continue';

  @override
  String get bankStepTitle => 'Bartal accounts';

  @override
  String get bankChooseTitle => 'Choose the bank you\'ll transfer from';

  @override
  String get bankChooseBody =>
      'We have accounts in several banks for easier local transfer. You\'ll upload the receipt in the next step.';

  @override
  String get bankAccountName => 'Account name';

  @override
  String get bankAccountNumber => 'Account #';

  @override
  String get bankSwift => 'SWIFT';

  @override
  String get bankAmount => 'Amount to transfer';

  @override
  String get bankReference => 'Reference';

  @override
  String get bankImportantNote => 'Important note';

  @override
  String get bankNote1 => 'Use your order number as the transfer reference';

  @override
  String get bankNote2 => 'Verification takes 5–15 min during business hours';

  @override
  String get bankNote3 => 'You\'ll get a message when payment is confirmed';

  @override
  String get bankContinueToReview => 'Continue to review';

  @override
  String get reviewPaymentTitle => 'Payment';

  @override
  String get reviewItemsTitle => 'Items';

  @override
  String reviewQtyEach(String qty, String price) {
    return 'Qty $qty · $price';
  }

  @override
  String get reviewTotalsTitle => 'Totals';

  @override
  String get reviewTerms =>
      'By placing this order, you agree to our Terms and Privacy Policy.';

  @override
  String get reviewPlaceOrder => 'Place order';

  @override
  String get confirmTitle => 'Order placed!';

  @override
  String get confirmOrderNumber => 'Order number';

  @override
  String get confirmBankInstructions => 'Bank transfer instructions';

  @override
  String get confirmAmount => 'Amount';

  @override
  String get confirmUploadTitle => 'Upload receipt';

  @override
  String get confirmUploadSub =>
      'Your receipt will be verified within 24 hours';

  @override
  String get confirmReceiptLater =>
      'You can upload the receipt later from the order page';

  @override
  String get confirmCodTitle => 'Pay on delivery';

  @override
  String get confirmCodBody =>
      'You\'ll pay cash when your order is delivered. We\'ll contact you to confirm the delivery time.';

  @override
  String get confirmViewOrder => 'View order';

  @override
  String get confirmContinueShopping => 'Continue shopping';

  @override
  String get addressNewTitle => 'New address';

  @override
  String get addressLabelTitle => 'Label';

  @override
  String get labelHome => 'Home';

  @override
  String get labelWork => 'Work';

  @override
  String get labelOther => 'Other';

  @override
  String get addressContactTitle => 'Contact';

  @override
  String get addressFullName => 'Full name';

  @override
  String get addressPhone => 'Phone number';

  @override
  String get addressStreetTitle => 'Street address';

  @override
  String get addressDistrict => 'District / street / house #';

  @override
  String get addressDistrictHint => 'e.g. Al-Riyadh, block 32, house 14';

  @override
  String get addressCity => 'City';

  @override
  String get addressLandmark => 'Landmark';

  @override
  String get addressLandmarkHelp => 'Help the driver find your address faster';

  @override
  String get addressLandmarkHint => 'e.g. Next to Al-Nur Mosque';

  @override
  String get addressNotesTitle => 'Notes for driver';

  @override
  String get addressNotesHint => 'Optional — call on arrival, 2nd floor…';

  @override
  String get addressSetDefault => 'Set as default address';

  @override
  String get addressSave => 'Save address';

  @override
  String get addressLandmarkRequired =>
      'Landmark is required (at least 3 characters)';

  @override
  String get addressNameRequired => 'Name is required';

  @override
  String get addressDistrictRequired => 'District is required';

  @override
  String get ordersFilterAll => 'All';

  @override
  String get ordersFilterProcessing => 'Processing';

  @override
  String get ordersFilterShipping => 'Shipping';

  @override
  String get ordersFilterCompleted => 'Completed';

  @override
  String ordersItemCount(String count) {
    return '$count items';
  }

  @override
  String get orderStatusPending => 'Pending';

  @override
  String get orderStatusAwaitingPayment => 'Awaiting payment';

  @override
  String get orderStatusReceiptUploaded => 'Receipt under review';

  @override
  String get orderStatusPaymentConfirmed => 'Payment confirmed';

  @override
  String get orderStatusPaymentRejected => 'Payment rejected';

  @override
  String get orderStatusProcessing => 'Processing';

  @override
  String get orderStatusShipped => 'Shipped';

  @override
  String get orderStatusDelivered => 'Delivered';

  @override
  String get orderStatusCancelled => 'Cancelled';

  @override
  String get orderStatusRefunded => 'Refunded';

  @override
  String get orderDetailTitle => 'Order details';

  @override
  String orderItemsWithCount(String count) {
    return 'Items ($count)';
  }

  @override
  String orderItemQty(String count) {
    return 'Qty: $count';
  }

  @override
  String get orderDeliveryTo => 'Delivery to';

  @override
  String get orderPaymentSummary => 'Payment summary';

  @override
  String orderBankRefLine(String ref) {
    return 'Ref: $ref';
  }

  @override
  String get orderHelpTitle => 'Need help?';

  @override
  String orderHelpWhatsapp(String phone) {
    return 'WhatsApp us: $phone';
  }

  @override
  String get orderContactWhatsapp => 'Contact on WhatsApp';

  @override
  String get orderAwaitingReceiptMessage =>
      'Complete your order by uploading the bank transfer receipt. Confirmation in 5–15 min.';

  @override
  String get orderUnderReviewMessage =>
      'We\'re reviewing your receipt. You\'ll be notified within 5–15 min.';

  @override
  String get orderUploadReceiptCta => 'Upload receipt';

  @override
  String get orderReuploadReceiptCta => 'Re-upload receipt';

  @override
  String get orderTrackCta => 'Track order';

  @override
  String get orderCancelCta => 'Cancel order';

  @override
  String get orderCodNote => 'You\'ll pay cash when your order is delivered.';

  @override
  String get orderRejectedTitle => 'Receipt couldn\'t be verified';

  @override
  String get orderRejectedMessage =>
      'We couldn\'t read the amount or reference number. Please upload a clearer photo.';

  @override
  String get orderRejectedNoteTitle => 'Note from verification team';

  @override
  String get orderCancelDialogTitle => 'Cancel this order?';

  @override
  String get orderCancelDialogBody =>
      'This can\'t be undone. You can tell us why (optional).';

  @override
  String get orderCancelReasonHint => 'Reason (optional)';

  @override
  String get orderCancelConfirm => 'Cancel order';

  @override
  String get orderCancelKeep => 'Keep order';

  @override
  String get orderCancelledToast => 'Order cancelled';

  @override
  String get uploadReceiptTitle => 'Upload receipt';

  @override
  String get uploadAmountTitle => 'Amount to transfer';

  @override
  String get uploadRefShort => 'REF';

  @override
  String get uploadTransferTo => 'Transfer to';

  @override
  String get uploadBankLabel => 'Bank';

  @override
  String get uploadReceiptPhoto => 'Receipt photo';

  @override
  String get uploadTakePhoto => 'Take a photo of your receipt';

  @override
  String get uploadPhotoHint =>
      'Make sure the reference, amount and date are clearly visible';

  @override
  String get uploadCamera => 'Camera';

  @override
  String get uploadGallery => 'From gallery';

  @override
  String get uploadTip1 => 'Photo is clear and not dark';

  @override
  String uploadTip2(String ref) {
    return 'The reference $ref is visible';
  }

  @override
  String get uploadTip3 => 'The amount matches the total';

  @override
  String get uploadSubmit => 'Submit receipt for review';

  @override
  String get uploadSubmitted => 'Receipt uploaded';

  @override
  String get receiptSubmittedTitle => 'Receipt received';

  @override
  String get receiptSubmittedBody =>
      'We\'re reviewing your receipt now. You\'ll get a notification within 5–15 min.';

  @override
  String get receiptStepOrderPlaced => 'Order placed';

  @override
  String get receiptStepUnderReview => 'Under review';

  @override
  String get receiptStepConfirmed => 'Confirmed · preparing';

  @override
  String get receiptStepPending => 'Pending';

  @override
  String get trackingTitle => 'Track order';

  @override
  String get trackingStatusLabel => 'STATUS';

  @override
  String get trackingProgressTitle => 'Progress';

  @override
  String get trackingOrderLabel => 'Order';

  @override
  String get trackingSupportBody =>
      'Message us on WhatsApp and we\'ll help with this order.';

  @override
  String get trackingOnTheWay => 'On the way to you';

  @override
  String get trackingPreparing => 'Preparing your order';

  @override
  String get trackingDeliveredHeadline => 'Delivered';

  @override
  String get trackingConfirmedHeadline => 'Payment confirmed';

  @override
  String get writeReviewRatingLabel => 'Your rating';

  @override
  String get writeReviewRating1 => 'Poor';

  @override
  String get writeReviewRating2 => 'Fair';

  @override
  String get writeReviewRating3 => 'Good';

  @override
  String get writeReviewRating4 => 'Very good';

  @override
  String get writeReviewRating5 => 'Excellent';

  @override
  String get writeReviewTagsTitle => 'What stood out?';

  @override
  String get writeReviewTag1 => 'Long lasting';

  @override
  String get writeReviewTag2 => 'Strong scent';

  @override
  String get writeReviewTag3 => 'Premium packaging';

  @override
  String get writeReviewTag4 => 'Fast delivery';

  @override
  String get writeReviewDetailsTitle => 'Details (optional)';

  @override
  String get writeReviewDetailsHint =>
      'Share what you liked or what could be better…';

  @override
  String get writeReviewSubmit => 'Submit review';

  @override
  String get writeReviewVerifiedBuyer => 'Verified buyer';

  @override
  String get writeReviewRatingRequired => 'Tap a star to rate';

  @override
  String get writeReviewSuccess =>
      'Review submitted — it\'ll appear once approved.';

  @override
  String get commonContact => 'Contact';
}
