import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'l10n_ar.dart';
import 'l10n_en.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of L10n
/// returned by `L10n.of(context)`.
///
/// Applications need to include `L10n.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'gen/l10n.dart';
///
/// return MaterialApp(
///   localizationsDelegates: L10n.localizationsDelegates,
///   supportedLocales: L10n.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the L10n.supportedLocales
/// property.
abstract class L10n {
  L10n(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static L10n of(BuildContext context) {
    return Localizations.of<L10n>(context, L10n)!;
  }

  static const LocalizationsDelegate<L10n> delegate = _L10nDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('ar'),
    Locale('en'),
  ];

  /// No description provided for @appName.
  ///
  /// In ar, this message translates to:
  /// **'بَرتال'**
  String get appName;

  /// No description provided for @tagline.
  ///
  /// In ar, this message translates to:
  /// **'بوابتك للتسوق في السودان'**
  String get tagline;

  /// No description provided for @commonYes.
  ///
  /// In ar, this message translates to:
  /// **'نعم'**
  String get commonYes;

  /// No description provided for @commonNo.
  ///
  /// In ar, this message translates to:
  /// **'لا'**
  String get commonNo;

  /// No description provided for @commonOk.
  ///
  /// In ar, this message translates to:
  /// **'حسناً'**
  String get commonOk;

  /// No description provided for @commonCancel.
  ///
  /// In ar, this message translates to:
  /// **'إلغاء'**
  String get commonCancel;

  /// No description provided for @commonConfirm.
  ///
  /// In ar, this message translates to:
  /// **'تأكيد'**
  String get commonConfirm;

  /// No description provided for @commonSave.
  ///
  /// In ar, this message translates to:
  /// **'حفظ'**
  String get commonSave;

  /// No description provided for @commonDelete.
  ///
  /// In ar, this message translates to:
  /// **'حذف'**
  String get commonDelete;

  /// No description provided for @commonEdit.
  ///
  /// In ar, this message translates to:
  /// **'تعديل'**
  String get commonEdit;

  /// No description provided for @commonBack.
  ///
  /// In ar, this message translates to:
  /// **'رجوع'**
  String get commonBack;

  /// No description provided for @commonNext.
  ///
  /// In ar, this message translates to:
  /// **'التالي'**
  String get commonNext;

  /// No description provided for @commonSkip.
  ///
  /// In ar, this message translates to:
  /// **'تخطي'**
  String get commonSkip;

  /// No description provided for @commonRetry.
  ///
  /// In ar, this message translates to:
  /// **'إعادة المحاولة'**
  String get commonRetry;

  /// No description provided for @commonLoading.
  ///
  /// In ar, this message translates to:
  /// **'جارٍ التحميل…'**
  String get commonLoading;

  /// No description provided for @commonSearch.
  ///
  /// In ar, this message translates to:
  /// **'بحث'**
  String get commonSearch;

  /// No description provided for @commonOptional.
  ///
  /// In ar, this message translates to:
  /// **'اختياري'**
  String get commonOptional;

  /// No description provided for @commonRequired.
  ///
  /// In ar, this message translates to:
  /// **'مطلوب'**
  String get commonRequired;

  /// No description provided for @commonSeeAll.
  ///
  /// In ar, this message translates to:
  /// **'عرض الكل'**
  String get commonSeeAll;

  /// No description provided for @navHome.
  ///
  /// In ar, this message translates to:
  /// **'الرئيسية'**
  String get navHome;

  /// No description provided for @navShop.
  ///
  /// In ar, this message translates to:
  /// **'المتجر'**
  String get navShop;

  /// No description provided for @navCategories.
  ///
  /// In ar, this message translates to:
  /// **'الفئات'**
  String get navCategories;

  /// No description provided for @navCart.
  ///
  /// In ar, this message translates to:
  /// **'السلة'**
  String get navCart;

  /// No description provided for @navOrders.
  ///
  /// In ar, this message translates to:
  /// **'طلباتي'**
  String get navOrders;

  /// No description provided for @navProfile.
  ///
  /// In ar, this message translates to:
  /// **'حسابي'**
  String get navProfile;

  /// No description provided for @navSettings.
  ///
  /// In ar, this message translates to:
  /// **'الإعدادات'**
  String get navSettings;

  /// No description provided for @navWishlist.
  ///
  /// In ar, this message translates to:
  /// **'المفضلة'**
  String get navWishlist;

  /// No description provided for @navNotifications.
  ///
  /// In ar, this message translates to:
  /// **'الإشعارات'**
  String get navNotifications;

  /// No description provided for @authLogin.
  ///
  /// In ar, this message translates to:
  /// **'تسجيل الدخول'**
  String get authLogin;

  /// No description provided for @authLogout.
  ///
  /// In ar, this message translates to:
  /// **'تسجيل الخروج'**
  String get authLogout;

  /// No description provided for @authRegister.
  ///
  /// In ar, this message translates to:
  /// **'إنشاء حساب'**
  String get authRegister;

  /// No description provided for @authPhone.
  ///
  /// In ar, this message translates to:
  /// **'رقم الهاتف'**
  String get authPhone;

  /// No description provided for @authPhonePlaceholder.
  ///
  /// In ar, this message translates to:
  /// **'+249 XXX XXX XXX'**
  String get authPhonePlaceholder;

  /// No description provided for @authPassword.
  ///
  /// In ar, this message translates to:
  /// **'كلمة المرور'**
  String get authPassword;

  /// No description provided for @authConfirmPassword.
  ///
  /// In ar, this message translates to:
  /// **'تأكيد كلمة المرور'**
  String get authConfirmPassword;

  /// No description provided for @authName.
  ///
  /// In ar, this message translates to:
  /// **'الاسم الكامل'**
  String get authName;

  /// No description provided for @authEmail.
  ///
  /// In ar, this message translates to:
  /// **'البريد الإلكتروني (اختياري)'**
  String get authEmail;

  /// No description provided for @authOtpTitle.
  ///
  /// In ar, this message translates to:
  /// **'أدخل الرمز'**
  String get authOtpTitle;

  /// No description provided for @authOtpSubtitle.
  ///
  /// In ar, this message translates to:
  /// **'أرسلنا رمزاً مكوناً من 6 أرقام إلى {phone}'**
  String authOtpSubtitle(String phone);

  /// No description provided for @authOtpResend.
  ///
  /// In ar, this message translates to:
  /// **'إعادة إرسال الرمز'**
  String get authOtpResend;

  /// No description provided for @authOtpResendIn.
  ///
  /// In ar, this message translates to:
  /// **'يمكنك إعادة الإرسال خلال {seconds} ثانية'**
  String authOtpResendIn(String seconds);

  /// No description provided for @authForgotPassword.
  ///
  /// In ar, this message translates to:
  /// **'نسيت كلمة المرور؟'**
  String get authForgotPassword;

  /// No description provided for @authResetPassword.
  ///
  /// In ar, this message translates to:
  /// **'إعادة تعيين كلمة المرور'**
  String get authResetPassword;

  /// No description provided for @authInvalidPhone.
  ///
  /// In ar, this message translates to:
  /// **'أدخل رقم هاتف سوداني صحيح (+249)'**
  String get authInvalidPhone;

  /// No description provided for @authPasswordTooShort.
  ///
  /// In ar, this message translates to:
  /// **'كلمة المرور 8 أحرف على الأقل'**
  String get authPasswordTooShort;

  /// No description provided for @authPasswordsMismatch.
  ///
  /// In ar, this message translates to:
  /// **'كلمتا المرور غير متطابقتين'**
  String get authPasswordsMismatch;

  /// No description provided for @productsAddToCart.
  ///
  /// In ar, this message translates to:
  /// **'أضف إلى السلة'**
  String get productsAddToCart;

  /// No description provided for @productsBuyNow.
  ///
  /// In ar, this message translates to:
  /// **'اشتر الآن'**
  String get productsBuyNow;

  /// No description provided for @productsInStock.
  ///
  /// In ar, this message translates to:
  /// **'متوفر'**
  String get productsInStock;

  /// No description provided for @productsOutOfStock.
  ///
  /// In ar, this message translates to:
  /// **'نفذت الكمية'**
  String get productsOutOfStock;

  /// No description provided for @productsLowStock.
  ///
  /// In ar, this message translates to:
  /// **'تبقى {count} فقط'**
  String productsLowStock(int count);

  /// No description provided for @productsReviews.
  ///
  /// In ar, this message translates to:
  /// **'تقييم'**
  String get productsReviews;

  /// No description provided for @productsReviewsTitle.
  ///
  /// In ar, this message translates to:
  /// **'التقييمات'**
  String get productsReviewsTitle;

  /// No description provided for @productsRelated.
  ///
  /// In ar, this message translates to:
  /// **'قد يعجبك أيضاً'**
  String get productsRelated;

  /// No description provided for @productsShare.
  ///
  /// In ar, this message translates to:
  /// **'مشاركة'**
  String get productsShare;

  /// No description provided for @productsShareWhatsapp.
  ///
  /// In ar, this message translates to:
  /// **'مشاركة عبر واتساب'**
  String get productsShareWhatsapp;

  /// No description provided for @productsNoResults.
  ///
  /// In ar, this message translates to:
  /// **'لا توجد منتجات تطابق بحثك.'**
  String get productsNoResults;

  /// No description provided for @productsDescription.
  ///
  /// In ar, this message translates to:
  /// **'الوصف'**
  String get productsDescription;

  /// No description provided for @productsSpecs.
  ///
  /// In ar, this message translates to:
  /// **'المواصفات'**
  String get productsSpecs;

  /// No description provided for @productsFeatured.
  ///
  /// In ar, this message translates to:
  /// **'مختارات بارتال'**
  String get productsFeatured;

  /// No description provided for @productsNewArrivals.
  ///
  /// In ar, this message translates to:
  /// **'وصل حديثاً'**
  String get productsNewArrivals;

  /// No description provided for @productsSale.
  ///
  /// In ar, this message translates to:
  /// **'خصم'**
  String get productsSale;

  /// No description provided for @productsColor.
  ///
  /// In ar, this message translates to:
  /// **'اللون'**
  String get productsColor;

  /// No description provided for @productsVerifiedPurchase.
  ///
  /// In ar, this message translates to:
  /// **'شراء موثّق'**
  String get productsVerifiedPurchase;

  /// No description provided for @searchPlaceholder.
  ///
  /// In ar, this message translates to:
  /// **'ابحث عن أي شيء'**
  String get searchPlaceholder;

  /// No description provided for @searchResults.
  ///
  /// In ar, this message translates to:
  /// **'نتائج البحث'**
  String get searchResults;

  /// No description provided for @searchResultsCount.
  ///
  /// In ar, this message translates to:
  /// **'{count} نتيجة'**
  String searchResultsCount(String count);

  /// No description provided for @searchFilters.
  ///
  /// In ar, this message translates to:
  /// **'تصفية'**
  String get searchFilters;

  /// No description provided for @searchSort.
  ///
  /// In ar, this message translates to:
  /// **'ترتيب'**
  String get searchSort;

  /// No description provided for @searchSortNewest.
  ///
  /// In ar, this message translates to:
  /// **'الأحدث'**
  String get searchSortNewest;

  /// No description provided for @searchSortPriceAsc.
  ///
  /// In ar, this message translates to:
  /// **'السعر: من الأقل'**
  String get searchSortPriceAsc;

  /// No description provided for @searchSortPriceDesc.
  ///
  /// In ar, this message translates to:
  /// **'السعر: من الأعلى'**
  String get searchSortPriceDesc;

  /// No description provided for @searchSortPopular.
  ///
  /// In ar, this message translates to:
  /// **'الأكثر رواجاً'**
  String get searchSortPopular;

  /// No description provided for @searchFilterCategory.
  ///
  /// In ar, this message translates to:
  /// **'الفئة'**
  String get searchFilterCategory;

  /// No description provided for @searchFilterPrice.
  ///
  /// In ar, this message translates to:
  /// **'نطاق السعر'**
  String get searchFilterPrice;

  /// No description provided for @searchFilterInStock.
  ///
  /// In ar, this message translates to:
  /// **'المتوفر فقط'**
  String get searchFilterInStock;

  /// No description provided for @searchApplyFilters.
  ///
  /// In ar, this message translates to:
  /// **'تطبيق'**
  String get searchApplyFilters;

  /// No description provided for @searchClearFilters.
  ///
  /// In ar, this message translates to:
  /// **'مسح الكل'**
  String get searchClearFilters;

  /// No description provided for @cartTitle.
  ///
  /// In ar, this message translates to:
  /// **'سلتي'**
  String get cartTitle;

  /// No description provided for @cartEmpty.
  ///
  /// In ar, this message translates to:
  /// **'سلتك فارغة.'**
  String get cartEmpty;

  /// No description provided for @cartSubtotal.
  ///
  /// In ar, this message translates to:
  /// **'المجموع الفرعي'**
  String get cartSubtotal;

  /// No description provided for @cartDeliveryFee.
  ///
  /// In ar, this message translates to:
  /// **'رسوم التوصيل'**
  String get cartDeliveryFee;

  /// No description provided for @cartDiscount.
  ///
  /// In ar, this message translates to:
  /// **'الخصم'**
  String get cartDiscount;

  /// No description provided for @cartTotal.
  ///
  /// In ar, this message translates to:
  /// **'الإجمالي'**
  String get cartTotal;

  /// No description provided for @cartCheckout.
  ///
  /// In ar, this message translates to:
  /// **'إتمام الشراء'**
  String get cartCheckout;

  /// No description provided for @cartPlaceOrder.
  ///
  /// In ar, this message translates to:
  /// **'إتمام الطلب'**
  String get cartPlaceOrder;

  /// No description provided for @cartContinueShopping.
  ///
  /// In ar, this message translates to:
  /// **'متابعة التسوق'**
  String get cartContinueShopping;

  /// No description provided for @deliveryTo.
  ///
  /// In ar, this message translates to:
  /// **'التوصيل إلى'**
  String get deliveryTo;

  /// No description provided for @deliveryFreeDelivery.
  ///
  /// In ar, this message translates to:
  /// **'توصيل مجاني'**
  String get deliveryFreeDelivery;

  /// No description provided for @deliveryZoneA.
  ///
  /// In ar, this message translates to:
  /// **'وسط الخرطوم'**
  String get deliveryZoneA;

  /// No description provided for @deliveryZoneB.
  ///
  /// In ar, this message translates to:
  /// **'أمدرمان'**
  String get deliveryZoneB;

  /// No description provided for @deliveryZoneC.
  ///
  /// In ar, this message translates to:
  /// **'بحري'**
  String get deliveryZoneC;

  /// No description provided for @deliveryZoneD.
  ///
  /// In ar, this message translates to:
  /// **'شرق الخرطوم'**
  String get deliveryZoneD;

  /// No description provided for @deliveryEtaDays.
  ///
  /// In ar, this message translates to:
  /// **'{min}-{max} يوم'**
  String deliveryEtaDays(String min, String max);

  /// No description provided for @wishlistTitle.
  ///
  /// In ar, this message translates to:
  /// **'المفضلة'**
  String get wishlistTitle;

  /// No description provided for @wishlistEmpty.
  ///
  /// In ar, this message translates to:
  /// **'لا توجد عناصر في المفضلة بعد.'**
  String get wishlistEmpty;

  /// No description provided for @wishlistPriceDropped.
  ///
  /// In ar, this message translates to:
  /// **'انخفض السعر'**
  String get wishlistPriceDropped;

  /// No description provided for @emptyCartTitle.
  ///
  /// In ar, this message translates to:
  /// **'سلتك فارغة'**
  String get emptyCartTitle;

  /// No description provided for @emptyCartBody.
  ///
  /// In ar, this message translates to:
  /// **'اكتشف منتجات رائعة وأضفها لسلتك — من العطور إلى الإلكترونيات.'**
  String get emptyCartBody;

  /// No description provided for @emptyCartCta.
  ///
  /// In ar, this message translates to:
  /// **'ابدأ التسوق'**
  String get emptyCartCta;

  /// No description provided for @emptyOrdersTitle.
  ///
  /// In ar, this message translates to:
  /// **'لا توجد طلبات بعد'**
  String get emptyOrdersTitle;

  /// No description provided for @emptyOrdersBody.
  ///
  /// In ar, this message translates to:
  /// **'طلباتك ستظهر هنا فور إتمام أول عملية شراء.'**
  String get emptyOrdersBody;

  /// No description provided for @emptyOrdersCta.
  ///
  /// In ar, this message translates to:
  /// **'تسوق الآن'**
  String get emptyOrdersCta;

  /// No description provided for @emptySearchTitle.
  ///
  /// In ar, this message translates to:
  /// **'لا توجد نتائج'**
  String get emptySearchTitle;

  /// No description provided for @emptySearchBody.
  ///
  /// In ar, this message translates to:
  /// **'جرّب كلمات بحث أخرى أو تصفح الفئات.'**
  String get emptySearchBody;

  /// No description provided for @emptySearchCta.
  ///
  /// In ar, this message translates to:
  /// **'تصفح الفئات'**
  String get emptySearchCta;

  /// No description provided for @emptyAddressesTitle.
  ///
  /// In ar, this message translates to:
  /// **'لا توجد عناوين'**
  String get emptyAddressesTitle;

  /// No description provided for @emptyAddressesBody.
  ///
  /// In ar, this message translates to:
  /// **'أضف عنواناً لتسريع عملية الدفع في المرات القادمة.'**
  String get emptyAddressesBody;

  /// No description provided for @emptyAddressesCta.
  ///
  /// In ar, this message translates to:
  /// **'أضف عنواناً'**
  String get emptyAddressesCta;

  /// No description provided for @errorServerTag.
  ///
  /// In ar, this message translates to:
  /// **'خطأ في الخادم'**
  String get errorServerTag;

  /// No description provided for @errorServerTitle.
  ///
  /// In ar, this message translates to:
  /// **'حدث خطأ غير متوقع'**
  String get errorServerTitle;

  /// No description provided for @errorServerBody.
  ///
  /// In ar, this message translates to:
  /// **'نحن نعمل على إصلاح المشكلة. حاول مرة أخرى بعد قليل.'**
  String get errorServerBody;

  /// No description provided for @errorOfflineTag.
  ///
  /// In ar, this message translates to:
  /// **'غير متصل'**
  String get errorOfflineTag;

  /// No description provided for @errorOfflineTitle.
  ///
  /// In ar, this message translates to:
  /// **'لا يوجد اتصال بالإنترنت'**
  String get errorOfflineTitle;

  /// No description provided for @errorOfflineBody.
  ///
  /// In ar, this message translates to:
  /// **'تحقق من الواي فاي أو البيانات الخلوية وحاول مجدداً.'**
  String get errorOfflineBody;

  /// No description provided for @errorOfflineBanner.
  ///
  /// In ar, this message translates to:
  /// **'أنت غير متصل بالإنترنت'**
  String get errorOfflineBanner;

  /// No description provided for @errorTryAgain.
  ///
  /// In ar, this message translates to:
  /// **'إعادة المحاولة'**
  String get errorTryAgain;

  /// No description provided for @errorsNetwork.
  ///
  /// In ar, this message translates to:
  /// **'لا يوجد اتصال بالإنترنت. الرجاء المحاولة مرة أخرى.'**
  String get errorsNetwork;

  /// No description provided for @errorsGeneric.
  ///
  /// In ar, this message translates to:
  /// **'حدث خطأ ما. الرجاء المحاولة مرة أخرى.'**
  String get errorsGeneric;

  /// No description provided for @errorsUnauthorized.
  ///
  /// In ar, this message translates to:
  /// **'الرجاء تسجيل الدخول للمتابعة.'**
  String get errorsUnauthorized;

  /// No description provided for @errorsNotFound.
  ///
  /// In ar, this message translates to:
  /// **'غير موجود.'**
  String get errorsNotFound;

  /// No description provided for @errorsValidation.
  ///
  /// In ar, this message translates to:
  /// **'يرجى مراجعة الحقول المظللة.'**
  String get errorsValidation;

  /// No description provided for @errorsRateLimited.
  ///
  /// In ar, this message translates to:
  /// **'محاولات كثيرة. الرجاء الانتظار قليلاً.'**
  String get errorsRateLimited;

  /// No description provided for @commonShow.
  ///
  /// In ar, this message translates to:
  /// **'إظهار'**
  String get commonShow;

  /// No description provided for @commonHide.
  ///
  /// In ar, this message translates to:
  /// **'إخفاء'**
  String get commonHide;

  /// No description provided for @commonOr.
  ///
  /// In ar, this message translates to:
  /// **'أو'**
  String get commonOr;

  /// No description provided for @commonContinue.
  ///
  /// In ar, this message translates to:
  /// **'متابعة'**
  String get commonContinue;

  /// No description provided for @splashSubtitle.
  ///
  /// In ar, this message translates to:
  /// **'سوق السودان الرقمي'**
  String get splashSubtitle;

  /// No description provided for @splashInitializing.
  ///
  /// In ar, this message translates to:
  /// **'جاري التهيئة'**
  String get splashInitializing;

  /// No description provided for @onboardingSkip.
  ///
  /// In ar, this message translates to:
  /// **'تخطي'**
  String get onboardingSkip;

  /// No description provided for @onboardingStart.
  ///
  /// In ar, this message translates to:
  /// **'ابدأ التسوق'**
  String get onboardingStart;

  /// No description provided for @onboarding1Eyebrow.
  ///
  /// In ar, this message translates to:
  /// **'شراء'**
  String get onboarding1Eyebrow;

  /// No description provided for @onboarding1Title.
  ///
  /// In ar, this message translates to:
  /// **'كل ما تحتاجه من سوق السودان، في مكان واحد.'**
  String get onboarding1Title;

  /// No description provided for @onboarding1Body.
  ///
  /// In ar, this message translates to:
  /// **'عطور، إلكترونيات، أزياء، منزل. من متاجر معروفة وبائعين موثوقين.'**
  String get onboarding1Body;

  /// No description provided for @onboarding2Eyebrow.
  ///
  /// In ar, this message translates to:
  /// **'ادفع'**
  String get onboarding2Eyebrow;

  /// No description provided for @onboarding2Title.
  ///
  /// In ar, this message translates to:
  /// **'حوّل بنكياً أو بكاش. بدون بطاقات.'**
  String get onboarding2Title;

  /// No description provided for @onboarding2Body.
  ///
  /// In ar, this message translates to:
  /// **'فارو، بنك الخرطوم، EBS — أو ادفع عند الاستلام. صوّر الإيصال لتأكيد الطلب.'**
  String get onboarding2Body;

  /// No description provided for @onboarding3Eyebrow.
  ///
  /// In ar, this message translates to:
  /// **'استلم'**
  String get onboarding3Eyebrow;

  /// No description provided for @onboarding3Title.
  ///
  /// In ar, this message translates to:
  /// **'توصيل لكل ولاية. تابع طلبك لحظة بلحظة.'**
  String get onboarding3Title;

  /// No description provided for @onboarding3Body.
  ///
  /// In ar, this message translates to:
  /// **'الخرطوم · أم درمان · بحري · بورتسودان · عطبرة · ومدن أخرى. تحديثات واتساب.'**
  String get onboarding3Body;

  /// No description provided for @welcomeBrandTagline.
  ///
  /// In ar, this message translates to:
  /// **'كل ما تحتاجه · السودان'**
  String get welcomeBrandTagline;

  /// No description provided for @welcomeTitle.
  ///
  /// In ar, this message translates to:
  /// **'بوابتك للتسوق الذكي.'**
  String get welcomeTitle;

  /// No description provided for @welcomeBody.
  ///
  /// In ar, this message translates to:
  /// **'آلاف المنتجات، توصيل سريع عبر الخرطوم، دفع بأي بنك سوداني.'**
  String get welcomeBody;

  /// No description provided for @welcomeCreateAccount.
  ///
  /// In ar, this message translates to:
  /// **'إنشاء حساب جديد'**
  String get welcomeCreateAccount;

  /// No description provided for @welcomeSignIn.
  ///
  /// In ar, this message translates to:
  /// **'تسجيل الدخول'**
  String get welcomeSignIn;

  /// No description provided for @welcomeTermsPrefix.
  ///
  /// In ar, this message translates to:
  /// **'بالمتابعة، أنت توافق على '**
  String get welcomeTermsPrefix;

  /// No description provided for @welcomeTermsLink.
  ///
  /// In ar, this message translates to:
  /// **'الشروط والخصوصية'**
  String get welcomeTermsLink;

  /// No description provided for @loginEyebrow.
  ///
  /// In ar, this message translates to:
  /// **'مرحبا بعودتك'**
  String get loginEyebrow;

  /// No description provided for @loginTitle.
  ///
  /// In ar, this message translates to:
  /// **'سجل دخولك إلى برتال.'**
  String get loginTitle;

  /// No description provided for @loginWhatsappOtp.
  ///
  /// In ar, this message translates to:
  /// **'استلام رمز عبر واتساب'**
  String get loginWhatsappOtp;

  /// No description provided for @loginNoAccount.
  ///
  /// In ar, this message translates to:
  /// **'ليس لديك حساب؟ '**
  String get loginNoAccount;

  /// No description provided for @loginSignUpLink.
  ///
  /// In ar, this message translates to:
  /// **'سجّل الآن'**
  String get loginSignUpLink;

  /// No description provided for @authStepOf.
  ///
  /// In ar, this message translates to:
  /// **'الخطوة {current} من {total}'**
  String authStepOf(String current, String total);

  /// No description provided for @authSignIn.
  ///
  /// In ar, this message translates to:
  /// **'تسجيل الدخول'**
  String get authSignIn;

  /// No description provided for @authNewPassword.
  ///
  /// In ar, this message translates to:
  /// **'كلمة المرور الجديدة'**
  String get authNewPassword;

  /// No description provided for @authPhonePrefix.
  ///
  /// In ar, this message translates to:
  /// **'+249'**
  String get authPhonePrefix;

  /// No description provided for @signupTitle.
  ///
  /// In ar, this message translates to:
  /// **'أنشئ حسابك.'**
  String get signupTitle;

  /// No description provided for @signupSubtitle.
  ///
  /// In ar, this message translates to:
  /// **'سنرسل رمز تحقق إلى رقم هاتفك'**
  String get signupSubtitle;

  /// No description provided for @signupTermsAgree.
  ///
  /// In ar, this message translates to:
  /// **'أوافق على الشروط والأحكام وسياسة الخصوصية الخاصة ببرتال.'**
  String get signupTermsAgree;

  /// No description provided for @signupSendCode.
  ///
  /// In ar, this message translates to:
  /// **'إرسال رمز التحقق'**
  String get signupSendCode;

  /// No description provided for @signupHaveAccount.
  ///
  /// In ar, this message translates to:
  /// **'لديك حساب؟ '**
  String get signupHaveAccount;

  /// No description provided for @pwStrengthWeak.
  ///
  /// In ar, this message translates to:
  /// **'ضعيفة'**
  String get pwStrengthWeak;

  /// No description provided for @pwStrengthFair.
  ///
  /// In ar, this message translates to:
  /// **'مقبولة'**
  String get pwStrengthFair;

  /// No description provided for @pwStrengthGood.
  ///
  /// In ar, this message translates to:
  /// **'جيدة'**
  String get pwStrengthGood;

  /// No description provided for @pwStrengthStrong.
  ///
  /// In ar, this message translates to:
  /// **'قوية'**
  String get pwStrengthStrong;

  /// No description provided for @pwStrengthLabel.
  ///
  /// In ar, this message translates to:
  /// **'قوة كلمة المرور: {value}'**
  String pwStrengthLabel(String value);

  /// No description provided for @pwRuleLength.
  ///
  /// In ar, this message translates to:
  /// **'٨ أحرف على الأقل'**
  String get pwRuleLength;

  /// No description provided for @pwRuleCase.
  ///
  /// In ar, this message translates to:
  /// **'حرف كبير وحرف صغير'**
  String get pwRuleCase;

  /// No description provided for @pwRuleNumber.
  ///
  /// In ar, this message translates to:
  /// **'رقم واحد على الأقل'**
  String get pwRuleNumber;

  /// No description provided for @pwRuleSymbol.
  ///
  /// In ar, this message translates to:
  /// **'رمز خاص (!@#\$)'**
  String get pwRuleSymbol;

  /// No description provided for @otpHeading.
  ///
  /// In ar, this message translates to:
  /// **'أدخل رمز التحقق.'**
  String get otpHeading;

  /// No description provided for @otpResendCountdown.
  ///
  /// In ar, this message translates to:
  /// **'يمكنك طلب رمز جديد خلال {time}'**
  String otpResendCountdown(String time);

  /// No description provided for @otpNotReceived.
  ///
  /// In ar, this message translates to:
  /// **'لم يصلك؟'**
  String get otpNotReceived;

  /// No description provided for @otpTryWhatsapp.
  ///
  /// In ar, this message translates to:
  /// **'جرّب عبر واتساب'**
  String get otpTryWhatsapp;

  /// No description provided for @otpVerify.
  ///
  /// In ar, this message translates to:
  /// **'تحقق ومتابعة'**
  String get otpVerify;

  /// No description provided for @otpSecureNote.
  ///
  /// In ar, this message translates to:
  /// **'رمز آمن · سينتهي خلال ٥ دقائق'**
  String get otpSecureNote;

  /// No description provided for @forgotEyebrow.
  ///
  /// In ar, this message translates to:
  /// **'استعادة الحساب'**
  String get forgotEyebrow;

  /// No description provided for @forgotTitle.
  ///
  /// In ar, this message translates to:
  /// **'نسيت كلمة المرور؟'**
  String get forgotTitle;

  /// No description provided for @forgotBody.
  ///
  /// In ar, this message translates to:
  /// **'أدخل رقم هاتفك، وسنرسل رمزاً لإعادة تعيين كلمة المرور.'**
  String get forgotBody;

  /// No description provided for @forgotChooseMethod.
  ///
  /// In ar, this message translates to:
  /// **'اختر طريقة الاستلام'**
  String get forgotChooseMethod;

  /// No description provided for @channelWhatsapp.
  ///
  /// In ar, this message translates to:
  /// **'واتساب'**
  String get channelWhatsapp;

  /// No description provided for @channelSms.
  ///
  /// In ar, this message translates to:
  /// **'رسالة SMS'**
  String get channelSms;

  /// No description provided for @forgotSendCode.
  ///
  /// In ar, this message translates to:
  /// **'أرسل رمز التحقق'**
  String get forgotSendCode;

  /// No description provided for @forgotRemembered.
  ///
  /// In ar, this message translates to:
  /// **'تذكّرت كلمة المرور؟ '**
  String get forgotRemembered;

  /// No description provided for @forgotBackToSignIn.
  ///
  /// In ar, this message translates to:
  /// **'عد لتسجيل الدخول'**
  String get forgotBackToSignIn;

  /// No description provided for @resetTitle.
  ///
  /// In ar, this message translates to:
  /// **'أنشئ كلمة مرور جديدة'**
  String get resetTitle;

  /// No description provided for @resetBody.
  ///
  /// In ar, this message translates to:
  /// **'يجب أن تختلف عن كلمات المرور السابقة المستخدمة في حسابك.'**
  String get resetBody;

  /// No description provided for @resetSave.
  ///
  /// In ar, this message translates to:
  /// **'حفظ كلمة المرور والدخول'**
  String get resetSave;

  /// No description provided for @resetSuccess.
  ///
  /// In ar, this message translates to:
  /// **'تم تحديث كلمة المرور. سجّل دخولك الآن.'**
  String get resetSuccess;
}

class _L10nDelegate extends LocalizationsDelegate<L10n> {
  const _L10nDelegate();

  @override
  Future<L10n> load(Locale locale) {
    return SynchronousFuture<L10n>(lookupL10n(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['ar', 'en'].contains(locale.languageCode);

  @override
  bool shouldReload(_L10nDelegate old) => false;
}

L10n lookupL10n(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'ar':
      return L10nAr();
    case 'en':
      return L10nEn();
  }

  throw FlutterError(
    'L10n.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
