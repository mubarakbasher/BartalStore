import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/app_button.dart';
import '../../auth/application/auth_controller.dart';

/// Slice 5 builds the full profile dashboard
/// (`profile-flow.jsx::ProfileScreen`: navy motif hero, stats, menu
/// sections). Minimal identity + logout until then.
class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final auth = ref.watch(authControllerProvider);
    final user = switch (auth.valueOrNull) {
      Authenticated(:final user) => user,
      _ => null,
    };

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsetsDirectional.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(l10n.navProfile, style: context.bartalType.h1),
              const SizedBox(height: 16),
              if (user != null) ...[
                Text(user.name, style: context.bartalType.h3),
                const SizedBox(height: 4),
                Text(user.phone, style: context.bartalType.mono),
              ],
              const Spacer(),
              AppButton(
                label: l10n.authLogout,
                expand: true,
                onPressed: () => ref.read(authControllerProvider.notifier).logout(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
