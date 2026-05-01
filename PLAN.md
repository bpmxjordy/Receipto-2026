# Receipto — Build Plan

> Living document. Tick items as we complete them. The "Status snapshot"
> section near the top tells us at a glance where we are. Add notes inline
> under any task as we go (use blockquotes so it's easy to scan).

---

## Status snapshot

- **Current phase:** Phase 0 — Foundations (not started)
- **Last completed:** Decisions D1–D6 agreed
- **Next up:** Phase 0.2 — repo + tooling setup
- **Blocked on:** Nothing

---

## What we are building (MVP scope)

A solo-built iOS portfolio app that lets a user:

1. Sign in (email/password + Google).
2. Capture a receipt manually by taking a photo (or picking one from the
   library). OCR extracts the line items.
3. Confirm/edit the parsed items on a review screen.
4. Save the receipt — the app assigns each item a **category** and a
   **CO₂ value** consistently (same item across receipts always lands in
   the same category).
5. Browse history of receipts.
6. Open a receipt to see line-by-line categories + per-item CO₂.
7. View simple analytics: a category pie chart, total spend, total CO₂.

Out of MVP (deferred — listed in "Future phases"):

- NFC tap capture (no retailer partners yet)
- Personal planet / Tamagotchi animation
- "Buy instead" alternative suggestions
- Points + rewards shop
- Social / friends / leaderboards
- Samsung smart-device integration
- Journey / shop-locality view

---

## Decisions agreed

| Code | Decision | Choice |
| ---- | -------- | ------ |
| D1   | Mobile framework | Expo (React Native) with custom dev client; iOS first |
| D2   | Backend | **Firebase** (Auth + Firestore + Cloud Functions + Storage) |
| D3   | Web hosting | **Vercel** for marketing site, privacy policy, simulated-retailer tool, future admin dashboard |
| D4   | Categoriser | **Gemma 3n on-device** via MediaPipe LLM Inference (iOS), from the start. (You said "Gemma 4" — the latest shipping family is Gemma 3 / Gemma 3n. Confirm if a newer release happens.) |
| D5   | OCR | Apple Vision via a small native module |
| D6   | Charts | Victory Native XL |
| D7   | Apple Developer Program | **Defer until Phase 10.** Phases 0–3 run in Expo Go (no Mac needed). Phase 4 onward we build locally on your Mac with `expo run:ios --device` using a free Apple ID + Xcode personal team (7-day re-sign, fine for solo dev). Pay $99 only when we want TestFlight / App Store. |

---

## Tech stack

| Layer            | Choice                                                                 |
| ---------------- | ---------------------------------------------------------------------- |
| Mobile           | Expo SDK (latest), React Native, TypeScript, Expo Router               |
| Custom native    | Apple Vision OCR module (Phase 4), MediaPipe LLM module (Phase 5)      |
| State (server)   | TanStack Query (`@tanstack/react-query`)                               |
| State (client)   | Zustand                                                                |
| Forms            | `react-hook-form` + `zod`                                              |
| Styling          | NativeWind (Tailwind for RN) — quick to match the green design system  |
| Charts           | Victory Native XL                                                      |
| Auth             | Firebase Auth (email/password + Google + Sign in with Apple in Phase 10) |
| DB               | Cloud Firestore                                                        |
| Storage          | Firebase Storage (receipt images, optional Gemma model file)           |
| Server logic     | Firebase Cloud Functions (TypeScript, 2nd gen)                         |
| Web              | Next.js on Vercel — marketing, privacy/terms, simulated-retailer tool, admin |
| LLM              | Gemma 3n (E2B variant ~3GB) via MediaPipe LLM Inference, on-device iOS |
| Build / sign     | Local Xcode builds on Mac (free, Phases 4–9); EAS Build + EAS Submit at Phase 10 with paid account |
| Crash + analytics| Sentry (free tier)                                                     |
| Local dev        | Node 20 LTS, pnpm, Firebase CLI                                        |

---

## Folder layout

```
D:\Receipto-2026\
  PLAN.md                  ← this file
  README.md
  Starting point\          ← deck + design refs (already there)
  apps\
    mobile\                ← Expo app
      app\                 ← Expo Router screens
      src\
        components\
        features\
          auth\
          receipts\
          analytics\
          settings\
        lib\               ← firebase client, query client, utils
        native\            ← OCR + LLM module bindings
        theme\             ← colors, typography, NativeWind config
      assets\              ← icons, fonts, planet sprites later
      app.config.ts
      eas.json
    web\                   ← Next.js on Vercel
      app\                 ← App Router
        (marketing)\       ← / , /privacy, /terms
        retailer\          ← simulated-retailer tool (auth gated)
        admin\             ← canonical-items review UI (Phase 5.3)
  packages\
    shared\                ← types shared between mobile, functions, web
      src\types\           ← zod schemas: Receipt, Item, Category, ...
      src\normalise.ts     ← shared normalisation logic
  firebase\
    functions\             ← Cloud Functions (TS)
      src\
        categorise.ts      ← onCall: cache lookup; LLM call lives on-device
        onReceiptCreate.ts ← onWrite trigger: roll up monthly aggregates
    firestore.rules
    storage.rules
    firestore.indexes.json
    seed\                  ← scripts to seed categories + canonical_items
  scripts\
    simulate-retailer\     ← node script to inject fake receipts (Phase 4.5)
```

---

## Data model (Firestore)

Firestore is document-based, so the model is a small set of top-level and
sub-collections. Document IDs are chosen for fast lookup wherever
possible.

```
users/{uid}                                    -- profile doc
  displayName, avatarUrl, createdAt

categories/{categoryId}                        -- public read
  parentId, displayName, colorHex, sortOrder
  -- categoryId is the slug, e.g. 'groceries.dairy'

canonicalItems/{itemId}                        -- public read; cloud-function write only
  normalisedName       (also used as a lookup index)
  displayName
  categoryId
  co2KgPerKg, co2KgPerUnit
  source: 'seeded' | 'llm' | 'human'
  approved: bool
  firstSeenAt
  -- itemId == normalisedName so exact lookup is doc.get(itemId)

canonicalItemAliases/{aliasNormalised}         -- public read; cloud-function write only
  canonicalItemId
  -- aliasNormalised is the doc id for instant lookup

users/{uid}/receipts/{receiptId}
  retailerName
  retailerLocation
  purchasedAt
  totalPence
  currency ('GBP')
  source: 'manual_photo' | 'simulated' | 'nfc'
  rawImagePath                                 -- gs:// path
  ocrRawText
  totalCo2Kg                                   -- denormalised; updated on save
  createdAt

users/{uid}/receipts/{receiptId}/items/{itemId}
  canonicalItemId  (nullable until categorised)
  rawName
  qty, unit
  pricePence
  categoryId       (denormalised for queries)
  co2Kg
  position

users/{uid}/monthly/{YYYY-MM}                  -- updated by onReceiptCreate trigger
  spendByCategory: { categoryId -> pence }
  co2ByCategory:   { categoryId -> kg }
  totalSpendPence
  totalCo2Kg
  receiptCount
```

**Why doc-id == normalised name:** with Firestore, looking up "is this
canonical name known?" becomes a single `getDoc()` (no query, no index,
no cost beyond 1 read). Same for aliases.

**Security rules sketch:**
- `users/{uid}/**` — read/write only when `request.auth.uid == uid`
- `categories/**` — read for any authenticated user; no client write
- `canonicalItems/**`, `canonicalItemAliases/**` — read for any authenticated
  user; **no client write** (only cloud functions write, via admin SDK)
- `monthly/**` — read only (computed by trigger)

This means the client cannot directly insert a canonical item — the
mobile app calls a Callable Cloud Function `submitCategorisation`, which
validates and writes. This prevents one user spamming bogus categories
into the shared registry.

---

# Phase 0 — Foundations

Goal: empty repo → green dev environment, an iPhone running a "hello
world" build of the app via Expo Go (no Apple Developer account yet),
Firebase project up.

### 0.1 — Decisions
- [x] D1–D7 confirmed (above).

### 0.2 — Repo + tooling

- [ ] `git init` in `D:\Receipto-2026\`. Add `.gitignore` (Node, Expo,
      macOS, Firebase, EAS, env files).
- [ ] Initial commit of `PLAN.md` + `Starting point/`.
- [ ] Add `README.md` with one-paragraph description and a "How to run"
      section we'll fill in.
- [ ] Set up pnpm workspace at root (`pnpm-workspace.yaml`) listing
      `apps/*`, `packages/*`, `firebase/functions`.
- [ ] Add root `package.json` with shared scripts (`lint`, `typecheck`).
- [ ] Add `prettier`, `eslint` (typescript-eslint), shared configs at root.
- [ ] (Optional) GitHub repo — push private repo for remote backup.

### 0.3 — Firebase project

- [ ] Create a Firebase project (free Spark plan to start; we'll move to
      Blaze when Cloud Functions need it).
- [ ] Enable Authentication (Email/password + Google).
- [ ] Create the Firestore database in `europe-west2` (UK latency) in
      Production mode (locked rules by default; we'll write rules next).
- [ ] Create a Storage bucket in the same region.
- [ ] Install Firebase CLI (`npm i -g firebase-tools`), `firebase login`,
      `firebase init` choosing Firestore, Functions (TS), Storage,
      Emulators (Auth, Firestore, Functions, Storage).
- [ ] Confirm `firebase emulators:start` works locally.

### 0.4 — Mobile shell

- [ ] `pnpm create expo-app apps/mobile` (TypeScript template, Expo Router).
- [ ] Add NativeWind, `@tanstack/react-query`, `zustand`, `zod`,
      `react-hook-form`, `@react-native-firebase/app`, `@react-native-firebase/auth`,
      `@react-native-firebase/firestore`, `@react-native-firebase/storage`,
      `expo-secure-store`, `expo-image-picker`, `expo-camera`,
      `expo-haptics`, `react-native-svg`, `victory-native`.
- [ ] Configure dark/light theme tokens matching the deck (greens
      `#7FB582`, light bg `#EAF5EC`, etc — colours picked from screens).
- [ ] Set bundle id `com.jordancartwright.receipto`, app name "Receipto"
      in `app.config.ts`.
- [ ] **For now: install Expo Go on your iPhone from the App Store.**
      Run `pnpm start` on the laptop, scan the QR with the iPhone camera.
      No paid account needed yet. (`@react-native-firebase/*` packages
      will not work in Expo Go — see note below; we'll use the Firebase
      JS SDK during the Expo Go phases and switch to RN Firebase when we
      build a custom dev client in Phase 4.)
- [ ] Initial choice for Phases 0–3: use the **Firebase JS SDK** (`firebase` package, the modular v9+ API) so Expo Go works. Wrap it in `src/lib/firebase.ts` so we can swap to RN Firebase later without touching call sites.
- [ ] Confirm the app opens in Expo Go and shows a "Hello Receipto" screen.

> **Why Firebase JS SDK first, RN Firebase later?** RN Firebase needs
> custom native modules and won't run in Expo Go. JS SDK works in Expo Go,
> works in custom builds, slightly heavier in production. We swap to RN
> Firebase (faster, native auth) at Phase 4 when we drop Expo Go anyway.

### 0.5 — Shared types package

- [ ] Create `packages/shared` with zod schemas for `Receipt`,
      `ReceiptItem`, `Category`, `CanonicalItem`. Used by mobile, web,
      and cloud functions.

### 0.6 — Web shell on Vercel

- [ ] `pnpm create next-app apps/web --ts --tailwind --app --no-src-dir`
- [ ] Hello-world landing page.
- [ ] Connect repo to Vercel; auto-deploy on push.
- [ ] Buy/connect a domain (optional now, mandatory before App Store
      submission for the privacy policy URL — `receipto.app` if available,
      else a subdomain).

**Acceptance criteria for Phase 0:** Jordan can run `pnpm dev` on the
laptop, the iPhone Expo Go app shows the Receipto placeholder home
screen, the Vercel marketing page resolves on its public URL, and
Firebase emulators run cleanly.

---

# Phase 1 — Firestore schema + security rules + seed

Goal: the data model exists; an authenticated user can insert and read
their own receipts; canonical items are pre-populated.

### 1.1 — Security rules

- [ ] Write `firebase/firestore.rules` per the model above. Test with the
      emulator's rules unit-testing harness
      (`@firebase/rules-unit-testing`):
      - Anonymous user cannot read anything.
      - User A cannot read User B's `users/{uid}/**`.
      - Any authenticated user can read `categories`, `canonicalItems`.
      - No client can write `canonicalItems` or `canonicalItemAliases`.
- [ ] Write `firebase/storage.rules` so users can only read/write within
      their own `users/{uid}/...` prefix.
- [ ] Add a CI check (later) that runs the rules tests.

### 1.2 — Indexes

- [ ] Compose `firestore.indexes.json` for queries we know we need:
      - `users/{uid}/receipts` ordered by `purchasedAt desc`
      - collection group `items` filtered by `categoryId` + ordered by
        `purchasedAt` (for analytics drill-down)
- [ ] Deploy: `firebase deploy --only firestore:indexes`.

### 1.3 — Seed data

- [ ] `firebase/seed/categories.ts` — seed ~30 categories. Top-level:
      Groceries, Household, Electronics, Subscriptions, Eating out,
      Transport, Other. Sub-categories under Groceries: Dairy, Meat,
      Fish, Produce, Bakery, Beverages, Dry goods, Frozen, Confectionery,
      Condiments, Alcohol.
- [ ] `firebase/seed/canonicalItems.ts` — seed ~100 common UK supermarket
      items so the on-device LLM rarely fires on day-one usage. Sources:
      DEFRA CO2 factors for the food items, sensible defaults for non-food.
      Mark `source='seeded'`, `approved=true`. Doc id = normalised name.
- [ ] Run seeds with `firebase firestore:import` or a small `tsx` script
      using the admin SDK against the cloud project (and the emulators
      for local).

**Acceptance criteria for Phase 1:** rules tests pass; opening the
Firestore console shows seeded categories and canonical items; an
authenticated user via the JS SDK can write a receipt under their own
`users/{uid}/receipts/...` and read it back, and cannot touch another
user's data.

---

# Phase 2 — Mobile app shell + design system

Goal: navigation skeleton matches the deck, every screen is a placeholder.

### 2.1 — Theming

- [ ] Define tokens in `src/theme/colors.ts` matching the screens.
- [ ] Configure NativeWind tailwind config to use those tokens.
- [ ] Add Inter as primary font; system fallback. Type scale.

### 2.2 — Tab bar

- [ ] Custom bottom tab bar matching `iPhone 14 - 34.png`. Tabs:
      History (clock), Home (house), planet centre button, Scan (camera),
      Settings (gear). The centre planet/world is "My world"; the camera
      "Scan" tab opens the capture flow.
- [ ] Top-right user avatar pill.

### 2.3 — Reusable primitives

- [ ] `<Screen>` (safe area + scroll), `<Card>`, `<Button>`, `<TextField>`,
      `<Tag>`, `<HeaderBar>`, `<EmptyState>`.

**Acceptance criteria for Phase 2:** open the app in Expo Go, tab between
five empty screens that look like the deck.

---

# Phase 3 — Auth flow

Goal: real login, register, persistent session — running in Expo Go on
your iPhone, no Apple Developer account yet.

### 3.1 — Login screen

- [ ] Build login per `iPhone 14 - 33.png` (email, password, Login,
      Google sign-in, "Create one" link).
- [ ] Error states, loading states.
- [ ] Google sign-in via `@react-native-google-signin/google-signin` —
      verify it works in Expo Go (it does, with a config plugin).

### 3.2 — Register screen

- [ ] Email, password, confirm, display name. Back-link to login.

### 3.3 — Session

- [ ] Persistence handled by the Firebase SDK with AsyncStorage. Verify
      a kill-and-relaunch keeps the user signed in.
- [ ] Auth gate: unauthenticated → auth stack; authenticated → tabs.
- [ ] Sign-out from Settings stub.

### 3.4 — Profile bootstrapping

- [ ] On first sign-in, create the `users/{uid}` profile doc client-side
      (idempotent upsert using `setDoc` with `merge: true`).

**Acceptance criteria for Phase 3:** sign up on the iPhone via Expo Go,
kill the app, reopen, still signed in.

> **End of Expo Go phase.** Before Phase 4 we need to:
> 1. Move dev workflow to your **Mac** for native builds. Daily JS work
>    can stay on Windows — only the install step needs the Mac.
> 2. On the Mac: install Xcode, sign in with your free Apple ID, plug in
>    the iPhone, run `npx expo run:ios --device` to install a custom
>    dev client signed with your personal team. (Free; 7-day re-sign.)
> 3. Switch Firebase JS SDK calls to `@react-native-firebase/*` (same
>    API surface in our `src/lib/firebase.ts` wrapper) for native auth +
>    Firestore.
> 4. The $99 Apple Developer Program is **not** needed yet — we only
>    pay at Phase 10 (TestFlight / App Store).

---

# Phase 4 — Manual receipt capture

Goal: take a photo of a paper receipt, OCR it on-device, review parsed
items, save to Firestore.

### 4.1 — Custom dev client on Mac (free)

- [ ] Pull the repo on your Mac (or use a shared drive).
- [ ] Install Xcode + Command Line Tools; sign into Xcode with your
      free Apple ID; let Xcode register your iPhone as a dev device.
- [ ] In `apps/mobile/ios/Receipto.xcworkspace`, set the team to your
      personal team and accept the 7-day signing constraint.
- [ ] `npx expo run:ios --device` — builds and installs a custom dev
      client onto the iPhone over cable.
- [ ] Confirm hot reload still works against the dev client when running
      `pnpm start` from either the Mac or Windows (both can serve metro
      to the same iPhone).
- [ ] Set a calendar reminder to re-run `expo run:ios --device` weekly
      to refresh the 7-day cert. (Once we hit Phase 10 and pay $99 this
      goes away.)

### 4.2 — Apple Vision OCR native module

- [ ] Create an Expo config plugin `apps/mobile/src/native/ocr/`
      wrapping `VNRecognizeTextRequest` (text-only mode, accurate).
- [ ] iOS only. Returns `{ blocks: [{ text, bbox, confidence }] }`.
- [ ] Add to dev client and rebuild.

### 4.3 — Capture screen

- [ ] Camera view (`expo-camera`) with a receipt-shaped guide overlay.
- [ ] Buttons: shutter, "use library" (`expo-image-picker`), torch.
- [ ] After capture: preview with retake / use-this.

### 4.4 — Receipt parser

- [ ] `parseReceipt(ocrBlocks)` in TS. Heuristics:
  - Detect retailer from top-of-receipt text (Tesco, Sainsbury's, Aldi,
    Lidl, Morrisons, M&S, Co-op, Waitrose, Asda).
  - Detect total (line containing "TOTAL" or "TOTAL TO PAY").
  - Detect date/time line (regex per retailer).
  - Item lines: pattern `<description><spaces><£price>`. Exclude
    "TOTAL", "VAT", "CHANGE", "CASH", "CARD", store address, footer.
  - Detect qty / weight if "x2" or "0.450 kg @ £..." style.
- [ ] Unit-test parser against 5 sample receipt images.

### 4.5 — Review screen

- [ ] List of parsed items, editable: name, qty, unit, price.
- [ ] Add/remove rows.
- [ ] Retailer + date + total at top, also editable.
- [ ] "Save" → uploads photo to Storage, writes the `receipts` +
      `receipt_items` docs, kicks off categorisation (Phase 5).

### 4.6 — Simulated retailer tool

- [ ] Build the tool as a page in `apps/web/app/retailer/` on Vercel.
- [ ] Form: pick a target user (by uid), retailer, date, line items.
      Submits via a Cloud Function authenticated with a custom claim.
- [ ] Generates a `receipts` doc with `source='simulated'` and triggers
      the same categorisation path.

**Acceptance criteria for Phase 4:** photograph a Tesco receipt on the
iPhone, the review screen shows roughly correct items, hit save, the
receipt appears in Firestore with raw items but no categories yet.

---

# Phase 5 — Categorisation pipeline (the hard one)

The drift problem: same item across receipts must always land in the
same category.

### 5.1 — Algorithm

Triggered after a receipt is saved. For each `receipt_item` with
`canonicalItemId == null`:

```
norm = normalise(item.rawName)
       # lowercase, strip qty/weight tokens, strip retailer SKU codes,
       # strip non-alphanumerics, collapse whitespace, singularise
       # e.g. "TESCO BEEF MINCE 500G *MULTI*" -> "beef mince"

# 1. Exact lookup
hit = getDoc(canonicalItems/{norm})
if hit.exists: assign(category, co2); continue

# 2. Alias lookup
hit = getDoc(canonicalItemAliases/{norm})
if hit.exists:
  resolved = getDoc(canonicalItems/{hit.canonicalItemId})
  assign; continue

# 3. Fuzzy lookup (client-side)
# We keep an in-memory list of all canonical normalisedNames (loaded once
# at app start, refreshed on app foreground). For misses, run trigram
# similarity locally; if best match > 0.85, write a new alias doc and
# assign that canonical's values.

# 4. Genuinely new -> on-device Gemma 3n
result = gemma.categorise({rawName, normalised: norm, retailer, surroundingItems})
# returns { displayName, categoryId, co2KgPerKg, co2KgPerUnit }

# Write canonical via Cloud Function (validates input, prevents abuse).
# The function uses a transaction with "create only if not exists"
# semantics so concurrent first-time encounters resolve cleanly.
callFn('submitCategorisation', { normalisedName: norm, ...result })
assign and continue
```

This guarantees: **once a normalised name is in `canonicalItems`, every
future occurrence by anyone resolves to the same category.** Gemma only
fires for truly novel inputs, and the result is cached for everyone.

- [ ] Implement `normalise()` in `packages/shared/src/normalise.ts`.
      Cover qty/weight tokens, common packaging suffixes, brand
      stripping, plural→singular.
- [ ] Unit-test `normalise()` on 50 raw item strings.
- [ ] Implement client-side fuzzy match using a small trigram library
      (`fast-fuzzy` or hand-rolled).
- [ ] Cloud Function `submitCategorisation` (`firebase/functions/src/`) —
      validates the payload (schema, sane CO2 ranges, category exists),
      uses a Firestore transaction to write `canonicalItems/{norm}` only
      if missing, returns the resolved doc.

### 5.2 — Gemma 3n on-device

- [ ] Native module `apps/mobile/src/native/llm/` wrapping MediaPipe
      Tasks GenAI (`MediaPipeTasksGenAI` framework on iOS).
- [ ] Decide model variant: **Gemma 3n E2B** (~3 GB on disk) for size,
      vs **E4B** (~4 GB) for accuracy. Start with E2B; benchmark on
      iPhone.
- [ ] **Model delivery:** on first launch after auth, download the
      `.task` model file from Firebase Storage to the app's documents
      directory, with a progress UI ("Setting up your assistant…"). If
      disk space < 5 GB, refuse and ask the user to free space.
- [ ] Implement `Categoriser` class with:
      ```ts
      categorise(input): Promise<{ displayName; categoryId; co2KgPerKg; co2KgPerUnit }>
      ```
- [ ] Few-shot prompt template with strict JSON output, temperature 0.
      Include the full list of `categoryId` values in the prompt so the
      model can only pick from the seeded set.
- [ ] Validate output against a zod schema; if parsing fails, retry once
      with a stricter "respond ONLY with JSON" preamble; if still fails,
      mark item as "needs review" rather than guessing.
- [ ] Benchmark: per-item latency on iPhone (target < 2 s with model
      already loaded), memory pressure, thermal behaviour after 20
      consecutive runs.

### 5.3 — CO₂ assignment

- [ ] When a canonical item has `co2KgPerKg`, compute `co2Kg` for the
      receipt item: `co2KgPerKg * (qty in kg)`. For unit-priced items
      use `co2KgPerUnit * qty` if present, else null.
- [ ] Seeded items get DEFRA-derived defaults; Gemma-assigned items get
      the model's estimate (range-checked, capped at sane bounds:
      0.01–60 kg CO₂/kg).

### 5.4 — Manual review (light)

- [ ] In Settings → "Items needing review", list items with null
      category. User can pick a category manually; the choice is sent
      via `submitCategorisation` with `source='human'` and `approved=true`.

### 5.5 — Admin dashboard (light)

- [ ] Page in `apps/web/app/admin/` (gated by a custom claim
      `admin: true`). Lists newly-added `source='llm'` canonical items so
      I can review them and bump `approved` to true or correct the
      category.

**Acceptance criteria for Phase 5:** save the same Tesco receipt twice;
both runs categorise identically. Save a receipt with a brand-new item;
Gemma categorises it once, second occurrence is a cache hit.

---

# Phase 6 — History + receipt detail

### 6.1 — History tab

- [ ] List receipts grouped by date, matching `iPhone 14 - 34.png`.
- [ ] Right-edge color strip = average CO₂ class for that receipt
      (green/yellow/red).
- [ ] Pull-to-refresh, infinite scroll (TanStack Query +
      Firestore pagination).
- [ ] Filter chip: by retailer, by date range, by category.

### 6.2 — Receipt detail

- [ ] Match `iPhone 14 - 41.png`. Top banner shows aggregate CO₂ verdict
      with "Learn more" affordance.
- [ ] Item list with category subtitle and per-item CO₂ colour bar.
- [ ] Long-press item → edit category (writes alias).

**Acceptance criteria for Phase 6:** every saved receipt is browsable end
to end on the iPhone with correct categories.

---

# Phase 7 — Analytics

### 7.1 — Pie + table

- [ ] Match `iPhone 14 - 62.png`. Filters: Overall / Past 30 days / Past
      7 days. Reads from `users/{uid}/monthly` aggregates (computed by
      the `onReceiptCreate` trigger).
- [ ] Pie of category share, table of category / percent / spent / habit.
- [ ] Total spend pill at top.

### 7.2 — Home screen weekly summary

- [ ] Match the green "Your week" card from `iPhone 14 - 64.png`: weekly
      CO₂, average CO₂, receipts count, money spent, eco points.
- [ ] Eco points formula for MVP = `floor(receiptCount * 10 + co2SavedVsAverage)`.
      Real points logic ships as a future phase.

**Acceptance criteria for Phase 7:** with a few seeded receipts, the pie
and weekly card show plausible numbers.

---

# Phase 8 — Settings

- [ ] Settings: profile (display name, avatar), account (email, change
      password), data (export receipts as CSV — nice portfolio detail),
      about, sign out.
- [ ] "Items needing review" entry from Phase 5.4.

---

# Phase 9 — Polish, error handling, accessibility

- [ ] Skeleton loaders on each screen.
- [ ] Friendly error toasts (no raw Firebase error codes).
- [ ] Empty states with the deck's R logo.
- [ ] Dynamic Type support; check at "Larger Text" sizes.
- [ ] VoiceOver labels on all interactive elements.
- [ ] Sentry wired up; verify a thrown error reports.
- [ ] Manual smoke test on the iPhone:
  - [ ] Cold start → login → tabs render < 2s
  - [ ] Capture → review → save → appears in History
  - [ ] Re-saving the same receipt produces identical categories
  - [ ] Offline capture: review screen works offline; save retries when
        back online (Firestore offline persistence)
  - [ ] Sign out and back in: session restores

---

# Phase 10 — App Store prep

- [ ] App Store Connect listing: name, subtitle, keywords, description,
      privacy details (we collect: email, receipt photos & text, device
      id; we don't sell or share).
- [ ] Privacy policy + terms hosted on Vercel (`apps/web/app/privacy`,
      `apps/web/app/terms`).
- [ ] App icons + screenshots (at least 6.7" iPhone). Use the deck art
      for hero shots.
- [ ] App Tracking Transparency: not needed unless we add ads/analytics
      that track across apps.
- [ ] **Sign in with Apple — required** because we offer Google sign-in.
      Add it before submission (`expo-apple-authentication`).
- [ ] EAS Submit a TestFlight build. Internal testing with friends.
- [ ] Address review feedback. Submit for review.

---

# Future phases (post-MVP)

### F1 — Personal planet
- Health score 0..100 from rolling 30-day CO₂ vs the user's baseline.
- Three planet states (vibrant / yellow / red) — Lottie or sprite frames.
- Replace the static centre tab icon with the live planet.

### F2 — Buy instead
- `alternatives` collection linking canonical items → suggested swaps.
- Match `iPhone 14 - 45.png`.

### F3 — Points + rewards
- `pointsLedger` subcollection. Earning rules: per receipt, per low-CO₂
  item, per alternative chosen.
- Rewards shop UI; placeholders only — no real gift card integration
  until there's traction.

### F4 — Social / friends / leaderboards
- Friend invites, leaderboard scopes (local/regional/global), weekly
  reset job (Cloud Scheduler + Function).

### F5 — Real NFC capture (when there's a retailer pilot)
- iOS Core NFC reader; read NDEF record carrying receipt id; deep link
  into the app.

### F6 — Samsung SmartThings device connect
- OAuth into SmartThings; pull device energy data; visualise.

### F7 — Android build
- EAS Android build, Play Console listing.

---

## Working agreement

- I work through phases top-to-bottom; each task has a checkbox, tick as
  we complete.
- After every phase, we run the acceptance criteria on your iPhone
  before starting the next.
- If we hit something that needs a decision, I add it to a "Decisions
  pending" subsection inside the current phase rather than guessing.
- Plans drift. If we change direction, we update this file as part of
  the same work, not after the fact.
