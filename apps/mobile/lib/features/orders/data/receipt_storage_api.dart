import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/endpoints.dart';
import '../../../core/api/envelope.dart';
import '../../../core/providers.dart';

/// A compressed receipt image ready to upload.
class ReceiptImage {
  const ReceiptImage({required this.bytes, required this.filename, required this.mimeType});

  final Uint8List bytes;
  final String filename;

  /// `image/webp` (compressed) or the source mime when compression fell back.
  final String mimeType;

  int get sizeBytes => bytes.length;
}

/// Step 1 of the bank-transfer receipt flow: multipart-upload the image to the
/// private R2 bucket via `POST /storage/receipts` and get back the opaque key.
/// (Auth-only; the server re-encodes to WebP ≤200KB and stores it privately.)
class ReceiptStorageApi {
  ReceiptStorageApi(this._dio);

  final Dio _dio;

  Future<String> upload(String orderId, ReceiptImage image) async {
    final parts = image.mimeType.split('/');
    final form = FormData.fromMap({
      'order_id': orderId,
      'file': MultipartFile.fromBytes(
        image.bytes,
        filename: image.filename,
        contentType: DioMediaType(
          parts.isNotEmpty ? parts.first : 'image',
          parts.length > 1 ? parts[1] : 'webp',
        ),
      ),
    });
    final response = await _dio.post<dynamic>(Endpoints.storageReceipts, data: form);
    return parseEnvelope(response, (data) => (data as Map<String, dynamic>)['key'] as String);
  }
}

final receiptStorageApiProvider = Provider<ReceiptStorageApi>(
  (ref) => ReceiptStorageApi(ref.watch(apiClientProvider)),
);
