import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/models/address.dart';
import '../../../core/providers.dart';
import '../../auth/application/auth_controller.dart';
import '../data/address_api.dart';

final addressApiProvider = Provider<AddressApi>(
  (ref) => AddressApi(ref.watch(apiClientProvider)),
);

/// The user's saved addresses (auth-only). Empty list for guests.
class AddressesController extends AsyncNotifier<List<Address>> {
  AddressApi get _api => ref.read(addressApiProvider);

  @override
  Future<List<Address>> build() async {
    final auth = await ref.watch(authControllerProvider.future);
    if (auth is! Authenticated) return const [];
    return _api.list();
  }

  /// Creates an address and returns it (the list refreshes).
  Future<Address> create(AddressInput input) async {
    final created = await _api.create(input);
    state = AsyncData(await _api.list());
    return created;
  }

  Future<void> setDefault(String id) async {
    await _api.setDefault(id);
    state = AsyncData(await _api.list());
  }

  Future<void> delete(String id) async {
    await _api.delete(id);
    state = AsyncData(await _api.list());
  }
}

final addressesControllerProvider =
    AsyncNotifierProvider<AddressesController, List<Address>>(AddressesController.new);
