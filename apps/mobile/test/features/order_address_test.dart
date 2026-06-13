import 'package:bartal_mobile/core/models/address.dart';
import 'package:bartal_mobile/core/models/order.dart';
import 'package:bartal_mobile/features/checkout/data/banks.dart';
import 'package:decimal/decimal.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Address.fromJson', () {
    test('parses fields + zone enum', () {
      final a = Address.fromJson({
        'id': 'a1',
        'label': 'home',
        'full_name': 'Mohammed Osman',
        'phone': '+249912345678',
        'secondary_phone': null,
        'district': 'Al-Riyadh',
        'street': 'block 32',
        'landmark': 'Near Al-Nur Mosque',
        'delivery_notes': null,
        'zone': 'ZONE_B',
        'is_default': true,
      });
      expect(a.fullName, 'Mohammed Osman');
      expect(a.zone, DeliveryZone.zoneB);
      expect(a.isDefault, isTrue);
      expect(a.streetLine, 'block 32 · Al-Riyadh');
    });

    test('DeliveryZone.fromWire falls back to ZONE_A', () {
      expect(DeliveryZone.fromWire('ZONE_D'), DeliveryZone.zoneD);
      expect(DeliveryZone.fromWire('garbage'), DeliveryZone.zoneA);
      expect(DeliveryZone.zoneC.wire, 'ZONE_C');
    });
  });

  group('OrderView.fromJson', () {
    test('parses order number, status, money, items, address', () {
      final order = OrderView.fromJson({
        'id': 'o1',
        'order_number': 'BRT-2026-00042',
        'status': 'AWAITING_PAYMENT',
        'payment_method': 'BANK_TRANSFER',
        'subtotal': 6400,
        'delivery_fee': 500,
        'discount': 0,
        'total': 6900,
        'receipt_url': null,
        'items': [
          {
            'product_id': 'p1',
            'product_name_ar': 'كركديه',
            'product_name_en': 'Hibiscus',
            'product_image': null,
            'quantity': 2,
            'unit_price': 3200,
            'total_price': 6400,
          },
        ],
        'status_history': [
          {'status': 'PENDING', 'note': null, 'created_at': '2026-06-13T09:00:00.000Z'},
        ],
        'address': {
          'label': 'home',
          'full_name': 'Sara Ahmed',
          'phone': '+249912000000',
          'district': 'Omdurman',
          'street': null,
          'landmark': 'Opposite the post office',
          'zone': 'ZONE_B',
        },
        'created_at': '2026-06-13T09:00:00.000Z',
      });

      expect(order.orderNumber, 'BRT-2026-00042');
      expect(order.status, OrderStatus.awaitingPayment);
      expect(order.paymentMethod, PaymentMethod.bankTransfer);
      expect(order.total.value, Decimal.fromInt(6900));
      expect(order.itemCount, 2);
      expect(order.items.first.name(arabic: true), 'كركديه');
      expect(order.statusHistory, hasLength(1));
      expect(order.address!.fullName, 'Sara Ahmed');
    });

    test('status + payment wire mapping is exhaustive and reversible', () {
      for (final s in OrderStatus.values) {
        expect(OrderStatus.fromWire(s.wire), s);
      }
      for (final m in PaymentMethod.values) {
        expect(PaymentMethod.fromWire(m.wire), m);
      }
    });
  });

  group('bartalBanks (mirror of web checkout-banks.ts)', () {
    test('has the 3 design banks with required fields', () {
      expect(bartalBanks, hasLength(3));
      expect(bartalBanks.map((b) => b.id), containsAll(['faisal', 'omdurman', 'khartoum']));
      for (final bank in bartalBanks) {
        expect(bank.account, isNotEmpty);
        expect(bank.swift, isNotEmpty);
        expect(bank.iban, startsWith('SD'));
      }
    });
  });
}
