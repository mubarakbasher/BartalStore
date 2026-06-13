import 'package:flutter/material.dart';

import '../core/models/product.dart';
import '../design/theme.dart';
import '../design/tokens.dart';
import '../l10n/gen/l10n.dart';
import 'badges.dart';
import 'price_tag.dart';
import 'product_image.dart';

/// 2-column grid product card — the V1Home "new arrivals" anatomy
/// (surface card, 12px radius, square image, 2-line name, PriceTag). Reused by
/// home, search results, and category listings. Use with a grid
/// `childAspectRatio: 0.70`.
///
/// The list endpoints carry no per-product rating aggregate, so the design's
/// star/rating row is intentionally omitted here (it appears on the PDP, which
/// loads the review summary).
class ProductGridCard extends StatelessWidget {
  const ProductGridCard({super.key, required this.product, required this.onTap});

  final Product product;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final bartal = context.bartal;
    final arabic = Localizations.localeOf(context).languageCode == 'ar';

    return Material(
      color: bartal.surface,
      borderRadius: BorderRadius.circular(BartalRadii.r12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(BartalRadii.r12),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(BartalRadii.r12),
            border: Border.all(color: bartal.line),
          ),
          clipBehavior: Clip.antiAlias,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Stack(
                  children: [
                    Positioned.fill(
                      child: ProductThumb(
                        productId: product.id,
                        imageUrl: product.primaryImageUrl,
                        label: product.nameEn,
                      ),
                    ),
                    if (product.onSale)
                      PositionedDirectional(
                        top: 8,
                        start: 8,
                        child: SaleBadge(label: L10n.of(context).productsSale),
                      ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsetsDirectional.fromSTEB(10, 8, 10, 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(
                      height: 34,
                      child: Text(
                        product.name(arabic: arabic),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: context.bartalType.small
                            .copyWith(color: bartal.text, fontWeight: FontWeight.w600),
                      ),
                    ),
                    const SizedBox(height: 6),
                    PriceTag(
                      amount: product.price,
                      compare: product.comparePrice,
                      size: 13,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
