import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/connectivity/connectivity_provider.dart';
import '../../../core/models/category.dart';
import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/error_screen.dart';
import '../../../widgets/product_image.dart';
import '../application/catalog_providers.dart';

/// All-categories browser — port of final-additions.jsx::MobileCategoriesScreen.
/// Sidebar of top categories + a content pane with a featured hero and a
/// subcategory grid. This is a tab screen (no back button). The design's
/// "top brands" strip has no API backing and is omitted.
class CategoriesScreen extends ConsumerStatefulWidget {
  const CategoriesScreen({super.key});

  @override
  ConsumerState<CategoriesScreen> createState() => _CategoriesScreenState();
}

class _CategoriesScreenState extends ConsumerState<CategoriesScreen> {
  int _active = 0;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final categories = ref.watch(categoriesProvider);

    return Scaffold(
      backgroundColor: bartal.bg,
      body: SafeArea(
        bottom: false,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsetsDirectional.fromSTEB(16, 16, 16, 12),
              child: Text(l10n.navCategories, style: context.bartalType.h1),
            ),
            Padding(
              padding: const EdgeInsetsDirectional.fromSTEB(16, 0, 16, 10),
              child: GestureDetector(
                onTap: () => context.push('/search'),
                child: Container(
                  padding: const EdgeInsetsDirectional.symmetric(horizontal: 12, vertical: 10),
                  decoration: BoxDecoration(
                    color: bartal.surface,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: bartal.line),
                  ),
                  child: Row(
                    children: [
                      BartalIcon(BartalIcons.search, color: bartal.textMute, size: 14),
                      const SizedBox(width: 8),
                      Text(l10n.categoriesSearchHint, style: context.bartalType.small),
                    ],
                  ),
                ),
              ),
            ),
            Expanded(
              child: categories.when(
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (error, _) => ErrorState(
                  kind: ref.read(isOnlineProvider) ? ErrorScreenKind.error : ErrorScreenKind.offline,
                  onRetry: () => ref.invalidate(categoriesProvider),
                ),
                data: (cats) {
                  if (cats.isEmpty) {
                    return const SizedBox.shrink();
                  }
                  final active = _active.clamp(0, cats.length - 1);
                  return Row(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      _Sidebar(
                        categories: cats,
                        active: active,
                        onSelect: (i) => setState(() => _active = i),
                      ),
                      Expanded(child: _ContentPane(category: cats[active])),
                    ],
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Sidebar extends StatelessWidget {
  const _Sidebar({required this.categories, required this.active, required this.onSelect});

  final List<Category> categories;
  final int active;
  final ValueChanged<int> onSelect;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    final arabic = Localizations.localeOf(context).languageCode == 'ar';
    return Container(
      width: 108,
      decoration: BoxDecoration(
        color: bartal.surface,
        border: BorderDirectional(end: BorderSide(color: bartal.line)),
      ),
      child: ListView.builder(
        padding: EdgeInsets.zero,
        itemCount: categories.length,
        itemBuilder: (context, i) {
          final on = i == active;
          final cat = categories[i];
          return GestureDetector(
            onTap: () => onSelect(i),
            behavior: HitTestBehavior.opaque,
            child: Container(
              padding: const EdgeInsetsDirectional.symmetric(horizontal: 10, vertical: 14),
              decoration: BoxDecoration(
                color: on ? bartal.bg : Colors.transparent,
                border: BorderDirectional(
                  start: BorderSide(
                    color: on ? bartal.amber : Colors.transparent,
                    width: 3,
                  ),
                ),
              ),
              child: Column(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: SizedBox(
                      width: 56,
                      height: 56,
                      child: ProductThumb(productId: cat.id, imageUrl: cat.imageUrl),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    cat.name(arabic: arabic),
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 11,
                      height: 1.3,
                      fontWeight: on ? FontWeight.w700 : FontWeight.w500,
                      color: on ? bartal.text : bartal.textMute,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _ContentPane extends StatelessWidget {
  const _ContentPane({required this.category});

  final Category category;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final arabic = Localizations.localeOf(context).languageCode == 'ar';
    final subs = category.children;

    return ListView(
      padding: const EdgeInsetsDirectional.fromSTEB(14, 14, 14, 80),
      children: [
        GestureDetector(
          onTap: () => context.go('/categories/${category.slug}'),
          child: SizedBox(
            height: 110,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(14),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  ProductThumb(
                    productId: category.id,
                    imageUrl: category.imageUrl,
                    label: category.nameEn,
                  ),
                  DecoratedBox(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.transparent, Color(0xBF0B1930)],
                        stops: [0.3, 1],
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsetsDirectional.all(14),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          l10n.categoriesShopName(category.name(arabic: arabic)),
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        if (subs.isNotEmpty) ...[
          const SizedBox(height: 14),
          Text(l10n.categoriesSubcategories, style: context.bartalType.micro),
          const SizedBox(height: 10),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            childAspectRatio: 2.6,
            children: [
              for (final sub in subs)
                GestureDetector(
                  onTap: () => context.go('/categories/${sub.slug}'),
                  child: Container(
                    padding: const EdgeInsetsDirectional.all(12),
                    decoration: BoxDecoration(
                      color: bartal.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: bartal.line),
                    ),
                    child: Row(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: SizedBox(
                            width: 36,
                            height: 36,
                            child: ProductThumb(productId: sub.id, imageUrl: sub.imageUrl),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            sub.name(arabic: arabic),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: context.bartalType.small.copyWith(
                              color: bartal.text,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ],
      ],
    );
  }
}
