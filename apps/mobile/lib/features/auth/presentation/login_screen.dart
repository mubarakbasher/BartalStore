import 'package:flutter/material.dart';

/// Placeholder — Slice 1 replaces with phone+password form
/// (`auth-screens.jsx::LoginScreen`).
class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key, this.from});

  final String? from;

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: Text('Login — Slice 1')));
  }
}
