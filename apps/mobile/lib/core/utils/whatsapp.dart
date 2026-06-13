import 'package:flutter/foundation.dart';
import 'package:url_launcher/url_launcher.dart';

/// Bartal customer-support WhatsApp line (PRD §2 — WhatsApp is the dominant
/// comms channel in Sudan). Placeholder until the production number is set.
const bartalSupportPhone = '+249912345678';
const bartalSupportPhoneDisplay = '+249 91 234 5678';

/// Opens a `wa.me` chat (external app). [phone] may carry spaces/`+`; only the
/// digits are used. [text] pre-fills the message (e.g. the order number).
Future<void> launchWhatsApp({String phone = bartalSupportPhone, String? text}) async {
  final digits = phone.replaceAll(RegExp(r'[^0-9]'), '');
  final query = (text != null && text.isNotEmpty) ? '?text=${Uri.encodeComponent(text)}' : '';
  final uri = Uri.parse('https://wa.me/$digits$query');
  try {
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  } catch (error) {
    debugPrint('launchWhatsApp failed: $error');
  }
}
