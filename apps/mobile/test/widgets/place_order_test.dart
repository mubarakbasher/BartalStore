import 'package:bartal_mobile/features/address/application/addresses_controller.dart';
import 'package:bartal_mobile/features/cart/application/cart_controller.dart';
import 'package:bartal_mobile/features/checkout/application/checkout_controller.dart';
import 'package:bartal_mobile/features/checkout/presentation/checkout_review_screen.dart';
import 'package:bartal_mobile/features/checkout/presentation/confirm_screen.dart';
import 'package:bartal_mobile/features/home/presentation/home_screen.dart';
import 'package:bartal_mobile/l10n/gen/l10n.dart';
import 'package:bartal_mobile/router/app_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import '../support/harness.dart';

/// Critical flow: an authenticated user with a seeded cart + address places an
/// order from the review step and reaches the confirmation screen with the
/// cart cleared. Exercises CheckoutReviewScreen._placeOrder →
/// CheckoutController.placeOrder → POST /orders → cart clear → ConfirmScreen.
void main() {
  testWidgets('placing an order reaches confirmation and clears the cart', (tester) async {
    final container = await pumpBartalApp(
      tester,
      overrides: harnessOverrides(
        prefs: await seededPrefs(),
        tokens: await authedTokens(),
        // Boot with a one-line cart.
        dio: scriptedDio(StatefulScriptedAdapter(initialCartQty: 1)),
      ),
    );

    await pumpUntil(tester, () => find.byType(HomeScreen).evaluate().isNotEmpty);
    await pumpUntil(
      tester,
      () => container.read(cartControllerProvider).valueOrNull?.isEmpty == false,
    );

    // Select the saved address, then jump to the review step.
    container.read(checkoutControllerProvider.notifier).selectAddress('addr_1');
    container.read(appRouterProvider).go('/checkout/review');
    await pumpUntil(tester, () => find.byType(CheckoutReviewScreen).evaluate().isNotEmpty);

    // Wait until the address list loads so the place-order CTA enables.
    await pumpUntil(
      tester,
      () => container.read(addressesControllerProvider).valueOrNull?.isNotEmpty == true,
    );
    await tester.pump(const Duration(milliseconds: 200));

    final l10n = L10n.of(tester.element(find.byType(CheckoutReviewScreen)));
    await tester.tap(find.text(l10n.reviewPlaceOrder));

    // Confirmation renders with the new order number; the cart is cleared.
    await pumpUntil(tester, () => find.text('BRT-2026-09999').evaluate().isNotEmpty);
    expect(find.byType(ConfirmScreen), findsOneWidget);
    expect(container.read(cartCountProvider), 0);
  });
}
