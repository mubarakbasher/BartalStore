import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../design/tokens.dart';
import 'product_placeholder.dart';

/// Product imagery with the striped placeholder while loading / on error /
/// when no image exists. Hue derives from the product id so a given product
/// keeps a stable ramp across screens and sessions.
class ProductImage extends StatelessWidget {
  const ProductImage({
    super.key,
    required this.productId,
    required this.imageUrl,
    this.label = '',
    this.fit = BoxFit.cover,
  });

  final String productId;
  final String? imageUrl;
  final String label;
  final BoxFit fit;

  @override
  Widget build(BuildContext context) {
    final hue = placeholderHueFor(productId);
    final placeholder = ProductPlaceholder(label: label, hue: hue);
    final url = imageUrl;
    if (url == null || url.isEmpty) return placeholder;
    return CachedNetworkImage(
      imageUrl: url,
      fit: fit,
      width: double.infinity,
      height: double.infinity,
      placeholder: (_, _) => placeholder,
      errorWidget: (_, _, _) => placeholder,
      fadeInDuration: const Duration(milliseconds: 200),
    );
  }
}
