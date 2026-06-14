// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'l10n.dart';

// ignore_for_file: type=lint

/// The translations for Arabic (`ar`).
class L10nAr extends L10n {
  L10nAr([String locale = 'ar']) : super(locale);

  @override
  String get appName => 'بَرتال';

  @override
  String get tagline => 'بوابتك للتسوق في السودان';

  @override
  String get commonYes => 'نعم';

  @override
  String get commonNo => 'لا';

  @override
  String get commonOk => 'حسناً';

  @override
  String get commonCancel => 'إلغاء';

  @override
  String get commonConfirm => 'تأكيد';

  @override
  String get commonSave => 'حفظ';

  @override
  String get commonDelete => 'حذف';

  @override
  String get commonEdit => 'تعديل';

  @override
  String get commonBack => 'رجوع';

  @override
  String get commonNext => 'التالي';

  @override
  String get commonSkip => 'تخطي';

  @override
  String get commonRetry => 'إعادة المحاولة';

  @override
  String get commonLoading => 'جارٍ التحميل…';

  @override
  String get commonSearch => 'بحث';

  @override
  String get commonOptional => 'اختياري';

  @override
  String get commonRequired => 'مطلوب';

  @override
  String get commonSeeAll => 'عرض الكل';

  @override
  String get navHome => 'الرئيسية';

  @override
  String get navShop => 'المتجر';

  @override
  String get navCategories => 'الفئات';

  @override
  String get navCart => 'السلة';

  @override
  String get navOrders => 'طلباتي';

  @override
  String get navProfile => 'حسابي';

  @override
  String get navSettings => 'الإعدادات';

  @override
  String get navWishlist => 'المفضلة';

  @override
  String get navNotifications => 'الإشعارات';

  @override
  String get authLogin => 'تسجيل الدخول';

  @override
  String get authLogout => 'تسجيل الخروج';

  @override
  String get authRegister => 'إنشاء حساب';

  @override
  String get authPhone => 'رقم الهاتف';

  @override
  String get authPhonePlaceholder => '+249 XXX XXX XXX';

  @override
  String get authPassword => 'كلمة المرور';

  @override
  String get authConfirmPassword => 'تأكيد كلمة المرور';

  @override
  String get authName => 'الاسم الكامل';

  @override
  String get authEmail => 'البريد الإلكتروني (اختياري)';

  @override
  String get authOtpTitle => 'أدخل الرمز';

  @override
  String authOtpSubtitle(String phone) {
    return 'أرسلنا رمزاً مكوناً من 6 أرقام إلى $phone';
  }

  @override
  String get authOtpResend => 'إعادة إرسال الرمز';

  @override
  String authOtpResendIn(String seconds) {
    return 'يمكنك إعادة الإرسال خلال $seconds ثانية';
  }

  @override
  String get authForgotPassword => 'نسيت كلمة المرور؟';

  @override
  String get authResetPassword => 'إعادة تعيين كلمة المرور';

  @override
  String get authInvalidPhone => 'أدخل رقم هاتف سوداني صحيح (+249)';

  @override
  String get authPasswordTooShort => 'كلمة المرور 8 أحرف على الأقل';

  @override
  String get authPasswordsMismatch => 'كلمتا المرور غير متطابقتين';

  @override
  String get productsAddToCart => 'أضف إلى السلة';

  @override
  String get productsBuyNow => 'اشتر الآن';

  @override
  String get productsInStock => 'متوفر';

  @override
  String get productsOutOfStock => 'نفذت الكمية';

  @override
  String productsLowStock(int count) {
    return 'تبقى $count فقط';
  }

  @override
  String get productsReviews => 'تقييم';

  @override
  String get productsReviewsTitle => 'التقييمات';

  @override
  String get productsRelated => 'قد يعجبك أيضاً';

  @override
  String get productsShare => 'مشاركة';

  @override
  String get productsShareWhatsapp => 'مشاركة عبر واتساب';

  @override
  String get productsNoResults => 'لا توجد منتجات تطابق بحثك.';

  @override
  String get productsDescription => 'الوصف';

  @override
  String get productsSpecs => 'المواصفات';

  @override
  String get productsFeatured => 'مختارات بارتال';

  @override
  String get productsNewArrivals => 'وصل حديثاً';

  @override
  String get productsSale => 'خصم';

  @override
  String get productsColor => 'اللون';

  @override
  String get productsVerifiedPurchase => 'شراء موثّق';

  @override
  String get searchPlaceholder => 'ابحث عن أي شيء';

  @override
  String get searchResults => 'نتائج البحث';

  @override
  String searchResultsCount(String count) {
    return '$count نتيجة';
  }

  @override
  String get searchFilters => 'تصفية';

  @override
  String get searchSort => 'ترتيب';

  @override
  String get searchSortNewest => 'الأحدث';

  @override
  String get searchSortPriceAsc => 'السعر: من الأقل';

  @override
  String get searchSortPriceDesc => 'السعر: من الأعلى';

  @override
  String get searchSortPopular => 'الأكثر رواجاً';

  @override
  String get searchFilterCategory => 'الفئة';

  @override
  String get searchFilterPrice => 'نطاق السعر';

  @override
  String get searchFilterInStock => 'المتوفر فقط';

  @override
  String get searchApplyFilters => 'تطبيق';

  @override
  String get searchClearFilters => 'مسح الكل';

  @override
  String get cartTitle => 'سلتي';

  @override
  String get cartEmpty => 'سلتك فارغة.';

  @override
  String get cartSubtotal => 'المجموع الفرعي';

  @override
  String get cartDeliveryFee => 'رسوم التوصيل';

  @override
  String get cartDiscount => 'الخصم';

  @override
  String get cartTotal => 'الإجمالي';

  @override
  String get cartCheckout => 'إتمام الشراء';

  @override
  String get cartPlaceOrder => 'إتمام الطلب';

  @override
  String get cartContinueShopping => 'متابعة التسوق';

  @override
  String get deliveryTo => 'التوصيل إلى';

  @override
  String get deliveryFreeDelivery => 'توصيل مجاني';

  @override
  String get deliveryZoneA => 'وسط الخرطوم';

  @override
  String get deliveryZoneB => 'أمدرمان';

  @override
  String get deliveryZoneC => 'بحري';

  @override
  String get deliveryZoneD => 'شرق الخرطوم';

  @override
  String deliveryEtaDays(String min, String max) {
    return '$min-$max يوم';
  }

  @override
  String get wishlistTitle => 'المفضلة';

  @override
  String get wishlistEmpty => 'لا توجد عناصر في المفضلة بعد.';

  @override
  String get wishlistPriceDropped => 'انخفض السعر';

  @override
  String get emptyCartTitle => 'سلتك فارغة';

  @override
  String get emptyCartBody =>
      'اكتشف منتجات رائعة وأضفها لسلتك — من العطور إلى الإلكترونيات.';

  @override
  String get emptyCartCta => 'ابدأ التسوق';

  @override
  String get emptyOrdersTitle => 'لا توجد طلبات بعد';

  @override
  String get emptyOrdersBody => 'طلباتك ستظهر هنا فور إتمام أول عملية شراء.';

  @override
  String get emptyOrdersCta => 'تسوق الآن';

  @override
  String get emptySearchTitle => 'لا توجد نتائج';

  @override
  String get emptySearchBody => 'جرّب كلمات بحث أخرى أو تصفح الفئات.';

  @override
  String get emptySearchCta => 'تصفح الفئات';

  @override
  String get emptyAddressesTitle => 'لا توجد عناوين';

  @override
  String get emptyAddressesBody =>
      'أضف عنواناً لتسريع عملية الدفع في المرات القادمة.';

  @override
  String get emptyAddressesCta => 'أضف عنواناً';

  @override
  String get errorServerTag => 'خطأ في الخادم';

  @override
  String get errorServerTitle => 'حدث خطأ غير متوقع';

  @override
  String get errorServerBody =>
      'نحن نعمل على إصلاح المشكلة. حاول مرة أخرى بعد قليل.';

  @override
  String get errorOfflineTag => 'غير متصل';

  @override
  String get errorOfflineTitle => 'لا يوجد اتصال بالإنترنت';

  @override
  String get errorOfflineBody =>
      'تحقق من الواي فاي أو البيانات الخلوية وحاول مجدداً.';

  @override
  String get errorOfflineBanner => 'أنت غير متصل بالإنترنت';

  @override
  String get errorTryAgain => 'إعادة المحاولة';

  @override
  String get errorsNetwork =>
      'لا يوجد اتصال بالإنترنت. الرجاء المحاولة مرة أخرى.';

  @override
  String get errorsGeneric => 'حدث خطأ ما. الرجاء المحاولة مرة أخرى.';

  @override
  String get errorsUnauthorized => 'الرجاء تسجيل الدخول للمتابعة.';

  @override
  String get errorsNotFound => 'غير موجود.';

  @override
  String get errorsValidation => 'يرجى مراجعة الحقول المظللة.';

  @override
  String get errorsRateLimited => 'محاولات كثيرة. الرجاء الانتظار قليلاً.';

  @override
  String get commonShow => 'إظهار';

  @override
  String get commonHide => 'إخفاء';

  @override
  String get commonOr => 'أو';

  @override
  String get commonContinue => 'متابعة';

  @override
  String get splashSubtitle => 'سوق السودان الرقمي';

  @override
  String get splashInitializing => 'جاري التهيئة';

  @override
  String get onboardingSkip => 'تخطي';

  @override
  String get onboardingStart => 'ابدأ التسوق';

  @override
  String get onboarding1Eyebrow => 'شراء';

  @override
  String get onboarding1Title => 'كل ما تحتاجه من سوق السودان، في مكان واحد.';

  @override
  String get onboarding1Body =>
      'عطور، إلكترونيات، أزياء، منزل. من متاجر معروفة وبائعين موثوقين.';

  @override
  String get onboarding2Eyebrow => 'ادفع';

  @override
  String get onboarding2Title => 'حوّل بنكياً أو بكاش. بدون بطاقات.';

  @override
  String get onboarding2Body =>
      'فارو، بنك الخرطوم، EBS — أو ادفع عند الاستلام. صوّر الإيصال لتأكيد الطلب.';

  @override
  String get onboarding3Eyebrow => 'استلم';

  @override
  String get onboarding3Title => 'توصيل لكل ولاية. تابع طلبك لحظة بلحظة.';

  @override
  String get onboarding3Body =>
      'الخرطوم · أم درمان · بحري · بورتسودان · عطبرة · ومدن أخرى. تحديثات واتساب.';

  @override
  String get welcomeBrandTagline => 'كل ما تحتاجه · السودان';

  @override
  String get welcomeTitle => 'بوابتك للتسوق الذكي.';

  @override
  String get welcomeBody =>
      'آلاف المنتجات، توصيل سريع عبر الخرطوم، دفع بأي بنك سوداني.';

  @override
  String get welcomeCreateAccount => 'إنشاء حساب جديد';

  @override
  String get welcomeSignIn => 'تسجيل الدخول';

  @override
  String get welcomeTermsPrefix => 'بالمتابعة، أنت توافق على ';

  @override
  String get welcomeTermsLink => 'الشروط والخصوصية';

  @override
  String get loginEyebrow => 'مرحبا بعودتك';

  @override
  String get loginTitle => 'سجل دخولك إلى برتال.';

  @override
  String get loginWhatsappOtp => 'استلام رمز عبر واتساب';

  @override
  String get loginNoAccount => 'ليس لديك حساب؟ ';

  @override
  String get loginSignUpLink => 'سجّل الآن';

  @override
  String authStepOf(String current, String total) {
    return 'الخطوة $current من $total';
  }

  @override
  String get authSignIn => 'تسجيل الدخول';

  @override
  String get authNewPassword => 'كلمة المرور الجديدة';

  @override
  String get authPhonePrefix => '+249';

  @override
  String get signupTitle => 'أنشئ حسابك.';

  @override
  String get signupSubtitle => 'سنرسل رمز تحقق إلى رقم هاتفك';

  @override
  String get signupTermsAgree =>
      'أوافق على الشروط والأحكام وسياسة الخصوصية الخاصة ببرتال.';

  @override
  String get signupSendCode => 'إرسال رمز التحقق';

  @override
  String get signupHaveAccount => 'لديك حساب؟ ';

  @override
  String get pwStrengthWeak => 'ضعيفة';

  @override
  String get pwStrengthFair => 'مقبولة';

  @override
  String get pwStrengthGood => 'جيدة';

  @override
  String get pwStrengthStrong => 'قوية';

  @override
  String pwStrengthLabel(String value) {
    return 'قوة كلمة المرور: $value';
  }

  @override
  String get pwRuleLength => '٨ أحرف على الأقل';

  @override
  String get pwRuleCase => 'حرف كبير وحرف صغير';

  @override
  String get pwRuleNumber => 'رقم واحد على الأقل';

  @override
  String get pwRuleSymbol => 'رمز خاص (!@#\$)';

  @override
  String get otpHeading => 'أدخل رمز التحقق.';

  @override
  String otpResendCountdown(String time) {
    return 'يمكنك طلب رمز جديد خلال $time';
  }

  @override
  String get otpNotReceived => 'لم يصلك؟';

  @override
  String get otpTryWhatsapp => 'جرّب عبر واتساب';

  @override
  String get otpVerify => 'تحقق ومتابعة';

  @override
  String get otpSecureNote => 'رمز آمن · سينتهي خلال ٥ دقائق';

  @override
  String get forgotEyebrow => 'استعادة الحساب';

  @override
  String get forgotTitle => 'نسيت كلمة المرور؟';

  @override
  String get forgotBody =>
      'أدخل رقم هاتفك، وسنرسل رمزاً لإعادة تعيين كلمة المرور.';

  @override
  String get forgotChooseMethod => 'اختر طريقة الاستلام';

  @override
  String get channelWhatsapp => 'واتساب';

  @override
  String get channelSms => 'رسالة SMS';

  @override
  String get forgotSendCode => 'أرسل رمز التحقق';

  @override
  String get forgotRemembered => 'تذكّرت كلمة المرور؟ ';

  @override
  String get forgotBackToSignIn => 'عد لتسجيل الدخول';

  @override
  String get resetTitle => 'أنشئ كلمة مرور جديدة';

  @override
  String get resetBody =>
      'يجب أن تختلف عن كلمات المرور السابقة المستخدمة في حسابك.';

  @override
  String get resetSave => 'حفظ كلمة المرور والدخول';

  @override
  String get resetSuccess => 'تم تحديث كلمة المرور. سجّل دخولك الآن.';

  @override
  String homeDeliveryEta(String min, String max) {
    return '· $min-$max يوم';
  }

  @override
  String pdpReviewsWithCount(String count) {
    return 'التقييمات ($count)';
  }

  @override
  String pdpRatingCount(String count) {
    return '($count تقييم)';
  }

  @override
  String get pdpWriteReview => 'اكتب تقييمك';

  @override
  String get pdpNoReviews => 'لا توجد تقييمات بعد';

  @override
  String get pdpNoReviewsBody => 'كن أول من يقيّم هذا المنتج بعد استلامه.';

  @override
  String reviewCount(String count) {
    return '$count تقييم';
  }

  @override
  String get reviewVerified => 'موثّق';

  @override
  String get reviewFilterAll => 'الكل';

  @override
  String get reviewSortNewest => 'الأحدث أولاً';

  @override
  String get reviewSortHighest => 'الأعلى تقييماً';

  @override
  String get reviewSortLowest => 'الأقل تقييماً';

  @override
  String get categoriesSearchHint => 'ابحث في الفئات…';

  @override
  String get categoriesSubcategories => 'الأقسام الفرعية';

  @override
  String categoriesShopName(String name) {
    return 'تسوق $name';
  }

  @override
  String get filtersTitle => 'الفلاتر';

  @override
  String get filtersResetCleared => 'تم مسح الفلاتر';

  @override
  String wishlistSavedCount(String count) {
    return '$count منتجات محفوظة';
  }

  @override
  String get wishlistRemoved => 'تمت الإزالة من المفضلة';

  @override
  String get actionFailed => 'تعذّر إكمال العملية. حاول مرة أخرى.';

  @override
  String get commonCopied => 'تم النسخ';

  @override
  String get commonRequired2 => 'هذا الحقل مطلوب';

  @override
  String get cartItemAdded => 'تمت الإضافة إلى السلة';

  @override
  String get cartViewCart => 'عرض السلة';

  @override
  String get cartOutOfStock => 'الكمية المتاحة غير كافية';

  @override
  String get stepAddress => 'العنوان';

  @override
  String get stepPayment => 'الدفع';

  @override
  String get stepReview => 'المراجعة';

  @override
  String get checkoutAddressTitle => 'عنوان التوصيل';

  @override
  String get checkoutNoAddresses => 'أضف عنوان توصيل للمتابعة';

  @override
  String get checkoutAddNewAddress => 'إضافة عنوان جديد';

  @override
  String get checkoutSelected => 'محدد';

  @override
  String get checkoutEdit => 'تعديل';

  @override
  String get checkoutDeliveryZone => 'منطقة التوصيل';

  @override
  String get checkoutContinueToPayment => 'متابعة إلى الدفع';

  @override
  String get paymentMethodTitle => 'طريقة الدفع';

  @override
  String get paymentBankTransfer => 'تحويل بنكي';

  @override
  String get paymentBankSub =>
      'حوّل من أي بنك سوداني · ارفع الإيصال بعد التحويل';

  @override
  String get paymentRecommended => 'موصى به';

  @override
  String get paymentCod => 'الدفع عند الاستلام';

  @override
  String get paymentCodSub => 'ادفع نقداً عند تسليم الطلب';

  @override
  String get paymentWallet => 'محفظة رقمية';

  @override
  String get paymentWalletSub => 'بنكك · فوري · زين كاش';

  @override
  String get paymentSoon => 'قريباً';

  @override
  String get paymentContinue => 'متابعة';

  @override
  String get bankStepTitle => 'حسابات برتال';

  @override
  String get bankChooseTitle => 'اختر البنك الذي ستحوّل منه';

  @override
  String get bankChooseBody =>
      'لدينا حسابات في عدة بنوك لتسهيل التحويل المحلي. بعد التحويل ستقوم برفع إيصال في الخطوة التالية.';

  @override
  String get bankAccountName => 'اسم الحساب';

  @override
  String get bankAccountNumber => 'رقم الحساب';

  @override
  String get bankSwift => 'سويفت';

  @override
  String get bankAmount => 'المبلغ المطلوب';

  @override
  String get bankReference => 'المرجع';

  @override
  String get bankImportantNote => 'ملاحظة مهمة';

  @override
  String get bankNote1 => 'استخدم رقم الطلب كمرجع في التحويل';

  @override
  String get bankNote2 => 'التحقق يستغرق ٥-١٥ دقيقة في ساعات العمل';

  @override
  String get bankNote3 => 'ستصلك رسالة عند تأكيد الدفع';

  @override
  String get bankContinueToReview => 'متابعة إلى المراجعة';

  @override
  String get reviewPaymentTitle => 'الدفع';

  @override
  String get reviewItemsTitle => 'المنتجات';

  @override
  String reviewQtyEach(String qty, String price) {
    return 'الكمية $qty · $price';
  }

  @override
  String get reviewTotalsTitle => 'الإجمالي';

  @override
  String get reviewTerms =>
      'بالضغط على «تأكيد الطلب» فإنك توافق على شروط الاستخدام وسياسة الخصوصية.';

  @override
  String get reviewPlaceOrder => 'تأكيد الطلب';

  @override
  String get confirmTitle => 'تم استلام طلبك!';

  @override
  String get confirmOrderNumber => 'رقم الطلب';

  @override
  String get confirmBankInstructions => 'تعليمات التحويل البنكي';

  @override
  String get confirmAmount => 'المبلغ';

  @override
  String get confirmUploadTitle => 'رفع صورة الإيصال';

  @override
  String get confirmUploadSub => 'سيتم التحقق من الإيصال خلال ٢٤ ساعة';

  @override
  String get confirmReceiptLater => 'يمكنك رفع الإيصال لاحقاً من صفحة الطلب';

  @override
  String get confirmCodTitle => 'ادفع عند الاستلام';

  @override
  String get confirmCodBody =>
      'ستدفع المبلغ نقداً عند تسليم طلبك. سنتواصل معك لتأكيد موعد التوصيل.';

  @override
  String get confirmViewOrder => 'عرض الطلب';

  @override
  String get confirmContinueShopping => 'متابعة التسوق';

  @override
  String get addressNewTitle => 'عنوان جديد';

  @override
  String get addressLabelTitle => 'التسمية';

  @override
  String get labelHome => 'المنزل';

  @override
  String get labelWork => 'العمل';

  @override
  String get labelOther => 'آخر';

  @override
  String get addressContactTitle => 'جهة الاتصال';

  @override
  String get addressFullName => 'الاسم الكامل';

  @override
  String get addressPhone => 'رقم الهاتف';

  @override
  String get addressStreetTitle => 'العنوان التفصيلي';

  @override
  String get addressDistrict => 'الحي / الشارع / رقم المنزل';

  @override
  String get addressDistrictHint => 'مثال: الرياض، بلوك ٣٢، منزل ١٤';

  @override
  String get addressCity => 'المدينة';

  @override
  String get addressLandmark => 'علامة مميزة';

  @override
  String get addressLandmarkHelp => 'ساعد السائق على إيجاد عنوانك بسرعة';

  @override
  String get addressLandmarkHint => 'مثال: بجانب مسجد النور';

  @override
  String get addressNotesTitle => 'ملاحظات للسائق';

  @override
  String get addressNotesHint => 'اختياري — اتصل عند الوصول، الطابق الثاني…';

  @override
  String get addressSetDefault => 'تعيين كعنوان افتراضي';

  @override
  String get addressSave => 'حفظ العنوان';

  @override
  String get addressLandmarkRequired =>
      'العلامة المميزة مطلوبة (٣ أحرف على الأقل)';

  @override
  String get addressNameRequired => 'الاسم مطلوب';

  @override
  String get addressDistrictRequired => 'الحي مطلوب';

  @override
  String get ordersFilterAll => 'الكل';

  @override
  String get ordersFilterProcessing => 'قيد التجهيز';

  @override
  String get ordersFilterShipping => 'قيد الشحن';

  @override
  String get ordersFilterCompleted => 'مكتملة';

  @override
  String ordersItemCount(String count) {
    return '$count منتج';
  }

  @override
  String get orderStatusPending => 'قيد الانتظار';

  @override
  String get orderStatusAwaitingPayment => 'بانتظار الدفع';

  @override
  String get orderStatusReceiptUploaded => 'إيصال قيد المراجعة';

  @override
  String get orderStatusPaymentConfirmed => 'تم تأكيد الدفع';

  @override
  String get orderStatusPaymentRejected => 'تم رفض الدفع';

  @override
  String get orderStatusProcessing => 'قيد التجهيز';

  @override
  String get orderStatusShipped => 'تم الشحن';

  @override
  String get orderStatusDelivered => 'تم التوصيل';

  @override
  String get orderStatusCancelled => 'ملغى';

  @override
  String get orderStatusRefunded => 'تم الاسترداد';

  @override
  String get orderDetailTitle => 'تفاصيل الطلب';

  @override
  String orderItemsWithCount(String count) {
    return 'المنتجات ($count)';
  }

  @override
  String orderItemQty(String count) {
    return 'الكمية: $count';
  }

  @override
  String get orderDeliveryTo => 'التوصيل إلى';

  @override
  String get orderPaymentSummary => 'ملخص الدفع';

  @override
  String orderBankRefLine(String ref) {
    return 'مرجع: $ref';
  }

  @override
  String get orderHelpTitle => 'تحتاج مساعدة؟';

  @override
  String orderHelpWhatsapp(String phone) {
    return 'راسلنا على واتساب: $phone';
  }

  @override
  String get orderContactWhatsapp => 'تواصل عبر واتساب';

  @override
  String get orderAwaitingReceiptMessage =>
      'أكمل طلبك برفع إيصال التحويل البنكي. سيتم التأكيد خلال ٥–١٥ دقيقة.';

  @override
  String get orderUnderReviewMessage =>
      'نراجع إيصالك الآن. ستصلك رسالة خلال ٥–١٥ دقيقة.';

  @override
  String get orderUploadReceiptCta => 'رفع الإيصال';

  @override
  String get orderReuploadReceiptCta => 'إعادة رفع الإيصال';

  @override
  String get orderTrackCta => 'تتبع الطلب';

  @override
  String get orderCancelCta => 'إلغاء الطلب';

  @override
  String get orderCodNote => 'ستدفع نقداً عند توصيل طلبك.';

  @override
  String get orderRejectedTitle => 'تعذر التحقق من الإيصال';

  @override
  String get orderRejectedMessage =>
      'لم نتمكن من قراءة المبلغ أو الرقم المرجعي. يرجى رفع صورة أوضح.';

  @override
  String get orderRejectedNoteTitle => 'ملاحظة من فريق التحقق';

  @override
  String get orderCancelDialogTitle => 'إلغاء هذا الطلب؟';

  @override
  String get orderCancelDialogBody =>
      'لا يمكن التراجع عن هذا الإجراء. يمكنك إخبارنا بالسبب (اختياري).';

  @override
  String get orderCancelReasonHint => 'السبب (اختياري)';

  @override
  String get orderCancelConfirm => 'إلغاء الطلب';

  @override
  String get orderCancelKeep => 'الاحتفاظ بالطلب';

  @override
  String get orderCancelledToast => 'تم إلغاء الطلب';

  @override
  String get uploadReceiptTitle => 'رفع الإيصال';

  @override
  String get uploadAmountTitle => 'المبلغ المطلوب تحويله';

  @override
  String get uploadRefShort => 'المرجع';

  @override
  String get uploadTransferTo => 'التحويل إلى';

  @override
  String get uploadBankLabel => 'البنك';

  @override
  String get uploadReceiptPhoto => 'صورة الإيصال';

  @override
  String get uploadTakePhoto => 'التقط صورة الإيصال';

  @override
  String get uploadPhotoHint => 'تأكد من وضوح رقم المرجع والمبلغ والتاريخ';

  @override
  String get uploadCamera => 'كاميرا';

  @override
  String get uploadGallery => 'من المعرض';

  @override
  String get uploadTip1 => 'الصورة واضحة وغير مظلمة';

  @override
  String uploadTip2(String ref) {
    return 'رقم المرجع $ref ظاهر';
  }

  @override
  String get uploadTip3 => 'المبلغ يطابق الإجمالي';

  @override
  String get uploadSubmit => 'إرسال الإيصال للمراجعة';

  @override
  String get uploadSubmitted => 'تم رفع الإيصال';

  @override
  String get receiptSubmittedTitle => 'تم استلام الإيصال';

  @override
  String get receiptSubmittedBody =>
      'نراجع إيصالك الآن. ستتلقى إشعاراً خلال ٥–١٥ دقيقة.';

  @override
  String get receiptStepOrderPlaced => 'تم الطلب';

  @override
  String get receiptStepUnderReview => 'قيد المراجعة';

  @override
  String get receiptStepConfirmed => 'مؤكد · قيد التجهيز';

  @override
  String get receiptStepPending => 'قيد الانتظار';

  @override
  String get trackingTitle => 'تتبع الطلب';

  @override
  String get trackingStatusLabel => 'الحالة';

  @override
  String get trackingProgressTitle => 'التقدم';

  @override
  String get trackingOrderLabel => 'رقم الطلب';

  @override
  String get trackingSupportBody => 'راسلنا على واتساب وسنساعدك في هذا الطلب.';

  @override
  String get trackingOnTheWay => 'في الطريق إليك';

  @override
  String get trackingPreparing => 'جاري تجهيز طلبك';

  @override
  String get trackingDeliveredHeadline => 'تم التسليم';

  @override
  String get trackingConfirmedHeadline => 'تم تأكيد الدفع';

  @override
  String get writeReviewRatingLabel => 'تقييمك';

  @override
  String get writeReviewRating1 => 'سيء';

  @override
  String get writeReviewRating2 => 'مقبول';

  @override
  String get writeReviewRating3 => 'جيد';

  @override
  String get writeReviewRating4 => 'جيد جداً';

  @override
  String get writeReviewRating5 => 'ممتاز';

  @override
  String get writeReviewTagsTitle => 'ما أعجبك؟';

  @override
  String get writeReviewTag1 => 'يدوم طويلاً';

  @override
  String get writeReviewTag2 => 'رائحة قوية';

  @override
  String get writeReviewTag3 => 'تغليف فاخر';

  @override
  String get writeReviewTag4 => 'توصيل سريع';

  @override
  String get writeReviewDetailsTitle => 'تفاصيل (اختياري)';

  @override
  String get writeReviewDetailsHint => 'شاركنا ما أعجبك أو ما يمكن تحسينه…';

  @override
  String get writeReviewSubmit => 'نشر التقييم';

  @override
  String get writeReviewVerifiedBuyer => 'مشتر موثّق';

  @override
  String get writeReviewRatingRequired => 'اضغط نجمة للتقييم';

  @override
  String get writeReviewSuccess => 'تم إرسال تقييمك — سيظهر بعد الموافقة عليه.';

  @override
  String get commonContact => 'تواصل';

  @override
  String get profileVerified => 'موثّق';

  @override
  String profileMemberSince(String year) {
    return 'عضو منذ $year';
  }

  @override
  String get profileStatOrders => 'طلب';

  @override
  String get profileStatWishlist => 'مفضلة';

  @override
  String get profileStatPoints => 'نقاط';

  @override
  String get profileSectionOrders => 'طلباتي ومدفوعاتي';

  @override
  String get profileSectionAccount => 'الحساب';

  @override
  String get profileSectionPreferences => 'التفضيلات';

  @override
  String get profileSectionSupport => 'الدعم';

  @override
  String get profileMyOrders => 'طلباتي';

  @override
  String get profileMyAddresses => 'عناويني';

  @override
  String profileAddressesCount(String count) {
    return '$count محفوظة';
  }

  @override
  String get profilePersonalInfo => 'المعلومات الشخصية';

  @override
  String get profilePersonalInfoSub => 'الاسم، الهاتف، البريد';

  @override
  String get profileSecurity => 'الأمان';

  @override
  String get profileSecuritySub => 'كلمة المرور';

  @override
  String get profileSettingsSub => 'اللغة، الإشعارات، المظهر';

  @override
  String get profileWishlist => 'المفضلة';

  @override
  String profileWishlistSub(String count) {
    return '$count منتجات';
  }

  @override
  String get profileHelpCenter => 'مركز المساعدة';

  @override
  String get profileWhatsappSupport => 'تواصل عبر واتساب';

  @override
  String get profileAbout => 'عن برتال';

  @override
  String get profileFooter => 'صنع في السودان ❤';

  @override
  String profileVersionLine(String version) {
    return 'برتال $version';
  }

  @override
  String get editProfileName => 'الاسم الكامل';

  @override
  String get editProfilePhoneVerified => 'تم التحقق ✓';

  @override
  String get editProfileEmail => 'البريد الإلكتروني';

  @override
  String get editProfileDob => 'تاريخ الميلاد';

  @override
  String get editProfileDobHint => 'اختر التاريخ';

  @override
  String get editProfileGender => 'الجنس';

  @override
  String get genderMale => 'ذكر';

  @override
  String get genderFemale => 'أنثى';

  @override
  String get genderOther => 'آخر';

  @override
  String get editProfileSave => 'حفظ التغييرات';

  @override
  String get editProfileSaved => 'تم حفظ التغييرات';

  @override
  String get editProfileEmailInvalid => 'بريد إلكتروني غير صالح';

  @override
  String get changePwTitle => 'تغيير كلمة المرور';

  @override
  String get changePwIntro =>
      'يجب أن تكون كلمة المرور ٨ أحرف على الأقل وتحتوي على رقم.';

  @override
  String get changePwCurrent => 'كلمة المرور الحالية';

  @override
  String get changePwNew => 'كلمة المرور الجديدة';

  @override
  String get changePwConfirm => 'تأكيد كلمة المرور الجديدة';

  @override
  String get changePwForgot => 'نسيت كلمة المرور الحالية؟';

  @override
  String get changePwSubmit => 'تحديث كلمة المرور';

  @override
  String get changePwMismatch => 'كلمتا المرور غير متطابقتين';

  @override
  String get changePwSuccessTitle => 'تم تغيير كلمة المرور';

  @override
  String get changePwSuccessBody =>
      'يرجى تسجيل الدخول مرة أخرى بكلمة المرور الجديدة.';

  @override
  String get addressesTitle => 'عناويني';

  @override
  String get addressesIntro => 'عيّن عنواناً افتراضياً للتسليم السريع.';

  @override
  String get addressDefault => 'افتراضي';

  @override
  String get addressSetDefaultAction => 'تعيين كافتراضي';

  @override
  String get addressDeleteConfirmTitle => 'حذف العنوان؟';

  @override
  String get addressDeleteConfirmBody => 'لا يمكن التراجع عن هذا الإجراء.';

  @override
  String get addressDeleted => 'تم حذف العنوان';

  @override
  String get addressEditTitle => 'تعديل العنوان';

  @override
  String get addressSaveChanges => 'حفظ التغييرات';

  @override
  String get settingsSectionLanguage => 'اللغة والمنطقة';

  @override
  String get settingsLanguage => 'اللغة';

  @override
  String get settingsLanguageArabic => 'العربية';

  @override
  String get settingsLanguageEnglish => 'English';

  @override
  String get settingsCurrency => 'العملة';

  @override
  String get settingsCurrencyValue => 'الجنيه السوداني (ج.س)';

  @override
  String get settingsNumerals => 'الأرقام';

  @override
  String get settingsNumeralsArabic => 'عربية (٠-٩)';

  @override
  String get settingsNumeralsWestern => 'غربية (123)';

  @override
  String get settingsSectionAppearance => 'المظهر';

  @override
  String get settingsDarkMode => 'الوضع الداكن';

  @override
  String get settingsOn => 'مفعّل';

  @override
  String get settingsOff => 'مطفأ';

  @override
  String get settingsTextSize => 'حجم الخط';

  @override
  String get settingsTextSizeValue => 'متوسط';

  @override
  String get settingsSectionNotifications => 'الإشعارات';

  @override
  String get settingsNotifOrders => 'تحديثات الطلبات';

  @override
  String get settingsNotifOrdersSub => 'SMS + إشعارات التطبيق';

  @override
  String get settingsNotifWhatsapp => 'تنبيهات واتساب';

  @override
  String get settingsNotifWhatsappSub => 'تأكيد الإيصال والتوصيل';

  @override
  String get settingsNotifOffers => 'العروض والتخفيضات';

  @override
  String get settingsNotifOffersSub => 'بريد إلكتروني فقط';

  @override
  String get settingsNotifRecommendations => 'توصيات المنتجات';

  @override
  String get settingsSectionPrivacy => 'الخصوصية';

  @override
  String get settingsMyData => 'بياناتي';

  @override
  String get settingsMyDataSub => 'تنزيل أو حذف';

  @override
  String get settingsActiveSessions => 'الجلسات النشطة';

  @override
  String get settingsSignOutAll => 'تسجيل الخروج من كل الأجهزة';

  @override
  String get settingsSectionAbout => 'عن التطبيق';

  @override
  String get settingsVersion => 'الإصدار';

  @override
  String get settingsTerms => 'شروط الاستخدام';

  @override
  String get settingsPrivacyPolicy => 'سياسة الخصوصية';

  @override
  String get settingsComingSoon => 'قريباً';

  @override
  String notificationsUnread(String count) {
    return '$count غير مقروءة';
  }

  @override
  String get notificationsMarkAllRead => 'تحديد الكل كمقروء';

  @override
  String get notificationsAllRead => 'تم تحديد الكل كمقروء';

  @override
  String get helpTitle => 'مركز المساعدة';

  @override
  String get helpSearchHint => 'ابحث في الأسئلة الشائعة';

  @override
  String get helpWhatsappTitle => 'تواصل عبر واتساب';

  @override
  String get helpWhatsappSub => 'الرد خلال ١٥ دقيقة · ٨ص-١٠م';

  @override
  String get helpBrowseTopics => 'تصفح حسب الموضوع';

  @override
  String get helpTopicOrders => 'الطلبات والتوصيل';

  @override
  String get helpTopicPayment => 'الدفع والإيصالات';

  @override
  String get helpTopicReturns => 'الإرجاع والاستبدال';

  @override
  String get helpTopicAccount => 'الحساب والأمان';

  @override
  String helpTopicArticles(String count) {
    return '$count مقالات';
  }

  @override
  String get helpMostAsked => 'الأكثر شيوعاً';

  @override
  String get helpQ1 => 'كيف أرفع إيصال التحويل البنكي؟';

  @override
  String get helpA1 =>
      'بعد إتمام التحويل، افتح «طلباتي» ← اختر الطلب ← اضغط «رفع الإيصال». يقبل التطبيق صور JPG و PNG حتى ١٠ ميجا.';

  @override
  String get helpQ2 => 'متى يتم اعتماد الإيصال؟';

  @override
  String get helpA2 =>
      'عادةً خلال ٥–١٥ دقيقة في ساعات العمل. ستصلك رسالة عند التأكيد.';

  @override
  String get helpQ3 => 'ما هي رسوم التوصيل؟';

  @override
  String get helpA3 =>
      'تعتمد على منطقتك في الخرطوم، وتظهر عند الدفع. التوصيل مجاني فوق حد معيّن.';

  @override
  String get helpQ4 => 'هل يمكنني الإرجاع بعد التسليم؟';

  @override
  String get helpA4 => 'نعم، تواصل معنا عبر واتساب خلال ٤٨ ساعة من الاستلام.';
}
