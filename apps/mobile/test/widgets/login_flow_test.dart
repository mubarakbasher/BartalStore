import 'package:bartal_mobile/features/auth/application/auth_controller.dart';
import 'package:bartal_mobile/features/auth/presentation/login_screen.dart';
import 'package:bartal_mobile/features/auth/presentation/widgets/auth_atoms.dart';
import 'package:bartal_mobile/features/home/presentation/home_screen.dart';
import 'package:bartal_mobile/l10n/gen/l10n.dart';
import 'package:bartal_mobile/router/app_router.dart';
import 'package:bartal_mobile/widgets/app_button.dart';
import 'package:bartal_mobile/widgets/product_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import '../support/harness.dart';

/// Critical flow: a guest signs in with phone + password and lands on the home
/// tab as an authenticated user. Exercises LoginScreen → AuthController.login →
/// session storage → router redirect, all hermetically (scripted API).
void main() {
  testWidgets('guest logs in with phone + password and reaches home', (tester) async {
    final container = await pumpBartalApp(
      tester,
      overrides: harnessOverrides(
        prefs: await seededPrefs(),
        tokens: await guestTokens(),
        dio: scriptedDio(StatefulScriptedAdapter()),
      ),
    );

    // Guest boot resolves past splash; open the login screen.
    await pumpUntil(tester, () => container.read(authControllerProvider).hasValue);
    container.read(appRouterProvider).go('/login');
    await pumpUntil(tester, () => find.byType(LoginScreen).evaluate().isNotEmpty);

    final l10n = L10n.of(tester.element(find.byType(LoginScreen)));
    await tester.enterText(
      find.descendant(of: find.byType(PhoneAuthField), matching: find.byType(TextField)),
      '912000001',
    );
    await tester.enterText(
      find.descendant(of: find.byType(PasswordAuthField), matching: find.byType(TextField)),
      'Password1!',
    );
    await tester.tap(find.widgetWithText(AppButton, l10n.authSignIn));

    // Land on home with real data (cards present → loading skeleton gone).
    await pumpUntil(tester, () => find.byType(ProductGridCard).evaluate().isNotEmpty);

    expect(find.byType(HomeScreen), findsOneWidget);
    expect(container.read(authControllerProvider).valueOrNull, isA<Authenticated>());
  });
}
