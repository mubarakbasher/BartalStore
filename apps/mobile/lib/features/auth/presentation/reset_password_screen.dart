import 'package:flutter/material.dart';

/// Placeholder — Slice 1 replaces with the strength-meter reset form
/// (`auth-gaps.jsx::ResetPasswordScreen`).
class ResetPasswordScreen extends StatelessWidget {
  const ResetPasswordScreen({super.key, required this.phone, required this.code});

  final String phone;
  final String code;

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: Text('Reset password — Slice 1')));
  }
}
