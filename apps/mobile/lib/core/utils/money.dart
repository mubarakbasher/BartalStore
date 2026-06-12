import 'package:decimal/decimal.dart';
import 'package:intl/intl.dart';

/// Decimal-safe money. The API serializes Prisma `Decimal(12,2)` as a JSON
/// string on raw rows (products) but as a number on mapped views (wishlist),
/// so [Money.parse] accepts both. Never use `double` for arithmetic.
class Money implements Comparable<Money> {
  const Money(this.value);

  final Decimal value;

  static final Money zero = Money(Decimal.zero);

  /// Accepts `num`, numeric `String`, `Decimal`, or `Money`.
  static Money parse(Object? raw) {
    switch (raw) {
      case null:
        throw const FormatException('Money.parse: null');
      case final Money m:
        return m;
      case final Decimal d:
        return Money(d);
      case final int i:
        return Money(Decimal.fromInt(i));
      case final double d:
        return Money(Decimal.parse(d.toString()));
      case final String s:
        return Money(Decimal.parse(s.trim()));
      default:
        throw FormatException('Money.parse: unsupported ${raw.runtimeType}');
    }
  }

  static Money? tryParse(Object? raw) {
    if (raw == null) return null;
    try {
      return parse(raw);
    } on FormatException {
      return null;
    }
  }

  Money operator +(Money other) => Money(value + other.value);
  Money operator -(Money other) => Money(value - other.value);
  Money operator *(int qty) => Money(value * Decimal.fromInt(qty));
  bool operator >(Money other) => value > other.value;
  bool operator <(Money other) => value < other.value;

  @override
  int compareTo(Money other) => value.compareTo(other.value);

  @override
  bool operator ==(Object other) => other is Money && other.value == value;

  @override
  int get hashCode => value.hashCode;

  @override
  String toString() => value.toString();
}

const _arabicDigits = '٠١٢٣٤٥٦٧٨٩';

/// Locale-aware SDG digits — exact port of `fmtSDG` in
/// `packages/shared/src/design/tokens.ts` (the variant the web app ships):
/// en-US grouping (`185,000`), then digit-map to Arabic-Indic for AR.
/// The group separator stays `,` in both locales, matching web output.
/// The currency unit (`ج.س` / `SDG`) is rendered separately by `PriceTag`.
String fmtSDG(Object amount, {required bool arabic}) {
  final money = amount is Money ? amount : Money.parse(amount);
  // en-US default: grouped, up to 3 fraction digits (Intl.NumberFormat
  // parity). Display-only double conversion — SDG amounts at Decimal(12,2)
  // sit far inside double's 2^53 exact-integer range, so no drift here;
  // arithmetic stays on Decimal.
  final latin = NumberFormat('#,##0.###', 'en_US').format(money.value.toDouble());
  if (!arabic) return latin;
  final buffer = StringBuffer();
  for (final rune in latin.runes) {
    if (rune >= 0x30 && rune <= 0x39) {
      buffer.write(_arabicDigits[rune - 0x30]);
    } else {
      buffer.writeCharCode(rune);
    }
  }
  return buffer.toString();
}

/// Arabic-Indic digit mapping for non-money numerals (counts, ratings).
String localizedDigits(String input, {required bool arabic}) {
  if (!arabic) return input;
  final buffer = StringBuffer();
  for (final rune in input.runes) {
    if (rune >= 0x30 && rune <= 0x39) {
      buffer.write(_arabicDigits[rune - 0x30]);
    } else {
      buffer.writeCharCode(rune);
    }
  }
  return buffer.toString();
}
