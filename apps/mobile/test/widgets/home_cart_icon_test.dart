import 'package:bartal_mobile/design/icons.dart';
import 'package:bartal_mobile/features/cart/presentation/cart_screen.dart';
import 'package:bartal_mobile/features/home/presentation/home_screen.dart';
import 'package:flutter_test/flutter_test.dart';

import '../support/harness.dart';

/// Regression: the home header cart icon was a dead control (`onTap: () {}`).
/// It must open the cart route.
void main() {
  testWidgets('home header cart icon opens the cart', (tester) async {
    await pumpBartalApp(
      tester,
      overrides: harnessOverrides(
        prefs: await seededPrefs(),
        tokens: await authedTokens(),
        dio: scriptedDio(StatefulScriptedAdapter()),
      ),
    );

    await pumpUntil(tester, () => find.byType(HomeScreen).evaluate().isNotEmpty);

    // The bag glyph in the header is the cart button (the bottom-nav cart tab
    // also uses it, so scope the search to the home screen's own subtree).
    final cartIcon = find.descendant(
      of: find.byType(HomeScreen),
      matching: find.byWidgetPredicate(
        (w) => w is BartalIcon && w.spec == BartalIcons.bag,
      ),
    );
    expect(cartIcon, findsOneWidget);
    await tester.tap(cartIcon);
    await pumpUntil(tester, () => find.byType(CartScreen).evaluate().isNotEmpty);

    expect(find.byType(CartScreen), findsOneWidget);
  });
}
