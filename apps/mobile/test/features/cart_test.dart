import 'package:bartal_mobile/core/models/cart.dart';
import 'package:bartal_mobile/core/utils/money.dart';
import 'package:bartal_mobile/features/cart/application/cart_controller.dart';
import 'package:decimal/decimal.dart';
import 'package:flutter_test/flutter_test.dart';

CartLine _line(String id, int price, int qty, {int stock = 99}) => CartLine(
      productId: id,
      slug: id,
      nameAr: 'ar',
      nameEn: 'en',
      unitPrice: Money.parse(price),
      imageUrl: null,
      quantity: qty,
      stock: stock,
      isActive: true,
    );

void main() {
  group('CartView.fromJson', () {
    test('parses items + delivery_preview (money as numbers)', () {
      final view = CartView.fromJson({
        'items': [
          {
            'product_id': 'p1',
            'slug': 'karkadeh',
            'name_ar': 'كركديه',
            'name_en': 'Hibiscus',
            'unit_price': 3200,
            'image_url': null,
            'quantity': 2,
            'stock': 980,
            'is_active': true,
          },
        ],
        'total_quantity': 2,
        'subtotal': 6400,
        'delivery_preview': {
          'zone': 'ZONE_A',
          'fee': 500,
          'free_delivery': false,
          'threshold': 50000,
          'eta_days': {'min': 1, 'max': 2},
        },
        'total': 6900,
        'requires_address': false,
      });

      expect(view.items, hasLength(1));
      expect(view.items.first.lineTotal.value, Decimal.fromInt(6400));
      expect(view.subtotal.value, Decimal.fromInt(6400));
      expect(view.deliveryPreview, isNotNull);
      expect(view.deliveryPreview!.fee.value, Decimal.fromInt(500));
      expect(view.deliveryPreview!.etaMax, 2);
      expect(view.requiresAddress, isFalse);
    });

    test('null delivery_preview when no default address', () {
      final view = CartView.fromJson({
        'items': const [],
        'total_quantity': 0,
        'subtotal': 0,
        'delivery_preview': null,
        'total': 0,
        'requires_address': true,
      });
      expect(view.deliveryPreview, isNull);
      expect(view.isEmpty, isTrue);
    });
  });

  test('CartLine prefs round-trips through toJson/fromJson', () {
    final original = _line('p1', 4200, 3);
    final restored = CartLine.fromJson(original.toJson());
    expect(restored.productId, 'p1');
    expect(restored.unitPrice.value, original.unitPrice.value);
    expect(restored.quantity, 3);
    expect(restored.lineTotal.value, Decimal.fromInt(12600));
  });

  group('CartState math (Decimal-safe)', () {
    test('subtotal, total and quantity', () {
      const state = CartState(lines: []);
      expect(state.subtotal.value, Decimal.zero);
      expect(state.totalQuantity, 0);

      final withItems = CartState(lines: [_line('a', 3200, 2), _line('b', 1500, 1)]);
      expect(withItems.totalQuantity, 3);
      expect(withItems.subtotal.value, Decimal.fromInt(7900));
    });

    test('total adds delivery fee when a preview exists', () {
      final preview = DeliveryPreview.fromJson({
        'zone': 'ZONE_B',
        'fee': 800,
        'free_delivery': false,
        'eta_days': {'min': 2, 'max': 3},
      });
      final state = CartState(lines: [_line('a', 10000, 1)], deliveryPreview: preview);
      expect(state.total.value, Decimal.fromInt(10800));
    });

    test('total equals subtotal when guest/no preview', () {
      final state = CartState(lines: [_line('a', 10000, 1)]);
      expect(state.total.value, Decimal.fromInt(10000));
    });
  });
}
