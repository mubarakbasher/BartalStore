import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/api/envelope.dart';
import '../data/reviews_api.dart';

/// Drives the write-review submit. The screen owns the form (rating, comment);
/// this owns the async submit state so the button can show progress and the
/// error (e.g. NOT_A_BUYER, REVIEW_ALREADY_EXISTS) surfaces with the server's
/// bilingual message. `null` = idle.
class WriteReviewController extends AutoDisposeNotifier<AsyncValue<void>?> {
  @override
  AsyncValue<void>? build() => null;

  /// Returns true on success. On failure, [state] holds the [ApiException]
  /// (its `.localized` is the message to show) and the method returns false.
  Future<bool> submit({
    required String productId,
    required int rating,
    String? comment,
  }) async {
    state = const AsyncLoading();
    try {
      await ref.read(reviewsApiProvider).create(productId, rating: rating, comment: comment);
      state = const AsyncData(null);
      return true;
    } catch (error, stack) {
      state = AsyncError(toApiException(error), stack);
      return false;
    }
  }

  ApiException? get error {
    final s = state;
    return s is AsyncError ? s.error as ApiException : null;
  }
}

final writeReviewControllerProvider =
    AutoDisposeNotifierProvider<WriteReviewController, AsyncValue<void>?>(
  WriteReviewController.new,
);
