# Auto-Sage - AI-Powered Car Maintenance Assistant

**Privacy-First PWA for Safe Car Diagnostics**

![License](https://img.shields.io/badge/license-Non--Commercial-red.svg)
![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)

## 🚗 Overview

Auto-Sage is an AI-powered Progressive Web App (PWA) that helps users diagnose basic car maintenance issues safely at home while escalating advanced problems to professional repair shops. Built with privacy-first principles—no user accounts, no image storage, no location tracking.

## ✨ Features

- **🔒 Privacy-First**: All data stored locally on device (IndexedDB)
- **🤖 AI Diagnostics**: OpenAI-powered car issue analysis
- **📸 Photo Triage**: Analyze car issues via photos (not stored)
- **🛡️ Safety Guardrails**: Blocks unsafe DIY advice (brakes, airbags, fuel, etc.)
- **🏪 Repair Shop Finder**: Yelp integration for nearby mechanics
- **📱 PWA**: Installable, works offline
- **🔔 Local Notifications**: Maintenance reminders (device-only)

## 🚫 What Auto-Sage Does NOT Do

- ❌ No user accounts or authentication
- ❌ No server-side image or location storage
- ❌ No unsafe DIY advice for critical systems:
  - Brakes, airbags, fuel systems
  - Steering, high-voltage batteries
  - Safety-critical components

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB (via `idb`)
- **AI**: OpenAI API (text + vision)
- **Maps**: Google Places API
- **PWA**: Service Workers

## 📦 Installation

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/auto-sage.git
cd auto-sage
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

Get your API keys:

- **OpenAI**: https://platform.openai.com/api-keys
- **Google Places**: https://console.cloud.google.com/apis/library/places

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Vercel (Recommended)

```bash
vercel
```

Set environment variables in Vercel dashboard:

- `OPENAI_API_KEY`
- `GOOGLE_PLACES_API_KEY`

### Other Platforms

Deploy as a standard Next.js app. Ensure environment variables are configured.

## 📁 Project Structure

```
auto-sage/
├── src/app/
│   ├── api/
│   │   ├── diagnose/route.ts    # AI diagnostic endpoint
│   │   └── shops/route.ts        # Yelp proxy endpoint
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main app page
├── components/
│   ├── VehicleSelector.tsx      # Vehicle management
│   ├── ChatUI.tsx               # Chat interface
│   ├── DiagnosticCard.tsx       # Diagnostic results
│   ├── PhotoUpload.tsx          # Image capture
│   └── ShopFinder.tsx           # Repair shop search
├── lib/
│   ├── storage.ts               # IndexedDB utilities
│   ├── aiPrompt.ts             # AI prompt engineering
│   ├── safety.ts               # Safety guardrails
│   ├── vehicleCatalog.ts       # Vehicle data
│   ├── yelp.ts                 # Yelp API client
│   └── pwa.ts                  # Service worker utils
├── types/
│   └── diagnostic.ts           # TypeScript types
└── public/
    ├── manifest.json           # PWA manifest
    └── sw.js                   # Service worker
```

## 🔐 Privacy & Security

### Data Storage

- **Local Only**: All vehicle data stored in browser's IndexedDB
- **No Server Storage**: Images analyzed in-memory, never saved
- **No Location Tracking**: GPS coordinates used only for API calls

### Safety Features

- **Hardcoded Blacklist**: Unsafe repairs flagged automatically
- **Professional Escalation**: Complex issues routed to mechanics
- **Structured Responses**: AI constrained to JSON format

## 🧪 Testing

```bash
npm run build    # Type checking and build
npm run lint     # ESLint
```

## ⚠️ Disclaimer

**Auto-Sage is for informational purposes only.** Always consult a certified mechanic for:

- Safety-critical systems
- Complex repairs
- Warranty-covered vehicles
- When uncertain

Never attempt repairs beyond your skill level.

## 📄 License

This project is licensed under a **Non-Commercial License**.

- ✅ **Allowed**: Personal use, education, research, modifications
- ❌ **Prohibited**: Commercial use, selling, paid services, business operations
- 📧 **Commercial licensing**: Contact for commercial use inquiries

See [LICENSE](LICENSE) file for full terms.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Yelp for Fusion API
- Next.js team

---

**Built with ❤️ by The NeuroLink Consulting Inc. team for safer DIY car maintenance**
