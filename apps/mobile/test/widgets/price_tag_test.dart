import 'package:bartal_mobile/core/utils/money.dart';
import 'package:bartal_mobile/design/theme.dart';
import 'package:bartal_mobile/l10n/gen/l10n.dart';
import 'package:bartal_mobile/widgets/price_tag.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

Widget _host({required Locale locale, required Widget child}) {
  return MaterialApp(
    locale: locale,
    supportedLocales: L10n.supportedLocales,
    localizationsDelegates: L10n.localizationsDelegates,
    theme: buildBartalTheme(
      brightness: Brightness.light,
      arabic: locale.languageCode == 'ar',
    ),
    home: Scaffold(body: Center(child: child)),
  );
}

void main() {
  testWidgets('AR: Arabic-Indic digits + ج.س unit + RTL direction', (tester) async {
    await tester.pumpWidget(_host(
      locale: const Locale('ar'),
      child: PriceTag(amount: Money.parse(185000)),
    ));

    expect(find.text('١٨٥,٠٠٠'), findsOneWidget);
    expect(find.text('ج.س'), findsOneWidget);
    expect(find.text('SDG'), findsNothing);

    final context = tester.element(find.byType(PriceTag));
    expect(Directionality.of(context), TextDirection.rtl);
  });

  testWidgets('EN: western digits + SDG unit + strikethrough compare', (tester) async {
    await tester.pumpWidget(_host(
      locale: const Locale('en'),
      child: PriceTag(amount: Money.parse(185000), compare: Money.parse(220000)),
    ));

    expect(find.text('185,000'), findsOneWidget);
    expect(find.text('SDG'), findsOneWidget);
    final compare = tester.widget<Text>(find.text('220,000'));
    expect(compare.style?.decoration, TextDecoration.lineThrough);
  });

  testWidgets('RTL smoke: directional padding resolves start-side under AR',
      (tester) async {
    await tester.pumpWidget(_host(
      locale: const Locale('ar'),
      child: PriceTag(amount: Money.parse(500), compare: Money.parse(900)),
    ));
    // The compare price uses EdgeInsetsDirectional.only(start: 6) — under RTL
    // that must resolve to right padding.
    final padding = tester.widget<Padding>(
      find.ancestor(of: find.text('٩٠٠'), matching: find.byType(Padding)).first,
    );
    final resolved = padding.padding.resolve(TextDirection.rtl);
    expect(resolved.right, 6);
    expect(resolved.left, 0);
  });
}
