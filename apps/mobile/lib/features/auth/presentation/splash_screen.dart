import 'package:flutter/material.dart';

import '../../../design/logo.dart';
import '../../../design/tokens.dart';

/// Placeholder — Slice 1 replaces with the full design
/// (`auth-gaps.jsx::SplashScreen`: navy + motif, amber logo circle, loader).
class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: BartalColors.navyInk,
      body: Center(child: LogoMark(color: Colors.white, size: 64)),
    );
  }
}
