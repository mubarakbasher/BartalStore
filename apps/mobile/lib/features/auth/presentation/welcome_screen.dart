import 'package:flutter/material.dart';

/// Placeholder — Slice 1 replaces with the navy motif hero + CTAs
/// (`auth-screens.jsx::WelcomeScreen`).
class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key, this.from});

  /// Deep-link target to continue to after auth (guest hit a gated route).
  final String? from;

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: Text('Welcome — Slice 1')));
  }
}
