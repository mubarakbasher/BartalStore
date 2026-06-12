import 'package:flutter/material.dart';

/// Placeholder — Slice 2 replaces with the rating-breakdown reviews list
/// (`final-additions.jsx::MobilePdpReviewsScreen`).
class ProductReviewsScreen extends StatelessWidget {
  const ProductReviewsScreen({super.key, required this.productId});

  final String productId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: Center(child: Text('Reviews $productId — Slice 2')));
  }
}
