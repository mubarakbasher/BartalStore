import 'package:bartal_mobile/core/utils/phone_validator.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('normalizeSudanPhone (parity with @bartal/shared phone.ts)', () {
    test('accepts all five documented input shapes', () {
      const expected = '+249912345678';
      expect(normalizeSudanPhone('0912345678'), expected);
      expect(normalizeSudanPhone('912345678'), expected);
      expect(normalizeSudanPhone('+249912345678'), expected);
      expect(normalizeSudanPhone('00249912345678'), expected);
      expect(normalizeSudanPhone('249912345678'), expected);
    });

    test('tolerates spacing and punctuation', () {
      expect(normalizeSudanPhone('+249 91 234 5678'), '+249912345678');
      expect(normalizeSudanPhone('091-234-5678'), '+249912345678');
    });

    test('rejects wrong lengths', () {
      expect(normalizeSudanPhone('12345'), isNull);
      expect(normalizeSudanPhone('09123456789'), isNull);
      expect(normalizeSudanPhone(''), isNull);
    });
  });

  test('isValidSudanPhone strict E.164', () {
    expect(isValidSudanPhone('+249912345678'), isTrue);
    expect(isValidSudanPhone('0912345678'), isFalse);
    expect(isValidSudanPhone('+24991234567'), isFalse);
  });

  test('maskSudanPhone', () {
    expect(maskSudanPhone('+249912345678'), '+24991 ••• ••78');
    expect(maskSudanPhone('garbage'), 'garbage');
  });
}
