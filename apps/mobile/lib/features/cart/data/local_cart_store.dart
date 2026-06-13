import 'dart:convert';

import '../../../core/models/cart.dart';
import '../../../core/storage/app_prefs.dart';

/// Prefs-backed mirror of the cart lines — the canonical client-side cart that
/// survives process death and offline drops (PRD §7.1.3). For guests it IS the
/// cart; for authenticated users it mirrors the server and carries pending
/// (unsynced) state via the `dirty` flag.
class LocalCartStore {
  LocalCartStore(this._prefs);

  static const _linesKey = 'bartal_cart_lines';
  static const _dirtyKey = 'bartal_cart_dirty';

  final AppPrefs _prefs;

  List<CartLine> load() {
    final raw = _prefs.getString(_linesKey);
    if (raw == null || raw.isEmpty) return [];
    try {
      final decoded = jsonDecode(raw) as List;
      return [for (final item in decoded) CartLine.fromJson(item as Map<String, dynamic>)];
    } catch (_) {
      return [];
    }
  }

  Future<void> save(List<CartLine> lines) async {
    await _prefs.setString(_linesKey, jsonEncode([for (final l in lines) l.toJson()]));
  }

  bool get dirty => _prefs.getString(_dirtyKey) == '1';
  Future<void> setDirty(bool value) => _prefs.setString(_dirtyKey, value ? '1' : '0');

  Future<void> clear() async {
    await _prefs.remove(_linesKey);
    await _prefs.remove(_dirtyKey);
  }
}
