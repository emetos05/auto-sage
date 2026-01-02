# 🚀 Auto-Sage Quick Start Guide

## Step 1: Install Dependencies (Already Done ✓)

```bash
npm install
```

## Step 2: Set Up API Keys

1. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

2. Get your API keys:

   - **OpenAI**: https://platform.openai.com/api-keys
   - **Yelp**: https://www.yelp.com/developers/v3/manage_app

3. Edit `.env.local` and add your keys:
   ```env
   OPENAI_API_KEY=sk-...your-key...
   YELP_API_KEY=your-yelp-key
   ```

## Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 4: Test the App

### Add a Vehicle

1. Click "Add Vehicle"
2. Select Year, Make, Model
3. Optionally add VIN
4. Click "Save Vehicle"

### Start Diagnosis

1. Select your vehicle
2. Click "Start Diagnosis"
3. Type a car issue (e.g., "battery won't start")
4. View AI diagnostic results

### Upload Photo (Optional)

1. Click the 📷 camera button
2. Take/upload photo of the issue
3. Photo will be analyzed (not stored)

### Find Repair Shops

1. After receiving diagnosis
2. Click "Find Nearby Repair Shops"
3. Allow location access
4. View nearby mechanics from Yelp

## Test Safety Features

Try these to see safety blocks in action:

- "My brakes are squeaking" → Should escalate to professional
- "Airbag light is on" → Should block DIY advice
- "Battery terminals corroded" → Safe DIY with steps

## Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Don't forget to set environment variables in Vercel dashboard!

## 📁 Project Structure

```
auto-sage/
├── components/       # React components
├── lib/             # Utilities & business logic
├── src/app/         # Next.js pages & API routes
├── types/           # TypeScript definitions
└── public/          # Static assets & PWA files
```

## 🔒 Privacy Features

- ✅ All data stored locally (IndexedDB)
- ✅ Photos never saved (analyzed in memory)
- ✅ Location not tracked (only used for API)
- ✅ No user accounts or authentication

## 🛡️ Safety Features

- ✅ Blocks unsafe DIY (brakes, airbags, fuel, etc.)
- ✅ Escalates complex issues to professionals
- ✅ Structured AI responses (JSON-only)
- ✅ Prominent safety warnings

## 📝 Need Help?

- Read [BUILD_SUMMARY.md](BUILD_SUMMARY.md) for detailed info
- Check [README.md](README.md) for full documentation
- Review [Auto-Sage-Development-Plan.md](Auto-Sage-Development-Plan.md)

---

**Built with ❤️ for safer DIY car maintenance**
