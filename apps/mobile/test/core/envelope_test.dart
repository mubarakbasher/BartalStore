import 'package:bartal_mobile/core/api/api_exception.dart';
import 'package:bartal_mobile/core/api/envelope.dart';
import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';

Response<dynamic> _response(Object? body, [int status = 200]) => Response(
      requestOptions: RequestOptions(path: '/test'),
      statusCode: status,
      data: body,
    );

void main() {
  group('parseEnvelope', () {
    test('unwraps success data', () {
      final result = parseEnvelope(
        _response({'success': true, 'data': {'id': 'p1'}}),
        (data) => (data as Map<String, dynamic>)['id'] as String,
      );
      expect(result, 'p1');
    });

    test('throws bilingual ApiException on error envelope', () {
      expect(
        () => parseEnvelope(
          _response({
            'success': false,
            'error': {
              'code': 'PRODUCT_NOT_FOUND',
              'message_en': 'Product not found.',
              'message_ar': 'المنتج غير موجود.',
              'status': 404,
            },
          }, 404),
          (data) => data,
        ),
        throwsA(
          isA<ApiException>()
              .having((e) => e.code, 'code', 'PRODUCT_NOT_FOUND')
              .having((e) => e.messageAr, 'messageAr', 'المنتج غير موجود.')
              .having((e) => e.status, 'status', 404)
              .having((e) => e.localized(arabic: true), 'localized ar', 'المنتج غير موجود.'),
        ),
      );
    });

    test('throws malformed on non-envelope body', () {
      expect(
        () => parseEnvelope(_response('<html>gateway error</html>', 502), (d) => d),
        throwsA(isA<ApiException>().having((e) => e.code, 'code', 'MALFORMED_RESPONSE')),
      );
    });
  });

  group('parsePaginated', () {
    test('unwraps items + meta', () {
      final page = parsePaginated(
        _response({
          'success': true,
          'data': [
            {'id': 'a'},
            {'id': 'b'},
          ],
          'meta': {'page': 1, 'limit': 20, 'total': 42, 'totalPages': 3},
        }),
        (item) => item['id'] as String,
      );
      expect(page.items, ['a', 'b']);
      expect(page.meta.total, 42);
      expect(page.meta.hasMore, isTrue);
    });
  });

  group('toApiException', () {
    test('timeout DioException → network error', () {
      final error = toApiException(
        DioException(
          requestOptions: RequestOptions(path: '/x'),
          type: DioExceptionType.connectionTimeout,
        ),
      );
      expect(error.isNetwork, isTrue);
    });

    test('DioException carrying an error envelope body → mapped', () {
      final error = toApiException(
        DioException(
          requestOptions: RequestOptions(path: '/x'),
          response: _response({
            'success': false,
            'error': {
              'code': 'OUT_OF_STOCK',
              'message_en': 'Out of stock.',
              'message_ar': 'نفذت الكمية.',
              'status': 409,
            },
          }, 409),
        ),
      );
      expect(error.code, 'OUT_OF_STOCK');
      expect(error.status, 409);
    });
  });
}
