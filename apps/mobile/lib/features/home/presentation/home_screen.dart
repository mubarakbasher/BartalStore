import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../design/theme.dart';
import '../../catalog/application/catalog_providers.dart';

/// Placeholder — Slice 2 replaces with the Marketplace Classic home
/// (`mobile-v1.jsx::V1Home`: navy motif header, search, categories grid,
/// featured carousel, new-arrivals grid). For the Slice 0 gate it proves
/// live API connectivity by listing seeded products.
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final home = ref.watch(homeDataProvider);
    final arabic = Localizations.localeOf(context).languageCode == 'ar';
    return Scaffold(
      body: SafeArea(
        child: home.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, _) => Center(child: Text('$error')),
          data: (data) => ListView(
            padding: const EdgeInsetsDirectional.all(16),
            children: [
              Text('Bartal dev boot check', style: context.bartalType.h2),
              const SizedBox(height: 12),
              for (final product in data.newArrivals)
                ListTile(
                  title: Text(product.name(arabic: arabic)),
                  subtitle: Text(product.slug),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
