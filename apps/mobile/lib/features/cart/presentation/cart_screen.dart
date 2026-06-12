import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../widgets/empty_state.dart';

/// Slice 3 builds the real cart (`secondary-screens.jsx::CartScreen` with
/// server sync + offline op queue). Until then the tab shows the designed
/// empty state.
class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: EmptyState(
          kind: EmptyStateKind.cart,
          onCta: () => context.go('/home'),
        ),
      ),
    );
  }
}
