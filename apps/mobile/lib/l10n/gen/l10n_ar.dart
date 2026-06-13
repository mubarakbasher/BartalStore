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
}
