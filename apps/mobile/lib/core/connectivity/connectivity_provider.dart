import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// True when the device reports any network transport. Drives the offline
/// banner and (Slice 3) the cart op-queue replay. 2G counts as online —
/// the API client's timeouts absorb slow links.
final connectivityProvider = StreamProvider<bool>((ref) async* {
  final connectivity = Connectivity();
  final initial = await connectivity.checkConnectivity();
  yield _isOnline(initial);
  await for (final result in connectivity.onConnectivityChanged) {
    yield _isOnline(result);
  }
});

bool _isOnline(List<ConnectivityResult> results) =>
    results.any((r) => r != ConnectivityResult.none);

/// Last known connectivity as a plain bool (defaults to online while the
/// first check is in flight, so we never flash the offline banner on boot).
final isOnlineProvider = Provider<bool>((ref) {
  return ref.watch(connectivityProvider).maybeWhen(
        data: (online) => online,
        orElse: () => true,
      );
});
