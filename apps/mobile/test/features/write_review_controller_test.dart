import 'package:bartal_mobile/core/api/api_exception.dart';
import 'package:bartal_mobile/features/reviews/application/write_review_controller.dart';
import 'package:bartal_mobile/features/reviews/data/reviews_api.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

/// Fake authoring API: records the call and optionally throws.
class _FakeReviewsApi implements ReviewsApi {
  _FakeReviewsApi({this.error});

  final Object? error;
  int calls = 0;
  int? lastRating;
  String? lastComment;

  @override
  Future<void> create(String productId, {required int rating, String? comment}) async {
    calls++;
    lastRating = rating;
    lastComment = comment;
    if (error != null) throw error!;
  }
}

ApiException _err(String code, int status) =>
    ApiException(code: code, messageEn: code, messageAr: code, status: status);

void main() {
  test('submit success → returns true, idle (data) state, forwards rating/comment', () async {
    final fake = _FakeReviewsApi();
    final container = ProviderContainer(overrides: [reviewsApiProvider.overrideWithValue(fake)]);
    addTearDown(container.dispose);

    final ok = await container
        .read(writeReviewControllerProvider.notifier)
        .submit(productId: 'p1', rating: 5, comment: 'Great');

    expect(ok, isTrue);
    expect(fake.calls, 1);
    expect(fake.lastRating, 5);
    expect(fake.lastComment, 'Great');
    expect(container.read(writeReviewControllerProvider), isA<AsyncData<void>>());
  });

  test('NOT_A_BUYER → returns false and surfaces the error code', () async {
    final container = ProviderContainer(overrides: [
      reviewsApiProvider.overrideWithValue(_FakeReviewsApi(error: _err('NOT_A_BUYER', 403))),
    ]);
    addTearDown(container.dispose);

    final notifier = container.read(writeReviewControllerProvider.notifier);
    final ok = await notifier.submit(productId: 'p1', rating: 4);

    expect(ok, isFalse);
    expect(notifier.error?.code, 'NOT_A_BUYER');
    expect(container.read(writeReviewControllerProvider), isA<AsyncError<void>>());
  });

  test('REVIEW_ALREADY_EXISTS → returns false and surfaces the error code', () async {
    final container = ProviderContainer(overrides: [
      reviewsApiProvider.overrideWithValue(_FakeReviewsApi(error: _err('REVIEW_ALREADY_EXISTS', 409))),
    ]);
    addTearDown(container.dispose);

    final notifier = container.read(writeReviewControllerProvider.notifier);
    final ok = await notifier.submit(productId: 'p1', rating: 3);

    expect(ok, isFalse);
    expect(notifier.error?.code, 'REVIEW_ALREADY_EXISTS');
  });
}
