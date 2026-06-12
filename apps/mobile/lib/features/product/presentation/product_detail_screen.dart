import 'package:flutter/material.dart';

/// Placeholder — Slice 2 replaces with the image-hero PDP + sticky
/// add-to-cart bar (`mobile-v1.jsx::V1Detail`).
class ProductDetailScreen extends StatelessWidget {
  const ProductDetailScreen({super.key, required this.idOrSlug});

  final String idOrSlug;

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: Center(child: Text('Product $idOrSlug — Slice 2')));
  }
}
