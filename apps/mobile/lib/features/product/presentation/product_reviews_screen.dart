import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../../core/connectivity/connectivity_provider.dart';
import '../../../core/models/review.dart';
import '../../../core/utils/money.dart';
import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../design/tokens.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/error_screen.dart';
import '../../../widgets/screen_header.dart';
import '../../../widgets/skeletons.dart';
import '../../catalog/application/catalog_providers.dart';

enum _ReviewSort { newest, highest, lowest }

extension on _ReviewSort {
  String get wire => switch (this) {
        _ReviewSort.newest => 'newest',
        _ReviewSort.highest => 'highest',
        _ReviewSort.lowest => 'lowest',
      };
}

/// Read-only product reviews — port of final-additions.jsx::MobilePdpReviews.
/// Summary card with rating breakdown, a sort control (the only filter the
/// API supports), paged review cards, and a disabled write-review CTA
/// (review authoring lands in Slice 4). City/title/photos/helpful actions in
/// the design have no API backing and are intentionally omitted.
class ProductReviewsScreen extends ConsumerStatefulWidget {
  const ProductReviewsScreen({super.key, required this.productId});

  final String productId;

  @override
  ConsumerState<ProductReviewsScreen> createState() => _ProductReviewsScreenState();
}

class _ProductReviewsScreenState extends ConsumerState<ProductReviewsScreen> {
  final _scroll = ScrollController();
  _ReviewSort _sort = _ReviewSort.newest;
  final List<Review> _items = [];
  ReviewSummary? _summary;
  int _page = 0;
  int _totalPages = 1;
  bool _loading = false;
  bool _initialDone = false;
  Object? _error;

  @override
  void initState() {
    super.initState();
    _scroll.addListener(_onScroll);
    _load(reset: true);
  }

  @override
  void dispose() {
    _scroll.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scroll.position.pixels >= _scroll.position.maxScrollExtent - 400) {
      if (_page < _totalPages && !_loading) _load();
    }
  }

  Future<void> _load({bool reset = false}) async {
    if (_loading) return;
    setState(() {
      _loading = true;
      if (reset) {
        _items.clear();
        _page = 0;
        _totalPages = 1;
        _initialDone = false;
        _error = null;
      }
    });
    try {
      final page = await ref
          .read(catalogApiProvider)
          .reviews(widget.productId, page: _page + 1, sort: _sort.wire);
      setState(() {
        _items.addAll(page.items);
        _summary = page.summary;
        _page = page.page;
        _totalPages = page.totalPages;
      });
    } catch (error) {
      setState(() => _error = error);
    } finally {
      setState(() {
        _loading = false;
        _initialDone = true;
      });
    }
  }

  void _setSort(_ReviewSort sort) {
    if (sort == _sort) return;
    setState(() => _sort = sort);
    _load(reset: true);
  }

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final count = _summary?.count ?? 0;

    return Scaffold(
      backgroundColor: bartal.bg,
      body: Column(
        children: [
          ScreenHeader(
            title: _initialDone
                ? l10n.pdpReviewsWithCount(localizedDigits('$count', arabic: isAr))
                : l10n.productsReviewsTitle,
          ),
          Expanded(
            child: !_initialDone
                ? const ListSkeleton()
                : (_error != null && _items.isEmpty
                    ? ErrorState(
                        kind: ref.read(isOnlineProvider)
                            ? ErrorScreenKind.error
                            : ErrorScreenKind.offline,
                        onRetry: () => _load(reset: true),
                      )
                    : _items.isEmpty
                        ? _EmptyReviews()
                        : ListView(
                        controller: _scroll,
                        padding: const EdgeInsetsDirectional.only(bottom: 90),
                        children: [
                          if (_summary != null) _SummaryCard(summary: _summary!),
                          _SortRow(sort: _sort, onChanged: _setSort),
                          for (final review in _items)
                            Padding(
                              padding: const EdgeInsetsDirectional.fromSTEB(16, 0, 16, 10),
                              child: _ReviewCard(review: review),
                            ),
                          if (_loading)
                            const Padding(
                              padding: EdgeInsetsDirectional.all(16),
                              child: Center(child: CircularProgressIndicator()),
                            ),
                        ],
                      )),
          ),
        ],
      ),
      bottomNavigationBar: _initialDone ? _WriteReviewBar(productId: widget.productId) : null,
    );
  }
}

class _SummaryCard extends StatelessWidget {
  const _SummaryCard({required this.summary});

  final ReviewSummary summary;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';
    final average = summary.averageRating ?? 0;

    return Container(
      margin: const EdgeInsetsDirectional.fromSTEB(16, 0, 16, 14),
      padding: const EdgeInsetsDirectional.all(16),
      decoration: BoxDecoration(
        color: bartal.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: bartal.line),
      ),
      child: Row(
        children: [
          Column(
            children: [
              Text(
                localizedDigits(average.toStringAsFixed(1), arabic: isAr),
                style: context.bartalType.display.copyWith(fontSize: 40, height: 1),
              ),
              const SizedBox(height: 4),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  for (var i = 0; i < 5; i++)
                    Padding(
                      padding: const EdgeInsetsDirectional.only(end: 2),
                      child: BartalIcon(
                        BartalIcons.star,
                        color: i < average.round() ? BartalColors.amber : bartal.line,
                        size: 11,
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 4),
              Text(
                l10n.reviewCount(localizedDigits('${summary.count}', arabic: isAr)),
                style: context.bartalType.micro,
              ),
            ],
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              children: [
                for (var star = 5; star >= 1; star--)
                  Padding(
                    padding: const EdgeInsetsDirectional.only(bottom: 4),
                    child: Row(
                      children: [
                        SizedBox(
                          width: 12,
                          child: Text(
                            localizedDigits('$star', arabic: isAr),
                            style: TextStyle(fontSize: 11, color: bartal.textMute),
                          ),
                        ),
                        const SizedBox(width: 4),
                        const BartalIcon(BartalIcons.star, color: BartalColors.amber, size: 9),
                        const SizedBox(width: 8),
                        Expanded(
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(3),
                            child: LinearProgressIndicator(
                              value: summary.share(star),
                              minHeight: 5,
                              backgroundColor: bartal.line,
                              valueColor: const AlwaysStoppedAnimation(BartalColors.amber),
                            ),
                          ),
                        ),
                        SizedBox(
                          width: 28,
                          child: Text(
                            localizedDigits('${summary.distribution[star] ?? 0}', arabic: isAr),
                            textAlign: TextAlign.end,
                            style: TextStyle(fontSize: 11, color: bartal.textMute),
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SortRow extends StatelessWidget {
  const _SortRow({required this.sort, required this.onChanged});

  final _ReviewSort sort;
  final ValueChanged<_ReviewSort> onChanged;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    String label(_ReviewSort s) => switch (s) {
          _ReviewSort.newest => l10n.reviewSortNewest,
          _ReviewSort.highest => l10n.reviewSortHighest,
          _ReviewSort.lowest => l10n.reviewSortLowest,
        };
    return Padding(
      padding: const EdgeInsetsDirectional.fromSTEB(16, 0, 16, 10),
      child: Row(
        children: [
          for (final s in _ReviewSort.values) ...[
            Padding(
              padding: const EdgeInsetsDirectional.only(end: 6),
              child: GestureDetector(
                onTap: () => onChanged(s),
                child: Container(
                  padding: const EdgeInsetsDirectional.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: s == sort ? BartalColors.navy : bartal.surface,
                    borderRadius: BorderRadius.circular(100),
                    border: Border.all(color: s == sort ? BartalColors.navy : bartal.line),
                  ),
                  child: Text(
                    label(s),
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: s == sort ? Colors.white : bartal.text,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _ReviewCard extends StatelessWidget {
  const _ReviewCard({required this.review});

  final Review review;

  String _initials(String name) {
    final parts = name.trim().split(RegExp(r'\s+'));
    final letters = parts.where((p) => p.isNotEmpty).map((p) => p[0]).take(2).join();
    return letters.toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final arabic = Localizations.localeOf(context).languageCode == 'ar';
    // The design renders English month abbreviations in both locales; only the
    // digits localize. ('en' date symbols ship by default — no init needed.)
    final dateLabel = localizedDigits(
      DateFormat('d MMM yyyy', 'en').format(review.createdAt),
      arabic: arabic,
    );

    return Container(
      padding: const EdgeInsetsDirectional.all(14),
      decoration: BoxDecoration(
        color: bartal.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: bartal.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 34,
                height: 34,
                decoration: BoxDecoration(
                  color: BartalColors.amber.withValues(alpha: 0.19),
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: Text(
                  _initials(review.userName),
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontWeight: FontWeight.w700,
                    fontSize: 12,
                    color: BartalColors.amber,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      review.userName,
                      style: context.bartalType.small.copyWith(
                        color: bartal.text,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    Text(dateLabel, style: context.bartalType.micro),
                  ],
                ),
              ),
              if (review.isVerifiedPurchase)
                Container(
                  padding: const EdgeInsetsDirectional.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: bartal.success.withValues(alpha: 0.13),
                    borderRadius: BorderRadius.circular(100),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      BartalIcon(BartalIcons.check, color: bartal.success, size: 9),
                      const SizedBox(width: 4),
                      Text(
                        l10n.reviewVerified,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: bartal.success,
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              for (var i = 0; i < 5; i++)
                Padding(
                  padding: const EdgeInsetsDirectional.only(end: 2),
                  child: BartalIcon(
                    BartalIcons.star,
                    color: i < review.rating ? BartalColors.amber : bartal.line,
                    size: 11,
                  ),
                ),
            ],
          ),
          if (review.comment != null && review.comment!.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(
              review.comment!,
              style: context.bartalType.body.copyWith(
                fontSize: 13,
                color: bartal.textMute,
                height: 1.55,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _EmptyReviews extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    return Center(
      child: Padding(
        padding: const EdgeInsetsDirectional.symmetric(horizontal: 36),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const BartalIcon(BartalIcons.star, color: BartalColors.amber, size: 40),
            const SizedBox(height: 16),
            Text(
              l10n.pdpNoReviews,
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: bartal.text),
            ),
            const SizedBox(height: 8),
            Text(
              l10n.pdpNoReviewsBody,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, height: 1.6, color: bartal.textMute),
            ),
          ],
        ),
      ),
    );
  }
}

class _WriteReviewBar extends StatelessWidget {
  const _WriteReviewBar({required this.productId});

  final String productId;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    // Verified-purchase only — the screen surfaces NOT_A_BUYER if the caller
    // hasn't received this product (Slice 4).
    return Container(
      decoration: BoxDecoration(
        color: bartal.bg,
        border: Border(top: BorderSide(color: bartal.line)),
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsetsDirectional.all(12),
          child: Material(
            color: bartal.amber,
            borderRadius: BorderRadius.circular(12),
            child: InkWell(
              onTap: () => context.push('/review/$productId'),
              borderRadius: BorderRadius.circular(12),
              child: Container(
                height: 48,
                alignment: Alignment.center,
                child: Text(
                  l10n.pdpWriteReview,
                  style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w700),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
