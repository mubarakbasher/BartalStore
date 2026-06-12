import 'package:flutter/material.dart';

/// Placeholder — Slice 2 replaces with search results + filters bottom sheet
/// (`mobile-extras.jsx::SearchResultsScreen` + `FiltersSheet`).
class SearchScreen extends StatelessWidget {
  const SearchScreen({super.key, this.initialQuery});

  final String? initialQuery;

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: Text('Search — Slice 2')));
  }
}
