import 'package:flutter/material.dart';

import '../data/auth_api.dart';

/// Placeholder — Slice 1 replaces with the 6-box OTP entry + resend timer
/// (`auth-screens.jsx::OtpScreen`).
class OtpScreen extends StatelessWidget {
  const OtpScreen({
    super.key,
    required this.phone,
    required this.purpose,
    this.from,
  });

  final String phone;
  final OtpPurpose purpose;
  final String? from;

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: Text('OTP — Slice 1')));
  }
}
