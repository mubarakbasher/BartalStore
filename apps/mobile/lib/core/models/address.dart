/// Delivery zone keys (PRD §3.1 — Khartoum zones).
enum DeliveryZone {
  zoneA('ZONE_A'),
  zoneB('ZONE_B'),
  zoneC('ZONE_C'),
  zoneD('ZONE_D');

  const DeliveryZone(this.wire);
  final String wire;

  static DeliveryZone fromWire(String? value) =>
      DeliveryZone.values.firstWhere((z) => z.wire == value, orElse: () => DeliveryZone.zoneA);
}

/// `Address` wire shape (GET/POST/PUT /users/me/addresses). `landmark` is
/// required (Sudan has no postal codes — PRD §3.1).
class Address {
  const Address({
    required this.id,
    required this.label,
    required this.fullName,
    required this.phone,
    required this.secondaryPhone,
    required this.district,
    required this.street,
    required this.landmark,
    required this.deliveryNotes,
    required this.zone,
    required this.isDefault,
  });

  factory Address.fromJson(Map<String, dynamic> json) => Address(
        id: json['id'] as String,
        label: json['label'] as String? ?? '',
        fullName: json['full_name'] as String? ?? '',
        phone: json['phone'] as String? ?? '',
        secondaryPhone: json['secondary_phone'] as String?,
        district: json['district'] as String? ?? '',
        street: json['street'] as String?,
        landmark: json['landmark'] as String? ?? '',
        deliveryNotes: json['delivery_notes'] as String?,
        zone: DeliveryZone.fromWire(json['zone'] as String?),
        isDefault: json['is_default'] as bool? ?? false,
      );

  final String id;
  final String label;
  final String fullName;
  final String phone;
  final String? secondaryPhone;
  final String district;
  final String? street;
  final String landmark;
  final String? deliveryNotes;
  final DeliveryZone zone;
  final bool isDefault;

  /// Single-line street + district for recaps.
  String get streetLine {
    final parts = [if (street != null && street!.isNotEmpty) street!, district];
    return parts.join(' · ');
  }
}
