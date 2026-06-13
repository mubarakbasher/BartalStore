import 'package:bartal_mobile/core/models/order.dart';
import 'package:flutter_test/flutter_test.dart';

Map<String, dynamic> _order({
  required String status,
  String paymentMethod = 'BANK_TRANSFER',
  String paymentStatus = 'UNPAID',
  List<Map<String, dynamic>> history = const [],
  String? cancellationReason,
}) {
  return {
    'id': 'o1',
    'order_number': 'BRT-2026-00042',
    'status': status,
    'payment_method': paymentMethod,
    'payment_status': paymentStatus,
    'subtotal': 6400,
    'delivery_fee': 500,
    'discount': 0,
    'total': 6900,
    'receipt_url': null,
    'cancellation_reason': cancellationReason,
    'items': const [],
    'status_history': history,
    'address': null,
    'created_at': '2026-06-13T09:00:00.000Z',
  };
}

void main() {
  group('PaymentStatus.fromWire', () {
    test('round-trips and falls back to unpaid', () {
      for (final s in PaymentStatus.values) {
        expect(PaymentStatus.fromWire(s.wire), s);
      }
      expect(PaymentStatus.fromWire('garbage'), PaymentStatus.unpaid);
      expect(PaymentStatus.fromWire(null), PaymentStatus.unpaid);
    });
  });

  group('OrderView Slice-4 helpers', () {
    test('bank · AWAITING_PAYMENT → can upload + can cancel, not trackable', () {
      final o = OrderView.fromJson(_order(status: 'AWAITING_PAYMENT'));
      expect(o.canUploadReceipt, isTrue);
      expect(o.canCancel, isTrue);
      expect(o.isTrackable, isFalse);
      expect(o.isRejected, isFalse);
    });

    test('bank · PAYMENT_REJECTED → can re-upload, rejectionNote from latest event', () {
      final o = OrderView.fromJson(_order(
        status: 'PAYMENT_REJECTED',
        history: [
          {'status': 'RECEIPT_UPLOADED', 'note': null, 'created_at': '2026-06-13T10:00:00.000Z'},
          {'status': 'PAYMENT_REJECTED', 'note': 'Reference does not match', 'created_at': '2026-06-13T11:00:00.000Z'},
        ],
      ));
      expect(o.isRejected, isTrue);
      expect(o.canUploadReceipt, isTrue);
      expect(o.rejectionNote, 'Reference does not match');
    });

    test('bank · RECEIPT_UPLOADED → cannot upload again, exposes receiptUploadedAt', () {
      final o = OrderView.fromJson(_order(
        status: 'RECEIPT_UPLOADED',
        history: [
          {'status': 'RECEIPT_UPLOADED', 'note': null, 'created_at': '2026-06-13T10:30:00.000Z'},
        ],
      ));
      expect(o.canUploadReceipt, isFalse);
      expect(o.canCancel, isTrue);
      expect(o.receiptUploadedAt, DateTime.parse('2026-06-13T10:30:00.000Z'));
    });

    test('COD · PENDING → cancellable but never receipt-uploadable', () {
      final o = OrderView.fromJson(_order(status: 'PENDING', paymentMethod: 'CASH_ON_DELIVERY'));
      expect(o.isBankTransfer, isFalse);
      expect(o.canUploadReceipt, isFalse);
      expect(o.canCancel, isTrue);
    });

    test('SHIPPED / DELIVERED / PAYMENT_CONFIRMED are trackable and not cancellable', () {
      for (final s in ['PAYMENT_CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']) {
        final o = OrderView.fromJson(_order(status: s));
        expect(o.isTrackable, isTrue, reason: s);
        expect(o.canCancel, isFalse, reason: s);
      }
      expect(OrderView.fromJson(_order(status: 'DELIVERED')).isDelivered, isTrue);
    });

    test('CANCELLED surfaces cancellation_reason via rejectionNote fallback', () {
      final o = OrderView.fromJson(_order(status: 'CANCELLED', cancellationReason: 'Changed my mind'));
      expect(o.canCancel, isFalse);
      expect(o.rejectionNote, 'Changed my mind');
    });
  });
}
