import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/connectivity/connectivity_provider.dart';
import '../../../core/utils/money.dart';
import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../design/tokens.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/empty_state.dart';
import '../../../widgets/error_screen.dart';
import '../../../widgets/screen_header.dart';
import '../../../widgets/skeletons.dart';
import '../application/catalog_providers.dart';
import '../data/catalog_api.dart';
import 'filters_sheet.dart';
import 'widgets/product_grid_view.dart';

/// Search + browse — port of mobile-extras.jsx::SearchResultsScreen.
/// A live debounced search field over the search endpoint; the filters sheet
/// applies category/price/stock filters. Because the API's search endpoint
/// accepts only `q` (no facets), applying filters clears the query and
/// switches to browse-filter mode.
class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({super.key, this.initialQuery});

  final String? initialQuery;

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  late final TextEditingController _search =
      TextEditingController(text: widget.initialQuery ?? '');
  Timer? _debounce;
  ProductsQuery _query = const ProductsQuery();

  @override
  void initState() {
    super.initState();
    final q = widget.initialQuery?.trim();
    if (q != null && q.isNotEmpty) {
      _query = ProductsQuery(q: q);
    }
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _search.dispose();
    super.dispose();
  }

  void _onSearchChanged(String value) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 400), () {
      final q = value.trim();
      setState(() {
        // Typing a query takes precedence and drops browse filters.
        _query = q.isEmpty ? _query.copyWith(q: '') : ProductsQuery(q: q);
      });
    });
  }

  int get _activeFilterCount {
    var n = 0;
    if (_query.category != null) n++;
    if (_query.minPrice != null || _query.maxPrice != null) n++;
    if (_query.inStock) n++;
    if (_query.sort != null) n++;
    return n;
  }

  Future<void> _openFilters() async {
    final result = await showModalBottomSheet<ProductsQuery>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => FiltersSheet(initial: _query.copyWith(q: '')),
    );
    if (result != null) {
      setState(() {
        _search.clear();
        _query = result; // browse-filter mode (q cleared)
      });
    }
  }

  void _removeCategory() => setState(() => _query = _query.copyWith(clearCategory: true));

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    final products = ref.watch(productsListProvider(_query));

    return Scaffold(
      backgroundColor: bartal.bg,
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            _SearchBar(
              controller: _search,
              onChanged: _onSearchChanged,
              onBack: () => context.pop(),
            ),
            Expanded(
              child: products.when(
                loading: () => const ListSkeleton(),
                error: (error, _) => ErrorState(
                  kind: ref.read(isOnlineProvider) ? ErrorScreenKind.error : ErrorScreenKind.offline,
                  onRetry: () => ref.invalidate(productsListProvider(_query)),
                ),
                data: (state) {
                  final meta = _MetaRow(
                    total: state.total,
                    activeFilters: _activeFilterCount,
                    categorySlug: _query.category,
                    onFilters: _openFilters,
                    onRemoveCategory: _removeCategory,
                  );
                  // Zero results: keep the meta row (so filters stay
                  // adjustable) and replace the grid with the empty state.
                  if (state.items.isEmpty) {
                    return Column(
                      children: [
                        meta,
                        Expanded(
                          child: EmptyState(
                            kind: EmptyStateKind.search,
                            onCta: () => context.go('/categories'),
                          ),
                        ),
                      ],
                    );
                  }
                  return ProductGridView(
                    state: state,
                    onLoadMore: () =>
                        ref.read(productsListProvider(_query).notifier).fetchNextPage(),
                    header: SliverToBoxAdapter(child: meta),
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

class _SearchBar extends StatelessWidget {
  const _SearchBar({required this.controller, required this.onChanged, required this.onBack});

  final TextEditingController controller;
  final ValueChanged<String> onChanged;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    return Padding(
      padding: const EdgeInsetsDirectional.fromSTEB(16, 14, 16, 10),
      child: Row(
        children: [
          BackCircleButton(onBack: onBack),
          const SizedBox(width: 10),
          Expanded(
            child: Container(
              height: 40,
              padding: const EdgeInsetsDirectional.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: bartal.surface,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: bartal.line),
              ),
              child: Row(
                children: [
                  BartalIcon(BartalIcons.search, color: bartal.textMute, size: 14),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      controller: controller,
                      autofocus: controller.text.isEmpty,
                      textInputAction: TextInputAction.search,
                      onChanged: onChanged,
                      style: TextStyle(fontSize: 15, color: bartal.text, fontWeight: FontWeight.w600),
                      decoration: InputDecoration(
                        isCollapsed: true,
                        border: InputBorder.none,
                        hintText: l10n.searchPlaceholder,
                        hintStyle: TextStyle(color: bartal.textMute, fontWeight: FontWeight.w400),
                      ),
                    ),
                  ),
                  if (controller.text.isNotEmpty)
                    Semantics(
                      button: true,
                      label: 'Clear search',
                      child: GestureDetector(
                        onTap: () {
                          controller.clear();
                          onChanged('');
                        },
                        child: Icon(Icons.close, size: 18, color: bartal.textMute),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MetaRow extends ConsumerWidget {
  const _MetaRow({
    required this.total,
    required this.activeFilters,
    required this.categorySlug,
    required this.onFilters,
    required this.onRemoveCategory,
  });

  final int total;
  final int activeFilters;
  final String? categorySlug;
  final VoidCallback onFilters;
  final VoidCallback onRemoveCategory;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = L10n.of(context);
    final isAr = Localizations.localeOf(context).languageCode == 'ar';

    String? categoryLabel;
    if (categorySlug != null) {
      categoryLabel = ref.watch(categoriesProvider).maybeWhen(
            data: (cats) {
              for (final c in cats) {
                if (c.slug == categorySlug) return c.name(arabic: isAr);
              }
              return categorySlug;
            },
            orElse: () => categorySlug,
          );
    }

    return Padding(
      padding: const EdgeInsetsDirectional.fromSTEB(16, 6, 16, 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                l10n.searchResultsCount(localizedDigits('$total', arabic: isAr)),
                style: context.bartalType.small,
              ),
              Semantics(
                button: true,
                child: GestureDetector(
                  onTap: onFilters,
                  child: Container(
                    constraints: const BoxConstraints(minHeight: 44),
                    padding: const EdgeInsetsDirectional.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: BartalColors.navy,
                      borderRadius: BorderRadius.circular(100),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.tune, size: 13, color: Colors.white),
                        const SizedBox(width: 6),
                        Text(
                          activeFilters > 0
                              ? '${l10n.searchFilters} · ${localizedDigits('$activeFilters', arabic: isAr)}'
                              : l10n.searchFilters,
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Colors.white),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          if (categoryLabel != null) ...[
            const SizedBox(height: 8),
            Wrap(
              spacing: 6,
              children: [
                _Chip(label: categoryLabel, onRemove: onRemoveCategory),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _Chip extends StatelessWidget {
  const _Chip({required this.label, required this.onRemove});

  final String label;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return GestureDetector(
      onTap: onRemove,
      child: Container(
        padding: const EdgeInsetsDirectional.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: bartal.amberTint,
          borderRadius: BorderRadius.circular(100),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              label,
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: bartal.amber),
            ),
            const SizedBox(width: 6),
            Icon(Icons.close, size: 12, color: bartal.amber),
          ],
        ),
      ),
    );
  }
}
