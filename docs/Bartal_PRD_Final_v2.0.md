# Bartal (برتال)
## Product Requirements Document — Final v2.0

---

| | |
|---|---|
| **Project** | Bartal — E-commerce Platform for Sudan |
| **Version** | 2.0 (Final) |
| **Date** | March 2026 |
| **Status** | 🟢 Approved for Development |
| **Owner** | Bartal Team |
| **Target Market** | Sudan — Khartoum (Phase 1) |
| **Languages** | Arabic (RTL, primary) + English (LTR, secondary) |
| **Business Model** | Single-vendor general marketplace |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Vision & Market Opportunity](#2-vision--market-opportunity)
3. [Sudan Market Context](#3-sudan-market-context)
4. [Product Overview](#4-product-overview)
5. [User Personas](#5-user-personas)
6. [User Journeys](#6-user-journeys)
7. [Feature Requirements](#7-feature-requirements)
8. [Technical Architecture](#8-technical-architecture)
9. [Database Schema](#9-database-schema)
10. [API Specification](#10-api-specification)
11. [Payment Flow](#11-payment-flow)
12. [Delivery & Logistics](#12-delivery--logistics)
13. [Design System](#13-design-system)
14. [Internationalization](#14-internationalization)
15. [Security & Privacy](#15-security--privacy)
16. [Performance Requirements](#16-performance-requirements)
17. [Goals, Metrics & KPIs](#17-goals-metrics--kpis)
18. [Development Roadmap](#18-development-roadmap)
19. [Team & Resources](#19-team--resources)
20. [Risks & Mitigations](#20-risks--mitigations)
21. [Future Roadmap (Phase 2+)](#21-future-roadmap)
22. [Appendix](#22-appendix)

---

# 1. Executive Summary

**Bartal (برتال)** is a bilingual Arabic/English single-vendor e-commerce platform built specifically for the Sudanese market. The name "Bartal" means *portal* — a gateway connecting Sudanese consumers to quality products through a trusted, local-first shopping experience.

The platform launches in **Khartoum (Phase 1)** with plans to expand to other Sudanese cities and eventually neighboring countries. It consists of three integrated products sharing a unified backend:

| Product | Platform | Purpose |
|---|---|---|
| 📱 **Mobile App** | iOS + Android (Flutter) | Primary customer interface |
| 🌐 **Website** | Responsive web (Next.js) | Customer storefront + SEO |
| 🖥️ **Admin Dashboard** | Desktop web (React) | Internal store management |

### Why Bartal Is Different

Sudan's e-commerce market is **underserved**, with most transactions happening informally through Facebook groups and WhatsApp. Existing global platforms (Jumia, Amazon) have minimal presence due to payment processing limitations. Bartal addresses this gap with a **Sudan-native approach**:

- ✅ **Local payment methods only** — Bank Transfer + Cash on Delivery (no Stripe/PayPal)
- ✅ **Arabic-first design** — Full RTL UI, not an afterthought
- ✅ **Optimized for slow internet** — Works on 2G/3G connections
- ✅ **Offline-resilient** — Survives power outages and connectivity drops
- ✅ **Landmark-based addressing** — No postal codes needed (Sudan has none)
- ✅ **WhatsApp support** — Where Sudanese customers actually communicate
- ✅ **SDG-native pricing** — With instant admin updates for currency volatility

---

# 2. Vision & Market Opportunity

## 2.1 Vision Statement

> "To become Sudan's most trusted online marketplace, where every customer feels at home, every purchase feels safe, and every delivery arrives on time."

## 2.2 Mission

Empower Sudanese consumers with reliable access to quality products through a platform that respects their language, payment habits, and connectivity realities.

## 2.3 Market Opportunity

| Metric | Value | Source |
|---|---|---|
| Sudan population | ~46 million | World Bank 2024 |
| Khartoum metro population | ~10 million | Estimated |
| Mobile penetration | ~70% | GSMA Sudan report |
| Internet penetration | ~30% | ITU 2024 |
| Smartphone share (mobile) | ~55% | Industry estimates |
| Android market share | ~80% | StatCounter Sudan |
| E-commerce adoption | <5% | Greenfield opportunity |

**Bartal targets the addressable market of ~3 million smartphone users in Khartoum who have internet access but no trusted local shopping platform.**

## 2.4 Competitive Landscape

| Competitor | Type | Strengths | Weaknesses |
|---|---|---|---|
| **Facebook Marketplace** | Informal | Free, viral reach | No checkout, no tracking, no trust |
| **WhatsApp Stores** | Informal | Direct relationships | No catalog, manual everything |
| **Jumia Sudan** | Formal | Brand recognition | Limited Sudan presence, English-first |
| **Small web shops** | Formal | Niche offerings | Poor UX, no mobile, no Arabic RTL |

### Bartal's Competitive Advantages

1. **Arabic-first mobile-native experience** — no competitor offers this
2. **Sudan-specific payment infrastructure** — works without international gateways
3. **Trust-building features** — verified payments, COD option, WhatsApp support
4. **Performance on slow networks** — built for 2G/3G from day one

---

# 3. Sudan Market Context

## 3.1 Critical Constraints

| Factor | Reality | Platform Implication |
|---|---|---|
| 🌐 **Internet quality** | 2G/3G dominant; frequent drops | Offline-first design, aggressive image compression, <3s load on 3G |
| 💳 **Payment access** | No international gateways available | Bank Transfer (manual) + Cash on Delivery only |
| 💵 **Currency stability** | SDG highly volatile/inflationary | Real-time admin price updates; optional USD reference for admin only |
| 🔤 **Language** | Arabic primary, English secondary | Full RTL UI, all strings translatable, Arabic SEO |
| 📱 **Devices** | Android ~80%, iOS ~20% | Android-first testing; iOS fully supported but lower priority |
| 📍 **Addresses** | No formal postal code system | Landmark-based addressing with required phone for coordination |
| ⚡ **Power supply** | Frequent outages, especially summer | Local state persistence, resume-anywhere flows |
| 🤝 **Trust factor** | Low trust in online commerce | Visible policies, real reviews, COD option, human support |
| 🚚 **Logistics** | No mature delivery infrastructure | Manual coordination via phone, in-house or partner delivery |
| 💸 **Banking** | Limited but functional local banks | Bank transfer is the de facto digital payment method |

## 3.2 Cultural Considerations

- **Arabic dialect**: Use accessible Modern Standard Arabic with Sudanese-friendly phrasing
- **Religious considerations**: Respect prayer times (no critical notifications during prayer); consider Ramadan operational hours
- **Family decision-making**: Many purchase decisions involve family — share/save features matter
- **Mobile-first communication**: WhatsApp is the dominant messaging app
- **Visual trust signals**: Customers want to see real photos, real reviews, real people

---

# 4. Product Overview

## 4.1 Three Products, One Platform

```
┌─────────────────────────────────────────────────────────┐
│                  Bartal Ecosystem                       │
│                                                         │
│  📱 Mobile App      🌐 Website       🖥️ Admin Dashboard │
│   (Flutter)        (Next.js 14)      (React + Vite)    │
│                                                         │
└─────────────────────┬───────────────────────────────────┘
                      │ Shared REST API
                      ▼
┌─────────────────────────────────────────────────────────┐
│              Backend (NestJS + TypeScript)              │
│                                                         │
│  Auth · Products · Cart · Orders · Payments ·          │
│  Delivery · Notifications · Admin · Analytics          │
└─────┬────────────────────────────────────────────┬──────┘
      │                                            │
      ▼                                            ▼
┌──────────────┐                          ┌────────────────────┐
│ PostgreSQL   │                          │ External Services  │
│ (Primary DB) │                          ├────────────────────┤
├──────────────┤                          │ 📩 Africa's Talking│
│ Redis        │                          │ 🔔 Firebase FCM    │
│ (Cache+Cart) │                          │ 🖼️ Cloudflare R2   │
└──────────────┘                          │ 🌍 Cloudflare CDN  │
                                          └────────────────────┘
```

## 4.2 Product Scope by Phase

### Phase 1 — MVP (Months 1–3)
- Single vendor (you/your business)
- General marketplace (multiple categories)
- Khartoum-only delivery
- Bank Transfer + COD
- Bilingual UI

### Phase 2 — Growth (Months 4–6)
- Promo codes and discounts
- Customer reviews and ratings
- Mobile money integration (Zain Cash, MTN)
- Push notifications
- Order analytics

### Phase 3 — Expansion (Months 7–12)
- Additional cities (Port Sudan, Kassala, Madani)
- Delivery agent mobile app
- Loyalty program
- Multi-vendor support (Phase 4 candidate)

---

# 5. User Personas

## 5.1 Customer Persona 1 — Fatima (Primary)

| Attribute | Detail |
|---|---|
| **Age** | 28 |
| **Profession** | Marketing professional |
| **Location** | Khartoum North (Bahri) |
| **Education** | University graduate |
| **Device** | Android (mid-range Samsung), uses laptop occasionally |
| **Internet** | 3G mobile + WiFi at home (unstable) |
| **Language** | Arabic preferred, can read basic English |
| **Tech comfort** | Medium — uses WhatsApp daily, has Instagram |
| **Income** | Middle class |

**Pain points:**
- Doesn't trust paying online with cards (and can't use international cards anyway)
- Wants to see real product photos, not stock images
- Frustrated by apps that freeze or crash on slow internet
- Worried about products not matching descriptions

**Goals:**
- Browse and discover products easily in Arabic
- Place orders safely without sharing payment details
- Track delivery progress
- Get help quickly when something goes wrong (via WhatsApp)

**Quote:** *"I want to shop online but I'm tired of unreliable Facebook sellers."*

## 5.2 Customer Persona 2 — Ahmed (Secondary)

| Attribute | Detail |
|---|---|
| **Age** | 42 |
| **Profession** | Small business owner (clothing shop) |
| **Location** | Omdurman |
| **Education** | High school |
| **Device** | iPhone (older model), desktop at his shop |
| **Internet** | Good WiFi at shop, 4G mobile |
| **Language** | Arabic only |
| **Tech comfort** | Medium-high — manages WhatsApp Business, browses Facebook daily |

**Pain points:**
- Needs to order in bulk for his business inventory
- Wants clear payment receipts for accounting
- Needs reliable delivery timelines

**Goals:**
- Browse from desktop, place larger orders
- Use bank transfer (his preferred payment method)
- Repeat orders easily

## 5.3 Admin Persona — Omar (Platform Operator)

| Attribute | Detail |
|---|---|
| **Role** | Platform owner / operations manager |
| **Daily tasks** | Manage products, verify payments, process orders, customer support |
| **Device** | Desktop Chrome browser |
| **Tech comfort** | Medium — comfortable with web apps |
| **Goals** | Simple, fast interface; no technical complexity; clear daily workflow |

---

# 6. User Journeys

## 6.1 Customer Journey — First Purchase

```
Discovery
   │
   ├── Sees Bartal on Facebook/Instagram ad (Arabic)
   ├── Clicks → opens website OR downloads app
   │
   ▼
Browse
   │
   ├── Browses in Arabic, no login required
   ├── Filters by category, price
   ├── Views product photos and details
   ├── Reads reviews from other Sudanese customers
   │
   ▼
Register
   │
   ├── Adds first item to cart → prompted to login
   ├── Registers with +249 phone number
   ├── Receives OTP via SMS
   ├── Verifies → account created
   │
   ▼
Checkout
   │
   ├── Adds delivery address (landmark-based, in Arabic)
   ├── Selects Zone B (Omdurman) → sees 800 SDG delivery fee
   ├── Chooses payment: Bank Transfer
   ├── Sees bank account details displayed clearly
   │
   ▼
Pay
   │
   ├── Transfers via her bank's mobile app
   ├── Takes screenshot of receipt
   ├── Uploads receipt in Bartal app
   ├── Sees: "Receipt submitted. Verification within 24 hours."
   │
   ▼
Verification (Admin side)
   │
   ├── Omar (admin) sees notification of pending payment
   ├── Opens receipt image in admin panel
   ├── Verifies amount matches order total
   ├── Clicks "Confirm Payment"
   ├── System auto-sends SMS to Fatima
   │
   ▼
Receive
   │
   ├── Fatima gets SMS: "طلبك مؤكد! Order confirmed!"
   ├── Order status updates to "Processing"
   ├── Next day: "Order Shipped" SMS + push notification
   ├── Day 2: Delivery agent calls to coordinate
   ├── Receives package → "Delivered" SMS sent
   ├── Prompted to leave review
   │
   ▼
Loyalty
   │
   └── Returns to Bartal for next purchase, faster checkout
```

## 6.2 Admin Journey — Daily Operations

```
Morning (9 AM)
   │
   ├── Opens admin dashboard
   ├── Reviews overnight orders (Dashboard KPIs)
   ├── Checks pending bank transfer receipts (8 waiting)
   ├── Verifies each receipt → confirms 6, rejects 2
   ├── Customers receive SMS automatically
   │
   ▼
Midday (12 PM)
   │
   ├── Updates product inventory
   ├── Adds new product launch (AR + EN descriptions)
   ├── Uploads 4 product photos (auto-compressed to WebP)
   │
   ▼
Afternoon (3 PM)
   │
   ├── Processes COD orders to ship
   ├── Updates order statuses to "Shipped"
   ├── Coordinates with delivery agents via WhatsApp
   │
   ▼
Evening (6 PM)
   │
   ├── Reviews daily sales report
   ├── Checks low-stock alerts
   ├── Replies to customer support inquiries
   │
   ▼
End of day
   │
   └── Closes dashboard, orders processed
```

---

# 7. Feature Requirements

> **Priority Legend:** `P1` = Must have (MVP) · `P2` = Should have · `P3` = Nice to have (Phase 2+)

## 7.1 Customer-Facing Features

### 7.1.1 Authentication & Profile

| Feature | Priority | Notes |
|---|:---:|---|
| Register with phone (+249 + 9 digits) | P1 | OTP verification via SMS |
| Login with phone + password | P1 | Remember me option |
| Guest browsing (no login required) | P1 | Login prompted at checkout |
| OTP-based password reset | P1 | SMS to registered phone |
| Profile management (name, email optional) | P1 | |
| Multiple delivery addresses | P2 | Up to 5 saved addresses |
| Language toggle (Arabic ⇄ English) | P1 | Auto-detected on first use |
| Push notification preferences | P2 | Opt in/out per category |
| Account deletion | P2 | GDPR-inspired right to delete |

### 7.1.2 Product Discovery

| Feature | Priority | Notes |
|---|:---:|---|
| Homepage with featured products | P1 | Editorial curation by admin |
| Hierarchical category browsing | P1 | e.g. Electronics > Phones > Samsung |
| Full-text search (Arabic + English) | P1 | Searches both languages |
| Filters: price, category, availability | P1 | Combinable filters |
| Sort: relevance, price ↑↓, newest, popular | P1 | |
| Product detail page with images, description | P1 | Multiple images, zoomable |
| Product variants (size, color) | P2 | |
| Related products suggestions | P2 | "Customers also viewed" |
| Wishlist / Save for later | P2 | Synced across devices |
| Recently viewed products | P3 | Phase 2 |
| Product reviews and ratings | P2 | Verified purchase badge |
| Share product (WhatsApp, copy link) | P1 | WhatsApp is critical for Sudan |
| Low-bandwidth image loading | P1 | WebP + progressive |
| Offline product browsing (cached) | P2 | For previously viewed items |

### 7.1.3 Shopping Cart

| Feature | Priority | Notes |
|---|:---:|---|
| Add/remove/update cart items | P1 | |
| Cart persists across sessions | P1 | LocalStorage + backend sync |
| Cart survives offline drops | P1 | Critical for Sudan power outages |
| Quantity adjustment with stock limits | P1 | |
| Cart total with delivery fee preview | P1 | Updates by zone selection |
| Cart sharing (WhatsApp) | P3 | "Hey, what do you think of this cart?" |
| Promo code application | P2 | Phase 2 |
| Save cart for later | P3 | |

### 7.1.4 Checkout

| Feature | Priority | Notes |
|---|:---:|---|
| Step-by-step checkout (3 steps) | P1 | Address → Payment → Confirm |
| Delivery address selection | P1 | From saved or new |
| New address form with landmark | P1 | Landmark = REQUIRED |
| Delivery zone auto-detection | P1 | Based on selected district |
| Order summary with itemization | P1 | |
| Delivery time estimate | P1 | Per zone |
| Order notes (optional) | P2 | "Please call before delivery" |
| Resume interrupted checkout | P1 | Critical for Sudan |
| Order placed confirmation screen | P1 | With order number BRT-YYYY-NNNNN |

### 7.1.5 Payment

| Feature | Priority | Notes |
|---|:---:|---|
| Bank Transfer flow (manual) | P1 | Show bank details, upload receipt |
| Cash on Delivery (COD) | P1 | No upfront payment needed |
| Bank account details display | P1 | Name + number in AR and EN |
| Receipt photo upload | P1 | Camera or gallery |
| Receipt upload progress indicator | P1 | |
| Payment status tracking | P1 | Pending/Verified/Rejected |
| Resubmit rejected receipt | P1 | With clear rejection reason |
| Mobile money (Zain Cash, MTN) | P3 | Phase 2 — pending API access |

### 7.1.6 Orders

| Feature | Priority | Notes |
|---|:---:|---|
| Order history list | P1 | Sortable by date, status |
| Order detail view | P1 | Items, status, payment, delivery |
| Order status updates (real-time) | P1 | Push + SMS |
| Order tracking timeline | P1 | Visual progress |
| Cancel order (before shipping) | P1 | With reason |
| Reorder previous purchase | P2 | One-tap repeat |
| Download order invoice (PDF) | P3 | Phase 2 |
| WhatsApp support link per order | P1 | wa.me with order pre-filled |
| Leave product review | P2 | After delivery |

### 7.1.7 Notifications

| Feature | Priority | Notes |
|---|:---:|---|
| Push notifications (in-app) | P1 | Firebase FCM |
| SMS notifications for order status | P1 | Africa's Talking |
| Email notifications (optional) | P3 | Phase 2 |
| Notification center in app | P2 | History of past notifications |
| Per-notification-type preferences | P2 | |

## 7.2 Admin Dashboard Features

### 7.2.1 Dashboard & Analytics

| Feature | Priority | Notes |
|---|:---:|---|
| Sales overview (today, week, month) | P1 | Revenue in SDG |
| Order count by status | P1 | Visual chart |
| Top-selling products (top 10) | P1 | |
| Orders by delivery zone | P1 | Heatmap or bar chart |
| Low-stock alerts (below threshold) | P1 | Configurable per product |
| Revenue trend chart (30 days) | P1 | Line chart |
| New customer count | P1 | |
| Pending payment receipts count | P1 | Quick action card |
| Export reports to Excel | P2 | Phase 2 |

### 7.2.2 Product Management

| Feature | Priority | Notes |
|---|:---:|---|
| Product list (table with search) | P1 | Tanstack table |
| Create product (AR + EN required) | P1 | Both languages mandatory |
| Edit product | P1 | |
| Delete product (soft delete) | P1 | is_active flag |
| Upload product images | P1 | Multiple, auto-compress to WebP |
| Set primary product image | P1 | |
| Manage product variants | P2 | Size, color, etc. |
| Bulk product import (CSV) | P2 | Phase 2 |
| Feature/promote on homepage | P2 | |
| Category management (tree) | P1 | Create/edit/reorder |
| Stock management with thresholds | P1 | Low stock alerts |

### 7.2.3 Order Management

| Feature | Priority | Notes |
|---|:---:|---|
| Orders list with filters | P1 | Status, date, zone, payment |
| Order detail view | P1 | Customer info, items, history |
| Update order status manually | P1 | Auto-triggers customer SMS |
| Receipt verification viewer | P1 | **Critical** — zoomable image |
| Confirm payment → auto SMS | P1 | |
| Reject payment with reason → SMS | P1 | |
| Print order/delivery slip (PDF) | P2 | Phase 2 |
| Order notes (internal) | P2 | Not visible to customer |
| Assign delivery agent | P3 | Phase 2 — with agent app |

### 7.2.4 Customer Management

| Feature | Priority | Notes |
|---|:---:|---|
| Customer list with search | P1 | |
| Customer detail with order history | P1 | |
| Customer addresses | P1 | View only |
| Block/unblock customer | P2 | For fraud cases |
| Customer lifetime value | P2 | Total spent |
| Send notification to customer | P3 | Phase 2 |

### 7.2.5 Delivery Management

| Feature | Priority | Notes |
|---|:---:|---|
| Zone configuration (4 Khartoum zones) | P1 | Editable |
| Per-zone delivery fee | P1 | In SDG |
| Free delivery threshold per zone | P1 | E.g. 50,000 SDG |
| Estimated delivery days per zone | P1 | |
| Delivery agent list (Phase 2) | P3 | |

### 7.2.6 Settings

| Feature | Priority | Notes |
|---|:---:|---|
| Store settings (bank details) | P1 | Used in checkout flow |
| WhatsApp support number config | P1 | Used in order pages |
| Email settings (Phase 2) | P3 | |
| Tax settings (Phase 2) | P3 | If applicable |
| Backup management | P2 | Daily DB backups |
| Admin user management | P2 | Multiple admins (Phase 2) |

---

# 8. Technical Architecture

## 8.1 High-Level Architecture

```
                          ┌────────────────────┐
                          │   Cloudflare CDN   │
                          │   + DNS + SSL      │
                          └─────────┬──────────┘
                                    │
        ┌───────────────────────────┼─────────────────────────┐
        │                           │                         │
        ▼                           ▼                         ▼
┌──────────────┐         ┌────────────────┐         ┌──────────────┐
│ Mobile App   │         │  Website       │         │  Admin       │
│ (Flutter)    │         │  (Next.js 14)  │         │  (React+Vite)│
│ iOS + Android│         │  bartal.sd     │         │ admin.bartal │
└──────┬───────┘         └────────┬───────┘         └──────┬───────┘
       │                          │                        │
       └──────────────────────────┼────────────────────────┘
                                  │
                                  ▼ HTTPS REST API
                  ┌───────────────────────────────┐
                  │  Backend (NestJS 10)          │
                  │  api.bartal.sd                │
                  │                               │
                  │  • JWT Auth + Refresh         │
                  │  • Validation Pipeline        │
                  │  • Global Exception Filter    │
                  │  • Rate Limiting              │
                  │  • Swagger /api/docs          │
                  └────┬──────────────┬───────────┘
                       │              │
                       ▼              ▼
            ┌─────────────────┐  ┌──────────────────────┐
            │  PostgreSQL 15  │  │  External Services   │
            │  (Primary DB)   │  ├──────────────────────┤
            ├─────────────────┤  │ 📩 Africa's Talking  │
            │  Redis 7        │  │    (SMS to Sudan)    │
            │  (Cache+Cart+   │  │                      │
            │   OTP+Sessions) │  │ 🔔 Firebase FCM      │
            └─────────────────┘  │    (Push)            │
                                 │                      │
                                 │ 🖼️ Cloudflare R2     │
                                 │    (Image storage)   │
                                 │                      │
                                 │ 📞 WhatsApp Business │
                                 │    (Support links)   │
                                 └──────────────────────┘
```

## 8.2 Technology Stack

| Layer | Technology | Version | Why |
|---|---|---|---|
| **Mobile App** | Flutter + Dart | 3.x | Single codebase iOS+Android, Riverpod state mgmt |
| **Website** | Next.js + TypeScript | 14 (App Router) | SSR for SEO, fast loads, RTL support |
| **Admin** | React + Vite | 18 | Fast dev, simple SPA, shadcn/ui |
| **Backend** | NestJS + TypeScript strict | 10 | Structured, scalable, Swagger built-in |
| **ORM** | Prisma | 5 | Type-safe, migrations, great DX |
| **Database** | PostgreSQL | 15 | Reliable, ACID, JSON support |
| **Cache/Queue** | Redis | 7 | Cart storage, OTP, rate limits, sessions |
| **File Storage** | Cloudflare R2 | — | S3-compatible, no egress fees, fast in Africa |
| **CDN** | Cloudflare | — | Free, global, Sudan-friendly |
| **SMS** | Africa's Talking | — | Confirmed Sudan coverage |
| **Push Notifications** | Firebase Cloud Messaging | — | Free, iOS + Android |
| **Container** | Docker + Docker Compose | 24+ | Reproducible deploys |
| **Reverse Proxy** | Nginx | — | Gzip, security headers, SSL termination |
| **Hosting** | Hetzner / DigitalOcean | — | Cost-effective, Sudan-accessible |

## 8.3 Mobile App Stack (Flutter)

```yaml
State Management:    flutter_riverpod + riverpod_annotation
Routing:             go_router (declarative + auth guards)
HTTP Client:         dio (with interceptors: auth, refresh, error, connectivity)
Secure Storage:      flutter_secure_storage (JWT tokens)
Local Storage:       shared_preferences (cart, preferences)
Images:              cached_network_image (with shimmer placeholders)
Push:                firebase_messaging + firebase_core
Image Picker:        image_picker (receipt upload)
Connectivity:        connectivity_plus (offline detection)
i18n:                Flutter built-in gen-l10n (ar.arb + en.arb)
Fonts:               Cairo (Arabic) + Poppins (English)
External:            url_launcher (WhatsApp deep links)
```

## 8.4 Website Stack (Next.js)

```yaml
Framework:           Next.js 14 App Router
Styling:             Tailwind CSS (with logical properties for RTL)
i18n:                next-intl
HTTP:                axios + @tanstack/react-query
State:               zustand (cart with localStorage persistence)
Fonts:               next/font/google (Cairo + Poppins, optimized)
Images:              next/image (auto WebP + blur placeholders)
SEO:                 Native Next.js metadata API
```

## 8.5 Admin Dashboard Stack (React)

```yaml
Build:               Vite
Framework:           React 18
Tables:              @tanstack/react-table
Forms:               react-hook-form + zod
Charts:              recharts (LineChart, BarChart, PieChart)
UI Library:          shadcn/ui + Radix UI primitives
Routing:             react-router-dom v6
HTTP:                axios + @tanstack/react-query
Image Viewer:        react-zoom-pan-pinch (for receipt verification)
```

## 8.6 Backend Stack (NestJS)

```yaml
Framework:           NestJS 10 (strict mode)
ORM:                 Prisma 5
Validation:          class-validator + class-transformer
Auth:                @nestjs/jwt + @nestjs/passport (JWT + refresh)
Documentation:       @nestjs/swagger (OpenAPI 3)
Rate Limiting:       @nestjs/throttler
Image Processing:    sharp (WebP conversion + resize)
SMS:                 africastalking npm package
Push:                firebase-admin
Storage:             @aws-sdk/client-s3 (Cloudflare R2 is S3-compatible)
Caching:             @nestjs/cache-manager + ioredis
Hashing:             bcrypt
UUIDs:               uuid
```

---

# 9. Database Schema

## 9.1 Core Models

```prisma
model User {
  id            String    @id @default(cuid())
  phone         String    @unique          // +249XXXXXXXXX
  name          String
  email         String?   @unique
  password_hash String
  is_verified   Boolean   @default(false)
  is_active     Boolean   @default(true)
  role          UserRole  @default(CUSTOMER)
  language      Language  @default(AR)
  fcm_token     String?                    // Push notification token
  last_login_at DateTime?
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt

  addresses       Address[]
  orders          Order[]
  reviews         Review[]
  otp_codes       OtpCode[]
  refresh_tokens  RefreshToken[]
  cart_session    CartSession?

  @@index([phone])
  @@map("users")
}

enum UserRole { CUSTOMER ADMIN }
enum Language { AR EN }

model Address {
  id              String       @id @default(cuid())
  user_id         String
  label           String       // "Home", "Work", "Mom's house"
  full_name       String
  phone           String       // Delivery contact
  secondary_phone String?
  district        String       // From DELIVERY_DISTRICTS list
  street          String?      // Optional
  landmark        String       // REQUIRED — Sudan has no postal codes
  delivery_notes  String?
  zone            DeliveryZone
  is_default      Boolean      @default(false)
  created_at      DateTime     @default(now())

  user   User    @relation(fields: [user_id], references: [id], onDelete: Cascade)
  orders Order[]

  @@index([user_id])
  @@map("addresses")
}

enum DeliveryZone { ZONE_A ZONE_B ZONE_C ZONE_D }

model OtpCode {
  id         String      @id @default(cuid())
  user_id    String
  code       String
  purpose    OtpPurpose
  expires_at DateTime
  used       Boolean     @default(false)
  created_at DateTime    @default(now())

  user User @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id, code, used])
  @@map("otp_codes")
}

enum OtpPurpose { REGISTER LOGIN PASSWORD_RESET }

model RefreshToken {
  id         String   @id @default(cuid())
  user_id    String
  token_hash String   @unique
  user_agent String?
  expires_at DateTime
  revoked    Boolean  @default(false)
  created_at DateTime @default(now())

  user User @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@map("refresh_tokens")
}

model SmsLog {
  id              String   @id @default(cuid())
  phone           String
  message         String
  status          String   // SENT, FAILED, DELIVERED
  provider        String   // "africas_talking"
  provider_ref    String?
  error_message   String?
  created_at      DateTime @default(now())

  @@index([phone, created_at])
  @@map("sms_logs")
}
```

## 9.2 Product Models

```prisma
model Category {
  id          String     @id @default(cuid())
  name_ar     String
  name_en     String
  slug        String     @unique
  parent_id   String?
  image_url   String?
  sort_order  Int        @default(0)
  is_active   Boolean    @default(true)
  created_at  DateTime   @default(now())

  parent   Category?   @relation("CategoryTree", fields: [parent_id], references: [id])
  children Category[]  @relation("CategoryTree")
  products Product[]

  @@index([slug])
  @@map("categories")
}

model Product {
  id              String   @id @default(cuid())
  name_ar         String
  name_en         String
  description_ar  String   @db.Text
  description_en  String   @db.Text
  slug            String   @unique
  sku             String?  @unique
  price           Decimal  @db.Decimal(12, 2)   // SDG
  compare_price   Decimal? @db.Decimal(12, 2)   // For "was X, now Y"
  stock           Int      @default(0)
  low_stock_threshold Int  @default(5)
  is_active       Boolean  @default(true)
  is_featured     Boolean  @default(false)
  category_id     String
  weight_grams    Int?
  views_count     Int      @default(0)
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt

  category    Category          @relation(fields: [category_id], references: [id])
  images      ProductImage[]
  variants    ProductVariant[]
  reviews     Review[]
  order_items OrderItem[]

  @@index([category_id, is_active])
  @@index([is_featured])
  @@map("products")
}

model ProductImage {
  id         String  @id @default(cuid())
  product_id String
  url        String  // Cloudflare R2 URL (WebP)
  alt_ar     String?
  alt_en     String?
  sort_order Int     @default(0)
  is_primary Boolean @default(false)

  product Product @relation(fields: [product_id], references: [id], onDelete: Cascade)

  @@map("product_images")
}

model ProductVariant {
  id         String  @id @default(cuid())
  product_id String
  name_ar    String                  // "الحجم", "اللون"
  name_en    String                  // "Size", "Color"
  value_ar   String                  // "كبير"
  value_en   String                  // "Large"
  price_diff Decimal @default(0) @db.Decimal(12, 2)
  stock      Int     @default(0)

  product Product @relation(fields: [product_id], references: [id], onDelete: Cascade)

  @@map("product_variants")
}

model Review {
  id         String   @id @default(cuid())
  product_id String
  user_id    String
  rating     Int      // 1-5
  comment    String?  @db.Text
  is_verified_purchase Boolean @default(false)
  created_at DateTime @default(now())

  product Product @relation(fields: [product_id], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [user_id], references: [id])

  @@unique([product_id, user_id])
  @@index([product_id, rating])
  @@map("reviews")
}
```

## 9.3 Order Models

```prisma
model Order {
  id                  String        @id @default(cuid())
  order_number        String        @unique  // BRT-2026-00001
  user_id             String
  address_id          String
  status              OrderStatus   @default(PENDING)
  payment_method      PaymentMethod
  payment_status      PaymentStatus @default(UNPAID)
  subtotal            Decimal       @db.Decimal(12, 2)
  delivery_fee        Decimal       @db.Decimal(12, 2)
  discount            Decimal       @default(0) @db.Decimal(12, 2)
  total               Decimal       @db.Decimal(12, 2)
  notes               String?       @db.Text
  internal_notes      String?       @db.Text
  receipt_url         String?       // Private R2 signed URL
  receipt_uploaded_at DateTime?
  paid_at             DateTime?
  shipped_at          DateTime?
  delivered_at        DateTime?
  cancelled_at        DateTime?
  cancellation_reason String?
  created_at          DateTime      @default(now())
  updated_at          DateTime      @updatedAt

  user           User                  @relation(fields: [user_id], references: [id])
  address        Address               @relation(fields: [address_id], references: [id])
  items          OrderItem[]
  status_history OrderStatusHistory[]

  @@index([user_id, created_at])
  @@index([status, created_at])
  @@index([order_number])
  @@map("orders")
}

enum OrderStatus {
  PENDING
  AWAITING_PAYMENT
  RECEIPT_UPLOADED
  PAYMENT_CONFIRMED
  PAYMENT_REJECTED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentMethod { BANK_TRANSFER CASH_ON_DELIVERY }
enum PaymentStatus { UNPAID PAID REFUNDED }

model OrderItem {
  id              String  @id @default(cuid())
  order_id        String
  product_id      String
  product_name_ar String                      // Snapshot at order time
  product_name_en String                      // Snapshot at order time
  product_image   String?
  quantity        Int
  unit_price      Decimal @db.Decimal(12, 2)  // Price at order time
  total_price     Decimal @db.Decimal(12, 2)
  variant_info    Json?

  order   Order   @relation(fields: [order_id], references: [id], onDelete: Cascade)
  product Product @relation(fields: [product_id], references: [id])

  @@map("order_items")
}

model OrderStatusHistory {
  id            String      @id @default(cuid())
  order_id      String
  status        OrderStatus
  note          String?
  changed_by_id String?     // Admin user ID if applicable
  created_at    DateTime    @default(now())

  order Order @relation(fields: [order_id], references: [id], onDelete: Cascade)

  @@index([order_id, created_at])
  @@map("order_status_history")
}
```

## 9.4 Delivery & Configuration

```prisma
model DeliveryZoneFee {
  id           String       @id @default(cuid())
  zone         DeliveryZone @unique
  fee          Decimal      @db.Decimal(12, 2)  // SDG
  free_above   Decimal?     @db.Decimal(12, 2)  // Free delivery threshold
  estimated_days_min Int
  estimated_days_max Int
  updated_at   DateTime     @updatedAt

  @@map("delivery_zone_fees")
}

model AppSetting {
  key   String @id
  value String @db.Text

  @@map("app_settings")
}

model CartSession {
  user_id    String   @id
  items      Json     // Serialized cart items
  updated_at DateTime @updatedAt

  user User @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@map("cart_sessions")
}
```

---

# 10. API Specification

## 10.1 Base Configuration

- **Base URL (dev):** `http://localhost:3001/api`
- **Base URL (prod):** `https://api.bartal.sd/api`
- **Authentication:** `Authorization: Bearer <accessToken>`
- **Content-Type:** `application/json`
- **API Docs:** `https://api.bartal.sd/api/docs` (Swagger UI)

## 10.2 Standard Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response payload */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message_en": "Product not found",
    "message_ar": "المنتج غير موجود",
    "status": 404
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [/* items */],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

## 10.3 Endpoint Reference

### Auth `/api/auth`
| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register with phone + password | Public |
| POST | `/auth/verify-otp` | Verify OTP code | Public |
| POST | `/auth/resend-otp` | Resend OTP (rate limited) | Public |
| POST | `/auth/login` | Login → access + refresh tokens | Public |
| POST | `/auth/refresh` | Refresh access token | Public |
| POST | `/auth/logout` | Invalidate refresh token | JWT |
| POST | `/auth/forgot-password` | Send OTP for password reset | Public |
| POST | `/auth/reset-password` | Reset password with OTP | Public |

### Users `/api/users`
| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/users/me` | Get current user profile | JWT |
| PUT | `/users/me` | Update profile (name, email, language) | JWT |
| POST | `/users/me/change-password` | Change password | JWT |
| DELETE | `/users/me` | Delete account | JWT |
| GET | `/users/me/addresses` | List user addresses | JWT |
| POST | `/users/me/addresses` | Add address | JWT |
| PUT | `/users/me/addresses/:id` | Update address | JWT |
| DELETE | `/users/me/addresses/:id` | Delete address | JWT |
| PUT | `/users/me/addresses/:id/default` | Set as default | JWT |

### Products `/api/products`
| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/products` | List products (paginated, filterable) | Public |
| GET | `/products/:id` | Get product detail | Public |
| GET | `/products/search?q=` | Full-text search AR + EN | Public |
| GET | `/products/:id/reviews` | List product reviews | Public |
| POST | `/products/:id/reviews` | Add review (verified purchase only) | JWT |

### Categories `/api/categories`
| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/categories` | Category tree | Public |
| GET | `/categories/:id` | Category detail | Public |
| GET | `/categories/:id/products` | Products in category (paginated) | Public |

### Cart `/api/cart`
| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/cart` | Get current cart | JWT |
| POST | `/cart/items` | Add item to cart | JWT |
| PUT | `/cart/items/:productId` | Update quantity | JWT |
| DELETE | `/cart/items/:productId` | Remove item | JWT |
| DELETE | `/cart` | Clear cart | JWT |

### Orders `/api/orders`
| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/orders` | List user orders | JWT |
| GET | `/orders/:id` | Order detail | JWT |
| POST | `/orders` | Create order from cart | JWT |
| DELETE | `/orders/:id/cancel` | Cancel order (if eligible) | JWT |
| POST | `/orders/:id/receipt` | Upload payment receipt | JWT |

### Delivery `/api/delivery`
| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/delivery/zones` | List zones + fees | Public |
| GET | `/delivery/fee?zone=&total=` | Calculate delivery fee | Public |

### Admin `/api/admin` (AdminGuard)
| Method | Path | Description |
|---|---|---|
| GET | `/admin/dashboard` | Dashboard KPIs |
| GET | `/admin/orders` | All orders (filterable) |
| PUT | `/admin/orders/:id/status` | Update order status |
| PUT | `/admin/orders/:id/payment` | Confirm/reject payment |
| POST | `/admin/products` | Create product |
| PUT | `/admin/products/:id` | Update product |
| DELETE | `/admin/products/:id` | Soft delete product |
| POST | `/admin/products/:id/images` | Upload product images |
| POST | `/admin/categories` | Create category |
| PUT | `/admin/categories/:id` | Update category |
| GET | `/admin/customers` | List customers |
| GET | `/admin/customers/:id` | Customer detail + history |
| PUT | `/admin/delivery/zones/:zone` | Update zone fee |
| GET | `/admin/analytics/sales` | Sales analytics |
| GET | `/admin/analytics/products` | Top products |
| GET | `/admin/settings` | Get app settings |
| PUT | `/admin/settings` | Update settings |

### System
| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check `{ status: 'ok' }` |
| GET | `/api/docs` | Swagger API documentation |

---

# 11. Payment Flow

## 11.1 Bank Transfer Flow (Detailed)

```
Customer Side                  Bartal App                  Admin Dashboard
─────────────                  ──────────                  ───────────────
   │                                │                            │
   │ Select "Bank Transfer"         │                            │
   │ at checkout ─────────────────►│                            │
   │                                │                            │
   │                                │ Display bank account:      │
   │                                │ - Bank name (AR + EN)      │
   │ ◄──────────────────────────────│ - Account number           │
   │                                │ - Account name             │
   │                                │ - Order total              │
   │                                │                            │
   │ Order saved as                 │                            │
   │ AWAITING_PAYMENT ──────────────│                            │
   │                                │                            │
   │ (Customer transfers via own    │                            │
   │  bank's app — outside Bartal)  │                            │
   │                                │                            │
   │ Upload receipt photo ─────────►│                            │
   │ (camera or gallery)            │                            │
   │                                │ Image → sharp → WebP       │
   │                                │ → upload to R2 private/    │
   │                                │ Status: RECEIPT_UPLOADED   │
   │                                │                            │
   │                                │ Notify admin ─────────────►│
   │                                │                            │ View order
   │ ◄──────────────────────────────│                            │ View receipt
   │ "Receipt submitted.            │                            │ (zoomable)
   │  Verification within 24h"      │                            │
   │                                │                            │
   │                                │                            │ ┌──────────┐
   │                                │                            │ │ Confirm  │
   │                                │                            │ │  -OR-    │
   │                                │                            │ │ Reject   │
   │                                │                            │ │ + reason │
   │                                │                            │ └────┬─────┘
   │                                │                                  │
   │                                │ ◄────────────────────────────────│
   │                                │ Status:                          │
   │                                │ PAYMENT_CONFIRMED                │
   │                                │   OR                             │
   │                                │ PAYMENT_REJECTED                 │
   │                                │                                  │
   │                                │ Send SMS via Africa's Talking    │
   │ ◄──────────────────────────────│ (bilingual confirmation)         │
   │ SMS: "طلبك مؤكد"               │                                  │
   │                                │ Append to OrderStatusHistory     │
   │                                │ (audit trail)                    │
   │                                │                                  │
   │ Order proceeds to              │                                  │
   │ PROCESSING ────────────────────│                                  │
   │                                │                                  │
```

## 11.2 Cash on Delivery (COD) Flow

```
1. Customer selects "Cash on Delivery" at checkout
2. Order saved as PENDING (no payment yet)
3. Admin reviews order → approves for shipping
4. Status → PROCESSING → SHIPPED
5. Delivery agent calls customer to coordinate
6. Agent delivers product → collects cash
7. Agent confirms delivery → status DELIVERED + paid_at set
8. Customer receives delivery SMS
```

## 11.3 Payment States

| State | Description | Next states |
|---|---|---|
| `AWAITING_PAYMENT` | Bank transfer selected, no receipt | RECEIPT_UPLOADED, CANCELLED |
| `RECEIPT_UPLOADED` | Customer uploaded receipt | PAYMENT_CONFIRMED, PAYMENT_REJECTED |
| `PAYMENT_CONFIRMED` | Admin verified | PROCESSING |
| `PAYMENT_REJECTED` | Admin rejected with reason | RECEIPT_UPLOADED (re-upload) |
| `PROCESSING` | Order being prepared | SHIPPED, CANCELLED |
| `SHIPPED` | Out for delivery | DELIVERED, CANCELLED |
| `DELIVERED` | Successfully delivered | REFUNDED (if return) |

## 11.4 Receipt Verification (Admin)

The **ReceiptViewer** is the most critical admin component. Layout:

```
┌─────────────────────────────────────────────────────────┐
│  Order #BRT-2026-00042                          ✕ Close │
├─────────────────────────────────────────────────────────┤
│                                  │                       │
│                                  │  Order Summary        │
│                                  │  ────────────────     │
│                                  │  Customer: Fatima A.  │
│         [Receipt Image]          │  Phone: +249912...    │
│         (zoomable, pan)          │                       │
│                                  │  Items: 3             │
│                                  │  Subtotal: 12,500 SDG │
│                                  │  Delivery: 800 SDG    │
│                                  │  Total: 13,300 SDG    │
│                                  │                       │
│                                  │  Uploaded: 2h ago     │
│                                  │                       │
│                                  │  ┌─────────────────┐  │
│                                  │  │ ✓ Confirm       │  │
│                                  │  └─────────────────┘  │
│                                  │  ┌─────────────────┐  │
│                                  │  │ ✗ Reject        │  │
│                                  │  └─────────────────┘  │
│                                  │                       │
└─────────────────────────────────────────────────────────┘
```

---

# 12. Delivery & Logistics

## 12.1 Khartoum Delivery Zones (Phase 1)

| Zone | Areas Covered | Base Fee (SDG) | Free Above (SDG) | Est. Days |
|---|---|---:|---:|:---:|
| 🟢 **Zone A** | Central Khartoum (Khartoum 2, 3, Burri, Amarat) | 500 | 50,000 | 0–1 |
| 🟡 **Zone B** | Omdurman, Bab el Mardoum, Shambat | 800 | 60,000 | 1–2 |
| 🟡 **Zone C** | Khartoum North (Bahri), Soba, Halfaya | 800 | 60,000 | 1–2 |
| 🟠 **Zone D** | East Khartoum (Riyadh, Sahafa, Arkaweet) | 1,000 | 70,000 | 1–2 |

## 12.2 Address Input Design

Because Sudan lacks a postal system, the address form is **landmark-based**:

```
┌─────────────────────────────────────┐
│  Add Delivery Address               │
├─────────────────────────────────────┤
│                                     │
│  Label (e.g. Home, Work) *          │
│  [______________________________]   │
│                                     │
│  Full Name *                        │
│  [______________________________]   │
│                                     │
│  Phone (+249) *                     │
│  [+249][_________________________]  │
│                                     │
│  Backup Phone                       │
│  [+249][_________________________]  │
│                                     │
│  District / Neighborhood *          │
│  [Select from dropdown          ▼]  │
│                                     │
│  Street name (optional)             │
│  [______________________________]   │
│                                     │
│  ⚠️ Landmark *                      │
│  [______________________________]   │
│  Example: "Near Al-Fatih Mosque,    │
│  blue gate, second house on right"  │
│                                     │
│  Delivery Notes (optional)          │
│  [______________________________]   │
│  Example: "Call before delivery"    │
│                                     │
│  [ ] Set as default address         │
│                                     │
│  [Cancel]              [Save]       │
└─────────────────────────────────────┘
```

## 12.3 Delivery Operations (Phase 1)

- **Manual coordination** via phone before delivery
- **Same-day for Zone A** if ordered before 12 PM
- **Next-day for Zone A** if ordered after 12 PM
- **1-2 days for Zones B, C, D**
- Delivery agents communicate with customers via WhatsApp
- Customer can track status in app + receives SMS at each stage

---

# 13. Design System

## 13.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| **Primary** | `#1B3A6B` | App bar, primary buttons, logo, headers |
| **Accent** | `#D4860B` | CTA buttons, prices, highlights, badges |
| **Background** | `#FAF8F5` | App background, page fill |
| **Surface** | `#FFFFFF` | Cards, modals, inputs |
| **Text Primary** | `#1A1A1A` | Body text, headings |
| **Text Secondary** | `#6B6560` | Captions, metadata, subtitles |
| **Success** | `#2E7D32` | Delivered, confirmed, in-stock |
| **Error** | `#C62828` | Cancelled, rejected, out-of-stock |
| **Warning** | `#F57F17` | Pending, low stock, processing |
| **Info** | `#1565C0` | Shipped, notifications, links |
| **Border** | `#EDE8E3` | Dividers, card borders, inputs |

## 13.2 Typography

| Language | Font Family | Weights |
|---|---|---|
| Arabic | **Cairo** | 400, 600, 700 |
| English | **Poppins** | 400, 500, 600 |

### Type Scale

| Style | Size | Weight | Use |
|---|:---:|:---:|---|
| Display | 32px | 700 | Hero text |
| H1 | 24px | 700 | Page titles |
| H2 | 20px | 600 | Section headers |
| H3 | 18px | 600 | Card titles |
| Body | 16px | 400 | Main content |
| Body Small | 14px | 400 | Secondary content |
| Caption | 12px | 400 | Metadata, timestamps |

## 13.3 Spacing System

4px grid: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`

## 13.4 Component Library

- **AppButton** — Primary, secondary, ghost, disabled variants
- **AppInput** — Text, phone (+249 prefix), search, password
- **AppCard** — Product card, order card, address card
- **StatusBadge** — Color-coded for order statuses
- **PriceTag** — Formatted SDG with locale-aware numerals
- **LoadingSkeleton** — Shimmer placeholder
- **OfflineBanner** — Top-of-screen offline indicator
- **EmptyState** — Empty cart, no orders, no search results
- **ErrorState** — Network error, generic error with retry

---

# 14. Internationalization

## 14.1 Supported Languages

| Code | Language | Direction | Default | Font |
|---|---|---|:---:|---|
| `ar` | Arabic | RTL | ✓ | Cairo |
| `en` | English | LTR | | Poppins |

## 14.2 Translation Files Structure

```
shared/src/i18n/
├── ar.json       ← Shared Arabic strings
└── en.json       ← Shared English strings

mobile/lib/core/l10n/
├── ar.arb        ← Flutter Arabic
└── en.arb        ← Flutter English (auto-generated from ar.arb)

web/messages/
├── ar.json       ← Next.js Arabic
└── en.json       ← Next.js English
```

## 14.3 Key Translation Categories

| Category | Examples |
|---|---|
| **Navigation** | home, products, cart, orders, profile |
| **Auth** | login, register, OTP, forgot_password |
| **Products** | add_to_cart, in_stock, out_of_stock, reviews |
| **Cart/Checkout** | order_total, delivery_fee, place_order |
| **Payment** | bank_transfer, cash_on_delivery, upload_receipt |
| **Orders** | order_placed, shipped, delivered, cancelled |
| **Errors** | error_network, error_generic, error_unauthorized |
| **SMS Templates** | OTP, order confirmed, shipped, delivered, rejected |

## 14.4 RTL Implementation Rules

### Flutter
- ❌ Never: `EdgeInsets.only(left/right)`, `Alignment.centerLeft`, `TextDirection.ltr`
- ✅ Always: `EdgeInsetsDirectional`, `AlignmentDirectional`, automatic RTL via locale

### Web (Tailwind)
- ❌ Never: `ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`, `text-left`, `text-right`
- ✅ Always: `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`, `text-end`

---

# 15. Security & Privacy

## 15.1 Authentication Security

- **JWT Tokens**: Short-lived access tokens (15 min) + long-lived refresh tokens (30 days)
- **Refresh token rotation**: New refresh token issued on every refresh
- **Token storage**:
  - Mobile: `flutter_secure_storage` (Keychain on iOS, encrypted SharedPreferences on Android)
  - Admin: In-memory (not localStorage) for higher security
  - Web: Cookie-based with httpOnly + Secure flags
- **OTP rate limiting**: Max 5 OTP requests per 15 minutes per phone
- **Login rate limiting**: Max 10 attempts per 15 minutes per IP
- **Password hashing**: bcrypt with 12 rounds

## 15.2 Data Protection

- **HTTPS everywhere** (Cloudflare Full Strict SSL)
- **Input validation** on every API endpoint (class-validator)
- **SQL injection protection** via Prisma parameterized queries
- **XSS protection**: Sanitized inputs, React's default escaping
- **CSRF protection**: SameSite cookies, CSRF tokens for state-changing operations
- **Image upload validation**: File type, size, dimensions checked

## 15.3 Sensitive Data Handling

- **Receipt images**: Stored in private R2 bucket, accessed via signed URLs (1-hour expiry)
- **Password hashes**: Never returned in API responses
- **PII (Personally Identifiable Info)**: Phone numbers stored encrypted at rest (Phase 2)
- **Bank details**: Only the merchant's own bank info stored, never customer's

## 15.4 Privacy

- **Right to delete account**: User-initiated account deletion
- **Data retention**: Inactive accounts purged after 2 years (with notice)
- **Order data**: Retained 7 years for accounting compliance
- **Cookie policy**: Essential cookies only, no third-party tracking
- **GDPR-inspired practices**: Even though not legally required in Sudan

---

# 16. Performance Requirements

## 16.1 Mobile App

| Metric | Target | Critical For |
|---|---|---|
| App size (initial download) | < 15 MB | Sudan data costs |
| Cold start time | < 2 seconds | User patience |
| Time to interactive (3G) | < 3 seconds | Network reality |
| Frame rate | 60 fps | Premium feel |
| Crash-free rate | > 99.5% | Trust |

## 16.2 Website

| Metric | Target | Tool |
|---|---|---|
| Lighthouse mobile score | > 80 | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s on 3G | Web Vitals |
| First Input Delay (FID) | < 100ms | Web Vitals |
| Cumulative Layout Shift (CLS) | < 0.1 | Web Vitals |
| Time to First Byte (TTFB) | < 500ms | Web Vitals |

## 16.3 Backend API

| Metric | Target |
|---|---|
| p95 response time | < 500ms |
| p99 response time | < 1000ms |
| Uptime SLA | 99.5% |
| Max concurrent users | 500 (Phase 1), 10,000 (Phase 2) |

## 16.4 Image Optimization

| Rule | Specification |
|---|---|
| Format | WebP (always) |
| Max file size | 200 KB |
| Max dimensions | 1200px width |
| Compression quality | 80% (reduce to 60% if needed) |
| Lazy loading | Below-the-fold images |
| Progressive loading | Blur placeholder → sharp |

---

# 17. Goals, Metrics & KPIs

## 17.1 Business Goals

| Goal | Target | Timeline |
|---|---|---|
| Launch fully functional platform | All 3 products live | Month 3 |
| Registered customers | 1,000 | Month 3 |
| Registered customers | 5,000 | Month 6 |
| Monthly orders | 500+ | Month 6 |
| Customer satisfaction (CSAT) | > 80% | Month 6 |
| App Store rating | > 4.3 ⭐ | Month 6 |

## 17.2 Operational KPIs

| KPI | Target | Why |
|---|---|---|
| Cart abandonment rate | < 40% | Industry benchmark |
| Average order value | 15,000 SDG | Profitability |
| Repeat customer rate | > 30% | Loyalty indicator |
| Payment verification time | < 4 hours | Customer experience |
| Order fulfillment time | < 2 days | Delivery promise |
| Bank transfer rejection rate | < 5% | Process clarity |

## 17.3 Technical KPIs

| KPI | Target |
|---|---|
| Backend uptime | 99.5% |
| API p95 latency | < 500ms |
| App crash rate | < 0.5% |
| Mobile app load time (3G) | < 3s |
| Lighthouse score (web) | > 80 |

## 17.4 Tracking

- **Backend metrics**: Custom dashboard + logs
- **Mobile/Web analytics**: Privacy-friendly analytics (Plausible or self-hosted Umami)
- **Crash reporting**: Sentry (free tier)
- **Uptime monitoring**: UptimeRobot (free)

---

# 18. Development Roadmap

## 18.1 Phase 1 — MVP (Months 1–3)

### Month 1: Foundation
- Week 1-2: Backend setup, database schema, auth flow
- Week 3-4: Core APIs (products, cart, orders), Cloudflare R2 integration

### Month 2: Customer Experience
- Week 5-6: Flutter mobile app (35 screens)
- Week 7-8: Next.js website (23 pages)

### Month 3: Admin & Launch Prep
- Week 9-10: Admin dashboard (15 pages)
- Week 11: Integration testing, bug fixes
- Week 12: Beta testing with 10-20 users, App Store/Play Store submission

## 18.2 Phase 2 — Launch & Optimize (Months 4–6)

- Public launch with marketing push
- Product reviews + ratings feature
- Push notifications
- Promo codes
- Mobile money integration (Zain Cash, MTN)
- Performance optimization based on real usage
- First 100 orders processed
- Customer feedback incorporated

## 18.3 Phase 3 — Growth (Months 7–12)

- Expand to Port Sudan and Kassala
- Delivery agent mobile app
- Loyalty program
- Improved analytics for admin
- Localization for other Sudanese cities
- Approach 500+ monthly orders

## 18.4 Build Strategy with Claude Code

The project will be built using Claude Code with autonomous agents for each phase:

| Phase | Agent | Deliverable |
|---|---|---|
| Phase 1 | `phase1-shared` | Shared package (constants, types, i18n) |
| Phase 2 | `phase2-backend` | Complete NestJS API |
| Phase 3 | `phase3-database` | Prisma schema + seed |
| Phase 4 | `phase4-flutter` | Mobile app (35 screens) |
| Phase 5 | `phase5-web` | Website (23 pages) |
| Phase 6 | `phase6-admin` | Admin dashboard (15 pages) |
| Phase 7 | `phase7-infra` | Docker + Nginx + deployment |

---

# 19. Team & Resources

## 19.1 Recommended Team

| Role | Count | Responsibility |
|---|:---:|---|
| **Project Lead** | 1 | You — overall direction, decisions |
| **Backend Engineer** | 1-2 | NestJS API, database, infrastructure |
| **Mobile Engineer** | 1 | Flutter app for iOS + Android |
| **Frontend Engineer** | 1 | Website (Next.js) + admin (React) |
| **UI/UX Designer** | 1 | Bilingual designs, user research |
| **QA Tester** | 1 (PT) | Test on low-end Android, Arabic UI |
| **Operations Manager** | 1 | Order processing, customer support |

## 19.2 External Services Budget (Monthly)

| Service | Phase 1 | Phase 2 |
|---|---:|---:|
| Hetzner VPS (4GB RAM) | $20 | $40 |
| Cloudflare R2 storage | $5 | $15 |
| Africa's Talking SMS | $30 | $100 |
| Firebase (free tier) | $0 | $0 |
| Domain (.sd) | $30/year | $30/year |
| Apple Developer account | $99/year | $99/year |
| Google Play Console | $25 one-time | — |
| Sentry (error tracking) | $0 (free) | $26 |
| **Total monthly** | **~$60** | **~$200** |

## 19.3 Tools

| Purpose | Tool |
|---|---|
| Code editor | VS Code / Cursor |
| AI code assistant | Claude Code |
| Version control | GitHub (private repo) |
| Project management | Linear / GitHub Issues |
| Design | Figma |
| Communication | Slack / WhatsApp |
| Documentation | Notion / GitHub Wiki |

---

# 20. Risks & Mitigations

## 20.1 Critical Risks

| Risk | Impact | Likelihood | Mitigation |
|---|:---:|:---:|---|
| 🌐 Internet outages in Sudan | High | High | Offline-first design, SMS fallback for status updates |
| 💵 SDG hyperinflation | Medium | High | Admin can update prices instantly, optional USD reference |
| 🧾 Fraudulent bank receipts | Medium | Medium | Manual verification, pattern detection (Phase 2), COD as alternative |
| 🍎 Apple App Store rejection | High | Medium | Follow guidelines strictly, submit early, web PWA fallback |
| 🤝 Low online trust | Medium | High | Return policy visible, COD option, WhatsApp support, real photos |
| 🚚 Delivery reliability | High | Medium | Khartoum-only Phase 1, phone confirmation, clear ETAs |
| ⚖️ Cloud service access | High | Low | Use Sudan-confirmed services (Hetzner, Cloudflare) |
| ⚡ Power outages mid-checkout | Medium | High | LocalStorage persistence, resume-anywhere checkout |
| 📞 SMS deliverability issues | High | Medium | Africa's Talking has Sudan coverage; backup via WhatsApp |
| 💳 Sanctions affecting payments | Medium | Low | Already Sudan-local; no international gateways used |

## 20.2 Contingency Plans

- **If SMS fails**: Falls back to push notification + visible status in app
- **If R2 access blocked**: Switch to local S3-compatible storage
- **If Cloudflare blocked**: Use direct DNS + Let's Encrypt SSL
- **If currency too volatile**: Add USD reference for admin pricing decisions

---

# 21. Future Roadmap

## 21.1 Phase 4 (Year 2)

- Multi-vendor marketplace (sellers create their own stores)
- Sudan-wide delivery network
- Bartal credit/wallet system
- B2B wholesale module
- Arabic voice search
- AI product recommendations

## 21.2 Expansion Markets

After Sudan, potential expansion order:
1. **South Sudan** — similar context, smaller market
2. **Ethiopia** — large market, similar payment constraints
3. **Eritrea** — niche but underserved
4. **Chad** — regional adjacency

## 21.3 Long-term Vision

Build the **default e-commerce platform for the Horn of Africa** — a region where global platforms can't operate effectively due to payment and infrastructure constraints. Bartal can be the localized champion.

---

# 22. Appendix

## 22.1 Brand Name

**Bartal** (برتال) — Arabic for "portal" or "gateway"

- Pronounced: "bar-TAL"
- Domain: bartal.sd
- Subdomain structure:
  - bartal.sd → customer website
  - api.bartal.sd → backend API
  - admin.bartal.sd → admin dashboard
  - assets.bartal.sd → CDN (Cloudflare R2)

## 22.2 Glossary

| Term | Definition |
|---|---|
| **RTL** | Right-to-Left text direction (for Arabic) |
| **LTR** | Left-to-Right text direction (for English) |
| **COD** | Cash on Delivery |
| **SDG** | Sudanese Pound (currency code) |
| **OTP** | One-Time Password (for phone verification) |
| **FCM** | Firebase Cloud Messaging (push notifications) |
| **R2** | Cloudflare R2 (S3-compatible storage) |
| **SLA** | Service Level Agreement |
| **MVP** | Minimum Viable Product |
| **PII** | Personally Identifiable Information |
| **KPI** | Key Performance Indicator |
| **CSAT** | Customer Satisfaction score |
| **SSR** | Server-Side Rendering |
| **PWA** | Progressive Web App |
| **DXA** | Document XML Unit (Word doc measurement) |

## 22.3 Reference Documents

- `Bartal_AI_Agent.md` — Build instructions for AI agents
- `Bartal_Colors_Designer.html` — Visual color reference
- `Bartal_ClaudeCode_Config.md` — Claude Code configuration
- `Bartal_Skills_Hooks_MCP.md` — Claude Code skills setup
- `Bartal_Design_to_ClaudeCode.md` — Design handoff workflow
- `Bartal_Handoff_to_ClaudeCode.md` — Project handoff guide

## 22.4 Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| Mar 2026 | Use Flutter for mobile | Single codebase iOS+Android, large dev community |
| Mar 2026 | Use Next.js for web | SSR for SEO, fast on slow networks, RTL support |
| Mar 2026 | PostgreSQL over MongoDB | Relational data fits the model, transactions matter |
| Mar 2026 | Cloudflare R2 over AWS S3 | Free egress, faster in Africa |
| Mar 2026 | Africa's Talking for SMS | Confirmed Sudan coverage |
| Mar 2026 | Bank Transfer + COD only | No alternative in Sudan |
| Mar 2026 | Cairo + Poppins fonts | Modern, readable, Arabic-first |
| Mar 2026 | Navy + Gold palette | Trust + Sudanese cultural fit |

## 22.5 Sign-Off

This PRD is approved for development. Any significant changes require team consensus.

| Role | Name | Date | Status |
|---|---|---|---|
| Project Lead | Mubarak | March 2026 | ✅ Approved |
| Technical Lead | _TBD_ | _Pending_ | ⏳ |
| Design Lead | _TBD_ | _Pending_ | ⏳ |

---

## 🚀 Ready for Development

**Next steps:**

1. ✅ PRD complete and approved
2. ✅ Designs ready (per designer handoff)
3. ⏳ Collect API keys (Cloudflare R2, Africa's Talking, Firebase)
4. ⏳ Set up Claude Code with skills, hooks, and MCP
5. ⏳ Start Phase 1 (shared package) with Claude Code
6. ⏳ Continue through Phases 2-7 autonomously

**The Bartal team is ready to build Sudan's most trusted e-commerce platform.**

---

*Bartal (برتال) — Product Requirements Document · Final v2.0 · March 2026*
*Built with care for the Sudan market 🇸🇩*
