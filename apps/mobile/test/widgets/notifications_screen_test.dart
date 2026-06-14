import 'dart:convert';

import 'package:bartal_mobile/core/models/notification_item.dart';
import 'package:bartal_mobile/core/providers.dart';
import 'package:bartal_mobile/core/storage/app_prefs.dart';
import 'package:bartal_mobile/design/theme.dart';
import 'package:bartal_mobile/features/notifications/presentation/notifications_screen.dart';
import 'package:bartal_mobile/l10n/gen/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<Widget> _host({required Locale locale, List<NotificationItem> seed = const []}) async {
  SharedPreferences.setMockInitialValues(
    seed.isEmpty ? {} : {'bartal_notifications': jsonEncode([for (final n in seed) n.toJson()])},
  );
  final prefs = await AppPrefs.load();
  return ProviderScope(
    overrides: [appPrefsProvider.overrideWithValue(prefs)],
    child: MaterialApp(
      locale: locale,
      supportedLocales: L10n.supportedLocales,
      localizationsDelegates: L10n.localizationsDelegates,
      theme: buildBartalTheme(brightness: Brightness.light, arabic: locale.languageCode == 'ar'),
      home: const NotificationsScreen(),
    ),
  );
}

NotificationItem _notif(String id, {bool read = false}) => NotificationItem(
      id: id,
      type: AppNotificationType.shipped,
      title: 'Order shipped',
      body: 'BRT-2026-00006',
      createdAt: DateTime(2026, 6, 13, 12),
      read: read,
    );

void main() {
  testWidgets('renders seeded notifications with mark-all-read (RTL)', (tester) async {
    await tester.pumpWidget(await _host(locale: const Locale('ar'), seed: [_notif('1')]));
    await tester.pump();

    expect(find.text('Order shipped'), findsOneWidget);
    expect(find.text('BRT-2026-00006'), findsOneWidget);
    expect(find.text('تحديد الكل كمقروء'), findsOneWidget); // mark all read

    final context = tester.element(find.byType(NotificationsScreen));
    expect(Directionality.of(context), TextDirection.rtl);
  });

  testWidgets('empty inbox shows the empty state, no mark-all-read', (tester) async {
    await tester.pumpWidget(await _host(locale: const Locale('en')));
    await tester.pump();

    expect(find.text('Mark all read'), findsNothing);
    expect(find.text('Order shipped'), findsNothing);
  });
}
