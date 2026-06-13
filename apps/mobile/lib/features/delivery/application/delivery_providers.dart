import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/endpoints.dart';
import '../../../core/api/envelope.dart';
import '../../../core/models/address.dart';
import '../../../core/models/delivery_zone.dart';
import '../../../core/providers.dart';

/// Delivery zone configs (public). Used for zone names/fees in checkout.
final deliveryZonesProvider = FutureProvider<List<DeliveryZoneInfo>>((ref) async {
  final dio = ref.watch(apiClientProvider);
  final response = await dio.get<dynamic>(Endpoints.deliveryZones, options: publicRequest());
  return parseEnvelope(response, (data) {
    return [for (final z in data as List) DeliveryZoneInfo.fromJson(z as Map<String, dynamic>)];
  });
});

/// Fee + ETA for a given zone at a given cart total (free above threshold).
final deliveryFeeProvider =
    FutureProvider.family<DeliveryFee, ({DeliveryZone zone, int total})>((ref, arg) async {
  final dio = ref.watch(apiClientProvider);
  final response = await dio.get<dynamic>(
    Endpoints.deliveryFee,
    queryParameters: {'zone': arg.zone.wire, 'total': arg.total},
    options: publicRequest(),
  );
  return parseEnvelope(response, (data) => DeliveryFee.fromJson(data as Map<String, dynamic>));
});
