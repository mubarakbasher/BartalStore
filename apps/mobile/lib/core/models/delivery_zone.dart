import '../utils/money.dart';
import 'address.dart';

/// `DeliveryZoneInfo` wire shape (GET /delivery/zones).
class DeliveryZoneInfo {
  const DeliveryZoneInfo({
    required this.zone,
    required this.nameAr,
    required this.nameEn,
    required this.feeSdg,
    required this.freeAboveSdg,
    required this.etaMin,
    required this.etaMax,
  });

  factory DeliveryZoneInfo.fromJson(Map<String, dynamic> json) => DeliveryZoneInfo(
        zone: DeliveryZone.fromWire(json['zone'] as String?),
        nameAr: json['name_ar'] as String? ?? '',
        nameEn: json['name_en'] as String? ?? '',
        feeSdg: Money.parse(json['fee_sdg'] ?? 0),
        freeAboveSdg: Money.tryParse(json['free_above_sdg']),
        etaMin: json['estimated_days_min'] as int? ?? 0,
        etaMax: json['estimated_days_max'] as int? ?? 0,
      );

  final DeliveryZone zone;
  final String nameAr;
  final String nameEn;
  final Money feeSdg;
  final Money? freeAboveSdg;
  final int etaMin;
  final int etaMax;

  String name({required bool arabic}) => arabic ? nameAr : nameEn;
}

/// `GET /delivery/fee?zone=&total=` response — the fee/ETA for a specific
/// zone at a given cart total (free above threshold).
class DeliveryFee {
  const DeliveryFee({
    required this.fee,
    required this.freeDelivery,
    required this.threshold,
    required this.etaMin,
    required this.etaMax,
  });

  factory DeliveryFee.fromJson(Map<String, dynamic> json) => DeliveryFee(
        fee: Money.parse(json['fee_sdg'] ?? 0),
        freeDelivery: json['free_delivery'] as bool? ?? false,
        threshold: Money.tryParse(json['threshold_sdg']),
        etaMin: json['estimated_days_min'] as int? ?? 0,
        etaMax: json['estimated_days_max'] as int? ?? 0,
      );

  final Money fee;
  final bool freeDelivery;
  final Money? threshold;
  final int etaMin;
  final int etaMax;
}
