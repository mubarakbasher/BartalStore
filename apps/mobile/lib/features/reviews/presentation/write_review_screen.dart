import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/models/product.dart';
import '../../../design/icons.dart';
import '../../../design/theme.dart';
import '../../../l10n/gen/l10n.dart';
import '../../../widgets/product_image.dart';
import '../../../widgets/screen_header.dart';
import '../../catalog/application/catalog_providers.dart';
import '../application/write_review_controller.dart';

/// Verified-purchase review authoring — port of
/// order-thanks-and-reviews.jsx::MobileWriteReview. Star rating (required) +
/// quick-pick tags + free-text details, composed into the single `comment` the
/// API stores. Photos are omitted (no review-photo API field). On success the
/// review is PENDING moderation, so the copy says "submitted for review".
class WriteReviewScreen extends ConsumerStatefulWidget {
  const WriteReviewScreen({super.key, required this.productId});

  final String productId;

  @override
  ConsumerState<WriteReviewScreen> createState() => _WriteReviewScreenState();
}

class _WriteReviewScreenState extends ConsumerState<WriteReviewScreen> {
  int _rating = 0;
  final Set<int> _tags = {};
  final TextEditingController _details = TextEditingController();

  @override
  void dispose() {
    _details.dispose();
    super.dispose();
  }

  List<String> _tagLabels(L10n l10n) =>
      [l10n.writeReviewTag1, l10n.writeReviewTag2, l10n.writeReviewTag3, l10n.writeReviewTag4];

  String _ratingLabel(L10n l10n) => switch (_rating) {
        1 => l10n.writeReviewRating1,
        2 => l10n.writeReviewRating2,
        3 => l10n.writeReviewRating3,
        4 => l10n.writeReviewRating4,
        5 => l10n.writeReviewRating5,
        _ => '',
      };

  Future<void> _submit() async {
    final l10n = L10n.of(context);
    if (_rating == 0) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text(l10n.writeReviewRatingRequired)));
      return;
    }
    final arabic = Localizations.localeOf(context).languageCode == 'ar';
    final parts = [
      for (final i in _tags.toList()..sort()) _tagLabels(l10n)[i],
      if (_details.text.trim().isNotEmpty) _details.text.trim(),
    ];
    final comment = parts.isEmpty ? null : parts.join(' · ');

    final ok = await ref.read(writeReviewControllerProvider.notifier).submit(
          productId: widget.productId,
          rating: _rating,
          comment: comment,
        );
    if (!mounted) return;
    if (ok) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text(l10n.writeReviewSuccess)));
      context.pop();
    } else {
      final error = ref.read(writeReviewControllerProvider.notifier).error;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(error?.localized(arabic: arabic) ?? l10n.errorsGeneric)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final submitting = ref.watch(writeReviewControllerProvider) is AsyncLoading;
    final product = ref.watch(productDetailProvider(widget.productId)).valueOrNull;

    return Scaffold(
      backgroundColor: bartal.bg,
      body: Column(
        children: [
          ScreenHeader(title: l10n.pdpWriteReview),
          Expanded(
            child: ListView(
              padding: const EdgeInsetsDirectional.fromSTEB(16, 0, 16, 16),
              children: [
                if (product != null) _ProductCard(product: product),
                _RatingCard(rating: _rating, label: _ratingLabel(l10n), onRate: (n) => setState(() => _rating = n)),
                _TagsCard(labels: _tagLabels(l10n), selected: _tags, onToggle: (i) {
                  setState(() => _tags.contains(i) ? _tags.remove(i) : _tags.add(i));
                }),
                _DetailsCard(controller: _details),
              ],
            ),
          ),
          SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsetsDirectional.fromSTEB(16, 12, 16, 12),
              child: SizedBox(
                width: double.infinity,
                child: Material(
                  color: bartal.amber,
                  borderRadius: BorderRadius.circular(12),
                  child: InkWell(
                    onTap: submitting ? null : _submit,
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      height: 50,
                      alignment: Alignment.center,
                      child: submitting
                          ? const SizedBox(
                              width: 20, height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                          : Text(l10n.writeReviewSubmit,
                              style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w700)),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ProductCard extends StatelessWidget {
  const _ProductCard({required this.product});

  final Product product;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';

    return Padding(
      padding: const EdgeInsetsDirectional.only(top: 14, bottom: 14),
      child: Container(
        padding: const EdgeInsetsDirectional.all(14),
        decoration: BoxDecoration(
          color: bartal.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: bartal.line),
        ),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: SizedBox(
                width: 56,
                height: 56,
                child: ProductThumb(
                  productId: product.id,
                  imageUrl: product.primaryImageUrl,
                  label: isAr ? product.nameAr : product.nameEn,
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(isAr ? product.nameAr : product.nameEn,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: context.bartalType.small.copyWith(
                          color: bartal.text, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 4),
                  Text('✓ ${l10n.writeReviewVerifiedBuyer}',
                      style: context.bartalType.micro.copyWith(color: bartal.success, letterSpacing: 0)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _RatingCard extends StatelessWidget {
  const _RatingCard({required this.rating, required this.label, required this.onRate});

  final int rating;
  final String label;
  final ValueChanged<int> onRate;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;
    final emptyStar = bartal.isDark ? bartal.line : const Color(0xFFE0DBC9);

    return Padding(
      padding: const EdgeInsetsDirectional.only(bottom: 14),
      child: Container(
        padding: const EdgeInsetsDirectional.all(18),
        decoration: BoxDecoration(
          color: bartal.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: bartal.line),
        ),
        child: Column(
          children: [
            Text(l10n.writeReviewRatingLabel, style: context.bartalType.small),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                for (var n = 1; n <= 5; n++)
                  Semantics(
                    button: true,
                    label: '$n',
                    child: InkResponse(
                      onTap: () => onRate(n),
                      radius: 26,
                      child: Padding(
                        padding: const EdgeInsetsDirectional.all(6),
                        child: BartalIcon(BartalIcons.star,
                            color: rating >= n ? bartal.amber : emptyStar, size: 32),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 8),
            SizedBox(
              height: 20,
              child: Text(label,
                  style: context.bartalType.label.copyWith(color: bartal.amber, fontWeight: FontWeight.w700)),
            ),
          ],
        ),
      ),
    );
  }
}

class _TagsCard extends StatelessWidget {
  const _TagsCard({required this.labels, required this.selected, required this.onToggle});

  final List<String> labels;
  final Set<int> selected;
  final ValueChanged<int> onToggle;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;

    return Padding(
      padding: const EdgeInsetsDirectional.only(bottom: 14),
      child: Container(
        padding: const EdgeInsetsDirectional.all(14),
        decoration: BoxDecoration(
          color: bartal.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: bartal.line),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(l10n.writeReviewTagsTitle,
                style: context.bartalType.small.copyWith(color: bartal.text, fontWeight: FontWeight.w600)),
            const SizedBox(height: 10),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: [
                for (var i = 0; i < labels.length; i++)
                  _TagChip(label: labels[i], on: selected.contains(i), onTap: () => onToggle(i)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _TagChip extends StatelessWidget {
  const _TagChip({required this.label, required this.on, required this.onTap});

  final String label;
  final bool on;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    return Material(
      color: on ? bartal.navy : (bartal.isDark ? bartal.raised : bartal.bg),
      borderRadius: BorderRadius.circular(100),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(100),
        child: Container(
          padding: const EdgeInsetsDirectional.symmetric(horizontal: 12, vertical: 7),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(100),
            border: Border.all(color: on ? bartal.navy : bartal.line),
          ),
          child: Text(
            on ? '✓ $label' : label,
            style: TextStyle(
              color: on ? Colors.white : bartal.text,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }
}

class _DetailsCard extends StatelessWidget {
  const _DetailsCard({required this.controller});

  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    final l10n = L10n.of(context);
    final bartal = context.bartal;

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
          Text(l10n.writeReviewDetailsTitle,
              style: context.bartalType.small.copyWith(color: bartal.text, fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          TextField(
            controller: controller,
            minLines: 3,
            maxLines: 6,
            maxLength: 2000,
            textInputAction: TextInputAction.newline,
            decoration: InputDecoration(
              hintText: l10n.writeReviewDetailsHint,
              filled: true,
              fillColor: bartal.isDark ? bartal.bg : bartal.raised,
              counterText: '',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(color: bartal.line),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(color: bartal.line),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
