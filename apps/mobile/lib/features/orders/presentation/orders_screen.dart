import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../widgets/empty_state.dart';

/// Slice 4 builds the real orders list (`secondary-screens.jsx::OrdersScreen`).
/// Until then the tab shows the designed empty state.
class OrdersScreen extends StatelessWidget {
  const OrdersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: EmptyState(
          kind: EmptyStateKind.orders,
          onCta: () => context.go('/home'),
        ),
      ),
    );
  }
}
