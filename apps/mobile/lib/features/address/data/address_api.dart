import 'package:dio/dio.dart';

import '../../../core/api/endpoints.dart';
import '../../../core/api/envelope.dart';
import '../../../core/models/address.dart';

/// Address CRUD (auth-only). `landmark` is required server-side (3–200).
class AddressApi {
  AddressApi(this._dio);

  final Dio _dio;

  Future<List<Address>> list() async {
    final response = await _dio.get<dynamic>(Endpoints.addresses);
    return parseEnvelope(response, (data) {
      return [for (final a in data as List) Address.fromJson(a as Map<String, dynamic>)];
    });
  }

  Future<Address> create(AddressInput input) async {
    final response = await _dio.post<dynamic>(Endpoints.addresses, data: input.toJson());
    return parseEnvelope(response, (data) => Address.fromJson(data as Map<String, dynamic>));
  }

  Future<Address> setDefault(String id) async {
    final response = await _dio.put<dynamic>('${Endpoints.addresses}/$id/default');
    return parseEnvelope(response, (data) => Address.fromJson(data as Map<String, dynamic>));
  }

  Future<void> delete(String id) async {
    final response = await _dio.delete<dynamic>('${Endpoints.addresses}/$id');
    parseEnvelope(response, (_) => null);
  }
}

/// `CreateAddressDto` payload (mirrors `addressSchema` in @bartal/shared).
class AddressInput {
  const AddressInput({
    required this.label,
    required this.fullName,
    required this.phone,
    this.secondaryPhone,
    required this.district,
    this.street,
    required this.landmark,
    this.deliveryNotes,
    required this.zone,
    this.isDefault,
  });

  final String label;
  final String fullName;
  final String phone;
  final String? secondaryPhone;
  final String district;
  final String? street;
  final String landmark;
  final String? deliveryNotes;
  final DeliveryZone zone;
  final bool? isDefault;

  Map<String, dynamic> toJson() => {
        'label': label,
        'full_name': fullName,
        'phone': phone,
        if (secondaryPhone != null && secondaryPhone!.isNotEmpty) 'secondary_phone': secondaryPhone,
        'district': district,
        if (street != null && street!.isNotEmpty) 'street': street,
        'landmark': landmark,
        if (deliveryNotes != null && deliveryNotes!.isNotEmpty) 'delivery_notes': deliveryNotes,
        'zone': zone.wire,
        if (isDefault != null) 'is_default': isDefault,
      };
}
