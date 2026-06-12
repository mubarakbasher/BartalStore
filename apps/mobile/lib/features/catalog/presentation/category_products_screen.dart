import 'package:flutter/material.dart';

/// Placeholder — Slice 2: products within one category (2-col grid reusing
/// the search-results card layout from `mobile-extras.jsx`).
class CategoryProductsScreen extends StatelessWidget {
  const CategoryProductsScreen({super.key, required this.slug});

  final String slug;

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: Center(child: Text('Category $slug — Slice 2')));
  }
}
