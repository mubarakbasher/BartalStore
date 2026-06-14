# FCM Push Setup (Phase 4 · Slice 6b)

The mobile client is fully wired for Firebase Cloud Messaging. It just needs a
Firebase project's config file to build the Android app and receive pushes.
Until that file is present the app still runs — `FcmPushService.init()` degrades
to a no-op and the notifications inbox stays empty.

## What's already in the code

- `firebase_core` + `firebase_messaging` deps (`pubspec.yaml`).
- Google Services Gradle plugin (`android/settings.gradle.kts`, `android/app/build.gradle.kts`).
- `lib/core/notifications/fcm_push_service.dart` — token retrieval, foreground
  messages → inbox, background isolate handler, tap → deep link.
- Token registration: `PUT /users/me/fcm-token` on login / refresh; unregister on logout.
- Deep-link routing: a notification tap opens `/orders/<order_id>` (or the inbox).
- `POST_NOTIFICATIONS` permission (Android 13+) in the manifest.

## One-time setup (Android)

1. [Firebase console](https://console.firebase.google.com/) → create or select a project.
2. **Add app → Android**. Package name: **`sd.bartal.bartal_mobile`** (matches
   `applicationId`). No SHA-1 is required for FCM.
3. Download **`google-services.json`** and place it at:
   `apps/mobile/android/app/google-services.json`
   It is **gitignored** — never commit it (per-environment secret).
4. `flutter run` on a **Google-Play–enabled** emulator or a physical device
   (a plain AOSP image cannot mint an FCM token). The device token prints in the
   run log.

## iOS (later, lower priority)

Add an iOS app in the same project, drop `GoogleService-Info.plist` into
`ios/Runner/` (also gitignored), and configure an **APNs auth key** in the
Firebase console (needs an Apple Developer account). Delivery verification is
deferred — Android is the priority (CLAUDE.md §2).

## Verifying delivery (no backend needed)

The backend's FCM *send* path is a separate phase; you can still test the client
end-to-end from the console:

1. Note the device token from the `flutter run` log.
2. Firebase console → **Cloud Messaging → Send test message** → paste the token.
3. For deep-link testing, add a **data** payload (Additional options):
   `type=shipped`, `order_id=<a real order id>`, `order_number=BRT-2026-00006`,
   plus `title` / `body`.

Expected:
- **Foreground** → the message lands in the in-app Notifications inbox (unread).
- **Background / terminated tap** → the app opens `/orders/<order_id>`.

## Payload contract (for the backend send phase)

The server sends these keys in the FCM message `data` map:

| key | meaning |
|---|---|
| `type` | one of `receipt_approved`, `shipped`, `delivered`, `price_drop`, `promo`, `generic` |
| `title`, `body` | pre-localized strings (server picks AR/EN per the user's `language`) |
| `order_id` | routable order id (cuid) — used to deep-link to `/orders/<id>` |
| `order_number` | human `BRT-YYYY-NNNNN` label — shown in the inbox row |
| `message_id` | stable id for de-duplication (FCM provides one by default) |
