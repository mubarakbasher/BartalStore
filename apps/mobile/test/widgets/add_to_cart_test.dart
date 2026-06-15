import 'package:bartal_mobile/features/cart/application/cart_controller.dart';
import 'package:bartal_mobile/features/home/presentation/home_screen.dart';
import 'package:bartal_mobile/features/product/presentation/product_detail_screen.dart';
import 'package:bartal_mobile/l10n/gen/l10n.dart';
import 'package:bartal_mobile/router/app_router.dart';
import 'package:bartal_mobile/widgets/app_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../support/harness.dart';

/// Critical flow: an authenticated user opens a product and adds it to the
/// cart. Asserts the live cart-count badge increments 0 → 1 and the
/// confirmation SnackBar appears. Exercises ProductDetailScreen._addToCart →
/// CartController.addProduct → POST /cart/items → cartCountProvider.
void main() {
  testWidgets('add-to-cart increments the badge and confirms', (tester) async {
    final container = await pumpBartalApp(
      tester,
      overrides: harnessOverrides(
        prefs: await seededPrefs(),
        tokens: await authedTokens(),
        dio: scriptedDio(StatefulScriptedAdapter()),
      ),
    );

    await pumpUntil(tester, () => find.byType(HomeScreen).evaluate().isNotEmpty);
    expect(container.read(cartCountProvider), 0);

    container.read(appRouterProvider).go('/product/test-product');
    await pumpUntil(tester, () => find.byType(ProductDetailScreen).evaluate().isNotEmpty);

    final l10n = L10n.of(tester.element(find.byType(ProductDetailScreen)));
    final addButton = find.widgetWithText(AppButton, l10n.productsAddToCart);
    await pumpUntil(tester, () => addButton.evaluate().isNotEmpty);
    await tester.tap(addButton);

    // The confirmation SnackBar appears once the add round-trips; by then the
    // optimistic cart state has settled to one line.
    await pumpUntil(tester, () => find.text(l10n.cartItemAdded).evaluate().isNotEmpty);
    expect(container.read(cartCountProvider), 1);
    expect(find.text(l10n.cartItemAdded), findsWidgets);

    // Dismiss the SnackBar so its auto-dismiss timer doesn't outlive the test.
    tester.firstState<ScaffoldMessengerState>(find.byType(ScaffoldMessenger)).clearSnackBars();
    await tester.pump();
  });
}
