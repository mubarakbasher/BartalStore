import 'package:bartal_mobile/core/utils/money.dart';
import 'package:decimal/decimal.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Money.parse', () {
    test('accepts int, double, string, Decimal', () {
      expect(Money.parse(185000).value, Decimal.fromInt(185000));
      expect(Money.parse('185000.50').value, Decimal.parse('185000.5'));
      expect(Money.parse(12.5).value, Decimal.parse('12.5'));
      expect(Money.parse(Decimal.parse('9.99')).value, Decimal.parse('9.99'));
    });

    test('Prisma Decimal-as-string survives without float drift', () {
      // 0.1 + 0.2 style traps must not appear.
      final a = Money.parse('0.1') + Money.parse('0.2');
      expect(a.value, Decimal.parse('0.3'));
    });

    test('rejects garbage', () {
      expect(() => Money.parse('abc'), throwsFormatException);
      expect(() => Money.parse(null), throwsFormatException);
      expect(Money.tryParse('abc'), isNull);
      expect(Money.tryParse(null), isNull);
    });

    test('arithmetic and comparison', () {
      final price = Money.parse('42000');
      expect((price * 3).value, Decimal.fromInt(126000));
      expect(price > Money.parse('41999.99'), isTrue);
      expect((price - Money.parse('2000')).value, Decimal.fromInt(40000));
    });
  });

  group('fmtSDG — exact web-parity goldens (design tokens.ts variant)', () {
    test('EN: en-US grouping, western digits', () {
      expect(fmtSDG(0, arabic: false), '0');
      expect(fmtSDG(500, arabic: false), '500');
      expect(fmtSDG(185000, arabic: false), '185,000');
      expect(fmtSDG(1234.5, arabic: false), '1,234.5');
      expect(fmtSDG('620000', arabic: false), '620,000');
    });

    test('AR: same grouping, Arabic-Indic digits, comma separator kept', () {
      expect(fmtSDG(0, arabic: true), '٠');
      expect(fmtSDG(500, arabic: true), '٥٠٠');
      expect(fmtSDG(185000, arabic: true), '١٨٥,٠٠٠');
      expect(fmtSDG(1234.5, arabic: true), '١,٢٣٤.٥');
    });

    test('accepts Money input', () {
      expect(fmtSDG(Money.parse('42000'), arabic: false), '42,000');
      expect(fmtSDG(Money.parse('42000'), arabic: true), '٤٢,٠٠٠');
    });
  });

  group('localizedDigits', () {
    test('maps only digits, leaves the rest', () {
      expect(localizedDigits('4.7 · 128', arabic: true), '٤.٧ · ١٢٨');
      expect(localizedDigits('4.7 · 128', arabic: false), '4.7 · 128');
    });
  });
}
