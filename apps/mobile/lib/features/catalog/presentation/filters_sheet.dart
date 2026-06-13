import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/utils/money.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/app_button.dart';
import '../application/catalog_providers.dart';
import '../data/catalog_api.dart';

/// Filters bottom sheet — port of mobile-extras.jsx::FiltersSheet: category
/// chips, a price range, and an in-stock toggle. Returns the new
/// [ProductsQuery] (or null on dismiss). The design's brand list and rating
/// rows have no API backing and are omitted.
class FiltersSheet extends ConsumerStatefulWidget {
  const FiltersSheet({super.key, required this.initial});

  final ProductsQuery initial;

  @override
  ConsumerState<FiltersSheet> createState() => _FiltersSheetState();
}

class _FiltersSheetState extends ConsumerState<FiltersSheet> {
  static const _maxPrice = 1000000.0;

  String? _category;
  late RangeValues _price;
  late bool _inStock;

  @override
  void initState() {
    super.initState();
    _category = widget.initial.category;
    _inStock = widget.initial.inStock;
    _price = RangeValues(
      (widget.initial.minPrice ?? 0).toDouble(),
      (widget.initial.maxPrice ?? _maxPrice).toDouble(),
    );
  }

  void _clearAll() {
    setState(() {
      _category = null;
      _price = const RangeValues(0, _maxPrice);
      _inStock = false;
    });
  }

  ProductsQuery _build() {
    return ProductsQuery(
      category: _category,
      minPrice: _price.start > 0 ? _price.start.round() : null,
      maxPrice: _price.end < _maxPrice ? _price.end.round() : null,
      inStock: _inStock,
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final arabic = Localizations.localeOf(context).languageCode == 'ar';
    final categories = ref.watch(categoriesProvider).valueOrNull ?? const [];

    return DraggableScrollableSheet(
      initialChildSize: 0.7,
      minChildSize: 0.4,
      maxChildSize: 0.9,
      expand: false,
      builder: (context, scrollController) {
        return Container(
          decoration: BoxDecoration(
            color: bartal.surface,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            children: [
              const SizedBox(height: 12),
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(color: bartal.line, borderRadius: BorderRadius.circular(2)),
              ),
              Padding(
                padding: const EdgeInsetsDirectional.fromSTEB(18, 12, 18, 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(l10n.filtersTitle, style: context.bartalType.h2),
                    GestureDetector(
                      onTap: _clearAll,
                      child: Text(
                        l10n.searchClearFilters,
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: bartal.amber),
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: ListView(
                  controller: scrollController,
                  padding: EdgeInsets.zero,
                  children: [
                    if (categories.isNotEmpty) ...[
                      _SectionTitle(l10n.searchFilterCategory),
                      Padding(
                        padding: const EdgeInsetsDirectional.fromSTEB(18, 0, 18, 14),
                        child: Wrap(
                          spacing: 6,
                          runSpacing: 6,
                          children: [
                            _CategoryChip(
                              label: l10n.reviewFilterAll,
                              selected: _category == null,
                              onTap: () => setState(() => _category = null),
                            ),
                            for (final cat in categories)
                              _CategoryChip(
                                label: cat.name(arabic: arabic),
                                selected: _category == cat.slug,
                                onTap: () => setState(() => _category = cat.slug),
                              ),
                          ],
                        ),
                      ),
                    ],
                    Divider(color: bartal.line, height: 1),
                    _SectionTitle(l10n.searchFilterPrice),
                    Padding(
                      padding: const EdgeInsetsDirectional.symmetric(horizontal: 18),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            '${fmtSDG(_price.start.round(), arabic: arabic)} ${arabic ? 'ج.س' : 'SDG'}',
                            style: context.bartalType.small.copyWith(color: bartal.text),
                          ),
                          Text(
                            '${fmtSDG(_price.end.round(), arabic: arabic)} ${arabic ? 'ج.س' : 'SDG'}',
                            style: context.bartalType.small.copyWith(color: bartal.text),
                          ),
                        ],
                      ),
                    ),
                    RangeSlider(
                      values: _price,
                      max: _maxPrice,
                      divisions: 100,
                      activeColor: bartal.amber,
                      inactiveColor: bartal.line,
                      labels: RangeLabels(
                        fmtSDG(_price.start.round(), arabic: arabic),
                        fmtSDG(_price.end.round(), arabic: arabic),
                      ),
                      onChanged: (v) => setState(() => _price = v),
                    ),
                    Divider(color: bartal.line, height: 1),
                    SwitchListTile.adaptive(
                      value: _inStock,
                      activeThumbColor: bartal.amber,
                      contentPadding: const EdgeInsetsDirectional.symmetric(horizontal: 18),
                      title: Text(l10n.searchFilterInStock, style: context.bartalType.body),
                      onChanged: (v) => setState(() => _inStock = v),
                    ),
                    const SizedBox(height: 8),
                  ],
                ),
              ),
              SafeArea(
                top: false,
                child: Padding(
                  padding: const EdgeInsetsDirectional.fromSTEB(18, 8, 18, 12),
                  child: Row(
                    children: [
                      AppButton(
                        label: l10n.commonCancel,
                        variant: AppButtonVariant.outline,
                        size: AppButtonSize.large,
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: AppButton(
                          label: l10n.searchApplyFilters,
                          variant: AppButtonVariant.navy,
                          size: AppButtonSize.large,
                          expand: true,
                          onPressed: () => Navigator.of(context).pop(_build()),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsetsDirectional.fromSTEB(18, 14, 18, 8),
      child: Text(text, style: context.bartalType.micro),
    );
  }
}

class _CategoryChip extends StatelessWidget {
  const _CategoryChip({required this.label, required this.selected, required this.onTap});

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsetsDirectional.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: selected ? bartal.amber : Colors.transparent,
          borderRadius: BorderRadius.circular(100),
          border: selected ? null : Border.all(color: bartal.line),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: selected ? Colors.white : bartal.text,
          ),
        ),
      ),
    );
  }
}
