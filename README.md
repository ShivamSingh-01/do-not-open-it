# 💌 Happy 22nd Birthday, Ankita — Interactive Digital Experience

A handcrafted, intimate, and magical interactive 22nd birthday website for **Ankita**, built with React, Vite, TypeScript, romantic stationery design aesthetics, Web Audio API sound synthesis, and mobile-first responsive interactions.

---

## 🌟 Features & Experience Flow

1. **Chapter 1: 22 Little Reasons I Love You**
   - Delicate blush and ivory romantic stationery aesthetic with glowing ambient orbs and slowly drifting hearts.
   - Non-linear responsive grid of **22 interactive love note cards** (mobile 2-column, tablet 3-column, desktop 4-column).
   - Each card features a sealed keepsake look with wax stamps, ribbons, or floral badges, responsive hover/tap animations, and opens an intimate modal letter.
   - Discovered notes tracker: live counter `"X of 22 little love notes discovered"` with progress bar.
   - Milestone celebration banner when all 22 notes are explored, revealing the path to Chapter 2 (along with an accessible skip alternative).

2. **Chapter 2: Make a Wish 🎂**
   - Pastel pink multi-layer birthday cake with delicate frosting, pearls, and a realistic flickering candle flame.
   - Sequential romantic messages leading to an animated `3, 2, 1` countdown.
   - **Real Microphone Candle Blowing Detection** via Web Audio API frequency analysis (sustained breath/blow detection with automatic microphone stream cleanup upon completion).
   - Instant tap fallback button (`"Tap to blow out the candle ♡"`) if microphone access is denied or unavailable.
   - Smoke curls upward, candle glow dims, glowing heart particles burst, and the wish is made.

3. **Chapter 3: The Big Birthday Reveal 🎉**
   - Full-screen celebratory reveal with radiant shimmer typography: **"HAPPY 22ND BIRTHDAY"** & **"ANKITA ♡"**.
   - Lightweight, 60fps canvas confetti and floating heart bursts.
   - Romantic celestial music-box instrumental arrangement of *Happy Birthday* synthesized directly in the browser via Web Audio API (zero external audio file dependencies).
   - Autoplay safe handling with an elegant `"Play our birthday song ♡"` button if browser autoplay is blocked, plus an always-visible floating sound/mute toggle.

4. **Chapter 4: One Last Little Secret... 🎁**
   - Handcrafted stationery letter with wax seal containing your heartfelt personal letter.
   - Adorable 3D-styled interactive present box with animated ribbons that opens on click to reveal: *"Psst... the gifts are on their way. This is only the beginning. 🎁"*.
   - 3 decorative keepsake gift cards (*"One for the smiles"*, *"One for the memories"*, *"One just because you're YOU"*).
   - `"Relive our little love story ↺"` button to replay the experience from the beginning without page reload.

5. **Delightful Details & Accessibility**
   - Gentle floating heart that tracks the desktop cursor (automatically disabled on mobile touch devices).
   - Safe-area insets support for iPhones with notch/dynamic island.
   - Reduced-motion toggle (`prefers-reduced-motion` compliance).
   - Zero horizontal overflow on mobile screens.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Curated Vanilla CSS Design System with CSS variables and keyframe animations
- **Audio & Detection**: Web Audio API (Music box synth, micro-chimes, and microphone turbulent breath detection)
- **Visuals**: Canvas 2D Confetti & floating hearts engine
- **Icons**: Lucide React

---

## 🚀 Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at the URL shown in terminal (usually `http://localhost:5173`).

3. **Build and preview production bundle locally**:
   ```bash
   npm run build
   npm run preview
   ```

---

## ✏️ Personalizing the Content

All 22 love notes, headings, letters, and audio configurations are stored in a single easy-to-edit file:

📁 **`src/config/birthdayContent.ts`**

- **Love Notes**: Edit any of the 22 items in `birthdayContent.loveNotes` (change `theme`, `message`, `preview`, or icons).
- **Final Letter**: Customize paragraphs in `birthdayContent.secretChapter.letterParagraphs`.
- **Custom Song**: If you want to use your own recorded audio or MP3 track, place your file into `public/audio/birthday-song.mp3` and set `customAudioPath: '/audio/birthday-song.mp3'` in `src/config/birthdayContent.ts`.

---

## 🌐 How to Deploy and Get Your Midnight Link

### Option A: Deploy to Vercel (Recommended & Easiest)

1. Push this project to GitHub (or install the Vercel CLI).
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New Project"** and import your GitHub repository.
4. Framework Preset will auto-detect as **Vite**.
5. Click **"Deploy"**.
6. In ~30 seconds, Vercel will give you a live production URL (e.g., `https://ankita-birthday.vercel.app`) ready to send to Ankita at midnight!

*Or via CLI:*
```bash
npx vercel
```

### Option B: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) and log in.
2. Drag and drop the `dist/` folder directly into Netlify Drop ([app.netlify.com/drop](https://app.netlify.com/drop)).
3. Or connect your GitHub repo — the included `netlify.toml` file will automatically configure the build command (`npm run build`) and publish directory (`dist`).
4. Netlify will provide your live HTTPS URL.

---

## ❤️ Made for Ankita's 22nd Birthday
Wishing Ankita a magical, unforgettable 22nd birthday celebration!
