# Auto-Sage — AI-Powered Car Maintenance App

**Next.js Full-Stack · PWA · Privacy-First**

## Goal

Build a PWA that helps users diagnose **basic car maintenance issues safely at home**, escalates advanced issues to professional repair shops, supports **AI photo triage**, and **does not store images or location data**.

## Tech Stack

- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS
- Server Actions & Route Handlers
- PWA (Service Worker)
- LocalStorage / IndexedDB (device-local only)
- OpenAI (text + image)
- Yelp API (server-side proxy)

## Core Constraints (Non-Negotiable)

- ❌ No user accounts (device-local only)
- ❌ No image storage
- ❌ No location storage
- ❌ No unsafe DIY advice (brakes, airbags, fuel, steering, HV EV)
- ✅ Escalate to professionals when uncertain
- ✅ AI must return structured JSON only

## Project Initialization

```bash
npx create-next-app auto-sage --typescript --tailwind --eslint --app
cd auto-sage
npm install zod idb uuid
```

## Directory Structure

```txt
app/
  layout.tsx
  page.tsx
  garage/page.tsx
  chat/page.tsx
  api/diagnose/route.ts
  api/shops/route.ts
components/
  VehicleSelector.tsx
  ChatUI.tsx
  DiagnosticCard.tsx
  PhotoUpload.tsx
lib/
  vehicleCatalog.ts
  aiPrompt.ts
  storage.ts
  safety.ts
  yelp.ts
types/diagnostic.ts
public/manifest.json
public/sw.js
```

## Build Order

1. Vehicle selection & local storage
2. Chat UI with mock diagnostics
3. AI diagnostics + safety guardrails
4. Photo triage
5. Yelp referrals
6. Push notifications
