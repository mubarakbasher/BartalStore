/// Sudan phone helpers — port of `packages/shared/src/constants/phone.ts`.
/// Country code +249 followed by 9 subscriber digits (PRD §7.1.1).
const sudanCountryCode = '+249';

final RegExp sudanPhoneRegex = RegExp(r'^\+249\d{9}$');

bool isValidSudanPhone(String phone) => sudanPhoneRegex.hasMatch(phone);

/// Normalize user input to E.164 `+249XXXXXXXXX`.
/// Accepts `0912345678`, `912345678`, `+249912345678`, `00249912345678`,
/// `249912345678`. Returns null when the subscriber part isn't 9 digits.
String? normalizeSudanPhone(String input) {
  final digits = input.replaceAll(RegExp(r'\D'), '');
  String subscriber;
  if (digits.startsWith('00249')) {
    subscriber = digits.substring(5);
  } else if (digits.startsWith('249')) {
    subscriber = digits.substring(3);
  } else if (digits.startsWith('0')) {
    subscriber = digits.substring(1);
  } else {
    subscriber = digits;
  }
  if (subscriber.length != 9) return null;
  return sudanCountryCode + subscriber;
}

/// Mask for display: `+249 91 ••• ••78`.
String maskSudanPhone(String phone) {
  if (!isValidSudanPhone(phone)) return phone;
  return '${phone.substring(0, 6)} ••• ••${phone.substring(phone.length - 2)}';
}
