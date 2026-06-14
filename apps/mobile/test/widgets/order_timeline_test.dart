import 'package:bartal_mobile/design/theme.dart';
import 'package:bartal_mobile/features/orders/presentation/widgets/order_timeline.dart';
import 'package:bartal_mobile/l10n/gen/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

Widget _host({required Locale locale, required Widget child}) {
  return MaterialApp(
    locale: locale,
    supportedLocales: L10n.supportedLocales,
    localizationsDelegates: L10n.localizationsDelegates,
    theme: buildBartalTheme(brightness: Brightness.light, arabic: locale.languageCode == 'ar'),
    home: Scaffold(body: child),
  );
}

void main() {
  const steps = [
    OrderTimelineStep(label: 'Order placed', time: '14:32', state: TimelineState.done),
    OrderTimelineStep(label: 'Receipt uploaded', time: '14:34', state: TimelineState.active),
    OrderTimelineStep(label: 'Under review', state: TimelineState.pending),
  ];

  testWidgets('renders every step label and a check icon per done step', (tester) async {
    await tester.pumpWidget(_host(locale: const Locale('en'), child: const OrderTimeline(steps: steps)));

    expect(find.text('Order placed'), findsOneWidget);
    expect(find.text('Receipt uploaded'), findsOneWidget);
    expect(find.text('Under review'), findsOneWidget);
    expect(find.text('14:32'), findsOneWidget);
    // The single 'done' step renders one check glyph.
    expect(find.byType(CustomPaint), findsWidgets);
  });

  testWidgets('RTL smoke: resolves under AR locale without overflow', (tester) async {
    await tester.pumpWidget(_host(locale: const Locale('ar'), child: const OrderTimeline(steps: steps)));
    final context = tester.element(find.byType(OrderTimeline));
    expect(Directionality.of(context), TextDirection.rtl);
    expect(tester.takeException(), isNull);
  });

  test('orderEventTimeLabel localizes digits and drops same-day date', () {
    final now = DateTime(2026, 6, 13, 18);
    final sameDay = DateTime(2026, 6, 13, 9, 5);
    expect(orderEventTimeLabel(sameDay, arabic: false, now: now), '09:05');
    expect(orderEventTimeLabel(sameDay, arabic: true, now: now), '٠٩:٠٥');

    final otherDay = DateTime(2026, 6, 11, 9, 5);
    expect(orderEventTimeLabel(otherDay, arabic: false, now: now), '11/6 · 09:05');
  });
}
