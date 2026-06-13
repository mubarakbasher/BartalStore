import 'package:flutter/foundation.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';

import '../data/receipt_storage_api.dart';

/// Picks a receipt photo (camera or gallery) and compresses it to WebP before
/// upload — small payloads for 2G/3G (CLAUDE.md §2). Returns null when the user
/// cancels the picker (not an error).
class ReceiptPicker {
  ReceiptPicker({ImagePicker? picker}) : _picker = picker ?? ImagePicker();

  final ImagePicker _picker;

  Future<ReceiptImage?> pick(ImageSource source) async {
    final picked = await _picker.pickImage(
      source: source,
      maxWidth: 1600,
      maxHeight: 1600,
      imageQuality: 85,
    );
    if (picked == null) return null; // user cancelled

    try {
      final webp = await FlutterImageCompress.compressWithFile(
        picked.path,
        minWidth: 1600,
        minHeight: 1600,
        quality: 70,
        format: CompressFormat.webp,
      );
      if (webp != null) {
        return ReceiptImage(bytes: webp, filename: 'receipt.webp', mimeType: 'image/webp');
      }
    } catch (error) {
      // WebP encode can fail on some devices — fall back to the original bytes;
      // the server re-encodes to WebP regardless.
      debugPrint('receipt compress failed, sending original: $error');
    }

    final bytes = await picked.readAsBytes();
    final mime = picked.mimeType ?? _mimeFromName(picked.name);
    return ReceiptImage(bytes: bytes, filename: picked.name, mimeType: mime);
  }

  String _mimeFromName(String name) {
    final lower = name.toLowerCase();
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.webp')) return 'image/webp';
    return 'image/jpeg';
  }
}

final receiptPickerProvider = Provider<ReceiptPicker>((ref) => ReceiptPicker());
