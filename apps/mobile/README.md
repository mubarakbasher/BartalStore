# @bartal/mobile — Flutter mobile app *(Phase 4)*

Not yet scaffolded. Placeholder so the monorepo layout is locked in.

This folder is **NOT** part of the pnpm workspace — Flutter manages its own dependencies via `pubspec.yaml`. It lives in the repo for convenience and shared docs.

**Planned stack** (per PRD §8.3): Flutter 3.x + Dart, `flutter_riverpod` + `riverpod_annotation`, `go_router` with auth guards, `dio` with interceptors, `flutter_secure_storage`, `cached_network_image`, `firebase_messaging`, `connectivity_plus`, gen-l10n for AR + EN (ar.arb + en.arb), Cairo + Poppins fonts.

**Phase entry criteria:**
1. `apps/api` auth + products + cart + orders endpoints implemented.
2. Claude.ai design artifact URL shared (35 screens per PRD §6 + §7.1).
3. Firebase project + FCM service account JSON in place.
4. Apple Developer account + Google Play Console set up (per PRD §19.2).

When ready: `flutter create apps/mobile --org sd.bartal --project-name bartal_mobile --platforms ios,android`, then wire up the stack above.
