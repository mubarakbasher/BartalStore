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

  /// No description provided for @homeDeliveryEta.
  ///
  /// In ar, this message translates to:
  /// **'· {min}-{max} يوم'**
  String homeDeliveryEta(String min, String max);

  /// No description provided for @pdpReviewsWithCount.
  ///
  /// In ar, this message translates to:
  /// **'التقييمات ({count})'**
  String pdpReviewsWithCount(String count);

  /// No description provided for @pdpRatingCount.
  ///
  /// In ar, this message translates to:
  /// **'({count} تقييم)'**
  String pdpRatingCount(String count);

  /// No description provided for @pdpWriteReview.
  ///
  /// In ar, this message translates to:
  /// **'اكتب تقييمك'**
  String get pdpWriteReview;

  /// No description provided for @pdpNoReviews.
  ///
  /// In ar, this message translates to:
  /// **'لا توجد تقييمات بعد'**
  String get pdpNoReviews;

  /// No description provided for @pdpNoReviewsBody.
  ///
  /// In ar, this message translates to:
  /// **'كن أول من يقيّم هذا المنتج بعد استلامه.'**
  String get pdpNoReviewsBody;

  /// No description provided for @reviewCount.
  ///
  /// In ar, this message translates to:
  /// **'{count} تقييم'**
  String reviewCount(String count);

  /// No description provided for @reviewVerified.
  ///
  /// In ar, this message translates to:
  /// **'موثّق'**
  String get reviewVerified;

  /// No description provided for @reviewFilterAll.
  ///
  /// In ar, this message translates to:
  /// **'الكل'**
  String get reviewFilterAll;

  /// No description provided for @reviewSortNewest.
  ///
  /// In ar, this message translates to:
  /// **'الأحدث أولاً'**
  String get reviewSortNewest;

  /// No description provided for @reviewSortHighest.
  ///
  /// In ar, this message translates to:
  /// **'الأعلى تقييماً'**
  String get reviewSortHighest;

  /// No description provided for @reviewSortLowest.
  ///
  /// In ar, this message translates to:
  /// **'الأقل تقييماً'**
  String get reviewSortLowest;

  /// No description provided for @categoriesSearchHint.
  ///
  /// In ar, this message translates to:
  /// **'ابحث في الفئات…'**
  String get categoriesSearchHint;

  /// No description provided for @categoriesSubcategories.
  ///
  /// In ar, this message translates to:
  /// **'الأقسام الفرعية'**
  String get categoriesSubcategories;

  /// No description provided for @categoriesShopName.
  ///
  /// In ar, this message translates to:
  /// **'تسوق {name}'**
  String categoriesShopName(String name);

  /// No description provided for @filtersTitle.
  ///
  /// In ar, this message translates to:
  /// **'الفلاتر'**
  String get filtersTitle;

  /// No description provided for @filtersResetCleared.
  ///
  /// In ar, this message translates to:
  /// **'تم مسح الفلاتر'**
  String get filtersResetCleared;

  /// No description provided for @wishlistSavedCount.
  ///
  /// In ar, this message translates to:
  /// **'{count} منتجات محفوظة'**
  String wishlistSavedCount(String count);

  /// No description provided for @wishlistRemoved.
  ///
  /// In ar, this message translates to:
  /// **'تمت الإزالة من المفضلة'**
  String get wishlistRemoved;

  /// No description provided for @actionFailed.
  ///
  /// In ar, this message translates to:
  /// **'تعذّر إكمال العملية. حاول مرة أخرى.'**
  String get actionFailed;

  /// No description provided for @commonCopied.
  ///
  /// In ar, this message translates to:
  /// **'تم النسخ'**
  String get commonCopied;

  /// No description provided for @commonRequired2.
  ///
  /// In ar, this message translates to:
  /// **'هذا الحقل مطلوب'**
  String get commonRequired2;

  /// No description provided for @cartItemAdded.
  ///
  /// In ar, this message translates to:
  /// **'تمت الإضافة إلى السلة'**
  String get cartItemAdded;

  /// No description provided for @cartViewCart.
  ///
  /// In ar, this message translates to:
  /// **'عرض السلة'**
  String get cartViewCart;

  /// No description provided for @cartOutOfStock.
  ///
  /// In ar, this message translates to:
  /// **'الكمية المتاحة غير كافية'**
  String get cartOutOfStock;

  /// No description provided for @stepAddress.
  ///
  /// In ar, this message translates to:
  /// **'العنوان'**
  String get stepAddress;

  /// No description provided for @stepPayment.
  ///
  /// In ar, this message translates to:
  /// **'الدفع'**
  String get stepPayment;

  /// No description provided for @stepReview.
  ///
  /// In ar, this message translates to:
  /// **'المراجعة'**
  String get stepReview;

  /// No description provided for @checkoutAddressTitle.
  ///
  /// In ar, this message translates to:
  /// **'عنوان التوصيل'**
  String get checkoutAddressTitle;

  /// No description provided for @checkoutNoAddresses.
  ///
  /// In ar, this message translates to:
  /// **'أضف عنوان توصيل للمتابعة'**
  String get checkoutNoAddresses;

  /// No description provided for @checkoutAddNewAddress.
  ///
  /// In ar, this message translates to:
  /// **'إضافة عنوان جديد'**
  String get checkoutAddNewAddress;

  /// No description provided for @checkoutSelected.
  ///
  /// In ar, this message translates to:
  /// **'محدد'**
  String get checkoutSelected;

  /// No description provided for @checkoutEdit.
  ///
  /// In ar, this message translates to:
  /// **'تعديل'**
  String get checkoutEdit;

  /// No description provided for @checkoutDeliveryZone.
  ///
  /// In ar, this message translates to:
  /// **'منطقة التوصيل'**
  String get checkoutDeliveryZone;

  /// No description provided for @checkoutContinueToPayment.
  ///
  /// In ar, this message translates to:
  /// **'متابعة إلى الدفع'**
  String get checkoutContinueToPayment;

  /// No description provided for @paymentMethodTitle.
  ///
  /// In ar, this message translates to:
  /// **'طريقة الدفع'**
  String get paymentMethodTitle;

  /// No description provided for @paymentBankTransfer.
  ///
  /// In ar, this message translates to:
  /// **'تحويل بنكي'**
  String get paymentBankTransfer;

  /// No description provided for @paymentBankSub.
  ///
  /// In ar, this message translates to:
  /// **'حوّل من أي بنك سوداني · ارفع الإيصال بعد التحويل'**
  String get paymentBankSub;

  /// No description provided for @paymentRecommended.
  ///
  /// In ar, this message translates to:
  /// **'موصى به'**
  String get paymentRecommended;

  /// No description provided for @paymentCod.
  ///
  /// In ar, this message translates to:
  /// **'الدفع عند الاستلام'**
  String get paymentCod;

  /// No description provided for @paymentCodSub.
  ///
  /// In ar, this message translates to:
  /// **'ادفع نقداً عند تسليم الطلب'**
  String get paymentCodSub;

  /// No description provided for @paymentWallet.
  ///
  /// In ar, this message translates to:
  /// **'محفظة رقمية'**
  String get paymentWallet;

  /// No description provided for @paymentWalletSub.
  ///
  /// In ar, this message translates to:
  /// **'بنكك · فوري · زين كاش'**
  String get paymentWalletSub;

  /// No description provided for @paymentSoon.
  ///
  /// In ar, this message translates to:
  /// **'قريباً'**
  String get paymentSoon;

  /// No description provided for @paymentContinue.
  ///
  /// In ar, this message translates to:
  /// **'متابعة'**
  String get paymentContinue;

  /// No description provided for @bankStepTitle.
  ///
  /// In ar, this message translates to:
  /// **'حسابات برتال'**
  String get bankStepTitle;

  /// No description provided for @bankChooseTitle.
  ///
  /// In ar, this message translates to:
  /// **'اختر البنك الذي ستحوّل منه'**
  String get bankChooseTitle;

  /// No description provided for @bankChooseBody.
  ///
  /// In ar, this message translates to:
  /// **'لدينا حسابات في عدة بنوك لتسهيل التحويل المحلي. بعد التحويل ستقوم برفع إيصال في الخطوة التالية.'**
  String get bankChooseBody;

  /// No description provided for @bankAccountName.
  ///
  /// In ar, this message translates to:
  /// **'اسم الحساب'**
  String get bankAccountName;

  /// No description provided for @bankAccountNumber.
  ///
  /// In ar, this message translates to:
  /// **'رقم الحساب'**
  String get bankAccountNumber;

  /// No description provided for @bankSwift.
  ///
  /// In ar, this message translates to:
  /// **'سويفت'**
  String get bankSwift;

  /// No description provided for @bankAmount.
  ///
  /// In ar, this message translates to:
  /// **'المبلغ المطلوب'**
  String get bankAmount;

  /// No description provided for @bankReference.
  ///
  /// In ar, this message translates to:
  /// **'المرجع'**
  String get bankReference;

  /// No description provided for @bankImportantNote.
  ///
  /// In ar, this message translates to:
  /// **'ملاحظة مهمة'**
  String get bankImportantNote;

  /// No description provided for @bankNote1.
  ///
  /// In ar, this message translates to:
  /// **'استخدم رقم الطلب كمرجع في التحويل'**
  String get bankNote1;

  /// No description provided for @bankNote2.
  ///
  /// In ar, this message translates to:
  /// **'التحقق يستغرق ٥-١٥ دقيقة في ساعات العمل'**
  String get bankNote2;

  /// No description provided for @bankNote3.
  ///
  /// In ar, this message translates to:
  /// **'ستصلك رسالة عند تأكيد الدفع'**
  String get bankNote3;

  /// No description provided for @bankContinueToReview.
  ///
  /// In ar, this message translates to:
  /// **'متابعة إلى المراجعة'**
  String get bankContinueToReview;

  /// No description provided for @reviewPaymentTitle.
  ///
  /// In ar, this message translates to:
  /// **'الدفع'**
  String get reviewPaymentTitle;

  /// No description provided for @reviewItemsTitle.
  ///
  /// In ar, this message translates to:
  /// **'المنتجات'**
  String get reviewItemsTitle;

  /// No description provided for @reviewQtyEach.
  ///
  /// In ar, this message translates to:
  /// **'الكمية {qty} · {price}'**
  String reviewQtyEach(String qty, String price);

  /// No description provided for @reviewTotalsTitle.
  ///
  /// In ar, this message translates to:
  /// **'الإجمالي'**
  String get reviewTotalsTitle;

  /// No description provided for @reviewTerms.
  ///
  /// In ar, this message translates to:
  /// **'بالضغط على «تأكيد الطلب» فإنك توافق على شروط الاستخدام وسياسة الخصوصية.'**
  String get reviewTerms;

  /// No description provided for @reviewPlaceOrder.
  ///
  /// In ar, this message translates to:
  /// **'تأكيد الطلب'**
  String get reviewPlaceOrder;

  /// No description provided for @confirmTitle.
  ///
  /// In ar, this message translates to:
  /// **'تم استلام طلبك!'**
  String get confirmTitle;

  /// No description provided for @confirmOrderNumber.
  ///
  /// In ar, this message translates to:
  /// **'رقم الطلب'**
  String get confirmOrderNumber;

  /// No description provided for @confirmBankInstructions.
  ///
  /// In ar, this message translates to:
  /// **'تعليمات التحويل البنكي'**
  String get confirmBankInstructions;

  /// No description provided for @confirmAmount.
  ///
  /// In ar, this message translates to:
  /// **'المبلغ'**
  String get confirmAmount;

  /// No description provided for @confirmUploadTitle.
  ///
  /// In ar, this message translates to:
  /// **'رفع صورة الإيصال'**
  String get confirmUploadTitle;

  /// No description provided for @confirmUploadSub.
  ///
  /// In ar, this message translates to:
  /// **'سيتم التحقق من الإيصال خلال ٢٤ ساعة'**
  String get confirmUploadSub;

  /// No description provided for @confirmReceiptLater.
  ///
  /// In ar, this message translates to:
  /// **'يمكنك رفع الإيصال لاحقاً من صفحة الطلب'**
  String get confirmReceiptLater;

  /// No description provided for @confirmCodTitle.
  ///
  /// In ar, this message translates to:
  /// **'ادفع عند الاستلام'**
  String get confirmCodTitle;

  /// No description provided for @confirmCodBody.
  ///
  /// In ar, this message translates to:
  /// **'ستدفع المبلغ نقداً عند تسليم طلبك. سنتواصل معك لتأكيد موعد التوصيل.'**
  String get confirmCodBody;

  /// No description provided for @confirmViewOrder.
  ///
  /// In ar, this message translates to:
  /// **'عرض الطلب'**
  String get confirmViewOrder;

  /// No description provided for @confirmContinueShopping.
  ///
  /// In ar, this message translates to:
  /// **'متابعة التسوق'**
  String get confirmContinueShopping;

  /// No description provided for @addressNewTitle.
  ///
  /// In ar, this message translates to:
  /// **'عنوان جديد'**
  String get addressNewTitle;

  /// No description provided for @addressLabelTitle.
  ///
  /// In ar, this message translates to:
  /// **'التسمية'**
  String get addressLabelTitle;

  /// No description provided for @labelHome.
  ///
  /// In ar, this message translates to:
  /// **'المنزل'**
  String get labelHome;

  /// No description provided for @labelWork.
  ///
  /// In ar, this message translates to:
  /// **'العمل'**
  String get labelWork;

  /// No description provided for @labelOther.
  ///
  /// In ar, this message translates to:
  /// **'آخر'**
  String get labelOther;

  /// No description provided for @addressContactTitle.
  ///
  /// In ar, this message translates to:
  /// **'جهة الاتصال'**
  String get addressContactTitle;

  /// No description provided for @addressFullName.
  ///
  /// In ar, this message translates to:
  /// **'الاسم الكامل'**
  String get addressFullName;

  /// No description provided for @addressPhone.
  ///
  /// In ar, this message translates to:
  /// **'رقم الهاتف'**
  String get addressPhone;

  /// No description provided for @addressStreetTitle.
  ///
  /// In ar, this message translates to:
  /// **'العنوان التفصيلي'**
  String get addressStreetTitle;

  /// No description provided for @addressDistrict.
  ///
  /// In ar, this message translates to:
  /// **'الحي / الشارع / رقم المنزل'**
  String get addressDistrict;

  /// No description provided for @addressDistrictHint.
  ///
  /// In ar, this message translates to:
  /// **'مثال: الرياض، بلوك ٣٢، منزل ١٤'**
  String get addressDistrictHint;

  /// No description provided for @addressCity.
  ///
  /// In ar, this message translates to:
  /// **'المدينة'**
  String get addressCity;

  /// No description provided for @addressLandmark.
  ///
  /// In ar, this message translates to:
  /// **'علامة مميزة'**
  String get addressLandmark;

  /// No description provided for @addressLandmarkHelp.
  ///
  /// In ar, this message translates to:
  /// **'ساعد السائق على إيجاد عنوانك بسرعة'**
  String get addressLandmarkHelp;

  /// No description provided for @addressLandmarkHint.
  ///
  /// In ar, this message translates to:
  /// **'مثال: بجانب مسجد النور'**
  String get addressLandmarkHint;

  /// No description provided for @addressNotesTitle.
  ///
  /// In ar, this message translates to:
  /// **'ملاحظات للسائق'**
  String get addressNotesTitle;

  /// No description provided for @addressNotesHint.
  ///
  /// In ar, this message translates to:
  /// **'اختياري — اتصل عند الوصول، الطابق الثاني…'**
  String get addressNotesHint;

  /// No description provided for @addressSetDefault.
  ///
  /// In ar, this message translates to:
  /// **'تعيين كعنوان افتراضي'**
  String get addressSetDefault;

  /// No description provided for @addressSave.
  ///
  /// In ar, this message translates to:
  /// **'حفظ العنوان'**
  String get addressSave;

  /// No description provided for @addressLandmarkRequired.
  ///
  /// In ar, this message translates to:
  /// **'العلامة المميزة مطلوبة (٣ أحرف على الأقل)'**
  String get addressLandmarkRequired;

  /// No description provided for @addressNameRequired.
  ///
  /// In ar, this message translates to:
  /// **'الاسم مطلوب'**
  String get addressNameRequired;

  /// No description provided for @addressDistrictRequired.
  ///
  /// In ar, this message translates to:
  /// **'الحي مطلوب'**
  String get addressDistrictRequired;

  /// No description provided for @ordersFilterAll.
  ///
  /// In ar, this message translates to:
  /// **'الكل'**
  String get ordersFilterAll;

  /// No description provided for @ordersFilterProcessing.
  ///
  /// In ar, this message translates to:
  /// **'قيد التجهيز'**
  String get ordersFilterProcessing;

  /// No description provided for @ordersFilterShipping.
  ///
  /// In ar, this message translates to:
  /// **'قيد الشحن'**
  String get ordersFilterShipping;

  /// No description provided for @ordersFilterCompleted.
  ///
  /// In ar, this message translates to:
  /// **'مكتملة'**
  String get ordersFilterCompleted;

  /// No description provided for @ordersItemCount.
  ///
  /// In ar, this message translates to:
  /// **'{count} منتج'**
  String ordersItemCount(String count);

  /// No description provided for @orderStatusPending.
  ///
  /// In ar, this message translates to:
  /// **'قيد الانتظار'**
  String get orderStatusPending;

  /// No description provided for @orderStatusAwaitingPayment.
  ///
  /// In ar, this message translates to:
  /// **'بانتظار الدفع'**
  String get orderStatusAwaitingPayment;

  /// No description provided for @orderStatusReceiptUploaded.
  ///
  /// In ar, this message translates to:
  /// **'إيصال قيد المراجعة'**
  String get orderStatusReceiptUploaded;

  /// No description provided for @orderStatusPaymentConfirmed.
  ///
  /// In ar, this message translates to:
  /// **'تم تأكيد الدفع'**
  String get orderStatusPaymentConfirmed;

  /// No description provided for @orderStatusPaymentRejected.
  ///
  /// In ar, this message translates to:
  /// **'تم رفض الدفع'**
  String get orderStatusPaymentRejected;

  /// No description provided for @orderStatusProcessing.
  ///
  /// In ar, this message translates to:
  /// **'قيد التجهيز'**
  String get orderStatusProcessing;

  /// No description provided for @orderStatusShipped.
  ///
  /// In ar, this message translates to:
  /// **'تم الشحن'**
  String get orderStatusShipped;

  /// No description provided for @orderStatusDelivered.
  ///
  /// In ar, this message translates to:
  /// **'تم التوصيل'**
  String get orderStatusDelivered;

  /// No description provided for @orderStatusCancelled.
  ///
  /// In ar, this message translates to:
  /// **'ملغى'**
  String get orderStatusCancelled;

  /// No description provided for @orderStatusRefunded.
  ///
  /// In ar, this message translates to:
  /// **'تم الاسترداد'**
  String get orderStatusRefunded;

  /// No description provided for @orderDetailTitle.
  ///
  /// In ar, this message translates to:
  /// **'تفاصيل الطلب'**
  String get orderDetailTitle;

  /// No description provided for @orderItemsWithCount.
  ///
  /// In ar, this message translates to:
  /// **'المنتجات ({count})'**
  String orderItemsWithCount(String count);

  /// No description provided for @orderItemQty.
  ///
  /// In ar, this message translates to:
  /// **'الكمية: {count}'**
  String orderItemQty(String count);

  /// No description provided for @orderDeliveryTo.
  ///
  /// In ar, this message translates to:
  /// **'التوصيل إلى'**
  String get orderDeliveryTo;

  /// No description provided for @orderPaymentSummary.
  ///
  /// In ar, this message translates to:
  /// **'ملخص الدفع'**
  String get orderPaymentSummary;

  /// No description provided for @orderBankRefLine.
  ///
  /// In ar, this message translates to:
  /// **'مرجع: {ref}'**
  String orderBankRefLine(String ref);

  /// No description provided for @orderHelpTitle.
  ///
  /// In ar, this message translates to:
  /// **'تحتاج مساعدة؟'**
  String get orderHelpTitle;

  /// No description provided for @orderHelpWhatsapp.
  ///
  /// In ar, this message translates to:
  /// **'راسلنا على واتساب: {phone}'**
  String orderHelpWhatsapp(String phone);

  /// No description provided for @orderContactWhatsapp.
  ///
  /// In ar, this message translates to:
  /// **'تواصل عبر واتساب'**
  String get orderContactWhatsapp;

  /// No description provided for @orderAwaitingReceiptMessage.
  ///
  /// In ar, this message translates to:
  /// **'أكمل طلبك برفع إيصال التحويل البنكي. سيتم التأكيد خلال ٥–١٥ دقيقة.'**
  String get orderAwaitingReceiptMessage;

  /// No description provided for @orderUnderReviewMessage.
  ///
  /// In ar, this message translates to:
  /// **'نراجع إيصالك الآن. ستصلك رسالة خلال ٥–١٥ دقيقة.'**
  String get orderUnderReviewMessage;

  /// No description provided for @orderUploadReceiptCta.
  ///
  /// In ar, this message translates to:
  /// **'رفع الإيصال'**
  String get orderUploadReceiptCta;

  /// No description provided for @orderReuploadReceiptCta.
  ///
  /// In ar, this message translates to:
  /// **'إعادة رفع الإيصال'**
  String get orderReuploadReceiptCta;

  /// No description provided for @orderTrackCta.
  ///
  /// In ar, this message translates to:
  /// **'تتبع الطلب'**
  String get orderTrackCta;

  /// No description provided for @orderCancelCta.
  ///
  /// In ar, this message translates to:
  /// **'إلغاء الطلب'**
  String get orderCancelCta;

  /// No description provided for @orderCodNote.
  ///
  /// In ar, this message translates to:
  /// **'ستدفع نقداً عند توصيل طلبك.'**
  String get orderCodNote;

  /// No description provided for @orderRejectedTitle.
  ///
  /// In ar, this message translates to:
  /// **'تعذر التحقق من الإيصال'**
  String get orderRejectedTitle;

  /// No description provided for @orderRejectedMessage.
  ///
  /// In ar, this message translates to:
  /// **'لم نتمكن من قراءة المبلغ أو الرقم المرجعي. يرجى رفع صورة أوضح.'**
  String get orderRejectedMessage;

  /// No description provided for @orderRejectedNoteTitle.
  ///
  /// In ar, this message translates to:
  /// **'ملاحظة من فريق التحقق'**
  String get orderRejectedNoteTitle;

  /// No description provided for @orderCancelDialogTitle.
  ///
  /// In ar, this message translates to:
  /// **'إلغاء هذا الطلب؟'**
  String get orderCancelDialogTitle;

  /// No description provided for @orderCancelDialogBody.
  ///
  /// In ar, this message translates to:
  /// **'لا يمكن التراجع عن هذا الإجراء. يمكنك إخبارنا بالسبب (اختياري).'**
  String get orderCancelDialogBody;

  /// No description provided for @orderCancelReasonHint.
  ///
  /// In ar, this message translates to:
  /// **'السبب (اختياري)'**
  String get orderCancelReasonHint;

  /// No description provided for @orderCancelConfirm.
  ///
  /// In ar, this message translates to:
  /// **'إلغاء الطلب'**
  String get orderCancelConfirm;

  /// No description provided for @orderCancelKeep.
  ///
  /// In ar, this message translates to:
  /// **'الاحتفاظ بالطلب'**
  String get orderCancelKeep;

  /// No description provided for @orderCancelledToast.
  ///
  /// In ar, this message translates to:
  /// **'تم إلغاء الطلب'**
  String get orderCancelledToast;

  /// No description provided for @uploadReceiptTitle.
  ///
  /// In ar, this message translates to:
  /// **'رفع الإيصال'**
  String get uploadReceiptTitle;

  /// No description provided for @uploadAmountTitle.
  ///
  /// In ar, this message translates to:
  /// **'المبلغ المطلوب تحويله'**
  String get uploadAmountTitle;

  /// No description provided for @uploadRefShort.
  ///
  /// In ar, this message translates to:
  /// **'المرجع'**
  String get uploadRefShort;

  /// No description provided for @uploadTransferTo.
  ///
  /// In ar, this message translates to:
  /// **'التحويل إلى'**
  String get uploadTransferTo;

  /// No description provided for @uploadBankLabel.
  ///
  /// In ar, this message translates to:
  /// **'البنك'**
  String get uploadBankLabel;

  /// No description provided for @uploadReceiptPhoto.
  ///
  /// In ar, this message translates to:
  /// **'صورة الإيصال'**
  String get uploadReceiptPhoto;

  /// No description provided for @uploadTakePhoto.
  ///
  /// In ar, this message translates to:
  /// **'التقط صورة الإيصال'**
  String get uploadTakePhoto;

  /// No description provided for @uploadPhotoHint.
  ///
  /// In ar, this message translates to:
  /// **'تأكد من وضوح رقم المرجع والمبلغ والتاريخ'**
  String get uploadPhotoHint;

  /// No description provided for @uploadCamera.
  ///
  /// In ar, this message translates to:
  /// **'كاميرا'**
  String get uploadCamera;

  /// No description provided for @uploadGallery.
  ///
  /// In ar, this message translates to:
  /// **'من المعرض'**
  String get uploadGallery;

  /// No description provided for @uploadTip1.
  ///
  /// In ar, this message translates to:
  /// **'الصورة واضحة وغير مظلمة'**
  String get uploadTip1;

  /// No description provided for @uploadTip2.
  ///
  /// In ar, this message translates to:
  /// **'رقم المرجع {ref} ظاهر'**
  String uploadTip2(String ref);

  /// No description provided for @uploadTip3.
  ///
  /// In ar, this message translates to:
  /// **'المبلغ يطابق الإجمالي'**
  String get uploadTip3;

  /// No description provided for @uploadSubmit.
  ///
  /// In ar, this message translates to:
  /// **'إرسال الإيصال للمراجعة'**
  String get uploadSubmit;

  /// No description provided for @uploadSubmitted.
  ///
  /// In ar, this message translates to:
  /// **'تم رفع الإيصال'**
  String get uploadSubmitted;

  /// No description provided for @receiptSubmittedTitle.
  ///
  /// In ar, this message translates to:
  /// **'تم استلام الإيصال'**
  String get receiptSubmittedTitle;

  /// No description provided for @receiptSubmittedBody.
  ///
  /// In ar, this message translates to:
  /// **'نراجع إيصالك الآن. ستتلقى إشعاراً خلال ٥–١٥ دقيقة.'**
  String get receiptSubmittedBody;

  /// No description provided for @receiptStepOrderPlaced.
  ///
  /// In ar, this message translates to:
  /// **'تم الطلب'**
  String get receiptStepOrderPlaced;

  /// No description provided for @receiptStepUnderReview.
  ///
  /// In ar, this message translates to:
  /// **'قيد المراجعة'**
  String get receiptStepUnderReview;

  /// No description provided for @receiptStepConfirmed.
  ///
  /// In ar, this message translates to:
  /// **'مؤكد · قيد التجهيز'**
  String get receiptStepConfirmed;

  /// No description provided for @receiptStepPending.
  ///
  /// In ar, this message translates to:
  /// **'قيد الانتظار'**
  String get receiptStepPending;

  /// No description provided for @trackingTitle.
  ///
  /// In ar, this message translates to:
  /// **'تتبع الطلب'**
  String get trackingTitle;

  /// No description provided for @trackingStatusLabel.
  ///
  /// In ar, this message translates to:
  /// **'الحالة'**
  String get trackingStatusLabel;

  /// No description provided for @trackingProgressTitle.
  ///
  /// In ar, this message translates to:
  /// **'التقدم'**
  String get trackingProgressTitle;

  /// No description provided for @trackingOrderLabel.
  ///
  /// In ar, this message translates to:
  /// **'رقم الطلب'**
  String get trackingOrderLabel;

  /// No description provided for @trackingSupportBody.
  ///
  /// In ar, this message translates to:
  /// **'راسلنا على واتساب وسنساعدك في هذا الطلب.'**
  String get trackingSupportBody;

  /// No description provided for @trackingOnTheWay.
  ///
  /// In ar, this message translates to:
  /// **'في الطريق إليك'**
  String get trackingOnTheWay;

  /// No description provided for @trackingPreparing.
  ///
  /// In ar, this message translates to:
  /// **'جاري تجهيز طلبك'**
  String get trackingPreparing;

  /// No description provided for @trackingDeliveredHeadline.
  ///
  /// In ar, this message translates to:
  /// **'تم التسليم'**
  String get trackingDeliveredHeadline;

  /// No description provided for @trackingConfirmedHeadline.
  ///
  /// In ar, this message translates to:
  /// **'تم تأكيد الدفع'**
  String get trackingConfirmedHeadline;

  /// No description provided for @writeReviewRatingLabel.
  ///
  /// In ar, this message translates to:
  /// **'تقييمك'**
  String get writeReviewRatingLabel;

  /// No description provided for @writeReviewRating1.
  ///
  /// In ar, this message translates to:
  /// **'سيء'**
  String get writeReviewRating1;

  /// No description provided for @writeReviewRating2.
  ///
  /// In ar, this message translates to:
  /// **'مقبول'**
  String get writeReviewRating2;

  /// No description provided for @writeReviewRating3.
  ///
  /// In ar, this message translates to:
  /// **'جيد'**
  String get writeReviewRating3;

  /// No description provided for @writeReviewRating4.
  ///
  /// In ar, this message translates to:
  /// **'جيد جداً'**
  String get writeReviewRating4;

  /// No description provided for @writeReviewRating5.
  ///
  /// In ar, this message translates to:
  /// **'ممتاز'**
  String get writeReviewRating5;

  /// No description provided for @writeReviewTagsTitle.
  ///
  /// In ar, this message translates to:
  /// **'ما أعجبك؟'**
  String get writeReviewTagsTitle;

  /// No description provided for @writeReviewTag1.
  ///
  /// In ar, this message translates to:
  /// **'يدوم طويلاً'**
  String get writeReviewTag1;

  /// No description provided for @writeReviewTag2.
  ///
  /// In ar, this message translates to:
  /// **'رائحة قوية'**
  String get writeReviewTag2;

  /// No description provided for @writeReviewTag3.
  ///
  /// In ar, this message translates to:
  /// **'تغليف فاخر'**
  String get writeReviewTag3;

  /// No description provided for @writeReviewTag4.
  ///
  /// In ar, this message translates to:
  /// **'توصيل سريع'**
  String get writeReviewTag4;

  /// No description provided for @writeReviewDetailsTitle.
  ///
  /// In ar, this message translates to:
  /// **'تفاصيل (اختياري)'**
  String get writeReviewDetailsTitle;

  /// No description provided for @writeReviewDetailsHint.
  ///
  /// In ar, this message translates to:
  /// **'شاركنا ما أعجبك أو ما يمكن تحسينه…'**
  String get writeReviewDetailsHint;

  /// No description provided for @writeReviewSubmit.
  ///
  /// In ar, this message translates to:
  /// **'نشر التقييم'**
  String get writeReviewSubmit;

  /// No description provided for @writeReviewVerifiedBuyer.
  ///
  /// In ar, this message translates to:
  /// **'مشتر موثّق'**
  String get writeReviewVerifiedBuyer;

  /// No description provided for @writeReviewRatingRequired.
  ///
  /// In ar, this message translates to:
  /// **'اضغط نجمة للتقييم'**
  String get writeReviewRatingRequired;

  /// No description provided for @writeReviewSuccess.
  ///
  /// In ar, this message translates to:
  /// **'تم إرسال تقييمك — سيظهر بعد الموافقة عليه.'**
  String get writeReviewSuccess;

  /// No description provided for @commonContact.
  ///
  /// In ar, this message translates to:
  /// **'تواصل'**
  String get commonContact;

  /// No description provided for @profileVerified.
  ///
  /// In ar, this message translates to:
  /// **'موثّق'**
  String get profileVerified;

  /// No description provided for @profileMemberSince.
  ///
  /// In ar, this message translates to:
  /// **'عضو منذ {year}'**
  String profileMemberSince(String year);

  /// No description provided for @profileStatOrders.
  ///
  /// In ar, this message translates to:
  /// **'طلب'**
  String get profileStatOrders;

  /// No description provided for @profileStatWishlist.
  ///
  /// In ar, this message translates to:
  /// **'مفضلة'**
  String get profileStatWishlist;

  /// No description provided for @profileStatPoints.
  ///
  /// In ar, this message translates to:
  /// **'نقاط'**
  String get profileStatPoints;

  /// No description provided for @profileSectionOrders.
  ///
  /// In ar, this message translates to:
  /// **'طلباتي ومدفوعاتي'**
  String get profileSectionOrders;

  /// No description provided for @profileSectionAccount.
  ///
  /// In ar, this message translates to:
  /// **'الحساب'**
  String get profileSectionAccount;

  /// No description provided for @profileSectionPreferences.
  ///
  /// In ar, this message translates to:
  /// **'التفضيلات'**
  String get profileSectionPreferences;

  /// No description provided for @profileSectionSupport.
  ///
  /// In ar, this message translates to:
  /// **'الدعم'**
  String get profileSectionSupport;

  /// No description provided for @profileMyOrders.
  ///
  /// In ar, this message translates to:
  /// **'طلباتي'**
  String get profileMyOrders;

  /// No description provided for @profileMyAddresses.
  ///
  /// In ar, this message translates to:
  /// **'عناويني'**
  String get profileMyAddresses;

  /// No description provided for @profileAddressesCount.
  ///
  /// In ar, this message translates to:
  /// **'{count} محفوظة'**
  String profileAddressesCount(String count);

  /// No description provided for @profilePersonalInfo.
  ///
  /// In ar, this message translates to:
  /// **'المعلومات الشخصية'**
  String get profilePersonalInfo;

  /// No description provided for @profilePersonalInfoSub.
  ///
  /// In ar, this message translates to:
  /// **'الاسم، الهاتف، البريد'**
  String get profilePersonalInfoSub;

  /// No description provided for @profileSecurity.
  ///
  /// In ar, this message translates to:
  /// **'الأمان'**
  String get profileSecurity;

  /// No description provided for @profileSecuritySub.
  ///
  /// In ar, this message translates to:
  /// **'كلمة المرور'**
  String get profileSecuritySub;

  /// No description provided for @profileSettingsSub.
  ///
  /// In ar, this message translates to:
  /// **'اللغة، الإشعارات، المظهر'**
  String get profileSettingsSub;

  /// No description provided for @profileWishlist.
  ///
  /// In ar, this message translates to:
  /// **'المفضلة'**
  String get profileWishlist;

  /// No description provided for @profileWishlistSub.
  ///
  /// In ar, this message translates to:
  /// **'{count} منتجات'**
  String profileWishlistSub(String count);

  /// No description provided for @profileHelpCenter.
  ///
  /// In ar, this message translates to:
  /// **'مركز المساعدة'**
  String get profileHelpCenter;

  /// No description provided for @profileWhatsappSupport.
  ///
  /// In ar, this message translates to:
  /// **'تواصل عبر واتساب'**
  String get profileWhatsappSupport;

  /// No description provided for @profileAbout.
  ///
  /// In ar, this message translates to:
  /// **'عن برتال'**
  String get profileAbout;

  /// No description provided for @profileFooter.
  ///
  /// In ar, this message translates to:
  /// **'صنع في السودان ❤'**
  String get profileFooter;

  /// No description provided for @profileVersionLine.
  ///
  /// In ar, this message translates to:
  /// **'برتال {version}'**
  String profileVersionLine(String version);

  /// No description provided for @editProfileName.
  ///
  /// In ar, this message translates to:
  /// **'الاسم الكامل'**
  String get editProfileName;

  /// No description provided for @editProfilePhoneVerified.
  ///
  /// In ar, this message translates to:
  /// **'تم التحقق ✓'**
  String get editProfilePhoneVerified;

  /// No description provided for @editProfileEmail.
  ///
  /// In ar, this message translates to:
  /// **'البريد الإلكتروني'**
  String get editProfileEmail;

  /// No description provided for @editProfileDob.
  ///
  /// In ar, this message translates to:
  /// **'تاريخ الميلاد'**
  String get editProfileDob;

  /// No description provided for @editProfileDobHint.
  ///
  /// In ar, this message translates to:
  /// **'اختر التاريخ'**
  String get editProfileDobHint;

  /// No description provided for @editProfileGender.
  ///
  /// In ar, this message translates to:
  /// **'الجنس'**
  String get editProfileGender;

  /// No description provided for @genderMale.
  ///
  /// In ar, this message translates to:
  /// **'ذكر'**
  String get genderMale;

  /// No description provided for @genderFemale.
  ///
  /// In ar, this message translates to:
  /// **'أنثى'**
  String get genderFemale;

  /// No description provided for @genderOther.
  ///
  /// In ar, this message translates to:
  /// **'آخر'**
  String get genderOther;

  /// No description provided for @editProfileSave.
  ///
  /// In ar, this message translates to:
  /// **'حفظ التغييرات'**
  String get editProfileSave;

  /// No description provided for @editProfileSaved.
  ///
  /// In ar, this message translates to:
  /// **'تم حفظ التغييرات'**
  String get editProfileSaved;

  /// No description provided for @editProfileEmailInvalid.
  ///
  /// In ar, this message translates to:
  /// **'بريد إلكتروني غير صالح'**
  String get editProfileEmailInvalid;

  /// No description provided for @changePwTitle.
  ///
  /// In ar, this message translates to:
  /// **'تغيير كلمة المرور'**
  String get changePwTitle;

  /// No description provided for @changePwIntro.
  ///
  /// In ar, this message translates to:
  /// **'يجب أن تكون كلمة المرور ٨ أحرف على الأقل وتحتوي على رقم.'**
  String get changePwIntro;

  /// No description provided for @changePwCurrent.
  ///
  /// In ar, this message translates to:
  /// **'كلمة المرور الحالية'**
  String get changePwCurrent;

  /// No description provided for @changePwNew.
  ///
  /// In ar, this message translates to:
  /// **'كلمة المرور الجديدة'**
  String get changePwNew;

  /// No description provided for @changePwConfirm.
  ///
  /// In ar, this message translates to:
  /// **'تأكيد كلمة المرور الجديدة'**
  String get changePwConfirm;

  /// No description provided for @changePwForgot.
  ///
  /// In ar, this message translates to:
  /// **'نسيت كلمة المرور الحالية؟'**
  String get changePwForgot;

  /// No description provided for @changePwSubmit.
  ///
  /// In ar, this message translates to:
  /// **'تحديث كلمة المرور'**
  String get changePwSubmit;

  /// No description provided for @changePwMismatch.
  ///
  /// In ar, this message translates to:
  /// **'كلمتا المرور غير متطابقتين'**
  String get changePwMismatch;

  /// No description provided for @changePwSuccessTitle.
  ///
  /// In ar, this message translates to:
  /// **'تم تغيير كلمة المرور'**
  String get changePwSuccessTitle;

  /// No description provided for @changePwSuccessBody.
  ///
  /// In ar, this message translates to:
  /// **'يرجى تسجيل الدخول مرة أخرى بكلمة المرور الجديدة.'**
  String get changePwSuccessBody;

  /// No description provided for @addressesTitle.
  ///
  /// In ar, this message translates to:
  /// **'عناويني'**
  String get addressesTitle;

  /// No description provided for @addressesIntro.
  ///
  /// In ar, this message translates to:
  /// **'عيّن عنواناً افتراضياً للتسليم السريع.'**
  String get addressesIntro;

  /// No description provided for @addressDefault.
  ///
  /// In ar, this message translates to:
  /// **'افتراضي'**
  String get addressDefault;

  /// No description provided for @addressSetDefaultAction.
  ///
  /// In ar, this message translates to:
  /// **'تعيين كافتراضي'**
  String get addressSetDefaultAction;

  /// No description provided for @addressDeleteConfirmTitle.
  ///
  /// In ar, this message translates to:
  /// **'حذف العنوان؟'**
  String get addressDeleteConfirmTitle;

  /// No description provided for @addressDeleteConfirmBody.
  ///
  /// In ar, this message translates to:
  /// **'لا يمكن التراجع عن هذا الإجراء.'**
  String get addressDeleteConfirmBody;

  /// No description provided for @addressDeleted.
  ///
  /// In ar, this message translates to:
  /// **'تم حذف العنوان'**
  String get addressDeleted;

  /// No description provided for @addressEditTitle.
  ///
  /// In ar, this message translates to:
  /// **'تعديل العنوان'**
  String get addressEditTitle;

  /// No description provided for @addressSaveChanges.
  ///
  /// In ar, this message translates to:
  /// **'حفظ التغييرات'**
  String get addressSaveChanges;

  /// No description provided for @settingsSectionLanguage.
  ///
  /// In ar, this message translates to:
  /// **'اللغة والمنطقة'**
  String get settingsSectionLanguage;

  /// No description provided for @settingsLanguage.
  ///
  /// In ar, this message translates to:
  /// **'اللغة'**
  String get settingsLanguage;

  /// No description provided for @settingsLanguageArabic.
  ///
  /// In ar, this message translates to:
  /// **'العربية'**
  String get settingsLanguageArabic;

  /// No description provided for @settingsLanguageEnglish.
  ///
  /// In ar, this message translates to:
  /// **'English'**
  String get settingsLanguageEnglish;

  /// No description provided for @settingsCurrency.
  ///
  /// In ar, this message translates to:
  /// **'العملة'**
  String get settingsCurrency;

  /// No description provided for @settingsCurrencyValue.
  ///
  /// In ar, this message translates to:
  /// **'الجنيه السوداني (ج.س)'**
  String get settingsCurrencyValue;

  /// No description provided for @settingsNumerals.
  ///
  /// In ar, this message translates to:
  /// **'الأرقام'**
  String get settingsNumerals;

  /// No description provided for @settingsNumeralsArabic.
  ///
  /// In ar, this message translates to:
  /// **'عربية (٠-٩)'**
  String get settingsNumeralsArabic;

  /// No description provided for @settingsNumeralsWestern.
  ///
  /// In ar, this message translates to:
  /// **'غربية (123)'**
  String get settingsNumeralsWestern;

  /// No description provided for @settingsSectionAppearance.
  ///
  /// In ar, this message translates to:
  /// **'المظهر'**
  String get settingsSectionAppearance;

  /// No description provided for @settingsDarkMode.
  ///
  /// In ar, this message translates to:
  /// **'الوضع الداكن'**
  String get settingsDarkMode;

  /// No description provided for @settingsOn.
  ///
  /// In ar, this message translates to:
  /// **'مفعّل'**
  String get settingsOn;

  /// No description provided for @settingsOff.
  ///
  /// In ar, this message translates to:
  /// **'مطفأ'**
  String get settingsOff;

  /// No description provided for @settingsTextSize.
  ///
  /// In ar, this message translates to:
  /// **'حجم الخط'**
  String get settingsTextSize;

  /// No description provided for @settingsTextSizeValue.
  ///
  /// In ar, this message translates to:
  /// **'متوسط'**
  String get settingsTextSizeValue;

  /// No description provided for @settingsSectionNotifications.
  ///
  /// In ar, this message translates to:
  /// **'الإشعارات'**
  String get settingsSectionNotifications;

  /// No description provided for @settingsNotifOrders.
  ///
  /// In ar, this message translates to:
  /// **'تحديثات الطلبات'**
  String get settingsNotifOrders;

  /// No description provided for @settingsNotifOrdersSub.
  ///
  /// In ar, this message translates to:
  /// **'SMS + إشعارات التطبيق'**
  String get settingsNotifOrdersSub;

  /// No description provided for @settingsNotifWhatsapp.
  ///
  /// In ar, this message translates to:
  /// **'تنبيهات واتساب'**
  String get settingsNotifWhatsapp;

  /// No description provided for @settingsNotifWhatsappSub.
  ///
  /// In ar, this message translates to:
  /// **'تأكيد الإيصال والتوصيل'**
  String get settingsNotifWhatsappSub;

  /// No description provided for @settingsNotifOffers.
  ///
  /// In ar, this message translates to:
  /// **'العروض والتخفيضات'**
  String get settingsNotifOffers;

  /// No description provided for @settingsNotifOffersSub.
  ///
  /// In ar, this message translates to:
  /// **'بريد إلكتروني فقط'**
  String get settingsNotifOffersSub;

  /// No description provided for @settingsNotifRecommendations.
  ///
  /// In ar, this message translates to:
  /// **'توصيات المنتجات'**
  String get settingsNotifRecommendations;

  /// No description provided for @settingsSectionPrivacy.
  ///
  /// In ar, this message translates to:
  /// **'الخصوصية'**
  String get settingsSectionPrivacy;

  /// No description provided for @settingsMyData.
  ///
  /// In ar, this message translates to:
  /// **'بياناتي'**
  String get settingsMyData;

  /// No description provided for @settingsMyDataSub.
  ///
  /// In ar, this message translates to:
  /// **'تنزيل أو حذف'**
  String get settingsMyDataSub;

  /// No description provided for @settingsActiveSessions.
  ///
  /// In ar, this message translates to:
  /// **'الجلسات النشطة'**
  String get settingsActiveSessions;

  /// No description provided for @settingsSignOutAll.
  ///
  /// In ar, this message translates to:
  /// **'تسجيل الخروج من كل الأجهزة'**
  String get settingsSignOutAll;

  /// No description provided for @settingsSectionAbout.
  ///
  /// In ar, this message translates to:
  /// **'عن التطبيق'**
  String get settingsSectionAbout;

  /// No description provided for @settingsVersion.
  ///
  /// In ar, this message translates to:
  /// **'الإصدار'**
  String get settingsVersion;

  /// No description provided for @settingsTerms.
  ///
  /// In ar, this message translates to:
  /// **'شروط الاستخدام'**
  String get settingsTerms;

  /// No description provided for @settingsPrivacyPolicy.
  ///
  /// In ar, this message translates to:
  /// **'سياسة الخصوصية'**
  String get settingsPrivacyPolicy;

  /// No description provided for @settingsComingSoon.
  ///
  /// In ar, this message translates to:
  /// **'قريباً'**
  String get settingsComingSoon;

  /// No description provided for @notificationsUnread.
  ///
  /// In ar, this message translates to:
  /// **'{count} غير مقروءة'**
  String notificationsUnread(String count);

  /// No description provided for @notificationsMarkAllRead.
  ///
  /// In ar, this message translates to:
  /// **'تحديد الكل كمقروء'**
  String get notificationsMarkAllRead;

  /// No description provided for @notificationsAllRead.
  ///
  /// In ar, this message translates to:
  /// **'تم تحديد الكل كمقروء'**
  String get notificationsAllRead;

  /// No description provided for @helpTitle.
  ///
  /// In ar, this message translates to:
  /// **'مركز المساعدة'**
  String get helpTitle;

  /// No description provided for @helpSearchHint.
  ///
  /// In ar, this message translates to:
  /// **'ابحث في الأسئلة الشائعة'**
  String get helpSearchHint;

  /// No description provided for @helpWhatsappTitle.
  ///
  /// In ar, this message translates to:
  /// **'تواصل عبر واتساب'**
  String get helpWhatsappTitle;

  /// No description provided for @helpWhatsappSub.
  ///
  /// In ar, this message translates to:
  /// **'الرد خلال ١٥ دقيقة · ٨ص-١٠م'**
  String get helpWhatsappSub;

  /// No description provided for @helpBrowseTopics.
  ///
  /// In ar, this message translates to:
  /// **'تصفح حسب الموضوع'**
  String get helpBrowseTopics;

  /// No description provided for @helpTopicOrders.
  ///
  /// In ar, this message translates to:
  /// **'الطلبات والتوصيل'**
  String get helpTopicOrders;

  /// No description provided for @helpTopicPayment.
  ///
  /// In ar, this message translates to:
  /// **'الدفع والإيصالات'**
  String get helpTopicPayment;

  /// No description provided for @helpTopicReturns.
  ///
  /// In ar, this message translates to:
  /// **'الإرجاع والاستبدال'**
  String get helpTopicReturns;

  /// No description provided for @helpTopicAccount.
  ///
  /// In ar, this message translates to:
  /// **'الحساب والأمان'**
  String get helpTopicAccount;

  /// No description provided for @helpTopicArticles.
  ///
  /// In ar, this message translates to:
  /// **'{count} مقالات'**
  String helpTopicArticles(String count);

  /// No description provided for @helpMostAsked.
  ///
  /// In ar, this message translates to:
  /// **'الأكثر شيوعاً'**
  String get helpMostAsked;

  /// No description provided for @helpQ1.
  ///
  /// In ar, this message translates to:
  /// **'كيف أرفع إيصال التحويل البنكي؟'**
  String get helpQ1;

  /// No description provided for @helpA1.
  ///
  /// In ar, this message translates to:
  /// **'بعد إتمام التحويل، افتح «طلباتي» ← اختر الطلب ← اضغط «رفع الإيصال». يقبل التطبيق صور JPG و PNG حتى ١٠ ميجا.'**
  String get helpA1;

  /// No description provided for @helpQ2.
  ///
  /// In ar, this message translates to:
  /// **'متى يتم اعتماد الإيصال؟'**
  String get helpQ2;

  /// No description provided for @helpA2.
  ///
  /// In ar, this message translates to:
  /// **'عادةً خلال ٥–١٥ دقيقة في ساعات العمل. ستصلك رسالة عند التأكيد.'**
  String get helpA2;

  /// No description provided for @helpQ3.
  ///
  /// In ar, this message translates to:
  /// **'ما هي رسوم التوصيل؟'**
  String get helpQ3;

  /// No description provided for @helpA3.
  ///
  /// In ar, this message translates to:
  /// **'تعتمد على منطقتك في الخرطوم، وتظهر عند الدفع. التوصيل مجاني فوق حد معيّن.'**
  String get helpA3;

  /// No description provided for @helpQ4.
  ///
  /// In ar, this message translates to:
  /// **'هل يمكنني الإرجاع بعد التسليم؟'**
  String get helpQ4;

  /// No description provided for @helpA4.
  ///
  /// In ar, this message translates to:
  /// **'نعم، تواصل معنا عبر واتساب خلال ٤٨ ساعة من الاستلام.'**
  String get helpA4;
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
